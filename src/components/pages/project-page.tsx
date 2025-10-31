'use client';
import { useSEO } from '@/hooks/useSEO';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Home, 
  Factory, 
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import type { Project } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function ProjectPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!id
  });

  // SEO optimization with project data
  useSEO({
    title: project?.titleNl ? `${project.titleNl} | BuildIt Professional` : 'Project laden...',
    description: project?.descriptionNl || 'Bekijk details van dit interessante bouwproject van BuildIt Professional.',
    keywords: project?.categoryNl ? `${project.categoryNl}, bouwproject, ${project.location}` : 'bouwproject, architectuur, constructie',
    image: project?.image || undefined,
    type: 'article',
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'residential': return <Home className="w-5 h-5" />;
      case 'commercial': return <Building2 className="w-5 h-5" />;
      case 'infrastructure': return <Factory className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'residential': return 'Woningbouw';
      case 'commercial': return 'Commercieel';
      case 'infrastructure': return 'Infrastructuur';
      default: return category || 'Project';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'planned': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'completed': return 'Voltooid';
      case 'in-progress': return 'In uitvoering';
      case 'planned': return 'Gepland';
      default: return 'Voltooid';
    }
  };

  // Process gallery images - extract URLs from the new gallery format
  const processGalleryImages = (project: Project) => {
    const images: string[] = [];
    
    // Add featured image first if exists
    if (project.featuredImage) {
      images.push(project.featuredImage);
    }
    
    // Add gallery images
    if (project.gallery && Array.isArray(project.gallery)) {
      const galleryUrls = (project.gallery as any[]).map((img: any) => img.url).filter(Boolean);
      // Only add gallery images that are not already the featured image
      galleryUrls.forEach(url => {
        if (url !== project.featuredImage) {
          images.push(url);
        }
      });
    }
    
    // Fallback to old image field if no new images
    if (images.length === 0 && project.image) {
      images.push(project.image);
    }
    
    return images;
  };
  
  const allImages = project ? processGalleryImages(project) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-8" />
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-64 w-full mb-6" />
                <div className="flex gap-2 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-16" />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-8" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="border-b bg-muted/50 mt-16">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" data-testid="breadcrumb-home">
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Home
                </Button>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/projects" data-testid="breadcrumb-projects">
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Projecten
                </Button>
              </Link>
            </nav>
          </div>
        </div>

        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Project niet gevonden</h1>
            <p className="text-muted-foreground mb-8">Het project dat u zoekt bestaat niet of is niet beschikbaar.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/projects">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Alle Projecten
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Naar Homepage</Button>
              </Link>
            </div>
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
            <Link href="/" data-testid="breadcrumb-home">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Home
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/projects" data-testid="breadcrumb-projects">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Projecten
              </Button>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{project.titleNl}</span>
          </nav>
        </div>
      </div>

      {/* Project Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Back to Projects */}
          <Link href="/projects">
            <Button variant="ghost" className="mb-8 -ml-4" data-testid="button-back-to-projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar Projecten
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <div>
              {allImages.length > 0 && (
                <>
                  {/* Main Image */}
                  <div className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={allImages[currentImageIndex]}
                      alt={`${project.titleNl} - Afbeelding ${currentImageIndex + 1}`}
                      className="w-full h-80 object-cover"
                      data-testid="project-main-image"
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          data-testid="button-prev-image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          data-testid="button-next-image"
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index 
                              ? 'border-primary shadow-lg' 
                              : 'border-transparent hover:border-muted-foreground'
                          }`}
                          data-testid={`thumbnail-${index}`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Project Details */}
            <div>
              {/* Project Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-2">
                    {getCategoryIcon(project.categoryNl)}
                    {getCategoryLabel(project.categoryNl)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2">
                    {getStatusIcon(project.status || undefined)}
                    {getStatusLabel(project.status || undefined)}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight" data-testid="project-title">
                  {project.titleNl}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  {project.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Description */}
              <div className="prose prose-lg max-w-none mb-8" data-testid="project-description">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.descriptionNl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Link href="/#contact">
                  <Button size="lg" data-testid="button-contact-about-project">
                    Vergelijkbaar Project?
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" size="lg" data-testid="button-more-projects">
                    Meer Projecten
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Project Information */}
          <div className="mt-16 p-8 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Over dit project</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Categorie</h3>
                <p className="text-muted-foreground">{getCategoryLabel(project.categoryNl)}</p>
              </div>
              {project.year && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Jaar</h3>
                  <p className="text-muted-foreground">{project.year}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Locatie</h3>
                  <p className="text-muted-foreground">{project.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}