'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, MapPin, Calendar, ArrowRight, Building2, Home, Factory } from "lucide-react";
import Link from 'next/link';
import type { Project } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

// Helper function to get the appropriate image URL for a project
const getProjectImageUrl = (project: Project): string => {
  // First try featured image
  if (project.featuredImage) {
    return project.featuredImage;
  }
  
  // Then try first image from gallery
  if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
    const firstImage = (project.gallery as any[])[0];
    return firstImage.url || firstImage.thumbnail;
  }
  
  // Then try the old image field
  if (project.image) {
    return project.image;
  }
  
  // Finally fallback to default
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
};

export function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const currentLang = i18n.language;

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', activeFilter],
    queryFn: async () => {
      const url = activeFilter === 'all' 
        ? '/api/projects' 
        : `/api/projects?category=${encodeURIComponent(activeFilter)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    }
  });

  // SEO optimization
  
  const filters = [
    { 
      key: 'all', 
      label: currentLang === 'en' ? 'All Projects' : 'Alle Projecten', 
      icon: Building2 
    },
    { 
      key: 'Woningbouw', 
      label: currentLang === 'en' ? 'Residential' : 'Woningbouw', 
      icon: Home 
    },
    { 
      key: 'Commercieel', 
      label: currentLang === 'en' ? 'Commercial' : 'Commercieel', 
      icon: Building2 
    },
    { 
      key: 'Infrastructuur', 
      label: currentLang === 'en' ? 'Infrastructure' : 'Infrastructuur', 
      icon: Factory 
    },
    { 
      key: 'Renovatie', 
      label: currentLang === 'en' ? 'Renovation' : 'Renovatie', 
      icon: Building2 
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Woningbouw': return <Home className="w-4 h-4" />;
      case 'Commercieel': return <Building2 className="w-4 h-4" />;
      case 'Infrastructuur': return <Factory className="w-4 h-4" />;
      case 'Renovatie': return <Building2 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Woningbouw': return currentLang === 'en' ? 'Residential' : 'Woningbouw';
      case 'Commercieel': return currentLang === 'en' ? 'Commercial' : 'Commercieel';
      case 'Infrastructuur': return currentLang === 'en' ? 'Infrastructure' : 'Infrastructuur';
      case 'Renovatie': return currentLang === 'en' ? 'Renovation' : 'Renovatie';
      default: return category;
    }
  };

  // Filter projects based on search query  
  const filteredProjects = projects.filter(project => {
    const title = currentLang === 'en' ? (project.titleEn || project.titleNl) : project.titleNl;
    const description = currentLang === 'en' ? (project.descriptionEn || project.descriptionNl) : project.descriptionNl;
    
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="border-b bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto mb-8" />
            <Skeleton className="h-12 w-md mx-auto mb-8" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Skeleton key={filter.key} className="h-12 w-32" />
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation breadcrumb */}
      <div className="border-b bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="p-0 h-auto text-muted-foreground hover:text-foreground" data-testid="breadcrumb-home">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {currentLang === 'en' ? 'Projects' : 'Projecten'}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {currentLang === 'en' ? 'Our Projects' : 'Onze Projecten'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {currentLang === 'en'
              ? 'Discover our portfolio of successfully completed projects. From innovative residential construction to complex infrastructure projects.'
              : 'Ontdek ons portfolio van succesvol gerealiseerde projecten. Van innovatieve woningbouw tot complexe infrastructuurprojecten.'
            }
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder={currentLang === 'en' ? 'Search projects...' : 'Zoek projecten...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-search-projects"
            />
          </div>
        </div>

        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" data-testid="project-filters">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border'
                }`}
                data-testid={`filter-${filter.key}`}
              >
                <IconComponent className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentLang === 'en' 
                ? `No projects found for "${searchQuery}"`
                : `Geen projecten gevonden voor "${searchQuery}"`
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
              className="mt-4"
              data-testid="button-clear-search"
            >
              {currentLang === 'en' ? 'Clear search' : 'Wis zoekterm'}
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentLang === 'en' ? 'No projects available yet.' : 'Nog geen projecten beschikbaar.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-grid">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                data-testid={`project-card-${project.id}`}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={getProjectImageUrl(project)}
                    alt={currentLang === 'en' ? (project.titleEn || project.titleNl) : project.titleNl}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {getCategoryIcon(project.categoryNl)}
                      {getCategoryLabel(project.categoryNl)}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    {project.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.year}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {currentLang === 'en' ? (project.titleEn || project.titleNl) : project.titleNl}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {currentLang === 'en' ? (project.descriptionEn || project.descriptionNl) : project.descriptionNl}
                  </p>
                  
                  <Link href={`/projects/${project.id}`} data-testid={`link-project-${project.id}`}>
                    <Button className="w-full group" asChild>
                      <span>
                        {currentLang === 'en' ? 'View Project' : 'Bekijk Project'}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {currentLang === 'en' 
              ? 'Do you have a project in mind?'
              : 'Heeft u een project in gedachten?'
            }
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {currentLang === 'en'
              ? 'Let us make your vision a reality. From concept to completion, we guide you through every phase of your construction project.'
              : 'Laat ons uw visie werkelijkheid maken. Van concept tot oplevering, wij begeleiden u door elke fase van uw bouwproject.'
            }
          </p>
          <Link href="/#contact">
            <Button size="lg" data-testid="button-contact-cta" asChild>
              <span>
                {currentLang === 'en' ? 'Start Your Project' : 'Start Uw Project'}
              </span>
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}