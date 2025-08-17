import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const ProductManagement = () => {
  const { user } = useAuth();
  const { loading } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    printPrice: '',
    dimensions: {
      width: '',
      height: ''
    },
    colors: [],
    sizes: [],
    tags: [],
    mockupImages: [],
    isActive: true,
    isPremium: false,
    printAreas: []
  });

  // Sample product data - in real app, this would come from backend
  const sampleProducts = [
    {
      id: 1,
      name: 'Classic T-Shirt',
      description: 'Comfortable cotton t-shirt perfect for custom designs',
      category: 'Apparel',
      basePrice: 12.99,
      printPrice: 5.00,
      dimensions: { width: 12, height: 16 },
      colors: ['White', 'Black', 'Navy', 'Red', 'Gray'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      tags: ['cotton', 'unisex', 'basic'],
      mockupImages: ['/mockups/tshirt-white.jpg', '/mockups/tshirt-black.jpg'],
      isActive: true,
      isPremium: false,
      printAreas: [{ name: 'Front', x: 0.3, y: 0.35, width: 0.4, height: 0.3 }],
      totalSales: 1250,
      createdAt: '2024-01-15',
      updatedAt: '2024-11-20'
    },
    {
      id: 2,
      name: 'Premium Hoodie',
      description: 'High-quality pullover hoodie with soft interior lining',
      category: 'Apparel',
      basePrice: 29.99,
      printPrice: 8.00,
      dimensions: { width: 12, height: 16 },
      colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      tags: ['premium', 'warm', 'cotton-blend'],
      mockupImages: ['/mockups/hoodie-black.jpg'],
      isActive: true,
      isPremium: true,
      printAreas: [{ name: 'Front Center', x: 0.3, y: 0.4, width: 0.4, height: 0.25 }],
      totalSales: 890,
      createdAt: '2024-02-10',
      updatedAt: '2024-11-18'
    },
    {
      id: 3,
      name: 'Ceramic Coffee Mug',
      description: '11oz white ceramic mug, microwave and dishwasher safe',
      category: 'Drinkware',
      basePrice: 8.99,
      printPrice: 3.50,
      dimensions: { width: 4, height: 4 },
      colors: ['White'],
      sizes: ['11oz'],
      tags: ['ceramic', 'dishwasher-safe', 'microwave-safe'],
      mockupImages: ['/mockups/mug-white.jpg'],
      isActive: true,
      isPremium: false,
      printAreas: [{ name: 'Wrap Around', x: 0.2, y: 0.3, width: 0.6, height: 0.4 }],
      totalSales: 2100,
      createdAt: '2024-01-20',
      updatedAt: '2024-11-15'
    },
    {
      id: 4,
      name: 'Canvas Tote Bag',
      description: 'Eco-friendly canvas tote bag with reinforced handles',
      category: 'Bags',
      basePrice: 15.99,
      printPrice: 6.00,
      dimensions: { width: 15, height: 16 },
      colors: ['Natural', 'Black'],
      sizes: ['One Size'],
      tags: ['eco-friendly', 'canvas', 'reusable'],
      mockupImages: ['/mockups/tote-natural.jpg'],
      isActive: true,
      isPremium: false,
      printAreas: [{ name: 'Front Center', x: 0.25, y: 0.3, width: 0.5, height: 0.4 }],
      totalSales: 650,
      createdAt: '2024-03-01',
      updatedAt: '2024-11-10'
    },
    {
      id: 5,
      name: 'Vinyl Sticker',
      description: 'Waterproof vinyl sticker, perfect for outdoor use',
      category: 'Stickers',
      basePrice: 2.99,
      printPrice: 1.00,
      dimensions: { width: 3, height: 3 },
      colors: ['White', 'Clear'],
      sizes: ['3x3"', '4x4"', '6x6"'],
      tags: ['waterproof', 'vinyl', 'outdoor'],
      mockupImages: ['/mockups/sticker-round.jpg'],
      isActive: true,
      isPremium: false,
      printAreas: [{ name: 'Full Coverage', x: 0.1, y: 0.1, width: 0.8, height: 0.8 }],
      totalSales: 3200,
      createdAt: '2024-02-15',
      updatedAt: '2024-11-12'
    }
  ];

  const productCategories = [
    'Apparel',
    'Drinkware',
    'Bags',
    'Stickers',
    'Wall Art',
    'Accessories',
    'Phone Cases',
    'Home Decor'
  ];

  useEffect(() => {
    // Load products and categories
    setProducts(sampleProducts);
    setCategories(productCategories);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.basePrice - b.basePrice;
      case 'sales':
        return b.totalSales - a.totalSales;
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProductForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setProductForm(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setProductForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      printPrice: '',
      dimensions: { width: '', height: '' },
      colors: [],
      sizes: [],
      tags: [],
      mockupImages: [],
      isActive: true,
      isPremium: false,
      printAreas: []
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.basePrice) {
      alert('Please fill in required fields');
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...productForm,
      basePrice: parseFloat(productForm.basePrice),
      printPrice: parseFloat(productForm.printPrice || 0),
      totalSales: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [...prev, newProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.basePrice) {
      alert('Please fill in required fields');
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      ...productForm,
      basePrice: parseFloat(productForm.basePrice),
      printPrice: parseFloat(productForm.printPrice || 0),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    setShowEditModal(false);
    setSelectedProduct(null);
    resetForm();
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice.toString(),
      printPrice: product.printPrice.toString(),
      dimensions: product.dimensions,
      colors: [...product.colors],
      sizes: [...product.sizes],
      tags: [...product.tags],
      mockupImages: [...product.mockupImages],
      isActive: product.isActive,
      isPremium: product.isPremium,
      printAreas: [...product.printAreas]
    });
    setShowEditModal(true);
  };

  const toggleProductStatus = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const duplicateProduct = (product) => {
    const duplicated = {
      ...product,
      id: Date.now(),
      name: `${product.name} (Copy)`,
      totalSales: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, duplicated]);
  };

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access product management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">{products.length} products total</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="sales">Sort by Sales</option>
            <option value="created">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🛍️</div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    {product.isPremium && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium">${product.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Print Price:</span>
                    <span className="font-medium">${product.printPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-medium">{product.totalSales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Colors:</span>
                    <span className="font-medium">{product.colors.length}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.tags.length - 3} more</span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => duplicateProduct(product)}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className={`text-sm ${
                        product.isActive 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      {product.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.basePrice}
                      onChange={(e) => handleFormChange('basePrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Print Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.printPrice}
                      onChange={(e) => handleFormChange('printPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (inches)
                    </label>
                    <input
                      type="number"
                      value={productForm.dimensions.width}
                      onChange={(e) => handleFormChange('dimensions.width', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (inches)
                    </label>
                    <input
                      type="number"
                      value={productForm.dimensions.height}
                      onChange={(e) => handleFormChange('dimensions.height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  {productForm.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleArrayFieldChange('colors', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Color name"
                      />
                      <button
                        onClick={() => removeArrayItem('colors', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('colors')}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Color
                  </button>
                </div>

                {/* Settings */}
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isPremium}
                      onChange={(e) => handleFormChange('isPremium', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Premium Product</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Product</h3>
              
              <div className="space-y-4">
                {/* Same form fields as Add Modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.basePrice}
                      onChange={(e) => handleFormChange('basePrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Print Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.printPrice}
                      onChange={(e) => handleFormChange('printPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isPremium}
                      onChange={(e) => handleFormChange('isPremium', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Premium Product</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProduct}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;