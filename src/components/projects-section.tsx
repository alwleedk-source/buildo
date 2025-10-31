'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from '@/lib/db/schema';

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

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  // Generate dynamic filters from actual project data
  const uniqueCategories = Array.from(new Set((Array.isArray(projects) ? projects : []).map(project => project.categoryNl).filter(Boolean)));
  const filters = [
    { key: 'all', label: 'Alle Projecten' },
    ...uniqueCategories.map(category => ({
      key: category.toLowerCase(),
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="projects-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Skeleton key={filter.key} className="h-10 w-24" />
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
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Filter projects based on selected category
  const filteredProjects = activeFilter === 'all' 
    ? (Array.isArray(projects) ? projects : []) 
    : (Array.isArray(projects) ? projects : []).filter(project => project.categoryNl?.toLowerCase() === activeFilter);
  
  // Show only 4 projects on homepage
  const displayProjects = filteredProjects.slice(0, 4);

  return (
    <section id="projects" className="py-20 bg-muted" data-testid="projects-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-projects-title">
            Our Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-projects-subtitle">
            Discover our portfolio of successful construction projects throughout the Netherlands
          </p>
        </div>

        {/* Project Filters */}
        {/* Project Filters - Only show if there are projects and categories */}
        {projects.length > 0 && filters.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12" data-testid="project-filters">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {displayProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                data-testid={`project-card-${project.id}`}
              >
                <Link href={`/projects/${project.id}`}>
                  <img
                    src={getProjectImageUrl(project)}
                    alt={project.titleNl || 'Project afbeelding'}
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    data-testid={`project-image-${project.id}`}
                  />
                </Link>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span data-testid={`project-year-${project.id}`}>{project.year}</span>
                    {project.year && project.location && <span className="mx-2">•</span>}
                    <span data-testid={`project-location-${project.id}`}>{project.location}</span>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-xl font-semibold text-card-foreground mb-3 hover:text-primary transition-colors cursor-pointer" data-testid={`project-title-${project.id}`}>
                      {project.titleNl}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground mb-4" data-testid={`project-description-${project.id}`}>
                    {project.descriptionNl}
                  </p>
                  <Link href={`/projects/${project.id}`}>
                    <button className="text-primary font-medium hover:text-primary/80 transition-colors" data-testid={`project-link-${project.id}`}>
                      Bekijk Project →
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg" data-testid="no-projects-message">
              Geen projecten gevonden voor deze categorie.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/projects">
            <Button
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-view-all-projects"
            >
              Alle Projecten
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
