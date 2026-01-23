-- Create table to store synced episodes from GitHub
CREATE TABLE public.synced_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_filename TEXT NOT NULL UNIQUE,
  episode_title TEXT NOT NULL,
  episode_number INTEGER,
  guest_name TEXT,
  transcript_preview TEXT,
  matched_topic_ids TEXT[] DEFAULT '{}',
  match_scores JSONB DEFAULT '{}',
  published_date DATE,
  github_url TEXT,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_synced_episodes_topic_ids ON public.synced_episodes USING GIN(matched_topic_ids);
CREATE INDEX idx_synced_episodes_synced_at ON public.synced_episodes(synced_at DESC);

-- Enable RLS but allow public read access (this is public podcast data)
ALTER TABLE public.synced_episodes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read episodes (public data)
CREATE POLICY "Episodes are publicly readable" 
ON public.synced_episodes 
FOR SELECT 
USING (true);

-- Only service role can insert/update (edge function will use service role)
CREATE POLICY "Service role can manage episodes" 
ON public.synced_episodes 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create sync log table to track sync runs
CREATE TABLE public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL DEFAULT 'github_episodes',
  episodes_found INTEGER DEFAULT 0,
  episodes_added INTEGER DEFAULT 0,
  episodes_updated INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sync logs are publicly readable" 
ON public.sync_logs 
FOR SELECT 
USING (true);