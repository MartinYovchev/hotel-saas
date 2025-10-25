set -e

echo "🌱 Seeding production database..."

# Only seed if SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are set
if [ -z "$SEED_ADMIN_EMAIL" ] || [ -z "$SEED_ADMIN_PASSWORD" ]; then
  echo "⚠️  Skipping seed: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD not set"
  exit 0
fi

echo "📦 Running seed script..."
npx tsx prisma/seed-prod.ts

echo "✅ Seeding completed successfully"
