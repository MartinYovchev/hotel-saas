# Quickstart

## Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (we use [Neon](https://neon.tech))

## Setup

1. **Install dependencies**
```bash
pnpm install
```

2. **Configure environment**
```bash
cp .env.development .env
```

Edit `.env` and add your database URL:
```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
```

3. **Setup database**
```bash
pnpm prisma generate
pnpm db:migrate
pnpm db:seed
```

4. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Login (after seeding)
- Email: `admin@localhost.dev`
- Password: `DLNGY15XeVNJzVe9n4CY/y0QTgl0mSgf`

## Useful Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm kill:all     # Kill all processes
pnpm clean        # Clean cache and restart
```
