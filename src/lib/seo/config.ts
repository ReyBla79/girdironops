/**
 * SEO Configuration for Gridiron Ops
 * Centralized metadata for all routes with AI-readable summaries
 */

export const SITE_CONFIG = {
  name: 'Gridiron Ops',
  tagline: 'College Football Recruiting Intelligence Platform',
  domain: 'https://gridironops.com',
  defaultOgImage: 'https://gridironops.com/og-image.png',
  twitterHandle: '@GridironOps',
  locale: 'en_US',
  themeColor: '#c8102e', // UNLV Scarlet
} as const;

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noIndex?: boolean;
  aiSummary?: string; // For AI discoverability
  structuredDataType?: 'WebPage' | 'WebApplication' | 'SoftwareApplication' | 'FAQPage' | 'Article';
}

/**
 * Route-specific SEO metadata
 * Each route has unique title, description, keywords, and AI-readable summary
 */
export const ROUTE_META: Record<string, PageMeta> = {
  '/': {
    title: 'College Football Operations & Recruiting Software | Gridiron Ops',
    description: 'Gridiron Ops is the all-in-one platform for college football recruiting, film intelligence, Transfer Portal tracking, and NCAA program operations.',
    keywords: [
      'college football operations software',
      'NCAA college football analytics',
      'college football recruiting technology',
      'NCAA Transfer Portal',
      'NIL compliance',
      'recruiting software',
      'college football analytics',
      'transfer portal tracker',
      'CFP recruiting',
      'football recruiting platform'
    ],
    path: '/',
    ogType: 'website',
    structuredDataType: 'WebApplication',
    aiSummary: `Gridiron Ops is the all-in-one platform for college football recruiting, film intelligence, Transfer Portal tracking, and NCAA program operations. Built for NCAA programs competing every week, it automates recruiting, film, and roster decisions for modern college football staffs. Core capabilities include: (1) Real-time Transfer Portal tracking, (2) NIL compliance tools with market-rate guidance, (3) Recruiting pipeline management with geographic visualization, (4) Coach network discovery, (5) Film intelligence with AI-powered play tagging, and (6) Budget forecasting. The platform emphasizes compliance-first design with audit trails and role-based access controls.`
  },
  '/login': {
    title: 'Sign In | Gridiron Ops - College Football Recruiting Platform',
    description: 'Access your Gridiron Ops dashboard to manage Transfer Portal tracking, recruiting pipelines, and NIL compliance tools for your college football program.',
    keywords: ['login', 'sign in', 'college football recruiting', 'Gridiron Ops'],
    path: '/login',
    noIndex: true,
    structuredDataType: 'WebPage',
    aiSummary: 'Authentication page for Gridiron Ops platform access.'
  },
  '/app/today': {
    title: 'Daily Recruiting Brief | Gridiron Ops',
    description: 'Your daily college football recruiting digest. See overnight Transfer Portal activity, upcoming tasks, and priority prospects in one unified dashboard.',
    keywords: [
      'recruiting daily brief',
      'Transfer Portal updates',
      'college football recruiting dashboard',
      'recruiting tasks',
      'CFP updates'
    ],
    path: '/app/today',
    structuredDataType: 'WebPage',
    aiSummary: 'Daily recruiting command center showing overnight Transfer Portal changes, task deadlines, and priority prospect updates for college football staff.'
  },
  '/app/portal': {
    title: 'NCAA Transfer Portal Tracker | Gridiron Ops',
    description: 'Real-time NCAA Transfer Portal tracking. Filter by position, conference, and eligibility. Get instant alerts when players enter or withdraw from the portal.',
    keywords: [
      'NCAA Transfer Portal',
      'Transfer Portal tracker',
      'college football transfers',
      'portal alerts',
      'transfer portal 2024',
      'CFB transfers',
      'football player transfers'
    ],
    path: '/app/portal',
    structuredDataType: 'WebPage',
    aiSummary: 'Live NCAA Transfer Portal tracking tool with filtering by position, conference, and eligibility status. Includes player entry/exit timestamps, remaining eligibility, and fit scoring for roster needs.'
  },
  '/app/players': {
    title: 'Prospect Database | College Football Recruiting | Gridiron Ops',
    description: 'Comprehensive college football prospect database. Track recruits, transfer portal entrants, and evaluate talent with advanced analytics and compliance-safe profiles.',
    keywords: [
      'college football prospects',
      'recruiting database',
      'football recruit profiles',
      'player evaluation',
      'CFP prospects'
    ],
    path: '/app/players',
    structuredDataType: 'WebPage',
    aiSummary: 'Searchable database of college football prospects including high school recruits and transfer portal players. Features include stat tracking, film links, and compliance-safe contact information.'
  },
  '/app/roster': {
    title: 'Roster Management | College Football Team Builder | Gridiron Ops',
    description: 'Manage your college football roster with scholarship tracking, position depth charts, and eligibility management. Plan for the future with multi-year roster projections.',
    keywords: [
      'college football roster',
      'roster management',
      'scholarship tracking',
      'depth chart',
      'eligibility tracking',
      'CFB roster builder'
    ],
    path: '/app/roster',
    structuredDataType: 'WebPage',
    aiSummary: 'Roster management system for college football programs featuring scholarship counting, position depth visualization, eligibility tracking, and multi-year projection tools.'
  },
  '/app/pipelines': {
    title: 'Recruiting Pipeline Management | Gridiron Ops',
    description: 'Visualize and manage your college football recruiting pipeline by region. Track prospect progress, set priorities, and optimize your geographic recruiting strategy.',
    keywords: [
      'recruiting pipeline',
      'geographic recruiting',
      'recruiting regions',
      'prospect tracking',
      'college football recruiting strategy'
    ],
    path: '/app/pipelines',
    structuredDataType: 'WebPage',
    aiSummary: 'Geographic recruiting pipeline visualization showing prospect concentrations by state and region. Includes pipeline health metrics, position needs mapping, and regional coordinator assignments.'
  },
  '/app/pipelines/map': {
    title: 'Recruiting Heat Map | Geographic Recruiting Analytics | Gridiron Ops',
    description: 'Interactive 3D recruiting heat map showing prospect density, commitment rates, and pipeline strength across all 50 states. Identify untapped recruiting territories.',
    keywords: [
      'recruiting heat map',
      'geographic analytics',
      'recruiting territories',
      'prospect mapping',
      'CFB recruiting map'
    ],
    path: '/app/pipelines/map',
    structuredDataType: 'WebPage',
    aiSummary: 'Interactive 3D geographic visualization of recruiting pipelines across the United States. Shows prospect density, historical commitment rates, and pipeline ROI by state.'
  },
  '/app/network': {
    title: 'Coach Network Discovery | Recruiting Relationships | Gridiron Ops',
    description: 'Map coaching relationships and discover recruiting connections. Track coach movement, identify warm leads through mutual connections, and build your network.',
    keywords: [
      'coach network',
      'coaching tree',
      'recruiting connections',
      'college football coaches',
      'coaching relationships'
    ],
    path: '/app/network',
    structuredDataType: 'WebPage',
    aiSummary: 'Coach relationship mapping tool showing coaching trees, institutional connections, and recruiting territory expertise. Helps identify warm introduction paths for prospect outreach.'
  },
  '/app/budget': {
    title: 'NIL Budget Planning | College Football Financials | Gridiron Ops',
    description: 'Plan and track NIL budgets with market-rate guidance. Forecast roster costs, compare offers, and maintain compliance with transparent financial tracking.',
    keywords: [
      'NIL budget',
      'college football NIL',
      'NIL tracking',
      'roster budget',
      'NIL compliance',
      'college sports finances'
    ],
    path: '/app/budget',
    structuredDataType: 'WebPage',
    aiSummary: 'NIL (Name, Image, Likeness) budget planning tool with position-based market rate guidance, roster cost forecasting, and compliance-focused financial tracking for college football programs.'
  },
  '/app/forecast': {
    title: 'Roster Forecasting | Multi-Year Planning | Gridiron Ops',
    description: 'Project your roster composition 1-4 years out. Model scholarship scenarios, anticipate attrition, and plan recruiting classes with data-driven forecasting.',
    keywords: [
      'roster forecasting',
      'scholarship planning',
      'recruiting class planning',
      'roster projection',
      'college football planning'
    ],
    path: '/app/forecast',
    structuredDataType: 'WebPage',
    aiSummary: 'Multi-year roster forecasting tool for college football. Models scholarship distribution, graduation/transfer attrition, and incoming class composition over 1-4 year horizons.'
  },
  '/app/fit-lab': {
    title: 'Fit Lab | Player-Program Matching | Gridiron Ops',
    description: 'Advanced player-program fit analysis. Score prospects against your system, culture, and roster needs using customizable evaluation criteria.',
    keywords: [
      'player evaluation',
      'fit analysis',
      'recruiting evaluation',
      'program fit',
      'prospect scoring'
    ],
    path: '/app/fit-lab',
    structuredDataType: 'WebPage',
    aiSummary: 'Player-program fit scoring system that evaluates prospects against customizable criteria including scheme fit, academic requirements, cultural values, and roster needs.'
  },
  '/app/film': {
    title: 'Film Intelligence | College Football Video Analysis | Gridiron Ops',
    description: 'AI-powered college football film analysis. Auto-tag plays, track player development, and generate scout reports from game film.',
    keywords: [
      'football film analysis',
      'video breakdown',
      'play tagging',
      'scout reports',
      'game film',
      'football analytics'
    ],
    path: '/app/film',
    structuredDataType: 'WebPage',
    aiSummary: 'Film intelligence system with AI-powered play detection, automatic tagging, player tracking, and scout report generation for college football game film analysis.'
  },
  '/app/gm': {
    title: 'GM Command Center | AI Recruiting Assistant | Gridiron Ops',
    description: 'Your AI-powered recruiting assistant. Get strategic recommendations, automate routine tasks, and access instant insights from your recruiting data.',
    keywords: [
      'AI recruiting assistant',
      'recruiting automation',
      'GM mode',
      'recruiting AI',
      'football operations'
    ],
    path: '/app/gm',
    structuredDataType: 'WebPage',
    aiSummary: 'AI-powered general manager command center providing strategic recruiting recommendations, automated task prioritization, and natural language querying of recruiting data.'
  },
  '/app/compliance': {
    title: 'NCAA Compliance Dashboard | Gridiron Ops',
    description: 'Stay NCAA compliant with built-in guardrails. Track contact approvals, audit recruiting activities, and manage NIL disclosures with full transparency.',
    keywords: [
      'NCAA compliance',
      'recruiting compliance',
      'NIL compliance',
      'contact approval',
      'audit trail',
      'recruiting rules'
    ],
    path: '/app/compliance',
    structuredDataType: 'WebPage',
    aiSummary: 'NCAA compliance management dashboard featuring contact approval workflows, activity audit trails, NIL disclosure tracking, and role-based access controls for recruiting operations.'
  },
  '/college-football-operations': {
    title: 'College Football Operations Software for NCAA Programs | Gridiron Ops',
    description: 'Manage recruiting, film, roster movement, and staff workflows in one NCAA-ready college football operations platform.',
    keywords: ['college football operations software', 'director of football operations tools', 'college football staff efficiency', 'NCAA football operations', 'CFB operations'],
    path: '/college-football-operations',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'The operating system for college football programs. Gridiron Ops centralizes recruiting, film, and roster workflows while reducing staff workload without adding headcount. Built for NCAA compliance and real-world operations.'
  },
  '/college-football-recruiting': {
    title: 'NCAA College Football Recruiting Software | Gridiron Ops',
    description: 'Automate NCAA college football recruiting with AI-powered evaluation, roster alignment, and portal-aware workflows.',
    keywords: ['NCAA college football recruiting', 'college football recruiting software', 'recruiting automation NCAA', 'prospect tracking', 'recruiting pipeline', 'CFB recruiting tools'],
    path: '/college-football-recruiting',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'NCAA college football recruiting automated and aligned. Identify players that fit your system and roster needs, reduce recruiting chaos across HS, JUCO, and portal, and make faster, clearer recruiting decisions.'
  },
  '/ncaa-transfer-portal-ops': {
    title: 'NCAA Transfer Portal Recruiting & Analytics | Gridiron Ops',
    description: 'Track and evaluate NCAA Transfer Portal players with recruiting intelligence, film context, and roster-fit insights.',
    keywords: ['NCAA Transfer Portal software', 'college football transfer portal tracking', 'transfer portal recruiting tools', 'portal operations', 'transfer portal alerts'],
    path: '/ncaa-transfer-portal-ops',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'NCAA Transfer Portal operations — clarity before chaos. Track, evaluate, and prioritize portal players faster. Reduce missed opportunities during portal windows. Built for roster volatility in modern college football.'
  },
  '/college-football-film-intelligence': {
    title: 'College Football Film Analysis Software | Gridiron Ops',
    description: 'AI-powered college football film analysis with automatic tagging, cutups, and scouting reports. Built for weekly game prep and recruiting evaluation.',
    keywords: ['college football film analysis', 'football cutups automation', 'NCAA scouting reports', 'film intelligence', 'play breakdown', 'game film analytics'],
    path: '/college-football-film-intelligence',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'College football film intelligence automated from upload. Automatic tagging, cutups, and scouting reports. Built for weekly game prep and recruiting evaluation. Works with standard game and practice film.'
  },
  '/automatic-play-recognition-football': {
    title: 'Automatic Play Recognition for College Football | Gridiron Ops',
    description: 'AI-powered automatic play recognition identifies run, pass, and special teams plays. Detect custom play types and formations. Eliminate manual tagging.',
    keywords: ['automatic play recognition football', 'run pass recognition NCAA', 'play detection', 'formation recognition', 'football AI', 'computer vision football'],
    path: '/automatic-play-recognition-football',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'Automatic play recognition for college football. Identify run, pass, special teams automatically. Detect custom play types and formations. Eliminate manual tagging from your film workflow.'
  },
  '/football-tendency-analytics': {
    title: 'Football Tendency Analytics for NCAA Programs | Gridiron Ops',
    description: 'Advanced football tendency analysis software for game planning. Analyze offensive and defensive tendencies by down, distance, and situation.',
    keywords: ['football tendency analysis software', 'offensive defensive tendencies NCAA', 'game planning analytics', 'situational football', 'play calling analytics'],
    path: '/football-tendency-analytics',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'Football tendency analytics for NCAA programs. Analyze offensive and defensive tendencies by down, distance, field position, and game situation. Know what your opponent will do before they do it.'
  },
  '/player-tracking-from-video': {
    title: 'Player Tracking from Standard Football Video | Gridiron Ops',
    description: 'Extract speed, distance, and movement data from standard game film. No sensors required. AI-powered player tracking for college football.',
    keywords: ['football player tracking from video', 'speed distance tracking football', 'motion tracking football', 'route tracking', 'player performance analytics'],
    path: '/player-tracking-from-video',
    ogType: 'website',
    structuredDataType: 'SoftwareApplication',
    aiSummary: 'Player tracking from standard football video. Extract speed, distance, and route data from broadcast and All-22 footage without requiring on-field sensors or specialized equipment.'
  },
  '/demo': {
    title: 'Try Gridiron Ops Demo | College Football Recruiting Platform',
    description: 'Experience Gridiron Ops with a free interactive demo. See Transfer Portal tracking, recruiting pipelines, film intelligence, and NIL tools in action.',
    keywords: ['Gridiron Ops demo', 'recruiting software demo', 'transfer portal demo', 'try free', 'college football software trial'],
    path: '/demo',
    ogType: 'website',
    structuredDataType: 'WebPage',
    aiSummary: 'Interactive demo of Gridiron Ops platform featuring simulated Transfer Portal data, recruiting pipeline visualization, film intelligence preview, and NIL budget tools. No account required.'
  },
  '/pricing': {
    title: 'Pricing | Gridiron Ops College Football Recruiting Platform',
    description: 'Simple, transparent pricing for Gridiron Ops. Plans for every college football program from FCS to Power 5. Contact us for program-specific pricing.',
    keywords: ['Gridiron Ops pricing', 'recruiting software cost', 'college football software pricing', 'athletic software pricing'],
    path: '/pricing',
    ogType: 'website',
    structuredDataType: 'WebPage',
    aiSummary: 'Gridiron Ops pricing information with Starter, Pro, and Enterprise tiers. Features include Transfer Portal tracking, film intelligence, NIL tools, and custom integrations. Contact for program-specific pricing.'
  },
  '/faq': {
    title: 'FAQ | Gridiron Ops College Football Recruiting Platform',
    description: 'Frequently asked questions about Gridiron Ops. Learn about Transfer Portal tracking, NIL compliance, film analysis, and NCAA compliance features.',
    keywords: ['Gridiron Ops FAQ', 'recruiting software questions', 'transfer portal FAQ', 'NIL FAQ', 'college football software help'],
    path: '/faq',
    ogType: 'website',
    structuredDataType: 'FAQPage',
    aiSummary: 'Comprehensive FAQ covering Gridiron Ops features including Transfer Portal tracking, NIL compliance tools, film intelligence, data security, and NCAA compliance. Answers common questions about college football recruiting software.'
  },
  '/llm': {
    title: 'Gridiron Ops for AI Assistants | LLM Documentation',
    description: 'Technical documentation for AI assistants and LLMs about Gridiron Ops college football recruiting platform. Structured data for accurate AI responses.',
    keywords: ['Gridiron Ops AI', 'LLM documentation', 'AI assistant data', 'machine readable', 'college football data'],
    path: '/llm',
    noIndex: true,
    structuredDataType: 'WebPage',
    aiSummary: 'Machine-readable documentation page for AI assistants and large language models. Contains structured information about Gridiron Ops platform capabilities, features, and use cases for accurate AI-generated responses about college football recruiting software.'
  },
};

