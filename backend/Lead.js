const mongoose = require('mongoose');

/**
 * Lead Schema
 * -----------
 * The core CRM entity. Every lead is stamped with the tenantId of the
 * company that owns it. This field is the single most important line
 * of defense against cross-tenant data leaks — every query in the
 * controller layer MUST filter on it.
 */
const leadSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true, // compound index below covers most query patterns
    },

    companyName: {
      type: String,
      required: [true, 'Lead company name is required'],
      trim: true,
      maxlength: 150,
    },

    contact: {
      name: { type: String, trim: true, maxlength: 100 },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },

    dealStage: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
      default: 'New',
      index: true,
    },

    dealValue: {
      type: Number,
      default: 0,
      min: [0, 'Deal value cannot be negative'],
    },

    // Who created/owns this lead within the tenant — useful for Member-level scoping
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    notes: {
      type: String,
      maxlength: 2000,
    },

    tags: [{ type: String, trim: true }],

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index: virtually every list/filter query is "give me tenant X's
// leads sorted/filtered by stage or recency" — this index makes that fast
// at scale instead of doing a collection scan filtered in application code.
leadSchema.index({ tenantId: 1, dealStage: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
