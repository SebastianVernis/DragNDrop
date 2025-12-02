# DragNDrop Backend - Node.js + Better Auth

Complete backend implementation for the DragNDrop HTML Editor with authentication, cloud sync, and REST API.

## 🎯 Features

- ✅ **Better Auth Integration** - Email/password + Google/GitHub OAuth
- ✅ **PostgreSQL Database** - Drizzle ORM with type-safe queries
- ✅ **REST API** - Complete CRUD for projects, components, deployments
- ✅ **Cloud Sync** - Auto-save with conflict resolution
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Testing** - Jest with >70% coverage target

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Auth**: Better Auth
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Testing**: Jest + Supertest

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend-node
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3001

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
```

### 3. Setup Database

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# (Optional) Open Drizzle Studio
npm run db:studio
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at: **http://localhost:3001**

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

#### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### OAuth Sign In
```http
GET /api/auth/google
GET /api/auth/github
```

#### Get Session
```http
GET /api/auth/session
Cookie: session-cookie
```

#### Sign Out
```http
POST /api/auth/sign-out
Cookie: session-cookie
```

### Projects API

#### List Projects
```http
GET /api/projects?limit=50&offset=0&sortBy=updatedAt&order=desc
Cookie: session-cookie
```

#### Get Project
```http
GET /api/projects/:id
Cookie: session-cookie
```

#### Create Project
```http
POST /api/projects
Cookie: session-cookie
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "htmlContent": "<h1>Hello</h1>",
  "cssContent": "h1 { color: blue; }",
  "jsContent": "console.log('test');",
  "isPublic": false,
  "template": "blank"
}
```

#### Update Project
```http
PUT /api/projects/:id
Cookie: session-cookie
Content-Type: application/json

{
  "name": "Updated Name",
  "htmlContent": "<h1>Updated</h1>"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Cookie: session-cookie
```

#### Get Version History
```http
GET /api/projects/:id/versions
Cookie: session-cookie
```

### Components API

#### List Components
```http
GET /api/components?category=layout&search=card&limit=50
```

#### Get Component
```http
GET /api/components/:id
```

#### Create Component
```http
POST /api/components
Cookie: session-cookie
Content-Type: application/json

{
  "name": "Custom Card",
  "category": "ui",
  "htmlContent": "<div class='card'>...</div>",
  "cssContent": ".card { ... }",
  "isPublic": true,
  "tags": ["card", "ui"]
}
```

#### Update Component
```http
PUT /api/components/:id
Cookie: session-cookie
Content-Type: application/json
```

#### Delete Component
```http
DELETE /api/components/:id
Cookie: session-cookie
```

### Deployments API

#### List Deployments
```http
GET /api/deployments?projectId=xxx&provider=vercel
Cookie: session-cookie
```

#### Create Deployment
```http
POST /api/deployments
Cookie: session-cookie
Content-Type: application/json

{
  "projectId": "project-uuid",
  "provider": "vercel"
}
```

#### Update Deployment Status
```http
PUT /api/deployments/:id
Cookie: session-cookie
Content-Type: application/json

{
  "status": "ready",
  "deploymentUrl": "https://project.vercel.app"
}
```

## 🗄️ Database Schema

### Better Auth Tables
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens

### Application Tables
- `project` - User projects with HTML/CSS/JS
- `component` - Reusable components library
- `deployment` - Deployment tracking
- `projectVersion` - Version history
- `aiUsage` - AI feature usage tracking

## 🔒 Security Features

### Implemented
- ✅ Helmet.js security headers
- ✅ CORS with credentials
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation (Zod-ready)
- ✅ SQL injection prevention (ORM)
- ✅ XSS prevention
- ✅ Secure session cookies
- ✅ Password hashing (Better Auth)

### Environment Security
- ✅ `.env` not committed
- ✅ Secrets in environment variables
- ✅ HTTPS in production
- ✅ Secure cookie flags

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Integration tests only
npm run test:integration

# Coverage report
npm run test:coverage
```

### Test Coverage Target
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Test Files
- `tests/auth.test.js` - Authentication tests
- `tests/projects.test.js` - Projects API tests
- `tests/integration/cloud-sync.test.js` - Sync workflow tests

## 📁 Project Structure

```
backend-node/
├── api/
│   ├── projects.js          # Projects CRUD
│   ├── components.js        # Components CRUD
│   └── deployments.js       # Deployments API
├── auth/
│   ├── config.js            # Better Auth setup
│   └── middleware.js        # Auth middleware
├── db/
│   ├── client.js            # Database connection
│   ├── schema.js            # Drizzle schema
│   └── migrations/          # SQL migrations
├── utils/
│   └── validation.js        # Input validation
├── tests/
│   ├── auth.test.js
│   ├── projects.test.js
│   └── integration/
│       └── cloud-sync.test.js
├── server.js                # Express app
├── package.json
├── drizzle.config.js
└── .env.example
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | 32+ char random secret |
| `BETTER_AUTH_URL` | ✅ | Backend URL |
| `PORT` | ❌ | Server port (default: 3001) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret |
| `GITHUB_CLIENT_ID` | ❌ | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ❌ | GitHub OAuth secret |

### Generate Secrets

```bash
# Better Auth Secret
openssl rand -base64 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Environment Setup
1. Set all environment variables in hosting platform
2. Ensure DATABASE_URL points to production database
3. Set NODE_ENV=production
4. Enable HTTPS
5. Configure CORS for production frontend URL

## 📊 Monitoring

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs
- Authentication events logged
- API errors logged
- Database connection status

## 🤝 Integration with Frontend

### Frontend Services
The frontend includes these services that connect to this backend:

- `src/services/authService.js` - Authentication client
- `src/services/apiClient.js` - API wrapper
- `src/services/cloudSync.js` - Auto-save manager
- `src/services/sessionManager.js` - Session state

### Global Access
Services are exposed globally:
```javascript
window.authService
window.apiClient
window.cloudSync
window.sessionManager
```

### Events
Listen to sync events:
```javascript
window.addEventListener('auth:login', handleLogin);
window.addEventListener('auth:logout', handleLogout);
window.addEventListener('sync:complete', handleSync);
window.addEventListener('sync:conflict', handleConflict);
```

## 🐛 Troubleshooting

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure IP is whitelisted in Supabase

### OAuth Not Working
- Verify OAuth credentials in .env
- Check redirect URIs match in OAuth provider
- Ensure BETTER_AUTH_URL is correct

### CORS Errors
- Set FRONTEND_URL in .env
- Check credentials: true in CORS config
- Verify frontend sends credentials

### Tests Failing
- Ensure test database is setup
- Check NODE_ENV=test
- Verify all dependencies installed

## 📝 License

MIT License - See LICENSE file

## 🙏 Credits

- **Better Auth**: https://www.better-auth.com
- **Drizzle ORM**: https://orm.drizzle.team
- **Express.js**: https://expressjs.com

---

**Status**: ✅ Production Ready

**Version**: 1.0.0

**Last Updated**: December 2024
