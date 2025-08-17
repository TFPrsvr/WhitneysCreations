const mongoose = require('mongoose');

const designElementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'shape', 'icon'],
    required: true
  },
  x: {
    type: Number,
    required: true,
    default: 0
  },
  y: {
    type: Number,
    required: true,
    default: 0
  },
  width: {
    type: Number,
    default: 100
  },
  height: {
    type: Number,
    default: 100
  },
  rotation: {
    type: Number,
    default: 0
  },
  // Text specific properties
  text: String,
  fontSize: {
    type: Number,
    default: 16
  },
  fontFamily: {
    type: String,
    default: 'Arial'
  },
  fontWeight: {
    type: String,
    default: 'normal'
  },
  color: {
    type: String,
    default: '#000000'
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'left'
  },
  // Image specific properties
  imageUrl: String,
  imageName: String,
  // Shape specific properties
  shapeType: {
    type: String,
    enum: ['rectangle', 'circle', 'triangle', 'line']
  },
  strokeColor: String,
  strokeWidth: Number,
  fillColor: String,
  // Layer order
  zIndex: {
    type: Number,
    default: 0
  }
});

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['business-card', 't-shirt', 'poster', 'logo', 'banner', 'flyer', 'custom'],
    default: 'custom'
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
      default: 800
    },
    height: {
      type: Number,
      required: true,
      default: 600
    }
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  elements: [designElementSchema],
  template: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  mockups: [{
    productType: String,
    mockupUrl: String,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  previewImage: {
    type: String
  },
  version: {
    type: Number,
    default: 1
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ category: 1, isPublic: 1 });
designSchema.index({ isTemplate: 1, category: 1 });
designSchema.index({ tags: 1 });

// Virtual for design URL
designSchema.virtual('designUrl').get(function() {
  return `/api/designs/${this._id}`;
});

// Update lastModified on save
designSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Design', designSchema);