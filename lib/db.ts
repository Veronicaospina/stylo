// Lazy-load PrismaClient to avoid importing @prisma/client at build-time
// This prevents Next.js from trying to bundle Prisma's runtime during the build step.
type PrismaClientType = import('@prisma/client').PrismaClient

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType }

export async function getPrisma(): Promise<PrismaClientType> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const { PrismaClient } = await import('@prisma/client')
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}
