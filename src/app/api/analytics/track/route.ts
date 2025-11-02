import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews, events } from '@/lib/db/schema-analytics';

/**
 * Analytics Tracking API
 * 
 * POST - Track page view or event
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Get client info
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';

    if (type === 'pageview') {
      await db.insert(pageViews).values({
        path: data.path,
        referrer: data.referrer,
        userAgent,
        ip,
        device: data.device,
        browser: data.browser,
        os: data.os,
        sessionId: data.sessionId,
        userId: data.userId
      });
    } else if (type === 'event') {
      await db.insert(events).values({
        name: data.name,
        category: data.category,
        label: data.label,
        value: data.value,
        metadata: data.metadata,
        path: data.path,
        sessionId: data.sessionId,
        userId: data.userId
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
