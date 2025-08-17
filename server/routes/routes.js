const UserController = require('../controllers/UserControllers')
const SuggestionController = require('../controllers/SuggestionControllers')
const UploadController = require('../controllers/UploadControllers')
const ProductController = require('../controllers/ProductControllers')
const ProjectController = require('../controllers/ProjectControllers')
const AdminController = require('../controllers/AdminControllers')
const OrderController = require('../controllers/Order.controller')
const DesignController = require('../controllers/Design.controller')
const FontController = require('../controllers/Font.controller')
const CartController = require('../controllers/Cart.controller')
const User = require('../models/User.model')
const Suggestion = require('../models/Suggestion.model')
const Product = require('../models/Product.model')
const Auth = require('../middleware/Auth')
const Auth2 = require('../middleware/Authenticate')
const { requireAdmin, requireSuperAdmin, requirePermission } = require('../middleware/AdminAuth')
const { upload, processImage, handleUploadError } = require('../middleware/Upload')

module.exports = (app) => {

app.get('/api/testing', UserController.getTest)


//****Suggestion routes */
app.post('/api/create/suggestion', Auth2, SuggestionController.createSuggestion)
app.put(`/api/update/suggestions/:id`, Auth2, SuggestionController.updateSuggestion)
app.delete(`/api/delete/suggestions/:id`, Auth2, SuggestionController.deleteSuggestion)
app.get('/api/suggestions', Auth2, SuggestionController.getSuggestions)


// app.get('/api/testing', (req, res) => {
//     console.log('testRoute hit!!')
//     res.json({msg: 'hello world!!'})
// })

// protected routes, token required
// app.get('/api/getUser', Auth, UserController.getUser)
// app.get('/api/profile', Auth, UserController.getProfile)

//****Product routes
app.get('/api/products', ProductController.getAllProducts)
app.get('/api/products/featured', ProductController.getFeaturedProducts)
app.get('/api/products/categories', ProductController.getCategories)
app.get('/api/products/category/:category', ProductController.getProductsByCategory)
app.get('/api/products/category/:category/types', ProductController.getProductTypes)
app.get('/api/products/search', ProductController.searchProducts)
app.get('/api/products/:id', ProductController.getProductById)

// Admin product routes (will add auth middleware later)
app.post('/api/products', ProductController.createProduct)
app.put('/api/products/:id', ProductController.updateProduct)
app.delete('/api/products/:id', ProductController.deleteProduct)

//****Upload routes for images
app.post('/api/upload/image', upload.single('image'), processImage, UploadController.uploadImage)
app.delete('/api/upload/image/:filename', UploadController.deleteImage)
app.get('/api/upload/image/:filename', UploadController.getImageInfo)

//****Project routes (protected)
app.post('/api/projects', Auth2, ProjectController.createProject)
app.get('/api/projects', Auth2, ProjectController.getUserProjects)
app.get('/api/projects/search', Auth2, ProjectController.searchProjects)
app.get('/api/projects/stats', Auth2, ProjectController.getProjectStats)
app.get('/api/projects/:id', Auth2, ProjectController.getProjectById)
app.put('/api/projects/:id', Auth2, ProjectController.updateProject)
app.delete('/api/projects/:id', Auth2, ProjectController.deleteProject)
app.post('/api/projects/:id/duplicate', Auth2, ProjectController.duplicateProject)
app.post('/api/projects/:id/versions', Auth2, ProjectController.createProjectVersion)
app.put('/api/projects/:id/versions/:versionNumber/restore', Auth2, ProjectController.restoreProjectVersion)

// Public template routes
app.get('/api/templates', ProjectController.getPublicTemplates)

//****User profile routes (protected)
app.get('/api/user/profile', Auth2, UserController.getUserProfile)

//****Order routes (protected)
app.get('/api/orders', Auth2, OrderController.getUserOrders)
app.get('/api/orders/stats', requireAdmin, OrderController.getOrderStats)
app.get('/api/orders/:orderId', Auth2, OrderController.getOrderById)
app.post('/api/orders', Auth2, OrderController.createOrder)
app.patch('/api/orders/:orderId', Auth2, OrderController.updateOrderStatus)
app.patch('/api/orders/:orderId/cancel', Auth2, OrderController.cancelOrder)

//****Design routes
// Public routes
app.get('/api/designs/templates', DesignController.getTemplates)

// Protected routes
app.get('/api/designs', Auth2, DesignController.getUserDesigns)
app.get('/api/designs/stats', Auth2, DesignController.getDesignStats)
app.get('/api/designs/:id', Auth2, DesignController.getDesign)
app.post('/api/designs', Auth2, DesignController.createDesign)
app.put('/api/designs/:id', Auth2, DesignController.updateDesign)
app.delete('/api/designs/:id', Auth2, DesignController.deleteDesign)
app.post('/api/designs/:id/duplicate', Auth2, DesignController.duplicateDesign)

//****Font routes
// Public routes
app.get('/api/fonts', FontController.getFonts)
app.get('/api/fonts/popular', FontController.getPopularFonts)
app.get('/api/fonts/categories', FontController.getFontCategories)
app.get('/api/fonts/category/:category', FontController.getFontsByCategory)
app.get('/api/fonts/:id', FontController.getFont)
app.post('/api/fonts/css', FontController.generateFontCSS)

// Protected routes
app.post('/api/fonts/:id/rate', Auth2, FontController.rateFont)

// Admin routes
app.post('/api/fonts', requireAdmin, FontController.createFont)
app.put('/api/fonts/:id', requireAdmin, FontController.updateFont)
app.delete('/api/fonts/:id', requireAdmin, FontController.deleteFont)

//****Cart routes (protected)
app.get('/api/cart', Auth2, CartController.getCart)
app.get('/api/cart/summary', Auth2, CartController.getCartSummary)
app.post('/api/cart/items', Auth2, CartController.addToCart)
app.put('/api/cart/items/:itemId', Auth2, CartController.updateCartItem)
app.delete('/api/cart/items/:itemId', Auth2, CartController.removeFromCart)
app.delete('/api/cart', Auth2, CartController.clearCart)
app.post('/api/cart/discount', Auth2, CartController.applyDiscount)
app.post('/api/cart/validate', Auth2, CartController.validateCart)

//****Admin routes (protected with admin/superadmin roles)
app.get('/api/admin/dashboard', requireAdmin, AdminController.getDashboardStats)
app.get('/api/admin/users', requireAdmin, AdminController.getAllUsers)
app.get('/api/admin/users/:userId', requireAdmin, AdminController.getUserDetails)
app.put('/api/admin/users/:userId', requireAdmin, AdminController.updateUser)
app.post('/api/admin/users/:userId/impersonate', requireSuperAdmin, AdminController.impersonateUser)
app.get('/api/admin/system/health', requireAdmin, AdminController.getSystemHealth)
app.get('/api/admin/system/logs', requireSuperAdmin, AdminController.getSystemLogs)

//****Register & Login routes for User no token required
app.post('/api/reg', UserController.registerUser)
app.post('/api/login', UserController.loginUser)

//****Token refresh route (protected)
app.post('/api/user/refresh-token', Auth2, UserController.refreshToken)

// Upload error handling
app.use(handleUploadError)

}