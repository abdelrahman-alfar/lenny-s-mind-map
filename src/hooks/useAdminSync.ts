import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SyncLog } from "./useSyncedEpisodes";

export function useAdminSyncLogs() {
  return useQuery({
    queryKey: ["admin-sync-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sync_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as SyncLog[];
    },
  });
}

export function useTriggerSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "sync-github-episodes"
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["synced-episodes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["episode-count"] });
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      // Get episode count by topic
      const { data: episodes, error } = await supabase
        .from("synced_episodes")
        .select("matched_topic_ids");

      if (error) throw error;

      const topicCounts: Record<string, number> = {};
      let totalMatches = 0;

      episodes?.forEach((ep) => {
        ep.matched_topic_ids?.forEach((topicId: string) => {
          topicCounts[topicId] = (topicCounts[topicId] || 0) + 1;
          totalMatches++;
        });
      });

      return {
        totalEpisodes: episodes?.length || 0,
        topicCounts,
        totalMatches,
        averageTopicsPerEpisode: episodes?.length
          ? (totalMatches / episodes.length).toFixed(1)
          : "0",
      };
    },
  });
}
