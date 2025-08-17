const mongoose = require('mongoose');

const DesignElementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'text', 'shape'],
    required: true
  },
  content: {
    // For images: file URL
    // For text: text content
    // For shapes: shape data
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, default: 0 } // Layer order
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  rotation: {
    type: Number,
    default: 0
  },
  style: {
    // Text styling
    fontFamily: String,
    fontSize: Number,
    fontWeight: String,
    color: String,
    textAlign: String,
    
    // Image styling
    opacity: { type: Number, default: 1 },
    filter: String,
    
    // Shape styling
    fill: String,
    stroke: String,
    strokeWidth: Number
  },
  locked: {
    type: Boolean,
    default: false
  }
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productVariant: {
    size: String,
    color: String,
    colorHex: String
  },
  designArea: {
    name: String, // 'front', 'back', etc.
    maxWidth: Number,
    maxHeight: Number,
    position: {
      x: Number,
      y: Number
    }
  },
  elements: [DesignElementSchema],
  canvas: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    backgroundColor: { type: String, default: 'transparent' },
    backgroundImage: String
  },
  preview: {
    thumbnailUrl: String,
    fullSizeUrl: String,
    mockupUrl: String
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'archived'],
    default: 'draft'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['personal', 'business', 'event', 'holiday', 'sports', 'art', 'other'],
    default: 'personal'
  },
  metadata: {
    totalElements: { type: Number, default: 0 },
    hasImages: { type: Boolean, default: false },
    hasText: { type: Boolean, default: false },
    estimatedPrintTime: Number,
    complexity: {
      type: String,
      enum: ['simple', 'medium', 'complex'],
      default: 'simple'
    }
  },
  sharing: {
    shareUrl: String,
    allowComments: { type: Boolean, default: false },
    allowDownload: { type: Boolean, default: false },
    password: String
  },
  versions: [{
    versionNumber: { type: Number, required: true },
    elements: [DesignElementSchema],
    createdAt: { type: Date, default: Date.now },
    note: String
  }],
  currentVersion: {
    type: Number,
    default: 1
  },
  lastOpened: Date,
  openCount: { type: Number, default: 0 },
  duplicatedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  duplicateCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
ProjectSchema.index({ user: 1, status: 1 });
ProjectSchema.index({ user: 1, updatedAt: -1 });
ProjectSchema.index({ isTemplate: 1, isPublic: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to update metadata
ProjectSchema.pre('save', function(next) {
  // Update metadata based on elements
  this.metadata.totalElements = this.elements.length;
  this.metadata.hasImages = this.elements.some(el => el.type === 'image');
  this.metadata.hasText = this.elements.some(el => el.type === 'text');
  
  // Determine complexity based on number of elements
  if (this.elements.length <= 3) {
    this.metadata.complexity = 'simple';
  } else if (this.elements.length <= 8) {
    this.metadata.complexity = 'medium';
  } else {
    this.metadata.complexity = 'complex';
  }
  
  next();
});

// Virtual for project age
ProjectSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for days since last opened
ProjectSchema.virtual('daysSinceOpened').get(function() {
  if (!this.lastOpened) return null;
  return Math.floor((Date.now() - this.lastOpened.getTime()) / (24 * 60 * 60 * 1000));
});

// Method to create a new version
ProjectSchema.methods.createVersion = function(note = '') {
  const newVersion = {
    versionNumber: this.versions.length + 1,
    elements: [...this.elements],
    note: note
  };
  
  this.versions.push(newVersion);
  this.currentVersion = newVersion.versionNumber;
  return this.save();
};

// Method to restore a version
ProjectSchema.methods.restoreVersion = function(versionNumber) {
  const version = this.versions.find(v => v.versionNumber === versionNumber);
  if (!version) {
    throw new Error('Version not found');
  }
  
  this.elements = [...version.elements];
  this.currentVersion = versionNumber;
  return this.save();
};

// Method to duplicate project
ProjectSchema.methods.duplicate = function(userId, newName = null) {
  const ProjectModel = this.constructor;
  
  const duplicateData = {
    name: newName || `${this.name} (Copy)`,
    description: this.description,
    user: userId,
    product: this.product,
    productVariant: this.productVariant,
    designArea: this.designArea,
    elements: [...this.elements],
    canvas: { ...this.canvas },
    tags: [...this.tags],
    category: this.category,
    duplicatedFrom: this._id
  };
  
  // Increment duplicate count
  this.duplicateCount += 1;
  this.save();
  
  return new ProjectModel(duplicateData).save();
};

// Method to update last opened
ProjectSchema.methods.updateLastOpened = function() {
  this.lastOpened = new Date();
  this.openCount += 1;
  return this.save();
};

// Static method to get user's projects with filters
ProjectSchema.statics.getUserProjects = function(userId, filters = {}) {
  const query = { user: userId };
  
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.isTemplate !== undefined) query.isTemplate = filters.isTemplate;
  
  let sortQuery = {};
  switch (filters.sortBy) {
    case 'name':
      sortQuery.name = filters.sortOrder === 'desc' ? -1 : 1;
      break;
    case 'created':
      sortQuery.createdAt = filters.sortOrder === 'desc' ? -1 : 1;
      break;
    case 'modified':
      sortQuery.updatedAt = filters.sortOrder === 'desc' ? -1 : 1;
      break;
    case 'opened':
      sortQuery.lastOpened = filters.sortOrder === 'desc' ? -1 : 1;
      break;
    default:
      sortQuery.updatedAt = -1;
  }
  
  return this.find(query)
    .populate('product', 'name type category')
    .sort(sortQuery)
    .limit(filters.limit || 50);
};

// Static method to search projects
ProjectSchema.statics.searchUserProjects = function(userId, searchQuery, filters = {}) {
  const query = {
    user: userId,
    $or: [
      { name: new RegExp(searchQuery, 'i') },
      { description: new RegExp(searchQuery, 'i') },
      { tags: new RegExp(searchQuery, 'i') }
    ]
  };
  
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  
  return this.find(query)
    .populate('product', 'name type category')
    .sort({ updatedAt: -1 })
    .limit(filters.limit || 20);
};

// Static method to get public templates
ProjectSchema.statics.getPublicTemplates = function(filters = {}) {
  const query = { isTemplate: true, isPublic: true };
  
  if (filters.category) query.category = filters.category;
  if (filters.product) query.product = filters.product;
  
  return this.find(query)
    .populate('product', 'name type category')
    .populate('user', 'username')
    .sort({ duplicateCount: -1, createdAt: -1 })
    .limit(filters.limit || 20);
};

module.exports = mongoose.model('Project', ProjectSchema);