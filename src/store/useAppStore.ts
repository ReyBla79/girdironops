import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Player, DemoEvent, Task, Role, FeatureFlags, PositionGroup, ContactAccessRequest, OutreachLog, UIMode, BeforeAfterState, WowScenario, RosterPlayer } from '@/types';
import { DEFAULT_FLAGS, DEMO_USERS, SEED_PLAYERS, SEED_EVENTS, SEED_TASKS, DEMO_PROGRAM_DNA, ADDITIONAL_PLAYER_NAMES, POSITIONS, ORIGINS } from '@/demo/demoData';
import { SEED_ROSTER, SEED_NEEDS, SEED_BUDGET, ROSTER_META, SEED_FORECAST, SEED_RISK_HEATMAP } from '@/demo/rosterData';
import { SEED_COACHES } from '@/demo/coachData';
import { CALCULATOR_CONFIG } from '@/demo/calculatorConfig';
import {
  calculateRemainingBudget,
  calculateAllocationsByGroup,
  calculateFullForecast,
  calculateRiskHeatmap,
  findReplacementCandidate,
  calculatePlayerCost,
  generateDecisionSummary
} from '@/lib/budgetCalculator';
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
        
        // 3. Create simulation roster with simRemoved/simAdded flags
        const simRoster: RosterPlayer[] = roster.map(p => 
          p.id === replacement.id ? { ...p, simRemoved: true } : p
        );
        
        // 4. Create simulated recruit as roster player
        const recruitAsRoster: RosterPlayer = {
          id: `sim_${recruit.id}`,
          name: recruit.name,
          position: recruit.position,
          positionGroup: recruit.positionGroup,
          year: recruit.classYear,
          gradYear: CALCULATOR_CONFIG.asOfYear + (recruit.classYear === 'SR' ? 1 : recruit.classYear === 'JR' ? 2 : recruit.classYear === 'SO' ? 3 : 4),
          eligibilityRemaining: parseInt(recruit.eligibility) || 2,
          nilBand: 'HIGH',
          estimatedCost: recruit.nilRange?.mid || calculatePlayerCost({
            nilBand: 'HIGH',
            role: wowConfig.assumedRecruitRole,
            positionGroup: recruit.positionGroup
          }),
          role: wowConfig.assumedRecruitRole,
          snapsShare: 70,
          performanceGrade: 80,
          risk: { injury: 20, transfer: 25, academics: 8 },
          riskScore: 22,
          riskColor: 'GREEN',
          simAdded: true
        };
        
        simRoster.push(recruitAsRoster);
        
        // 5. Calculate BEFORE state (original roster)
        const beforeBudget = calculateRemainingBudget(roster);
        const beforeAllocations = calculateAllocationsByGroup(roster);
        const beforeForecast = calculateFullForecast(roster);
        const beforeHeatmap = calculateRiskHeatmap(roster);
        
        // 6. Calculate AFTER state (simulated roster)
        const afterBudget = calculateRemainingBudget(simRoster);
        const afterAllocations = calculateAllocationsByGroup(simRoster);
        const afterForecast = calculateFullForecast(simRoster);
        const afterHeatmap = calculateRiskHeatmap(simRoster);
        
        // 7. Calculate deltas
        const beforeOLAlloc = beforeAllocations[wowConfig.targetNeedPositionGroup];
        const afterOLAlloc = afterAllocations[wowConfig.targetNeedPositionGroup];
        const beforeOLPercent = beforeOLAlloc / beforeBudget.allocated;
        const afterOLPercent = afterOLAlloc / afterBudget.allocated;
        
        // 8. Generate decision summary
        const summary = generateDecisionSummary(
          beforeBudget.remaining,
          afterBudget.remaining,
          recruit.name,
          replacement.name,
          wowConfig.targetNeedPositionGroup,
          beforeForecast.year1.gapsByGroup,
          afterForecast.year1.gapsByGroup,
          beforeOLPercent,
          afterOLPercent
        );
        
        // 9. Build BeforeAfterState
        const beforeAfterState: BeforeAfterState = {
          budget: {
            before: { spent: beforeBudget.allocated, remaining: beforeBudget.remaining },
            after: { spent: afterBudget.allocated, remaining: afterBudget.remaining },
            delta: afterBudget.allocated - beforeBudget.allocated
          },
          allocations: (['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'ST'] as PositionGroup[]).map(group => ({
            positionGroup: group,
            before: beforeAllocations[group],
            after: afterAllocations[group]
          })),
          forecast: {
            year1Delta: afterForecast.year1.projectedSpend - beforeForecast.year1.projectedSpend,
            year2Delta: afterForecast.year2.projectedSpend - beforeForecast.year2.projectedSpend,
            year3Delta: afterForecast.year3.projectedSpend - beforeForecast.year3.projectedSpend
          },
          riskHeatmap: (['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'ST'] as PositionGroup[]).map(group => {
            const beforeRow = beforeHeatmap.find(r => r.positionGroup === group);
            const afterRow = afterHeatmap.find(r => r.positionGroup === group);
            return {
              positionGroup: group,
              beforeYellow: beforeRow?.YELLOW || 0,
              afterYellow: afterRow?.YELLOW || 0
            };
          }),
          summary
        };

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
    }),
    {
      name: 'wonrecruit-storage',
    }
  )
);
