'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Building2, Menu, X } from "lucide-react";
import { SectionSetting, HeroContent, SiteSetting } from '@/lib/db/schema';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get section settings for dynamic navigation
  const { data: sectionSettings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ['/api/section-settings'],
    queryFn: async () => {
      const res = await fetch('/api/section-settings');
      if (!res.ok) throw new Error('Failed to fetch section settings');
      return res.json();
    },
  });

  // Get hero content to check headerOverlay setting
  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ['/api/hero'],
    queryFn: async () => {
      const res = await fetch('/api/hero');
      if (!res.ok) throw new Error('Failed to fetch hero');
      return res.json();
    },
  });

  // Get site settings for logo and site name
  const { data: siteSettings = [], isLoading: siteSettingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings');
      if (!res.ok) throw new Error('Failed to fetch site settings');
      return res.json();
    },
  });

  // Helper function to get site setting value
  const getSiteSetting = (key: string, defaultValue: string = '') => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first with hash
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      setMobileMenuOpen(false);
      return;
    }
    
    // If we're on homepage, smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  const navigateToPage = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  // Helper function to check if section should be visible in header
  const isSectionVisible = (sectionKey: string) => {
    if (isLoading || sectionSettings.length === 0) return false; // Hide during loading or if no settings
    const setting = sectionSettings.find(s => s.sectionKey === sectionKey);
    return setting ? setting.isVisible && setting.showInHeader : false;
  };

  // Check if header should overlay hero content - combine hero settings and site settings
  const heroOverlay = heroContent?.headerOverlay !== false;
  const siteHeaderOverlay = getSiteSetting('headerOverlay', 'true') === 'true';
  const siteHeaderTransparent = getSiteSetting('headerTransparent', 'false') === 'true';
  
  const shouldOverlay = heroOverlay && siteHeaderOverlay;
  const shouldBeTransparent = siteHeaderTransparent;
  
  let headerClasses = "w-full z-50 transition-all duration-300";
  if (shouldOverlay) {
    headerClasses += shouldBeTransparent 
      ? " bg-transparent fixed top-0"
      : " bg-background/80 backdrop-blur-sm fixed top-0";
  } else {
    headerClasses += " bg-background border-b border-border sticky top-0";
  }

  return (
    <header className={headerClasses} data-testid="header-main">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3" data-testid="logo-container">
            {/* Always show logo if URL exists, regardless of loading state */}
            {siteSettings.length > 0 && siteSettings.find(s => s.key === 'logoUrl')?.value ? (
              <div 
                className="flex items-center justify-center flex-shrink-0"
                style={{ 
                  height: '56px', // Fixed height that fits well in header
                  width: 'auto',
                  maxWidth: '160px'
                }}
              >
                <img 
                  src={getSiteSetting('logoUrl')} 
                  alt={getSiteSetting('siteName', 'BuildIt Professional')}
                  className="object-contain"
                  data-testid="img-site-logo"
                  style={{
                    maxHeight: '56px',
                    maxWidth: '160px',
                    width: 'auto',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    // Hide broken images gracefully
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            ) : siteSettingsLoading ? (
              <div 
                className="bg-muted animate-pulse rounded-lg flex-shrink-0"
                style={{ 
                  height: '48px',
                  width: '48px'
                }}
              ></div>
            ) : (
              <div 
                className="bg-primary rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  height: '48px',
                  width: '48px'
                }}
              >
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            {!siteSettingsLoading && getSiteSetting('showSiteNameInHeader', 'true') === 'true' && (
              <span className="text-xl font-bold text-foreground" data-testid="text-site-title">
                {getSiteSetting('siteName', 'BuildIt Professional')}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" data-testid="nav-desktop">
            <button
              onClick={() => navigateToPage('/')}
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              {t('navigation.home')}
            </button>
            {isSectionVisible('about') && (
              <button
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-about"
              >
                {t('navigation.about')}
              </button>
            )}
            <button
              onClick={() => navigateToPage('/services')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-services"
            >
              {t('navigation.services')}
            </button>
            <button
              onClick={() => navigateToPage('/projects')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-projects"
            >
              {t('navigation.projects')}
            </button>
            {isSectionVisible('team') && (
              <button
                onClick={() => navigateToPage('/team')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-team"
              >
                {t('navigation.team')}
              </button>
            )}
            <button
              onClick={() => navigateToPage('/blog')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-blog"
            >
              {t('navigation.blog')}
            </button>
            {isSectionVisible('maatschappelijke') && (
              <button
                onClick={() => scrollToSection('maatschappelijke')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-maatschappelijke"
              >
                {t('navigation.maatschappelijke')}
              </button>
            )}
            {isSectionVisible('contact') && (
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
                data-testid="nav-contact"
              >
                {t('navigation.contact')}
              </button>
            )}
          </div>

          {/* Language Switcher */}
          {getSiteSetting('showLanguageSwitcher', 'true') === 'true' && (
            <div className="hidden md:flex items-center" data-testid="language-switcher">
              <LanguageSwitcher />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="nav-mobile">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigateToPage('/')}
                className="text-left text-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-home"
              >
                {t('navigation.home')}
              </button>
              {isSectionVisible('about') && (
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                  data-testid="nav-mobile-about"
                >
                  {t('navigation.about')}
                </button>
              )}
              <button
                onClick={() => navigateToPage('/services')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-services"
              >
                {t('navigation.services')}
              </button>
              <button
                onClick={() => navigateToPage('/projects')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-projects"
              >
                {t('navigation.projects')}
              </button>
              {isSectionVisible('team') && (
                <button
                  onClick={() => navigateToPage('/team')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                  data-testid="nav-mobile-team"
                >
                  {t('navigation.team')}
                </button>
              )}
              <button
                onClick={() => navigateToPage('/blog')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-blog"
              >
                {t('navigation.blog')}
              </button>
              {isSectionVisible('maatschappelijke') && (
                <button
                  onClick={() => scrollToSection('maatschappelijke')}
                  className="text-left text-muted-foreground hover:text-primary transition-colors"
                  data-testid="nav-mobile-maatschappelijke"
                >
                  {t('navigation.maatschappelijke')}
                </button>
              )}
              {isSectionVisible('contact') && (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-left bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors w-fit"
                  data-testid="nav-mobile-contact"
                >
                  {t('navigation.contact')}
                </button>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
