const Project = require('../models/Project.model');
const Product = require('../models/Product.model');
const mongoose = require('mongoose');

module.exports = {
  // Create a new project
  createProject: async (req, res) => {
    try {
      const userId = req.user._id;
      const projectData = {
        ...req.body,
        user: userId
      };

      // Validate product exists
      if (projectData.product) {
        const product = await Product.findById(projectData.product);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: 'Product not found'
          });
        }
      }

      const project = new Project(projectData);
      await project.save();

      // Populate product data
      await project.populate('product', 'name type category');

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project
      });

    } catch (error) {
      console.error('Error creating project:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {})
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error.message
      });
    }
  },

  // Get all projects for authenticated user
  getUserProjects: async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        status,
        category,
        sortBy = 'modified',
        sortOrder = 'desc',
        limit = 50,
        page = 1,
        isTemplate
      } = req.query;

      const filters = {
        status,
        category,
        sortBy,
        sortOrder,
        limit: parseInt(limit),
        isTemplate: isTemplate === 'true' ? true : isTemplate === 'false' ? false : undefined
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) delete filters[key];
      });

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const projects = await Project.getUserProjects(userId, filters)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Project.countDocuments({ user: userId });

      res.status(200).json({
        success: true,
        projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProjects: total,
          hasNextPage: skip + projects.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Error fetching user projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
        error: error.message
      });
    }
  },

  // Get single project by ID
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      const project = await Project.findOne({ _id: id, user: userId })
        .populate('product', 'name type category images printAreas')
        .populate('duplicatedFrom', 'name user');

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Update last opened
      await project.updateLastOpened();

      res.status(200).json({
        success: true,
        project
      });

    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
        error: error.message
      });
    }
  },

  // Update project
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      // Don't allow changing user
      delete updates.user;

      const project = await Project.findOneAndUpdate(
        { _id: id, user: userId },
        updates,
        { new: true, runValidators: true }
      ).populate('product', 'name type category');

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        project
      });

    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error.message
      });
    }
  },

  // Delete project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      const project = await Project.findOneAndDelete({ _id: id, user: userId });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error.message
      });
    }
  },

  // Duplicate project
  duplicateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { name } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      const originalProject = await Project.findOne({ _id: id, user: userId });

      if (!originalProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const duplicatedProject = await originalProject.duplicate(userId, name);
      await duplicatedProject.populate('product', 'name type category');

      res.status(201).json({
        success: true,
        message: 'Project duplicated successfully',
        project: duplicatedProject
      });

    } catch (error) {
      console.error('Error duplicating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate project',
        error: error.message
      });
    }
  },

  // Create project version
  createProjectVersion: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { note } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      const project = await Project.findOne({ _id: id, user: userId });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      await project.createVersion(note);

      res.status(201).json({
        success: true,
        message: 'Version created successfully',
        version: project.versions[project.versions.length - 1],
        currentVersion: project.currentVersion
      });

    } catch (error) {
      console.error('Error creating project version:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create version',
        error: error.message
      });
    }
  },

  // Restore project version
  restoreProjectVersion: async (req, res) => {
    try {
      const { id, versionNumber } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
      }

      const project = await Project.findOne({ _id: id, user: userId });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      await project.restoreVersion(parseInt(versionNumber));

      res.status(200).json({
        success: true,
        message: 'Version restored successfully',
        project: {
          _id: project._id,
          elements: project.elements,
          currentVersion: project.currentVersion
        }
      });

    } catch (error) {
      console.error('Error restoring project version:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to restore version',
        error: error.message
      });
    }
  },

  // Search user projects
  searchProjects: async (req, res) => {
    try {
      const userId = req.user._id;
      const { q, category, status, limit = 20 } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = { category, status, limit: parseInt(limit) };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) delete filters[key];
      });

      const projects = await Project.searchUserProjects(userId, q.trim(), filters);

      res.status(200).json({
        success: true,
        query: q.trim(),
        projects,
        totalFound: projects.length
      });

    } catch (error) {
      console.error('Error searching projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search projects',
        error: error.message
      });
    }
  },

  // Get public templates
  getPublicTemplates: async (req, res) => {
    try {
      const { category, product, limit = 20 } = req.query;

      const filters = { category, product, limit: parseInt(limit) };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) delete filters[key];
      });

      const templates = await Project.getPublicTemplates(filters);

      res.status(200).json({
        success: true,
        templates
      });

    } catch (error) {
      console.error('Error fetching public templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error.message
      });
    }
  },

  // Get project statistics for user
  getProjectStats: async (req, res) => {
    try {
      const userId = req.user._id;

      const stats = await Project.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            draftProjects: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            },
            completedProjects: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            templates: {
              $sum: { $cond: ['$isTemplate', 1, 0] }
            },
            totalDuplicates: { $sum: '$duplicateCount' },
            avgComplexity: { $avg: '$metadata.totalElements' }
          }
        }
      ]);

      const categoryStats = await Project.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const recentActivity = await Project.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('product', 'name type');

      res.status(200).json({
        success: true,
        stats: stats[0] || {
          totalProjects: 0,
          draftProjects: 0,
          completedProjects: 0,
          templates: 0,
          totalDuplicates: 0,
          avgComplexity: 0
        },
        categoryStats,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching project stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project statistics',
        error: error.message
      });
    }
  }
};