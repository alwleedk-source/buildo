import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats, clearCache, invalidateCache } from '@/lib/cache-utils';

/**
 * Cache Management API
 * 
 * GET - Get cache statistics
 * DELETE - Clear cache or invalidate specific keys
 */

export async function GET() {
  try {
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      stats: {
        totalEntries: stats.size,
        keys: stats.keys
      }
    });
  } catch (error: any) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache stats' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Invalidate specific key or pattern
      invalidateCache(key);
      
      return NextResponse.json({
        success: true,
        message: `Cache invalidated for: ${key}`
      });
    } else {
      // Clear all cache
      clearCache();
      
      return NextResponse.json({
        success: true,
        message: 'All cache cleared'
      });
    }
  } catch (error: any) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
