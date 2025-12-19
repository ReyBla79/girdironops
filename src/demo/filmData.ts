import type { 
  FilmAsset, 
  FilmPlayer, 
  Play, 
  PlayTag, 
  TrackingData, 
  AssignmentInference, 
  FilmAnalytics, 
  GeneratedReport, 
  PlayerDevelopment,
  OpsGmFilmContext
} from '@/types/film';

export const SEED_FILM_ASSETS: FilmAsset[] = [
  {
    filmId: "film_001",
    title: "UNLV Demo Game — Week 6 (Sideline + Endzone)",
    type: "game",
    opponent: "UNLV Opponent (Demo)",
    date: "2025-10-11",
    angles: ["sideline", "endzone"],
    status: "Processed",
    confidence: "High",
    playsDetected: 68
  },
  {
    filmId: "film_002",
    title: "Practice — Inside Run + 7on7 (Demo)",
    type: "practice",
    opponent: "N/A",
    date: "2025-10-14",
    angles: ["sideline"],
    status: "Processed",
    confidence: "Medium",
    playsDetected: 42
  }
];

export const SEED_FILM_PLAYERS: FilmPlayer[] = [
  { playerId: "p_qb1", name: "QB1 — J. Carter", pos: "QB", year: "JR" },
  { playerId: "p_rb1", name: "RB1 — M. Fields", pos: "RB", year: "SO" },
  { playerId: "p_wr1", name: "WR1 — D. Lane", pos: "WR", year: "SR" },
  { playerId: "p_wr2", name: "WR2 — K. Brooks", pos: "WR", year: "JR" },
  { playerId: "p_te1", name: "TE1 — A. Rivers", pos: "TE", year: "SO" },
  { playerId: "p_lt", name: "LT — C. Hayes", pos: "OL", year: "SR" },
  { playerId: "p_lg", name: "LG — T. Mason", pos: "OL", year: "JR" },
  { playerId: "p_c", name: "C — P. Young", pos: "OL", year: "JR" },
  { playerId: "p_rg", name: "RG — E. Stone", pos: "OL", year: "SO" },
  { playerId: "p_rt", name: "RT — S. King", pos: "OL", year: "SR" },
  { playerId: "p_cb1", name: "CB1 — L. Grant", pos: "DB", year: "SR" },
  { playerId: "p_s1", name: "S1 — B. Cole", pos: "DB", year: "JR" },
  { playerId: "p_lb1", name: "LB1 — R. James", pos: "LB", year: "SR" },
  { playerId: "p_de1", name: "DE1 — N. Wade", pos: "DL", year: "JR" }
];

export const SEED_PLAYS: Play[] = [
  {
    playId: "play_0001",
    filmId: "film_001",
    clock: "14:22",
    quarter: 1,
    down: 1,
    distance: 10,
    yardline: 25,
    aiPlayType: "RUN",
    aiConcept: "Inside Zone",
    formation: "11P Trips",
    motion: "None",
    defShell: "Cover 3",
    pressure: "None",
    confidence: 0.88,
    result: { type: "Rush", yards: 6 }
  },
  {
    playId: "play_0002",
    filmId: "film_001",
    clock: "13:41",
    quarter: 1,
    down: 2,
    distance: 4,
    yardline: 31,
    aiPlayType: "PASS",
    aiConcept: "Quick Game — Slant/Flat",
    formation: "11P Doubles",
    motion: "Short Motion",
    defShell: "Cover 2",
    pressure: "4-man",
    confidence: 0.84,
    result: { type: "Pass", yards: 8 }
  },
  {
    playId: "play_0003",
    filmId: "film_001",
    clock: "11:09",
    quarter: 1,
    down: 3,
    distance: 7,
    yardline: 42,
    aiPlayType: "PASS",
    aiConcept: "Mesh",
    formation: "10P Trips",
    motion: "Jet",
    defShell: "Cover 1",
    pressure: "5-man",
    confidence: 0.79,
    result: { type: "Pass", yards: 5 }
  },
  {
    playId: "play_0004",
    filmId: "film_001",
    clock: "09:52",
    quarter: 2,
    down: 1,
    distance: 10,
    yardline: 48,
    aiPlayType: "RPO",
    aiConcept: "RPO — Glance",
    formation: "11P Trips",
    motion: "None",
    defShell: "Cover 3",
    pressure: "None",
    confidence: 0.76,
    result: { type: "Pass", yards: 12 }
  },
  {
    playId: "play_0005",
    filmId: "film_001",
    clock: "06:18",
    quarter: 3,
    down: 4,
    distance: 2,
    yardline: 39,
    aiPlayType: "ST",
    aiConcept: "Punt",
    formation: "Punt",
    motion: "None",
    defShell: "ST",
    pressure: "ST",
    confidence: 0.93,
    result: { type: "Punt", yards: 42 }
  }
];

