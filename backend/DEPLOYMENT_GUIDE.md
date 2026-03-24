# Deployment & Troubleshooting Guide

## Recent Changes (Post-Failure Analysis)

To fix the **exit status 1** server crash issue, the following improvements have been implemented:

### 1. **Database Connection Retry Logic**
- Added automatic retry mechanism (5 attempts with 2-second intervals)
- Better error logging for connection failures
- Prevents immediate crash on temporary database issues
- Graceful shutdown handlers (SIGTERM, SIGINT)

**File:** `server.js`

### 2. **Improved Error Handling**
- Enhanced error messages with more context
- Uncaught exception handlers at process level
- Unhandled promise rejection handlers
- Better module initialization error tracking

**Files:** `server.js`, `src/middleware/errorHandler.js`, `src/models/index.js`

### 3. **API Key Validation**
- Checks if GEMINI_API_KEY is set during startup
- Graceful handling of missing API keys
- Better error messages during code generation

**File:** `src/services/aiService.js`

### 4. **Database Configuration Improvements**
- Added connection timeout: 30 seconds
- Added idle in transaction timeout: 30 seconds (Render-specific)
- Proper SSL/TLS configuration for PostgreSQL
- Better pool settings

**File:** `src/config/database.js`

---

## Deployment Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL or MySQL (or SQLite for development)
- Gemini API Key: https://makersuite.google.com/app/apikey

### Local Setup

```bash
# 1. Install dependencies
cd backend
npm install
npm install sqlite3  # For local development with SQLite

# 2. Create and configure .env file
copy .env.example .env

# Edit .env with your values:
# - NODE_ENV=development
# - DATABASE_URL=sqlite:./database.sqlite (or your PostgreSQL URL)
# - GEMINI_API_KEY=your_key_here

# 3. Run migrations
npm run migrate

# 4. Start development server
npm run dev
```

### Render.com Deployment

#### Step 1: Create PostgreSQL Database
1. Go to Render dashboard
2. Create a new PostgreSQL database
3. Copy the connection string (DATABASE_URL)

#### Step 2: Configure Environment Variables
Set these in Render environment variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://your_db_url_here
GEMINI_API_KEY=your_gemini_key_here
CORS_ORIGIN=https://your-frontend-url.onrender.com
JWT_SECRET=generate_a_random_string_here
```

#### Step 3: Deploy
1. Connect your GitHub repo to Render
2. Select the `master` branch
3. Set root directory (if backend is in a subdirectory)
4. Deploy!

---

## Troubleshooting

### Issue: "Connection terminated unexpectedly"

**Cause:** PostgreSQL database is unreachable or down

**Solutions:**
1. Check if DATABASE_URL is correct
2. Verify PostgreSQL server is running
3. Check firewall/network settings
4. Try with SQLite locally: `DATABASE_URL=sqlite:./database.sqlite`
5. Wait 2+ minutes - the server will retry automatically

### Issue: "GEMINI_API_KEY environment variable is not set"

**Solutions:**
1. Set GEMINI_API_KEY in .env or environment
2. Get a key from: https://makersuite.google.com/app/apikey
3. Restart server after setting the key

### Issue: "Port 5000 already in use"

**Solutions:**
```bash
# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 5000
Stop-Process -Id [PID] -Force

# Linux/Mac
lsof -i :5000
kill -9 [PID]
```

Or use a different port:
```bash
PORT=5001 npm run dev
```

### Issue: Server exits with status 1

The new retry logic should handle temporary failures:
1. Server will retry DB connection 5 times with 2-second intervals
2. Check logs for detailed error messages
3. If still failing, check:
   - Database credentials
   - Database server status
   - Network connectivity
   - Environment variables

### Check Server Health

```bash
# Health endpoint (no auth required)
curl http://localhost:5000/api/health

# API root
curl http://localhost:5000/api

# API Documentation
open http://localhost:5000/api-docs
```

---

## Monitoring

### Check Logs in Render

1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Look for startup messages:
   - ✅ Database connection established successfully
   - ✅ Server running on port 5000
   - ❌ Error messages (if any)

### Server Restart on Render

Server automatically restarts if it crashes. To manually restart:
1. Go to Render dashboard
2. Click your service
3. Click "Manual Restart" button

---

## Performance Tips

1. **Use PostgreSQL for production** (SQLite is development only)
2. **Configure proper JWT_SECRET** (use a random string)
3. **Monitor database connection pool**
4. **Set appropriate RATE_LIMIT settings**
5. **Use HTTPS in CORS_ORIGIN** for production

---

## How the Retry Logic Works

```
Server startup attempt 1/5
  ↓
[Database connection fails]
  ↓
Wait 2 seconds
  ↓
Server startup attempt 2/5
  ↓
[If succeeds] → Server starts successfully
[If fails] → Retry again (up to 5 times)

If all 5 attempts fail → Server exits with status 1
```

---

## Key Files Modified

1. `server.js` - Retry logic, graceful shutdown
2. `src/config/database.js` - Connection timeout settings
3. `src/models/index.js` - Better error logging
4. `src/services/aiService.js` - API key validation
5. `.env.example` - Environment variable documentation

---

## Support

For issues or questions:
1. Check the logs first
2. Verify all environment variables are set
3. Test database connection separately
4. Check API key validity
5. Review this guide's troubleshooting section

