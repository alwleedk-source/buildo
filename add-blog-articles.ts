import { db } from './src/lib/db';
import { blogArticles } from './src/lib/db/schema';

async function addBlogArticles() {
  console.log('📝 Adding 3 blog articles...');

  const articles = [
    {
      titleNl: 'Duurzaam Bouwen: De Toekomst van Constructie',
      titleEn: 'Sustainable Building: The Future of Construction',
      excerptNl: 'Ontdek hoe duurzaam bouwen de bouwsector transformeert en waarom het essentieel is voor de toekomst.',
      excerptEn: 'Discover how sustainable building is transforming the construction industry and why it is essential for the future.',
      contentNl: `# Duurzaam Bouwen: De Toekomst van Constructie

Duurzaam bouwen is niet langer een optie, maar een noodzaak. In een tijd waarin klimaatverandering en milieubescherming centraal staan, moet de bouwsector zich aanpassen.

## Wat is Duurzaam Bouwen?

Duurzaam bouwen betekent het creëren van gebouwen die minimale impact hebben op het milieu, zowel tijdens de bouw als gedurende hun levensduur.

## Voordelen

- **Energiebesparing**: Tot 50% minder energieverbruik
- **Lagere kosten**: Besparing op lange termijn
- **Gezonder**: Betere luchtkwaliteit
- **Toekomstbestendig**: Klaar voor nieuwe regelgeving

## Onze Aanpak

Bij BouwMeesters Amsterdam gebruiken we:
- Gerecyclede materialen
- Zonnepanelen
- Isolatietechnieken
- Slimme klimaatsystemen`,
      contentEn: `# Sustainable Building: The Future of Construction

Sustainable building is no longer an option, but a necessity. In a time when climate change and environmental protection are central, the construction sector must adapt.

## What is Sustainable Building?

Sustainable building means creating buildings that have minimal impact on the environment, both during construction and throughout their lifespan.

## Benefits

- **Energy Savings**: Up to 50% less energy consumption
- **Lower Costs**: Long-term savings
- **Healthier**: Better air quality
- **Future-proof**: Ready for new regulations

## Our Approach

At BouwMeesters Amsterdam we use:
- Recycled materials
- Solar panels
- Insulation techniques
- Smart climate systems`,
      categoryNl: 'Duurzaam Bouwen',
      categoryEn: 'Sustainable Building',
      metaDescriptionNl: 'Leer alles over duurzaam bouwen en hoe het de toekomst van de bouwsector vormgeeft.',
      metaDescriptionEn: 'Learn everything about sustainable building and how it shapes the future of construction.',
      keywordsNl: 'duurzaam bouwen, groene bouw, energiebesparing, milieuvriendelijk',
      keywordsEn: 'sustainable building, green construction, energy saving, eco-friendly',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      imageAlt: 'Duurzaam gebouw met zonnepanelen',
      slugNl: 'duurzaam-bouwen-toekomst',
      slugEn: 'sustainable-building-future',
      tagsNl: ['Duurzaamheid', 'Innovatie', 'Energie'],
      tagsEn: ['Sustainability', 'Innovation', 'Energy'],
      author: 'Jan de Vries',
      readingTime: 5,
      isPublished: true,
      isFeatured: true,
    },
    {
      titleNl: '5 Tips voor een Succesvolle Renovatie',
      titleEn: '5 Tips for a Successful Renovation',
      excerptNl: 'Plan je een renovatie? Deze 5 tips helpen je om je project soepel en binnen budget te voltooien.',
      excerptEn: 'Planning a renovation? These 5 tips will help you complete your project smoothly and within budget.',
      contentNl: `# 5 Tips voor een Succesvolle Renovatie

Een renovatie kan overweldigend zijn, maar met de juiste aanpak wordt het een succes.

## 1. Maak een Gedetailleerd Plan

Begin met een duidelijk plan van wat je wilt bereiken. Denk na over:
- Budget
- Tijdlijn
- Prioriteiten

## 2. Kies de Juiste Aannemer

Een goede aannemer is cruciaal. Controleer:
- Referenties
- Eerdere projecten
- Certificeringen

## 3. Verwacht het Onverwachte

Houd 10-15% van je budget als buffer voor onvoorziene kosten.

## 4. Communiceer Duidelijk

Regelmatige updates met je aannemer voorkomt misverstanden.

## 5. Denk aan de Toekomst

Kies materialen en ontwerpen die tijdloos zijn.`,
      contentEn: `# 5 Tips for a Successful Renovation

A renovation can be overwhelming, but with the right approach it becomes a success.

## 1. Make a Detailed Plan

Start with a clear plan of what you want to achieve. Think about:
- Budget
- Timeline
- Priorities

## 2. Choose the Right Contractor

A good contractor is crucial. Check:
- References
- Previous projects
- Certifications

## 3. Expect the Unexpected

Keep 10-15% of your budget as a buffer for unforeseen costs.

## 4. Communicate Clearly

Regular updates with your contractor prevents misunderstandings.

## 5. Think About the Future

Choose materials and designs that are timeless.`,
      categoryNl: 'Renovatie',
      categoryEn: 'Renovation',
      metaDescriptionNl: '5 praktische tips voor een succesvolle renovatie van je woning of bedrijfspand.',
      metaDescriptionEn: '5 practical tips for a successful renovation of your home or business premises.',
      keywordsNl: 'renovatie tips, verbouwen, aannemer kiezen',
      keywordsEn: 'renovation tips, remodeling, choosing contractor',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
      imageAlt: 'Renovatie in uitvoering',
      slugNl: '5-tips-succesvolle-renovatie',
      slugEn: '5-tips-successful-renovation',
      tagsNl: ['Renovatie', 'Tips', 'Planning'],
      tagsEn: ['Renovation', 'Tips', 'Planning'],
      author: 'Maria Jansen',
      readingTime: 4,
      isPublished: true,
      isFeatured: false,
    },
    {
      titleNl: 'Nieuwbouw Trends 2025',
      titleEn: 'New Construction Trends 2025',
      excerptNl: 'Wat zijn de belangrijkste trends in nieuwbouw voor 2025? Van smart homes tot modulair bouwen.',
      excerptEn: 'What are the key trends in new construction for 2025? From smart homes to modular building.',
      contentNl: `# Nieuwbouw Trends 2025

De bouwsector evolueert snel. Dit zijn de trends voor 2025.

## Smart Home Integratie

Moderne nieuwbouw is standaard uitgerust met:
- Slimme thermostaten
- Geautomatiseerde verlichting
- Beveiligingssystemen
- Energiemonitoring

## Modulair Bouwen

Prefab modules maken bouwen:
- Sneller (30-50% tijdsbesparing)
- Goedkoper
- Duurzamer
- Flexibeler

## Biofiele Architectuur

Natuur in het ontwerp:
- Groene gevels
- Binnenhoven
- Natuurlijke materialen
- Veel daglicht

## Circulaire Economie

Hergebruik van materialen wordt standaard:
- Demontabel bouwen
- Gerecyclede materialen
- Minimaal afval`,
      contentEn: `# New Construction Trends 2025

The construction sector is evolving rapidly. These are the trends for 2025.

## Smart Home Integration

Modern new construction is standard equipped with:
- Smart thermostats
- Automated lighting
- Security systems
- Energy monitoring

## Modular Building

Prefab modules make building:
- Faster (30-50% time savings)
- Cheaper
- More sustainable
- More flexible

## Biophilic Architecture

Nature in design:
- Green facades
- Inner courtyards
- Natural materials
- Lots of daylight

## Circular Economy

Reuse of materials becomes standard:
- Demountable construction
- Recycled materials
- Minimal waste`,
      categoryNl: 'Nieuwbouw',
      categoryEn: 'New Construction',
      metaDescriptionNl: 'Ontdek de nieuwste trends in nieuwbouw voor 2025, van smart homes tot circulair bouwen.',
      metaDescriptionEn: 'Discover the latest trends in new construction for 2025, from smart homes to circular building.',
      keywordsNl: 'nieuwbouw trends, smart home, modulair bouwen, 2025',
      keywordsEn: 'new construction trends, smart home, modular building, 2025',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      imageAlt: 'Modern nieuwbouw project',
      slugNl: 'nieuwbouw-trends-2025',
      slugEn: 'new-construction-trends-2025',
      tagsNl: ['Nieuwbouw', 'Trends', 'Technologie'],
      tagsEn: ['New Construction', 'Trends', 'Technology'],
      author: 'Peter van Dam',
      readingTime: 6,
      isPublished: true,
      isFeatured: false,
    },
  ];

  try {
    const inserted = await db.insert(blogArticles).values(articles).returning();
    console.log(`✅ Successfully added ${inserted.length} blog articles`);
    
    for (const article of inserted) {
      console.log(`   - ${article.titleNl} (${article.slugNl})`);
    }
  } catch (error) {
    console.error('❌ Error adding blog articles:', error);
  }
}

addBlogArticles()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
