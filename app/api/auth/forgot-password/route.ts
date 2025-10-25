import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    // In production, you would send an actual email here
    if (user) {
      // TODO: Generate reset token and send email
      // For now, just log it
      console.log(`Password reset requested for: ${email}`)

      // In production, you would:
      // 1. Generate a secure token
      // 2. Store it in the database with expiration
      // 3. Send email with reset link
      // 4. Example: await sendPasswordResetEmail(email, token)
    }

    return NextResponse.json({ message: "If an account exists, reset instructions have been sent" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
