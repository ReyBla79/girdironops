/**
 * SEO Module Exports
 * Centralized exports for all SEO utilities and components
 */

// Configuration
export { 
  SITE_CONFIG, 
  ROUTE_META, 
  LANDING_FAQ,
  getRouteMeta, 
  getCanonicalUrl,
  type PageMeta 
} from './config';

// Components
export { PageMetaComponent } from './PageMeta';
export { 
  OrganizationJsonLd,
  WebApplicationJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  WebPageJsonLd,
  SoftwareApplicationJsonLd,
  ArticleJsonLd
} from './JsonLd';
export { AISummary, LandingAIContent } from './AISummary';
