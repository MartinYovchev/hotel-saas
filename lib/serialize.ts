import { Decimal } from "@prisma/client/runtime/library"

/**
 * Converts Prisma Decimal objects to numbers for serialization to Client Components
 */
export function serializeDecimal(value: Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null
  return value.toNumber()
}

/**
 * Recursively converts all non-serializable fields (Decimal, Date, etc.) to serializable formats
 */
export function serializePrismaData<T>(data: T): any {
  if (data === null || data === undefined) {
    return data
  }

  // Handle Prisma Decimal
  if (data instanceof Decimal) {
    return data.toNumber()
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString()
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePrismaData(item))
  }

  // Handle plain objects
  if (typeof data === "object" && data !== null) {
    // Check if it's a plain object (not a class instance)
    const proto = Object.getPrototypeOf(data)
    if (proto === Object.prototype || proto === null) {
      const serialized: any = {}
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          serialized[key] = serializePrismaData(data[key])
        }
      }
      return serialized
    }
  }

  return data
}
