'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  onVisible?: () => void;
  className?: string;
}

/**
 * LazyLoad Component
 * 
 * Uses Intersection Observer to lazy load content
 * when it enters the viewport
 */
export function LazyLoad({
  children,
  placeholder,
  rootMargin = '50px',
  threshold = 0.1,
  onVisible,
  className
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, onVisible]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (placeholder || <div className="h-96 bg-muted animate-pulse" />)}
    </div>
  );
}

/**
 * LazySection Component
 * 
 * For lazy loading entire sections
 */
export function LazySection({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <LazyLoad
      placeholder={
        <div className={className}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      }
      className={className}
    >
      {children}
    </LazyLoad>
  );
}
