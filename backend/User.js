const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * -----------
 * Every user belongs to exactly ONE tenant (tenantId).
 * The `role` enum drives RBAC — checked in the `authorizeRoles` middleware.
 *
 * Role hierarchy (highest to lowest privilege):
 *   Owner  -> full control, billing, can delete the tenant, manage all users
 *   Admin  -> manage leads & users, cannot touch billing/tenant deletion
 *   Member -> create/edit their own leads, read team leads
 *   Viewer -> read-only access
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned by default in queries
    },

    // --- Multi-tenancy anchor ---
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true, // every query filters on this, so index it
    },

    // --- RBAC ---
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member', 'Viewer'],
      default: 'Member',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Composite index: an email only needs to be unique WITHIN a tenant,
// not globally. This lets the same person's email exist across two
// different client companies without collision — a common real-world SaaS need.
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Hash password before save
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to verify password on login
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
