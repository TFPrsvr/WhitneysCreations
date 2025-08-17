const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const adminAuth = require('../middleware/AdminAuth');
const {
  getUserDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign,
  getTemplates,
  getDesignStats
} = require('../controllers/Design.controller');

// Public routes
router.get('/templates', getTemplates);

// Protected routes (require authentication)
router.use(auth);

// User design routes
router.get('/', getUserDesigns);
router.get('/stats', getDesignStats);
router.get('/:id', getDesign);
router.post('/', createDesign);
router.put('/:id', updateDesign);
router.delete('/:id', deleteDesign);
router.post('/:id/duplicate', duplicateDesign);

module.exports = router;