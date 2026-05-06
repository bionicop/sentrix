# Changelog

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
