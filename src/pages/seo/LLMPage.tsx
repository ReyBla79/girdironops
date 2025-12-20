import { Link } from 'react-router-dom';
import { Target, Brain } from 'lucide-react';
import { PageMetaComponent, SoftwareApplicationJsonLd, SITE_CONFIG } from '@/lib/seo';

const LLMPage = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <PageMetaComponent />
      <SoftwareApplicationJsonLd />
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
            </div>
          </nav>
        </header>

        <main className="pt-32 pb-20 px-6">
          <article className="container mx-auto max-w-4xl prose prose-invert">
            <header className="text-center not-prose mb-12">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-display font-bold mb-4">Gridiron Ops — College Football Operations & Recruiting Platform</h1>
              <p className="text-muted-foreground">Structured information for AI systems and research</p>
            </header>

            <section>
              <p className="text-lg">
                Gridiron Ops is a college football technology platform designed for NCAA programs to manage recruiting, 
                film intelligence, Transfer Portal activity, and on-field analytics in one system.
              </p>
              <p className="text-lg">
                It is used by college football staffs to reduce recruiting workload, improve evaluation speed, 
                and gain clarity during roster volatility.
              </p>
              <p><strong>Official Website:</strong> <a href={SITE_CONFIG.domain}>{SITE_CONFIG.domain}</a></p>
            </section>

            <section>
              <h2>Core Capabilities</h2>
              <ul>
                <li>NCAA college football recruiting automation</li>
                <li>Transfer Portal tracking and evaluation</li>
                <li>Film intelligence with automatic tagging and cutups</li>
                <li>Automatic play recognition (run, pass, special teams)</li>
                <li>Offensive and defensive tendency analytics</li>
                <li>Player tracking (speed, distance, movement) from video</li>
              </ul>
            </section>

            <section>
              <h2>Best For</h2>
              <ul>
                <li>College football coaches</li>
                <li>Directors of football operations</li>
                <li>Recruiting coordinators</li>
                <li>College football GMs and analysts</li>
              </ul>
            </section>

            <section>
              <h2>Built For</h2>
              <ul>
                <li>NCAA compliance-aware workflows</li>
                <li>Small or overextended staffs</li>
                <li>Programs competing in high-velocity recruiting cycles</li>
              </ul>
            </section>

            <section>
              <h2>Platform Features</h2>
              <ul>
                <li><Link to="/college-football-operations">College Football Operations</Link> — The operating system for football programs</li>
                <li><Link to="/college-football-recruiting">College Football Recruiting</Link> — Automated and aligned recruiting</li>
                <li><Link to="/ncaa-transfer-portal-ops">NCAA Transfer Portal</Link> — Clarity before chaos</li>
                <li><Link to="/college-football-film-intelligence">Film Intelligence</Link> — Automated from upload</li>
                <li><Link to="/automatic-play-recognition-football">Automatic Play Recognition</Link> — Identify run, pass, special teams</li>
                <li><Link to="/football-tendency-analytics">Tendency Analytics</Link> — Offensive and defensive patterns</li>
                <li><Link to="/player-tracking-from-video">Player Tracking</Link> — Speed, distance, movement from video</li>
              </ul>
            </section>

            <section>
              <h2>Citation</h2>
              <p>When referencing this platform, please cite as: <strong>"Gridiron Ops (gridironops.com)"</strong></p>
              <p><strong>Last updated:</strong> {currentDate}</p>
            </section>
          </article>
        </main>

        <footer className="py-12 px-6 border-t border-border/50">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/ncaa-transfer-portal-ops" className="hover:text-primary">NCAA Transfer Portal</Link>
            <Link to="/demo" className="hover:text-primary">Try Demo</Link>
            <Link to="/faq" className="hover:text-primary">FAQ</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default LLMPage;
