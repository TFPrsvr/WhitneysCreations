const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const adminAuth = require('../middleware/AdminAuth');
const {
  getFonts,
  getFont,
  getPopularFonts,
  getFontsByCategory,
  createFont,
  updateFont,
  deleteFont,
  rateFont,
  getFontCategories,
  generateFontCSS
} = require('../controllers/Font.controller');

// Public routes
router.get('/', getFonts);
router.get('/popular', getPopularFonts);
router.get('/categories', getFontCategories);
router.get('/category/:category', getFontsByCategory);
router.get('/:id', getFont);
router.post('/css', generateFontCSS);

// Protected routes (require authentication)
router.use(auth);
router.post('/:id/rate', rateFont);

// Admin routes
router.post('/', adminAuth, createFont);
router.put('/:id', adminAuth, updateFont);
router.delete('/:id', adminAuth, deleteFont);

module.exports = router;