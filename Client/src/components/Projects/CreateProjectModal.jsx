import React, { useState, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
  const { createProject, loading, error } = useProject();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product: '',
    productVariant: {
      size: '',
      color: '',
      colorHex: ''
    },
    category: 'personal',
    canvas: {
      width: 800,
      height: 600,
      backgroundColor: 'transparent'
    }
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get('http://localhost:3002/api/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p._id === productId);
    
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      product: productId,
      productVariant: {
        size: '',
        color: '',
        colorHex: ''
      }
    }));
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      productVariant: {
        ...prev.productVariant,
        color: color.name,
        colorHex: color.hex
      }
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Project name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!formData.product) {
      errors.product = 'Please select a product';
    }

    if (formData.canvas.width < 100 || formData.canvas.width > 2000) {
      errors.canvasWidth = 'Canvas width must be between 100 and 2000 pixels';
    }

    if (formData.canvas.height < 100 || formData.canvas.height > 2000) {
      errors.canvasHeight = 'Canvas height must be between 100 and 2000 pixels';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const project = await createProject({
        ...formData,
        elements: [] // Start with empty elements
      });
      
      onProjectCreated();
      
      // Navigate to project editor
      navigate(`/projects/${project._id}/edit`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'event', label: 'Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button className="text-gray-400 hover:text-gray-600 text-2xl font-bold" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.name && <span className="text-red-500 text-sm mt-1">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project (optional)"
              rows="3"
              className={formErrors.description ? 'error' : ''}
            />
            {formErrors.description && <span className="error-text">{formErrors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product">Product *</label>
            {loadingProducts ? (
              <div className="loading-products">Loading products...</div>
            ) : (
              <select
                id="product"
                name="product"
                value={formData.product}
                onChange={handleProductSelect}
                className={formErrors.product ? 'error' : ''}
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.type}
                  </option>
                ))}
              </select>
            )}
            {formErrors.product && <span className="error-text">{formErrors.product}</span>}
          </div>

          {selectedProduct && (
            <div className="product-options">
              {selectedProduct.variants?.sizes?.length > 0 && (
                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    id="size"
                    name="productVariant.size"
                    value={formData.productVariant.size}
                    onChange={handleInputChange}
                  >
                    <option value="">Select size</option>
                    {selectedProduct.variants.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedProduct.variants?.colors?.length > 0 && (
                <div className="form-group">
                  <label>Color</label>
                  <div className="color-options">
                    {selectedProduct.variants.colors.map(color => (
                      <div
                        key={color.name}
                        className={`color-option ${formData.productVariant.color === color.name ? 'selected' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => handleColorSelect(color)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  {formData.productVariant.color && (
                    <span className="selected-color">
                      Selected: {formData.productVariant.color}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="canvas-settings">
            <h3>Canvas Settings</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="canvasWidth">Width (px)</label>
                <input
                  type="number"
                  id="canvasWidth"
                  name="canvas.width"
                  value={formData.canvas.width}
                  onChange={handleInputChange}
                  min="100"
                  max="2000"
                  className={formErrors.canvasWidth ? 'error' : ''}
                />
                {formErrors.canvasWidth && <span className="error-text">{formErrors.canvasWidth}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="canvasHeight">Height (px)</label>
                <input
                  type="number"
                  id="canvasHeight"
                  name="canvas.height"
                  value={formData.canvas.height}
                  onChange={handleInputChange}
                  min="100"
                  max="2000"
                  className={formErrors.canvasHeight ? 'error' : ''}
                />
                {formErrors.canvasHeight && <span className="error-text">{formErrors.canvasHeight}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;