'use client';

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ChevronDown } from "lucide-react";
import type { HeroContent } from '@/lib/db/schema';

export function HeroSection() {
  const { data: heroContent, isLoading } = useQuery<HeroContent>({
    queryKey: ['/api/hero-content'],
    queryFn: async () => {
      const res = await fetch('/api/hero-content');
      if (!res.ok) throw new Error('Failed to fetch hero content');
      return res.json();
    },
  });
  const { i18n } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube watch URLs to embed URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    }
    // Convert Vimeo URLs to embed URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&controls=0`;
    }
    // For direct MP4 or other video URLs
    return url;
  };

  const isDirectVideoUrl = (url: string) => {
    return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm') || url.toLowerCase().includes('.ogg');
  };

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80" data-testid="hero-section-loading">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-16 w-3/4 mx-auto bg-primary-foreground/20 mb-6" />
          <Skeleton className="h-8 w-2/3 mx-auto bg-primary-foreground/20 mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48 bg-primary-foreground/20" />
            <Skeleton className="h-12 w-32 bg-primary-foreground/20" />
          </div>
        </div>
      </section>
    );
  }

  const defaultContent = {
    titleNl: "Bouwen aan de Toekomst",
    titleEn: "Building Tomorrow's Infrastructure Today",
    subtitleNl: "Professionele bouwoplossingen met duurzame innovatie en uitzonderlijke kwaliteitsnormen",
    subtitleEn: "Professional construction solutions with sustainable innovation and exceptional quality standards",
    primaryCtaNl: "Bekijk Onze Projecten",
    primaryCtaEn: "View Our Projects",
    secondaryCtaNl: "Contact Opnemen",
    secondaryCtaEn: "Get Quote",
    videoUrl: undefined,
    videoType: "upload",
    mediaType: "image",
    backgroundImage: undefined,
    overlayOpacity: 50,
    textAlign: "center",
    displayStyle: "overlay",
    headerOverlay: true
  };

  const content = heroContent || defaultContent;
  const isNl = i18n.language === 'nl';

  // Get current content based on language
  const title = isNl ? content.titleNl : content.titleEn;
  const subtitle = isNl ? content.subtitleNl : content.subtitleEn;
  const primaryCTA = isNl ? content.primaryCtaNl : content.primaryCtaEn;
  const secondaryCTA = isNl ? content.secondaryCtaNl : content.secondaryCtaEn;

  const getTextAlignClass = (align: string) => {
    switch (align) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };

  const getJustifyClass = (align: string) => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'center':
      default: return 'justify-center';
    }
  };

  const renderHeroContent = () => (
    <div className={`${getTextAlignClass(content.textAlign || 'center')} max-w-4xl ${content.textAlign === 'center' ? 'mx-auto' : ''}`}>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
        {title}
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl" data-testid="text-hero-subtitle">
        {subtitle}
      </p>
      <div className={`flex flex-col sm:flex-row gap-4 ${getJustifyClass(content.textAlign || 'center')}`}>
        <Button
          size="lg"
          className="bg-secondary text-white px-8 py-4 text-lg rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => scrollToSection('projects')}
          data-testid="button-primary-cta"
        >
          {primaryCTA}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 shadow-lg"
          onClick={() => scrollToSection('contact')}
          data-testid="button-secondary-cta"
        >
          {secondaryCTA}
        </Button>
      </div>
    </div>
  );

  const renderBackgroundMedia = () => {
    if (content.mediaType === 'video' && content.videoUrl) {
      if (isDirectVideoUrl(content.videoUrl)) {
        // Direct MP4/video file
        return (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch(console.error);
            }}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch(console.error);
            }}
            ref={(video) => {
              if (video) {
                video.addEventListener('loadstart', () => {
                  video.play().catch(console.error);
                });
              }
            }}
            data-testid="hero-background-video"
          >
            <source src={content.videoUrl} type="video/mp4" />
            <source src={content.videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        // YouTube/Vimeo embed
        return (
          <iframe
            className="absolute inset-0 w-full h-full object-cover"
            src={getVideoEmbedUrl(content.videoUrl)}
            title="Hero Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={(e) => {
              // Force autoplay for iframe embeds
              const iframe = e.target as HTMLIFrameElement;
              if (iframe.contentWindow) {
                try {
                  iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } catch (error) {
                  console.log('Autoplay attempt for iframe:', error);
                }
              }
            }}
            data-testid="hero-background-video-iframe"
          />
        );
      }
    } else if (content.backgroundImage) {
      return (
        <>
          <link rel="preload" as="image" href={content.backgroundImage} fetchPriority="high" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.backgroundImage})` }}
            data-testid="hero-background-image"
          />
        </>
      );
    } else {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      );
    }
  };

  const renderOverlay = () => (
    <div
      className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30 transition-opacity duration-300"
      style={{ opacity: (content.overlayOpacity || 40) / 100 }}
    />
  );

  const renderScrollIndicator = () => (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-foreground animate-bounce">
      <ChevronDown className="w-8 h-8" />
    </div>
  );

  // Different display styles
  switch (content.displayStyle) {
    case 'fullscreen':
      return (
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden text-primary-foreground"
          data-testid="hero-section-fullscreen"
        >
          {renderBackgroundMedia()}
          {renderOverlay()}
          <div className="relative z-10 container mx-auto px-4">
            {renderHeroContent()}
          </div>
          {renderScrollIndicator()}
        </section>
      );

    case 'split':
      return (
        <section
          id="home"
          className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden"
          data-testid="hero-section-split"
        >
          <div className="relative flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
            {renderHeroContent()}
          </div>
          <div className="relative overflow-hidden">
            {renderBackgroundMedia()}
            {renderOverlay()}
          </div>
        </section>
      );

    case 'minimal':
      return (
        <section
          id="home"
          className="relative py-20 lg:py-32 text-primary-foreground"
          data-testid="hero-section-minimal"
        >
          <div className="absolute inset-0">
            {renderBackgroundMedia()}
            {renderOverlay()}
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-2xl">
              {renderHeroContent()}
            </div>
          </div>
        </section>
      );

    case 'overlay':
    default:
      const heroClasses = content.headerOverlay
        ? "relative min-h-screen flex items-center justify-center overflow-hidden text-primary-foreground"
        : "relative min-h-screen flex items-center justify-center overflow-hidden text-primary-foreground pt-16";

      return (
        <section
          id="home"
          className={heroClasses}
          data-testid="hero-section-overlay"
        >
          {renderBackgroundMedia()}
          {renderOverlay()}
          <div className="relative z-10 container mx-auto px-4">
            {renderHeroContent()}
          </div>
          {renderScrollIndicator()}

          {/* Animated elements like in the reference image */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated clouds/shapes */}
            <div className="absolute top-20 left-10 w-24 h-16 bg-white/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute top-40 right-20 w-32 h-20 bg-white/5 rounded-full blur-md animate-pulse delay-1000" />
            <div className="absolute bottom-40 left-1/4 w-28 h-18 bg-white/8 rounded-full blur-sm animate-pulse delay-2000" />
            <div className="absolute top-1/3 right-1/4 w-20 h-12 bg-white/6 rounded-full blur-lg animate-pulse delay-3000" />
          </div>
        </section>
      );
  }
}