-- Create fb_scenarios table
CREATE TABLE public.fb_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  policy_id UUID REFERENCES public.fb_revshare_policies(id),
  name TEXT NOT NULL DEFAULT 'New Scenario',
  notes TEXT,
  pool_override NUMERIC,
  reserved_override NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fb_scenario_mutations table
CREATE TABLE public.fb_scenario_mutations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES public.fb_scenarios(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fb_scenario_results table
CREATE TABLE public.fb_scenario_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES public.fb_scenarios(id) ON DELETE CASCADE UNIQUE,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  policy_id UUID REFERENCES public.fb_revshare_policies(id),
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.fb_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_scenario_mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_scenario_results ENABLE ROW LEVEL SECURITY;

-- Policies for fb_scenarios
CREATE POLICY "Authenticated users can read fb_scenarios" ON public.fb_scenarios FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert fb_scenarios" ON public.fb_scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_scenarios" ON public.fb_scenarios FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete fb_scenarios" ON public.fb_scenarios FOR DELETE USING (true);

-- Policies for fb_scenario_mutations
CREATE POLICY "Authenticated users can read fb_scenario_mutations" ON public.fb_scenario_mutations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert fb_scenario_mutations" ON public.fb_scenario_mutations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_scenario_mutations" ON public.fb_scenario_mutations FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete fb_scenario_mutations" ON public.fb_scenario_mutations FOR DELETE USING (true);

-- Policies for fb_scenario_results
CREATE POLICY "Authenticated users can read fb_scenario_results" ON public.fb_scenario_results FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert fb_scenario_results" ON public.fb_scenario_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update fb_scenario_results" ON public.fb_scenario_results FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete fb_scenario_results" ON public.fb_scenario_results FOR DELETE USING (true);