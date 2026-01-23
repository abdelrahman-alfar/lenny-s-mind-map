-- Fix: sync_logs table exposes operational data publicly
-- Add RLS policies to restrict access

-- First, enable RLS if not already enabled
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Remove any existing permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.sync_logs;
DROP POLICY IF EXISTS "Anyone can read sync_logs" ON public.sync_logs;

-- Create policy that blocks all access (admin access would be via service role key in edge functions)
-- No SELECT policy = no public read access
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- Also tighten synced_episodes to be read-only for public (no insert/update/delete from client)
DROP POLICY IF EXISTS "Allow public read access" ON public.synced_episodes;
DROP POLICY IF EXISTS "Anyone can read synced_episodes" ON public.synced_episodes;

-- Create read-only policy for synced_episodes (intentionally public content)
CREATE POLICY "Public read access for episodes"
ON public.synced_episodes
FOR SELECT
USING (true);