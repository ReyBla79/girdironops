import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { AppState, Player, DemoEvent, Task, Role, FeatureFlags, PositionGroup, ContactAccessRequest, OutreachLog, UIMode, WowScenario, RosterPlayer, PipelineTier, FilmUIState } from '@/types';
import type { BeforeAfterState } from '@/types/beforeAfter';
import type { FilmTimelineFilters, PlayOverlays } from '@/types/film';
import { DEFAULT_FLAGS, DEMO_USERS, SEED_PLAYERS, SEED_EVENTS, SEED_TASKS, DEMO_PROGRAM_DNA, ADDITIONAL_PLAYER_NAMES, POSITIONS, ORIGINS } from '@/demo/demoData';
import { SEED_ROSTER, SEED_NEEDS, SEED_BUDGET, ROSTER_META, SEED_FORECAST, SEED_RISK_HEATMAP } from '@/demo/rosterData';
import { SEED_COACHES } from '@/demo/coachData';
import { CALCULATOR_CONFIG } from '@/demo/calculatorConfig';
import { SEED_REPORT_TEMPLATES } from '@/demo/filmData';
import {
  findReplacementCandidate,
  calculatePlayerCost,
  generateBeforeAfterSummary
} from '@/lib/budgetCalculator';

// Default film UI state
const DEFAULT_FILM_UI: FilmUIState = {
  filmTimelineFilters: {
    quarter: 'ALL',
    down: 'ALL',
    playType: 'ALL',
    concept: '',
  },
  cutupPlays: [],
  generatedReport: null,
  selectedFilmId: null,
  selectedPlayId: null,
  playOverlays: {
    showTracks: false,
    showSpeedTrails: false,
    showAssignments: false,
  },
};
const DEFAULT_WOW_SCENARIO: WowScenario = {
  id: 'wow1',
  label: 'One-Click WOW: Fix OL Depth + Keep Budget Clean',
  recruitPlayerId: 'p1',
  targetNeedId: 'n1',
  suggestReplacementRule: {
    positionGroup: 'OL',
    prefer: 'GRADUATING_OR_LOW_GRADE_DEPTH',
    fallback: 'LOWEST_GRADE_IN_GROUP'
  }
};

interface AppStore extends AppState {
  login: (role: Role, programId: string) => void;
  logout: () => void;
  toggleFlag: (flag: keyof FeatureFlags) => void;
  resetFlags: () => void;
  setTier: (tier: PipelineTier) => void;
  addEvent: (event: Omit<DemoEvent, 'id' | 'ts'>) => void;
  addTask: (task: Omit<Task, 'id' | 'ts'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  markPlayerReviewed: (playerId: string) => void;
  simulatePortalEntry: () => void;
  resetDemo: () => void;
  setSelectedNeed: (needId: string | null) => void;
  selectProspect: (playerId: string | null) => void;
  createContactAccessRequest: (coachId: string) => void;
  logOutreach: (coachId: string, mode: 'email' | 'sms', content: string) => void;
  setUIMode: (mode: UIMode) => void;
  runWowScenario: () => void;
  openWowModal: () => void;
  closeWowModal: () => void;
  applySimulation: () => void;
  undoSimulation: () => void;
  // Film Intelligence actions
  addPlayToCutup: (playId: string) => void;
  removePlayFromCutup: (playId: string) => void;
  clearCutup: () => void;
  setFilmTimelineFilters: (filters: Partial<FilmTimelineFilters>) => void;
  generateScoutReportDemo: () => void;
  clearGeneratedReport: () => void;
  setSelectedFilm: (filmId: string | null) => void;
  setSelectedPlay: (playId: string | null) => void;
  setPlayOverlays: (overlays: Partial<PlayOverlays>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      demoAuthed: false,
      demoRole: null,
      programId: null,
      flags: DEFAULT_FLAGS,
      tiers: {
        tier: 'CORE' as PipelineTier,
        tierOrder: ['CORE', 'GM', 'ELITE'] as PipelineTier[],
      },
      players: SEED_PLAYERS,
      events: SEED_EVENTS,
      tasks: SEED_TASKS,
      userList: DEMO_USERS,
      programDNA: DEMO_PROGRAM_DNA,
      roster: SEED_ROSTER,
      rosterMeta: ROSTER_META,
      needs: SEED_NEEDS,
      budget: SEED_BUDGET,
      riskHeatmap: SEED_RISK_HEATMAP,
      selectedNeedId: null,
      selectedProspectId: null,
      coaches: SEED_COACHES,
      contactAccessRequests: [],
      outreachLogs: [],
      forecast: SEED_FORECAST,
      uiMode: 'COACH',
      wowScenario: DEFAULT_WOW_SCENARIO,
      wowModalOpen: false,
      beforeAfter: null,
      filmUI: DEFAULT_FILM_UI,

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

      setTier: (tier) => {
        set((state) => ({
          tiers: { ...state.tiers, tier },
          flags: { ...state.flags, tier },
        }));
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
          roster: SEED_ROSTER,
          rosterMeta: ROSTER_META,
          needs: SEED_NEEDS,
          budget: SEED_BUDGET,
          riskHeatmap: SEED_RISK_HEATMAP,
          selectedNeedId: null,
          selectedProspectId: null,
          coaches: SEED_COACHES,
          contactAccessRequests: [],
          outreachLogs: [],
          forecast: SEED_FORECAST,
          uiMode: 'COACH',
          wowModalOpen: false,
          beforeAfter: null,
          filmUI: DEFAULT_FILM_UI,
        });
      },

