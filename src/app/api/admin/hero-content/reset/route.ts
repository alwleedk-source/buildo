import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { heroContent } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    // Delete all
    await db.delete(heroContent);
    
    // Insert one
    const [newHero] = await db.insert(heroContent).values({
      titleNl: "Uw Betrouwbare Bouwpartner in Nederland",
      titleEn: "Your Trusted Construction Partner in the Netherlands",
      subtitleNl: "Kwaliteit, vakmanschap en innovatie sinds 2004",
      subtitleEn: "Quality, craftsmanship and innovation since 2004",
      primaryCtaNl: "Neem Contact Op",
      primaryCtaEn: "Contact Us",
      secondaryCtaNl: "Bekijk Onze Projecten",
      secondaryCtaEn: "View Our Projects",
      videoUrl: "https://ubrand.sa/Basharweb/Video/9d00aa74-8747-4e63-a796-a94ab8006c42.mp4",
      videoType: "upload",
      mediaType: "video",
      overlayOpacity: 40,
      textAlign: "center",
      isActive: true
    }).returning();
    
    return NextResponse.json({ success: true, hero: newHero });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
