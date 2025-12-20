import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Target, ChevronRight, Play, Scissors, Zap, 
  Clock, CheckCircle, Video, Brain
} from 'lucide-react';
import { PageMetaComponent, WebPageJsonLd, BreadcrumbJsonLd } from '@/lib/seo';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Game Film',
    description: 'Upload broadcast footage, All-22, or sideline video in standard formats. No special encoding required.'
  },
  {
    step: '02',
    title: 'AI Analyzes Video',
    description: 'Our computer vision models detect snap timing, ball movement, and play boundaries automatically.'
  },
  {
    step: '03',
    title: 'Plays Are Clipped',
    description: 'Individual plays are extracted with buffer before snap and after whistle. Each gets its own clip.'
  },
  {
    step: '04',
    title: 'Tags Are Applied',
    description: 'Formation, personnel, down/distance, and play type tags are automatically generated.'
  },
  {
    step: '05',
    title: 'Review & Refine',
    description: 'Coaches review clips, adjust tags if needed, and the system learns from corrections.'
  }
];

const AutomaticPlayRecognitionPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <WebPageJsonLd 
        title="Automatic Play Recognition for Football | AI Play Detection | Gridiron Ops"
        description="AI-powered automatic play recognition that detects and clips individual plays from continuous football game film."
        path="/automatic-play-recognition-football"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', path: '/' },
        { name: 'Film Intelligence', path: '/college-football-film-intelligence' },
        { name: 'Automatic Play Recognition', path: '/automatic-play-recognition-football' }
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
                <Scissors className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Play Detection Technology</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Automatic Play Recognition{' '}
                <span className="text-gradient">for Football</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Stop manually clipping plays from game film. Gridiron Ops uses computer vision 
                to automatically detect, clip, and tag every play—saving hours of staff time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" onClick={() => navigate('/demo')}>
                  See APR in Action <ChevronRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl" onClick={() => navigate('/college-football-film-intelligence')}>
                  Film Intelligence Overview
                </Button>
              </div>
            </div>
          </section>

          {/* What is APR */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-8">
                What is Automatic Play Recognition?
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  Automatic Play Recognition (APR) uses artificial intelligence and computer vision 
                  to identify when plays start and end in continuous football game footage. The technology 
                  detects the snap, tracks the play through its conclusion, and automatically clips 
                  each play into its own video segment.
                </p>
                <p className="text-lg text-muted-foreground">
                  Before APR, student managers or analysts spent <strong className="text-foreground">5-10 hours per game</strong> manually 
                  scrubbing through footage and clipping plays. With Gridiron Ops, that process happens 
                  automatically in the time it takes to upload the video.
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-12 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-4xl">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="font-display text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground text-sm">Play Detection Accuracy</div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="font-display text-4xl font-bold text-primary mb-2">10x</div>
                  <div className="text-muted-foreground text-sm">Faster Than Manual</div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="font-display text-4xl font-bold text-primary mb-2">70-150</div>
                  <div className="text-muted-foreground text-sm">Plays Per Game</div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 px-6 border-t border-border/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                How Automatic Play Recognition Works
              </h2>
              <div className="space-y-6">
                {HOW_IT_WORKS.map((item, i) => (
                  <div 
                    key={item.step}
                    className="flex gap-6 p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="font-display text-3xl font-bold text-primary/50">{item.step}</div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-6 border-t border-border/50 bg-card/30">
            <div className="container mx-auto max-w-4xl">
              <h2 className="font-display text-3xl font-bold text-center mb-12">
                Benefits of APR
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Time Savings', desc: 'Reclaim 5-10 hours per game that staff previously spent on manual clipping.' },
                  { title: 'Consistency', desc: 'Every play clipped the same way, with consistent buffer and timing.' },
                  { title: 'Faster Turnaround', desc: 'Game film ready for analysis within hours of upload, not days.' },
                  { title: 'Auto-Tagging', desc: 'Play detection includes situational tags like down, distance, and quarter.' }
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <CheckCircle className="w-6 h-6 text-success shrink-0 mt-1" />
                    <div>
                      <h3 className="font-display font-bold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 border-t border-border/50 bg-primary/5">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Stop Clipping Plays Manually
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See how APR can save your staff hours every week.
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
              <Link to="/football-tendency-analytics" className="hover:text-primary">Tendency Analytics</Link>
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

export default AutomaticPlayRecognitionPage;