export const SEED_PLAY_TAGS: Record<string, PlayTag[]> = {
  play_0001: [
    { tag: "Run: Inside Zone", source: "ai" },
    { tag: "Front: Even", source: "ai" },
    { tag: "RunDir: A-gap", source: "ai" }
  ],
  play_0002: [
    { tag: "Pass: Quick Game", source: "ai" },
    { tag: "Concept: Slant/Flat", source: "ai" },
    { tag: "Shell: Cover 2", source: "ai" }
  ],
  play_0003: [
    { tag: "Pass: Dropback", source: "ai" },
    { tag: "Concept: Mesh", source: "ai" },
    { tag: "Pressure: 5-man", source: "ai" }
  ],
  play_0004: [
    { tag: "RPO", source: "ai" },
    { tag: "Concept: Glance", source: "ai" },
    { tag: "Shell: Cover 3", source: "ai" }
  ],
  play_0005: [
    { tag: "Special Teams", source: "ai" },
    { tag: "Punt", source: "ai" }
  ]
};

export const SEED_TRACKING_BY_PLAY: Record<string, TrackingData> = {
  play_0001: {
    confidence: 0.82,
    summary: {
      teamMaxSpeedYdsPerSec: 9.4,
      rbMaxSpeedYdsPerSec: 8.8,
      closingSpeedTopDefender: 9.1,
      avgSpacingYards: 5.6
    },
    players: [
      { playerId: "p_rb1", maxSpeed: 8.8, distance: 22.4, avgSpeed: 6.1 },
      { playerId: "p_qb1", maxSpeed: 6.4, distance: 12.3, avgSpeed: 4.2 },
      { playerId: "p_lb1", maxSpeed: 9.1, distance: 19.5, avgSpeed: 6.5 }
    ],
    heatmaps: {
      runDirection: [
        [0, 2, 4, 3],
        [1, 4, 6, 4],
        [0, 2, 5, 2],
        [0, 1, 2, 1]
      ]
    }
  },
  play_0003: {
    confidence: 0.74,
    summary: {
      qbTimeToThrowSec: 2.55,
      wr1TopSpeedYdsPerSec: 9.2,
      separationAtTargetYards: 1.1
    },
    players: [
      { playerId: "p_qb1", maxSpeed: 6.8, distance: 9.7, avgSpeed: 3.8 },
      { playerId: "p_wr1", maxSpeed: 9.2, distance: 28.9, avgSpeed: 7.0 },
      { playerId: "p_cb1", maxSpeed: 9.0, distance: 27.1, avgSpeed: 6.6 }
    ]
  }
};

export const SEED_ASSIGNMENT_INFERENCE_BY_PLAY: Record<string, AssignmentInference> = {
  play_0003: {
    confidence: 0.62,
    notes: [
      "Likely man-free with RB check release.",
      "Potential bust: LB late to shallow cross — window opens at 2.2s."
    ],
    flags: [
      { type: "BUST_RISK", playerId: "p_lb1", reason: "Late leverage to crosser" }
    ]
  }
};

export const SEED_AI_NOTES_BY_PLAY: Record<string, string[]> = {
  play_0001: [
    "Inside Zone vs Even front. RB pressed A-gap then bounced late.",
    "OL created initial crease; second-level fit closes at ~1.8s."
  ],
  play_0003: [
    "Mesh vs Cover 1 pressure. Primary read shallow cross.",
    "Pressure arrives early; check protection may be needed on long-yardage."
  ]
};

export const SEED_RECOMMENDED_ACTIONS_BY_PLAY: Record<string, string[]> = {
  play_0001: [
    "Clip for RB: emphasize faster decision at first cut.",
    "Clip for OL: highlight climb timing to LB."
  ],
  play_0003: [
    "Add protection check vs 5-man in 3rd & 6–9.",
    "Coach LB leverage rules on shallow cross."
  ]
};