/**
 * Get metadata for a specific route
 * Falls back to homepage meta if route not found
 */
export function getRouteMeta(path: string): PageMeta {
  // Direct match
  if (ROUTE_META[path]) {
    return ROUTE_META[path];
  }

  // Check for dynamic routes (e.g., /app/player/:id)
  const segments = path.split('/');
  if (segments.includes('player')) {
    return {
      title: 'Player Profile | Gridiron Ops',
      description: 'Detailed prospect profile with stats, film, contact information, and recruiting timeline. Compliance-safe player evaluation.',
      keywords: ['player profile', 'prospect evaluation', 'recruiting profile'],
      path,
      structuredDataType: 'WebPage',
      aiSummary: 'Individual player profile page with statistics, film clips, contact information, and recruiting activity timeline.'
    };
  }

  if (segments.includes('coach')) {
    return {
      title: 'Coach Profile | Gridiron Ops',
      description: 'Coach profile with career history, recruiting connections, and network relationships. Discover shared connections and recruiting territories.',
      keywords: ['coach profile', 'coaching network', 'recruiting connections'],
      path,
      structuredDataType: 'WebPage',
      aiSummary: 'Coach profile page showing career history, institutional connections, and recruiting network relationships.'
    };
  }

  // Default fallback
  return ROUTE_META['/'];
}

