# Changelog

## 2026-07-16

### Security Hardening

- **SEC-H1 (High)** Removed hardcoded HMAC fallback secret from `auth_oauth.go` — replaced with panic so missing `JWT_SECRET` is immediately visible
- **SEC-M1 (Medium)** PostgreSQL `sslmode` default changed from `disable` → `require` in both ingestor and datasource; override with `POSTGRES_SSLMODE=disable` for local dev
- **SEC-M2 (Medium)** Added `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` response headers to all Vercel routes via `vercel.json`
- **SEC-M3 (Medium)** Added `RequestBodyLimit(4MB)` global middleware — blocks oversized JSON payloads before they're read into memory (prevents DoS via large request bodies)
- **SEC-M4 (Medium)** `GIN_MODE` default changed from `debug` → `release` — prevents stack trace leakage in HTTP error responses
- **SEC-L1 (Low)** `ChangePassword` handler now enforces full password strength rules (uppercase + digit + special char) — was previously only checking minimum length
- **SEC-L2 (Low)** `router.SetTrustedProxies` now reads `TRUSTED_PROXIES` env var — operators can pin to actual proxy CIDR blocks to prevent IP spoofing bypass of rate limiter

### AI — Production-grade CVE Matching

Replaced keyword-only `strings.Contains` matching in `ai-core/cve.go` with a multi-signal BM25+IDF scoring engine:

- **Vendor alias expansion** — 18 vendors mapped to product families (cisco→ios/iosxe/asa/catalyst, juniper→junos/srx, fortinet→fortigate/fortios, etc.)
- **Multi-field weighted scoring** — CVE ID ref (20), vendor exact (10), vendor token (5), product exact (8), product token (4), description tokens × IDF (2), protocol co-occurrence (3), vuln type co-occurrence (2)
- **CVSS boost** — score multiplied by `1 + (cvss/20)` so critical CVEs rank higher for same textual match
- **No random fallback** — removed the "return most recent CVEs" fallback that was injecting noise into Watson prompts; now returns empty when nothing scores ≥ 3
- **Enriched RAG blocks** — CVE entries now include 120-char description snippets so Watson understands the vulnerability type, not just the ID

### UI — Design System Token Standardization

All `__content` wrapper gaps now use the canonical `$tok-page-content-gap` token (single source of truth):

