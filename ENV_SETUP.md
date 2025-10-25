# Environment Variables Setup Guide

This guide explains where to get the environment variables needed for the Hotel Management SaaS application.

## Required Variables

### 1. Database (NEON_NEON_DATABASE_URL)

**Already Available!** ✅

The `NEON_DATABASE_URL` is automatically provided by the Neon integration connected to this project. You don't need to set it manually.

**What it contains:**
- Your Neon PostgreSQL database connection string
- Format: `postgresql://user:password@host:port/database`

**For local development only:**
If you want to use a local PostgreSQL database instead, you can override it in your `.env` file:
\`\`\`env
NEON_DATABASE_URL="postgresql://localhost:5432/hotel_saas"
\`\`\`

### 2. NextAuth Secret (NEXTAUTH_SECRET)

**Required** - You need to generate this yourself.

**How to generate:**
\`\`\`bash
# Option 1: Using OpenSSL (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
\`\`\`

**Add to your environment:**
\`\`\`env
NEXTAUTH_SECRET="your-generated-secret-here"
\`\`\`

**Important:** 
- Must be at least 32 characters long
- Keep it secret and never commit it to version control
- Use a different secret for production

### 3. NextAuth URL (NEXTAUTH_URL)

**Default:** `http://localhost:3000`

**When to change:**
- Production: Set to your actual domain (e.g., `https://yourdomain.com`)
- Custom port: If running on a different port locally

\`\`\`env
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://yourdomain.com"
\`\`\`

### 4. Upstash Redis (UPSTASH-KV_KV_REST_API_URL & TOKEN)

**Already Available!** ✅

These are automatically provided by the Upstash Redis integration connected to this project. You don't need to set them manually.

**What they're used for:**
- Rate limiting API requests
- Session storage (optional)
- Caching (optional)

**Note:** If these are not available, the app will automatically fall back to in-memory rate limiting.

## Quick Setup for Development

1. **Copy the example file:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. **Generate NEXTAUTH_SECRET:**
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

3. **Update your .env file:**
   \`\`\`env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="paste-your-generated-secret-here"
   NODE_ENV="development"
   \`\`\`

4. **That's it!** The database and Redis variables are automatically provided by the integrations.

## Production Setup

For production deployment, you need to:

1. **Set NEXTAUTH_SECRET** (generate a new one, don't reuse development secret)
2. **Set NEXTAUTH_URL** to your production domain
3. **Verify integrations** are connected (Neon and Upstash Redis)

Example production `.env`:
\`\`\`env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-min-32-chars"
NODE_ENV="production"
\`\`\`

## Troubleshooting

### "NEON_DATABASE_URL is required"

**Solution:** The Neon integration should provide this automatically. Check:
1. Is Neon integration connected in the v0 sidebar?
2. Try reconnecting the Neon integration
3. For local development, add it manually to `.env`

### "NEXTAUTH_SECRET must be at least 32 characters"

**Solution:** Generate a proper secret:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### Rate limiting not working

**Solution:** This is normal if Upstash Redis is not connected. The app will use in-memory rate limiting as a fallback, which works fine for single-server deployments.

## Summary

**You only need to set manually:**
- ✅ `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- ✅ `NEXTAUTH_URL` (use default for local dev, set to your domain for production)

**Automatically provided by integrations:**
- ✅ `NEON_DATABASE_URL` (from Neon integration)
- ✅ `UPSTASH-KV_KV_REST_API_URL` (from Upstash integration)
- ✅ `UPSTASH-KV_KV_REST_API_TOKEN` (from Upstash integration)
