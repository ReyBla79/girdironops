import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, Users, Crosshair, Zap, 
  Activity, Route, Timer, Eye
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const TRACKING_FEATURES = [
  {
    icon: Route,
    title: 'Route Tracing',
    description: 'Visualize receiver routes and running back paths with overlay graphics showing actual paths traveled.'
  },
  {
    icon: Timer,
    title: 'Speed Metrics',
    description: 'Estimate player speeds at key moments: off the snap, at the catch point, in pursuit angles.'
  },
  {
    icon: Crosshair,
    title: 'Positioning Analysis',
    description: 'Track player spacing, alignment, and positioning relative to ball, defenders, and sidelines.'
  },
  {
    icon: Activity,
    title: 'Movement Patterns',
    description: 'Identify consistent movement habits and tendencies for individual players across games.'
  },
  {
    icon: Eye,
    title: 'Coverage Shells',
    description: 'Track defensive backs to identify coverage rotations, zone assignments, and man responsibilities.'
  },
  {
    icon: Users,
    title: 'Team Movement',
    description: 'Analyze pursuit angles, blocking assignments, and coordinated unit movements.'
  }
];

const PlayerTrackingFromVideoPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="Player Tracking from Video | Football Motion Analysis | Gridiron Ops"
        description="AI-powered player tracking that extracts positioning, speed, and routes from broadcast and All-22 football video."
        path="/player-tracking-from-video"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'Film Intelligence', path: '/college-football-film-intelligence' },
        { name: 'Player Tracking', path: '/player-tracking-from-video' }
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
                <Crosshair className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Motion Analysis</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Player Tracking{' '}
                <span className="text-gradient">from Video</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Extract player positioning, routes, and movement data from standard game film. 
                No sensors, no special cameras—just AI analyzing your existing video.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  See Tracking in Action <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/college-football-film-intelligence')}>
                  Film Intelligence
                </Button>
              </div>
            </div>
          </section>

          {/* What is Video-Based Tracking */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                What is Video-Based Player Tracking?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  Traditionally, detailed player tracking required expensive sensor systems 
                  or specialized camera setups. Video-based tracking uses computer vision 
                  to extract similar data from <strong className="text-foreground">standard broadcast and All-22 footage</strong> 
                  that every program already has access to.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Gridiron Ops applies pose estimation and object detection models to identify 
                  each player on the field, track their position frame-by-frame, and calculate 
                  derived metrics like speed, acceleration, and route shapes.
                </p>
                <p className="text-lg text-muted-foreground">
                  The result: actionable player movement data without any additional hardware investment.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-3xl font-bold text-center mb-4">
                Tracking Capabilities
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Comprehensive player movement analysis from standard game film.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRACKING_FEATURES.map((feature) => (
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

          {/* Use Cases */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                How Teams Use Player Tracking
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display text-xl font-bold mb-3">Receiver Evaluation</h3>
                  <p className="text-muted-foreground">
                    Compare route-running precision between prospects. See who gets to their 
                    landmarks on time, who creates separation, and who wins at the catch point.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display text-xl font-bold mb-3">Defensive Back Analysis</h3>
                  <p className="text-muted-foreground">
                    Track coverage technique, pursuit angles, and reaction time. Identify 
                    which DBs maintain proper leverage and which get beaten on specific routes.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display text-xl font-bold mb-3">Self-Scout Development</h3>
                  <p className="text-muted-foreground">
                    Track your own players' progress over time. Measure improvements in 
                    technique, speed, and consistency from early season to late season.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                See Every Player Movement
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Unlock player tracking insights from your existing game film.
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
              <Link to="/football-tendency-analytics" className="hover:text-primary">Tendency Analytics</Link>
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

export default PlayerTrackingFromVideoPage;