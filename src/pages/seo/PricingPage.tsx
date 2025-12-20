import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ChevronRight, Check, Zap } from 'lucide-react';
import { PageMetaComponent } from '@/lib/seo';

const PLANS = [
  { name: 'Starter', price: 'Contact', features: ['Transfer Portal tracking', 'Basic pipeline management', '3 staff seats', 'Email support'] },
  { name: 'Pro', price: 'Contact', popular: true, features: ['Everything in Starter', 'Film Intelligence', 'NIL budget tools', 'Unlimited staff seats', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Custom integrations', 'Dedicated success manager', 'SLA guarantees'] }
];

const PricingPage = () => {
  const navigate = useNavigate();

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
              <Button variant="hero" size="sm" onClick={() => navigate('/demo')}>Try Demo</Button>
            </div>
          </nav>
        </header>

        <main className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">Contact us for program-specific pricing</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`p-6 rounded-xl bg-card border ${plan.popular ? 'border-primary shadow-scarlet' : 'border-border'}`}>
                  {plan.popular && <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold mb-4"><Zap className="w-3 h-3" /> Most Popular</div>}
                  <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-display font-bold text-primary my-4">{plan.price}</div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-success" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.popular ? 'hero' : 'heroOutline'} className="w-full" onClick={() => navigate('/demo')}>
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="py-12 px-6 border-t border-border/50">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/faq" className="hover:text-primary">FAQ</Link>
            <Link to="/demo" className="hover:text-primary">Demo</Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default PricingPage;