export const SEED_FILM_ANALYTICS: FilmAnalytics = {
  runPass: [
    { label: "Run", value: 46 },
    { label: "Pass", value: 44 },
    { label: "RPO", value: 6 },
    { label: "ST", value: 4 }
  ],
  conceptFreq: [
    { label: "Inside Zone", value: 14 },
    { label: "Counter", value: 7 },
    { label: "Quick Game", value: 11 },
    { label: "Mesh", value: 6 },
    { label: "Flood", value: 5 },
    { label: "Screens", value: 8 }
  ],
  defShells: [
    { label: "Cover 3", value: 22 },
    { label: "Cover 2", value: 14 },
    { label: "Cover 1", value: 18 },
    { label: "Quarters", value: 10 },
    { label: "Pressure/Zero", value: 4 }
  ],
  runDirectionHeat: [
    [1, 3, 6, 4],
    [2, 5, 8, 6],
    [1, 4, 7, 4],
    [0, 2, 4, 2]
  ],
  targetZoneHeat: [
    [0, 1, 2, 1],
    [1, 4, 6, 3],
    [1, 5, 8, 4],
    [0, 2, 4, 2]
  ]
};

export const SEED_REPORT_TEMPLATES = {
  demoReport: {
    title: "Opponent Scout Report (Demo)",
    sections: [
      {
        heading: "Top Tendencies",
        bullets: [
          "1st Down: Inside Zone + RPO Glance are top calls.",
          "3rd & 6–9: Mesh + quick game, pressure increases faced.",
          "Red Zone: Heavy 11P, quick throws to flats."
        ]
      },
      {
        heading: "Defensive Looks Faced",
        bullets: [
          "Cover 3 most common on early downs.",
          "Cover 1 + pressure spikes on 3rd & medium."
        ]
      },
      {
        heading: "Coach Actions",
        bullets: [
          "Build cutups: Inside Zone vs Even + Mesh vs Pressure.",
          "Add protection check vs 5-man in long-yardage."
        ]
      }
    ]
  } as GeneratedReport
};

export const OPPONENT_OPTIONS = ["UNLV Opponent (Demo)"];

export const PLAY_TYPE_OPTIONS = ["ALL", "RUN", "PASS", "RPO", "PA", "SCREEN", "ST"];

export const SEED_POSTERS: Record<string, string> = {
  play_0001: "https://placehold.co/1200x675/png?text=Play+0001+Demo+Frame",
  play_0002: "https://placehold.co/1200x675/png?text=Play+0002+Demo+Frame",
  play_0003: "https://placehold.co/1200x675/png?text=Play+0003+Demo+Frame",
  play_0004: "https://placehold.co/1200x675/png?text=Play+0004+Demo+Frame",
  play_0005: "https://placehold.co/1200x675/png?text=Play+0005+Demo+Frame"
};

export const SEED_OPS_GM_FILM_CONTEXT: OpsGmFilmContext = {
  note: "Demo context for Ops GM. In production this is assembled from film, plays, tags, tracking, and analytics.",
  filmAssetsRef: "store.filmAssets",
  playsRef: "store.plays",
  analyticsRef: "store.analytics",
  sampleInsights: [
    "3rd down pressure increases; mesh and quick game appear frequently.",
    "Inside zone is top run concept; success depends on LB fit timing."
  ]
};

export const SEED_PLAYER_DEVELOPMENT: PlayerDevelopment[] = [
  {
    playerId: "p_rb1",
    name: "M. Fields (RB)",
    position: "RB",
    weeklyTrend: "UP",
    issues: ["First cut decisiveness", "Pass pro recognition"],
    drills: ["Zone read drill", "Blitz pickup circuit"],
    progressScore: 72
  },
  {
    playerId: "p_wr1",
    name: "D. Lane (WR)",
    position: "WR",
    weeklyTrend: "FLAT",
    issues: ["Route stem consistency", "Contested catch rate"],
    drills: ["Stem drill ladder", "High-point ball work"],
    progressScore: 68
  },
  {
    playerId: "p_lb1",
    name: "R. James (LB)",
    position: "LB",
    weeklyTrend: "DOWN",
    issues: ["Mesh coverage leverage", "Zone drop depth"],
    drills: ["Man-to-man leverage drill", "Drop depth reads"],
    progressScore: 61
  }
];

// Helper function to get play with all enriched data
export const getEnrichedPlay = (playId: string) => {
  const play = SEED_PLAYS.find(p => p.playId === playId);
  if (!play) return null;
  
  return {
    ...play,
    tags: SEED_PLAY_TAGS[playId] || [],
    tracking: SEED_TRACKING_BY_PLAY[playId],
    assignmentInference: SEED_ASSIGNMENT_INFERENCE_BY_PLAY[playId],
    aiNotes: SEED_AI_NOTES_BY_PLAY[playId] || [],
    recommendedActions: SEED_RECOMMENDED_ACTIONS_BY_PLAY[playId] || [],
    poster: SEED_POSTERS[playId]
  };
};

// Helper to get all plays for a film
export const getPlaysForFilm = (filmId: string) => {
  return SEED_PLAYS.filter(p => p.filmId === filmId).map(p => getEnrichedPlay(p.playId));
};
