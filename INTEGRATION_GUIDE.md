# NOC System Integration Guide

## 🎯 Overview

This guide explains how data flows through the complete NOC system after integration.

## 📊 Data Flow Architecture

```
Datasource → Ingestor Core → Event Router → API Gateway → UI
   (8001)      (8001)           (8082)        (8080)      (3000)
```

### Flow Details:

1. **Datasource** generates/normalizes network events (SNMP, Syslog, Metadata)
2. **Ingestor Core** receives events via HTTP POST, validates them
3. **Event Router** routes events based on severity to downstream services
4. **API Gateway** receives events and stores them as alerts
5. **UI** displays alerts to users in real-time

## 🔧 What Changed

### ✅ Completed Integrations

#### 1. **Shared Packages** (`ingestor/shared/`)
- **Location**: `/ingestor/shared/`
- **Modules**:
  - `models/event.go` - Unified Event struct with validation
  - `constants/` - Event types and severity levels
  - `config/env.go` - Environment variable helpers

#### 2. **Datasource**
- **Old**: Wrote directly to PostgreSQL (bypassed pipeline)
- **New**: Sends events via HTTP POST to Ingestor Core
- **Client**: `datasource/client/ingestor_client.go` with retry logic
- **Mappers**: Updated to use shared constants and normalize severity

#### 3. **Ingestor Core**
- **Old**: Accepted simple `Metadata` struct
- **New**: Accepts full `Event` model with validation
- **Endpoint**: `POST /ingest/event` (new) + `POST /ingest/metadata` (legacy, deprecated)
- **Validation**: Gin struct validation + business logic validation

#### 4. **Event Router**
- **Config**: Updated `config.json` to route by severity levels:
  ```json
  {
    "critical": "http://localhost:8080/api/v1/events",
    "high": "http://localhost:8080/api/v1/events",
    "medium": "http://localhost:8080/api/v1/events",
    "low": "http://localhost:8080/api/v1/events",
    "info": "http://localhost:8080/api/v1/events"
  }
  ```

## 🚀 Running the System

### Step 1: Start Services (in order)

```bash
# Terminal 1: Event Router
cd /run/media/bionic/361e6fa9-ae67-4342-87b3-1d54e3951b30/ibm-live-project-intern
export EVENT_ROUTER_PORT=8082
export EVENT_ROUTER_CONFIG_PATH=./ingestor/event_router/config.json
./bin/event_router

# Terminal 2: API Gateway
cd /run/media/bionic/361e6fa9-ae67-4342-87b3-1d54e3951b30/ibm-live-project-intern
cd ui && docker-compose up noc-api-gateway

# Terminal 3: Ingestor Core
cd /run/media/bionic/361e6fa9-ae67-4342-87b3-1d54e3951b30/ibm-live-project-intern
export INGESTOR_CORE_PORT=8001
export EVENT_ROUTER_URL=http://localhost:8082
./bin/ingestor_core

# Terminal 4: Datasource (test)
cd /run/media/bionic/361e6fa9-ae67-4342-87b3-1d54e3951b30/ibm-live-project-intern
export INGESTOR_CORE_URL=http://localhost:8001
./bin/datasource
```

### Step 2: Verify Data Flow

After running datasource, you should see:

1. **Datasource Output**:
```
📡 Datasource starting...
🔍 Checking Ingestor Core health at http://localhost:8001...
✅ Ingestor Core is healthy
📤 Sending Syslog events...
✅ Syslog 1 sent successfully
✅ Syslog 2 sent successfully
...
```

2. **Ingestor Core Output**:
```
🌟 Ingestor Core running on :8001 (Event Router: http://localhost:8082)
[GIN] POST /ingest/event → 200
[GIN] POST /ingest/event → 200
```

3. **Event Router Output**:
```
🌐 Event Router running on :8082
[GIN] POST /route → 200
[GIN] POST /route → 200
```

4. **API Gateway Output**:
```
📨 Ingested event: type=critical
📨 Ingested event: type=high
```

5. **Check Alerts in UI**:
- Navigate to http://localhost:3000/dashboard
- You should see new alerts appearing!

## 🧪 Testing the Integration

### Test 1: Health Check
```bash
# Check Ingestor Core
curl http://localhost:8001/health

# Check Event Router
curl http://localhost:8082/health

# Check API Gateway
curl http://localhost:8080/api/v1/health
```

