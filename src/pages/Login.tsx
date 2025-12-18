import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ChevronRight, User, Building } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Role } from '@/types';

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'HC', label: 'Head Coach (HC)', description: 'Full access to all features' },
  { value: 'GM_RC', label: 'Recruiting Coordinator', description: 'Roster and player management' },
  { value: 'COORDINATOR', label: 'Coordinator (OC/DC)', description: 'Offensive/Defensive evaluation' },
  { value: 'ANALYST_GA', label: 'Analyst / GA', description: 'Data and film analysis' },
  { value: 'COMPLIANCE', label: 'Compliance Officer', description: 'Audit and compliance tools' },
];

const Login = () => {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<Role>('HC');

  const handleLogin = () => {
    login(selectedRole, 'unlv');
    navigate('/app/today');
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
              <Target className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-3xl">WONRecruit</span>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Enter UNLV Live Demo</h1>
          <p className="text-muted-foreground">Select your role to explore the platform</p>
        </div>

        {/* Program Display */}
        <div className="p-4 rounded-xl bg-secondary border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-destructive/80 flex items-center justify-center font-bold text-destructive-foreground">
            UNLV
          </div>
          <div>
            <p className="font-semibold">UNLV Football</p>
            <p className="text-sm text-muted-foreground">Demo Program</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Select Role</label>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedRole === role.value
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(25_95%_53%_/_0.2)]'
                    : 'border-border bg-secondary hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedRole === role.value ? 'gradient-accent' : 'bg-muted'
                  }`}>
                    <User className={`w-5 h-5 ${selectedRole === role.value ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{role.label}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button variant="hero" size="xl" className="w-full" onClick={handleLogin}>
          Enter Demo
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Back link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to landing page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
