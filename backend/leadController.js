const mongoose = require('mongoose');
const Lead = require('./Lead');

/**
 * @route   GET /api/leads
 * @access  Private (any authenticated role — Viewer included)
 * @desc    Fetch leads STRICTLY scoped to the requesting user's tenant.
 *
 * Multi-tenant isolation explained:
 *   req.user.tenantId comes from the `authenticate` middleware, which
 *   re-derives it from the database — it is NEVER read from client input
 *   (query params/body). This is critical: if tenantId were accepted from
 *   the request, any user could simply pass another company's tenantId
 *   and read their data. By sourcing it exclusively from the verified
 *   session, cross-tenant leakage is structurally impossible here.
 */
const getLeads = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // --- NoSQL injection guardrails ---
    // Query/body values are cast to primitives (String/Number) before being
    // used in the filter. This neutralizes payloads like
    // { "dealStage": { "$ne": null } } sent via query string parsing,
    // because we never spread raw req.query into the Mongo filter object.
    const { dealStage, page = 1, limit = 20, search } = req.query;

    const filter = { tenantId }; // base filter — always present, never optional

    if (dealStage && typeof dealStage === 'string') {
      const allowedStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
      if (allowedStages.includes(dealStage)) {
        filter.dealStage = dealStage;
      }
    }

    if (search && typeof search === 'string') {
      // Escape regex special characters to prevent ReDoS / regex-injection
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.companyName = { $regex: safeSearch, $options: 'i' };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100); // cap page size

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('ownerId', 'name email'),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads', error: error.message });
  }
};

/**
 * @route   POST /api/leads
 * @access  Private (Member, Admin, Owner — Viewer excluded via route middleware)
 * @desc    Create a lead. tenantId and ownerId are derived server-side,
 *          never trusted from the request body — this prevents a malicious
 *          or buggy client from creating a lead under a different tenant.
 */
const createLead = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;

    // Explicitly whitelist fields from the body instead of spreading req.body
    // directly into the model — prevents mass-assignment of protected fields
    // like tenantId, ownerId, or _id.
    const { companyName, contact, dealStage, dealValue, notes, tags } = req.body;

    if (!companyName) {
      return res.status(400).json({ success: false, message: 'companyName is required' });
    }

    const lead = await Lead.create({
      companyName,
      contact,
      dealStage,
      dealValue,
      notes,
      tags,
      tenantId, // <-- forced server-side, ignoring any tenantId sent in body
      ownerId: userId,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create lead', error: error.message });
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @access  Private (Admin, Owner only — enforced by authorizeRoles in routes)
 * @desc    Even here, the query filters by tenantId + _id together, so a
 *          user cannot delete another tenant's lead even by guessing/brute
 *          forcing a valid Mongo ObjectId.
 */
const deleteLead = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid lead id' });
    }

    const lead = await Lead.findOneAndDelete({ _id: id, tenantId });

    if (!lead) {
      // Same 404 whether it doesn't exist or belongs to another tenant —
      // never leak the existence of another tenant's data.
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, message: 'Lead deleted', data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lead', error: error.message });
  }
};

module.exports = { getLeads, createLead, deleteLead };