### Test 2: Manual Event Injection
```bash
# Send a test event to Ingestor Core
curl -X POST http://localhost:8001/ingest/event \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "syslog",
    "source_host": "test-server",
    "source_ip": "192.168.1.100",
    "severity": "critical",
    "category": "system",
    "message": "Test critical alert",
    "raw_payload": "{}",
    "event_timestamp": "2026-01-14T10:00:00Z"
  }'
```

Expected Response:
```json
{
  "status": "received",
  "event_type": "syslog",
  "severity": "critical",
  "forwarded_to": "event_router",
  "router_response": "{\"status\":\"forwarded\",\"forwarded_to\":\"http://localhost:8080/api/v1/events\"}"
}
```

### Test 3: Check Alert Created
```bash
# Login first
TOKEN=$(curl -X POST http://localhost:8080/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin","role":{"id":"admin","text":"Administrator"}}' \
  | jq -r '.token')

# Get alerts
curl http://localhost:8080/api/v1/alerts \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Environment Variables

### Datasource
```bash
INGESTOR_CORE_URL=http://localhost:8001  # REQUIRED
LOG_LEVEL=info
```

### Ingestor Core
```bash
INGESTOR_CORE_PORT=8001
EVENT_ROUTER_URL=http://localhost:8082
```

### Event Router
```bash
EVENT_ROUTER_PORT=8082
EVENT_ROUTER_CONFIG_PATH=./ingestor/event_router/config.json
```

### API Gateway
```bash
API_GATEWAY_PORT=8080
JWT_SECRET=your-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:3000
GIN_MODE=debug
```

## 🔍 Troubleshooting

### Issue: Datasource can't connect to Ingestor Core
```bash
# Check if Ingestor Core is running
curl http://localhost:8001/health

# Check environment variable
echo $INGESTOR_CORE_URL
```

### Issue: Events not appearing in UI
```bash
# Check Event Router config
cat ingestor/event_router/config.json

# Verify API Gateway is receiving events
curl http://localhost:8080/api/v1/health
```

### Issue: Validation errors
```bash
# Check event structure in datasource output
# Ensure all required fields are present:
# - event_type (syslog/snmp/metadata)
# - source_host, source_ip (valid IP)
# - severity (critical/high/medium/low/info)
# - category, message
# - event_timestamp (RFC3339 format)
```

## 🎓 Key Concepts

### Severity Normalization
Datasource mappers normalize various severity formats to standard levels:
- `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY` → `critical`
- `WARN`, `WARNING` → `high`
- `NOTICE` → `medium`
- `DEBUG` → `low`
- `INFO`, `INFORMATIONAL` → `info`

### Event Validation
Events are validated at two levels:
1. **Gin Validation** (struct tags): Required fields, IP format, enum values
2. **Business Logic** (Event.Validate()): Timestamp ranges, field content

### Retry Logic
Datasource HTTP client retries failed requests:
- Max 3 attempts
- Exponential backoff (2s, 4s, 6s)
- Only retries on 5xx errors (not 4xx)

## 📚 Next Steps

1. ✅ **Shared packages created** - models, constants, config
2. ✅ **Datasource updated** - HTTP client with retry
3. ✅ **Ingestor Core updated** - Event model with validation
4. ✅ **Event Router updated** - Severity-based routing
5. ⏳ **Testing** - End-to-end flow validation
6. ⏳ **Documentation** - API specs, deployment guides
7. ⏳ **Docker** - Update docker-compose with new flow

## 🏗️ Production Considerations

### Security
- [ ] Add API key authentication for internal services
- [ ] Enable HTTPS/TLS for all service communication
- [ ] Implement rate limiting on Ingestor Core
- [ ] Add request validation middleware

### Reliability
- [ ] Add circuit breakers between services
- [ ] Implement dead letter queues for failed events
- [ ] Add metrics/monitoring (Prometheus)
- [ ] Set up health check probes for k8s

### Performance
- [ ] Add event batching in datasource
- [ ] Implement async processing in Ingestor Core
- [ ] Add caching layer for repeated events
- [ ] Consider message queue (Kafka) for high throughput

## 📞 Support

For issues or questions:
1. Check service logs
2. Verify environment variables
3. Test each service independently
4. Review the data flow diagram above
