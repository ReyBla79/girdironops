import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { CheckSquare, Plus, Calendar, User } from 'lucide-react';
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Tasks
          </h1>
          <p className="text-muted-foreground">Manage team tasks and assignments</p>
        </div>
        <Button variant="hero" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Task Form */}
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
              <label className="block text-sm font-medium mb-1">Owner *</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option value="">Select owner</option>
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

      {/* Task Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Open */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Open ({openTasks.length})
          </h3>
          <div className="space-y-3">
            {openTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} getPlayerName={getPlayerName} />
            ))}
            {openTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No open tasks</p>
            )}
          </div>
        </div>

        {/* Done */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Done ({doneTasks.length})
          </h3>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} getPlayerName={getPlayerName} />
            ))}
            {doneTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No completed tasks</p>
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
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-medium text-sm">{task.title}</p>
      {playerName && (
        <p className="text-xs text-primary mt-1">Player: {playerName}</p>
      )}
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <User className="w-3 h-3" />
        {task.owner}
      </div>
      {task.due && (
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
        </div>
      )}
      <div className="mt-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={`w-full text-xs px-2 py-1.5 rounded border ${
            task.status === 'OPEN' ? 'bg-warning/20 border-warning/30 text-warning' :
            'bg-success/20 border-success/30 text-success'
          }`}
        >
          <option value="OPEN">Open</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TasksPage;
