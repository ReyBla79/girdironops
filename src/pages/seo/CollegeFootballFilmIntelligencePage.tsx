import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, Video, Play, Layers, 
  Users, FileText, Zap, Brain, Clock
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const FILM_FEATURES = [
  {
    icon: Play,
    title: 'Automatic Play Detection',
    description: 'AI identifies individual plays from continuous game film, eliminating hours of manual clipping work.'
  },
  {
    icon: Layers,
    title: 'Smart Tagging',
    description: 'Automatic tagging of formations, personnel, play types, and situations. Coach labels sync with AI detection.'
  },
  {
    icon: Users,
    title: 'Player Tracking',
    description: 'Track individual player routes, assignments, and performance metrics across every play.'
  },
  {
    icon: Brain,
    title: 'Tendency Analysis',
    description: 'Identify opponent tendencies by down, distance, field position, and game situation.'
  },
  {
    icon: FileText,
    title: 'Scout Reports',
    description: 'Generate comprehensive scout reports with key plays, tendencies, and recommendations.'
  },
  {
    icon: Clock,
    title: '10x Faster Review',
    description: 'Coaches report reviewing film in a fraction of the time compared to traditional methods.'
  }
];

const CollegeFootballFilmIntelligencePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="College Football Film Intelligence | AI Video Analysis | Gridiron Ops"
        description="AI-powered college football film analysis with automatic play detection, smart tagging, and scout report generation."
        path="/college-football-film-intelligence"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'Film Intelligence', path: '/college-football-film-intelligence' }
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
                <Video className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">AI-Powered Film Analysis</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                College Football{' '}
                <span className="text-gradient">Film Intelligence</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Transform how your staff breaks down film. Gridiron Ops uses AI to automatically 
                detect plays, tag formations, and surface the insights that matter most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  See Film Intelligence <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/automatic-play-recognition-football')}>
                  Learn About APR
                </Button>
              </div>
            </div>
          </section>

          {/* The Film Problem */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                The Film Review Problem
              </h2>
              <div className="prose prose-invert max-w-none text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  Coaching staffs spend <strong className="text-foreground">20+ hours per week</strong> on film review. 
                  Most of that time is spent on manual tasks: clipping plays, tagging formations, 
                  organizing by situation. The actual analysis—the insights that win games—gets 
                  compressed into whatever time remains.
                </p>
                <p className="text-lg text-muted-foreground">
                  Gridiron Ops Film Intelligence automates the tedious work so your coaches can 
                  focus on what they do best: <strong className="text-foreground">finding competitive advantages</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Film Intelligence Features
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                From raw game film to actionable insights in a fraction of the time.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FILM_FEATURES.map((feature) => (
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

          {/* Related Pages */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                Explore Film Intelligence
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link 
                  to="/automatic-play-recognition-football"
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <Play className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    Automatic Play Recognition
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    How AI detects and clips individual plays from game film.
                  </p>
                </Link>
                <Link 
                  to="/football-tendency-analytics"
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <Brain className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    Tendency Analytics
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Discover opponent patterns by situation, down, and distance.
                  </p>
                </Link>
                <Link 
                  to="/player-tracking-from-video"
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    Player Tracking
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Track routes, speed, and positioning from broadcast video.
                  </p>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Ready to Transform Your Film Room?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See how AI-powered film analysis can save your staff hours every week.
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
              <Link to="/ncaa-transfer-portal-ops" className="hover:text-primary">Transfer Portal</Link>
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

export default CollegeFootballFilmIntelligencePage;