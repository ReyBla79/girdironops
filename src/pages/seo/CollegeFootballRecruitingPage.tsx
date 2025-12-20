import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, CheckCircle, Users, MapPin, 
  Star, TrendingUp, Search, Calendar, Zap
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const RECRUITING_CAPABILITIES = [
  {
    icon: Search,
    title: 'Prospect Discovery',
    description: 'Comprehensive database of high school recruits and transfer portal players with advanced filtering by position, location, and ratings.'
  },
  {
    icon: Star,
    title: 'Player Evaluation',
    description: 'Custom evaluation criteria and fit scoring that matches prospects against your program\'s scheme, culture, and roster needs.'
  },
  {
    icon: MapPin,
    title: 'Geographic Targeting',
    description: '3D heat maps showing recruiting hotspots, pipeline health by region, and coordinator territory optimization.'
  },
  {
    icon: Users,
    title: 'Relationship Mapping',
    description: 'Coach network discovery identifies warm introduction paths through shared connections and coaching tree relationships.'
  },
  {
    icon: Calendar,
    title: 'Visit Management',
    description: 'Schedule official and unofficial visits, track commitments, and manage recruiting calendars across your staff.'
  },
  {
    icon: TrendingUp,
    title: 'Pipeline Analytics',
    description: 'Measure recruiting efficiency, conversion rates, and pipeline health with actionable insights for improvement.'
  }
];

const CollegeFootballRecruitingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="College Football Recruiting Software | Gridiron Ops"
        description="Modern recruiting platform for NCAA football programs. Track prospects, manage pipelines, and win more commitments."
        path="/college-football-recruiting"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'College Football Recruiting', path: '/college-football-recruiting' }
      ]} />

      <div className="min-h-screen gradient-hero">
        <header>
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl">Gridiron Ops</span>
              </Link>
              <Button variant="hero" size="sm" onClick={() => navigate('/demo')}>
                Try Demo
              </Button>
            </div>
          </nav>
        </header>

        <main className="pt-24">
          {/* Hero */}
          <section className="py-20 px-6">
            <div className="container mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Recruiting Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                College Football Recruiting{' '}
                <span className="text-gradient">Reimagined</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Win the recruiting battle with real-time prospect tracking, intelligent pipeline management, 
                and AI-powered insights that help you find, evaluate, and land top talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  Start Recruiting Smarter <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/pricing')}>
                  View Pricing
                </Button>
              </div>
            </div>
          </section>

          {/* The Recruiting Challenge */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                The Modern Recruiting Challenge
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30">
                  <h3 className="font-display text-xl font-bold text-destructive mb-4">Without Gridiron Ops</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span>
                      Spreadsheets scattered across 10+ Google Docs
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span>
                      Missed prospects in the Transfer Portal
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span>
                      No visibility into pipeline health
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span>
                      Staff duplication of effort
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span>
                      Compliance concerns with contact tracking
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-success/10 border border-success/30">
                  <h3 className="font-display text-xl font-bold text-success mb-4">With Gridiron Ops</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-1 shrink-0" />
                      One unified recruiting dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-1 shrink-0" />
                      Real-time Portal alerts in minutes
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-1 shrink-0" />
                      Geographic heat maps and analytics
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-1 shrink-0" />
                      Coordinated staff workflows
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-1 shrink-0" />
                      Built-in compliance with audit trails
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Recruiting Capabilities
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Everything you need to run a modern, competitive recruiting operation.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RECRUITING_CAPABILITIES.map((cap) => (
                  <article key={cap.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                      <cap.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground text-sm">{cap.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Integration with Other Features */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="font-display text-3xl font-bold mb-8">
                Integrated with Your Entire Operation
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Recruiting doesn't exist in a vacuum. Gridiron Ops connects your recruiting workflow 
                to Transfer Portal tracking, film analysis, NIL budgeting, and roster management.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/ncaa-transfer-portal-ops" className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 text-sm">
                  Transfer Portal →
                </Link>
                <Link to="/college-football-film-intelligence" className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 text-sm">
                  Film Intelligence →
                </Link>
                <Link to="/football-tendency-analytics" className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/30 text-sm">
                  Analytics →
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Ready to Win the Recruiting Battle?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See how Gridiron Ops can transform your recruiting operation.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                Start Free Demo <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="py-12 px-6 border-t border-border/50">
          <div className="container mx-auto max-w-6xl">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/college-football-operations" className="hover:text-primary">Operations</Link>
              <Link to="/ncaa-transfer-portal-ops" className="hover:text-primary">Transfer Portal</Link>
              <Link to="/college-football-film-intelligence" className="hover:text-primary">Film Intelligence</Link>
              <Link to="/pricing" className="hover:text-primary">Pricing</Link>
              <Link to="/faq" className="hover:text-primary">FAQ</Link>
            </nav>
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Gridiron Ops. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CollegeFootballRecruitingPage;