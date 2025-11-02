/**
 * SEO Utilities
 * 
 * Provides functions for generating SEO metadata
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    locale = 'nl_NL',
    siteName = 'Buildo'
  } = config;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: image ? [{ url: image }] : undefined,
      locale,
      type,
      publishedTime,
      modifiedTime
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined
    },
    alternates: {
      canonical: url
    }
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(type: string, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };
}

/**
 * Organization JSON-LD
 */
export function generateOrganizationJsonLd(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}) {
  return generateJsonLd('Organization', data);
}

/**
 * Article JSON-LD
 */
export function generateArticleJsonLd(data: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}) {
  return generateJsonLd('Article', data);
}

/**
 * Breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });
}

/**
 * FAQ JSON-LD
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  });
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(url: string, options: {
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
} = {}) {
  const {
    lastmod = new Date().toISOString(),
    changefreq = 'weekly',
    priority = 0.5
  } = options;

  return {
    url,
    lastmod,
    changefreq,
    priority
  };
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(options: {
  allowAll?: boolean;
  disallow?: string[];
  sitemap?: string;
} = {}) {
  const {
    allowAll = true,
    disallow = [],
    sitemap
  } = options;

  let content = 'User-agent: *\n';
  
  if (allowAll) {
    content += 'Allow: /\n';
  }
  
  disallow.forEach(path => {
    content += `Disallow: ${path}\n`;
  });
  
  if (sitemap) {
    content += `\nSitemap: ${sitemap}\n`;
  }
  
  return content;
}
