const Product = require('../models/Product.model');
const mongoose = require('mongoose');

module.exports = {
  // Get all products with optional filtering
  getAllProducts: async (req, res) => {
    try {
      const {
        category,
        type,
        minPrice,
        maxPrice,
        featured,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      const query = { isActive: true };

      // Apply filters
      if (category) query.category = category;
      if (type) query.type = type;
      if (featured === 'true') query.isFeatured = true;

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { tags: new RegExp(search, 'i') }
        ];
      }

      // Price filtering (check variants)
      if (minPrice || maxPrice) {
        const priceQuery = {};
        if (minPrice) priceQuery.$gte = parseFloat(minPrice);
        if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
        query['variants.price'] = priceQuery;
      }

      // Sorting
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Product.countDocuments(query);

      res.status(200).json({
        success: true,
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNextPage: skip + products.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  },

  // Get single product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const product = await Product.findOne({ _id: id, isActive: true }).lean();

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        product
      });

    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product',
        error: error.message
      });
    }
  },

  // Get products by category
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = 20, page = 1 } = req.query;

      const validCategories = ['apparel', 'accessories', 'home-decor', 'stationery'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const products = await Product.find({ category, isActive: true })
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Product.countDocuments({ category, isActive: true });

      res.status(200).json({
        success: true,
        category,
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total
        }
      });

    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products by category',
        error: error.message
      });
    }
  },

  // Get featured products
  getFeaturedProducts: async (req, res) => {
    try {
      const { limit = 8 } = req.query;

      const products = await Product.find({ isFeatured: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      res.status(200).json({
        success: true,
        products
      });

    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured products',
        error: error.message
      });
    }
  },

  // Search products
  searchProducts: async (req, res) => {
    try {
      const { q, category, type, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = {};
      if (category) filters.category = category;
      if (type) filters.type = type;
      if (minPrice) filters.minPrice = parseFloat(minPrice);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const searchQuery = {
        isActive: true,
        $or: [
          { name: new RegExp(q.trim(), 'i') },
          { description: new RegExp(q.trim(), 'i') },
          { tags: new RegExp(q.trim(), 'i') }
        ]
      };

      // Apply additional filters
      if (filters.category) searchQuery.category = filters.category;
      if (filters.type) searchQuery.type = filters.type;
      if (filters.minPrice || filters.maxPrice) {
        const priceQuery = {};
        if (filters.minPrice) priceQuery.$gte = filters.minPrice;
        if (filters.maxPrice) priceQuery.$lte = filters.maxPrice;
        searchQuery['variants.price'] = priceQuery;
      }

      const products = await Product.find(searchQuery)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Product.countDocuments(searchQuery);

      res.status(200).json({
        success: true,
        query: q.trim(),
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total
        }
      });

    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
        error: error.message
      });
    }
  },

  // Get product categories with counts
  getCategories: async (req, res) => {
    try {
      const categories = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      const categoryData = categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        displayName: cat._id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }));

      res.status(200).json({
        success: true,
        categories: categoryData
      });

    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  },

  // Get product types by category
  getProductTypes: async (req, res) => {
    try {
      const { category } = req.params;

      const types = await Product.aggregate([
        { $match: { category, isActive: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      const typeData = types.map(type => ({
        name: type._id,
        count: type.count,
        displayName: type._id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }));

      res.status(200).json({
        success: true,
        category,
        types: typeData
      });

    } catch (error) {
      console.error('Error fetching product types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product types',
        error: error.message
      });
    }
  },

  // Create new product (Admin only - will add auth later)
  createProduct: async (req, res) => {
    try {
      const productData = req.body;

      // Basic validation
      if (!productData.name || !productData.category || !productData.type) {
        return res.status(400).json({
          success: false,
          message: 'Name, category, and type are required'
        });
      }

      const product = new Product(productData);
      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });

    } catch (error) {
      console.error('Error creating product:', error);
      
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
        message: 'Failed to create product',
        error: error.message
      });
    }
  },

  // Update product (Admin only - will add auth later)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const product = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product
      });

    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  },

  // Delete product (Admin only - will add auth later)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      // Soft delete by setting isActive to false
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
};