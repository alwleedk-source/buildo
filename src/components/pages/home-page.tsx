'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { ServicesSection } from '@/components/services-section';
import { ProjectsSection } from '@/components/projects-section';
import { StatisticsSection } from '@/components/statistics-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { PartnersSection } from '@/components/partners-section';
import { ContactSection } from '@/components/contact-section';
import { BlogSection } from '@/components/blog-section';

import { MaatschappelijkeSection } from '@/components/maatschappelijke-section';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SectionSetting {
  id: string;
  sectionKey: string;
  isVisible: boolean;
  order: number;
}

export function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const { data: sectionSettings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ['/api/section-settings'],
    queryFn: () => apiRequest('/api/section-settings', 'GET'),
  });

  const visibleSections = sectionSettings
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order);

  const sectionComponents: Record<string, JSX.Element> = {
    hero: <HeroSection key="hero" />,
    about: <AboutSection key="about" />,
    services: <ServicesSection key="services" />,
    projects: <ProjectsSection key="projects" />,
    statistics: <StatisticsSection key="statistics" />,
    testimonials: <TestimonialsSection key="testimonials" />,
    partners: <PartnersSection key="partners" />,
    blog: <BlogSection key="blog" />,

    maatschappelijke: <MaatschappelijkeSection key="maatschappelijke" />,
    contact: <ContactSection key="contact" />,
  };

  const sectionsKey = visibleSections.map(s => `${s.sectionKey}-${s.order}`).join(',');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Only show admin button if authenticated */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/admin">
            <Button size="lg" className="shadow-lg">
              <Settings className="w-5 h-5 mr-2" />
              Admin
            </Button>
          </Link>
        </div>
      )}
      
      {isLoading ? (
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      ) : (
        <main key={sectionsKey}>
          {visibleSections.map(section => 
            sectionComponents[section.sectionKey] || null
          )}
        </main>
      )}
      
      <Footer />
    </div>
  );
}
