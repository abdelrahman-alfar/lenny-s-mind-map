import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SyncedEpisode {
  id: string;
  github_filename: string;
  episode_title: string;
  episode_number: number | null;
  guest_name: string | null;
  transcript_preview: string | null;
  matched_topic_ids: string[];
  match_scores: Record<string, number>;
  github_url: string | null;
  synced_at: string;
  created_at: string;
}

export interface SyncLog {
  id: string;
  sync_type: string;
  episodes_found: number;
  episodes_added: number;
  episodes_updated: number;
  status: string;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export function useSyncedEpisodes(topicId?: string) {
  return useQuery({
    queryKey: ['synced-episodes', topicId],
    queryFn: async () => {
      let query = supabase
        .from('synced_episodes')
        .select('*')
        .order('episode_number', { ascending: false });
      
      if (topicId) {
        query = query.contains('matched_topic_ids', [topicId]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SyncedEpisode[];
    },
  });
}

export function useLatestSync() {
  return useQuery({
    queryKey: ['latest-sync'],
    queryFn: async () => {
      // Get the most recently synced episode as a proxy for last sync time
      // (sync_logs table is not publicly accessible for security)
      const { data, error } = await supabase
        .from('synced_episodes')
        .select('synced_at')
        .order('synced_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        return {
          completed_at: data.synced_at,
          status: 'completed',
        } as Partial<SyncLog>;
      }
      return null;
    },
  });
}

export function useEpisodeCount() {
  return useQuery({
    queryKey: ['episode-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('synced_episodes')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useEpisodesForTopic(topicId: string) {
  return useQuery({
    queryKey: ['episodes-for-topic', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('synced_episodes')
        .select('*')
        .contains('matched_topic_ids', [topicId])
        .order('match_scores->' + topicId, { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as SyncedEpisode[];
    },
    enabled: !!topicId,
  });
}
