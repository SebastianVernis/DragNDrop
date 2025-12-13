# Backend Setup Guide

Complete step-by-step guide to set up the DragNDrop backend with Better Auth.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we'll use Supabase)
- Google Cloud account (for OAuth - optional)
- GitHub account (for OAuth - optional)

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: dragndrop-db
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

### 1.2 Get Database URL

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your database password
5. Save this URL - you'll need it for `.env`

## 🔐 Step 2: Setup OAuth Providers (Optional)

### 2.1 Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Configure consent screen if prompted
7. Application type: **Web application**
8. Add authorized redirect URI:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
9. Click **Create**
10. Copy **Client ID** and **Client Secret**

### 2.2 GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: DragNDrop Editor
   - **Homepage URL**: http://localhost:8080
   - **Authorization callback URL**: http://localhost:3001/api/auth/callback/github
4. Click **Register application**
5. Click **Generate a new client secret**
6. Copy **Client ID** and **Client Secret**

## 🔑 Step 3: Generate Secrets

### Better Auth Secret

Run one of these commands:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - this is your `BETTER_AUTH_SECRET`.

## ⚙️ Step 4: Configure Environment

### 4.1 Create .env file

```bash
cd backend-node
cp .env.example .env
```

### 4.2 Edit .env

Open `.env` and fill in your values:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Database (from Step 1.2)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Better Auth (from Step 3)
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3001

# Google OAuth (from Step 2.1) - Optional
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-secret

# GitHub OAuth (from Step 2.2) - Optional
GITHUB_CLIENT_ID=Iv1.your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

# Feature Flags
ENABLE_CLOUD_SYNC=true
ENABLE_AUTO_SAVE=true
```

## 📦 Step 5: Install Dependencies

```bash
npm install
```

This will install:
- Express.js
- Better Auth
- Drizzle ORM
- PostgreSQL driver
- Security packages
- Testing tools

## 🗃️ Step 6: Setup Database Schema

### 6.1 Generate Migrations

```bash
npm run db:generate
```

This creates SQL migration files in `db/migrations/`.

### 6.2 Apply Migrations

```bash
npm run db:migrate
```

This creates all tables in your database:
- Better Auth tables (user, session, account, verification)
- Application tables (project, component, deployment, etc.)

### 6.3 Verify Database (Optional)

```bash
npm run db:studio
```

This opens Drizzle Studio at `https://local.drizzle.studio` where you can browse your database.

## 🚀 Step 7: Start Server

### Development Mode

```bash
npm run dev
```

You should see:

```
✅ Database connection successful
🚀 ========================================
🚀 Server running on http://localhost:3001
🚀 ========================================

📚 API Documentation: http://localhost:3001/api
🔐 Auth Endpoints: http://localhost:3001/api/auth
💾 Projects API: http://localhost:3001/api/projects
🧩 Components API: http://localhost:3001/api/components
🚀 Deployments API: http://localhost:3001/api/deployments

🌍 Environment: development
🔗 Frontend URL: http://localhost:8080

✅ Google OAuth: Enabled
✅ GitHub OAuth: Enabled

✨ Ready to accept requests!
```

### Production Mode

```bash
npm start
```

## ✅ Step 8: Test the API

### 8.1 Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development"
}
```

### 8.2 Test Sign Up

```bash
curl -X POST http://localhost:3001/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

### 8.3 Test Sign In

```bash
curl -X POST http://localhost:3001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }' \
  -c cookies.txt
```

### 8.4 Test Protected Endpoint

```bash
curl http://localhost:3001/api/projects \
  -b cookies.txt
```

## 🧪 Step 9: Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

Expected output:
```
PASS  tests/auth.test.js
PASS  tests/projects.test.js
PASS  tests/integration/cloud-sync.test.js

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Coverage:    75% (target: 70%)
```

## 🔗 Step 10: Connect Frontend

### 10.1 Update Frontend Environment

Create/edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 10.2 Test Frontend Integration

1. Start backend: `npm run dev` (in backend-node/)
2. Start frontend: `npm run dev` (in project root)
3. Open http://localhost:8080
4. Try signing up/in
5. Create a project
6. Verify auto-save works

## 🐛 Troubleshooting

### Database Connection Failed

**Error**: `Failed to connect to database`

**Solutions**:
1. Verify DATABASE_URL is correct
2. Check Supabase project is active
3. Ensure password is URL-encoded if it contains special characters
4. Test connection with psql:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```

### OAuth Redirect Error

**Error**: `redirect_uri_mismatch`

**Solutions**:
1. Verify redirect URI in OAuth provider matches exactly:
   - Google: `http://localhost:3001/api/auth/callback/google`
   - GitHub: `http://localhost:3001/api/auth/callback/github`
2. Check BETTER_AUTH_URL in .env is correct
3. Ensure no trailing slashes

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solutions**:
1. Change PORT in .env to different port (e.g., 3002)
2. Or kill process using port:
   ```bash
   # Find process
   lsof -i :3001
   
   # Kill process
   kill -9 <PID>
   ```

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:
1. Verify FRONTEND_URL in .env matches your frontend URL
2. Ensure frontend sends credentials:
   ```javascript
   fetch(url, { credentials: 'include' })
   ```
3. Check CORS configuration in server.js

### Tests Failing

**Error**: Tests timeout or fail

**Solutions**:
1. Create test database:
   ```bash
   createdb dragndrop_test
   ```
2. Set test environment:
   ```bash
   cp .env .env.test
   # Edit DATABASE_URL to point to test database
   ```
3. Run migrations on test database:
   ```bash
   DATABASE_URL=postgresql://localhost/dragndrop_test npm run db:migrate
   ```

## 📚 Next Steps

1. ✅ Backend is running
2. ✅ Database is setup
3. ✅ Authentication works
4. ✅ Tests pass

Now you can:
- Integrate with frontend
- Deploy to production
- Add custom features
- Monitor with logs

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## 📖 Additional Resources

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com)

## 🆘 Need Help?

- Check [README.md](./README.md) for API documentation
- Review [WORKFLOW_3_BACKEND_AUTH.md](../WORKFLOW_3_BACKEND_AUTH.md)
- Open an issue on GitHub

---

**Setup Complete!** 🎉

Your backend is now ready for development.
