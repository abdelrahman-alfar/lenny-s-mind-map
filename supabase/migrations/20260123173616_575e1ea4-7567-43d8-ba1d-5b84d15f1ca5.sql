-- Remove the existing permissive policy that allows public read
DROP POLICY IF EXISTS "Sync logs are publicly readable" ON public.sync_logs;

-- No SELECT policy means no public read access
-- Edge function uses service role key which bypasses RLS