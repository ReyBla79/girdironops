import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Player, Event, Task, Role, FeatureFlags } from '@/types';
import { DEFAULT_FLAGS, DEMO_USERS, SEED_PLAYERS, SEED_EVENTS, SEED_TASKS, ADDITIONAL_PLAYER_NAMES, POSITIONS, ORIGINS } from '@/demo/demoData';

interface AppStore extends AppState {
  login: (role: Role, programId: string) => void;
  logout: () => void;
  toggleFlag: (flag: keyof FeatureFlags) => void;
  resetFlags: () => void;
  addEvent: (event: Omit<Event, 'id' | 'timestamp'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  markPlayerReviewed: (playerId: string) => void;
  simulatePortalEntry: () => void;
  resetDemo: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      demoAuthed: false,
      demoRole: null,
      programId: null,
      flags: DEFAULT_FLAGS,
      players: SEED_PLAYERS,
      events: SEED_EVENTS,
      tasks: SEED_TASKS,
      userList: DEMO_USERS,

      login: (role, programId) => {
        set({ demoAuthed: true, demoRole: role, programId });
      },

      logout: () => {
        set({ demoAuthed: false, demoRole: null, programId: null });
      },

      toggleFlag: (flag) => {
        set((state) => ({
          flags: { ...state.flags, [flag]: !state.flags[flag] },
        }));
      },

      resetFlags: () => {
        set({ flags: DEFAULT_FLAGS });
      },

      addEvent: (event) => {
        const newEvent: Event = {
          ...event,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          events: [newEvent, ...state.events],
        }));
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        get().addEvent({
          type: 'task_created',
          playerId: task.playerId,
          playerName: task.playerName,
          description: `Task created: ${task.title}`,
          userId: task.assignedBy,
        });
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        }));
      },

      markPlayerReviewed: (playerId) => {
        const player = get().players.find((p) => p.id === playerId);
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, reviewed: true } : p
          ),
        }));
        if (player) {
          get().addEvent({
            type: 'player_reviewed',
            playerId,
            playerName: player.name,
            description: `${player.name} marked as reviewed`,
            userId: 'current',
          });
        }
      },

      simulatePortalEntry: () => {
        const usedNames = get().players.map((p) => p.name);
        const availableNames = ADDITIONAL_PLAYER_NAMES.filter(
          (n) => !usedNames.includes(n)
        );
        if (availableNames.length === 0) return;

        const name = availableNames[Math.floor(Math.random() * availableNames.length)];
        const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
        const positionGroup = ['QB', 'RB', 'WR', 'TE', 'OT', 'OG', 'C'].includes(position) ? 'Offense' : 'Defense';

        const newPlayer: Player = {
          id: generateId(),
          name,
          position,
          positionGroup,
          size: `6'${Math.floor(Math.random() * 4)}" ${180 + Math.floor(Math.random() * 80)} lbs`,
          eligibility: ['Junior', 'RS Junior', 'Senior', 'RS Sophomore'][Math.floor(Math.random() * 4)],
          origin,
          pool: 'Transfer',
          fitScore: 70 + Math.floor(Math.random() * 25),
          readinessScore: 70 + Math.floor(Math.random() * 25),
          riskScore: 5 + Math.floor(Math.random() * 20),
          reasons: ['New portal entry', 'Evaluation pending'],
          flags: [],
          filmLinks: [],
          reviewed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          players: [newPlayer, ...state.players],
        }));

        get().addEvent({
          type: 'portal_entry',
          playerId: newPlayer.id,
          playerName: newPlayer.name,
          description: `${newPlayer.name} (${position}) entered the transfer portal from ${origin}`,
        });
      },

      resetDemo: () => {
        set({
          flags: DEFAULT_FLAGS,
          players: SEED_PLAYERS,
          events: SEED_EVENTS,
          tasks: SEED_TASKS,
        });
      },
    }),
    {
      name: 'wonrecruit-storage',
    }
  )
);
