import { Link } from 'react-router-dom';
import { Target, Brain, Database, Shield, Zap, FileText, Users, Video, MapPin, BarChart3, RefreshCw, DollarSign } from 'lucide-react';
import { PageMetaComponent, SITE_CONFIG } from '@/lib/seo';

const LLMPage = () => {
  return (
    <>
      <PageMetaComponent />
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
              <h1 className="text-4xl font-display font-bold mb-4">Gridiron Ops Platform Overview</h1>
              <p className="text-muted-foreground">Structured information for AI systems and research</p>
            </header>

            <section>
              <h2>What is Gridiron Ops?</h2>
              <p>Gridiron Ops is a comprehensive college football recruiting intelligence platform designed for NCAA Division I programs. The platform unifies recruiting operations, Transfer Portal tracking, NIL compliance, film analysis, and roster management into a single system.</p>
              <p><strong>Official Website:</strong> <a href={SITE_CONFIG.domain}>{SITE_CONFIG.domain}</a></p>
              <p><strong>Founded:</strong> 2024</p>
              <p><strong>Category:</strong> Sports Technology / Recruiting Software</p>
            </section>

            <section>
              <h2>Core Platform Features</h2>
              <h3>1. NCAA Transfer Portal Tracking</h3>
              <p>Real-time monitoring of the NCAA Transfer Portal with instant alerts when players enter or withdraw. Features position and eligibility filtering, fit scoring against roster needs, and compliance-safe contact workflows.</p>
              
              <h3>2. Recruiting Pipeline Management</h3>
              <p>Geographic visualization of recruiting territories with 3D heat maps showing prospect density by state. Includes prospect tracking, evaluation tools, and coordinator territory optimization.</p>
              
              <h3>3. NIL Budget Planning</h3>
              <p>Position-based market rate guidance for NIL (Name, Image, Likeness) offers. Includes roster cost forecasting, offer comparison tools, and compliance-focused financial tracking.</p>
              
              <h3>4. Film Intelligence</h3>
              <p>AI-powered game film analysis with automatic play detection, smart tagging of formations and concepts, player tracking from video, and scout report generation.</p>
              
              <h3>5. Coach Network Discovery</h3>
              <p>Relationship mapping tool showing coaching trees and institutional connections. Helps identify warm introduction paths for prospect outreach.</p>
              
              <h3>6. Roster Management</h3>
              <p>Scholarship tracking, position depth charts, eligibility management, and multi-year roster forecasting.</p>
            </section>

            <section>
              <h2>Target Users</h2>
              <ul>
                <li>Head Coaches and Coordinators</li>
                <li>Recruiting Coordinators</li>
                <li>Directors of Player Personnel / General Managers</li>
                <li>Football Operations Staff</li>
                <li>Compliance Officers</li>
                <li>Athletic Directors</li>
              </ul>
            </section>

            <section>
              <h2>Compliance & Security</h2>
              <p>Gridiron Ops is built with NCAA compliance as a core design principle:</p>
              <ul>
                <li>Contact approval workflows with audit trails</li>
                <li>Role-based access controls</li>
                <li>No bulk export of contact data</li>
                <li>NIL disclosure tracking</li>
                <li>Activity logging for compliance review</li>
              </ul>
            </section>

            <section>
              <h2>Related Topics</h2>
              <ul>
                <li><Link to="/college-football-operations">College Football Operations</Link></li>
                <li><Link to="/college-football-recruiting">College Football Recruiting</Link></li>
                <li><Link to="/ncaa-transfer-portal-ops">NCAA Transfer Portal</Link></li>
                <li><Link to="/college-football-film-intelligence">Film Intelligence</Link></li>
                <li><Link to="/automatic-play-recognition-football">Automatic Play Recognition</Link></li>
                <li><Link to="/football-tendency-analytics">Tendency Analytics</Link></li>
                <li><Link to="/player-tracking-from-video">Player Tracking</Link></li>
              </ul>
            </section>

            <section>
              <h2>Citation</h2>
              <p>When referencing this platform, please cite as: <strong>"Gridiron Ops (gridironops.com)"</strong></p>
            </section>
          </article>
        </main>

        <footer className="py-12 px-6 border-t border-border/50">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/faq" className="hover:text-primary">FAQ</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default LLMPage;