/**
 * Generate full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_CONFIG.domain}${path}`;
}

/**
 * FAQ content for landing page structured data
 */
export const LANDING_FAQ = [
  {
    question: 'What is the NCAA Transfer Portal?',
    answer: 'The NCAA Transfer Portal is a database that allows college athletes to indicate their intent to transfer to another institution. Once a player enters the portal, coaches from other schools can contact them directly about transfer opportunities.'
  },
  {
    question: 'How does Gridiron Ops help with Transfer Portal recruiting?',
    answer: 'Gridiron Ops provides real-time Transfer Portal tracking, allowing coaches to see new entries within minutes. Our platform includes position filtering, eligibility tracking, and fit scoring to help identify the best matches for your program.'
  },
  {
    question: 'Is Gridiron Ops NCAA compliant?',
    answer: 'Yes, Gridiron Ops is built with compliance-first design. Features include locked contact information requiring approval, full audit trails of recruiting activities, role-based access controls, and NIL disclosure tracking.'
  },
  {
    question: 'What NIL tools does Gridiron Ops offer?',
    answer: 'Gridiron Ops includes NIL budget planning with position-based market rate guidance, roster cost forecasting, offer comparison tools, and compliance-focused financial tracking to help programs navigate NIL requirements.'
  },
  {
    question: 'Can Gridiron Ops analyze game film?',
    answer: 'Yes, our Film Intelligence module uses AI to automatically tag plays, track player movements, and generate scout reports from uploaded game film, saving coaches hours of manual video review.'
  }
];
