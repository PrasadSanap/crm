# B2B SaaS CRM — Multi-Tenant Backend Architecture

MERN-stack backend for a Lead Management CRM, built with tenant isolation
and RBAC as first-class concerns rather than afterthoughts.

## Structure
```
crm-backend/
├── config/db.js              # Mongo connection
├── models/
│   ├── Tenant.js              # Organization/company + billing status
│   ├── User.js                # tenantId + role enum, scoped unique email
│   └── Lead.js                # tenantId-scoped CRM record
├── middleware/auth.js         # authenticate() + authorizeRoles() closure
├── controllers/leadController.js
├── routes/leadRoutes.js
├── utils/generateToken.js
├── server.js                  # security middleware stack + wiring
└── package.json
```

## Multi-tenancy model
This uses the **shared database, shared schema, discriminator column**
approach (a `tenantId` field on every collection) rather than
database-per-tenant. It's the standard pattern for early-stage B2B SaaS
because it's cheap to operate and scales to thousands of tenants on a
single cluster, at the cost of needing rigorous, consistent query-level
filtering — which is why every read/write in this codebase funnels
through `req.user.tenantId` sourced from the verified JWT session, never
from client-supplied input.

## Interview Talking Points

**1. Tenant isolation is enforced at the data-access layer, not the UI.**
The `tenantId` is never accepted from `req.body` or `req.query` — it is
derived exclusively from the authenticated session (re-fetched from the
DB on every request in `authenticate`). This means even a compromised or
malicious frontend cannot forge access to another company's data,
because the isolation boundary lives in the API layer where it can't be
bypassed by client-side tampering. I'd also mention the natural next
step at scale: enforcing this at the database layer too, via MongoDB
schema validation or a query middleware/plugin (e.g. a Mongoose
pre-hook on `find`) that automatically injects the tenant filter, so a
missing `.find({ tenantId })` in a future controller can't silently leak
data — defense in depth instead of relying on developer discipline alone.

**2. RBAC is implemented as a composable middleware factory, not scattered if/else checks.**
`authorizeRoles(...roles)` returns a closure, so route definitions read
declaratively (`authorizeRoles('Admin', 'Owner')`) instead of embedding
permission logic inside controllers. This keeps authorization a
cross-cutting concern, testable in isolation, and trivially extensible —
adding a new role or a new permission combination is a one-line change
in the route file, not a hunt through business logic. It also means
authorization decisions happen *before* any controller code runs,
following the principle of failing closed as early as possible in the
request lifecycle.

**3. Security is layered, not single-point.** NoSQL injection is blocked
both structurally (whitelisting fields instead of spreading `req.body`
into Mongoose calls, casting query params to expected types/enums
before use) and via middleware (`express-mongo-sanitize` stripping `$`/`.`
operators globally). Combined with `helmet`, rate limiting, and JWT
re-validation against live user state (so a demoted or deactivated user
is locked out immediately, not just after token expiry), this
demonstrates defense-in-depth thinking — the kind of layered security
posture interviewers look for beyond "I added a login route."

## Suggested extensions (mention if asked "what would you add next?")
- Refresh tokens + token rotation/revocation list
- Audit log collection (who changed what lead, when) — critical for B2B trust
- Per-tenant rate limiting / usage quotas tied to `planTier`
- Mongoose plugin to auto-inject `tenantId` filters on all queries as a second layer of defense
- Soft-delete + tenant data export for compliance (GDPR "right to access")
