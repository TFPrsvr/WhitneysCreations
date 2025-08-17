const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user.id;

    // Build query filter
    const filter = { userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.productId', 'name type images')
      .lean();

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    // Calculate order statistics
    const stats = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const orderStats = {
      total: totalOrders,
      totalSpent: stats.reduce((sum, stat) => sum + stat.totalAmount, 0),
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        },
        stats: orderStats
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: userId 
    })
    .populate('items.productId', 'name type images description')
    .populate('userId', 'username email')
    .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }

    // Validate and process order items
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Validate item structure
      if (!item.productId || !item.quantity || !item.size || !item.color) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productId, quantity, size, and color'
        });
      }

      // Get product details
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      // Calculate pricing (using base price for now, could add size/color modifiers)
      const unitPrice = item.unitPrice || product.basePrice || 15.99;
      const totalPrice = unitPrice * item.quantity;

      processedItems.push({
        productId: product._id,
        productName: product.name,
        productType: product.type,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        designData: item.designData || null,
        customizations: item.customizations || null
      });

      subtotal += totalPrice;
    }

    // Calculate tax and shipping (simplified calculation)
    const taxRate = 0.08; // 8% tax
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const shipping = subtotal > 50 ? 0 : 7.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      userId,
      items: processedItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes: notes || ''
    });

    await order.save();

    // Populate the saved order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.productId', 'name type images')
      .populate('userId', 'username email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Update order status (admin/system use)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, trackingUrl, estimatedDelivery, notes } = req.body;
    const userId = req.user.id;

    // Find order (users can only update their own orders, admins can update any)
    const filter = req.user.role === 'admin' || req.user.role === 'superadmin' 
      ? { _id: orderId }
      : { _id: orderId, userId: userId };

    const order = await Order.findOne(filter);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update allowed fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (notes) order.notes = notes;

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    order.notes = reason ? `Cancelled: ${reason}` : 'Cancelled by customer';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get order statistics for admin
const getOrderStats = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          ordersByStatus: {
            $push: '$status'
          }
        }
      }
    ]);

    const statusCounts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      timeRange,
      totalOrders: stats[0]?.totalOrders || 0,
      totalRevenue: stats[0]?.totalRevenue || 0,
      averageOrderValue: stats[0]?.averageOrderValue || 0,
      ordersByStatus: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
};