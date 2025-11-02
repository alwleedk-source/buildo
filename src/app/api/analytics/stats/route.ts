import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews, events } from '@/lib/db/schema-analytics';
import { sql } from 'drizzle-orm';

/**
 * Analytics Stats API
 * 
 * GET - Get analytics statistics
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 24h, 7d, 30d, 90d

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    // Get total page views
    const totalPageViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(sql`created_at >= ${startDate}`);

    // Get total events
    const totalEvents = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(sql`created_at >= ${startDate}`);

    // Get top pages
    const topPages = await db
      .select({
        path: pageViews.path,
        count: sql<number>`count(*)`
      })
      .from(pageViews)
      .where(sql`created_at >= ${startDate}`)
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // Get top events
    const topEvents = await db
      .select({
        name: events.name,
        count: sql<number>`count(*)`
      })
      .from(events)
      .where(sql`created_at >= ${startDate}`)
      .groupBy(events.name)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // Get devices breakdown
    const deviceBreakdown = await db
      .select({
        device: pageViews.device,
        count: sql<number>`count(*)`
      })
      .from(pageViews)
      .where(sql`created_at >= ${startDate}`)
      .groupBy(pageViews.device)
      .orderBy(sql`count(*) DESC`);

    // Get browsers breakdown
    const browserBreakdown = await db
      .select({
        browser: pageViews.browser,
        count: sql<number>`count(*)`
      })
      .from(pageViews)
      .where(sql`created_at >= ${startDate}`)
      .groupBy(pageViews.browser)
      .orderBy(sql`count(*) DESC`);

    return NextResponse.json({
      success: true,
      data: {
        period,
        totalPageViews: totalPageViews[0]?.count || 0,
        totalEvents: totalEvents[0]?.count || 0,
        topPages,
        topEvents,
        deviceBreakdown,
        browserBreakdown
      }
    });
  } catch (error: any) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    );
  }
}
