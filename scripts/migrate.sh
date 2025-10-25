set -e

echo "🔄 Running database migrations..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed successfully"
