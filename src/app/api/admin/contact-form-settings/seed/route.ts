import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormSettings } from '@/lib/db/schema';

export async function POST() {
  try {
    // Default contact form fields
    const defaultFields = [
      {
        fieldKey: 'first_name',
        labelNl: 'Voornaam',
        labelEn: 'First Name',
        placeholder: 'John',
        isRequired: true,
        isVisible: true,
        fieldType: 'text',
        order: 1
      },
      {
        fieldKey: 'last_name',
        labelNl: 'Achternaam',
        labelEn: 'Last Name',
        placeholder: 'Doe',
        isRequired: true,
        isVisible: true,
        fieldType: 'text',
        order: 2
      },
      {
        fieldKey: 'email',
        labelNl: 'E-mailadres',
        labelEn: 'Email Address',
        placeholder: 'john@example.com',
        isRequired: true,
        isVisible: true,
        fieldType: 'email',
        order: 3
      },
      {
        fieldKey: 'phone',
        labelNl: 'Telefoonnummer',
        labelEn: 'Phone Number',
        placeholder: '+31 6 12345678',
        isRequired: false,
        isVisible: true,
        fieldType: 'tel',
        order: 4
      },
      {
        fieldKey: 'company',
        labelNl: 'Bedrijfsnaam',
        labelEn: 'Company Name',
        placeholder: 'ABC Company',
        isRequired: false,
        isVisible: true,
        fieldType: 'text',
        order: 5
      },
      {
        fieldKey: 'subject',
        labelNl: 'Onderwerp',
        labelEn: 'Subject',
        placeholder: 'Wat kunnen we voor u doen?',
        isRequired: true,
        isVisible: true,
        fieldType: 'text',
        order: 6
      },
      {
        fieldKey: 'message',
        labelNl: 'Bericht',
        labelEn: 'Message',
        placeholder: 'Vertel ons over uw project...',
        isRequired: true,
        isVisible: true,
        fieldType: 'textarea',
        order: 7
      },
      {
        fieldKey: 'project_type',
        labelNl: 'Type Project',
        labelEn: 'Project Type',
        placeholder: 'Selecteer een optie',
        isRequired: false,
        isVisible: true,
        fieldType: 'select',
        options: {
          nl: ['Nieuwbouw', 'Renovatie', 'Onderhoud', 'Restauratie', 'Anders'],
          en: ['New Construction', 'Renovation', 'Maintenance', 'Restoration', 'Other']
        },
        order: 8
      },
      {
        fieldKey: 'budget',
        labelNl: 'Budget',
        labelEn: 'Budget',
        placeholder: 'Selecteer een optie',
        isRequired: false,
        isVisible: true,
        fieldType: 'select',
        options: {
          nl: ['< €50.000', '€50.000 - €100.000', '€100.000 - €250.000', '€250.000 - €500.000', '> €500.000'],
          en: ['< €50,000', '€50,000 - €100,000', '€100,000 - €250,000', '€250,000 - €500,000', '> €500,000']
        },
        order: 9
      },
      {
        fieldKey: 'timeline',
        labelNl: 'Gewenste Startdatum',
        labelEn: 'Desired Start Date',
        placeholder: 'Selecteer een optie',
        isRequired: false,
        isVisible: true,
        fieldType: 'select',
        options: {
          nl: ['Zo snel mogelijk', 'Binnen 1 maand', 'Binnen 3 maanden', 'Binnen 6 maanden', 'Nog niet zeker'],
          en: ['As soon as possible', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Not sure yet']
        },
        order: 10
      }
    ];

    await db.insert(contactFormSettings).values(defaultFields);

    return NextResponse.json({
      success: true,
      message: 'Contact form settings seeded successfully',
      count: defaultFields.length
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
