import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Sparkles, Lock } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; action: () => void }[];
}

const CoachGPTPanel = () => {
  const { flags, players, addTask, userList, demoRole } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi Coach! I'm your AI assistant. I can help you understand player rankings, find similar prospects, or create tasks for your team. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');

  const isEnabled = flags.coach_agent;

  const handleSend = () => {
    if (!input.trim() || !isEnabled) return;

    const userMessage = input.toLowerCase().trim();
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Rule-based responses
    setTimeout(() => {
      let response: Message;

      // Pattern 1: Why is player ranked #1?
      if (userMessage.includes('why') && (userMessage.includes('ranked') || userMessage.includes('#1') || userMessage.includes('top'))) {
        const topPlayer = players.sort((a, b) => b.fitScore - a.fitScore)[0];
        response = {
          role: 'assistant',
          content: `**${topPlayer.name}** is ranked #1 with a **${topPlayer.fitScore}** Fit Score because:\n\n${topPlayer.reasons.map((r) => `• ${r}`).join('\n')}\n\n${topPlayer.flags.length > 0 ? `⚠️ Watch for: ${topPlayer.flags.join(', ')}` : '✅ No significant flags.'}`,
          actions: [
            { label: `View ${topPlayer.name}'s Profile`, action: () => window.location.href = `/app/player/${topPlayer.id}` },
            { label: 'Create evaluation task', action: () => {} },
          ],
        };
      }
      // Pattern 2: Who else entered today?
      else if (userMessage.includes('who') && (userMessage.includes('entered') || userMessage.includes('today') || userMessage.includes('like'))) {
        const recentPlayers = players.slice(0, 3);
        response = {
          role: 'assistant',
          content: `Here are the latest portal entries:\n\n${recentPlayers.map((p, i) => `${i + 1}. **${p.name}** (${p.position}) - ${p.origin} - Fit: ${p.fitScore}`).join('\n')}`,
          actions: [
            { label: 'View Portal Live', action: () => window.location.href = '/app/portal' },
          ],
        };
      }
      // Pattern 3: Create a task
      else if (userMessage.includes('create') && userMessage.includes('task')) {
        const topPlayer = players[0];
        const analyst = userList.find((u) => u.role === 'Analyst');
        if (analyst && topPlayer) {
          addTask({
            title: `Evaluate ${topPlayer.name}`,
            description: `Complete film review and evaluation for ${topPlayer.name}`,
            assignedTo: analyst.id,
            assignedBy: 'current',
            playerId: topPlayer.id,
            playerName: topPlayer.name,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
          });
          response = {
            role: 'assistant',
            content: `✅ Done! I've created a task:\n\n**"Evaluate ${topPlayer.name}"**\n\nAssigned to: ${analyst.name}\nDue: 3 days from now\n\nThe task has been added to your Tasks board and logged in the audit trail.`,
            actions: [
              { label: 'View Tasks', action: () => window.location.href = '/app/tasks' },
            ],
          };
        } else {
          response = {
            role: 'assistant',
            content: "I couldn't create the task. Please try again.",
          };
        }
      }
      // Pattern 4: Contact info request (blocked)
      else if (userMessage.includes('contact') || userMessage.includes('phone') || userMessage.includes('email')) {
        response = {
          role: 'assistant',
          content: '🔒 **Contact access requires approval.**\n\nI cannot reveal player contact information. This is protected by our compliance guardrails. Please submit a contact request through the player profile, which will be reviewed by your Compliance Officer.',
        };
      }
      // Default response
      else {
        response = {
          role: 'assistant',
          content: "I can help you with:\n\n1. **\"Why is [player] ranked #1?\"** - Understand fit scores\n2. **\"Who else entered today?\"** - See recent portal activity\n3. **\"Create a task for my team\"** - Delegate evaluations\n\nWhat would you like to know?",
        };
      }

      setMessages((prev) => [...prev, response]);
    }, 800);
  };

  if (!isEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2">CoachGPT Locked</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unlock AI-powered insights and task automation with the CoachGPT add-on.
        </p>
        <Button variant="hero" size="sm" onClick={() => window.location.href = '/app/upgrade'}>
          <Sparkles className="w-4 h-4" />
          Upgrade Now
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border hidden lg:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-sm">CoachGPT</p>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((action, j) => (
                    <Button key={j} variant="outline" size="sm" onClick={action.action}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about players..."
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary"
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachGPTPanel;
