# Hotel SaaS - Open Source Hotel Management Platform

A production-ready, open-source web application for hotel and guest-house owners to manage their properties efficiently.

## ✨ Features

- **Single-Admin Model**: One account controls all data and multiple hotel instances
- **Multi-Instance Support**: Manage multiple hotels/properties from one account
- **Room Management**: Define room types, capacities, prices, and amenities
- **Reservation System**: Complete booking management with guest information
- **Services & Extras**: Configurable add-ons (breakfast, parking, transfers, etc.)
- **Pricing Rules**: Seasonal rates, weekend pricing, and special discounts
- **Reports & Analytics**: Occupancy rates, revenue tracking, CSV exports
- **Calendar View**: Visual timeline of all reservations
- **Customization**: Per-instance labels, custom fields, and branding
- **GDPR Compliant**: Data export and deletion capabilities

## 🚀 Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Cache/Rate Limiting**: Redis (Upstash)
- **Authentication**: NextAuth.js v4
- **Validation**: Zod
- **Testing**: Jest + Playwright
- **CI/CD**: GitHub Actions + Docker

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- PostgreSQL database (Neon recommended)
- Upstash Redis (optional, for rate limiting)

## 🛠️ Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/hotel-saas.git
cd hotel-saas
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

### 3. Set Up Environment Variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and configure:

\`\`\`env
# Database - Use your Neon database URL
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEON_NEON_DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEON_DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth - Generate a secure secret
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"

# Admin User (for initial setup)
SEED_ADMIN_EMAIL="admin@yourdomain.com"
SEED_ADMIN_NAME="Admin User"
SEED_ADMIN_PASSWORD="your-secure-password"

# Node Environment
NODE_ENV="production"
\`\`\`

**Generate NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Initialize Database

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate:deploy

# Create admin user (optional)
npm run db:seed
\`\`\`

### 5. Start Server

\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser and log in with your admin credentials.

## 📁 Project Structure

\`\`\`
hotel-saas/
├── app/                    # Next.js 15 app directory
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── onboarding/    # First-time setup
│   │   └── instances/     # Hotel management
│   │       └── [id]/      # Single hotel pages
│   │           ├── rooms/         # Room management
│   │           ├── reservations/  # Booking management
│   │           ├── services/      # Services & pricing
│   │           ├── calendar/      # Calendar view
│   │           ├── reports/       # Analytics
│   │           └── settings/      # Hotel settings
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── instances/     # Hotel CRUD
│       ├── health/        # Health check
│       └── ready/         # Readiness check
├── components/            # React components
│   ├── auth/             # Auth forms
│   ├── instances/        # Hotel components
│   ├── rooms/            # Room components
│   ├── reservations/     # Booking components
│   ├── services/         # Service components
│   ├── calendar/         # Calendar components
│   ├── reports/          # Report components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── env.ts            # Environment validation
│   ├── logger.ts         # Logging utility
│   ├── errors.ts         # Error handling
│   └── rate-limit.ts     # Rate limiting
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed-prod.ts      # Production seed
├── scripts/              # Deployment scripts
│   └── migrate.sh        # Migration script
├── types/                # TypeScript types
├── docker-compose.prod.yml # Production Docker setup
├── Dockerfile            # Production Docker image
└── DEPLOYMENT.md         # Deployment guide
\`\`\`

## 🗄️ Database Schema

Multi-tenant architecture with the following entities:

- **User**: Administrator account (email/password auth)
- **Instance**: Hotel/property (belongs to user)
- **RoomType**: Room categories (Single, Double, Suite, etc.)
- **Room**: Individual rooms (linked to room type)
- **Reservation**: Bookings with guest info and dates
- **Service**: Additional services (breakfast, parking, etc.)
- **PricingRule**: Seasonal and special pricing rules
- **CustomField**: Per-instance custom data fields

All data is isolated by `userId` to ensure security.

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate:deploy` | Deploy migrations |
| `npm run db:seed` | Create admin user |
| `npm run migrate` | Run migration script |
| `npm run docker:up` | Start production Docker |
| `npm run docker:down` | Stop production Docker |

### Environment Variables

#### Required

- `DATABASE_URL` - PostgreSQL connection string
- `NEON_NEON_DATABASE_URL` - Neon PostgreSQL connection string
- `NEON_DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL (https://your-domain.com)
- `NEXTAUTH_SECRET` - Random secret (min 32 chars)

#### Optional

- `UPSTASH_KV_REST_API_URL` - Upstash Redis URL (for rate limiting)
- `UPSTASH_KV_REST_API_TOKEN` - Upstash Redis token
- `SEED_ADMIN_EMAIL` - Admin email for initial setup
- `SEED_ADMIN_NAME` - Admin name for initial setup
- `SEED_ADMIN_PASSWORD` - Admin password for initial setup

See `DEPLOYMENT.md` for complete production setup guide.

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT tokens in HttpOnly cookies
- ✅ CSRF protection via NextAuth
- ✅ Rate limiting on auth endpoints (5 req/15min)
- ✅ Rate limiting on API endpoints (60 req/min)
- ✅ Input validation with Zod schemas
- ✅ SQL injection protection via Prisma
- ✅ User data isolation (userId checks)
- ✅ Security headers in production
- ✅ Environment variable validation

## 🚀 Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment instructions.

### Quick Deploy Options

1. **Vercel** (Recommended)
   - One-click deploy
   - Auto-scaling
   - Built-in CI/CD

2. **Docker**
   - Self-hosted
   - Full control
   - Production-ready compose file

3. **Manual**
   - Any Node.js host
   - PM2 or systemd

### Health Checks

- **Health**: `GET /api/health` - Basic health status
- **Ready**: `GET /api/ready` - Database connectivity check

## 📊 Features Roadmap

- [ ] Email notifications (booking confirmations)
- [ ] Multi-language support (i18n)
- [ ] Payment integration (Stripe)
- [ ] Guest portal (self-service bookings)
- [ ] Mobile app (React Native)
- [ ] Advanced reporting (custom date ranges)
- [ ] Housekeeping management
- [ ] Staff accounts (role-based access)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features.

## 📧 Support

- **Documentation**: See `DEPLOYMENT.md` for deployment help
- **Issues**: [GitHub Issues](https://github.com/yourusername/hotel-saas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hotel-saas/discussions)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Neon](https://neon.tech/)
- [Upstash](https://upstash.com/)

---

Made with ❤️ for the open-source community
