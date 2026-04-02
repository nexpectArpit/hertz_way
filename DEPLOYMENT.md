# Deployment Guide for Render

## Overview
This guide covers deploying both frontend and backend on Render.

## Backend Deployment (Node.js)

### Environment Variables on Render Backend:

```
NODE_ENV=production
CLIENT_URL=https://your-frontend-app.onrender.com
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=none
SESSION_SECRET=your-strong-random-secret-here
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=car_rental
PORT=10000
```

### Important Notes:
- `CLIENT_URL` must be your EXACT frontend URL (get this after deploying frontend)
- `SESSION_COOKIE_SAMESITE=none` is REQUIRED for cross-origin cookies
- `SESSION_COOKIE_SECURE=true` is REQUIRED when using sameSite=none
- Change `SESSION_SECRET` to a strong random string
- Render automatically sets PORT, but you can override it

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

## Frontend Deployment (Static Site)

### Environment Variables on Render Frontend:

```
VITE_API_BASE_URL=https://hertz-way.onrender.com
```

### Build Command:
```
npm install && npm run build
```

### Publish Directory:
```
dist
```

## Deployment Steps

1. **Deploy Backend First:**
   - Create a new Web Service on Render
   - Connect your GitHub repo
   - Set root directory to `server`
   - Add all environment variables listed above
   - Deploy

2. **Deploy Frontend:**
   - Create a new Static Site on Render
   - Connect your GitHub repo
   - Set root directory to `client`
   - Add environment variable: `VITE_API_BASE_URL`
   - Deploy

3. **Update Backend CLIENT_URL:**
   - After frontend deploys, copy its URL
   - Go back to backend service settings
   - Update `CLIENT_URL` with the frontend URL
   - Trigger a manual redeploy of backend

## Troubleshooting

### CORS Errors
- Check that `CLIENT_URL` matches your frontend URL exactly
- Ensure both services are using HTTPS
- Check Render logs for "CORS blocked origin" messages

### 403 Forbidden on API Calls
- Verify `SESSION_COOKIE_SAMESITE=none` is set
- Verify `SESSION_COOKIE_SECURE=true` is set
- Check that cookies are being sent (browser DevTools > Network > Request Headers)
- Ensure you're logged in (check `/api/me` endpoint)

### Session Not Persisting
- For production, consider using a session store like `connect-redis` or `connect-pg-simple`
- MemoryStore (current) works but has limitations in production

## Database Setup

Make sure your database is accessible from Render:
1. If using Render PostgreSQL, connection details are auto-provided
2. If using external MySQL, ensure firewall allows Render IPs
3. Run `database.sql` to create tables

## Testing Deployment

After deployment, test these flows:
1. Register as agency
2. Login as agency
3. Add a car (this was failing with 403)
4. View cars list
5. Register as customer
6. Book a car
