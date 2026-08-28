const express = require('express');
const { authenticate, authorizeRoles } = require('./auth');
const { getLeads, createLead, deleteLead } = require('./leadController');

const router = express.Router();

// Every route below first runs `authenticate`, which populates
// req.user.tenantId and req.user.role from a verified session.
router.use(authenticate);

// Any authenticated role (Owner/Admin/Member/Viewer) can list leads —
// tenant scoping happens inside the controller itself.
router.get('/', getLeads);

// Viewers are read-only: excluded here since Member is the lowest role listed.
router.post('/', authorizeRoles('Owner', 'Admin', 'Member'), createLead);

// Only Admin and Owner can permanently delete a lead.
router.delete('/:id', authorizeRoles('Owner', 'Admin'), deleteLead);

module.exports = router;
