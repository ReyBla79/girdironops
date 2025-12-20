import { SITE_CONFIG, LANDING_FAQ } from './config';

/**
 * JSON-LD Structured Data Components
 * Provides schema.org markup for enhanced search visibility and AI discoverability
 */

interface JsonLdProps {
  data: object;
}

/**
 * Base JSON-LD component that injects script into page
 */
function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema - Company information
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/logo.png`,
    description: 'College football recruiting intelligence platform for NCAA Division I programs.',
    foundingDate: '2024',
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.twitterHandle.replace('@', '')}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'coachbrey@wontrack.com',
      contactType: 'sales',
      availableLanguage: 'English'
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'College Football Coaching Staff, Athletic Directors, Recruiting Coordinators'
    }
  };

  return <JsonLd data={data} />;
}

/**
 * WebApplication Schema - Software product information
 */
export function WebApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    applicationCategory: 'Sports Management Software',
    operatingSystem: 'Web Browser',
    description: 'Real-time NCAA Transfer Portal tracking, NIL compliance tools, and AI-powered recruiting intelligence for college football programs.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Demo access available'
    },
    featureList: [
      'Real-time Transfer Portal tracking',
      'NIL budget planning and compliance',
      'Geographic recruiting pipeline visualization',
      'Coach network relationship mapping',
      'AI-powered film analysis',
      'Roster management and forecasting',
      'Player-program fit scoring',
      'NCAA compliance audit trails'
    ],
    screenshot: `${SITE_CONFIG.domain}/screenshot.png`,
    softwareVersion: '2.0',
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name
    }
  };

  return <JsonLd data={data} />;
}

/**
 * FAQ Schema - Frequently Asked Questions
 */
export function FAQJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LANDING_FAQ.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList Schema - Navigation breadcrumbs
 */
interface BreadcrumbItem {
  name: string;
  path: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.domain}${item.path}`
    }))
  };

  return <JsonLd data={data} />;
}

/**
 * WebPage Schema - Generic page information
 */
interface WebPageJsonLdProps {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
}

export function WebPageJsonLd({ title, description, path, dateModified }: WebPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_CONFIG.domain}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain
    },
    ...(dateModified && { dateModified }),
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain
    }
  };

  return <JsonLd data={data} />;
}

/**
 * SoftwareApplication Schema - For app store listings
 */
export function SoftwareApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.name,
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Web',
    url: SITE_CONFIG.domain,
    description: 'College football recruiting intelligence platform with Transfer Portal tracking, NIL compliance, and AI-powered analytics.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return <JsonLd data={data} />;
}

/**
 * Article Schema - For blog/news content
 */
interface ArticleJsonLdProps {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  authorName = 'Gridiron Ops Team',
  image
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${SITE_CONFIG.domain}${path}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/logo.png`
      }
    },
    image: image || SITE_CONFIG.defaultOgImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}${path}`
    }
  };

  return <JsonLd data={data} />;
}
