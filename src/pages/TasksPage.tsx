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
