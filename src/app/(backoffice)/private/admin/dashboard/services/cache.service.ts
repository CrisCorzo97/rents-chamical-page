'use server';

import { unstable_cache } from 'next/cache';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../components/constants/cache';

// ============================================================================
// FUNCIONES DE CACHE
// ============================================================================

/**
 * Crea una función cacheada con Next.js unstable_cache
 */
export async function createCachedFunction<
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  key: string,
  tags: string[],
  revalidate: number = 300 // 5 minutos por defecto
) {
  return unstable_cache(
    async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      return fn(...args);
    },
    [key],
    {
      tags,
      revalidate,
    }
  );
}

/**
 * Invalida cache por tag
 */
export async function invalidateCacheByTag(tag: string) {
  try {
    revalidateTag(tag);
    console.log(`Cache invalidated for tag: ${tag}`);
  } catch (error) {
    console.error(`Error invalidating cache for tag ${tag}:`, error);
  }
}

/**
 * Invalida cache por path
 */
export async function invalidateCacheByPath(path: string) {
  try {
    revalidatePath(path);
    console.log(`Cache invalidated for path: ${path}`);
  } catch (error) {
    console.error(`Error invalidating cache for path ${path}:`, error);
  }
}

/**
 * Invalida todo el cache del dashboard
 */
export async function invalidateDashboardCache() {
  try {
    // Invalidar por tags
    Object.values(CACHE_TAGS).forEach((tag) => {
      revalidateTag(tag);
    });

    // Invalidar por path
    revalidatePath('/admin/dashboard');

    console.log('Dashboard cache invalidated successfully');
  } catch (error) {
    console.error('Error invalidating dashboard cache:', error);
  }
}

// ============================================================================
// UTILIDADES DE CACHE
// ============================================================================

/**
 * Genera una clave de cache única basada en parámetros
 */
export async function generateCacheKey(
  baseKey: string,
  params: Record<string, any> = {}
): Promise<string> {
  const paramString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}:${value}`)
    .join('-');

  return paramString ? `${baseKey}-${paramString}` : baseKey;
}

/**
 * Valida si el cache está expirado
 */
export async function isCacheExpired(
  timestamp: number,
  ttl: number
): Promise<boolean> {
  return Date.now() - timestamp > ttl * 1000;
}

/**
 * Obtiene el tiempo restante del cache
 */
export async function getCacheTimeRemaining(
  timestamp: number,
  ttl: number
): Promise<number> {
  const elapsed = Date.now() - timestamp;
  return Math.max(0, ttl * 1000 - elapsed);
}