- Fixed 9 page stylesheets: `_alert-details`, `_dashboard`, `_audit-log`, `_device-groups`, `_incident-history`, `_on-call`, `_post-mortems`, `_priority-alerts`, `_topology`
- Removed old `--page-*` CSS custom properties from `index.scss` — `--sentrix-*` is now the only token system
- Fixed topology page double-padding (was stacking `padding: $spacing-06` inside `.cds--content`'s global padding)

### UI — Alert Details AI Loading State

`AlertDetailsPage` now has three distinct states for the AI Explanation card:

- **Analyzing** (`isReanalyzing=true`) — `InlineLoading` spinner in header + pulsing `SkeletonText` for all 4 sections (Summary / Root Cause / Business Impact / Recommended Actions)
- **Pending** (no analysis yet) — Watson icon + "No AI analysis yet" empty state with "Click Re-analyze" hint
- **Ready** — existing layout unchanged

### UI — `useThemeDetection` Hook

Eliminated 16-line duplicate `detectTheme` `useEffect` + `useState` blocks from all 4 dashboard views (`NetworkOpsView`, `SeniorEngineerView`, `NetworkAdminView`, `SysAdminView`) — each now calls `useThemeDetection()` from the shared hooks barrel.

### UI — Input Limits (ticket/comment forms)

Added character limits with live Carbon `enableCounter` display:

- Comment `TextArea` — 2000 chars
- Ticket title `TextInput` — 256 chars
- Ticket description `TextArea` — 5000 chars
- Resolution notes `TextArea` — 2000 chars

---

## Latest Updates (January 2026)

### Dashboard Enhancements

#### Critical Alert Ticker - Animated & Interactive
**Location:** `ui/src/pages/dashboard/index.tsx`

A new animated ticker component that displays critical alerts with automatic rotation:

**Features:**
- ✅ Auto-rotates through critical alerts every 5 seconds
- ✅ Smooth slide-in animation when alerts change
- ✅ Clickable to navigate to alert details page
- ✅ Visual indicators (dots) show position in alert list
- ✅ Keyboard accessible (Enter/Space keys)
- ✅ Shows "No active critical alerts" when none exist
- ✅ Displays up to 5 most recent critical alerts

**Technical Implementation:**
```typescript
// Filters and rotates critical alerts
const tickerAlerts = useMemo(() =>
    recentAlerts.filter(a => a.severity === 'critical').slice(0, 5),
    [recentAlerts]
);

// Auto-rotation with 5-second interval
useEffect(() => {
    if (tickerAlerts.length <= 1) {
        setCurrentTickerIndex(0);
        return;
    }
    const interval = setInterval(() => {
        setCurrentTickerIndex((prev) => (prev + 1) % tickerAlerts.length);
    }, 5000);
    return () => clearInterval(interval);
}, [tickerAlerts.length]);
```

**Navigation:**
- Clicking ticker navigates to: `/alerts/:id` (correct route)
- Fixed navigation path from `/alert/:id` to `/alerts/:id`

**Styling:**
- Animation: `slideIn` keyframe (0.5s ease-out)
- Hover effects for better UX
- Located in: `ui/src/styles/DashboardPage.scss`

### Code Quality Improvements

#### Removed Development Comments
- Removed all "✅ FIXED", "UNCHANGED", and placeholder comments
- Cleaned up dashboard file for production readiness
- Kept only useful, descriptive comments

#### React Hooks Compliance
- Fixed React Hooks violations (Error #310)
- Ensured all hooks are called at top level in consistent order
- Proper cleanup functions in useEffect hooks

### Documentation Updates

#### UI_SCREENS.md
**Added:** Complete Critical Alert Ticker documentation
- Implementation details with code examples
- JSX structure reference
- Styling guidelines
- Feature list and behavior description

**Location:** `docs/docs/UI_SCREENS.md` (Dashboard Page section)

#### README Files
**Updated:** Feature descriptions in:
- `docs/README.md` - Main documentation
- `ui/README.md` - UI-specific README

**Changes:** Added mention of animated Critical Alert Ticker feature

### Bug Fixes

#### Navigation Path Correction
- **Before:** `/alert/${id}` (404 error)
- **After:** `/alerts/${id}` (correct route)
- **Impact:** Users can now click ticker alerts and reach detail pages

#### Ticker Animation
- **Issue:** Alerts not changing/rotating
- **Fix:** Added `key` prop to force re-render on index change
- **Result:** Smooth animation transitions between alerts

### Files Modified

1. **ui/src/pages/dashboard/index.tsx**
   - Added Critical Alert Ticker component
   - Implemented rotation logic
   - Fixed navigation paths
   - Removed development comments

2. **ui/src/styles/DashboardPage.scss**
   - Added `.alert-item-animated` styles
   - Added `slideIn` keyframe animation
   - Added hover effects

3. **docs/docs/UI_SCREENS.md**
   - Added Critical Alert Ticker documentation
   - Updated Dashboard Page section
   - Added code examples and implementation details

4. **ui/README.md**
   - Updated Key Features section
   - Added ticker auto-rotation mention

### Deployment

**Docker Deployment:**
All changes have been deployed via Docker:
```bash
cd ui
docker compose up -d --build
```

**Local Development (Verified Working):**
Services can be run locally following the correct startup order:
```bash
# 1. Start infrastructure
cd ui && docker compose up -d postgres kafka zookeeper

# 2. Start backend services (in order)
cd ingestor/ingestor_core && go run main.go      # Port 8001
cd ingestor/event_router && go run main.go        # Port 8082
cd ingestor/api_gateway && go run main.go         # Port 8080
cd datasource && go run main.go                   # (Optional) Sends events

# 3. Start UI
cd ui && VITE_USE_MOCK=false npm run dev          # Port 5173
```

**Verification:**
- Docker: Visit http://localhost:3000/dashboard
- Local Dev: Visit http://localhost:5173/dashboard
- Observe: Ticker rotates every 5 seconds (if multiple critical alerts exist)
- Click: Ticker alert navigates to detail page (`/alerts/:id`)
- Check: Animation plays smoothly on alert change
- Verify: API Gateway logs show successful requests

### Testing Checklist

- [x] Ticker displays critical alerts
- [x] Auto-rotation works (5-second interval)
- [x] Animation plays on alert change
- [x] Clicking navigates to correct route (`/alerts/:id`)
- [x] Keyboard navigation works (Enter/Space)
- [x] Shows "No alerts" message when appropriate
- [x] Indicator dots show current position
- [x] No React Hooks errors in console
- [x] No navigation 404 errors

### Environment

**Requirements:**
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Go 1.23+ (for backend)

**Ports:**
- UI: http://localhost:3000
- API Gateway: http://localhost:8080
- Database: localhost:5432

### Known Issues

None currently. All features working as expected.

### Next Steps

Consider future enhancements:
- Configurable rotation interval (via settings)
- Pause rotation on hover
- Sound notification on new critical alert
- Alert preview on ticker hover
