-- Programs / Seasons (reuse if already created)

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  label text not null,
  created_at timestamptz default now(),
  unique(program_id, label)
);

-- Football roster

create table if not exists fb_players (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  external_ref text,
  first_name text not null,
  last_name text not null,
  position_group text not null,   -- QB/RB/WR/TE/OL/DL/LB/DB/ST
  position text not null,         -- QB, RB, WR, LT, RG, EDGE, CB, S, K, P, LS etc.
  class_year text,                -- Fr/So/Jr/Sr
  height_inches int,
  weight_lbs int,
  status text not null default 'ACTIVE', -- ACTIVE/INJURED/REDSHIRT/LEFT
  created_at timestamptz default now()
);

-- Budget pool

create table if not exists fb_revshare_pools (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  pool_amount numeric(12,2) not null,
  reserved_amount numeric(12,2) not null default 0,
  created_at timestamptz default now(),
  unique(program_id, season_id)
);

-- Policy (weights + guardrails + position multipliers)

create table if not exists fb_revshare_policies (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  name text not null default 'Default FB Policy',
  weights jsonb not null,
  guardrails jsonb not null,
  position_multipliers jsonb not null, -- QB/OT/EDGE/CB etc.
  is_active boolean not null default true,
  version int not null default 1,
  created_at timestamptz default now()
);

-- Performance inputs (V1: simple season aggregates)

create table if not exists fb_player_season_usage (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references fb_players(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  games_played int default 0,
  snaps int default 0,
  snaps_offense int default 0,
  snaps_defense int default 0,
  snaps_st int default 0,
  leverage_snaps int default 0,   -- 3rd/4th down, red zone, 1-score, late game
  created_at timestamptz default now(),
  unique(player_id, season_id)
);

-- V1 "impact grade" input (KISS: staff grade or imported grade)

create table if not exists fb_player_grades (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references fb_players(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  overall_grade numeric(5,2) default 0,   -- 0-100
  unit_grade numeric(5,2) default 0,      -- optional
  notes text,
  created_at timestamptz default now(),
  unique(player_id, season_id)
);

-- Depth chart / scarcity

create table if not exists fb_player_roles (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references fb_players(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  role text not null default 'ROTATION', -- STARTER/ROTATION/BACKUP/DEVELOPMENT
  depth_rank int default 2,              -- 1 starter, 2 backup, etc.
  replacement_risk text not null default 'MED', -- LOW/MED/HIGH
  created_at timestamptz default now(),
  unique(player_id, season_id)
);

-- Engine outputs

create table if not exists fb_value_snapshots (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  season_id uuid references seasons(id) on delete cascade,
  policy_id uuid references fb_revshare_policies(id) on delete cascade,
  player_id uuid references fb_players(id) on delete cascade,
  total_score numeric(12,6) not null,
  share_pct numeric(7,4) not null,
  dollars_low numeric(12,2) not null,
  dollars_mid numeric(12,2) not null,
  dollars_high numeric(12,2) not null,
  confidence numeric(5,2) not null,
  rationale jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_revshare_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_revshare_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_player_season_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_player_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_player_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fb_value_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users (demo/prototype - full access for authenticated users)
CREATE POLICY "Authenticated users can read programs" ON programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert programs" ON programs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update programs" ON programs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete programs" ON programs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seasons" ON seasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert seasons" ON seasons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update seasons" ON seasons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete seasons" ON seasons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_players" ON fb_players FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_players" ON fb_players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_players" ON fb_players FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_players" ON fb_players FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_revshare_pools" ON fb_revshare_pools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_revshare_pools" ON fb_revshare_pools FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_revshare_pools" ON fb_revshare_pools FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_revshare_pools" ON fb_revshare_pools FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_revshare_policies" ON fb_revshare_policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_revshare_policies" ON fb_revshare_policies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_revshare_policies" ON fb_revshare_policies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_revshare_policies" ON fb_revshare_policies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_player_season_usage" ON fb_player_season_usage FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_player_season_usage" ON fb_player_season_usage FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_player_season_usage" ON fb_player_season_usage FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_player_season_usage" ON fb_player_season_usage FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_player_grades" ON fb_player_grades FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_player_grades" ON fb_player_grades FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_player_grades" ON fb_player_grades FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_player_grades" ON fb_player_grades FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_player_roles" ON fb_player_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_player_roles" ON fb_player_roles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_player_roles" ON fb_player_roles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_player_roles" ON fb_player_roles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fb_value_snapshots" ON fb_value_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fb_value_snapshots" ON fb_value_snapshots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_value_snapshots" ON fb_value_snapshots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete fb_value_snapshots" ON fb_value_snapshots FOR DELETE TO authenticated USING (true);