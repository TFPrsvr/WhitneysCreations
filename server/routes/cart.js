const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount,
  getCartSummary,
  validateCart
} = require('../controllers/Cart.controller');

// All cart routes require authentication
router.use(auth);

router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);
router.post('/discount', applyDiscount);
router.post('/validate', validateCart);

module.exports = router;