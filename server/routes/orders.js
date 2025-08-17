const express = require('express');
const router = express.Router();
const {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/Order.controller');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// User order routes
router.get('/', getUserOrders);
router.get('/stats', adminMiddleware, getOrderStats);
router.get('/:orderId', getOrderById);
router.post('/', createOrder);
router.patch('/:orderId', updateOrderStatus);
router.patch('/:orderId/cancel', cancelOrder);

module.exports = router;