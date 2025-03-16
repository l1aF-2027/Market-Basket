// This is a utility script to reset the database sequence for the Purchase table
// Run this with: npx ts-node scripts/reset-db.ts

import { PrismaClient } from "@prisma/client"

async function resetSequence() {
  const prisma = new PrismaClient()

  try {
    // Connect to the database
    await prisma.$connect()

    // Get the highest ID in the Purchase table
    const highestPurchase = await prisma.purchase.findFirst({
      orderBy: {
        id: "desc",
      },
    })

    const highestId = highestPurchase?.id || 0

    // Execute raw SQL to reset the sequence
    // This is PostgreSQL specific
    await prisma.$executeRaw`SELECT setval('public."Purchase_id_seq"', ${highestId + 1}, false);`

    console.log(`Reset Purchase ID sequence to ${highestId + 1}`)
  } catch (error) {
    console.error("Error resetting sequence:", error)
  } finally {
    await prisma.$disconnect()
  }
}

resetSequence()
  .then(() => console.log("Done!"))
  .catch(console.error)

