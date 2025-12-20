import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Zap, 
  Shield, 
  Clock, 
  ChevronRight,
  CheckCircle,
  Lock,
  BarChart3,
  RefreshCw,
  Search,
  Film,
  Users,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Video
} from 'lucide-react';
import { 
  PageMetaComponent,
  OrganizationJsonLd, 
  WebApplicationJsonLd, 
  FAQJsonLd,
  LandingAIContent,
  LANDING_FAQ,
  SITE_CONFIG
} from '@/lib/seo';

const PROBLEM_SOLUTION_BENEFIT = [
  {
    problem: "Transfer-portal chaos — hundreds of players enter/exit daily.",
    solution: "Real-time Portal Tracker (demo feed) + match ranking",
    benefit: "Never miss a player — know what changed overnight in minutes."
  },
  {
    problem: "NIL confusion & bidding wars — no fair market clarity.",
    solution: "NIL Range Snapshot (read-only demo)",
    benefit: "Smarter offers — avoid overpaying while staying compliant."
  },
  {
    problem: "Recruiting never stops — burnout & admin overload.",
    solution: "Daily Digest + tasks automation",
    benefit: "Save hours weekly — coaches coach again."
  },
  {
    problem: "Too many platforms — fragmented data.",
    solution: "Unified board + Coach search/chat",
    benefit: "One dashboard replaces 10 tabs."
  },
  {
    problem: "Hours wasted watching irrelevant film.",
    solution: "Film links + (future) tagging",
    benefit: "Review only what matters in minutes."
  },
  {
    problem: "Tampering & unverified contacts.",
    solution: "Locked contacts + approval workflow",
    benefit: "Compliant trail — no gray area outreach."
  }
];

