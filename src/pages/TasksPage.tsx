import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { CheckSquare, Plus, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const TasksPage = () => {
  const { tasks, userList, players, addTask, updateTaskStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignedTo) return;

    const player = players.find((p) => p.id === playerId);
    addTask({
      title,
      description,
      assignedTo,
      assignedBy: 'current',
      playerId: playerId || undefined,
      playerName: player?.name,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    });

    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPlayerId('');
    setDueDate('');
    setShowForm(false);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

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
              <label className="block text-sm font-medium mb-1">Assign To *</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                required
              >
                <option value="">Select user</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-primary resize-none"
            />
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
                type="date"
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
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pending */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Pending ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} users={userList} />
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            In Progress ({inProgressTasks.length})
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} users={userList} />
            ))}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} users={userList} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange, users }: { task: any; onStatusChange: any; users: any[] }) => {
  const assignee = users.find((u) => u.id === task.assignedTo);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-medium text-sm">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
      )}
      {task.playerName && (
        <p className="text-xs text-primary mt-1">Player: {task.playerName}</p>
      )}
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <User className="w-3 h-3" />
        {assignee?.name || 'Unassigned'}
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
      </div>
      <div className="mt-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={`w-full text-xs px-2 py-1.5 rounded border ${
            task.status === 'pending' ? 'bg-warning/20 border-warning/30 text-warning' :
            task.status === 'in_progress' ? 'bg-primary/20 border-primary/30 text-primary' :
            'bg-success/20 border-success/30 text-success'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TasksPage;