      setSelectedNeed: (needId) => {
        set({ selectedNeedId: needId });
      },

      selectProspect: (playerId) => {
        set({ selectedProspectId: playerId });
      },

      createContactAccessRequest: (coachId) => {
        const coach = get().coaches.find(c => c.id === coachId);
        const newRequest: ContactAccessRequest = {
          id: generateId(),
          coachId,
          requesterId: 'demo-user',
          ts: new Date().toISOString(),
          status: 'PENDING',
        };
        set((state) => ({
          contactAccessRequests: [...state.contactAccessRequests, newRequest],
        }));
        get().addEvent({
          type: 'NETWORK_ACCESS_REQUESTED',
          coachId,
          message: `Contact access requested for ${coach?.name || 'Unknown Coach'}`,
        });
      },

      logOutreach: (coachId, mode, content) => {
        const coach = get().coaches.find(c => c.id === coachId);
        const newLog: OutreachLog = {
          id: generateId(),
          coachId,
          mode,
          ts: new Date().toISOString(),
          draftContent: content,
        };
        set((state) => ({
          outreachLogs: [...state.outreachLogs, newLog],
        }));
        get().addEvent({
          type: 'OUTREACH_DRAFTED',
          coachId,
          message: `${mode.toUpperCase()} outreach drafted for ${coach?.name || 'Unknown Coach'}`,
        });
      },

      setUIMode: (mode) => {
        set({ uiMode: mode });
      },

      runWowScenario: () => {
        const state = get();
        const { roster, players } = state;
        const wowConfig = CALCULATOR_CONFIG.wowScenario;
        
        // 1. Find the recruit (p1) from players
        const recruit = players.find(p => p.id === wowConfig.recruitPlayerId);
        if (!recruit) return;
        
        // 2. Find replacement candidate using deterministic logic
        const replacement = findReplacementCandidate(roster, wowConfig.targetNeedPositionGroup);
        if (!replacement) return;
        
        // 3. Create simulation roster with simRemoved patch applied to replacement
        const rosterBefore = roster.map(p => ({ 
          ...p, 
          simRemoved: false, 
          simAdded: false,
          simScenarioId: undefined,
          simRemovalReason: undefined
        }));
        const rosterAfter: RosterPlayer[] = roster.map(p => 
          p.id === replacement.id 
            ? { 
                ...p, 
                simRemoved: true,
                simScenarioId: 'wow1',
                simRemovalReason: 'Replacement suggested to maintain OL headcount and budget runway.'
              } 
            : { ...p }
        );
        
        // 4. Create simulated recruit as roster player
        // DETERMINISTIC: Fixed values for consistent demo WOW scenario output
        const recruitAsRoster: RosterPlayer = {
          id: 'sim_p1',
          name: 'Malik Neighbors',
          position: 'OT',
          positionGroup: 'OL',
          year: 'JR',
          gradYear: 2027,
          eligibilityRemaining: 2,
          revShareBand: 'HIGH',
          estimatedCost: 127000, // Fixed deterministic cost
          role: 'STARTER',
          snapsShare: 0,
          performanceGrade: 78,
          risk: { injury: 18, transfer: 22, academics: 6 },
          riskScore: 20,
          riskColor: 'GREEN',
          simAdded: true,
          simScenarioId: 'wow1'
        };
        
        rosterAfter.push(recruitAsRoster);
        
        // 5. Generate full BeforeAfterState using template
        const beforeAfterState = generateBeforeAfterSummary({
          recruit,
          replacement,
          rosterBefore,
          rosterAfter
        });

        set({ beforeAfter: beforeAfterState });
      },

