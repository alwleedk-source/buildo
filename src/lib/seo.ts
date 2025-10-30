/**
 * SEO Utilities for BouwMeesters Amsterdam
 * Provides functions for generating SEO-optimized meta tags and structured data
 */

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Generate page title with site name
 */
export function generateTitle(pageTitle: string, siteName = 'BouwMeesters Amsterdam BV'): string {
  return `${pageTitle} | ${siteName}`;
}

/**
 * Truncate description to optimal length for SEO (150-160 characters)
 */
export function truncateDescription(description: string, maxLength = 155): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate article structured data for blog posts
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BouwMeesters Amsterdam BV',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bouwmeesters-amsterdam.nl/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Generate service structured data
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: service.image,
    provider: {
      '@type': 'Organization',
      name: 'BouwMeesters Amsterdam BV',
      url: 'https://bouwmeesters-amsterdam.nl',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    url: service.url,
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate local business structured data
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://bouwmeesters-amsterdam.nl',
    name: 'BouwMeesters Amsterdam BV',
    image: 'https://bouwmeesters-amsterdam.nl/images/logo.png',
    description: 'Professionele bouwoplossingen in Amsterdam en omgeving',
    url: 'https://bouwmeesters-amsterdam.nl',
    telephone: '+31-20-123-4567',
    email: 'info@buildit-professional.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bouwmeesterstraat 123',
      addressLocality: 'Amsterdam',
      postalCode: '1017 AD',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.3676,
      longitude: 4.9041,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    priceRange: '€€€',
    sameAs: [
      'https://www.linkedin.com/company/bouwmeesters-amsterdam',
      'https://www.facebook.com/bouwmeesters-amsterdam',
    ],
  };
}
