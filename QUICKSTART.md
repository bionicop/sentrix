# Sentrix - Quick Start

## Prerequisites

- Docker Desktop (4 GB+ RAM allocated)
- Node.js 20+ (for local frontend dev only)
- Go 1.24+ (for local backend dev only)

---

## Production / Full Stack (Docker Compose)

This runs all 11 services: API Gateway, PostgreSQL, Kafka, Zookeeper, Redis, nginx, Kafka UI, PgAdmin, datasource, event router, and ingestor core.

```bash
# 1. Navigate to infra
cd infra/prod

# 2. Build images
docker compose build --parallel

# 3. Start all containers
docker compose up -d

# 4. Seed database (first time only)
cd ../../
docker compose -f infra/prod/docker-compose.yml exec -T postgres \
  psql -U admin -d noc_alerts < postgres-init/init.sql

# 5. Open the UI
open http://localhost:3000
```

### Default Credentials

| Service    | URL                                         | Login                          |
|------------|---------------------------------------------|--------------------------------|
| Frontend   | [localhost:3000](http://localhost:3000)      | `admin@admin.com` / `admin123` |
| API Gateway| [localhost:8080](http://localhost:8080)      | JWT Bearer token               |
| Kafka UI   | [localhost:8090](http://localhost:8090)      | (no auth)                      |
| PgAdmin    | [localhost:5050](http://localhost:5050)      | `admin@admin.com` / `root`     |

PgAdmin DB connection: `Host: postgres | Port: 5432 | DB: noc_alerts | User: admin | Password: secret`

### Rebuild after code changes

```bash
cd infra/prod

# Rebuild a single service (e.g. api-gateway)
docker compose build api-gateway
docker compose up -d api-gateway

# Rebuild all
docker compose build --parallel && docker compose up -d
```

---

## Local Development

### Frontend only (mock data)

```bash
cd ui
npm install
npm run dev           # http://localhost:5173  (uses mock data by default)
```

### Frontend against real API

```bash
cd ui
VITE_USE_MOCK=false npm run dev
```

The API Gateway must be running (via Docker or locally) on `http://localhost:8080`.

### Backend only (Go)

```bash
# Build all modules
cd ingestor/api_gateway && go build ./...
cd ingestor/shared     && go build ./...

# Run API Gateway locally (requires PostgreSQL on localhost:5432)
cd ingestor/api_gateway
go run main.go
```

Environment variables for local API Gateway:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=noc_alerts
JWT_SECRET=your-jwt-secret
PORT=8080
```

---

## Verify compilation

```bash
# Go (run from each module root)
cd ingestor/api_gateway && go build ./...
cd ingestor/shared      && go build ./...
cd datasource           && go build ./...
cd ingestor/event_router && go build ./...
cd ingestor/ingestor_core && go build ./...
cd ai-core              && go build ./...

# TypeScript
cd ui && npx tsc --noEmit
```

---

## Roles

| Role ID        | Display Name              | Key Access                                   |
|----------------|---------------------------|----------------------------------------------|
| `network-ops`  | NOC Operator              | View/ack alerts, create tickets              |
| `sre`          | Site Reliability Engineer | Analytics, MTTR metrics, export reports      |
| `network-admin`| Network Administrator     | Manage devices, device groups, exports       |
| `senior-eng`   | Senior Engineer           | Full analytics, AI insights, configuration   |
| `sysadmin`     | System Administrator      | User management, audit logs, full admin      |

Role is set at login and can be changed in Settings.

---

## Troubleshooting

**Port already in use**
```bash
# Check what's on port 3000 / 8080
lsof -i :3000
lsof -i :8080
```

**API 401 errors from UI**
- Ensure you're logged in with a valid account
- In demo mode (no DB), login with any email matching a role pattern:
  - `*@admin.com` → sysadmin
  - `*@ops.com` → network-ops
  - `*@sre.com` → sre
  - `*@eng.com` → senior-eng
  - `*@network.com` → network-admin

**Database connection refused**
```bash
docker compose -f infra/prod/docker-compose.yml ps postgres
docker compose -f infra/prod/docker-compose.yml logs postgres
```

**Container won't start**
```bash
cd infra/prod
docker compose logs <service-name>
docker compose down -v && docker compose up -d   # full reset (drops data)
```

---

For full documentation see [README.md](README.md) and [docs/](docs/).