      openWowModal: () => {
        set({ wowModalOpen: true });
      },

      closeWowModal: () => {
        set({ wowModalOpen: false });
      },

      applySimulation: () => {
        // In demo, just close modal and show success
        set({ wowModalOpen: false });
      },

      undoSimulation: () => {
        set({ beforeAfter: null, wowModalOpen: false });
      },

      // Film Intelligence actions
      addPlayToCutup: (playId) => {
        const state = get();
        if (state.filmUI.cutupPlays.includes(playId)) {
          toast.info('Play already in cutup.');
          return;
        }
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            cutupPlays: [...state.filmUI.cutupPlays, playId],
          },
        }));
        toast.success('Added play to cutup (demo).');
      },

      removePlayFromCutup: (playId) => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            cutupPlays: state.filmUI.cutupPlays.filter((id) => id !== playId),
          },
        }));
        toast.info('Removed play from cutup.');
      },

      clearCutup: () => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            cutupPlays: [],
          },
        }));
        toast.info('Cutup cleared.');
      },

      setFilmTimelineFilters: (filters) => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            filmTimelineFilters: {
              ...state.filmUI.filmTimelineFilters,
              ...filters,
            },
          },
        }));
      },

      generateScoutReportDemo: () => {
        const template = SEED_REPORT_TEMPLATES.demoReport || {
          title: 'Opponent Scout Report (Demo)',
          sections: [{ heading: 'No template found', bullets: ['Add store.reportTemplates.demoReport to seed data.'] }],
        };
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            generatedReport: template,
          },
        }));
        toast.success('Scout report generated (demo).');
      },

      clearGeneratedReport: () => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            generatedReport: null,
          },
        }));
      },

      setSelectedFilm: (filmId) => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            selectedFilmId: filmId,
            filmTimelineFilters: state.filmUI.filmTimelineFilters || {
              quarter: 'ALL',
              down: 'ALL',
              playType: 'ALL',
              concept: '',
            },
          },
        }));
        toast.info(filmId ? `Selected film: ${filmId}` : 'Film cleared.');
      },

      setSelectedPlay: (playId) => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            selectedPlayId: playId,
            playOverlays: state.filmUI.playOverlays || {
              showTracks: false,
              showSpeedTrails: false,
              showAssignments: false,
            },
          },
        }));
        toast.info(playId ? `Selected play: ${playId}` : 'Play cleared.');
      },

      setPlayOverlays: (overlays) => {
        set((state) => ({
          filmUI: {
            ...state.filmUI,
            playOverlays: {
              ...state.filmUI.playOverlays,
              ...overlays,
            },
          },
        }));
      },
    }),
    {
      name: 'gridironops-storage',
      version: 2,
      migrate: (persistedState: any) => {
        // Keep user state, but ensure seeded player film links stay in sync across builds.
        try {
          const seedP1 = SEED_PLAYERS.find((p) => p.id === 'p1');
          if (seedP1 && Array.isArray(persistedState?.players)) {
            persistedState.players = persistedState.players.map((p: any) =>
              p?.id === 'p1' ? { ...p, filmLinks: seedP1.filmLinks } : p
            );
          }
        } catch {
          // ignore migration errors
        }
        return persistedState;
      },
    }
  )
);
