const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first: {
          type: String,
          required: true,
          trim: true
        },

        last: {
          type: String,
          required: true,
          trim: true
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
        },

        role: {
            type: String,
            enum: ['user', 'premium', 'admin', 'superadmin'],
            default: 'user'
        },

        isActive: {
            type: Boolean,
            default: true
        },

        profile: {
            avatar: String,
            phone: String,
            dateOfBirth: Date,
            preferences: {
                newsletter: { type: Boolean, default: true },
                notifications: { type: Boolean, default: true },
                language: { type: String, default: 'en' }
            }
        },

        addresses: [{
            type: {
                type: String,
                enum: ['shipping', 'billing'],
                required: true
            },
            isDefault: { type: Boolean, default: false },
            firstName: String,
            lastName: String,
            company: String,
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true, default: 'US' },
            phone: String
        }],

        lastLogin: Date,
        loginCount: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
)
// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.first} ${this.last}`;
});

// Method to get user's default address
UserSchema.methods.getDefaultAddress = function(type = 'shipping') {
  return this.addresses.find(addr => addr.type === type && addr.isDefault) || 
         this.addresses.find(addr => addr.type === type);
};

// Method to check if user has permission
UserSchema.methods.hasPermission = function(permission) {
  const rolePermissions = {
    user: ['view_products', 'create_design', 'save_project', 'place_order'],
    premium: ['view_products', 'create_design', 'save_project', 'place_order', 'advanced_features'],
    admin: ['view_products', 'create_design', 'save_project', 'place_order', 'advanced_features', 'manage_products', 'view_analytics', 'manage_users'],
    superadmin: ['*'] // All permissions
  };

  const userPermissions = rolePermissions[this.role] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
};

// Method to check if user is admin or superadmin
UserSchema.methods.isAdmin = function() {
  return this.role === 'admin' || this.role === 'superadmin';
};

// Method to check if user is superadmin
UserSchema.methods.isSuperAdmin = function() {
  return this.role === 'superadmin';
};

// Method to update login info
UserSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Index for better query performance
// Note: email and username indexes are automatically created by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ lastLogin: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;