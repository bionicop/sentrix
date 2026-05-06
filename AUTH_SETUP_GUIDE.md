# Authentication & Email Dependencies

## Required Environment Variables

```bash
# JWT Configuration
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRY_HOURS=24

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URL=http://localhost:8080/api/v1/auth/google/callback

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=<your-app-password>
SMTP_FROM=your-email@gmail.com

# Alternative: SendGrid (Recommended for production)
SENDGRID_API_KEY=<your-sendgrid-api-key>

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=noc_dashboard
```

## Libraries to Add

### API Gateway (Go)
```bash
cd ingestor/api_gateway

# OAuth (Official Go implementation - Trust: 7.5/10)
go get golang.org/x/oauth2
go get golang.org/x/oauth2/google

# JWT v5 (Latest - BREAKING CHANGES from v4)
go get github.com/golang-jwt/jwt/v5

# Email - go-mail (Trust: 9.5/10, Modern, actively maintained)
go get github.com/wneessen/go-mail

# Database - GORM (Trust: 9.7/10, Industry standard ORM)
go get gorm.io/gorm
go get gorm.io/driver/postgres

# Password hashing (Stdlib extension)
go get golang.org/x/crypto/bcrypt

# Email validation (Already have)
go get github.com/go-playground/validator/v10
```

### Alternative: SendGrid (Trust: 9.2/10, Production-ready SaaS)
**Note**: go-mail is better for your use case - more flexible, no vendor lock-in
```bash
go get github.com/sendgrid/sendgrid-go
```

## UI (TypeScript/React)
```bash
cd ui

# No additional packages needed - uses built-in fetch
# OAuth handled via redirect flow
```

## How to Get Keys

### 1. Google OAuth Setup
1. Go to: https://console.cloud.google.com
2. Create new project: "NOC Dashboard"
3. Enable APIs: Google+ API
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - http://localhost:8080/api/v1/auth/google/callback
   - https://your-domain.com/api/v1/auth/google/callback
7. Copy Client ID and Client Secret

### 2. Gmail SMTP App Password
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification (required)
3. Go to App passwords: https://myaccount.google.com/apppasswords
4. Select app: Mail, Select device: Other (Custom name)
5. Name it: "NOC Dashboard"
6. Copy the 16-character password (no spaces)

### 3. Alternative: SendGrid (Recommended)
1. Sign up: https://signup.sendgrid.com/
2. Free tier: 100 emails/day
3. Settings → API Keys → Create API Key
4. Full Access
5. Copy API key (starts with SG.)

### 4. PostgreSQL Setup
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib  # Linux
brew install postgresql  # macOS

# Create database
sudo -u postgres psql
CREATE DATABASE noc_dashboard;
CREATE USER noc_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE noc_dashboard TO noc_user;
\q
```

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use environment variables** - Never hardcode secrets
3. **Rotate keys regularly** - Especially JWT secret
4. **Use HTTPS in production** - Never send tokens over HTTP
5. **Rate limit auth endpoints** - Prevent brute force
6. **Validate redirect URLs** - Prevent open redirect attacks
7. **Hash passwords** - Use bcrypt with cost 12+
8. **Secure cookies** - HttpOnly, Secure, SameSite

## Important: JWT v5 Migration

If you have existing JWT code using v4, note these **breaking changes** in v5:

### Import Path Change
```go
// OLD (v4)
import "github.com/golang-jwt/jwt/v4"

// NEW (v5) ✅
import "github.com/golang-jwt/jwt/v5"
```

### Key API Changes
```go
// Token.SignedString now accepts interface{} instead of []byte
token.SignedString(mySigningKey) // Works with []byte, *rsa.PrivateKey, etc.

// Error checking with errors.Is()
if errors.Is(err, jwt.ErrTokenExpired) {
    // Handle expired token
}

// Custom claims must implement ClaimsValidator interface
type CustomClaims struct {
    Username string `json:"username"`
    jwt.RegisteredClaims
}

func (c CustomClaims) Validate() error {
    // Custom validation logic
    return nil
}
```

**Migration time**: ~30 minutes for simple auth, 1-2 hours for complex systems
