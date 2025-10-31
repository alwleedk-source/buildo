'use client';

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Award, Target, Building2, Leaf, Handshake, CheckCircle } from "lucide-react";
import type { Statistic, StatisticsSetting } from '@/lib/db/schema';

// Custom hook for counter animation
function useCountAnimation(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  
  useEffect(() => {
    if (!shouldStart || hasAnimated.current) return;
    
    // If user prefers reduced motion, show final value immediately
    if (prefersReducedMotion.current) {
      setCount(end);
      hasAnimated.current = true;
      return;
    }
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      if (progress >= 1) {
        // At completion, set exact end value to preserve precision
        setCount(end);
        hasAnimated.current = true;
      } else {
        // During animation, interpolate as float (no flooring)
        setCount(end * easeOutQuart);
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);
  
  return count;
}

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.3, ...options });
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return [elementRef, isIntersecting] as const;
}

// Component for individual statistic item
function StatisticCard({ 
  stat, 
  index, 
  shouldAnimate, 
  currentLanguage, 
  settings 
}: { 
  stat: Statistic; 
  index: number; 
  shouldAnimate: boolean;
  currentLanguage: string;
  settings?: StatisticsSetting;
}) {
  // Parse number value properly handling thousands and decimals
  const parseStatValue = (value: string) => {
    // Extract numeric part with enhanced regex supporting signs and currency
    const match = value.match(/^([^\d]*?)([+\-]?[\d.,\s\u00A0\u202F]+)(.*)$/);
    if (!match) return { prefix: '', numericValue: 0, suffix: value, decimalPrecision: 0 };
    
    const [, prefix, numberPart, suffix] = match;
    
    // Clean the number part - remove spaces (regular, NBSP, narrow NBSP)
    const cleanNumber = numberPart.replace(/[\s\u00A0\u202F]/g, '');
    
    // Count occurrences of separators
    const commaCount = (cleanNumber.match(/,/g) || []).length;
    const dotCount = (cleanNumber.match(/\./g) || []).length;
    const lastCommaIndex = cleanNumber.lastIndexOf(',');
    const lastDotIndex = cleanNumber.lastIndexOf('.');
    
    let numericValue = 0;
    let decimalPrecision = 0;
    
    if (commaCount > 0 && dotCount > 0) {
      // Both separators exist - last one is decimal
      if (lastCommaIndex > lastDotIndex) {
        // European format: 1.234,56
        const beforeComma = cleanNumber.substring(0, lastCommaIndex).replace(/[.,]/g, '');
        const afterComma = cleanNumber.substring(lastCommaIndex + 1);
        decimalPrecision = afterComma.length;
        numericValue = parseFloat(`${beforeComma}.${afterComma}`);
      } else {
        // US format: 1,234.56
        const beforeDot = cleanNumber.substring(0, lastDotIndex).replace(/[.,]/g, '');
        const afterDot = cleanNumber.substring(lastDotIndex + 1);
        decimalPrecision = afterDot.length;
        numericValue = parseFloat(`${beforeDot}.${afterDot}`);
      }
    } else if (commaCount > 1) {
      // Multiple commas - thousands separator
      numericValue = parseFloat(cleanNumber.replace(/,/g, ''));
    } else if (dotCount > 1) {
      // Multiple dots - thousands separator
      numericValue = parseFloat(cleanNumber.replace(/\./g, ''));
    } else if (commaCount === 1) {
      // Single comma - check locale to determine if decimal or thousands
      const isDecimal = currentLanguage.startsWith('nl') || currentLanguage.startsWith('de') || 
                       currentLanguage.startsWith('fr') || currentLanguage.startsWith('es') || 
                       currentLanguage.startsWith('it');
      if (isDecimal) {
        const parts = cleanNumber.split(',');
        decimalPrecision = parts[1].length;
        numericValue = parseFloat(`${parts[0]}.${parts[1]}`);
      } else {
        // Treat as thousands
        numericValue = parseFloat(cleanNumber.replace(',', ''));
      }
    } else if (dotCount === 1) {
      // Single dot - check locale to determine if decimal or thousands
      const isDecimal = currentLanguage.startsWith('en') || !currentLanguage.startsWith('nl');
      if (isDecimal) {
        const parts = cleanNumber.split('.');
        decimalPrecision = parts[1].length;
        numericValue = parseFloat(cleanNumber);
      } else {
        // Treat as thousands
        numericValue = parseFloat(cleanNumber.replace('.', ''));
      }
    } else {
      // No separators
      numericValue = parseFloat(cleanNumber);
    }
    
    return { 
      prefix: prefix.trim(), 
      numericValue: isNaN(numericValue) ? 0 : numericValue, 
      suffix: suffix.trim(), 
      decimalPrecision 
    };
  };
  
  const { prefix, numericValue, suffix, decimalPrecision } = parseStatValue(stat.value);
  const animatedValue = useCountAnimation(numericValue, settings?.animationDuration || 2000, shouldAnimate && Boolean(settings?.enableAnimation));
  
  // Get localized label
  const getLocalizedLabel = () => {
    if (currentLanguage.startsWith('en') && stat.labelEn) {
      return stat.labelEn;
    }
    return stat.labelNl || '';
  };
  
  // Format animated number with locale-aware formatting
  const formatAnimatedValue = (value: number) => {
    return new Intl.NumberFormat(currentLanguage, {
      minimumFractionDigits: decimalPrecision,
      maximumFractionDigits: decimalPrecision,
      useGrouping: true
    }).format(value);
  };

  // Icon mapping
  const getIcon = (index: number) => {
    const icons = [Building2, Leaf, CheckCircle, Handshake, TrendingUp, Users, Award, Target];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-6 h-6" />;
  };
  
  // Color schemes based on settings
  const getColorScheme = (index: number, settings?: StatisticsSetting) => {
    if (settings?.colorScheme === 'custom' && settings.customColors && typeof settings.customColors === 'object') {
      const colors = settings.customColors as Record<number, string>;
      return colors[index] || 'from-blue-500 to-purple-600';
    }
    
    if (settings?.colorScheme === 'brand') {
      return 'from-primary to-primary/80';
    }
    
    // Default scheme
    const schemes = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-orange-500 to-orange-600',
      'from-purple-500 to-purple-600',
    ];
    return schemes[index % schemes.length];
  };

  // Render based on display style
  if (settings?.displayStyle === 'simple') {
    return (
      <div 
        className="text-center space-y-2"
        data-testid={`stat-item-${stat.id}`}
      >
        {settings?.showIcons && (
          <div className="text-primary mb-2">
            {getIcon(index)}
          </div>
        )}
        <div 
          className="text-3xl font-bold text-foreground tabular-nums"
          data-testid={`stat-value-${stat.id}`}
        >
          {prefix}{shouldAnimate && settings?.enableAnimation ? formatAnimatedValue(animatedValue) : formatAnimatedValue(numericValue)}{suffix}
        </div>
        <div 
          className="text-muted-foreground"
          data-testid={`stat-label-${stat.id}`}
        >
          {getLocalizedLabel()}
        </div>
      </div>
    );
  }

  if (settings?.displayStyle === 'modern') {
    return (
      <div 
        className={`bg-card rounded-lg p-6 text-center space-y-4 shadow-sm border ${settings?.enableHover ? 'hover:shadow-md transition-shadow duration-300' : ''}`}
        data-testid={`stat-item-${stat.id}`}
      >
        {settings?.showIcons && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getColorScheme(index, settings)} text-white`}>
            {getIcon(index)}
          </div>
        )}
        <div 
          className="text-3xl font-bold text-foreground tabular-nums"
          data-testid={`stat-value-${stat.id}`}
        >
          {prefix}{shouldAnimate && settings?.enableAnimation ? formatAnimatedValue(animatedValue) : formatAnimatedValue(numericValue)}{suffix}
        </div>
        <div 
          className="text-muted-foreground"
          data-testid={`stat-label-${stat.id}`}
        >
          {getLocalizedLabel()}
        </div>
      </div>
    );
  }

  // Advanced style (original enhanced design)
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      data-testid={`stat-item-${stat.id}`}
      style={{
        animationDelay: `${index * 150}ms`
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getColorScheme(index, settings)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Icon with gradient background */}
      {settings?.showIcons && (
        <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getColorScheme(index, settings)} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white">
            {getIcon(index)}
          </div>
        </div>
      )}
      
      {/* Animated value */}
      <div className="relative">
        <div 
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${getColorScheme(index, settings)} bg-clip-text text-transparent mb-3 transition-all duration-300 font-mono tabular-nums`}
          data-testid={`stat-value-${stat.id}`}
        >
          {prefix}{shouldAnimate && settings?.enableAnimation ? formatAnimatedValue(animatedValue) : formatAnimatedValue(numericValue)}{suffix}
        </div>
        
        {/* Label */}
        <div 
          className="text-lg font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300"
          data-testid={`stat-label-${stat.id}`}
        >
          {getLocalizedLabel()}
        </div>
      </div>
      
      {/* Decorative elements */}
      {settings?.showBackground && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
        </>
      )}
    </div>
  );
}

