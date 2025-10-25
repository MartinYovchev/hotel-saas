type LogLevel = "info" | "warn" | "error" | "debug"

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    }

    if (process.env.NODE_ENV === "production") {
      // In production, output structured JSON logs
      console.log(JSON.stringify(logData))
    } else {
      // In development, output readable logs
      const emoji = {
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        debug: "🐛",
      }[level]

      console.log(`${emoji} [${timestamp}] ${message}`, context || "")
    }
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context)
  }

  error(message: string, context?: LogContext) {
    this.log("error", message, context)
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, context)
    }
  }
}

export const logger = new Logger()
