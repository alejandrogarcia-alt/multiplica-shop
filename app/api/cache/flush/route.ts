import { NextRequest, NextResponse } from 'next/server';
import { memoryCache } from '@/lib/cache';

/**
 * POST /api/cache/flush
 * Clears all cached data (Gemini and Mercado Libre API calls)
 */
export async function POST(request: NextRequest) {
  try {
    // Clear the cache
    memoryCache.clear();

    // Get cache stats to confirm it's empty
    const stats = memoryCache.getStats();

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      stats,
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cache/flush
 * Returns current cache statistics
 */
export async function GET(request: NextRequest) {
  try {
    const stats = memoryCache.getStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get cache stats',
      },
      { status: 500 }
    );
  }
}
