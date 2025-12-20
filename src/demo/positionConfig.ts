// Position filter options
export const POSITION_OPTIONS = [
  'ALL',
  'QB', 'RB', 'FB', 'WR', 'TE',
  'LT', 'LG', 'C', 'RG', 'RT', 'OL',
  'DE', 'DT', 'NT', 'EDGE', 'DL',
  'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB',
  'CB', 'NB', 'S', 'FS', 'SS', 'DB',
  'K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP',
];

// Position group options
export const POSITION_GROUP_OPTIONS = [
  'ALL',
  'OFFENSE', 'DEFENSE', 'SPECIAL_TEAMS',
  'SKILL', 'OL', 'DL', 'EDGE', 'LB', 'DB',
];

// Position group to positions mapping
export const POSITION_GROUP_MAP: Record<string, string[]> = {
  OFFENSE: ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  SKILL: ['QB', 'RB', 'FB', 'WR', 'TE'],
  OL: ['LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  DEFENSE: ['DE', 'DT', 'NT', 'EDGE', 'DL', 'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB', 'CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  DL: ['DT', 'NT', 'DL'],
  EDGE: ['DE', 'EDGE'],
  LB: ['ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB'],
  DB: ['CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  SPECIAL_TEAMS: ['K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP'],
};

// Helper to check if a position matches a filter (handles both individual positions and groups)
export function positionMatchesFilter(position: string, filter: string): boolean {
  if (filter === 'ALL') return true;
  
  // Check if filter is a position group
  if (POSITION_GROUP_MAP[filter]) {
    return POSITION_GROUP_MAP[filter].includes(position);
  }
  
  // Direct position match
  return position === filter;
}

// Get display label for a filter option
export function getPositionFilterLabel(value: string): string {
  if (value === 'ALL') return 'All Positions';
  if (POSITION_GROUP_MAP[value]) return `${value} (Group)`;
  return value;
}