export function StatisticsSection() {
  const [sectionRef, isIntersecting] = useIntersectionObserver();
  const { t, i18n } = useTranslation();
  
  const { data: statistics = [], isLoading: statisticsLoading } = useQuery<Statistic[]>({
    queryKey: ['/api/statistics'],
    queryFn: async () => {
      const res = await fetch('/api/statistics');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<StatisticsSetting | null>({
    queryKey: ['/api/statistics-settings'],
    queryFn: async () => {
      const res = await fetch('/api/statistics-settings');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const isLoading = statisticsLoading || settingsLoading;

  if (isLoading) {
    return (
      <section className="py-16 bg-muted" data-testid="statistics-section-loading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 text-center">
                <Skeleton className="h-16 w-24 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If settings indicate the section is not active, don't render
  if (settings && !settings.isActive) {
    return null;
  }

  const defaultStats = [
    { 
      id: '1', 
      value: '500+', 
      label: 'Voltooide Projecten', 
      labelNl: 'Voltooide Projecten',
      labelEn: 'Completed Projects',
      order: 0, 
      isActive: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: '2', 
      value: '25%', 
      label: 'CO2 Reductie', 
      labelNl: 'CO2 Reductie',
      labelEn: 'CO2 Reduction',
      order: 1, 
      isActive: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: '3', 
      value: '100%', 
      label: 'Duurzame Materialen', 
      labelNl: 'Duurzame Materialen',
      labelEn: 'Sustainable Materials',
      order: 2, 
      isActive: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: '4', 
      value: '50+', 
      label: 'Lokale Partners', 
      labelNl: 'Lokale Partners',
      labelEn: 'Local Partners',
      order: 3, 
      isActive: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
  ];

  const displayStats = (statistics.length > 0 ? statistics : defaultStats)
    .filter(stat => stat.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Get section title and subtitle from settings or defaults
  const getSectionTitle = () => {
    if (i18n.resolvedLanguage?.startsWith('en') && settings?.sectionTitleEn) {
      return settings.sectionTitleEn;
    }
    return settings?.sectionTitleNl || t('statistics.title', 'Onze Prestaties');
  };

  const getSectionSubtitle = () => {
    if (i18n.resolvedLanguage?.startsWith('en') && settings?.sectionSubtitleEn) {
      return settings.sectionSubtitleEn;
    }
    return settings?.sectionSubtitleNl || t('statistics.subtitle', 'Ontdek de cijfers achter onze toewijding aan excellentie en duurzaamheid');
  };

  // Determine section background and layout based on style
  const getSectionClasses = () => {
    const baseClasses = "py-16";
    
    if (settings?.displayStyle === 'simple') {
      return `${baseClasses} bg-background`;
    }
    
    if (settings?.displayStyle === 'modern') {
      return `${baseClasses} bg-muted/50`;
    }
    
    // Advanced style
    return `${baseClasses} bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden`;
  };

  const getGridClasses = () => {
    if (settings?.displayStyle === 'simple') {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
    }
    
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
  };

  return (
    <section 
      ref={sectionRef}
      className={getSectionClasses()}
      data-testid="statistics-section"
    >
      {/* Background decorations for advanced style */}
      {settings?.displayStyle === 'advanced' && settings?.showBackground && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-300/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-gradient-to-tr from-green-300/20 to-cyan-400/20 rounded-full blur-3xl" />
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header - only show if there's a title or subtitle */}
        {(getSectionTitle() || getSectionSubtitle()) && (
          <div className="text-center mb-12">
            {getSectionTitle() && (
              <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-4 ${settings?.displayStyle === 'advanced' ? 'text-gray-900 dark:text-white' : ''}`}>
                {getSectionTitle()}
              </h2>
            )}
            {getSectionSubtitle() && (
              <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${settings?.displayStyle === 'advanced' ? 'text-gray-600 dark:text-gray-300' : ''}`}>
                {getSectionSubtitle()}
              </p>
            )}
          </div>
        )}
        
        {/* Statistics grid */}
        <div className={getGridClasses()}>
          {displayStats.map((stat, index) => (
            <StatisticCard
              key={stat.id}
              stat={stat}
              index={index}
              shouldAnimate={isIntersecting}
              currentLanguage={i18n.resolvedLanguage || i18n.language}
              settings={settings || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}