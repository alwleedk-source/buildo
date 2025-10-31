'use client';

import { Building2, Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from 'next/navigation';
import { SectionSetting, FooterSetting, CompanyDetails, LegalPage, Service } from '@/lib/db/schema';

export function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get section settings for dynamic navigation
  const { data: sectionSettings = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ['/api/section-settings'],
  });

  // Get footer settings
  const { data: footerSettings } = useQuery<FooterSetting>({
    queryKey: ['/api/footer-settings'],
  });

  // Get company details for contact information
  const { data: companyDetails } = useQuery<CompanyDetails | null>({
    queryKey: ['/api/company-details'],
  });

  // Get legal pages for footer links
  const { data: legalPages = [] } = useQuery<LegalPage[]>({
    queryKey: ['/api/legal-pages'],
  });

  // Get services for dynamic footer services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Helper function to check if section should be visible in footer
  const isSectionVisible = (sectionKey: string) => {
    if (isLoading || sectionSettings.length === 0) return false; // Hide during loading or if no settings
    const setting = sectionSettings.find(s => s.sectionKey === sectionKey);
    return setting ? setting.isVisible && setting.showInFooter : false;
  };
  
  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first with hash
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }
    
    // If we're on homepage, smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  // Helper function to render social media icons
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Get social media links from footer settings
  const socialLinks = [
    { platform: 'facebook', url: footerSettings?.facebookUrl },
    { platform: 'twitter', url: footerSettings?.twitterUrl },
    { platform: 'linkedin', url: footerSettings?.linkedinUrl },
    { platform: 'instagram', url: footerSettings?.instagramUrl },
    { platform: 'youtube', url: footerSettings?.youtubeUrl },
    { platform: 'whatsapp', url: footerSettings?.whatsappUrl },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="bg-primary text-primary-foreground py-16" data-testid="footer-main">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold" data-testid="text-footer-company-name">
                {companyDetails?.companyNameNl || "BuildIt Professional"}
              </span>
            </div>
            <p className="text-primary-foreground/80" data-testid="text-footer-company-description">
              {footerSettings?.companyDescriptionNl || "Building tomorrow's infrastructure with sustainable innovation and exceptional quality standards."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="text-footer-quicklinks-title">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {isSectionVisible('about') && (
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                    data-testid="link-footer-about"
                  >
                    {t('navigation.about')}
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => navigateToPage('/services')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                  data-testid="link-footer-services"
                >
                  {t('navigation.services')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('/projects')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                  data-testid="link-footer-projects"
                >
                  {t('navigation.projects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('/blog')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                  data-testid="link-footer-blog"
                >
                  {t('navigation.blog')}
                </button>
              </li>
              {isSectionVisible('maatschappelijke') && (
                <li>
                  <button
                    onClick={() => scrollToSection('maatschappelijke')}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                    data-testid="link-footer-maatschappelijke"
                  >
                    {t('navigation.maatschappelijke')}
                  </button>
                </li>
              )}
              {isSectionVisible('contact') && (
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                    data-testid="link-footer-contact"
                  >
                    {t('navigation.contact')}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Services - Dynamic */}
          {(footerSettings?.showServices !== false && services.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold mb-4" data-testid="text-footer-services-title">
                Services
              </h3>
              <ul className="space-y-2">
                {services.filter(service => service.isActive).slice(0, 5).map((service) => (
                  <li key={service.id}>
                    <button 
                      onClick={() => navigateToPage(`/services/${service.slugNl || service.id}`)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left" 
                      data-testid={`link-footer-service-${service.slugNl || service.id}`}
                    >
                      {service.titleNl}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" data-testid="text-footer-contact-title">
              Contact Info
            </h3>
            <div className="space-y-3">
              {companyDetails?.address && (
                <p className="text-primary-foreground/80" data-testid="text-footer-address">
                  {companyDetails.address}
                  {companyDetails.city && <><br />{companyDetails.city}</>}
                  {companyDetails.postalCode && <><br />{companyDetails.postalCode}</>}
                  {companyDetails.country && <><br />{companyDetails.country}</>}
                </p>
              )}
              {companyDetails?.phone && (
                <p className="text-primary-foreground/80" data-testid="text-footer-phone">
                  {companyDetails.phone}
                </p>
              )}
              {companyDetails?.email && (
                <p className="bg-[transparent] font-normal" data-testid="text-footer-email">
                  {companyDetails.email}
                </p>
              )}
              {companyDetails?.kvkNumber && (
                <p className="text-primary-foreground/80" data-testid="text-footer-kvk">
                  KVK: {companyDetails.kvkNumber}
                </p>
              )}
              {companyDetails?.btwNumber && (
                <p className="text-primary-foreground/80" data-testid="text-footer-btw">
                  BTW: {companyDetails.btwNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8 border-primary-foreground/20" />

        {/* Social Media Icons */}
        {(footerSettings?.showSocialMedia !== false && socialLinks.length > 0) && (
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110"
                  data-testid={`link-social-${social.platform}`}
                  title={`Visit our ${social.platform} page`}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/80 text-sm" data-testid="text-footer-copyright">
            {footerSettings?.copyrightText || `© ${new Date().getFullYear()} BuildIt Professional. All rights reserved.`}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalPages
              .filter(page => page.showInFooter && page.isActive)
              .sort((a, b) => a.order - b.order)
              .map(page => (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(`/legal/${page.slugNl}`)}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  data-testid={`link-footer-${page.pageType}`}
                >
                  {page.titleNl}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    </footer>
  );
}