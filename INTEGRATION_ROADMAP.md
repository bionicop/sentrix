# System Integration Roadmap

**Status:** Post-restructuring - Core infrastructure ready
**Focus:** Auth, Database, and AI Pipeline completion

---

## ✅ COMPLETED

### Infrastructure
- [x] Shared packages restructured (errors, middleware, rbac, logger, httpclient)
- [x] Watson AI moved to ai-core (single source)
- [x] Removed duplicate agents_api folder
- [x] Event router config fixed (routes to ai-core)
- [x] Datasource IP resolution implemented
- [x] RBAC backend enforcement (permissions.go + middleware)
- [x] Comprehensive error codes (sync with UI)
- [x] All services compile successfully

### Architecture
- [x] ai-core contains Watson client
- [x] Services communicate via HTTP (not direct imports)
- [x] go.work updated with correct modules
- [x] Folder structure optimized

---

## 🚧 IN PROGRESS / NEXT STEPS

### Phase 1: Authentication & Authorization (Priority: CRITICAL)

#### Backend Tasks
- [ ] **Add Database Layer** (2-4 hours)
  - [ ] Create schema: users, roles, sessions, api_keys
  - [ ] Integrate GORM with PostgreSQL
  - [ ] User registration with email verification
  - [ ] Password reset flow

- [ ] **OAuth Integration** (3-4 hours)
  - [ ] Google OAuth endpoints (`/auth/google`, `/auth/google/callback`)
  - [ ] Store OAuth tokens securely
  - [ ] Link OAuth accounts to users

- [ ] **Email Service** (2-3 hours)
  - [ ] SMTP client setup (go-mail)
  - [ ] Email verification templates
  - [ ] Password reset templates
  - [ ] Welcome email

- [ ] **Enhanced JWT** (1-2 hours)
  - [ ] Include permissions in JWT claims
  - [ ] Refresh token mechanism
  - [ ] Token blacklist (logout)

- [ ] **API Gateway RBAC** (2-3 hours)
  - [ ] Apply `RequirePermission()` to all protected routes
  - [ ] Return user permissions on login
  - [ ] Add `/me` endpoint for current user

#### Frontend Tasks
- [ ] **Connect to Backend Auth** (3-4 hours)
  - [ ] Update login service to use real API
  - [ ] Store JWT properly
  - [ ] Extract role from JWT claims
  - [ ] Auto-redirect on 401

- [ ] **OAuth Flow** (2-3 hours)
  - [ ] "Sign in with Google" button
  - [ ] Handle OAuth callback
  - [ ] Redirect to dashboard on success

- [ ] **Registration Flow** (2-3 hours)
  - [ ] Registration form with validation
  - [ ] Email verification page
  - [ ] Resend verification email

- [ ] **Password Reset** (2 hours)
  - [ ] Forgot password form
  - [ ] Reset password page
  - [ ] Token validation

- [ ] **Permissions from Backend** (1-2 hours)
  - [ ] Read permissions from JWT
  - [ ] Remove hardcoded roleConfig permissions
  - [ ] Disable UI elements based on permissions

**Total Estimated Time:** 22-31 hours (3-4 days)

---

### Phase 2: Database Persistence (Priority: HIGH)

#### Tasks
- [ ] **Events Table** (2-3 hours)
  - [ ] Schema: id, type, severity, message, source_host, source_ip, timestamp
  - [ ] AI analysis fields: severity_ai, explanation, recommended_action
  - [ ] Store raw_payload

- [ ] **Alerts Table** (2 hours)
  - [ ] Link to events
  - [ ] Status tracking (new, acknowledged, dismissed, resolved)
  - [ ] Assignment tracking

- [ ] **Tickets Table** (2 hours)
  - [ ] Already defined in API Gateway
  - [ ] Persist to database
  - [ ] Link to alerts

- [ ] **Devices Table** (2-3 hours)
  - [ ] Device registry
  - [ ] Last seen tracking
  - [ ] Metadata storage

- [ ] **Update API Gateway** (3-4 hours)
  - [ ] Replace in-memory stores with DB queries
  - [ ] Add pagination
  - [ ] Add filtering/sorting
  - [ ] Optimize queries

**Total Estimated Time:** 11-14 hours (1.5-2 days)

---

### Phase 3: AI Pipeline Enhancement (Priority: HIGH)

#### Tasks
- [ ] **AI-Core Persistence** (2-3 hours)
  - [ ] Store AI results in database
  - [ ] Cache recent analyses
  - [ ] Track AI metrics (accuracy, latency)

- [ ] **Event Router Enhancement** (2-3 hours)
  - [ ] Dynamic routing based on config
  - [ ] Retry logic for failed routes
  - [ ] Circuit breaker pattern

