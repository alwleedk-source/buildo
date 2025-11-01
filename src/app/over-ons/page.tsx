'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, Award, Users, Target, Heart, Lightbulb } from 'lucide-react';

interface AboutContent {
  titleNl: string;
  titleEn: string;
  descriptionNl: string;
  descriptionEn: string;
  image?: string;
  featuresNl?: Array<{ title: string; description: string }>;
  featuresEn?: Array<{ title: string; description: string }>;
}

export default function OverOnsPage() {
  const { i18n } = useTranslation();
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setAboutContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch about content:', err);
        setLoading(false);
      });
  }, []);

  const isNl = i18n.language === 'nl';

  // Default content if API fails
  const defaultContent = {
    titleNl: "Over BouwMeesters Amsterdam",
    titleEn: "About BouwMeesters Amsterdam",
    descriptionNl: "Een verhaal van vakmanschap en excellentie in de bouwwereld. Bij BouwMeesters Amsterdam staan kwaliteit, innovatie en duurzaamheid centraal in alles wat we doen. Met meer dan 20 jaar ervaring in de bouwsector hebben we een reputatie opgebouwd als betrouwbare partner voor diverse bouwprojecten.",
    descriptionEn: "A story of craftsmanship and excellence in the construction world. At BouwMeesters Amsterdam, quality, innovation and sustainability are central to everything we do. With more than 20 years of experience in the construction sector, we have built a reputation as a reliable partner for various construction projects.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
    featuresNl: [
      {
        title: "Kwaliteitsgarantie",
        description: "Rigoureuze kwaliteitscontrole in elke projectfase"
      },
      {
        title: "Duurzame Praktijken",
        description: "Milieuverantwoordelijkheid in al onze activiteiten"
      }
    ],
    featuresEn: [
      {
        title: "Quality Assurance",
        description: "Rigorous quality control in every project phase"
      },
      {
        title: "Sustainable Practices",
        description: "Environmental responsibility in all our operations"
      }
    ]
  };

  const content = aboutContent || defaultContent;
  const title = isNl ? content.titleNl : content.titleEn;
  const description = isNl ? content.descriptionNl : content.descriptionEn;
  const features = isNl 
    ? (content.featuresNl || defaultContent.featuresNl)
    : (content.featuresEn || defaultContent.featuresEn);

  // Core values
  const coreValues = [
    {
      icon: <Award className="w-8 h-8" />,
      titleNl: "Excellentie",
      titleEn: "Excellence",
      descriptionNl: "We streven naar de hoogste kwaliteitsnormen in elk project dat we ondernemen.",
      descriptionEn: "We strive for the highest quality standards in every project we undertake."
    },
    {
      icon: <Users className="w-8 h-8" />,
      titleNl: "Samenwerking",
      titleEn: "Collaboration",
      descriptionNl: "We geloven in sterke partnerschappen met onze klanten en stakeholders.",
      descriptionEn: "We believe in strong partnerships with our clients and stakeholders."
    },
    {
      icon: <Target className="w-8 h-8" />,
      titleNl: "Precisie",
      titleEn: "Precision",
      descriptionNl: "Aandacht voor detail en nauwkeurigheid in elke fase van het bouwproces.",
      descriptionEn: "Attention to detail and accuracy in every phase of the construction process."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      titleNl: "Integriteit",
      titleEn: "Integrity",
      descriptionNl: "Eerlijkheid en transparantie vormen de basis van ons bedrijf.",
      descriptionEn: "Honesty and transparency form the foundation of our business."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      titleNl: "Innovatie",
      titleEn: "Innovation",
      descriptionNl: "We omarmen nieuwe technologieën en methoden om betere resultaten te leveren.",
      descriptionEn: "We embrace new technologies and methods to deliver better results."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            {description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <div className="relative">
              <img
                src={content.image || defaultContent.image}
                alt="About BouwMeesters Amsterdam"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                {isNl ? "Waarom Kiezen Voor Ons?" : "Why Choose Us?"}
              </h2>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {isNl ? "Onze Kernwaarden" : "Our Core Values"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isNl 
                  ? "Deze waarden vormen de basis van alles wat we doen en hoe we met onze klanten omgaan."
                  : "These values form the foundation of everything we do and how we interact with our clients."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {isNl ? value.titleNl : value.titleEn}
                  </h3>
                  <p className="text-muted-foreground">
                    {isNl ? value.descriptionNl : value.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {isNl ? "Ons Verhaal" : "Our Story"}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  {isNl
                    ? "BouwMeesters Amsterdam is opgericht met een duidelijke missie: het leveren van bouwprojecten van de hoogste kwaliteit met een focus op duurzaamheid en innovatie. Sinds onze oprichting hebben we ons ontwikkeld tot een van de meest betrouwbare bouwpartners in de regio."
                    : "BouwMeesters Amsterdam was founded with a clear mission: to deliver construction projects of the highest quality with a focus on sustainability and innovation. Since our inception, we have grown to become one of the most trusted construction partners in the region."}
                </p>
                <p>
                  {isNl
                    ? "Ons team van ervaren professionals combineert traditioneel vakmanschap met moderne technieken om uitzonderlijke resultaten te leveren. We zijn trots op onze track record van succesvolle projecten en tevreden klanten."
                    : "Our team of experienced professionals combines traditional craftsmanship with modern techniques to deliver exceptional results. We are proud of our track record of successful projects and satisfied clients."}
                </p>
                <p>
                  {isNl
                    ? "Of het nu gaat om nieuwbouw, renovatie, of restauratie - we benaderen elk project met dezelfde toewijding aan kwaliteit en klanttevredenheid. Uw visie is onze missie."
                    : "Whether it's new construction, renovation, or restoration - we approach every project with the same dedication to quality and customer satisfaction. Your vision is our mission."}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isNl ? "Klaar om te Beginnen?" : "Ready to Get Started?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {isNl
                ? "Neem vandaag nog contact met ons op om uw bouwproject te bespreken. We staan klaar om uw visie werkelijkheid te maken."
                : "Contact us today to discuss your construction project. We are ready to make your vision a reality."}
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {isNl ? "Neem Contact Op" : "Contact Us"}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
