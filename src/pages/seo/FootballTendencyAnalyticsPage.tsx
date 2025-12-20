import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, Brain, BarChart3, Zap, 
  Filter, PieChart, TrendingUp, MapPin
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const TENDENCY_TYPES = [
  {
    title: 'Down & Distance',
    description: 'What does the opponent run on 3rd and long? 2nd and short? Red zone 1st down? Get answers instantly.',
    icon: BarChart3
  },
  {
    title: 'Formation Tendencies',
    description: 'When they line up in 11 personnel vs. 21 personnel, how do their play calls change?',
    icon: Filter
  },
  {
    title: 'Field Position',
    description: 'Analyze how play-calling shifts in different zones: backed up, midfield, red zone, and goal line.',
    icon: MapPin
  },
  {
    title: 'Game Situation',
    description: 'How do they play when ahead vs. behind? First half vs. second half? After timeouts?',
    icon: TrendingUp
  },
  {
    title: 'Personnel Packages',
    description: 'Track which personnel groupings correlate with run vs. pass, and specific concept families.',
    icon: PieChart
  },
  {
    title: 'Motion & Shifts',
    description: 'Identify how pre-snap motion correlates with specific play types and targets.',
    icon: Zap
  }
];

const FootballTendencyAnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="Football Tendency Analytics | Opponent Analysis | Gridiron Ops"
        description="AI-powered tendency analytics that reveal opponent patterns by down, distance, formation, and game situation."
        path="/football-tendency-analytics"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'Film Intelligence', path: '/college-football-film-intelligence' },
        { name: 'Tendency Analytics', path: '/football-tendency-analytics' }
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
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Opponent Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Football Tendency{' '}
                <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Know what your opponent will do before they do it. Gridiron Ops surfaces 
                tendencies by situation, formation, and game context—giving you the edge on game day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  Explore Tendencies <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/college-football-film-intelligence')}>
                  Film Intelligence
                </Button>
              </div>
            </div>
          </section>

          {/* What is Tendency Analytics */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                What is Tendency Analytics?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  Tendency analytics examines patterns in an opponent's play-calling across multiple 
                  games to identify predictable behaviors. When a team shows the same formation in the 
                  same situation repeatedly, or heavily favors certain concepts on specific downs, 
                  that's a <strong className="text-foreground">tendency</strong>.
                </p>
                <p className="text-lg text-muted-foreground">
                  Gridiron Ops automatically calculates tendency percentages from tagged film, 
                  allowing coaches to quickly identify patterns that would take hours to compile manually. 
                  This intelligence directly informs game planning and in-game adjustments.
                </p>
              </div>
            </div>
          </section>

          {/* Tendency Types */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Types of Tendencies We Track
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Comprehensive tendency tracking across all dimensions of opponent behavior.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TENDENCY_TYPES.map((type) => (
                  <article key={type.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                      <type.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground text-sm">{type.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Example Insight */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                Example Tendency Insight
              </h2>
              <div className="p-8 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Opponent: State University</div>
                    <h3 className="font-display text-xl font-bold">3rd Down Tendency Report</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-background">
                    <div className="text-sm text-muted-foreground mb-2">3rd & 4-6 yards</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="w-[72%] bg-primary rounded-full h-3" />
                      </div>
                      <span className="font-display font-bold text-primary">72% Pass</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Heavily favors Stick/Hitch concepts. Slot receiver targeted 58% of throws.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background">
                    <div className="text-sm text-muted-foreground mb-2">3rd & 1-3 yards</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="w-[64%] bg-success rounded-full h-3" />
                      </div>
                      <span className="font-display font-bold text-success">64% Run</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Inside zone dominant. RB1 gets 80% of short-yardage carries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Find the Patterns That Win Games
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See how tendency analytics can give you a game-day advantage.
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
              <Link to="/college-football-film-intelligence" className="hover:text-primary">Film Intelligence</Link>
              <Link to="/automatic-play-recognition-football" className="hover:text-primary">Play Recognition</Link>
              <Link to="/player-tracking-from-video" className="hover:text-primary">Player Tracking</Link>
              <Link to="/pricing" className="hover:text-primary">Pricing</Link>
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

export default FootballTendencyAnalyticsPage;