- [ ] **AI Response Enrichment** (2 hours)
  - [ ] ai-core forwards enriched event to API Gateway
  - [ ] Include confidence score
  - [ ] Include processing time

- [ ] **RAG Connector** (8-12 hours) - Optional
  - [ ] Vector database setup (Chroma, Qdrant, or watsonx.discovery)
  - [ ] Ingest MIB files, vendor docs
  - [ ] Context retrieval in prompts

- [ ] **Rule Engine** (6-8 hours) - Optional
  - [ ] JSON rule definitions
  - [ ] Pattern matching
  - [ ] Quick-fix recommendations

**Total Estimated Time:** 12-18 hours (RAG/Rules optional, +14-20 hours)

---

### Phase 4: Complete Role-Specific Features (Priority: MEDIUM)

#### SRE Role
- [ ] `/api/v1/incidents/*` endpoints
- [ ] `/api/v1/services/*` endpoints
- [ ] `/api/v1/sla-reports/*` endpoints
- [ ] Reliability trends API

#### Network Admin Role
- [ ] `/api/v1/topology/*` endpoints
- [ ] `/api/v1/bandwidth/*` endpoints
- [ ] Device management enhancements
- [ ] Configuration audit log

#### Senior Engineer Role
- [ ] `/api/v1/patterns/*` endpoints
- [ ] `/api/v1/team-metrics/*` endpoints
- [ ] Trend analysis API
- [ ] Pattern detection

**Total Estimated Time:** 16-24 hours (2-3 days)

---

### Phase 5: Metadata Enrichment (Priority: MEDIUM)

#### Tasks
- [ ] **Device Registry** (4-6 hours)
  - [ ] Store device metadata (location, model, vendor)
  - [ ] API for device CRUD
  - [ ] Auto-discovery integration

- [ ] **Metadata Enricher Service** (3-4 hours)
  - [ ] Enrich events with device details
  - [ ] Interface mapping
  - [ ] Location tagging

**Total Estimated Time:** 7-10 hours (1 day)

---

### Phase 6: External Integrations (Priority: LOW)

#### ServiceNow Connector
- [ ] ServiceNow REST API client (4-6 hours)
- [ ] Incident creation workflow
- [ ] Status sync

#### Kafka Integration (Optional)
- [ ] Kafka producer/consumer (6-8 hours)
- [ ] Async event processing
- [ ] Event replay capability

**Total Estimated Time:** 10-14 hours (1-2 days)

---

## 📊 Overall Progress

| Category | Status | Completion |
|----------|--------|-----------|
| Infrastructure | ✅ Complete | 100% |
| Auth & RBAC (Backend) | 🔵 In Progress | 60% |
| Auth & RBAC (Frontend) | 🔴 Not Started | 0% |
| Database | 🔴 Not Started | 0% |
| AI Pipeline | 🟡 Partial | 50% |
| Role APIs | 🔴 Not Started | 20% |
| Metadata | 🔴 Not Started | 0% |
| Integrations | 🔴 Not Started | 0% |
| **OVERALL** | 🟡 **In Progress** | **35%** |

---

## 🎯 Recommended Order

### Week 1: Core Functionality
1. **Days 1-2:** Auth & OAuth (Backend + Frontend) ← YOU ARE HERE
2. **Days 3-4:** Database persistence
3. **Day 5:** AI pipeline completion

### Week 2: Features & Polish
4. **Days 6-7:** Role-specific APIs
5. **Days 8-9:** Metadata enrichment
6. **Day 10:** Testing & bug fixes

### Optional (Week 3+)
7. RAG Connector
8. Rule Engine
9. ServiceNow integration
10. Kafka

---

## 🔥 Critical Path (Must-Have for MVP)

1. ✅ Infrastructure (DONE)
2. **Auth & Database** (IN PROGRESS) ← Critical for multi-user
3. **AI Pipeline** (PARTIAL) ← Critical for core value
4. **Basic RBAC** (PARTIAL) ← Critical for security

## 🌟 Nice-to-Have (Can Defer)

- Advanced role features (SRE topology, etc.)
- RAG/Rule engine
- External integrations
- Advanced analytics

---

## Next Immediate Steps (Today)

1. Get Google OAuth credentials
2. Get Gmail App Password or SendGrid key
3. Setup PostgreSQL database
4. Implement user registration/login (backend)
5. Connect UI authentication to backend
6. Test OAuth flow

**Time Required:** 6-8 hours
**Impact:** HIGH - Enables multi-user with roles

---

*Last Updated: January 24, 2026*
