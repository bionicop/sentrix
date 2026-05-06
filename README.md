# Sentrix - AI-Powered Network Operations Center

Enterprise-grade NOC platform with AI-powered alert analysis, real-time event processing, and role-based multi-tenant access control.

![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![Carbon](https://img.shields.io/badge/IBM_Carbon-1.97-161616?logo=ibm&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka-7.5.0-231F20?logo=apachekafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Watson](https://img.shields.io/badge/IBM_Watson-Granite_3--8B-BE95FF?logo=ibm&logoColor=white)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Backend API Reference](#backend-api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [Database Schema](#database-schema)
- [Authentication & RBAC](#authentication--rbac)
- [IBM Watson AI Integration](#ibm-watson-ai-integration)
- [Docker Services](#docker-services)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Docker Desktop (4GB+ RAM allocated)
- Git

### Deploy

```bash
# Clone and navigate to infra
cd infra/prod

# Build all services in parallel
docker compose build --parallel

# Start all 11 containers
docker compose up -d

# Seed the database (schema + demo data)
docker compose exec -T postgres psql -U admin -d noc_alerts < postgres-init/init.sql

# Open the UI
open http://localhost:3000
```

### Default Credentials

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend UI** | [localhost:3000](http://localhost:3000) | `admin@admin.com` / `admin123` |
| **API Gateway** | [localhost:8080](http://localhost:8080) | JWT Bearer token |
| **Kafka UI** | [localhost:8090](http://localhost:8090) | N/A |
| **PgAdmin** | [localhost:5050](http://localhost:5050) | `admin@admin.com` / `root` |

PgAdmin database connection: `Host: postgres | Port: 5432 | DB: noc_alerts | User: admin | Password: secret`

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Go | 1.24.0 | Primary backend language |
| Gin | 1.11.0 | HTTP framework |
| GORM | 1.31.1 | ORM (PostgreSQL driver) |
| golang-jwt | 5.2.0 | JWT authentication |
| gin-contrib/cors | 1.5.0 | CORS middleware |
| go-mail | 0.5.2 | SMTP email service |
| golang.org/x/crypto | 0.40.0 | Password hashing (bcrypt) |
| golang.org/x/oauth2 | 0.23.0 | Google OAuth 2.0 |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool / dev server |
| @carbon/react | 1.97.0 | IBM Carbon Design System |
| @carbon/charts-react | 1.27.0 | Carbon charting library |
| @carbon/icons-react | 11.70.0 | Carbon icon set |
| @ibm/plex | 6.4.1 | IBM Plex typeface |
| react-router-dom | 7.9.6 | Client-side routing |
| Sass | 1.97.1 | SCSS styling |
| Playwright | 1.58.1 | E2E testing |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15-alpine | Primary database |
| Apache Kafka | 7.5.0 (Confluent) | Event streaming |
| Zookeeper | 7.5.0 (Confluent) | Kafka coordination |
| Nginx | (bundled in UI) | Reverse proxy / static serving |
| Docker Compose | v2 | Container orchestration |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + IBM Carbon Design System         │   │
│  │  Vite 7.2 | Port 3000 | 33 pages | 19 shared components  │   │
│  └───────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────-┘
                             │ HTTP (REST)
┌────────────────────────────▼────────────────────────────────────-┐
│                     API Gateway (Go / Gin)                        │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  18 handler files | 101 routes | JWT + RBAC               │   │
│  │  Port 8080 | Graceful shutdown | Rate limiting            │   │
│  └───────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────-┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐  ┌──────▼───────┐  ┌────────▼────────┐
│  Ingestor Core  │  │  Event       │  │  AI Core        │
│  Normalize      │  │  Router      │  │  IBM Watson     │
│  Validate       │  │  Kafka       │  │  Granite 3-8B   │
│  Enrich         │  │  Routing     │  │  Analysis       │
│  Port 8001      │  │  Port 8082   │  │  Port 9000      │
└────────┬────────┘  └──────┬───────┘  └────────┬────────┘
         │                  │                    │
         └──────────────────┼────────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │      Apache Kafka + Zookeeper       │
         │  Topic: ingestion-events            │
         │  Kafka: 9092 | Zookeeper: 2181      │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │         PostgreSQL 15               │
         │  Port 5432 | 17 tables | 40 indexes │
         └─────────────────────────────────────┘
```

### Data Flow

```
SNMP Trap / Syslog Event
    └──→ Datasource Simulator (realistic network events)
        └──→ Ingestor Core (normalize, validate, enrich)
            └──→ Event Router (classify + publish to Kafka)
                └──→ Kafka (ingestion-events topic)
                    └──→ AI Core (Watson: severity, root cause, remediation)
                        └──→ PostgreSQL (indexed persistent storage)
                            └──→ API Gateway (REST API, JWT + RBAC)
                                └──→ React UI (IBM Carbon Design)
```

---

## Project Structure

```
ibm-live-project-intern/
│
├── ingestor/                              # Go backend microservices
│   ├── api_gateway/                       # REST API server (Gin)
│   │   ├── handlers/                      # 18 handler files (9,844 lines)
│   │   │   ├── alerts.go                  #   Alert CRUD, analytics, state transitions (755 lines)
│   │   │   ├── auth.go                    #   Login, register, OAuth, password reset (942 lines)
│   │   │   ├── common.go                  #   Devices, metrics, health, trends, AI (1,380 lines)
│   │   │   ├── tickets.go                 #   Ticket lifecycle, comments, export (785 lines)
│   │   │   ├── runbooks.go                #   Runbook CRUD with RBAC (719 lines)
│   │   │   ├── configuration.go           #   Rules, channels, policies, windows (674 lines)
│   │   │   ├── users.go                   #   User management CRUD (632 lines)
│   │   │   ├── email_test_handler.go      #   Email template testing (599 lines)
│   │   │   ├── health_extended.go         #   Service health checks (530 lines)
│   │   │   ├── device_groups.go           #   Device group management (526 lines)
│   │   │   ├── sla.go                     #   SLA reports, violations, trends (490 lines)
│   │   │   ├── audit.go                   #   Audit log retrieval (436 lines)
│   │   │   ├── topology.go                #   Network topology (nodes + edges) (341 lines)
│   │   │   ├── service_status.go          #   Docker container monitoring (308 lines)
│   │   │   ├── profile.go                 #   User profile self-service (296 lines)
│   │   │   ├── oncall.go                  #   On-call schedule (258 lines)
│   │   │   ├── settings.go                #   Notification preferences (94 lines)
│   │   │   └── global_settings.go         #   Maintenance mode, auto-resolve, AI (79 lines)
│   │   ├── services/                      # Business logic services
│   │   │   ├── auth.go                    #   JWT token generation/validation
│   │   │   ├── email.go                   #   SMTP email with HTML templates
│   │   │   └── google_oauth.go            #   Google OAuth 2.0 flow
│   │   └── main.go                        #   Route registration, middleware, graceful shutdown (429 lines)
│   │
│   ├── shared/                            # Shared Go packages
│   │   ├── models/                        # GORM models (6 files, 699 lines)
│   │   │   ├── alert.go                   #   Alert, TimeSeriesPoint, NoisyDevice (134 lines)
│   │   │   ├── user.go                    #   User, Session, LoginRequest (133 lines)
│   │   │   ├── ticket.go                  #   Ticket, Comment, StringSlice (128 lines)
│   │   │   ├── configuration.go           #   ThresholdRule, NotificationChannel, etc. (127 lines)
│   │   │   ├── audit.go                   #   AuditLog, JSONB details (98 lines)
│   │   │   └── event.go                   #   IncomingEvent, IngestionData (79 lines)
│   │   ├── database/                      # GORM repositories (6 files, 1,576 lines)
│   │   │   ├── database.go                #   DB init, connection, auto-migrate (209 lines)
│   │   │   ├── alert_repo.go              #   Alert queries, time-series, summary (362 lines)
│   │   │   ├── user_repo.go               #   User CRUD, GetAll, SoftDelete (288 lines)
│   │   │   ├── config_repo.go             #   Configuration entity CRUD (265 lines)
│   │   │   ├── ticket_repo.go             #   Ticket CRUD, stats, MTTR calc (261 lines)
│   │   │   └── audit_repo.go              #   Audit log queries, filtering (191 lines)
│   │   ├── middleware/                     # HTTP middleware
│   │   │   ├── auth.go                    #   JWT validation, RequireRole, RequireAnyPermission
│   │   │   ├── ratelimit.go               #   Token bucket rate limiter
│   │   │   ├── security.go                #   Security headers (HSTS, CSP, etc.)
│   │   │   ├── headers.go                 #   Custom header middleware
│   │   │   └── logger.go                  #   Request/response logging
│   │   ├── rbac/
│   │   │   └── permissions.go             #   5 roles, 13 permissions matrix
│   │   ├── config/                        #   Environment variable helpers
│   │   └── errors/                        #   Error types and handling
│   │
│   ├── event_router/                      # Kafka event routing service
│   ├── ingestor_core/                     # Event normalization pipeline
│   └── agents_api/                        # IBM Watson AI integration proxy
│
├── ui/                                    # React 19 frontend
│   ├── src/
│   │   ├── pages/                         # 33 page components (19,911 lines)
│   │   │   ├── dashboard/                 # Role-specific dashboards
│   │   │   │   ├── DashboardPage.tsx      #   Router - delegates to role views (34 lines)
│   │   │   │   └── views/
│   │   │   │       ├── SysAdminView.tsx   #   User mgmt, bulk actions, stats (1,728 lines)
│   │   │   │       ├── SeniorEngineerView.tsx  # Architecture metrics (772 lines)
│   │   │   │       ├── NetworkOpsView.tsx #   Alert triage, ticket overview (569 lines)
│   │   │   │       ├── SREView.tsx        #   Reliability, SLA, MTTR (451 lines)
│   │   │   │       └── NetworkAdminView.tsx  # Device health, interfaces (436 lines)
│   │   │   ├── alerts/
│   │   │   │   ├── PriorityAlertsPage.tsx #   Alert list, filters, CSV export (654 lines)
│   │   │   │   ├── AlertDetailsPage.tsx   #   AI analysis, actions, history (372 lines)
│   │   │   │   └── components/            #   AIExplanation, AlertActions, DeviceInfoCard,
│   │   │   │                              #   HistoricalAlerts, RawTrapData (5 sub-components)
│   │   │   ├── tickets/
│   │   │   │   ├── TicketsPage.tsx         #   Ticket list, create, filter (687 lines)
│   │   │   │   └── TicketDetailsPage.tsx   #   Comments, status, assignment (538 lines)
│   │   │   ├── devices/
│   │   │   │   ├── DeviceGroupsPage.tsx    #   Group CRUD, color cards, device select (675 lines)
│   │   │   │   ├── DeviceDetailsPage.tsx   #   Real-time metrics charts (548 lines)
│   │   │   │   └── DeviceExplorerPage.tsx  #   Device list, health filter (405 lines)
│   │   │   ├── configuration/
│   │   │   │   └── ConfigurationPage.tsx   #   Rules, channels, policies, windows (1,179 lines)
│   │   │   ├── topology/
│   │   │   │   └── TopologyPage.tsx        #   Network map, connections table (1,113 lines)
│   │   │   ├── incidents/
│   │   │   │   └── IncidentHistoryPage.tsx #   Resolved incidents, MTTR, root cause (1,047 lines)
│   │   │   ├── runbooks/
│   │   │   │   └── RunbooksPage.tsx        #   Runbook CRUD, step editor (999 lines)
│   │   │   ├── reports/
│   │   │   │   ├── SLAReportsPage.tsx      #   SLA compliance, violations (976 lines)
│   │   │   │   └── ReportsHubPage.tsx      #   5 report types, CSV download (395 lines)
│   │   │   ├── service-status/
│   │   │   │   └── ServiceStatusPage.tsx   #   Docker containers, log viewer (949 lines)
│   │   │   ├── oncall/
│   │   │   │   └── OnCallPage.tsx          #   Schedule, overrides (926 lines)
│   │   │   ├── admin/
│   │   │   │   └── AuditLogPage.tsx        #   Audit trail, KPIs, CSV export (855 lines)
│   │   │   ├── profile/
│   │   │   │   └── ProfilePage.tsx         #   Avatar, account details, password (800 lines)
│   │   │   ├── trends/
│   │   │   │   └── TrendsPage.tsx          #   KPI trends, AI metrics (772 lines)
│   │   │   ├── settings/
│   │   │   │   ├── SettingsPage.tsx         #   Notification preferences (349 lines)
│   │   │   │   └── components/RoleSelector.tsx
│   │   │   ├── auth/
│   │   │   │   ├── login/index.tsx          #   Email + Google OAuth login (285 lines)
│   │   │   │   ├── register/index.tsx       #   Registration with validation (274 lines)
│   │   │   │   └── forgot-password/index.tsx
│   │   │   ├── welcome/WelcomePage.tsx
│   │   │   └── not-found/NotFoundPage.tsx
│   │   │
│   │   ├── components/                    # 19 shared components (3,093 lines)
│   │   │   ├── layout/
│   │   │   │   ├── AppHeader.tsx           #   Sidebar nav, grouped menus (786 lines)
│   │   │   │   ├── AuthHeader.tsx          #   Auth page header (109 lines)
│   │   │   │   ├── AppLayout.tsx           #   Main app shell (28 lines)
│   │   │   │   ├── AuthLayout.tsx          #   Auth page layout (22 lines)
│   │   │   │   └── PublicLayout.tsx        #   Public page layout (22 lines)
│   │   │   ├── ui/
│   │   │   │   ├── PageHeader/             #   Title, breadcrumb, action buttons (298 lines)
│   │   │   │   ├── KPICard/                #   Metric card with trend (158 lines)
│   │   │   │   ├── KPIRow.tsx              #   KPI card row layout (195 lines)
│   │   │   │   ├── FilterBar/              #   Search, dropdowns, quick tags (182 lines)
│   │   │   │   ├── EmptyState/             #   sm/md/lg empty state (95 lines)
│   │   │   │   ├── ChartWrapper.tsx        #   Chart container with title (148 lines)
│   │   │   │   ├── DataTableWrapper/       #   Carbon DataTable + pagination (109 lines)
│   │   │   │   ├── AlertTicker/            #   Scrolling alert ticker (113 lines)
│   │   │   │   ├── NoisyDevicesCard.tsx    #   Top noisy devices widget (125 lines)
│   │   │   │   └── WidgetErrorBoundary.tsx #   Error boundary for widgets (87 lines)
│   │   │   ├── widgets/
│   │   │   │   ├── ConfigAuditLog.tsx      #   Config audit trail widget (267 lines)
│   │   │   │   └── TopInterfaces.tsx       #   Top interfaces widget (138 lines)
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx      #   Route guard with role check (81 lines)
│   │   │   └── feedback/
│   │   │       └── Loading.tsx             #   Loading spinner (24 lines)
│   │   │
│   │   ├── features/                      # Feature modules (2,774 lines)
│   │   │   ├── alerts/
│   │   │   │   ├── services/alertService.ts   # Alert API + mock service (582 lines)
│   │   │   │   ├── hooks/useAlertActions.ts   # Alert action hooks (98 lines)
│   │   │   │   ├── hooks/useAlert.ts          # Single alert hook (61 lines)
│   │   │   │   └── types/alert.types.ts       # Alert TypeScript types (83 lines)
│   │   │   ├── tickets/
│   │   │   │   └── services/ticketService.ts  # Ticket API + mock service (460 lines)
│   │   │   ├── devices/
│   │   │   │   └── services/deviceService.ts  # Device API + mock service (411 lines)
│   │   │   ├── auth/
│   │   │   │   ├── services/authService.ts    # Auth API + mock service (397 lines)
│   │   │   │   └── services/userService.ts    # User management API (243 lines)
│   │   │   └── roles/
│   │   │       ├── config/roleConfig.ts       # Role permission definitions (211 lines)
│   │   │       ├── hooks/RoleProvider.tsx      # React role context (88 lines)
│   │   │       └── types/role.types.ts        # Role TypeScript types (85 lines)
│   │   │
│   │   ├── shared/
│   │   │   ├── config/
│   │   │   │   ├── api.config.ts              # 54 API endpoint constants, env config
│   │   │   │   └── demoData.ts                # Demo/fallback data
│   │   │   ├── constants/
│   │   │   │   ├── routes.ts                  # 25 route path constants
│   │   │   │   ├── charts.ts                  # Chart config helpers (area, donut, bar)
│   │   │   │   ├── colors.ts                  # Severity/status color mappings
│   │   │   │   ├── severity.tsx               # Severity badge rendering
│   │   │   │   ├── status.tsx                 # Status badge rendering
│   │   │   │   ├── tickets.tsx                # Ticket constants
│   │   │   │   └── devices.tsx                # Device type icons/colors
│   │   │   ├── services/
│   │   │   │   └── deviceGroupService.ts      # Device group API service (108 lines)
│   │   │   ├── api/
│   │   │   │   └── httpClient.ts              # Axios-like fetch wrapper with JWT
│   │   │   ├── types/                         # Shared TypeScript interfaces
│   │   │   └── utils/                         # Formatters, logger, error helpers
│   │   │
│   │   ├── contexts/
│   │   │   └── ToastContext.tsx                # Global toast notifications (161 lines)
│   │   │
│   │   └── styles/                            # 21 SCSS files (Carbon token-based)
│   │       ├── index.scss                     # Global entry point
│   │       ├── components/
│   │       │   ├── _kpi-card.scss
│   │       │   └── _noisy-devices.scss
│   │       └── pages/
│   │           ├── _alert-details.scss     ├── _audit-log.scss
│   │           ├── _auth.scss              ├── _configuration.scss
│   │           ├── _dashboard.scss         ├── _device-details.scss
│   │           ├── _device-explorer.scss   ├── _device-groups.scss
│   │           ├── _incident-history.scss  ├── _priority-alerts.scss
│   │           ├── _reports-hub.scss       ├── _runbooks.scss
│   │           ├── _service-status.scss    ├── _settings.scss
│   │           ├── _sla-reports.scss       ├── _ticket-details.scss
│   │           ├── _tickets.scss           └── _trends.scss
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── nginx.conf                         # Reverse proxy: /api/* → api-gateway:8080
│   └── Dockerfile                         # Multi-stage: npm build → nginx serve
│
├── ai-core/                               # IBM Watson AI service (Go)
│   ├── ai/                                # Watson client, token cache, prompt engineering
│   ├── gateway/                           # API gateway client for event enrichment
│   └── main.go
│
├── datasource/                            # Network event simulator (Go)
│   └── main.go                            # SNMP trap + syslog generator
│
├── infra/
│   └── prod/
│       ├── docker-compose.yml             # 11-container orchestration
│       ├── .env                           # Environment variables (ports, secrets, Watson keys)
│       └── postgres-init/
│           └── init.sql                   # 17 tables, 40 indexes, seed data (417 lines)
│
└── go.work                                # Go workspace (6 modules)
```

---

## Backend API Reference

**Base URL:** `http://localhost:8080/api/v1`

All protected routes require `Authorization: Bearer <jwt_token>` header.

### Internal Routes (API key protected)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `POST` | `/api/internal/events` | `IngestEvent` |
| `GET` | `/api/internal/health` | `GetHealth` |

### Public Routes (no auth)

| Method | Endpoint | Handler | Description |
|--------|----------|---------|-------------|
| `POST` | `/login` | `Login` | JWT login (email + password) |
| `POST` | `/register` | `Register` | User registration |
| `GET` | `/health` | `GetHealth` | Health check |
| `GET` | `/auth/google/login` | `GoogleLogin` | Google OAuth initiate |
| `GET` | `/auth/google/callback` | `GoogleCallback` | Google OAuth callback |
| `POST` | `/auth/verify-email` | `VerifyEmail` | Email verification |
| `POST` | `/auth/forgot-password` | `ForgotPassword` | Request password reset |
| `POST` | `/auth/reset-password` | `ResetPassword` | Execute password reset |
| `POST` | `/auth/resend-verification` | `ResendVerification` | Resend verification email |

### Protected Routes - Alerts (11 routes)

| Method | Endpoint | Handler | RBAC |
|--------|----------|---------|------|
| `GET` | `/alerts` | `GetAlerts` | Any authenticated |
| `GET` | `/alerts/summary` | `GetAlertsSummary` | Any authenticated |
| `GET` | `/alerts/severity-distribution` | `GetSeverityDistribution` | Any authenticated |
| `GET` | `/alerts/over-time` | `GetAlertsOverTime` | Any authenticated |
| `GET` | `/alerts/recurring` | `GetRecurringAlerts` | Any authenticated |
| `GET` | `/alerts/distribution/time` | `GetAlertDistributionTime` | Any authenticated |
| `GET` | `/alerts/:id` | `GetAlertByID` | Any authenticated |
| `POST` | `/alerts/:id/acknowledge` | `AcknowledgeAlert` | `acknowledge-alerts` |
| `POST` | `/alerts/:id/dismiss` | `DismissAlert` | `acknowledge-alerts` |
| `POST` | `/alerts/:id/resolve` | `ResolveAlert` | `acknowledge-alerts` |
| `POST` | `/alerts/:id/reanalyze` | `ReanalyzeAlert` | `acknowledge-alerts` |

### Protected Routes - Tickets (9 routes)

| Method | Endpoint | Handler | RBAC |
|--------|----------|---------|------|
| `GET` | `/tickets` | `GetTickets` | Any authenticated |
| `GET` | `/tickets/stats` | `GetTicketStats` | Any authenticated |
| `GET` | `/tickets/export` | `ExportTickets` | Any authenticated |
| `GET` | `/tickets/:id` | `GetTicketByID` | Any authenticated |
| `GET` | `/tickets/:id/comments` | `GetTicketComments` | Any authenticated |
| `POST` | `/tickets` | `CreateTicket` | `create-tickets` |
| `PUT` | `/tickets/:id` | `UpdateTicket` | `create-tickets` |
| `PATCH` | `/tickets/:id` | `UpdateTicket` | `create-tickets` |
| `DELETE` | `/tickets/:id` | `DeleteTicket` | `create-tickets` |
| `POST` | `/tickets/:id/comments` | `AddTicketComment` | `create-tickets` |

### Protected Routes - Devices (4 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/devices` | `GetDevices` |
| `GET` | `/devices/noisy` | `GetNoisyDevices` |
| `GET` | `/devices/:id` | `GetDeviceByID` |
| `GET` | `/devices/:id/metrics` | `GetDeviceMetrics` |

### Protected Routes - Device Groups (7 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/device-groups` | `GetDeviceGroups` |
| `GET` | `/device-groups/:id` | `GetDeviceGroupByID` |
| `POST` | `/device-groups` | `CreateDeviceGroup` |
| `PUT` | `/device-groups/:id` | `UpdateDeviceGroup` |
| `DELETE` | `/device-groups/:id` | `DeleteDeviceGroup` |
| `POST` | `/device-groups/:id/devices` | `AddDevicesToGroup` |
| `DELETE` | `/device-groups/:id/devices/:deviceId` | `RemoveDeviceFromGroup` |

### Protected Routes - Analytics (8 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/trends/kpi` | `GetTrendsKPI` |
| `GET` | `/ai/metrics` | `GetAIMetrics` |
| `GET` | `/ai/insights` | `GetAIInsights` |
| `GET` | `/ai/impact-over-time` | `GetAIImpactOverTime` |
| `GET` | `/reports/export` | `ExportReport` |
| `GET` | `/reports/sla` | `GetSLAOverview` |
| `GET` | `/reports/sla/violations` | `GetSLAViolations` |
| `GET` | `/reports/sla/trend` | `GetSLATrend` |

### Protected Routes - Operational (7 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/on-call/current` | `GetCurrentOnCall` |
| `GET` | `/on-call/schedule` | `GetOnCallSchedule` |
| `GET` | `/topology` | `GetTopology` |
| `GET` | `/service-status` | `GetServiceStatus` |
| `GET` | `/services/status` | `GetDockerServiceStatus` |
| `GET` | `/services/:name/logs` | `GetDockerServiceLogs` |
| `POST` | `/events` | `IngestEvent` |

### Protected Routes - Runbooks (5 routes)

| Method | Endpoint | Handler | RBAC |
|--------|----------|---------|------|
| `GET` | `/runbooks` | `GetRunbooks` | Any authenticated |
| `GET` | `/runbooks/:id` | `GetRunbookByID` | Any authenticated |
| `POST` | `/runbooks` | `CreateRunbook` | `sysadmin` or `senior-eng` |
| `PUT` | `/runbooks/:id` | `UpdateRunbook` | `sysadmin` or `senior-eng` |
| `DELETE` | `/runbooks/:id` | `DeleteRunbook` | `sysadmin` or `senior-eng` |

### Protected Routes - Profile & Settings (5 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/me` | `GetCurrentUser` |
| `PUT` | `/me` | `UpdateProfile` |
| `PUT` | `/me/password` | `ChangePassword` |
| `GET` | `/settings/notifications` | `GetNotificationPreferences` |
| `PUT` | `/settings/notifications` | `UpdateNotificationPreferences` |

### Admin Routes (sysadmin only, 9 routes)

| Method | Endpoint | Handler |
|--------|----------|---------|
| `GET` | `/users` | `GetUsers` |
| `GET` | `/users/:id` | `GetUserByID` |
| `PUT` | `/users/:id` | `UpdateUser` |
| `DELETE` | `/users/:id` | `DeleteUser` |
| `POST` | `/users/:id/reset-password` | `ResetUserPassword` |
| `GET` | `/audit-logs` | `GetAuditLogs` |
| `GET` | `/audit-logs/actions` | `GetAuditLogActions` |
| `GET` | `/configuration/global-settings` | `GetGlobalSettings` |
| `PUT` | `/configuration/global-settings` | `UpdateGlobalSettings` |

### Configuration Routes (sysadmin + senior-eng, 20 routes)

Full CRUD for 4 entities:

| Entity | Endpoints |
|--------|-----------|
| **Threshold Rules** | `GET/POST /configuration/rules`, `GET/PUT/DELETE /configuration/rules/:id` |
| **Notification Channels** | `GET/POST /configuration/channels`, `GET/PUT/DELETE /configuration/channels/:id` |
| **Escalation Policies** | `GET/POST /configuration/policies`, `GET/PUT/DELETE /configuration/policies/:id` |
| **Maintenance Windows** | `GET/POST /configuration/maintenance`, `GET/PUT/DELETE /configuration/maintenance/:id` |

**Total: 101 registered routes** (13 public + 2 internal + 86 protected)

---

## Frontend Pages & Components

### Sidebar Navigation

```
Operations
  ├── Dashboard (role-specific: SysAdmin | NetworkOps | SRE | NetworkAdmin | SeniorEng)
  ├── Priority Alerts
  ├── Tickets
  ├── On-Call Schedule
  └── Service Status

Infrastructure
  ├── Devices
  ├── Network Topology
  └── Device Groups

Analytics
  ├── Trends & Insights
  ├── Incident History
  ├── SLA Reports
  └── Reports Hub

Configuration
  ├── Alert Configuration
  └── Runbooks

Administration (sysadmin only)
  └── Audit Log

Settings
Profile
```

### Page Inventory (33 components, 19,911 lines)

| Page | Lines | Key Features |
|------|-------|-------------|
| **SysAdminView** | 1,728 | User CRUD, bulk actions, expandable rows, top performers, ticket distribution |
| **ConfigurationPage** | 1,179 | 4 config entity tabs, global settings (maintenance, auto-resolve, AI) |
| **TopologyPage** | 1,113 | Network map visualization, node/edge connections table |
| **IncidentHistoryPage** | 1,047 | Resolved incidents, MTTR analytics, root cause charts, SLA badges |
| **RunbooksPage** | 999 | Runbook CRUD, category filter, step editor, RBAC-gated write ops |
| **SLAReportsPage** | 976 | SLA compliance metrics, trend charts, violations table |
| **ServiceStatusPage** | 949 | Docker container status, live log viewer modal, auto-refresh |
| **OnCallPage** | 926 | Current on-call, weekly schedule grid, override management |
| **AuditLogPage** | 855 | Paginated audit trail, KPIs, date/action filters, CSV export |
| **ProfilePage** | 800 | Profile avatar, account details, password change form |
| **TrendsPage** | 772 | KPI trends (MTTR, escalations), AI accuracy metrics |
| **SeniorEngineerView** | 772 | Architecture metrics, performance analysis |
| **TicketsPage** | 687 | Ticket list, create modal, status/priority/assignee filters |
| **DeviceGroupsPage** | 675 | Group CRUD, color-coded cards, multi-select device picker |
| **PriorityAlertsPage** | 654 | Alert list, severity/time filters, CSV export |
| **NetworkOpsView** | 569 | Alert triage dashboard, ticket overview |
| **DeviceDetailsPage** | 548 | Real-time metric charts (CPU, memory, interfaces), period selector |
| **TicketDetailsPage** | 538 | Comments, status transitions, assignment, linked alert/device |
| **SREView** | 451 | Reliability metrics, SLA overview |
| **NetworkAdminView** | 436 | Device health table, interface stats |
| **DeviceExplorerPage** | 405 | Device list with health/location/type filters |
| **ReportsHubPage** | 395 | 5 report types, CSV download, last-generated tracking |
| **AlertDetailsPage** | 372 | AI analysis (root cause, impact, remediation), action buttons |
| **SettingsPage** | 349 | Notification channel preferences |

### Shared Components (19 components, 3,093 lines)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `AppHeader` | 786 | Sidebar navigation with grouped SideNavMenu items |
| `PageHeader` | 298 | Page title, breadcrumb trail, action buttons |
| `ConfigAuditLog` | 267 | Configuration audit trail widget |
| `KPIRow` | 195 | Row layout for KPI metric cards |
| `FilterBar` | 182 | Reusable: search input, dropdowns, quick filter tags, clear |
| `KPICard` | 158 | Metric card with value, trend indicator, change percentage |
| `ChartWrapper` | 148 | Chart container with title and resize handling |
| `TopInterfaces` | 138 | Top network interfaces widget |
| `NoisyDevicesCard` | 125 | Devices with most alerts widget |
| `AlertTicker` | 113 | Scrolling live alert ticker |
| `AuthHeader` | 109 | Auth pages branded header |
| `DataTableWrapper` | 109 | Carbon DataTable with built-in pagination |
| `EmptyState` | 95 | Empty state with icon, title, description, CTA (sm/md/lg) |
| `WidgetErrorBoundary` | 87 | React error boundary for dashboard widgets |
| `ProtectedRoute` | 81 | Route guard: auth check + role verification |
| `ToastContext` | 161 | Global toast notification provider (max 5, 5s auto-dismiss) |

### Frontend Services (6 services, 2,774 lines)

Each service follows the pattern: `Interface → MockService → APIService → factory → singleton export`

| Service | Lines | API Operations |
|---------|-------|---------------|
| `alertService` | 582 | getAlerts, getById, getSummary, acknowledge, dismiss, resolve, reanalyze, export |
| `ticketService` | 460 | getTickets, getById, create, update, delete, getStats, getComments, addComment |
| `deviceService` | 411 | getDevices, getById, getNoisy, getMetrics |
| `authService` | 397 | login, register, logout, verifyEmail, forgotPassword, resetPassword, googleLogin |
| `userService` | 243 | getUsers, getById, update, delete, resetPassword |
| `deviceGroupService` | 108 | getGroups, getById, create, update, delete, addDevices, removeDevice |

---

## Database Schema

### Tables (17 tables, 40 indexes)

Schema file: [`infra/prod/postgres-init/init.sql`](infra/prod/postgres-init/init.sql) (417 lines)

| # | Table | PK Type | Key Columns | Seed Records |
|---|-------|---------|-------------|--------------|
| 1 | `ingestion_data` | VARCHAR(50) | source, raw_data, timestamp | 0 |
| 2 | `ai_results` | VARCHAR(50) | alert_id, analysis (JSONB) | 0 |
| 3 | `alerts` | VARCHAR(50) | severity, status, device_name, ai_title, ai_summary, confidence | 10 |
| 4 | `alert_history` | VARCHAR(50) | alert_id, action, performed_by, timestamp | 2 |
| 5 | `devices` | VARCHAR(50) | name, ip, icon, model, vendor, location, status, alert_count | 10 |
| 6 | `ai_metrics` | SERIAL | name, value, change, trend | 3 |
| 7 | `users` | SERIAL | email (unique), password_hash, role, first_name, last_name, is_active | 1 |
| 8 | `sessions` | SERIAL | user_id (FK), token, expires_at | 0 |
| 9 | `api_keys` | SERIAL | user_id (FK), key_hash, permissions (JSONB) | 0 |
| 10 | `tickets` | VARCHAR(50) | title, priority, status, category, assignee, alert_id, device_id, device_name | 6 |
| 11 | `ticket_comments` | VARCHAR(50) | ticket_id, author, content | 3 |
| 12 | `threshold_rules` | VARCHAR(50) | name, condition, duration, severity, enabled | 5 |
| 13 | `notification_channels` | VARCHAR(50) | name, type (CHECK constraint), meta, active | 3 |
| 14 | `escalation_policies` | VARCHAR(50) | name, description, steps, active | 2 |
| 15 | `maintenance_windows` | VARCHAR(50) | name, schedule, duration, status | 2 |
| 16 | `audit_logs` | SERIAL | user_id (FK), username, action, resource, resource_id, details (JSONB), ip_address | 0 |
| 17 | `runbooks` | VARCHAR(50) | title, category, severity, steps (JSONB), tags (TEXT[]), author | 0 |

**Total seed records: ~47** (10 alerts + 10 devices + 3 ai_metrics + 1 user + 6 tickets + 3 comments + 5 rules + 3 channels + 2 policies + 2 maintenance windows + 2 alert_history)

### Index Strategy

- **40 indexes total** across all tables
- Composite indexes on frequently queried combinations (status + severity, created_at ranges)
- Foreign key indexes for referential integrity (user_id, ticket_id, alert_id)
- GIN index potential on `audit_logs.details` (JSONB) for search
- Soft-delete support (`deleted_at` column) across ticket, config, and user models
- `ON CONFLICT` upsert strategy for idempotent seed data

---

## Authentication & RBAC

### JWT Authentication

- Token generation via `golang-jwt/v5` with HS256 signing
- Token includes: `user_id`, `email`, `username`, `role`, `exp`
- Passed as `Authorization: Bearer <token>` header or `auth_token` HTTP-only cookie (OAuth)
- Auto-generated random secret in dev when `JWT_SECRET` env var is missing
- Demo mode: generates valid JWT when database is unavailable

### 5 User Roles

| Role | Slug | Dashboard View | Key Permissions |
|------|------|---------------|-----------------|
| System Administrator | `sysadmin` | SysAdminView | All permissions, user management, audit logs, global settings |
| Senior Engineer | `senior-eng` | SeniorEngineerView | Configuration management, runbooks, architecture metrics |
| Network Administrator | `network-admin` | NetworkAdminView | Device management, topology, interface monitoring |
| Site Reliability Engineer | `sre` | SREView | SLA reports, incident history, reliability metrics |
| NOC Operator | `network-ops` | NetworkOpsView | Dashboard monitoring, alert triage, ticket creation |

### 13 RBAC Permissions

```
view-dashboard, view-alerts, acknowledge-alerts, manage-alerts,
view-tickets, create-tickets, manage-tickets,
view-devices, manage-devices,
view-config, manage-config,
view-reports, manage-users
```

### Demo Mode

When the database is unavailable, the API gateway falls back to demo mode:
- Generates valid JWT tokens for login
- Maps email patterns to roles: `admin@*` → sysadmin, `sre@*` → sre, etc.
- Returns hardcoded demo data for all endpoints
- All write operations succeed but don't persist

---

## IBM Watson AI Integration

**Model:** `ibm/granite-3-8b-instruct`

### Capabilities

| Feature | Description |
|---------|-------------|
| Severity Classification | Automatic classification: critical, major, minor, info |
| Root Cause Analysis | Natural language root cause identification |
| Impact Assessment | Affected systems and blast radius estimation |
| Remediation | Step-by-step recommended fix actions |
| Confidence Scoring | 0-100 confidence score for AI decisions |
| Re-analysis | On-demand re-analysis via `/alerts/:id/reanalyze` |

### Configuration

Set in `infra/prod/.env`:

```bash
WATSONX_API_KEYS=your_api_key_here     # Comma-separated for rotation
WATSONX_PROJECT_ID=your_project_id
WATSONX_REGION=eu-gb                    # eu-gb, us-south, etc.
```

### Features

- Multi-key API rotation for high availability
- IAM token caching with automatic refresh
- Graceful fallback when AI service is unavailable
- Real-time event enrichment during ingestion pipeline

---

## Docker Services

11 containers managed by Docker Compose:

| # | Container | Image | Port | Health Check | Dependencies |
|---|-----------|-------|------|-------------|--------------|
| 1 | `postgres` | postgres:15-alpine | 5432 | `pg_isready` | - |
| 2 | `pgadmin` | dpage/pgadmin4 | 5050 | - | postgres |
| 3 | `zookeeper` | cp-zookeeper:7.5.0 | 2181 | - | - |
| 4 | `kafka` | cp-kafka:7.5.0 | 9092 | - | zookeeper |
| 5 | `kafka-ui` | provectuslabs/kafka-ui | 8090 | - | kafka |
| 6 | `api-gateway` | Custom (Go) | 8080 | `/api/v1/health` | postgres, kafka |
| 7 | `ingestor-core` | Custom (Go) | 8001 | `/health` | kafka |
| 8 | `event-router` | Custom (Go) | 8082 | `/health` | kafka |
| 9 | `ai-core` | Custom (Go) | 9000 | - | api-gateway |
| 10 | `datasource` | Custom (Go) | - | - | event-router, ingestor-core |
| 11 | `ui` | Custom (Vite + nginx) | 3000 | - | api-gateway |

### Container Operations

```bash
cd infra/prod

# Rebuild a specific service
docker compose build api-gateway && docker compose up -d api-gateway

# Rebuild everything
docker compose build --parallel && docker compose up -d

# View logs
docker compose logs -f api-gateway
docker compose logs -f ui

# Full reset (wipe all volumes and data)
docker compose down -v
docker compose build --parallel
docker compose up -d
docker compose exec -T postgres psql -U admin -d noc_alerts < postgres-init/init.sql
```

---

## Development Guide

### Local Frontend Development

```bash
cd ui
npm install
npm run dev              # Vite dev server on :5173 (HMR enabled)
npm run build            # TypeScript check + Vite production build
npm run lint             # ESLint
npm run test             # Playwright E2E tests
npm run test:headed      # Playwright with browser visible
```

### Local Backend Development

```bash
# Requires Go 1.24+
cd ingestor/api_gateway
go run main.go           # API server on :8080
```

### Build Verification

```bash
# Go: build all 6 workspace modules
go build ./ingestor/api_gateway/...
go build ./ingestor/event_router/...
go build ./ingestor/ingestor_core/...
go build ./ingestor/shared/...
go build ./ai-core/...
go build ./datasource/...

# TypeScript: type-check all frontend code
cd ui && npx tsc --noEmit
```

### Adding a New Page

1. Create page component in `ui/src/pages/<domain>/<PageName>.tsx`
2. Add route constant to `ui/src/shared/constants/routes.ts`
3. Add lazy route in `ui/src/App.tsx`
4. Add sidebar entry in `ui/src/components/layout/AppHeader.tsx`
5. Add SCSS file in `ui/src/styles/pages/_<page-name>.scss` and import in `index.scss`

### Adding a New API Endpoint

1. Add handler function in `ingestor/api_gateway/handlers/<domain>.go`
2. Register route in `ingestor/api_gateway/main.go` with appropriate RBAC middleware
3. Add endpoint constant in `ui/src/shared/config/api.config.ts`
4. Add to relevant frontend service in `ui/src/features/<domain>/services/`

### Key Patterns

| Pattern | Description |
|---------|-------------|
| Backend handlers | Check role → check demo mode → validate input → query DB → return JSON |
| Frontend services | Interface → MockService → APIService → factory function → singleton export |
| Page structure | PageHeader → KPI row → main content (table/chart) → modals |
| Chart options | Use `createAreaChartOptions` / `createDonutChartOptions` from `shared/constants/charts.ts` |
| Theme detection | MutationObserver on `data-theme-setting` attribute |
| Toast notifications | `useToast()` hook from `ToastContext` - all pages use shared provider |
| Empty states | `EmptyState` component (sm/md/lg sizes) with icon, title, description, CTA |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Services keep restarting | Corrupted volumes: `docker compose down -v` then rebuild |
| Zookeeper exit code 3 | Corrupted data directory: `docker compose down -v` to wipe |
| Tables missing after startup | Run init.sql: `docker compose exec -T postgres psql -U admin -d noc_alerts < postgres-init/init.sql` |
| Database connection refused | Check postgres health: `docker compose ps postgres` - wait for "healthy" |
| Kafka topics not created | Topics are auto-created on first event publish |
| UI build OOM | Increase Docker RAM to 4GB+ in Docker Desktop settings |
| Port conflicts | Check ports 3000, 5050, 5432, 8080, 8090, 9092 aren't already in use |
| Watson AI errors | Verify `WATSONX_API_KEYS` in `.env` are valid IBM Cloud API keys |
| Font loading errors (Docker) | Expected - IBM Plex fonts fallback to system fonts in containerized builds |
| SCSS changes not reflecting | Rebuild UI: `docker compose build ui && docker compose up -d ui` |
| API returns 401 | Token expired - re-login via `/login` endpoint |
| Demo mode active unexpectedly | Check postgres container is running and healthy |

### Health Check Endpoints

```bash
curl http://localhost:8080/api/v1/health    # API Gateway
curl http://localhost:8001/health            # Ingestor Core
curl http://localhost:8082/health            # Event Router
```

### Useful Commands

```bash
# Check which containers are running
docker compose -f infra/prod/docker-compose.yml ps

# Database shell
docker compose -f infra/prod/docker-compose.yml exec postgres psql -U admin -d noc_alerts

# Check API gateway logs for errors
docker compose -f infra/prod/docker-compose.yml logs --tail=50 api-gateway

# TypeScript type errors
cd ui && npx tsc --noEmit 2>&1 | head -50
```

---

## Codebase Statistics

| Metric | Count |
|--------|-------|
| **Backend** | |
| Handler files | 18 (9,844 lines) |
| Public handler functions | 97 |
| Total handler functions (incl. private helpers) | 181 |
| Registered API routes | 101 |
| Model files | 6 (699 lines) |
| Repository files | 6 (1,576 lines) |
| Middleware files | 5 |
| Gateway services | 3 (auth, email, google_oauth) |
| Go workspace modules | 6 |
| **Frontend** | |
| Page components | 33 (19,911 lines) |
| Shared components | 19 (3,093 lines) |
| Feature module files | 20 (2,774 lines) |
| SCSS style files | 21 |
| API endpoint constants | 54 |
| Route constants | 25 |
| **Database** | |
| Tables | 17 |
| Indexes | 40 |
| Seed data records | ~47 |
| **Infrastructure** | |
| Docker containers | 11 |
| User roles | 5 |
| RBAC permissions | 13 |

---

## Additional Documentation

- [CLAUDE.md](CLAUDE.md) - Detailed build log and session context
- [CORS_SETUP.md](CORS_SETUP.md) - CORS configuration details
- [Carbon-Quick-Reference.md](Carbon-Quick-Reference.md) - IBM Carbon Design System reference
- Database schema: [`infra/prod/postgres-init/init.sql`](infra/prod/postgres-init/init.sql)
- Environment config: [`infra/prod/.env`](infra/prod/.env)

---

## License

IBM Live Project - Internal Use
