import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Detect if we're in build phase (Vercel sets this automatically)
const isBuildTime = typeof window === 'undefined' && 
                    (process.env.VERCEL_ENV === 'production' || 
                     process.env.NEXT_PHASE === 'phase-production-build' ||
                     process.argv.includes('build'))

// Lazy initialization - only create client when actually needed
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Only initialize if not building and not in browser
if (!isBuildTime && typeof window === 'undefined') {
  globalForPrisma.prisma = globalForPrisma.prisma ?? createPrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Prevent connection during build - lazy connect only when needed
if (!isBuildTime && typeof window === 'undefined') {
  // Don't eagerly connect - let Prisma connect on first query
  // This prevents blocking during build
}

