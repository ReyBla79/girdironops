import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { PageMetaComponent } from '@/lib/seo';

const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMetaComponent />
      <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-8">
            <Play className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Try Gridiron Ops <span className="text-gradient">Demo</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the full platform with simulated data. No account required.
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            {['Transfer Portal tracking', 'Recruiting pipeline maps', 'Film intelligence preview', 'NIL budget tools'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
            Enter Demo <ChevronRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary">← Back to Home</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default DemoPage;