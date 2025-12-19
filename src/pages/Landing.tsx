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
  AlertTriangle
} from 'lucide-react';

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
            <span className="font-display font-bold text-xl">Gridiron Ops</span>
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
            <div className="flex flex-wrap justify-center gap-2">
              {['Portal Clarity', 'Time Back', 'Compliance-First'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{badge}</span>
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Recruiting isn't broken —{' '}
              <span className="text-gradient">it's overloaded.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Gridiron Ops turns portal chaos into a daily decision board — built for speed, clarity, and compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
                Enter Live Demo
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => navigate('/login')}>
                View Today Board
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution → Benefit Grid */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Problem → Solution → Benefit
          </h2>
          
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 mb-4 px-4">
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
          <div className="space-y-3">
            {PROBLEM_SOLUTION_BENEFIT.map((row, i) => (
              <div 
                key={i} 
                className="grid md:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold text-lg md:hidden">✕</span>
                  <p className="text-sm text-muted-foreground">{row.problem}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg md:hidden">→</span>
                  <p className="text-sm">{row.solution}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5 md:hidden" />
                  <p className="text-sm text-success">{row.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Strip */}
      <section className="py-16 px-6 border-t border-border/50 bg-success/5">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center shrink-0">
              <Shield className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Compliance-first by design</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'No bulk exporting of contacts',
                  'Locked contacts (approval required)',
                  'Audit trail for actions',
                  'NIL visibility restricted by role'
                ].map((bullet, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-success" />
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
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
              <span className="font-display font-bold text-xl">Gridiron Ops</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Demo uses a simulated dataset (no live portal feeds).
            </p>
            <p className="text-sm text-muted-foreground">
              © 2026 Gridiron Ops. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
