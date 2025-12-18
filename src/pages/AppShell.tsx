import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { 
  Target, 
  Calendar, 
  Radio, 
  Users, 
  CheckSquare, 
  Shield, 
  Sparkles,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ClipboardList,
  FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CoachGPTPanel from '@/components/CoachGPTPanel';

const NAV_ITEMS = [
  { to: '/app/today', icon: Calendar, label: 'Today', flag: 'daily_brief' },
  { to: '/app/portal', icon: Radio, label: 'Portal Live', flag: 'portal_live' },
  { to: '/app/players', icon: Users, label: 'Players', flag: 'players_module' },
  { to: '/app/roster', icon: ClipboardList, label: 'Roster', flag: 'roster_module' },
  { to: '/app/fit-lab', icon: FlaskConical, label: 'Fit Lab', flag: 'fit_lab' },
  { to: '/app/tasks', icon: CheckSquare, label: 'Tasks', flag: 'tasks_module' },
  { to: '/app/compliance', icon: Shield, label: 'Compliance', flag: 'audit_logging' },
  { to: '/app/upgrade', icon: Sparkles, label: 'Upgrade', flag: null },
];

const AppShell = () => {
  const navigate = useNavigate();
  const { demoRole, flags, logout } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gptOpen, setGptOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const enabledFlags = Object.entries(flags).filter(([_, v]) => v).length;
  const totalFlags = Object.keys(flags).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">WONRecruit</span>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isEnabled = item.flag === null || flags[item.flag as keyof typeof flags];
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {!isEnabled && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Locked
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Exit Demo</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/80 flex items-center justify-center text-xs font-bold text-destructive-foreground">
                UNLV
              </div>
              <span className="font-semibold hidden sm:inline">UNLV Rebels</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {enabledFlags}/{totalFlags} Features
            </span>
            <span className="px-3 py-1.5 rounded-full gradient-accent text-primary-foreground text-sm font-semibold">
              {demoRole}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setGptOpen(!gptOpen)}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>

          {/* CoachGPT Panel - Desktop */}
          <div className="hidden lg:block w-80 border-l border-border bg-card overflow-auto">
            <CoachGPTPanel />
          </div>
        </div>
      </div>

      {/* CoachGPT Panel - Mobile */}
      {gptOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setGptOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border overflow-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-semibold">CoachGPT</span>
              <button onClick={() => setGptOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <CoachGPTPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
