import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormSettings } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    let settings = await db
      .select()
      .from(contactFormSettings)
      .orderBy(asc(contactFormSettings.order));
    
    console.log('[Contact Form Settings] Retrieved settings count:', settings.length);
    
    // If no settings exist, create default ones
    if (settings.length === 0) {
      console.log('[Contact Form Settings] No settings found, creating defaults...');
      const defaultFields = [
        { fieldKey: 'firstName', labelNl: 'Voornaam', labelEn: 'First Name', fieldType: 'text', isRequired: true, isVisible: true, order: 1 },
        { fieldKey: 'lastName', labelNl: 'Achternaam', labelEn: 'Last Name', fieldType: 'text', isRequired: true, isVisible: true, order: 2 },
        { fieldKey: 'email', labelNl: 'E-mailadres', labelEn: 'Email', fieldType: 'email', isRequired: true, isVisible: true, order: 3 },
        { fieldKey: 'phone', labelNl: 'Telefoonnummer', labelEn: 'Phone', fieldType: 'tel', isRequired: false, isVisible: true, order: 4 },
        { fieldKey: 'company', labelNl: 'Bedrijfsnaam', labelEn: 'Company', fieldType: 'text', isRequired: false, isVisible: true, order: 5 },
        { fieldKey: 'subject', labelNl: 'Onderwerp', labelEn: 'Subject', fieldType: 'text', isRequired: true, isVisible: true, order: 6 },
        { fieldKey: 'projectType', labelNl: 'Type Project', labelEn: 'Project Type', fieldType: 'select', isRequired: false, isVisible: true, order: 7, options: ['Nieuwbouw', 'Renovatie', 'Onderhoud', 'Anders'] },
        { fieldKey: 'budget', labelNl: 'Budget', labelEn: 'Budget', fieldType: 'select', isRequired: false, isVisible: true, order: 8, options: ['< €50k', '€50k - €100k', '€100k - €250k', '> €250k'] },
        { fieldKey: 'timeline', labelNl: 'Tijdlijn', labelEn: 'Timeline', fieldType: 'select', isRequired: false, isVisible: true, order: 9, options: ['Zo snel mogelijk', '1-3 maanden', '3-6 maanden', '> 6 maanden'] },
        { fieldKey: 'message', labelNl: 'Bericht', labelEn: 'Message', fieldType: 'textarea', isRequired: true, isVisible: true, order: 10 },
      ];
      
      await db.insert(contactFormSettings).values(defaultFields);
      console.log('[Contact Form Settings] Defaults inserted successfully');
      settings = await db.select().from(contactFormSettings).orderBy(asc(contactFormSettings.order));
      console.log('[Contact Form Settings] Retrieved after insert:', settings.length);
    }
    
    return NextResponse.json({ data: settings, success: true });
  } catch (error: any) {
    console.error('GET contact form settings error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
