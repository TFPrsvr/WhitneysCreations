const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    default: null
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  size: {
    type: String,
    required: function() {
      return this.productId && this.productId.category === 'apparel';
    }
  },
  color: {
    type: String,
    default: 'white'
  },
  customization: {
    text: String,
    fontFamily: String,
    fontSize: Number,
    textColor: String,
    position: {
      x: Number,
      y: Number
    }
  },
  mockupUrl: String,
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0.08,
    min: 0,
    max: 1
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 5.99,
    min: 0
  },
  discountCode: {
    type: String,
    trim: true
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ 'items.productId': 1 });
cartSchema.index({ lastUpdated: 1 });

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Calculate tax
  this.taxAmount = this.subtotal * this.taxRate;
  
  // Calculate total
  this.total = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  
  // Update timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Update item total price when quantity or unit price changes
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

// Instance methods
cartSchema.methods.addItem = function(item) {
  const existingItemIndex = this.items.findIndex(
    cartItem => 
      cartItem.productId.toString() === item.productId.toString() &&
      cartItem.size === item.size &&
      cartItem.color === item.color &&
      cartItem.designId?.toString() === item.designId?.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += item.quantity;
    this.items[existingItemIndex].totalPrice = 
      this.items[existingItemIndex].quantity * this.items[existingItemIndex].unitPrice;
  } else {
    // Add new item
    this.items.push({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    });
  }
  
  return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId.toString());
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    item.quantity = quantity;
    item.totalPrice = item.quantity * item.unitPrice;
    return this.save();
  }
  throw new Error('Item not found in cart');
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  this.discountCode = null;
  this.discountAmount = 0;
  return this.save();
};

cartSchema.methods.applyDiscount = function(code, amount) {
  this.discountCode = code;
  this.discountAmount = amount;
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);