import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, getCanonicalUrl, SITE_CONFIG, type PageMeta } from './config';

interface PageMetaProps {
  /** Override route-based metadata */
  overrides?: Partial<PageMeta>;
}

/**
 * PageMeta Component
 * Updates document head with route-specific SEO metadata
 * Handles title, description, canonical URL, and Open Graph tags
 */
export function PageMetaComponent({ overrides }: PageMetaProps) {
  const location = useLocation();
  const meta = { ...getRouteMeta(location.pathname), ...overrides };

  useEffect(() => {
    // Update document title
    document.title = meta.title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Standard meta tags
    updateMeta('description', meta.description);
    updateMeta('keywords', meta.keywords.join(', '));
    
    // Robots directive
    if (meta.noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow, max-image-preview:large');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = getCanonicalUrl(meta.path);

    // Open Graph tags
    updateMeta('og:title', meta.title, true);
    updateMeta('og:description', meta.description, true);
    updateMeta('og:url', getCanonicalUrl(meta.path), true);
    updateMeta('og:type', meta.ogType || 'website', true);
    updateMeta('og:image', meta.ogImage || SITE_CONFIG.defaultOgImage, true);
    updateMeta('og:site_name', SITE_CONFIG.name, true);
    updateMeta('og:locale', SITE_CONFIG.locale, true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', SITE_CONFIG.twitterHandle);
    updateMeta('twitter:title', meta.title);
    updateMeta('twitter:description', meta.description);
    updateMeta('twitter:image', meta.ogImage || SITE_CONFIG.defaultOgImage);

    // Theme color
    updateMeta('theme-color', SITE_CONFIG.themeColor);

  }, [location.pathname, meta]);

  return null;
}

export default PageMetaComponent;
