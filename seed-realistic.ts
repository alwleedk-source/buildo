import { db } from './src/lib/db';
import { 
  heroContent, 
  aboutContent, 
  services, 
  projects, 
  blogArticles,
  statistics,
  testimonials,
  teamMembers,
  companyDetails,
  siteSettings,
  sectionSettings,
  footerSettings
} from './src/lib/db/schema';

async function seed() {
  console.log('🌱 Starting realistic database seeding for BouwMeesters...');

  try {
    // 1. Hero Content with Video
    console.log('🎬 Adding Hero content with video...');
    await db.insert(heroContent).values({
      titleNl: 'Uw Betrouwbare Bouwpartner in Nederland',
      titleEn: 'Your Trusted Construction Partner in the Netherlands',
      subtitleNl: 'Kwaliteit, vakmanschap en innovatie sinds 2004',
      subtitleEn: 'Quality, craftsmanship and innovation since 2004',
      primaryCtaNl: 'Neem Contact Op',
      primaryCtaEn: 'Contact Us',
      secondaryCtaNl: 'Bekijk Onze Projecten',
      secondaryCtaEn: 'View Our Projects',
      backgroundImage: 'https://ubrand.sa/Basharweb/Video/9d00aa74-8747-4e63-a796-a94ab8006c42.mp4',
      mediaType: 'video',
      textAlign: 'center',
      displayStyle: 'overlay',
      overlayOpacity: 40,
      headerOverlay: true,
    });

    // 2. About Content
    console.log('📝 Adding About content...');
    await db.insert(aboutContent).values({
      titleNl: 'Over BouwMeesters',
      titleEn: 'About BouwMeesters',
      subtitleNl: 'Meer dan 20 jaar ervaring in de bouw',
      subtitleEn: 'More than 20 years of construction experience',
      descriptionNl: 'BouwMeesters is een professioneel bouwbedrijf dat actief is in heel Nederland. Wij zijn gespecialiseerd in nieuwbouw, renovatie, onderhoud en restauratie van woningen en bedrijfspanden. Met meer dan twee decennia aan ervaring leveren wij hoogwaardige bouwoplossingen die voldoen aan de hoogste normen van kwaliteit, duurzaamheid en innovatie. Ons team van vakbekwame professionals staat garant voor vakmanschap en betrouwbaarheid.',
      descriptionEn: 'BouwMeesters is a professional construction company active throughout the Netherlands. We specialize in new construction, renovation, maintenance and restoration of homes and commercial buildings. With more than two decades of experience, we deliver high-quality construction solutions that meet the highest standards of quality, sustainability and innovation. Our team of skilled professionals guarantees craftsmanship and reliability.',
      missionNl: 'Onze missie is om duurzame en innovatieve bouwoplossingen te leveren die de verwachtingen van onze klanten overtreffen. Wij streven naar perfectie in elk project, groot of klein.',
      missionEn: 'Our mission is to deliver sustainable and innovative construction solutions that exceed our clients\' expectations. We strive for perfection in every project, large or small.',
      visionNl: 'Wij streven ernaar de meest vertrouwde en toonaangevende bouwpartner in Nederland te zijn, bekend om onze kwaliteit, betrouwbaarheid en klanttevredenheid.',
      visionEn: 'We strive to be the most trusted and leading construction partner in the Netherlands, known for our quality, reliability and customer satisfaction.',
      valuesNl: 'Kwaliteit • Vakmanschap • Betrouwbaarheid • Innovatie • Duurzaamheid • Klanttevredenheid',
      valuesEn: 'Quality • Craftsmanship • Reliability • Innovation • Sustainability • Customer Satisfaction',
    });

    // 3. Statistics
    console.log('📊 Adding Statistics...');
    await db.insert(statistics).values([
      {
        labelNl: 'Voltooide Projecten',
        labelEn: 'Completed Projects',
        value: '750+',
        iconName: 'building',
        displayOrder: 1,
      },
      {
        labelNl: 'Tevreden Klanten',
        labelEn: 'Happy Clients',
        value: '500+',
        iconName: 'users',
        displayOrder: 2,
      },
      {
        labelNl: 'Jaren Ervaring',
        labelEn: 'Years Experience',
        value: '20+',
        iconName: 'award',
        displayOrder: 3,
      },
      {
        labelNl: 'Vakbekwame Professionals',
        labelEn: 'Skilled Professionals',
        value: '65+',
        iconName: 'team',
        displayOrder: 4,
      },
    ]);

    // 4. Services
    console.log('🔧 Adding Services...');
    await db.insert(services).values([
      {
        titleNl: 'Nieuwbouw',
        titleEn: 'New Construction',
        slug: 'nieuwbouw',
        descriptionNl: 'Complete nieuwbouwprojecten van ontwerp tot oplevering in heel Nederland',
        descriptionEn: 'Complete new construction projects from design to delivery throughout the Netherlands',
        fullDescriptionNl: 'Wij verzorgen het volledige proces van nieuwbouwprojecten, van de eerste schets tot de sleuteloverdracht. Of het nu gaat om een eengezinswoning, appartementencomplex of bedrijfspand, ons ervaren team zorgt voor een naadloze uitvoering met aandacht voor detail en kwaliteit. Wij werken volgens de nieuwste bouwvoorschriften en maken gebruik van moderne, duurzame bouwmethoden.',
        fullDescriptionEn: 'We handle the entire process of new construction projects, from the first sketch to the handover of keys. Whether it\'s a single-family home, apartment complex or commercial building, our experienced team ensures seamless execution with attention to detail and quality. We work according to the latest building regulations and use modern, sustainable construction methods.',
        iconName: 'building',
        featuredImage: '/images/projects/A4WdlDbNjE9d.jpg',
        displayOrder: 1,
        isActive: true,
      },
      {
        titleNl: 'Renovatie & Verbouwing',
        titleEn: 'Renovation & Remodeling',
        slug: 'renovatie',
        descriptionNl: 'Professionele renovatie en verbouwing van woningen en bedrijfspanden',
        descriptionEn: 'Professional renovation and remodeling of homes and commercial buildings',
        fullDescriptionNl: 'Van kleine verbouwingen tot complete renovaties, wij transformeren uw ruimte naar uw wensen. Met respect voor de bestaande structuur en met oog voor moderne mogelijkheden creëren wij ruimtes die perfect aansluiten bij uw levensstijl of bedrijfsvoering. Onze ervaring met monumentale panden en moderne woningen garandeert een resultaat waar u jarenlang plezier van heeft.',
        fullDescriptionEn: 'From small remodels to complete renovations, we transform your space to your wishes. With respect for the existing structure and an eye for modern possibilities, we create spaces that perfectly match your lifestyle or business operations. Our experience with monumental buildings and modern homes guarantees a result you will enjoy for years.',
        iconName: 'wrench',
        featuredImage: '/images/projects/o8BbgNpfAxQb.jpg',
        displayOrder: 2,
        isActive: true,
      },
      {
        titleNl: 'Onderhoud & Reparatie',
        titleEn: 'Maintenance & Repair',
        slug: 'onderhoud',
        descriptionNl: 'Regelmatig onderhoud en snelle reparaties voor uw gebouw',
        descriptionEn: 'Regular maintenance and quick repairs for your building',
        fullDescriptionNl: 'Preventief onderhoud voorkomt grotere problemen en verlengt de levensduur van uw gebouw. Wij bieden onderhoudscontracten op maat voor particulieren, VvE\'s en bedrijven. Van schilderwerk tot dakreparaties, van kozijnonderhoud tot installatiewerk - wij zorgen ervoor dat uw pand in optimale staat blijft. Bij spoedgevallen zijn wij snel ter plaatse.',
        fullDescriptionEn: 'Preventive maintenance prevents major problems and extends the life of your building. We offer customized maintenance contracts for individuals, homeowners associations and companies. From painting to roof repairs, from window frame maintenance to installation work - we ensure that your property remains in optimal condition. In emergencies, we are quickly on site.',
        iconName: 'tools',
        featuredImage: '/images/projects/VQCY8iHvoaVu.jpg',
        displayOrder: 3,
        isActive: true,
      },
      {
        titleNl: 'Restauratie',
        titleEn: 'Restoration',
        slug: 'restauratie',
        descriptionNl: 'Specialistische restauratie van monumentale en historische panden',
        descriptionEn: 'Specialized restoration of monumental and historic buildings',
        fullDescriptionNl: 'Monumentale panden vereisen specialistische kennis en vakmanschap. Ons team heeft ruime ervaring met het restaureren van historische gebouwen, waarbij we de authentieke uitstraling behouden en tegelijkertijd moderne comfort en veiligheid waarborgen. Wij werken volgens de richtlijnen voor monumentenzorg en beschikken over de benodigde certificeringen.',
        fullDescriptionEn: 'Monumental buildings require specialized knowledge and craftsmanship. Our team has extensive experience in restoring historic buildings, preserving their authentic appearance while ensuring modern comfort and safety. We work according to monument care guidelines and have the necessary certifications.',
        iconName: 'landmark',
        featuredImage: '/images/projects/kldiMwSfWiXC.jpg',
        displayOrder: 4,
        isActive: true,
      },
      {
        titleNl: 'Duurzaam Bouwen',
        titleEn: 'Sustainable Building',
        slug: 'duurzaam-bouwen',
        descriptionNl: 'Energiezuinige en milieuvriendelijke bouwoplossingen',
        descriptionEn: 'Energy-efficient and environmentally friendly building solutions',
        fullDescriptionNl: 'Duurzaamheid staat centraal in onze werkwijze. Wij adviseren over en implementeren energiezuinige oplossingen zoals isolatie, zonnepanelen, warmtepompen en duurzame materialen. Hiermee verlagen we niet alleen uw energiekosten, maar dragen we ook bij aan een betere toekomst. Onze projecten voldoen aan de nieuwste duurzaamheidsnormen en certificeringen.',
        fullDescriptionEn: 'Sustainability is central to our approach. We advise on and implement energy-efficient solutions such as insulation, solar panels, heat pumps and sustainable materials. This not only reduces your energy costs, but also contributes to a better future. Our projects meet the latest sustainability standards and certifications.',
        iconName: 'leaf',
        featuredImage: '/images/projects/ZD8Lo6kETFbU.jpg',
        displayOrder: 5,
        isActive: true,
      },
    ]);

    // 5. Projects
    console.log('🏗️ Adding realistic Projects...');
    await db.insert(projects).values([
      {
        titleNl: 'Luxe Wooncomplex Rotterdam',
        titleEn: 'Luxury Residential Complex Rotterdam',
        slug: 'luxe-wooncomplex-rotterdam',
        descriptionNl: 'Modern wooncomplex met 45 duurzame appartementen',
        descriptionEn: 'Modern residential complex with 45 sustainable apartments',
        categoryNl: 'Residentieel',
        categoryEn: 'Residential',
        fullDescriptionNl: 'Een prestigieus nieuwbouwproject in Rotterdam met luxe appartementen, ondergrondse parking, groene binnentuin en zonnepanelen. Het complex is voorzien van hoogwaardige afwerking, vloerverwarming en energielabel A+++. Opgeleverd in 2023.',
        fullDescriptionEn: 'A prestigious new construction project in Rotterdam with luxury apartments, underground parking, green courtyard and solar panels. The complex features high-quality finishes, underfloor heating and energy label A+++. Delivered in 2023.',
        location: 'Rotterdam',
        clientName: 'Woningbouw Ontwikkeling BV',
        completionDate: new Date('2023-08-20'),
        projectValue: '€18.500.000',
        duration: '20 maanden',
        category: 'residential',
        status: 'completed',
        featuredImage: '/images/projects/A4WdlDbNjE9d.jpg',
        displayOrder: 1,
        isActive: true,
      },
      {
        titleNl: 'Renovatie Grachtenpand Amsterdam',
        titleEn: 'Canal House Renovation Amsterdam',
        slug: 'renovatie-grachtenpand-amsterdam',
        descriptionNl: 'Monumentale renovatie van 17e eeuws grachtenpand',
        descriptionEn: 'Monumental renovation of 17th century canal house',
        categoryNl: 'Residentieel',
        categoryEn: 'Residential',
        fullDescriptionNl: 'Complete restauratie van een monumentaal grachtenpand uit 1650, waarbij de authentieke elementen zoals balkenplafonds, schouwen en gevelopbouw behouden bleven. Tegelijkertijd werd het pand voorzien van moderne voorzieningen, isolatie en installaties. Een prachtig voorbeeld van oud en nieuw in harmonie.',
        fullDescriptionEn: 'Complete restoration of a monumental canal house from 1650, preserving authentic elements such as beam ceilings, fireplaces and facade structure. At the same time, the building was equipped with modern facilities, insulation and installations. A beautiful example of old and new in harmony.',
        location: 'Amsterdam',
        clientName: 'Particuliere opdrachtgever',
        completionDate: new Date('2023-11-15'),
        projectValue: '€2.800.000',
        duration: '14 maanden',
        category: 'residential',
        status: 'completed',
        featuredImage: '/images/projects/o8BbgNpfAxQb.jpg',
        displayOrder: 2,
        isActive: true,
      },
      {
        titleNl: 'Kantoorgebouw Utrecht',
        titleEn: 'Office Building Utrecht',
        slug: 'kantoorgebouw-utrecht',
        descriptionNl: 'Duurzaam kantoorgebouw met BREEAM Outstanding certificaat',
        descriptionEn: 'Sustainable office building with BREEAM Outstanding certificate',
        categoryNl: 'Commercieel',
        categoryEn: 'Commercial',
        fullDescriptionNl: 'Een ultramodern kantoorgebouw van 6 verdiepingen met focus op duurzaamheid en werknemerswelzijn. Het gebouw beschikt over groene daken, zonnepanelen, warmtepompen, natuurlijke ventilatie en een energieopslag systeem. BREEAM Outstanding gecertificeerd.',
        fullDescriptionEn: 'An ultra-modern 6-story office building focused on sustainability and employee well-being. The building features green roofs, solar panels, heat pumps, natural ventilation and an energy storage system. BREEAM Outstanding certified.',
        location: 'Utrecht',
        clientName: 'Green Office Solutions NV',
        completionDate: new Date('2024-03-10'),
        projectValue: '€22.000.000',
        duration: '22 maanden',
        category: 'commercial',
        status: 'completed',
        featuredImage: '/images/projects/ZD8Lo6kETFbU.jpg',
        displayOrder: 3,
        isActive: true,
      },
      {
        titleNl: 'Woningbouw Den Haag',
        titleEn: 'Housing Development The Hague',
        slug: 'woningbouw-den-haag',
        descriptionNl: 'Nieuwbouw van 28 energieneutrale eengezinswoningen',
        descriptionEn: 'New construction of 28 energy-neutral single-family homes',
        categoryNl: 'Residentieel',
        categoryEn: 'Residential',
        fullDescriptionNl: 'Een innovatief woningbouwproject met 28 volledig energieneutrale woningen. Elke woning is voorzien van zonnepanelen, warmtepomp, triple glas en uitstekende isolatie. De wijk beschikt over groene buitenruimtes en speelvoorzieningen.',
        fullDescriptionEn: 'An innovative housing project with 28 fully energy-neutral homes. Each home is equipped with solar panels, heat pump, triple glazing and excellent insulation. The neighborhood features green outdoor spaces and play facilities.',
        location: 'Den Haag',
        clientName: 'Woningcorporatie Haagse Huizen',
        completionDate: new Date('2024-01-25'),
        projectValue: '€12.600.000',
        duration: '16 maanden',
        category: 'residential',
        status: 'completed',
        featuredImage: '/images/projects/4vPrJOQfZSEg.jpg',
        displayOrder: 4,
        isActive: true,
      },
      {
        titleNl: 'Renovatie Schoolgebouw Eindhoven',
        titleEn: 'School Building Renovation Eindhoven',
        slug: 'renovatie-schoolgebouw-eindhoven',
        descriptionNl: 'Verduurzaming en modernisering van basisschool',
        descriptionEn: 'Sustainability upgrade and modernization of primary school',
        categoryNl: 'Commercieel',
        categoryEn: 'Commercial',
        fullDescriptionNl: 'Complete renovatie van een basisschool uit de jaren 70, waarbij het gebouw is getransformeerd tot een modern, energiezuinig en inspirerend leeromgeving. Nieuwe ramen, isolatie, LED-verlichting, zonnepanelen en moderne klaslokalen.',
        fullDescriptionEn: 'Complete renovation of a primary school from the 1970s, transforming the building into a modern, energy-efficient and inspiring learning environment. New windows, insulation, LED lighting, solar panels and modern classrooms.',
        location: 'Eindhoven',
        clientName: 'Gemeente Eindhoven',
        completionDate: new Date('2023-07-30'),
        projectValue: '€4.200.000',
        duration: '10 maanden',
        category: 'commercial',
        status: 'completed',
        featuredImage: '/images/projects/A6LCTCOqU26w.jpg',
        displayOrder: 5,
        isActive: true,
      },
    ]);

    // 6. Blog Articles
    console.log('📰 Adding Blog articles...');
    await db.insert(blogArticles).values([
      {
        titleNl: 'Duurzaam Bouwen: De Toekomst is Nu',
        titleEn: 'Sustainable Building: The Future is Now',
        slugNl: 'duurzaam-bouwen-toekomst',
        slugEn: 'sustainable-building-future',
        excerptNl: 'Ontdek hoe duurzaam bouwen de standaard wordt in Nederland en wat dit betekent voor uw project',
        excerptEn: 'Discover how sustainable building is becoming the standard in the Netherlands and what this means for your project',
        contentNl: 'Duurzaam bouwen is niet langer een optie, maar een noodzaak. In Nederland worden steeds strengere eisen gesteld aan de energieprestatie van gebouwen. In dit artikel bespreken we de laatste trends en technieken in duurzaam bouwen, van isolatie tot zonnepanelen en van warmtepompen tot circulaire bouwmaterialen. Wij leggen uit hoe u uw project duurzaam kunt realiseren en welke subsidies beschikbaar zijn.',
        contentEn: 'Sustainable building is no longer an option, but a necessity. In the Netherlands, increasingly strict requirements are being imposed on the energy performance of buildings. In this article we discuss the latest trends and techniques in sustainable building, from insulation to solar panels and from heat pumps to circular building materials. We explain how you can realize your project sustainably and which subsidies are available.',
        authorName: 'Pieter van Dijk',
        category: 'sustainability',
        featuredImage: '/images/projects/ZD8Lo6kETFbU.jpg',
        publishedAt: new Date('2024-02-15'),
        isPublished: true,
      },
      {
        titleNl: '5 Tips voor een Succesvolle Renovatie',
        titleEn: '5 Tips for a Successful Renovation',
        slugNl: '5-tips-succesvolle-renovatie',
        slugEn: '5-tips-successful-renovation',
        excerptNl: 'Praktische tips om uw renovatieproject soepel en binnen budget te laten verlopen',
        excerptEn: 'Practical tips to make your renovation project run smoothly and within budget',
        contentNl: 'Een renovatie is een grote stap. In dit artikel delen we 5 essentiële tips voor een succesvolle renovatie: 1) Maak een realistisch budget, 2) Kies de juiste aannemer, 3) Plan vooruit, 4) Communiceer duidelijk, 5) Wees flexibel. Met deze tips voorkomt u onaangename verrassingen en zorgt u voor een resultaat waar u jarenlang plezier van heeft.',
        contentEn: 'A renovation is a big step. In this article we share 5 essential tips for a successful renovation: 1) Make a realistic budget, 2) Choose the right contractor, 3) Plan ahead, 4) Communicate clearly, 5) Be flexible. With these tips you avoid unpleasant surprises and ensure a result you will enjoy for years.',
        authorName: 'Lisa de Jong',
        category: 'tips',
        featuredImage: '/images/projects/o8BbgNpfAxQb.jpg',
        publishedAt: new Date('2024-03-01'),
        isPublished: true,
      },
    ]);

    // 7. Testimonials
    console.log('💬 Adding Testimonials...');
    await db.insert(testimonials).values([
      {
        customerName: 'Familie Jansen',
        customerTitle: 'Particuliere opdrachtgever',
        testimonialNl: 'BouwMeesters heeft ons huis prachtig gerenoveerd. Het team was professioneel, betrouwbaar en dacht actief mee. Het resultaat overtreft onze verwachtingen!',
        testimonialEn: 'BouwMeesters beautifully renovated our house. The team was professional, reliable and thought proactively. The result exceeds our expectations!',
        rating: 5,
        projectType: 'Renovatie',
        displayOrder: 1,
        isActive: true,
      },
      {
        customerName: 'Mark van der Berg',
        customerTitle: 'Directeur, Tech Solutions BV',
        testimonialNl: 'Voor de bouw van ons nieuwe kantoorpand hebben we gekozen voor BouwMeesters. Een uitstekende keuze! Het project werd op tijd en binnen budget opgeleverd, met oog voor detail en kwaliteit.',
        testimonialEn: 'For the construction of our new office building we chose BouwMeesters. An excellent choice! The project was delivered on time and within budget, with attention to detail and quality.',
        rating: 5,
        projectType: 'Nieuwbouw',
        displayOrder: 2,
        isActive: true,
      },
      {
        customerName: 'VvE De Linden',
        customerTitle: 'Vereniging van Eigenaren',
        testimonialNl: 'Als VvE zijn we zeer tevreden over het onderhoudscontract met BouwMeesters. Ze zijn snel, vakkundig en communiceren helder. Een betrouwbare partner!',
        testimonialEn: 'As a homeowners association, we are very satisfied with the maintenance contract with BouwMeesters. They are fast, skilled and communicate clearly. A reliable partner!',
        rating: 5,
        projectType: 'Onderhoud',
        displayOrder: 3,
        isActive: true,
      },
    ]);

    // 8. Team Members
    console.log('👥 Adding Team members...');
    await db.insert(teamMembers).values([
      {
        nameNl: 'Pieter van Dijk',
        nameEn: 'Pieter van Dijk',
        titleNl: 'Directeur / Eigenaar',
        titleEn: 'Director / Owner',
        department: 'management',
        bioNl: 'Met meer dan 25 jaar ervaring in de bouwsector leidt Pieter BouwMeesters naar succes. Zijn passie voor kwaliteit en innovatie is de drijvende kracht achter elk project.',
        bioEn: 'With more than 25 years of experience in construction, Pieter leads BouwMeesters to success. His passion for quality and innovation is the driving force behind every project.',
        email: 'pieter@bouwmeesters.nl',
        phone: '+31 20 123 4567',
        displayOrder: 1,
        isActive: true,
      },
      {
        nameNl: 'Lisa de Jong',
        nameEn: 'Lisa de Jong',
        titleNl: 'Projectmanager',
        titleEn: 'Project Manager',
        department: 'management',
        bioNl: 'Lisa zorgt ervoor dat elk project soepel verloopt. Met haar organisatietalent en communicatieve vaardigheden is zij het aanspreekpunt voor onze klanten.',
        bioEn: 'Lisa ensures that every project runs smoothly. With her organizational talent and communication skills, she is the point of contact for our clients.',
        email: 'lisa@bouwmeesters.nl',
        phone: '+31 20 123 4568',
        displayOrder: 2,
        isActive: true,
      },
    ]);

    // 9. Company Details
    console.log('🏢 Adding Company details...');
    await db.insert(companyDetails).values({
      companyNameNl: 'BouwMeesters Nederland BV',
      companyNameEn: 'BouwMeesters Netherlands BV',
      kvkNumber: '87654321',
      btwNumber: 'NL987654321B01',
      address: 'Bouwlaan 456',
      city: 'Utrecht',
      postalCode: '3511 AB',
      country: 'Netherlands',
      phone: '+31 30 789 1234',
      email: 'info@bouwmeesters.nl',
      website: 'https://bouwmeesters.nl',
    });

    // 10. Site Settings
    console.log('⚙️ Adding Site settings...');
    await db.insert(siteSettings).values([
      { key: 'site_name', value: 'BouwMeesters', category: 'general' },
      { key: 'site_tagline', value: 'Uw Partner in Bouw', category: 'general' },
      { key: 'default_language', value: 'nl', category: 'general' },
    ]);

    // Section settings and footer settings are optional - can be configured via admin panel

    console.log('✅ Realistic database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - Hero with video');
    console.log('   - About content');
    console.log('   - 4 Statistics');
    console.log('   - 5 Services');
    console.log('   - 5 Projects');
    console.log('   - 2 Blog articles');
    console.log('   - 3 Testimonials');
    console.log('   - 2 Team members');
    console.log('   - Company details');
    console.log('   - Site settings');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
