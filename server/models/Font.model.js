const mongoose = require('mongoose');

const fontVariantSchema = new mongoose.Schema({
  weight: {
    type: String,
    enum: ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold'],
    default: '400'
  },
  style: {
    type: String,
    enum: ['normal', 'italic', 'oblique'],
    default: 'normal'
  },
  url: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['woff', 'woff2', 'ttf', 'otf', 'eot'],
    default: 'woff2'
  }
});

const fontSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  family: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'display', 'handwriting'],
    default: 'sans-serif'
  },
  provider: {
    type: String,
    enum: ['google', 'custom', 'system', 'adobe', 'typekit'],
    default: 'google'
  },
  variants: [fontVariantSchema],
  subsets: [{
    type: String,
    enum: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese', 'arabic', 'hebrew', 'thai']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  previewText: {
    type: String,
    default: 'The quick brown fox jumps over the lazy dog'
  },
  description: {
    type: String,
    trim: true
  },
  designer: {
    type: String,
    trim: true
  },
  license: {
    type: String,
    enum: ['open', 'commercial', 'free', 'premium'],
    default: 'open'
  },
  tags: [{
    type: String,
    trim: true
  }],
  popularity: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    version: String,
    dateAdded: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    fileSize: Number,
    supportedCharacters: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
fontSchema.index({ name: 1 });
fontSchema.index({ family: 1 });
fontSchema.index({ category: 1, isActive: 1 });
fontSchema.index({ provider: 1, isActive: 1 });
fontSchema.index({ tags: 1 });
fontSchema.index({ popularity: -1 });
fontSchema.index({ 'rating.average': -1 });

// Virtual for font CSS
fontSchema.virtual('cssFamily').get(function() {
  return `'${this.family}', ${this.category}`;
});

// Virtual for Google Fonts URL
fontSchema.virtual('googleFontUrl').get(function() {
  if (this.provider !== 'google') return null;
  
  const weights = this.variants.map(v => v.weight).join(',');
  const family = this.family.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
});

// Method to get font face CSS
fontSchema.methods.getFontFaceCSS = function() {
  if (this.provider === 'google') {
    return `@import url('${this.googleFontUrl}');`;
  }
  
  return this.variants.map(variant => {
    return `@font-face {
      font-family: '${this.family}';
      font-style: ${variant.style};
      font-weight: ${variant.weight};
      src: url('${variant.url}') format('${variant.format}');
    }`;
  }).join('\n');
};

// Update lastUpdated on save
fontSchema.pre('save', function(next) {
  this.metadata.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Font', fontSchema);