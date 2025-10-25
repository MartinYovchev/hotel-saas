import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { logger } from "./logger"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
  }
}

export function handleError(error: unknown): NextResponse {
  // Zod validation errors
  if (error instanceof ZodError) {
    const message = error.errors[0]?.message || "Validation error"
    logger.warn("Validation error", { errors: error.errors })
    return NextResponse.json({ error: message, details: error.errors }, { status: 400 })
  }

  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; message: string }
    if (prismaError.code === "P2002") {
      logger.warn("Unique constraint violation", { error: prismaError.message })
      return NextResponse.json({ error: "A record with this value already exists" }, { status: 409 })
    }
    if (prismaError.code === "P2025") {
      logger.warn("Record not found", { error: prismaError.message })
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }
  }

  // Application errors
  if (error instanceof AppError) {
    logger.warn("Application error", {
      statusCode: error.statusCode,
      message: error.message,
    })
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  // Unknown errors
  logger.error("Unexpected error", {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  })

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
