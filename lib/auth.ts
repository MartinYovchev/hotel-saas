import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

const isPreviewMode = !process.env.NEON_NEON_DATABASE_URL || process.env.NEON_DATABASE_URL?.includes("placeholder")

const DEMO_USERS = [
  {
    id: "demo-user-1",
    email: "admin@demo.com",
    name: "Demo Admin",
    passwordHash: "$2a$10$rKvVLw5yzQjQFJXqJ5J5JeYxYxYxYxYxYxYxYxYxYxYxYxYxYxY", // "password"
  },
]

async function getPrismaClient() {
  if (isPreviewMode) {
    console.log("[v0] Preview mode detected - using demo authentication")
    return null
  }
  try {
    const { prisma } = await import("./prisma")
    if (!prisma) {
      console.log("[v0] Prisma client is null - using demo authentication")
      return null
    }
    return prisma
  } catch (error) {
    console.log("[v0] Prisma not available - using demo authentication:", error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[v0] Authorize called with email:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing credentials")
          return null
        }

        try {
          const prisma = await getPrismaClient()

          if (!prisma) {
            console.log("[v0] Using demo authentication mode")
            const demoUser = DEMO_USERS.find((u) => u.email === credentials.email)

            if (!demoUser) {
              console.log("[v0] Demo user not found")
              return null
            }

            // Simple password check for demo
            if (credentials.password !== "password") {
              console.log("[v0] Invalid demo password")
              return null
            }

            console.log("[v0] Demo authentication successful")
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
            }
          }

          console.log("[v0] Using database authentication")
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.passwordHash) {
            console.log("[v0] User not found in database")
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            console.log("[v0] Invalid password")
            return null
          }

          console.log("[v0] Database authentication successful")
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("[v0] Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
