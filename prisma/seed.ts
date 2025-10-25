import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo user
  const passwordHash = await hash("demo123", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@hotel-saas.com" },
    update: {},
    create: {
      email: "demo@hotel-saas.com",
      passwordHash,
      name: "Demo User",
    },
  })

  console.log("✅ Created demo user:", user.email)

  // Create demo instance
  const instance = await prisma.instance.upsert({
    where: { id: "demo-instance-id" },
    update: {},
    create: {
      id: "demo-instance-id",
      userId: user.id,
      name: "Grand Hotel Demo",
      address: "123 Main Street, City, Country",
      contactEmail: "info@grandhotel.com",
      contactPhone: "+1234567890",
      timezone: "America/New_York",
      currency: "USD",
      settings: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        labels: {
          room: "Room",
          reservation: "Booking",
        },
      },
    },
  })

  console.log("✅ Created demo instance:", instance.name)

  // Create room types
  const standardRoom = await prisma.roomType.create({
    data: {
      instanceId: instance.id,
      name: "Standard Room",
      description: "Comfortable room with essential amenities",
      maxGuests: 2,
      basePrice: 100.0,
      amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    },
  })

  const deluxeRoom = await prisma.roomType.create({
    data: {
      instanceId: instance.id,
      name: "Deluxe Room",
      description: "Spacious room with premium amenities",
      maxGuests: 3,
      basePrice: 150.0,
      amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    },
  })

  console.log("✅ Created room types")

  // Create rooms
  for (let i = 1; i <= 5; i++) {
    await prisma.room.create({
      data: {
        instanceId: instance.id,
        roomNumber: `10${i}`,
        roomTypeId: standardRoom.id,
        status: "AVAILABLE",
        floor: 1,
      },
    })
  }

  for (let i = 1; i <= 3; i++) {
    await prisma.room.create({
      data: {
        instanceId: instance.id,
        roomNumber: `20${i}`,
        roomTypeId: deluxeRoom.id,
        status: "AVAILABLE",
        floor: 2,
      },
    })
  }

  console.log("✅ Created 8 rooms")

  // Create services
  await prisma.service.createMany({
    data: [
      {
        instanceId: instance.id,
        name: "Breakfast",
        description: "Continental breakfast buffet",
        price: 15.0,
        taxRate: 10.0,
        isRefundable: true,
      },
      {
        instanceId: instance.id,
        name: "Airport Transfer",
        description: "One-way airport transfer service",
        price: 50.0,
        taxRate: 10.0,
        isRefundable: false,
      },
      {
        instanceId: instance.id,
        name: "Extra Bed",
        description: "Additional bed in the room",
        price: 25.0,
        taxRate: 10.0,
        isRefundable: true,
      },
      {
        instanceId: instance.id,
        name: "Parking",
        description: "Secure parking space per night",
        price: 10.0,
        taxRate: 10.0,
        isRefundable: true,
      },
    ],
  })

  console.log("✅ Created services")

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
