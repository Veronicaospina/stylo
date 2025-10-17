// Lazy-load PrismaClient to avoid importing @prisma/client at build-time.
// This prevents Next.js from trying to bundle Prisma's runtime during the build step.
// Use `any` for the client type to avoid brittle type-resolution issues across
// different module formats that can appear in deployment environments.
const globalForPrisma = globalThis as unknown as { prisma?: any }

export async function getPrisma(): Promise<any> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  // dynamically import the package; some bundlers/packaging setups expose the
  // PrismaClient as `pkg.PrismaClient`, sometimes under `pkg.default`.
  const pkg: any = await import('@prisma/client')
  const PrismaClient = pkg.PrismaClient ?? pkg.default?.PrismaClient ?? pkg.default ?? pkg

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}
