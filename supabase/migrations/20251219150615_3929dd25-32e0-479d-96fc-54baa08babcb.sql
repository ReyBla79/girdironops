-- FILM ASSETS
CREATE TABLE public.film_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID,
  type TEXT, -- game, practice
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_seconds INT,
  confidence_score FLOAT,
  status TEXT
);

-- PLAYS
CREATE TABLE public.plays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id UUID REFERENCES public.film_assets(id) ON DELETE CASCADE,
  quarter INT,
  down INT,
  distance INT,
  yardline INT,
  play_type TEXT,
  confidence FLOAT
);

-- PLAY TAGS
CREATE TABLE public.play_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID REFERENCES public.plays(id) ON DELETE CASCADE,
  tag TEXT,
  source TEXT -- ai, coach
);

-- PLAYER TRACKING
CREATE TABLE public.player_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID REFERENCES public.plays(id) ON DELETE CASCADE,
  player_id UUID,
  avg_speed FLOAT,
  max_speed FLOAT,
  distance FLOAT,
  heatmap JSONB
);

-- PLAYBOOK CONCEPTS
CREATE TABLE public.playbook_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID,
  ai_label TEXT,
  coach_label TEXT
);

-- PLAYER DEVELOPMENT
CREATE TABLE public.player_development (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID,
  issue TEXT,
  confidence FLOAT,
  recommended_drill TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.film_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_development ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users (basic read access for now)
CREATE POLICY "Authenticated users can read film_assets" ON public.film_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert film_assets" ON public.film_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update film_assets" ON public.film_assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete film_assets" ON public.film_assets FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read plays" ON public.plays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert plays" ON public.plays FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update plays" ON public.plays FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete plays" ON public.plays FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read play_tags" ON public.play_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert play_tags" ON public.play_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update play_tags" ON public.play_tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete play_tags" ON public.play_tags FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read player_tracks" ON public.player_tracks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert player_tracks" ON public.player_tracks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update player_tracks" ON public.player_tracks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete player_tracks" ON public.player_tracks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read playbook_concepts" ON public.playbook_concepts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert playbook_concepts" ON public.playbook_concepts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update playbook_concepts" ON public.playbook_concepts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete playbook_concepts" ON public.playbook_concepts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read player_development" ON public.player_development FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert player_development" ON public.player_development FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update player_development" ON public.player_development FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete player_development" ON public.player_development FOR DELETE TO authenticated USING (true);