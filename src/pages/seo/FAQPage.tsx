import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ChevronRight, HelpCircle } from 'lucide-react';
import { PageMetaComponent, FAQJsonLd, LANDING_FAQ } from '@/lib/seo';

const EXTENDED_FAQ = [
  ...LANDING_FAQ,
  { question: 'How long does implementation take?', answer: 'Most programs are fully onboarded within 2 weeks, including data migration and staff training.' },
  { question: 'Can I import existing recruiting data?', answer: 'Yes, we support imports from spreadsheets, other recruiting platforms, and manual entry.' },
  { question: 'Is there a mobile app?', answer: 'Gridiron Ops is a web application optimized for desktop and tablet. Mobile-responsive views are available for on-the-go access.' }
];

const FAQPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <FAQJsonLd />
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
              <Button variant="hero" size="sm" onClick={() => navigate('/demo')}>Try Demo</Button>
            </div>
          </nav>
        </header>

        <main className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-display font-bold mb-4">Frequently Asked <span className="text-gradient">Questions</span></h1>
              <p className="text-muted-foreground">Everything you need to know about Gridiron Ops</p>
            </div>
            <div className="space-y-4">
              {EXTENDED_FAQ.map((faq, i) => (
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
        </main>

        <footer className="py-12 px-6 border-t border-border/50">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
            <Link to="/demo" className="hover:text-primary">Demo</Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default FAQPage;