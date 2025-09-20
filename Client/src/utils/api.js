import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : import.meta.env.VITE_API_URL + '/api',
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Design API
export const designAPI = {
  // Get user designs
  getDesigns: (params = {}) => api.get('/designs', { params }),
  
  // Get single design
  getDesign: (id) => api.get(`/designs/${id}`),
  
  // Create design
  createDesign: (data) => api.post('/designs', data),
  
  // Update design
  updateDesign: (id, data) => api.put(`/designs/${id}`, data),
  
  // Delete design
  deleteDesign: (id) => api.delete(`/designs/${id}`),
  
  // Duplicate design
  duplicateDesign: (id) => api.post(`/designs/${id}/duplicate`),
  
  // Get templates
  getTemplates: (params = {}) => api.get('/designs/templates', { params }),
  
  // Get design stats
  getDesignStats: () => api.get('/designs/stats')
};

// Font API
export const fontAPI = {
  // Get fonts
  getFonts: (params = {}) => api.get('/fonts', { params }),
  
  // Get popular fonts
  getPopularFonts: (params = {}) => api.get('/fonts/popular', { params }),
  
  // Get font categories
  getFontCategories: () => api.get('/fonts/categories'),
  
  // Get fonts by category
  getFontsByCategory: (category, params = {}) => api.get(`/fonts/category/${category}`, { params }),
  
  // Get single font
  getFont: (id) => api.get(`/fonts/${id}`),
  
  // Rate font
  rateFont: (id, rating) => api.post(`/fonts/${id}/rate`, { rating }),
  
  // Generate CSS for fonts
  generateFontCSS: (fontIds) => api.post('/fonts/css', { fontIds })
};

// Cart API
export const cartAPI = {
  // Get cart
  getCart: () => api.get('/cart'),
  
  // Get cart summary
  getCartSummary: () => api.get('/cart/summary'),
  
  // Add to cart
  addToCart: (data) => api.post('/cart/items', data),
  
  // Update cart item
  updateCartItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  
  // Remove from cart
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  
  // Clear cart
  clearCart: () => api.delete('/cart'),
  
  // Apply discount
  applyDiscount: (discountCode) => api.post('/cart/discount', { discountCode }),
  
  // Validate cart
  validateCart: () => api.post('/cart/validate')
};

// Product API
export const productAPI = {
  // Get all products
  getProducts: (params = {}) => api.get('/products', { params }),
  
  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Get featured products
  getFeaturedProducts: () => api.get('/products/featured'),
  
  // Get product categories
  getCategories: () => api.get('/products/categories'),
  
  // Get products by category
  getProductsByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  
  // Search products
  searchProducts: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } })
};

// Upload API
export const uploadAPI = {
  // Upload image
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Delete image
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`),
  
  // Get image info
  getImageInfo: (filename) => api.get(`/upload/image/${filename}`)
};

export default api;