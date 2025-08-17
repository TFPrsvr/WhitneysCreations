const User = require('../models/User.model');
const Project = require('../models/Project.model');
const Product = require('../models/Product.model');
const Suggestion = require('../models/Suggestion.model');
const mongoose = require('mongoose');

module.exports = {
  // Dashboard Analytics
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalProjects,
        totalProducts,
        totalSuggestions,
        newUsersThisMonth,
        activeUsersThisWeek,
        projectsCreatedThisMonth,
        userGrowthData,
        topCreators
      ] = await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Product.countDocuments(),
        Suggestion.countDocuments(),
        User.countDocuments({
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }),
        User.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        Project.countDocuments({
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }),
        // User growth over last 6 months
        User.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),
        // Top creators by project count
        Project.aggregate([
          {
            $group: {
              _id: '$user',
              projectCount: { $sum: 1 },
              lastActive: { $max: '$updatedAt' }
            }
          },
          { $sort: { projectCount: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              userId: '$_id',
              username: '$user.username',
              email: '$user.email',
              fullName: '$user.fullName',
              projectCount: 1,
              lastActive: 1
            }
          }
        ])
      ]);

      const roleDistribution = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const stats = {
        overview: {
          totalUsers,
          totalProjects,
          totalProducts,
          totalSuggestions,
          newUsersThisMonth,
          activeUsersThisWeek,
          projectsCreatedThisMonth
        },
        userGrowth: userGrowthData,
        roleDistribution,
        topCreators
      };

      res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      });
    }
  },

  // User Management
  getAllUsers: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        role = '',
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};
      
      if (search) {
        query.$or = [
          { username: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { first: new RegExp(search, 'i') },
          { last: new RegExp(search, 'i') }
        ];
      }

      if (role) query.role = role;
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        User.countDocuments(query)
      ]);

      // Get project counts for each user
      const userIds = users.map(user => user._id);
      const projectCounts = await Project.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: '$user', count: { $sum: 1 } } }
      ]);

      const projectCountMap = projectCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const usersWithStats = users.map(user => ({
        ...user,
        projectCount: projectCountMap[user._id] || 0
      }));

      res.status(200).json({
        success: true,
        users: usersWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          hasNextPage: skip + users.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  },

  // Get specific user details
  getUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await User.findById(userId).select('-password').lean();
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get user's projects, suggestions, and activity
      const [projects, suggestions, recentActivity] = await Promise.all([
        Project.find({ user: userId })
          .populate('product', 'name type')
          .sort({ updatedAt: -1 })
          .limit(10)
          .lean(),
        Suggestion.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Project.find({ user: userId })
          .select('name updatedAt status')
          .sort({ updatedAt: -1 })
          .limit(10)
          .lean()
      ]);

      const userStats = {
        totalProjects: await Project.countDocuments({ user: userId }),
        completedProjects: await Project.countDocuments({ user: userId, status: 'completed' }),
        totalSuggestions: await Suggestion.countDocuments({ user: userId }),
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      };

      res.status(200).json({
        success: true,
        user: {
          ...user,
          stats: userStats,
          recentProjects: projects,
          recentSuggestions: suggestions,
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user details',
        error: error.message
      });
    }
  },

  // Update user (role, status, etc.)
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      // Don't allow updating password through this endpoint
      delete updates.password;
      
      // Only superadmin can change roles to admin/superadmin
      if (updates.role && ['admin', 'superadmin'].includes(updates.role)) {
        if (!req.user.isSuperAdmin()) {
          return res.status(403).json({
            success: false,
            message: 'Only superadmin can assign admin roles'
          });
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  },

  // Impersonate user (superadmin only)
  impersonateUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!req.user.isSuperAdmin()) {
        return res.status(403).json({
          success: false,
          message: 'Only superadmin can impersonate users'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const targetUser = await User.findById(userId);
      
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Create impersonation token
      const JWT = require('jsonwebtoken');
      const impersonationToken = JWT.sign(
        { 
          _id: targetUser._id,
          username: targetUser.username,
          impersonatedBy: req.user._id,
          isImpersonation: true
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.cookie('jwt', impersonationToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000 // 1 hour
      });

      res.status(200).json({
        success: true,
        message: `Now impersonating ${targetUser.username}`,
        user: {
          _id: targetUser._id,
          username: targetUser.username,
          email: targetUser.email,
          first: targetUser.first,
          last: targetUser.last,
          role: targetUser.role,
          isImpersonation: true,
          originalAdmin: req.user.username
        }
      });
    } catch (error) {
      console.error('Error impersonating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to impersonate user',
        error: error.message
      });
    }
  },

  // System Health Check
  getSystemHealth: async (req, res) => {
    try {
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      // Check database response time
      const startTime = Date.now();
      await User.findOne().limit(1);
      const dbResponseTime = Date.now() - startTime;

      const health = {
        status: 'healthy',
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`
        },
        server: {
          uptime: `${Math.floor(uptime / 60)} minutes`,
          memoryUsage: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
          },
          nodeVersion: process.version
        },
        timestamp: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        health
      });
    } catch (error) {
      console.error('Error checking system health:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check system health',
        error: error.message
      });
    }
  },

  // Get system logs (simplified)
  getSystemLogs: async (req, res) => {
    try {
      const { level = 'all', limit = 100 } = req.query;

      // This is a simplified implementation
      // In production, you'd want to integrate with a proper logging service
      const logs = [
        {
          timestamp: new Date(),
          level: 'info',
          message: 'System health check completed successfully',
          source: 'system'
        },
        {
          timestamp: new Date(Date.now() - 300000),
          level: 'warning',
          message: 'High memory usage detected',
          source: 'system'
        },
        {
          timestamp: new Date(Date.now() - 600000),
          level: 'info',
          message: 'User authentication successful',
          source: 'auth'
        }
      ];

      res.status(200).json({
        success: true,
        logs: logs.slice(0, parseInt(limit))
      });
    } catch (error) {
      console.error('Error fetching system logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system logs',
        error: error.message
      });
    }
  }
};