import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
}

export function useSEO(props: SEOProps) {
  useEffect(() => {
    // Update document title
    if (props.title) {
      document.title = props.title;
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    if (props.description) {
      updateMetaTag('description', props.description);
      updatePropertyTag('og:description', props.description);
    }

    if (props.keywords) {
      updateMetaTag('keywords', props.keywords);
    }

    if (props.title) {
      updatePropertyTag('og:title', props.title);
    }

    if (props.ogImage) {
      updatePropertyTag('og:image', props.ogImage);
    }

    if (props.ogType) {
      updatePropertyTag('og:type', props.ogType);
    }

    // Add structured data
    if (props.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(props.structuredData);
    }
  }, [props]);
}
