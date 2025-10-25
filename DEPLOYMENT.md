# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Neon Database** - Already connected via integration
2. **Upstash Redis** - Already connected via integration  
3. **Domain name** (for production)
4. **Docker & Docker Compose** installed (for self-hosting)

## Environment Variables

### Required Variables

The following environment variables are **automatically provided** by integrations:

- `NEON_NEON_DATABASE_URL` - From Neon integration
- `UPSTASH-KV_KV_REST_API_URL` - From Upstash integration
- `UPSTASH-KV_KV_REST_API_TOKEN` - From Upstash integration

### Variables You Need to Set

Copy `.env.production.example` to `.env.production` and configure:

\`\`\`bash
# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string-at-least-32-characters"

# Optional: Initial Admin User
SEED_ADMIN_EMAIL="admin@yourdomain.com"
SEED_ADMIN_PASSWORD="your-secure-password"
SEED_ADMIN_NAME="Admin User"
\`\`\`

**Generate NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   \`\`\`

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `NEXTAUTH_URL` - Your production URL
     - `NEXTAUTH_SECRET` - Generated secret
     - `SEED_ADMIN_EMAIL` - Your admin email
     - `SEED_ADMIN_PASSWORD` - Your admin password
     - `SEED_ADMIN_NAME` - Your admin name

3. **Run Database Migrations:**
   \`\`\`bash
   npm run db:migrate:deploy
   npm run db:seed:prod
   \`\`\`

### Option 2: Self-Host with Docker

1. **Clone and Configure:**
   \`\`\`bash
   git clone your-repo-url
   cd hotel-saas
   cp .env.production.example .env.production
   # Edit .env.production with your values
   \`\`\`

2. **Build and Run:**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

3. **Run Migrations:**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml exec app npm run migrate
   \`\`\`

4. **Access Application:**
   - App: http://localhost:3000
   - Health: http://localhost:3000/api/health

### Option 3: Manual Deployment

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Build Application:**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Run Migrations:**
   \`\`\`bash
   npm run db:migrate:deploy
   npm run db:seed:prod
   \`\`\`

4. **Start Production Server:**
   \`\`\`bash
   npm start
   \`\`\`

## Post-Deployment

### 1. Create Your First Admin Account

If you set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, an admin account will be created automatically. Otherwise:

1. Visit `/signup`
2. Create your account
3. Login at `/login`

### 2. Create Your First Hotel

1. After login, you'll be redirected to onboarding
2. Fill in your hotel details
3. Start managing rooms and reservations

### 3. Health Checks

Monitor your application:
- **Health Check:** `GET /api/health`
- **Readiness Check:** `GET /api/ready`

Example response:
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
\`\`\`

## Security Checklist

- [ ] Changed `NEXTAUTH_SECRET` to a secure random string
- [ ] Using HTTPS in production (set `NEXTAUTH_URL` to https://)
- [ ] Database uses SSL connection
- [ ] Strong admin password set
- [ ] Rate limiting enabled (via Upstash Redis)
- [ ] Environment variables secured (not in git)

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test database connection
npm run db:studio
\`\`\`

### Rate Limiting Not Working

Ensure Upstash Redis integration is connected. Check logs:
\`\`\`bash
docker-compose logs app
\`\`\`

### Migration Errors

Reset and re-run migrations:
\`\`\`bash
npm run db:push
npm run db:seed:prod
\`\`\`

## Monitoring

### Logs

**Docker:**
\`\`\`bash
docker-compose -f docker-compose.prod.yml logs -f app
\`\`\`

**Vercel:**
- View logs in Vercel dashboard
- Real-time logs: `vercel logs`

### Database

Monitor your Neon database:
- Go to [console.neon.tech](https://console.neon.tech)
- View metrics, queries, and performance

### Redis

Monitor Upstash Redis:
- Go to [console.upstash.com](https://console.upstash.com)
- View request metrics and usage

## Scaling

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

1. **Vercel:** Auto-scales automatically
2. **Docker:** Use Docker Swarm or Kubernetes
3. **Load Balancer:** Add nginx or similar

### Database Scaling

Neon provides:
- Auto-scaling compute
- Connection pooling
- Read replicas (on paid plans)

### Redis Scaling

Upstash provides:
- Global replication
- Auto-scaling
- High availability

## Backup & Recovery

### Database Backups

Neon provides automatic backups. To create manual backup:

\`\`\`bash
pg_dump $NEON_DATABASE_URL > backup.sql
\`\`\`

Restore:
\`\`\`bash
psql $NEON_DATABASE_URL < backup.sql
\`\`\`

### Application Data

Export data via the reports feature:
- Go to Reports section
- Export CSV files for all data

## Support

For issues:
1. Check logs first
2. Review this deployment guide
3. Check GitHub issues
4. Open a new issue with logs and error details
