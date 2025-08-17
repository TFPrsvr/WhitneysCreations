const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  colorHex: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['apparel', 'accessories', 'home-decor', 'stationery'],
    lowercase: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      't-shirt', 
      'hoodie', 
      'sweatshirt',
      'tank-top',
      'long-sleeve',
      'polo',
      'mug', 
      'coffee-cup',
      'water-bottle',
      'hat', 
      'cap',
      'beanie',
      'tote-bag',
      'backpack',
      'phone-case',
      'laptop-case',
      'poster',
      'canvas-print',
      'pillow',
      'blanket',
      'sticker',
      'notebook',
      'journal'
    ],
    lowercase: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  variants: [ProductVariantSchema],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  mockupImages: [{
    url: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: true
    },
    angle: {
      type: String,
      enum: ['front', 'back', 'side', 'detail'],
      default: 'front'
    }
  }],
  printAreas: [{
    name: {
      type: String,
      required: true
    },
    maxWidth: {
      type: Number,
      required: true
    },
    maxHeight: {
      type: Number,
      required: true
    },
    position: {
      x: Number,
      y: Number
    }
  }],
  material: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ category: 1, type: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ 'variants.price': 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for getting price range
ProductSchema.virtual('priceRange').get(function() {
  if (this.variants.length === 0) return { min: this.basePrice, max: this.basePrice };
  
  const prices = this.variants.map(v => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Virtual for getting available sizes
ProductSchema.virtual('availableSizes').get(function() {
  return [...new Set(this.variants.map(v => v.size))];
});

// Virtual for getting available colors
ProductSchema.virtual('availableColors').get(function() {
  return this.variants.map(v => ({
    name: v.color,
    hex: v.colorHex
  })).filter((color, index, self) => 
    index === self.findIndex(c => c.name === color.name)
  );
});

// Method to get primary image
ProductSchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage || this.images[0] || null;
};

// Method to check if product is in stock
ProductSchema.methods.isInStock = function(size = null, color = null) {
  if (!size && !color) {
    return this.variants.some(v => v.stock > 0);
  }
  
  const variant = this.variants.find(v => 
    (!size || v.size === size) && (!color || v.color === color)
  );
  
  return variant ? variant.stock > 0 : false;
};

// Static method to get products by category
ProductSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ isFeatured: -1, createdAt: -1 });
};

// Static method to search products
ProductSchema.statics.searchProducts = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { tags: new RegExp(query, 'i') }
    ]
  };

  if (filters.category) searchQuery.category = filters.category;
  if (filters.type) searchQuery.type = filters.type;
  if (filters.minPrice || filters.maxPrice) {
    searchQuery['variants.price'] = {};
    if (filters.minPrice) searchQuery['variants.price'].$gte = filters.minPrice;
    if (filters.maxPrice) searchQuery['variants.price'].$lte = filters.maxPrice;
  }

  return this.find(searchQuery).sort({ isFeatured: -1, createdAt: -1 });
};

module.exports = mongoose.model('Product', ProductSchema);