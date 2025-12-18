import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Player, DemoEvent, Task, Role, FeatureFlags, PositionGroup } from '@/types';
import { DEFAULT_FLAGS, DEMO_USERS, SEED_PLAYERS, SEED_EVENTS, SEED_TASKS, DEMO_PROGRAM_DNA, ADDITIONAL_PLAYER_NAMES, POSITIONS, ORIGINS } from '@/demo/demoData';

interface AppStore extends AppState {
  login: (role: Role, programId: string) => void;
  logout: () => void;
  toggleFlag: (flag: keyof FeatureFlags) => void;
  resetFlags: () => void;
  addEvent: (event: Omit<DemoEvent, 'id' | 'ts'>) => void;
  addTask: (task: Omit<Task, 'id' | 'ts'>) => void;
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
      programDNA: DEMO_PROGRAM_DNA,

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
        const newEvent: DemoEvent = {
          ...event,
          id: generateId(),
          ts: new Date().toISOString(),
        };
        set((state) => ({
          events: [newEvent, ...state.events],
        }));
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
          ts: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        const player = get().players.find(p => p.id === task.playerId);
        get().addEvent({
          type: 'TASK_CREATED',
          playerId: task.playerId,
          message: `Task created: ${task.title}${player ? ` for ${player.name}` : ''}`,
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
            type: 'PLAYER_REVIEWED',
            playerId,
            message: `${player.name} (${player.position}) marked as reviewed`,
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
        
        const positionGroupMap: Record<string, PositionGroup> = {
          'QB': 'QB', 'RB': 'RB', 'WR': 'WR', 'TE': 'TE',
          'OT': 'OL', 'OG': 'OL', 'C': 'OL',
          'EDGE': 'DL', 'DT': 'DL',
          'LB': 'LB',
          'CB': 'DB', 'S': 'DB',
        };

        const classYears: Array<"FR" | "SO" | "JR" | "SR" | "GR"> = ['SO', 'JR', 'SR', 'GR'];
        const readinessOpts: Array<"HIGH" | "MED" | "LOW"> = ['HIGH', 'MED', 'LOW'];
        const riskOpts: Array<"LOW" | "MED" | "HIGH"> = ['LOW', 'MED', 'HIGH'];

        const newPlayer: Player = {
          id: generateId(),
          name,
          position,
          positionGroup: positionGroupMap[position] || 'OL',
          height: `6'${Math.floor(Math.random() * 4)}"`,
          weight: String(180 + Math.floor(Math.random() * 80)),
          classYear: classYears[Math.floor(Math.random() * classYears.length)],
          eligibility: `${1 + Math.floor(Math.random() * 3)} years`,
          pool: 'TRANSFER_PORTAL',
          originSchool: `${origin} (FBS)`,
          hometown: ['Phoenix', 'Denver', 'Salt Lake City', 'San Diego', 'Sacramento'][Math.floor(Math.random() * 5)],
          state: ['AZ', 'CO', 'UT', 'CA', 'NV'][Math.floor(Math.random() * 5)],
          enteredAt: new Date().toISOString(),
          status: 'NEW',
          fitScore: 70 + Math.floor(Math.random() * 25),
          readiness: readinessOpts[Math.floor(Math.random() * readinessOpts.length)],
          risk: riskOpts[Math.floor(Math.random() * riskOpts.length)],
          reasons: ['New portal entry', 'Evaluation pending', 'Film review needed'],
          flags: ['Eligibility: Pending verification'],
          filmLinks: [{ label: 'Film pending', url: '#' }],
          reviewed: false,
        };

        set((state) => ({
          players: [newPlayer, ...state.players],
        }));

        get().addEvent({
          type: 'PORTAL_NEW',
          playerId: newPlayer.id,
          message: `New portal entry: ${newPlayer.name} (${position}) from ${origin} — matched UNLV needs.`,
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
