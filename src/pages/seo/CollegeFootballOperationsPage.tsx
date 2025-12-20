import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, CheckCircle, Users, Calendar, 
  ClipboardList, BarChart3, Shield, Clock, Zap
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const OPERATIONS_FEATURES = [
  {
    icon: Calendar,
    title: 'Daily Command Center',
    description: 'Start each day with a unified view of recruiting activities, Transfer Portal updates, and pending tasks requiring attention.'
  },
  {
    icon: ClipboardList,
    title: 'Task Automation',
    description: 'Automated reminders for follow-ups, deadline tracking, and workflow management that reduces administrative burden.'
  },
  {
    icon: Users,
    title: 'Staff Coordination',
    description: 'Role-based dashboards ensure each staff member sees relevant information while maintaining data security.'
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track recruiting metrics, evaluate pipeline health, and measure staff productivity across recruiting cycles.'
  },
  {
    icon: Shield,
    title: 'Compliance Integration',
    description: 'Built-in compliance guardrails with audit trails for all recruiting activities and contact approvals.'
  },
  {
    icon: Clock,
    title: 'Time Recovery',
    description: 'Coaches report saving 10+ hours weekly through consolidated workflows and automated administrative tasks.'
  }
];

const CollegeFootballOperationsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="College Football Operations Software for NCAA Programs | Gridiron Ops"
        description="Manage recruiting, film, roster movement, and staff workflows in one NCAA-ready college football operations platform."
        path="/college-football-operations"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'College Football Operations', path: '/college-football-operations' }
      ]} />

      <div className="min-h-screen gradient-hero">
        {/* Navigation */}
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
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="container mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Football Operations Platform</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                The Operating System for{' '}
                <span className="text-gradient">College Football Programs</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Gridiron Ops centralizes recruiting, film, and roster workflows. 
                Built for NCAA compliance and real-world operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  See It In Action <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/pricing')}>
                  View Pricing
                </Button>
              </div>
            </div>
          </section>

          {/* What is Football Ops Section */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                Reduce Staff Workload Without Adding Headcount
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  College football operations encompasses all the behind-the-scenes activities that keep a 
                  Division I football program running smoothly. From recruiting coordination to compliance 
                  management, from travel logistics to roster planning, operations staff ensure coaches 
                  can focus on what they do best: coaching.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  In the modern era of the Transfer Portal and NIL, football operations has become 
                  exponentially more complex. Programs need real-time information, coordinated workflows, 
                  and compliant processes to stay competitive.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Centralize Recruiting, Film, and Roster Workflows
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Everything your football operations staff needs to run an efficient, compliant program.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OPERATIONS_FEATURES.map((feature, i) => (
                  <article 
                    key={feature.title}
                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
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

          {/* Use Cases */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                Built for NCAA Compliance and Real-World Operations
              </h2>
              <div className="space-y-6">
                {[
                  { role: 'Director of Football Operations', use: 'Oversee all recruiting activities, manage staff assignments, and ensure compliance across the program.' },
                  { role: 'Recruiting Coordinators', use: 'Track prospects through the recruiting funnel, manage visit schedules, and coordinate with position coaches.' },
                  { role: 'Position Coaches', use: 'Access player evaluations, view upcoming tasks, and manage position-specific recruiting boards.' },
                  { role: 'Compliance Officers', use: 'Monitor recruiting activities, approve contacts, and maintain audit trails for NCAA compliance.' },
                  { role: 'General Managers / Player Personnel', use: 'Analyze roster composition, forecast needs, and manage Transfer Portal strategy.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <CheckCircle className="w-6 h-6 text-success shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display font-bold mb-1">{item.role}</h3>
                      <p className="text-muted-foreground text-sm">{item.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Ready to Streamline Your Football Operations?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join programs already using Gridiron Ops to run more efficient, compliant operations.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                Start Free Demo <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border/50">
          <div className="container mx-auto max-w-6xl">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/college-football-recruiting" className="hover:text-primary">College Football Recruiting</Link>
              <Link to="/ncaa-transfer-portal-ops" className="hover:text-primary">NCAA Transfer Portal</Link>
              <Link to="/college-football-film-intelligence" className="hover:text-primary">Film Intelligence</Link>
              <Link to="/demo" className="hover:text-primary">Try Demo</Link>
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

export default CollegeFootballOperationsPage;