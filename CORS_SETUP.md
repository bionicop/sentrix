# CORS Configuration Guide
*Fixing "JavaScript Origin is Local Only" Issue*

## What is CORS?

**Cross-Origin Resource Sharing (CORS)** is a security feature that prevents JavaScript running on one domain from accessing resources on another domain without permission. When your frontend (UI) runs on `http://localhost:5173` and tries to call your API at `http://localhost:8080`, the browser blocks it unless CORS is configured.

## ✅ Your API Gateway Already Has CORS Configured!

Good news: CORS is already set up in [ingestor/api_gateway/main.go](ingestor/api_gateway/main.go#L933-L942)

### Default Allowed Origins

```go
// Defaults (lines 46-48 in main.go)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

This allows JavaScript from:
- ✅ `http://localhost:5173` - Vite default port (your UI)
- ✅ `http://localhost:5174` - Vite alternative port
- ✅ `http://localhost:3000` - React dev server

## How to Use

### Option 1: Use Default (Recommended for Local Development)

Just start your services - CORS is already configured!

```bash
# Terminal 1 - Start API Gateway
cd ingestor/api_gateway
go run main.go
# Listens on :8080, CORS allows localhost:5173

# Terminal 2 - Start UI
cd ui
npm run dev
# Runs on localhost:5173, can call API at :8080
```

### Option 2: Customize Origins (If Using Different Port)

If your UI runs on a different port, set the environment variable:

```bash
# In ingestor/api_gateway/.env
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:4000
```

Or in your terminal:
```bash
export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://192.168.1.100:5173"
cd ingestor/api_gateway
go run main.go
```

## Production Configuration

For production, set your actual domain:

```bash
# In production .env
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://app.your-domain.com
```

**Security Note**: NEVER use `*` (allow all origins) in production!

## Troubleshooting

### Issue: "CORS Error" or "Blocked by CORS Policy"

**Check 1**: Verify UI is running on allowed port
```bash
# Your UI should show something like:
# VITE ready in 234 ms
# ➜  Local:   http://localhost:5173/
```

**Check 2**: Verify API Gateway shows allowed origins
```bash
cd ingestor/api_gateway
go run main.go

# Should see in logs:
# 📋 CORS allowed origins: [http://localhost:5173 http://localhost:5174 http://localhost:3000]
```

**Check 3**: Verify your frontend is using the correct API URL

In your UI code, check that API calls go to `http://localhost:8080`:

```typescript
// ui/src/config/api.ts or similar
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Example API call
fetch(`${API_BASE_URL}/alerts`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
```

### Issue: "localhost:5173 not in allowed origins"

This means your `.env` file overrode the defaults. Fix:

```bash
# In ingestor/api_gateway/.env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

Restart the API Gateway.

### Issue: UI on different IP (e.g., accessing from another device)

Add your IP to allowed origins:

```bash
# Find your IP
hostname -I  # Linux
ipconfig     # Windows

# Add to .env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://192.168.1.100:5173
```

## CORS Headers Explained

The API Gateway sends these headers:

```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 43200
```

This tells the browser:
- ✅ Requests from `localhost:5173` are allowed
- ✅ GET/POST/PUT/DELETE methods are allowed
- ✅ Authorization header (for JWT tokens) is allowed
- ✅ Cookies and credentials can be sent
- ✅ Cache this permission for 12 hours

## Testing CORS

### Method 1: Browser DevTools

1. Open your UI at `http://localhost:5173`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Make an API call (e.g., load alerts)
5. Check the response headers:

```
Access-Control-Allow-Origin: http://localhost:5173
```

### Method 2: curl Test

```bash
# Simulate browser preflight request
curl -X OPTIONS http://localhost:8080/api/v1/alerts \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Should see in response:
# < Access-Control-Allow-Origin: http://localhost:5173
```

### Method 3: Check API Gateway Logs

```bash
cd ingestor/api_gateway
go run main.go

# You should see on startup:
# 🚀 NOC Dashboard API Gateway
# 📋 CORS allowed origins: [http://localhost:5173 ...]
```

## Quick Reference

| Scenario | Solution |
|----------|----------|
| UI on Vite default (5173) | ✅ Works by default |
| UI on different port | Set `CORS_ALLOWED_ORIGINS` in .env |
| Access from mobile/tablet | Add device IP to allowed origins |
| Production deployment | Set production domain in .env |
| API not responding | Check if API Gateway is running on :8080 |
| "Blocked by CORS" | Check allowed origins match UI URL exactly |

## Next Steps

1. ✅ CORS is already configured - no code changes needed
2. Start your services and test
3. If issues persist, check the troubleshooting section above
4. For production, update `CORS_ALLOWED_ORIGINS` in production .env

## Related Files

- [ingestor/api_gateway/main.go](ingestor/api_gateway/main.go) - CORS middleware (lines 933-942)
- [ingestor/api_gateway/.env.example](ingestor/api_gateway/.env.example) - Configuration template
- [ingestor/api_gateway/.env](ingestor/api_gateway/.env) - Your actual config (not in git)
