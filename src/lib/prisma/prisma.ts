import { PrismaClient } from '@prisma/client';

// Solo usamos caching global en producción
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // En producción, usamos una sola instancia global
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
} else {
  // En desarrollo, siempre se crea una nueva instancia
  prisma = new PrismaClient();
}

export const dbSupabase = prisma;
export default dbSupabase;
