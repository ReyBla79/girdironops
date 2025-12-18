import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  ChevronRight,
  CheckCircle,
  Lock,
  BarChart3
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">WONRecruit</span>
          </div>
          <Button variant="hero" size="sm" onClick={() => navigate('/login')}>
            Enter Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Football Edition</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Recruiting isn't broken —{' '}
              <span className="text-gradient">it's overloaded.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              WONRecruit Football turns portal chaos into a daily decision board.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
                Enter Live Demo
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => navigate('/login')}>
                See Today Board
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution → Benefit Grid */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem */}
            <div className="space-y-6 p-8 rounded-2xl gradient-card border border-border shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display text-2xl font-bold">The Problem</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✕</span>
                  Portal updates scattered across platforms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✕</span>
                  Coaches drowning in spreadsheets
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✕</span>
                  Compliance nightmares with contact tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">✕</span>
                  No single source of truth
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="space-y-6 p-8 rounded-2xl gradient-card border border-primary/30 shadow-card shadow-glow animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold">Our Solution</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                  Daily digest of top targets
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                  AI-powered fit scoring
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                  Real-time portal monitoring
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                  Built-in compliance guardrails
                </li>
              </ul>
            </div>

            {/* Benefit */}
            <div className="space-y-6 p-8 rounded-2xl gradient-card border border-border shadow-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-display text-2xl font-bold">The Result</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-success mt-1 shrink-0" />
                  80% faster evaluation cycles
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-success mt-1 shrink-0" />
                  Zero compliance violations
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-success mt-1 shrink-0" />
                  Team-wide alignment
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-success mt-1 shrink-0" />
                  Better roster decisions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-8">Trusted by top programs</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['P5 Programs', 'G5 Programs', 'FCS Programs', 'D2 Programs'].map((label) => (
              <div key={label} className="px-6 py-3 rounded-lg bg-secondary border border-border">
                <span className="font-display font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <div className="p-8 md:p-12 rounded-2xl gradient-card border border-border shadow-card">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center shrink-0">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-3xl font-bold">Compliance-First Architecture</h3>
                <p className="text-lg text-muted-foreground">
                  Every action is logged. Contact info is locked by default. Bulk exports are disabled. 
                  We built WONRecruit to keep your program safe while you compete.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm">
                    <Lock className="w-3 h-3" /> Audit Trail
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm">
                    <Lock className="w-3 h-3" /> Contact Gating
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm">
                    <Lock className="w-3 h-3" /> Role-Based Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How does the fit score work?', a: 'Our AI analyzes 50+ data points including scheme fit, athleticism, character indicators, and team needs to generate a composite score.' },
              { q: 'Is player contact info accessible?', a: 'Contact information is locked by default and requires compliance approval to access. All access is logged.' },
              { q: 'Can I export data?', a: 'Bulk exports are disabled by design. You can generate reports within the platform for compliance-approved use cases.' },
              { q: 'How real-time is the portal monitoring?', a: 'We monitor official portal sources and update within minutes of new entries or changes.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-secondary border border-border">
                <h4 className="font-display font-semibold mb-2">{item.q}</h4>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">WONRecruit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 WONRecruit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
