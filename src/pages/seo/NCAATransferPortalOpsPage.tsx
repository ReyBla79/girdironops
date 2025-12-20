import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, CheckCircle, RefreshCw, Bell, 
  Filter, Clock, TrendingUp, Shield, Zap, AlertTriangle
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/lib/seo';

const PORTAL_FEATURES = [
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'Get notified within minutes when players enter or withdraw from the Transfer Portal. Never miss a prospect again.'
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Filter by position, conference, eligibility, home state, and more. Find exactly the players who fit your roster needs.'
  },
  {
    icon: TrendingUp,
    title: 'Fit Scoring',
    description: 'AI-powered matching that scores portal players against your program\'s scheme, culture, and roster gaps.'
  },
  {
    icon: Clock,
    title: 'Timeline Tracking',
    description: 'See when players entered, their decision timeline, and which schools they\'re considering.'
  },
  {
    icon: Shield,
    title: 'Compliant Outreach',
    description: 'Built-in contact approval workflows ensure your portal recruiting follows NCAA rules.'
  },
  {
    icon: RefreshCw,
    title: 'Daily Digest',
    description: 'Morning email summary of overnight portal activity so you start each day informed and ready to act.'
  }
];

const PORTAL_FAQ = [
  {
    question: 'How quickly does Gridiron Ops update with new Transfer Portal entries?',
    answer: 'Our system monitors the NCAA Transfer Portal continuously and typically reflects new entries within minutes of official posting.'
  },
  {
    question: 'Can I filter Transfer Portal players by position and eligibility?',
    answer: 'Yes, Gridiron Ops offers comprehensive filtering including position, remaining eligibility, home state, previous conference, and academic standing.'
  },
  {
    question: 'Does Gridiron Ops help with Transfer Portal compliance?',
    answer: 'Absolutely. We include contact approval workflows, activity logging, and audit trails to help your program maintain NCAA compliance during portal recruiting.'
  },
  {
    question: 'Can I see which other schools are recruiting a portal player?',
    answer: 'Our intel features track reported interest and official visit schedules when publicly available, helping you understand the competitive landscape.'
  }
];

const NCAATransferPortalOpsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="NCAA Transfer Portal Tracking Software | Gridiron Ops"
        description="Real-time NCAA Transfer Portal tracking with instant alerts, advanced filtering, and compliance-first workflows for college football programs."
        path="/ncaa-transfer-portal-ops"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'NCAA Transfer Portal Ops', path: '/ncaa-transfer-portal-ops' }
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
                <RefreshCw className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Transfer Portal Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                NCAA Transfer Portal{' '}
                <span className="text-gradient">Operations</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                The Transfer Portal moves fast. Gridiron Ops gives you real-time tracking, instant alerts, 
                and intelligent filtering so you never miss a game-changing prospect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  Track the Portal <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/pricing')}>
                  View Pricing
                </Button>
              </div>
            </div>
          </section>

          {/* The Portal Problem */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                The Transfer Portal Challenge
              </h2>
              <div className="p-8 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-warning shrink-0" />
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Hundreds of Players Move Daily</h3>
                    <p className="text-muted-foreground">
                      During peak portal windows, 100+ players enter or withdraw every single day. 
                      Without automated tracking, you're guaranteed to miss prospects that could transform your roster.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-background text-center">
                    <div className="font-display text-3xl font-bold text-primary mb-1">2,000+</div>
                    <div className="text-sm text-muted-foreground">Players enter annually</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background text-center">
                    <div className="font-display text-3xl font-bold text-primary mb-1">45 days</div>
                    <div className="text-sm text-muted-foreground">Average decision window</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background text-center">
                    <div className="font-display text-3xl font-bold text-primary mb-1">Minutes</div>
                    <div className="text-sm text-muted-foreground">Response time matters</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Portal Tracking Features
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Stay ahead of the competition with real-time intelligence and smart workflows.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PORTAL_FEATURES.map((feature) => (
                  <article key={feature.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                Transfer Portal FAQ
              </h2>
              <div className="space-y-4">
                {PORTAL_FAQ.map((faq, i) => (
                  <details key={i} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30">
                    <summary className="font-display font-bold cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-4 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Don't Let Portal Prospects Slip Away
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Start tracking the Transfer Portal in real-time today.
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
              <Link to="/college-football-recruiting" className="hover:text-primary">Recruiting</Link>
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

export default NCAATransferPortalOpsPage;