const FEATURES = [
  {
    icon: RefreshCw,
    title: 'Transfer Portal Tracker',
    description: 'Real-time NCAA Transfer Portal monitoring with instant alerts when players enter or withdraw.',
    link: '/app/portal'
  },
  {
    icon: DollarSign,
    title: 'NIL Budget Planning',
    description: 'Position-based market rate guidance and roster cost forecasting for compliant NIL offers.',
    link: '/app/budget'
  },
  {
    icon: MapPin,
    title: 'Recruiting Pipeline Map',
    description: 'Interactive 3D heat maps showing prospect density and pipeline ROI across all 50 states.',
    link: '/app/pipelines/map'
  },
  {
    icon: Users,
    title: 'Coach Network Discovery',
    description: 'Map coaching relationships and identify warm introduction paths for prospect outreach.',
    link: '/app/network'
  },
  {
    icon: Video,
    title: 'Film Intelligence',
    description: 'AI-powered play detection, automatic tagging, and scout report generation from game film.',
    link: '/app/film'
  },
  {
    icon: TrendingUp,
    title: 'Roster Forecasting',
    description: 'Multi-year roster projections modeling scholarship distribution and attrition.',
    link: '/app/forecast'
  }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* SEO Components */}
      <PageMetaComponent />
      <OrganizationJsonLd />
      <WebApplicationJsonLd />
      <FAQJsonLd />
      
      {/* AI-Readable Content (Hidden) */}
      <LandingAIContent />

      <div className="min-h-screen gradient-hero">
        {/* Navigation */}
        <header role="banner">
          <nav 
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
            aria-label="Main navigation"
          >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2"
                aria-label="Gridiron Ops Home"
              >
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="font-display font-bold text-xl">Gridiron Ops</span>
              </Link>
              <Button variant="hero" size="sm" onClick={() => navigate('/login')}>
                Enter Demo
              </Button>
            </div>
          </nav>
        </header>

        <main id="main-content" role="main">
          {/* Hero Section */}
          <section 
            className="relative pt-32 pb-24 px-6 overflow-hidden"
            aria-labelledby="hero-heading"
          >
            <div className="absolute inset-0 gradient-glow opacity-50" aria-hidden="true" />
            <div className="container mx-auto max-w-5xl relative">
              <div className="text-center space-y-6 animate-slide-up">
                <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Platform benefits">
                  {['Portal Clarity', 'Time Back', 'Compliance-First'].map((badge) => (
                    <span 
                      key={badge} 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm"
                      role="listitem"
                    >
                      <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-muted-foreground">{badge}</span>
                    </span>
                  ))}
                </div>
                <h1 
                  id="hero-heading"
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
                >
                  College Football Operations, Recruiting, and Film Intelligence —{' '}
                  <span className="text-gradient">Unified</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Gridiron Ops turns NCAA Transfer Portal chaos into a daily decision board — built for speed, clarity, and compliance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                    Enter Live Demo
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </Button>
                  <Button variant="heroOutline" size="xl" onClick={() => navigate('/login')}>
                    View Today Board
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section 
            className="py-24 px-6 border-t border-border/50 bg-card/30"
            aria-labelledby="features-heading"
          >
            <div className="container mx-auto max-w-6xl">
              <header className="text-center mb-16">
                <h2 
                  id="features-heading"
                  className="font-display text-3xl md:text-4xl font-bold mb-4"
                >
                  Built for NCAA Programs Competing Every Week
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  From Transfer Portal tracking to AI-powered film analysis, Gridiron Ops unifies your entire recruiting workflow.
                </p>
              </header>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, i) => (
                  <article 
                    key={feature.title}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4 group-hover:shadow-scarlet transition-shadow">
                      <feature.icon className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <Link 
                      to={feature.link}
                      className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                    >
                      Learn more <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Problem → Solution → Benefit Grid */}
          <section 
            className="py-24 px-6 border-t border-border/50"
            aria-labelledby="psb-heading"
          >
            <div className="container mx-auto max-w-6xl">
              <header className="text-center mb-12">
                <h2 
                  id="psb-heading"
                  className="font-display text-3xl font-bold"
                >
                  Recruiting, Film, and Roster Decisions — Automated
                </h2>
                <p className="text-muted-foreground mt-2">
                  Real challenges faced by college football programs, solved.
                </p>
              </header>
              
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-3 gap-4 mb-4 px-4" role="row" aria-hidden="true">
                <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertTriangle className="w-4 h-4" /> Problem
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Zap className="w-4 h-4" /> Solution
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                  <CheckCircle className="w-4 h-4" /> Benefit
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-3" role="list">
                {PROBLEM_SOLUTION_BENEFIT.map((row, i) => (
                  <article 
                    key={i}
                    role="listitem"
                    className="grid md:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-destructive font-bold text-lg md:hidden" aria-hidden="true">✕</span>
                      <p className="text-sm text-muted-foreground">{row.problem}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold text-lg md:hidden" aria-hidden="true">→</span>
                      <p className="text-sm">{row.solution}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5 md:hidden" aria-hidden="true" />
                      <p className="text-sm text-success">{row.benefit}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section 
            className="py-24 px-6 border-t border-border/50 bg-card/30"
            aria-labelledby="faq-heading"
          >
            <div className="container mx-auto max-w-4xl">
              <header className="text-center mb-12">
                <h2 
                  id="faq-heading"
                  className="font-display text-3xl font-bold mb-4"
                >
                  Designed for Modern College Football Staffs
                </h2>
                <p className="text-muted-foreground">
                  Common questions about Gridiron Ops and college football recruiting technology.
                </p>
              </header>

              <div className="space-y-4">
                {LANDING_FAQ.map((faq, i) => (
                  <details 
                    key={i}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <summary className="font-display font-bold cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" aria-hidden="true" />
                    </summary>
                    <p className="mt-4 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Trust & Compliance Strip */}
          <section 
            className="py-16 px-6 border-t border-border/50 bg-success/5"
            aria-labelledby="compliance-heading"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Shield className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h2 
                    id="compliance-heading"
                    className="font-display text-2xl font-bold mb-4"
                  >
                    Compliance-first by design
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                      'No bulk exporting of contacts',
                      'Locked contacts (approval required)',
                      'Audit trail for actions',
                      'NIL visibility restricted by role'
                    ].map((bullet, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4 text-success" aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            className="py-24 px-6 border-t border-border/50"
            aria-labelledby="cta-heading"
          >
            <div className="container mx-auto max-w-3xl text-center">
              <h2 
                id="cta-heading"
                className="font-display text-3xl md:text-4xl font-bold mb-6"
              >
                Ready to Transform Your Recruiting?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join leading college football programs using Gridiron Ops to stay ahead in the Transfer Portal era.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
                Start Free Demo
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer 
          className="py-12 px-6 border-t border-border/50"
          role="contentinfo"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Link 
                  to="/" 
                  className="flex items-center gap-2"
                  aria-label="Gridiron Ops Home"
                >
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <span className="font-display font-bold text-xl">Gridiron Ops</span>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Demo uses a simulated dataset (no live portal feeds).
                </p>
                <p className="text-sm text-muted-foreground">
                  © 2026 Gridiron Ops. All rights reserved.
                </p>
              </div>
              
              {/* Internal Links for SEO */}
              <nav aria-label="Footer navigation" className="border-t border-border/50 pt-6">
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/college-football-recruiting" className="hover:text-primary transition-colors">
                      College Football Recruiting
                    </Link>
                  </li>
                  <li>
                    <Link to="/ncaa-transfer-portal-ops" className="hover:text-primary transition-colors">
                      NCAA Transfer Portal
                    </Link>
                  </li>
                  <li>
                    <Link to="/college-football-film-intelligence" className="hover:text-primary transition-colors">
                      Film Intelligence
                    </Link>
                  </li>
                  <li>
                    <Link to="/college-football-operations" className="hover:text-primary transition-colors">
                      Football Operations
                    </Link>
                  </li>
                  <li>
                    <Link to="/demo" className="hover:text-primary transition-colors">
                      Try Demo
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-primary transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-primary transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Contact Information */}
              <div className="border-t border-border/50 pt-6">
                <address className="text-sm text-muted-foreground text-center not-italic">
                  For Licensing and Acquisition information, please contact Coach Brey via{' '}
                  <a 
                    href="mailto:coachbrey@wontrack.com" 
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Mail className="w-3 h-3" aria-hidden="true" />
                    email
                  </a>{' '}
                  or{' '}
                  <a 
                    href="sms:+19172460975" 
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone className="w-3 h-3" aria-hidden="true" />
                    SMS
                  </a>.
                </address>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;