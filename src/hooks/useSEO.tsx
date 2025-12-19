import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

/**
 * SEO-friendly hook to manage document metadata
 * Use this directly in your page components or layout components
 */
export function useSEO(seoConfig: SEOConfig, appName: string = 'Oktopuse') {
  useEffect(() => {
    // Update title
    document.title = seoConfig.title.includes(appName)
      ? seoConfig.title
      : `${seoConfig.title} | ${appName}`;

    // Update or create meta tags
    updateMetaTag('description', seoConfig.description || '');
    updateMetaTag('keywords', seoConfig.keywords || '');

    // Open Graph tags
    updateMetaTag('og:title', seoConfig.title, 'property');
    updateMetaTag('og:description', seoConfig.description || '', 'property');
    updateMetaTag('og:type', seoConfig.ogType || 'website', 'property');
    updateMetaTag('og:url', seoConfig.canonicalUrl || window.location.href, 'property');
    if (seoConfig.ogImage) {
      updateMetaTag('og:image', seoConfig.ogImage, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', seoConfig.title, 'name');
    updateMetaTag('twitter:description', seoConfig.description || '', 'name');
    if (seoConfig.ogImage) {
      updateMetaTag('twitter:image', seoConfig.ogImage, 'name');
    }

    // Canonical URL
    updateLinkTag('canonical', seoConfig.canonicalUrl || window.location.href);
  }, [seoConfig, appName]);
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

/**
 * Helper function to update or create link tags
 */
function updateLinkTag(rel: string, href: string) {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (element) {
    element.href = href;
  } else {
    element = document.createElement('link');
    element.rel = rel;
    element.href = href;
    document.head.appendChild(element);
  }
}
