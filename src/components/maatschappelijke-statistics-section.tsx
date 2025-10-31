'use client';

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Award, Target, Building2, Leaf, Handshake, CheckCircle, BarChart3 } from "lucide-react";
import type { MaatschappelijkeStatistic, CompanyInitiativesSettings } from '@/lib/db/schema';

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
        setCount(end);
        hasAnimated.current = true;
      } else {
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
function MaatschappelijkeStatisticCard({ 
  stat, 
  index, 
  shouldAnimate 
}: { 
  stat: MaatschappelijkeStatistic; 
  index: number; 
  shouldAnimate: boolean;
}) {
  // Parse number value properly handling thousands and decimals
  const parseStatValue = (value: string) => {
    const match = value.match(/^([^\d]*?)([+\-]?[\d.,\s\u00A0\u202F]+)(.*)$/);
    if (!match) return { prefix: '', numericValue: 0, suffix: value, decimalPrecision: 0 };
    
    const [, prefix, numberPart, suffix] = match;
    const cleanNumber = numberPart.replace(/[\s\u00A0\u202F]/g, '');
    
    // Simple parsing - handle common formats
    let numericValue = 0;
    if (cleanNumber.includes(',') && cleanNumber.lastIndexOf('.') > cleanNumber.lastIndexOf(',')) {
      // US format: 1,234.56
      numericValue = parseFloat(cleanNumber.replace(/,/g, ''));
    } else if (cleanNumber.includes('.') && cleanNumber.lastIndexOf(',') > cleanNumber.lastIndexOf('.')) {
      // European format: 1.234,56
      const beforeComma = cleanNumber.substring(0, cleanNumber.lastIndexOf(',')).replace(/[.,]/g, '');
      const afterComma = cleanNumber.substring(cleanNumber.lastIndexOf(',') + 1);
      numericValue = parseFloat(`${beforeComma}.${afterComma}`);
    } else {
      // Simple number
      numericValue = parseFloat(cleanNumber.replace(/[^\d.-]/g, ''));
    }
    
    return { 
      prefix: prefix || '', 
      numericValue: isNaN(numericValue) ? 0 : numericValue, 
      suffix: suffix || '', 
      decimalPrecision: 0 
    };
  };

  const { prefix, numericValue, suffix } = parseStatValue(stat.value);
  const animatedCount = useCountAnimation(numericValue, 2000, shouldAnimate);
  
  // Format the animated count
  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return Math.round(count).toString();
  };

  // Icon mapping
  const getIcon = (iconName?: string | null) => {
    const iconMap: Record<string, any> = {
      'TrendingUp': TrendingUp,
      'Users': Users,
      'Award': Award,
      'Target': Target,
      'Building2': Building2,
      'Leaf': Leaf,
      'Handshake': Handshake,
      'CheckCircle': CheckCircle,
      'BarChart3': BarChart3,
    };
    
    return iconMap[iconName || ''] || Target;
  };

  const IconComponent = getIcon(stat.icon);
  
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="w-8 h-8 text-green-600" />
      </div>
      
      <div className="text-4xl font-bold text-gray-900 mb-2" data-testid={`stat-value-${stat.id}`}>
        {prefix}
        {shouldAnimate ? formatCount(animatedCount) : formatCount(numericValue)}
        {suffix}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid={`stat-label-${stat.id}`}>
        {stat.labelNl}
      </h3>
      
      {stat.description && (
        <p className="text-sm text-gray-600" data-testid={`stat-description-${stat.id}`}>
          {stat.description}
        </p>
      )}
    </div>
  );
}

// Main component
export function MaatschappelijkeStatisticsSection() {
  const [elementRef, isIntersecting] = useIntersectionObserver();
  
  // Fetch maatschappelijke statistics
  const { data: statistics = [], isLoading: isLoadingStats } = useQuery<MaatschappelijkeStatistic[]>({
    queryKey: ['/api/maatschappelijke-statistics'],
  });

  // Fetch settings for dynamic titles
  const { data: settings, isLoading: isLoadingSettings } = useQuery<CompanyInitiativesSettings>({
    queryKey: ["/api/company-initiatives-settings"],
  });

  const isLoading = isLoadingStats || isLoadingSettings;

  // Don't render if no statistics
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50" data-testid="maatschappelijke-statistics-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl shadow-lg">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-10 w-20 mx-auto mb-2" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (statistics.length === 0) {
    return null; // Don't render section if no statistics
  }

  return (
    <section 
      ref={elementRef}
      className="py-16 bg-gray-50" 
      data-testid="maatschappelijke-statistics-section"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="title-maatschappelijke-stats">
            {settings?.statsTitleNl || "Onze Impact in Cijfers"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="subtitle-maatschappelijke-stats">
            {settings?.statsDescriptionNl || "Bekijk hoe we het verschil maken in gemeenschappen door heel Nederland"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <MaatschappelijkeStatisticCard
              key={stat.id}
              stat={stat}
              index={index}
              shouldAnimate={isIntersecting}
            />
          ))}
        </div>
      </div>
    </section>
  );
}