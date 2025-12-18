import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Sparkles, Lock, ExternalLink, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; icon?: any; action: string; data?: any }[];
}

const CoachGPTPanel = () => {
  const navigate = useNavigate();
  const { flags, players, addTask, userList, demoRole, addEvent } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi Coach! I'm CoachGPT — your recruiting assistant. I can help you:\n\n• Understand why a player is ranked highly\n• Find similar players who entered recently\n• Create tasks for your staff\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const isEnabled = flags.coach_agent;

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'viewPlayer':
        navigate(`/app/player/${data.playerId}`);
        break;
      case 'goPortalLive':
        navigate('/app/portal');
        break;
      case 'viewTasks':
        navigate('/app/tasks');
        break;
      case 'createTask':
        if (data?.task) {
          addTask(data.task);
        }
        break;
    }
  };

  const handleSend = () => {
    if (!input.trim() || !isEnabled || isTyping) return;

    const userMessage = input.toLowerCase().trim();
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Log agent query
    addEvent({
      type: 'AGENT_QUERY',
      message: `CoachGPT query: "${input}"`,
    });

    setTimeout(() => {
      let response: Message;
      const sortedPlayers = [...players].sort((a, b) => b.fitScore - a.fitScore);
      const topPlayer = sortedPlayers[0];

      // Pattern 1: Why is player ranked #1?
      if (userMessage.includes('why') && (userMessage.includes('ranked') || userMessage.includes('#1') || userMessage.includes('top') || userMessage.includes('first'))) {
        response = {
          role: 'assistant',
          content: `**${topPlayer.name}** (${topPlayer.position}) is ranked #1 with a **${topPlayer.fitScore} Fit Score**.\n\n**Why:**\n${topPlayer.reasons.slice(0, 3).map((r) => `• ${r}`).join('\n')}\n\n${topPlayer.flags.length > 0 ? `**Flags:** ${topPlayer.flags[0]}` : '**No significant flags.**'}`,
          actions: [
            { label: `View ${topPlayer.name}`, icon: Eye, action: 'viewPlayer', data: { playerId: topPlayer.id } },
            { label: 'Create Eval Task', icon: Plus, action: 'createTask', data: { 
              task: {
                title: `Evaluate ${topPlayer.name} (${topPlayer.position})`,
                owner: userList.find(u => u.role === 'COORDINATOR')?.name || 'Coordinator',
                playerId: topPlayer.id,
                status: 'OPEN',
                due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
              }
            }},
          ],
        };
      }
      // Pattern 2: Who else entered today / like him?
      else if (userMessage.includes('who') && (userMessage.includes('entered') || userMessage.includes('today') || userMessage.includes('like') || userMessage.includes('similar'))) {
        const newPlayers = players.filter(p => p.status === 'NEW' || p.status === 'UPDATED').slice(0, 3);
        response = {
          role: 'assistant',
          content: `**Recent Portal Activity:**\n\n${newPlayers.map((p, i) => `${i + 1}. **${p.name}** (${p.position}) — ${p.originSchool}\n   Fit: ${p.fitScore} | Readiness: ${p.readiness} | Risk: ${p.risk}`).join('\n\n')}`,
          actions: [
            { label: 'View Portal Live', icon: ExternalLink, action: 'goPortalLive' },
          ],
        };
      }
      // Pattern 3: Create a task
      else if (userMessage.includes('create') && userMessage.includes('task')) {
        const coordinator = userList.find((u) => u.role === 'COORDINATOR');
        if (coordinator && topPlayer) {
          const newTask = {
            title: `Evaluate ${topPlayer.name} (${topPlayer.position})`,
            owner: coordinator.name,
            playerId: topPlayer.id,
            due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'OPEN' as const,
          };
          addTask(newTask);
          response = {
            role: 'assistant',
            content: `✅ **Task Created:**\n\n"${newTask.title}"\n\n• **Owner:** ${coordinator.name}\n• **Due:** 2 days\n• **Logged:** Audit trail updated`,
            actions: [
              { label: 'View Tasks', icon: ExternalLink, action: 'viewTasks' },
            ],
          };
        } else {
          response = { role: 'assistant', content: "I couldn't create the task. Please try again." };
        }
      }
      // Pattern 4: Contact info request (BLOCKED)
      else if (userMessage.includes('contact') || userMessage.includes('phone') || userMessage.includes('email') || userMessage.includes('number')) {
        response = {
          role: 'assistant',
          content: '🔒 **Contact access requires approval and is logged.**\n\nI cannot provide contact information directly. Per compliance guardrails, all contact requests must go through the approval workflow.\n\nI can open the contact request screen for you.',
          actions: [
            { label: `Request Contact for ${topPlayer.name}`, icon: Lock, action: 'viewPlayer', data: { playerId: topPlayer.id } },
          ],
        };
      }
      // Pattern 5: Player-specific query
      else if (players.some(p => userMessage.includes(p.name.toLowerCase().split(' ')[0].toLowerCase()))) {
        const matchedPlayer = players.find(p => userMessage.includes(p.name.toLowerCase().split(' ')[0].toLowerCase()));
        if (matchedPlayer) {
          response = {
            role: 'assistant',
            content: `**${matchedPlayer.name}** (${matchedPlayer.position})\n\n• **Fit Score:** ${matchedPlayer.fitScore}\n• **Readiness:** ${matchedPlayer.readiness}\n• **Risk:** ${matchedPlayer.risk}\n• **From:** ${matchedPlayer.originSchool}\n\n**Top Reasons:**\n${matchedPlayer.reasons.slice(0, 2).map(r => `• ${r}`).join('\n')}`,
            actions: [
              { label: 'View Full Profile', icon: Eye, action: 'viewPlayer', data: { playerId: matchedPlayer.id } },
            ],
          };
        } else {
          response = { role: 'assistant', content: "I couldn't find that player. Try asking by name." };
        }
      }
      // Default response
      else {
        response = {
          role: 'assistant',
          content: "I can help with:\n\n1. **\"Why is [player] ranked #1?\"**\n2. **\"Who else entered today?\"**\n3. **\"Create a task for the OC\"**\n4. **\"Tell me about Malik\"**\n\nWhat would you like to know?",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2">CoachGPT Locked</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unlock AI-powered insights and task automation.
        </p>
        <Button variant="hero" size="sm" onClick={() => navigate('/app/upgrade')}>
          <Sparkles className="w-4 h-4" />
          Upgrade
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
          <p className="text-xs text-muted-foreground">Demo Mode</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((action, j) => (
                    <Button 
                      key={j} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAction(action.action, action.data)}
                      className="text-xs"
                    >
                      {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-xl p-3 text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
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
            disabled={isTyping}
          />
          <Button size="icon" onClick={handleSend} disabled={isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Demo AI • Uses only visible data • Never invents contacts
        </p>
      </div>
    </div>
  );
};

export default CoachGPTPanel;
