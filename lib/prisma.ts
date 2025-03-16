import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

// Create a new PrismaClient instance with better error handling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn", "query"],
  }).$extends(withAccelerate())
}

// Use type for global variable
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Create global variable for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Export the PrismaClient instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// In development, attach the client to the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

