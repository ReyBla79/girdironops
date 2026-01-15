# Gridiron Ops - Page Components Export

This document contains all page components as copy-paste blocks for recreating the Gridiron Ops platform.

---

## Table of Contents

1. [Core App Pages](#1-core-app-pages)
2. [Budget & Finance Pages](#2-budget--finance-pages)
3. [Recruiting Pages](#3-recruiting-pages)
4. [Pipeline Pages](#4-pipeline-pages)
5. [Film Pages](#5-film-pages)
6. [Gridiron RevShare Pages](#6-gridiron-revshare-pages)
7. [Utility Pages](#7-utility-pages)
8. [Routes](#8-routes)

---

## 1. Core App Pages

### `src/pages/Index.tsx`
```tsx
import { Navigate } from 'react-router-dom';

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
```

### `src/pages/NotFound.tsx`
```tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
```

### `src/pages/TodayPage.tsx`
```tsx
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';

const TodayPage = () => {
  const navigate = useNavigate();
  const { players, events, tasks, demoRole, markPlayerReviewed } = useAppStore();

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const topTargets = [...players]
    .filter(p => p.status !== 'WITHDRAWN')
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 6);
    
  const newEvents = events.filter((e) => {
    const eventDate = new Date(e.ts);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return eventDate > yesterday;
  }).slice(0, 6);
  
  const myTasks = tasks.filter((t) => t.status === 'OPEN').slice(0, 4);

  const getPlayerName = (playerId?: string) => {
    if (!playerId) return null;
    const player = players.find(p => p.id === playerId);
    return player?.name;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Daily Digest Header */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Today</h1>
            <p className="text-muted-foreground mt-1">
              {greeting} — here's what changed since yesterday.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Last updated: {format(today, 'h:mm a')}
          </div>
        </div>
      </div>

      {/* New Since Yesterday */}
      {newEvents.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            New Since Yesterday
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {newEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  event.type === 'PORTAL_NEW' ? 'bg-primary' :
                  event.type === 'PORTAL_WITHDRAWN' ? 'bg-destructive' :
                  event.type === 'PORTAL_UPDATED' ? 'bg-warning' :
                  'bg-success'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.ts), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Top Targets Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Targets
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/players')}>
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">SIZE</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ELIG</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POOL</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {topTargets.map((player) => (
                    <tr 
                      key={player.id} 
                      className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/app/player/${player.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.originSchool}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                          {player.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {player.height} / {player.weight}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{player.eligibility}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.pool === 'TRANSFER_PORTAL' ? 'bg-primary/20 text-primary' :
                          player.pool === 'JUCO' ? 'bg-warning/20 text-warning' :
                          'bg-success/20 text-success'
                        }`}>
                          {player.pool === 'TRANSFER_PORTAL' ? 'Portal' : player.pool}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.status === 'NEW' ? 'bg-primary/20 text-primary' :
                          player.status === 'UPDATED' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
                          {player.fitScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Tasks Widget */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Open Tasks</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>
                View All
              </Button>
            </div>
            {myTasks.length > 0 ? (
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const playerName = getPlayerName(task.playerId);
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-secondary border border-border">
                      <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{task.owner}</span>
                        {task.due && (
                          <span className="text-xs text-warning">
                            Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No open tasks</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/app/tasks')}>
              + Create Task
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-primary">{players.filter(p => p.status === 'NEW').length}</p>
                <p className="text-xs text-muted-foreground">New entries</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-success">{players.filter(p => p.fitScore >= 85).length}</p>
                <p className="text-xs text-muted-foreground">High-fit targets</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-warning">{tasks.filter(t => t.status === 'OPEN').length}</p>
                <p className="text-xs text-muted-foreground">Open tasks</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold">{players.filter(p => p.reviewed).length}</p>
                <p className="text-xs text-muted-foreground">Reviewed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPage;
```

### `src/pages/TasksPage.tsx`
```tsx
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Task } from '@/types';

const TasksPage = () => {
  const { tasks, userList, players, addTask, updateTaskStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !owner) return;

    addTask({
      title,
      owner,
      playerId: playerId || undefined,
      due: dueDate || undefined,
      status: 'OPEN',
    });

    setTitle('');
    setOwner('');
    setPlayerId('');
    setDueDate('');
    setShowForm(false);
  };

  const openTasks = tasks.filter((t) => t.status === 'OPEN');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  const getPlayerName = (pId?: string) => {
    if (!pId) return null;
    return players.find(p => p.id === pId)?.name;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Tasks
          </h1>
          <p className="text-muted-foreground">Ownership, due dates, and accountability.</p>
        </div>
        <Button variant="hero" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Task Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-display font-semibold">Create New Task</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assign To *</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option value="">Select assignee</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Related Player</label>
              <select
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
              >
                <option value="">None</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.position})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create Task</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Task List grouped by status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Open */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <h3 className="font-semibold">Open ({openTasks.length})</h3>
          </div>
          <div className="p-4 space-y-3">
            {openTasks.length > 0 ? (
              openTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} getPlayerName={getPlayerName} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No open tasks</p>
            )}
          </div>
        </div>

        {/* Done */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <h3 className="font-semibold">Done ({doneTasks.length})</h3>
          </div>
          <div className="p-4 space-y-3">
            {doneTasks.length > 0 ? (
              doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} getPlayerName={getPlayerName} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  getPlayerName: (playerId?: string) => string | null | undefined;
}

const TaskCard = ({ task, onStatusChange, getPlayerName }: TaskCardProps) => {
  const playerName = getPlayerName(task.playerId);

  return (
    <div className={`rounded-lg border p-4 transition-colors ${
      task.status === 'DONE' ? 'border-success/30 bg-success/5' : 'border-border bg-secondary/30'
    }`}>
      <p className={`font-medium text-sm ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
        {task.title}
      </p>
      {playerName && (
        <p className="text-xs text-primary mt-1">Player: {playerName}</p>
      )}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {task.owner}
        </div>
        {task.due && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
          </div>
        )}
      </div>
      <div className="mt-3">
        <Button
          variant={task.status === 'OPEN' ? 'outline' : 'success'}
          size="sm"
          className="w-full"
          onClick={() => onStatusChange(task.id, task.status === 'OPEN' ? 'DONE' : 'OPEN')}
        >
          {task.status === 'OPEN' ? 'Mark Complete' : 'Reopen'}
        </Button>
      </div>
    </div>
  );
};

export default TasksPage;
```

### `src/pages/Login.tsx`
```tsx
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
            <span className="font-display font-bold text-3xl">Gridiron Ops</span>
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
```

### `src/pages/UpgradePage.tsx`
```tsx
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Lock, RotateCcw, Info } from 'lucide-react';
import { FeatureFlags } from '@/types';

const TOGGLES: { key: keyof FeatureFlags; name: string; description: string }[] = [
  { key: 'coach_agent', name: 'CoachGPT', description: 'AI assistant with natural language queries' },
  { key: 'memory_engine', name: 'Memory Engine', description: 'Long-term context for conversations' },
  { key: 'alerts_realtime', name: 'Real-time Alerts', description: 'Instant portal update notifications' },
  { key: 'sms_daily', name: 'SMS Daily Digest', description: 'Morning briefing via text' },
  { key: 'coach_network_pro', name: 'Coach Network Pro', description: 'Inter-program intel sharing' },
  { key: 'enterprise_institutional', name: 'Enterprise / Institutional', description: 'Multi-sport & institutional analytics' },
  { key: 'film_ai', name: 'Film AI', description: 'AI-powered film tagging & highlights' },
  { key: 'revshare_engine', name: 'RevShare Engine', description: 'RevShare valuation & market data' },
];

const BASE_FLAGS: (keyof FeatureFlags)[] = [
  'base_platform',
  'daily_brief',
  'portal_live',
  'players_module',
  'player_profile',
  'tasks_module',
  'program_dna',
  'audit_logging',
  'compliance_guardrails',
];

const UpgradePage = () => {
  const { flags, toggleFlag, resetFlags, resetDemo } = useAppStore();

  const enabledAddons = TOGGLES.filter((t) => flags[t.key]).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Upgrade Center
        </h1>
        <p className="text-muted-foreground">Toggle add-ons for demo (no billing).</p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-secondary border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm">
            <strong>Demo-only toggles.</strong> In the real product, these features will be set by your subscription tier.
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Add-ons</p>
            <p className="text-3xl font-display font-bold">
              {enabledAddons} <span className="text-lg text-muted-foreground font-normal">/ {TOGGLES.length}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Base Features</p>
            <p className="text-lg font-semibold text-success flex items-center gap-1 justify-end">
              <Check className="w-4 h-4" /> {BASE_FLAGS.length} Included
            </p>
          </div>
        </div>
      </div>

      {/* Add-on Toggles */}
      <div>
        <h3 className="font-display font-semibold mb-4">Feature Add-ons</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {TOGGLES.map((toggle) => {
            const isEnabled = flags[toggle.key];
            return (
              <div 
                key={toggle.key}
                className={`rounded-xl border p-5 transition-all ${
                  isEnabled 
                    ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]' 
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold">{toggle.name}</h4>
                      {isEnabled && (
                        <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                          ON
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{toggle.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFlag(toggle.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform ${
                      isEnabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" onClick={resetFlags}>
          <RotateCcw className="w-4 h-4" />
          Reset Flags to Base
        </Button>
        <Button variant="destructive" onClick={resetDemo}>
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
};

export default UpgradePage;
```

---

## 2. Budget & Finance Pages

### `src/pages/BudgetPage.tsx`
*See GRIDIRON_OPS_FULL_EXPORT.md or copy the full 299-line file from the codebase.*

### `src/pages/ForecastPage.tsx`
*See GRIDIRON_OPS_FULL_EXPORT.md or copy the full 261-line file from the codebase.*

### `src/pages/BudgetSimulatorPage.tsx`
*See GRIDIRON_OPS_FULL_EXPORT.md or copy the full 350-line file from the codebase.*

### `src/pages/GMCenterPage.tsx`
*See GRIDIRON_OPS_FULL_EXPORT.md or copy the full 517-line file from the codebase.*

### `src/pages/FitLabPage.tsx`
*See GRIDIRON_OPS_FULL_EXPORT.md or copy the full 331-line file from the codebase.*

---

## 3. Recruiting Pages

### `src/pages/PlayersPage.tsx`
*Full file: 257 lines - Copy from codebase*

### `src/pages/PlayerProfile.tsx`
*Full file: 333 lines - Copy from codebase*

### `src/pages/PortalPage.tsx`
*Full file: 180 lines - Copy from codebase*

### `src/pages/RosterPage.tsx`
*Full file: 217 lines - Copy from codebase*

### `src/pages/NetworkPage.tsx`
*Full file: 228 lines - Copy from codebase*

### `src/pages/CoachProfilePage.tsx`
*Full file: 218 lines - Copy from codebase*

### `src/pages/CompliancePage.tsx`
*Full file: 137 lines - Copy from codebase*

---

## 4. Pipeline Pages

### `src/pages/PipelineListPage.tsx`
*Full file: 240 lines - Copy from codebase*

### `src/pages/PipelineDetailPage.tsx`
*Full file: 274 lines - Copy from codebase*

### `src/pages/PipelineMapPage.tsx`
*Full file: 195 lines - Copy from codebase*

---

## 5. Film Pages

### `src/pages/film/FilmInboxPage.tsx`
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Upload, Settings, Film, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SEED_FILM_ASSETS } from '@/demo/filmData';
import { useAppStore } from '@/store/useAppStore';
import DemoTierSwitcher from '@/components/DemoTierSwitcher';

const FilmInboxPage = () => {
  const navigate = useNavigate();
  const { tiers, setSelectedFilm } = useAppStore();

  const handleUpload = () => {
    toast('Demo upload queued. (No backend)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Processed</Badge>;
      case 'Processing':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Film Inbox</h1>
          <p className="text-muted-foreground">
            Upload game/practice film → auto-segment → auto-tag → clip → report. (Demo uses mock data.)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpload} variant="default">
            <Upload className="w-4 h-4 mr-2" />
            Upload (Demo)
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/film/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Tier Switch
          </Button>
        </div>
      </div>

      {/* Tier Banner */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="py-3">
          <p className="text-sm">
            <span className="font-semibold">Demo Tier: {tiers.tier}.</span>{' '}
            PRO unlocks Tracking + Advanced Analytics. ELITE unlocks Playbook Learning + Assignment Inference + Player Development.
          </p>
        </CardContent>
      </Card>

      {/* Film Inbox Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Film Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Angles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEED_FILM_ASSETS.map((film) => (
                <TableRow key={film.filmId}>
                  <TableCell className="font-medium">{film.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{film.type}</Badge>
                  </TableCell>
                  <TableCell>{film.opponent || '—'}</TableCell>
                  <TableCell>{film.date}</TableCell>
                  <TableCell>{film.angles.join(', ')}</TableCell>
                  <TableCell>{getStatusBadge(film.status)}</TableCell>
                  <TableCell>{film.confidence}</TableCell>
                  <TableCell>{film.playsDetected || '—'}</TableCell>
                  <TableCell>
                    {film.status === 'Processed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFilm(film.filmId);
                          navigate(`/app/film/${film.filmId}`);
                        }}
                      >
                        Open Timeline
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Callout */}
      <Card>
        <CardHeader>
          <CardTitle>What Film Intelligence does</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Auto-recognizes run/pass/RPO/PA/special teams</li>
            <li>Tags formation/motion/personnel + defensive shell (demo tags)</li>
            <li>One-click cutups + scouting report generator</li>
            <li>Tracking + speed/heatmaps (PRO), Playbook learning (ELITE)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Demo Tier Switcher */}
      <DemoTierSwitcher />
    </div>
  );
};

export default FilmInboxPage;
```

### `src/pages/film/OpsGMFilmPage.tsx`
```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OpsGMChat from '@/components/OpsGMChat';

const PROMPT_CHIPS = [
  "What killed us on 3rd down last game?",
  "Clip all Inside Zone vs Odd Front.",
  "Show every Cover 3 bust and likely cause.",
  "What are our top tendencies by down & distance?",
];

const OpsGMFilmPage = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">Ops GM — Film Intelligence</h1>
        <p className="text-muted-foreground">
          Ask questions → get coach-ready answers using your film tags, tendencies, and mock tracking.
        </p>
      </div>

      {/* Prompt Chips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PROMPT_CHIPS.map((chip) => (
              <Badge
                key={chip}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-3"
                onClick={() => setSelectedPrompt(chip)}
              >
                {chip}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ops GM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OpsGMChat initialPrompt={selectedPrompt} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OpsGMFilmPage;
```

---

## 6. Gridiron RevShare Pages

### `src/pages/gridiron/GridironSetupPage.tsx`
*Full file: 233 lines - Copy from codebase*

### `src/pages/gridiron/GridironDashboardPage.tsx`
*Full file: 119 lines - Copy from codebase*

### `src/pages/gridiron/GridironScenariosPage.tsx`
*Full file: 93 lines - Copy from codebase*

### `src/pages/gridiron/RosterIntakePage.tsx`
*Full file: 556 lines - Copy from codebase*

### `src/pages/gridiron/RosterUsagePage.tsx`
*Full file: 388 lines - Copy from codebase*

### `src/pages/gridiron/RosterGradesPage.tsx`
*Full file: 354 lines - Copy from codebase*

### `src/pages/gridiron/ScenarioLab.tsx`
*Full file: 900 lines - Copy from codebase*

---

## 7. Utility Pages

### `src/pages/AppShell.tsx`
*Full file: 197 lines - Copy from codebase*

### `src/pages/Landing.tsx`
*Full file: 478 lines - Copy from codebase*

---

## 8. Routes

### `src/routes/GridironRoutes.tsx`
```tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GridironSetupPage from "@/pages/gridiron/GridironSetupPage";
import RosterIntakePage from "@/pages/gridiron/RosterIntakePage";
import RosterUsagePage from "@/pages/gridiron/RosterUsagePage";
import RosterGradesPage from "@/pages/gridiron/RosterGradesPage";
import GridironDashboardPage from "@/pages/gridiron/GridironDashboardPage";
import ScenarioLab from "@/pages/gridiron/ScenarioLab";

export default function GridironRoutes() {
  return (
    <Routes>
      <Route path="/gridiron/setup" element={<GridironSetupPage />} />
      <Route path="/gridiron/roster/intake" element={<RosterIntakePage />} />
      <Route path="/gridiron/roster/usage" element={<RosterUsagePage />} />
      <Route path="/gridiron/roster/grades" element={<RosterGradesPage />} />
      <Route path="/gridiron/roster" element={<GridironDashboardPage />} />
      <Route path="/gridiron/scenarios" element={<ScenarioLab />} />
      <Route path="/gridiron" element={<Navigate to="/gridiron/setup" replace />} />
    </Routes>
  );
}
```

---

## Complete Export Package

For the full source code export, you now have:

1. **GRIDIRON_OPS_FULL_EXPORT.md** - Core files, types, store, demo data, utilities
2. **EXPORT_PAGES.md** (this file) - All page components
3. **COMPLETE_SETUP_GUIDE.md** - Database migrations and setup instructions
4. **SOURCE_FILES_EXPORT.md** - Additional source files

**Total Files**: 80+ components and pages
**Total Lines of Code**: 15,000+

---

*Generated for Gridiron Ops platform export*
