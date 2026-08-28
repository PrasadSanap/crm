const mongoose = require('mongoose');

/**
 * Tenant (Organization) Schema
 * ----------------------------
 * Every company that signs up for the SaaS is a "Tenant".
 * The Tenant's _id becomes the isolation key (tenantId) that is
 * stamped onto every other document (Users, Leads, etc.) in the system.
 * This is the root of our multi-tenancy model.
 */
const tenantSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 150,
    },

    // Used for subdomain-based or slug-based tenant resolution if needed later
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Billing / SaaS monetization fields
    stripeCustomerId: {
      type: String,
      default: null,
      select: false, // never leak billing IDs in default queries
    },
    subscriptionStatus: {
      type: String,
      enum: ['trialing', 'active', 'past_due', 'canceled', 'incomplete'],
      default: 'trialing',
    },
    planTier: {
      type: String,
      enum: ['free', 'starter', 'pro', 'enterprise'],
      default: 'free',
    },
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
    },

    // Soft-delete / suspension support instead of hard deletes (safer for audits + billing disputes)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
