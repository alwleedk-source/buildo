'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Mail, 
  Phone, 
  Linkedin, 
  Twitter, 
  Calendar,
  MapPin,
  Award,
  Search,
  Filter,
  User
} from "lucide-react";
import type { TeamMember, TeamSettings } from '@/lib/db/schema';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function TeamPage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const currentLang = i18n.language;

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  const { data: teamSettings, isLoading: settingsLoading } = useQuery<TeamSettings>({
    queryKey: ['/api/team-settings'],
  });

  const isLoading = membersLoading || settingsLoading;

  // Get current language content
  const isNl = currentLang === 'nl';
  const pageTitle = isNl ? (teamSettings?.pageTitleNl || 'Ons Professionele Team') : (teamSettings?.pageTitleEn || 'Our Professional Team');
  const pageDescription = isNl ? (teamSettings?.pageDescriptionNl || '') : (teamSettings?.pageDescriptionEn || '');
  const ctaTitle = isNl ? (teamSettings?.ctaTitleNl || '') : (teamSettings?.ctaTitleEn || '');
  const ctaDescription = isNl ? (teamSettings?.ctaDescriptionNl || '') : (teamSettings?.ctaDescriptionEn || '');
  const ctaButtonText = isNl ? (teamSettings?.ctaButtonTextNl || 'Bekijk Vacatures') : (teamSettings?.ctaButtonTextEn || 'View Careers');

  // SEO optimization
  const metaTitle = isNl ? (teamSettings?.metaTitleNl || pageTitle) : (teamSettings?.metaTitleEn || pageTitle);
  const metaDescription = isNl ? (teamSettings?.metaDescriptionNl || pageDescription) : (teamSettings?.metaDescriptionEn || pageDescription);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "BuildIt Professional",
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "description": metaDescription,
      "employee": teamMembers.map(member => ({
        "@type": "Person",
        "name": isNl ? member.nameNl : (member.nameEn || member.nameNl),
        "jobTitle": isNl ? member.titleNl : (member.titleEn || member.titleNl),
        "description": isNl ? member.bioNl : (member.bioEn || member.bioNl),
        "email": member.showContactInfo ? member.email : undefined,
        "image": member.image || undefined
      }))
    }
  };

  
  // Get unique departments for filter
  const departments = Array.from(new Set(teamMembers.map(member => member.department).filter(Boolean)));

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const name = isNl ? member.nameNl : (member.nameEn || member.nameNl);
    const title = isNl ? member.titleNl : (member.titleEn || member.titleNl);
    const bio = isNl ? member.bioNl : (member.bioEn || member.bioNl);
    
    const matchesSearch = !searchQuery || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bio && bio.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const renderMemberCard = (member: TeamMember) => {
    const name = isNl ? member.nameNl : (member.nameEn || member.nameNl);
    const title = isNl ? member.titleNl : (member.titleEn || member.titleNl);
    const bio = isNl ? member.bioNl : (member.bioEn || member.bioNl);

    return (
      <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid={`card-team-member-${member.id}`}>
        <CardContent className="p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center text-center mb-4">
            {member.image ? (
              <img
                src={member.image}
                alt={name}
                className={`w-40 h-40 ${teamSettings?.imageShape || 'rounded-full'} object-cover mb-4 border-4 border-primary/10`}
                data-testid={`img-profile-${member.id}`}
              />
            ) : (
              <div className={`w-40 h-40 ${teamSettings?.imageShape || 'rounded-full'} bg-muted flex items-center justify-center mb-4 border-4 border-primary/10`}>
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            
            <h3 className="text-xl font-semibold mb-1" data-testid={`text-name-${member.id}`}>
              {name}
            </h3>
            
            <p className="text-primary font-medium mb-2" data-testid={`text-title-${member.id}`}>
              {title}
            </p>

            {member.department && teamSettings?.pageShowDepartments && (
              <Badge variant="secondary" className="mb-3" data-testid={`badge-department-${member.id}`}>
                {member.department}
              </Badge>
            )}
          </div>

          {/* Bio */}
          {bio && teamSettings?.pageShowBios && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-bio-${member.id}`}>
              {bio}
            </p>
          )}

          {/* Experience & Skills */}
          <div className="space-y-3 mb-4">
            {member.experienceYears && teamSettings?.pageShowExperience && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4" />
                <span data-testid={`text-experience-${member.id}`}>
                  {member.experienceYears} {isNl ? 'jaar ervaring' : 'years experience'}
                </span>
              </div>
            )}

            {member.startDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span data-testid={`text-start-date-${member.id}`}>
                  {isNl ? 'Sinds' : 'Since'} {member.startDate}
                </span>
              </div>
            )}

            {member.specialties && member.specialties.length > 0 && teamSettings?.pageShowSkills && (
              <div className="flex flex-wrap gap-1">
                {member.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-specialty-${member.id}-${index}`}>
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Contact & Social */}
          {(member.showContactInfo || teamSettings?.pageShowSocial) && (
            <div className="flex justify-center gap-2 pt-4 border-t">
              {member.showContactInfo && member.email && (
                <Button variant="ghost" size="sm" asChild data-testid={`button-email-${member.id}`}>
                  <a href={`mailto:${member.email}`}>
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              )}
              
              {member.showContactInfo && member.phone && (
                <Button variant="ghost" size="sm" asChild data-testid={`button-phone-${member.id}`}>
                  <a href={`tel:${member.phone}`}>
                    <Phone className="w-4 h-4" />
                  </a>
                </Button>
              )}
              
              {teamSettings?.pageShowSocial && member.linkedinUrl && (
                <Button variant="ghost" size="sm" asChild data-testid={`button-linkedin-${member.id}`}>
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
              
              {teamSettings?.pageShowSocial && member.twitterUrl && (
                <Button variant="ghost" size="sm" asChild data-testid={`button-twitter-${member.id}`}>
                  <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-20 mt-16">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-page-title">
              {pageTitle}
            </h1>
          </div>
          
          {pageDescription && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-page-description">
              {pageDescription}
            </p>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      {(teamSettings?.enableSearch || teamSettings?.enableDepartmentFilter) && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            {teamSettings?.enableSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={isNl ? "Zoek teamleden..." : "Search team members..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            )}
            
            {teamSettings?.enableDepartmentFilter && departments.length > 0 && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-department">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={isNl ? "Afdeling" : "Department"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-all-departments">
                    {isNl ? 'Alle afdelingen' : 'All departments'}
                  </SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept!} data-testid={`option-department-${dept}`}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="container mx-auto px-4 py-16">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2" data-testid="text-no-members">
              {isNl ? 'Geen teamleden gevonden' : 'No team members found'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedDepartment !== "all" 
                ? isNl ? 'Probeer je zoekopdracht aan te passen' : 'Try adjusting your search'
                : isNl ? 'Er zijn nog geen teamleden toegevoegd' : 'No team members have been added yet'
              }
            </p>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            teamSettings?.pageItemsPerRow === 2 ? 'md:grid-cols-2' :
            teamSettings?.pageItemsPerRow === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
            'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredMembers.map(renderMemberCard)}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {ctaTitle && (
        <div className="bg-muted/50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
              {ctaTitle}
            </h2>
            
            {ctaDescription && (
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
                {ctaDescription}
              </p>
            )}
            
            <Button size="lg" asChild data-testid="button-cta">
              <a href={isNl ? (teamSettings?.ctaButtonUrlNl || '/contact') : (teamSettings?.ctaButtonUrlEn || '/contact')}>
                {ctaButtonText}
              </a>
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}