import { db } from './src/lib/db';
import { sectionSettings } from './src/lib/db/schema';

async function seedSections() {
  console.log('🔧 Adding Section settings...');
  
  try {
    await db.insert(sectionSettings).values([
      { 
        sectionKey: 'hero', 
        titleNl: 'Hero',
        titleEn: 'Hero',
        isVisible: true, 
        showInHeader: false, 
        showInFooter: false, 
        order: 1 
      },
      { 
        sectionKey: 'statistics', 
        titleNl: 'Statistieken',
        titleEn: 'Statistics',
        isVisible: true, 
        showInHeader: false, 
        showInFooter: false, 
        order: 2 
      },
      { 
        sectionKey: 'about', 
        titleNl: 'Over Ons',
        titleEn: 'About Us',
        isVisible: true, 
        showInHeader: true, 
        showInFooter: true, 
        order: 3 
      },
      { 
        sectionKey: 'services', 
        titleNl: 'Diensten',
        titleEn: 'Services',
        isVisible: true, 
        showInHeader: true, 
        showInFooter: true, 
        order: 4 
      },
      { 
        sectionKey: 'projects', 
        titleNl: 'Projecten',
        titleEn: 'Projects',
        isVisible: true, 
        showInHeader: true, 
        showInFooter: true, 
        order: 5 
      },
      { 
        sectionKey: 'testimonials', 
        titleNl: 'Getuigenissen',
        titleEn: 'Testimonials',
        isVisible: true, 
        showInHeader: false, 
        showInFooter: false, 
        order: 6 
      },
      { 
        sectionKey: 'blog', 
        titleNl: 'Blog',
        titleEn: 'Blog',
        isVisible: true, 
        showInHeader: true, 
        showInFooter: true, 
        order: 7 
      },
      { 
        sectionKey: 'contact', 
        titleNl: 'Contact',
        titleEn: 'Contact',
        isVisible: true, 
        showInHeader: true, 
        showInFooter: true, 
        order: 8 
      },
    ]);
    
    console.log('✅ Section settings added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedSections();
