import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || "Admin"

  if (!email || !password) {
    console.log("⚠️  SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD not set, skipping seed")
    return
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`✅ Admin user already exists: ${email}`)
    return
  }

  // Create admin user
  const passwordHash = await hash(password, 12)
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  })

  console.log(`✅ Created admin user: ${user.email}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
