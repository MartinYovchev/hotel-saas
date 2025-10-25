# Quick Start Guide

Get your hotel management system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed (for local database)

## Step 1: Clone and Install

\`\`\`bash
# Download the project
cd hotel-management-saas
npm install
\`\`\`

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

**Required variables:**
- `NEON_NEON_DATABASE_URL` - Your database connection (provided by Neon integration)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

**Auto-provided variables (no setup needed):**
- `UPSTASH-KV_KV_REST_API_URL` - From Upstash integration
- `UPSTASH-KV_KV_REST_API_TOKEN` - From Upstash integration

## Step 3: Start the Database

\`\`\`bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d
\`\`\`

## Step 4: Initialize the Database

\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with demo data (optional)
npm run prisma:seed
\`\`\`

## Step 5: Start the App

\`\`\`bash
npm run dev
\`\`\`

Visit **http://localhost:3000** and you're ready to go!

## Default Login (if you seeded the database)

- **Email:** admin@hotel.com
- **Password:** Admin123!

## Next Steps

1. Change the default admin password
2. Create your first hotel instance
3. Add rooms and start taking reservations
4. Explore the reports and calendar views

## Troubleshooting

**"Cannot connect to database"**
- Make sure Docker is running: `docker ps`
- Check database URL in `.env` matches docker-compose.yml

**"Invalid environment variables"**
- Ensure `NEXTAUTH_SECRET` is at least 32 characters
- Check all required variables are set in `.env`

**"Port 3000 already in use"**
- Change the port: `PORT=3001 npm run dev`

## Need Help?

Check the full [README.md](./README.md) and [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed documentation.
