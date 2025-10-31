'use client';

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Testimonial, TestimonialsSettings } from '@/lib/db/schema';

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { i18n } = useTranslation();
  
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<TestimonialsSettings>({
    queryKey: ['/api/testimonials-settings'],
  });

  const isLoading = testimonialsLoading || settingsLoading;
  const isNl = i18n.language === 'nl';

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="testimonials-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-16 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Filter active testimonials
  const activeTestimonials = testimonials.filter(testimonial => testimonial.isActive);
  const displayTestimonials = settings?.showFeaturedOnly 
    ? activeTestimonials.filter(t => t.featured) 
    : activeTestimonials;

  // If no testimonials, show placeholder
  if (displayTestimonials.length === 0) {
    const defaultTestimonials: Testimonial[] = [
      {
        id: '1',
        customerName: 'Sarah van der Berg',
        customerTitle: 'Huiseigenaar',
        customerImage: null,
        testimonialNl: 'Uitstekende service en vakmanschap. Het team van BuildIt Professional heeft onze renovatie perfect uitgevoerd binnen de afgesproken tijd.',
        testimonialEn: 'Excellent service and craftsmanship. The BuildIt Professional team executed our renovation perfectly within the agreed timeframe.',
        rating: 5,
        projectType: 'Renovatie',
        location: 'Amsterdam',
        featured: false,
        order: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        customerName: 'Mark Johnson',
        customerTitle: 'Zakelijk eigenaar',
        customerImage: null,
        testimonialNl: 'Professioneel team dat altijd communiceert en de hoogste kwaliteit levert. Zeer tevreden met het eindresultaat.',
        testimonialEn: 'Professional team that always communicates and delivers the highest quality. Very satisfied with the final result.',
        rating: 5,
        projectType: 'Nieuwbouw',
        location: 'Rotterdam',
        featured: false,
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        customerName: 'Lisa Bakker',
        customerTitle: 'Architecte',
        customerImage: null,
        testimonialNl: 'Hun aandacht voor detail en toewijding aan duurzaamheid maken hen de perfecte partner voor elk bouwproject.',
        testimonialEn: 'Their attention to detail and commitment to sustainability make them the perfect partner for any construction project.',
        rating: 5,
        projectType: 'Duurzame bouw',
        location: 'Utrecht',
        featured: false,
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return (
      <TestimonialsDisplay 
        testimonials={defaultTestimonials}
        settings={settings}
        isNl={isNl}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
    );
  }

  return (
    <TestimonialsDisplay 
      testimonials={displayTestimonials}
      settings={settings}
      isNl={isNl}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  );
}

interface TestimonialsDisplayProps {
  testimonials: Testimonial[];
  settings: TestimonialsSettings | undefined;
  isNl: boolean;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}

function TestimonialsDisplay({ 
  testimonials, 
  settings, 
  isNl, 
  currentSlide, 
  setCurrentSlide 
}: TestimonialsDisplayProps) {
  const backgroundClass = settings?.backgroundStyle === 'white' ? 'bg-white' :
                         settings?.backgroundStyle === 'primary' ? 'bg-primary text-primary-foreground' :
                         settings?.backgroundStyle === 'gradient' ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' :
                         'bg-muted';

  const cardClass = settings?.cardStyle === 'minimal' ? 'border-none shadow-none' :
                   settings?.cardStyle === 'elevated' ? 'shadow-xl' :
                   settings?.cardStyle === 'bordered' ? 'border-2' :
                   settings?.cardStyle === 'modern' ? 'rounded-xl border-none bg-gradient-to-br from-background to-muted' :
                   'shadow-md';

  const renderStars = (rating: number) => {
    if (!settings?.showRatings) return null;

    return (
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              "w-4 h-4",
              index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        {settings?.ratingStyle === 'numbers' && (
          <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
        )}
        {settings?.ratingStyle === 'both' && (
          <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
        )}
      </div>
    );
  };

  const getGridCols = () => {
    if (settings?.displayStyle === 'list') return 'grid-cols-1';
    const itemsPerRow = settings?.itemsPerRow || 3;
    switch (itemsPerRow) {
      case 2: return 'md:grid-cols-2';
      case 4: return 'md:grid-cols-2 lg:grid-cols-4';
      case 5: return 'md:grid-cols-2 lg:grid-cols-5';
      default: return 'md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // For carousel display
  if (settings?.displayStyle === 'carousel') {
    const nextSlide = () => {
      setCurrentSlide((currentSlide + 1) % testimonials.length);
    };

    const prevSlide = () => {
      setCurrentSlide((currentSlide - 1 + testimonials.length) % testimonials.length);
    };

    return (
      <section className={cn("py-20", backgroundClass)} data-testid="testimonials-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              {isNl ? settings?.titleNl || "Wat Onze Klanten Zeggen" : settings?.titleEn || "What Our Clients Say"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {isNl ? settings?.descriptionNl || "Ontdek wat onze tevreden klanten zeggen over onze services en kwaliteit. Hun ervaringen spreken voor zich." : 
                      settings?.descriptionEn || "Discover what our satisfied clients say about our services and quality. Their experiences speak for themselves."}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <Card className={cn("p-8 text-center", cardClass)}>
                      <CardContent className="space-y-6">
                        {renderStars(testimonial.rating)}
                        <blockquote className="text-lg italic leading-relaxed">
                          "{isNl ? testimonial.testimonialNl : testimonial.testimonialEn}"
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                          {settings?.showCustomerImages && testimonial.customerImage && (
                            <img 
                              src={testimonial.customerImage} 
                              alt={testimonial.customerName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{testimonial.customerName}</div>
                            {testimonial.customerTitle && (
                              <div className="text-sm text-muted-foreground">{testimonial.customerTitle}</div>
                            )}
                            {settings?.showProjectType && testimonial.projectType && (
                              <div className="text-xs text-muted-foreground">{testimonial.projectType}</div>
                            )}
                            {settings?.showLocation && testimonial.location && (
                              <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {testimonials.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"
                  onClick={prevSlide}
                  data-testid="carousel-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"
                  onClick={nextSlide}
                  data-testid="carousel-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                  onClick={() => setCurrentSlide(index)}
                  data-testid={`carousel-dot-${index}`}
                />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          {settings?.showCta && (
            <div className="text-center mt-16 pt-16 border-t">
              <h3 className="text-2xl font-bold mb-4">
                {isNl ? settings?.ctaTitleNl || "Tevreden over ons werk?" : settings?.ctaTitleEn || "Satisfied with our work?"}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                {isNl ? settings?.ctaDescriptionNl || "Deel uw ervaring met ons en help andere klanten de juiste keuze te maken." : 
                        settings?.ctaDescriptionEn || "Share your experience with us and help other clients make the right choice."}
              </p>
              <Button size="lg" data-testid="cta-button">
                {isNl ? settings?.ctaButtonTextNl || "Deel Uw Ervaring" : settings?.ctaButtonTextEn || "Share Your Experience"}
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Grid/List/Masonry display
  return (
    <section className={cn("py-20", backgroundClass)} data-testid="testimonials-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            {isNl ? settings?.titleNl || "Wat Onze Klanten Zeggen" : settings?.titleEn || "What Our Clients Say"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isNl ? settings?.descriptionNl || "Ontdek wat onze tevreden klanten zeggen over onze services en kwaliteit. Hun ervaringen spreken voor zich." : 
                    settings?.descriptionEn || "Discover what our satisfied clients say about our services and quality. Their experiences speak for themselves."}
          </p>
        </div>

        <div className={cn("grid gap-8", getGridCols())}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={cn("p-6", cardClass)}>
              <CardContent className="space-y-4">
                {renderStars(testimonial.rating)}
                <blockquote className="text-base italic leading-relaxed">
                  "{isNl ? testimonial.testimonialNl : testimonial.testimonialEn}"
                </blockquote>
                <div className="flex items-center gap-3 pt-4">
                  {settings?.showCustomerImages && testimonial.customerImage && (
                    <img 
                      src={testimonial.customerImage} 
                      alt={testimonial.customerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{testimonial.customerName}</div>
                    {testimonial.customerTitle && (
                      <div className="text-xs text-muted-foreground">{testimonial.customerTitle}</div>
                    )}
                    {settings?.showProjectType && testimonial.projectType && (
                      <div className="text-xs text-muted-foreground">{testimonial.projectType}</div>
                    )}
                    {settings?.showLocation && testimonial.location && (
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        {settings?.showCta && (
          <div className="text-center mt-16 pt-16 border-t">
            <h3 className="text-2xl font-bold mb-4">
              {isNl ? settings?.ctaTitleNl || "Tevreden over ons werk?" : settings?.ctaTitleEn || "Satisfied with our work?"}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {isNl ? settings?.ctaDescriptionNl || "Deel uw ervaring met ons en help andere klanten de juiste keuze te maken." : 
                      settings?.ctaDescriptionEn || "Share your experience with us and help other clients make the right choice."}
            </p>
            <Button size="lg" data-testid="cta-button">
              {isNl ? settings?.ctaButtonTextNl || "Deel Uw Ervaring" : settings?.ctaButtonTextEn || "Share Your Experience"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}