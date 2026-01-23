import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Check, AlertCircle, Clock, Database } from "lucide-react";
import { Button } from "./ui/button";
import { useLatestSync, useTriggerSync, useEpisodeCount } from "@/hooks/useSyncedEpisodes";
import { formatDistanceToNow } from "date-fns";

export function SyncStatus() {
  const { data: latestSync, isLoading: syncLoading } = useLatestSync();
  const { data: episodeCount, isLoading: countLoading } = useEpisodeCount();
  const triggerSync = useTriggerSync();
  const [showDetails, setShowDetails] = useState(false);

  const handleSync = () => {
    triggerSync.mutate();
  };

  const lastSyncTime = latestSync?.completed_at 
    ? formatDistanceToNow(new Date(latestSync.completed_at), { addSuffix: true })
    : null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">
          {countLoading ? "..." : `${episodeCount || 0} episodes`}
        </span>
      </Button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-72 glass-panel rounded-xl p-4 shadow-lg z-50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">GitHub Sync</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={triggerSync.isPending}
                  className="gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${triggerSync.isPending ? 'animate-spin' : ''}`} />
                  {triggerSync.isPending ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>

              {latestSync && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last sync: {lastSyncTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {latestSync.status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-muted-foreground">
                      {latestSync.episodes_found} found, {latestSync.episodes_added} new
                    </span>
                  </div>
                </div>
              )}

              {!latestSync && !syncLoading && (
                <p className="text-sm text-muted-foreground">
                  No sync history yet. Click "Sync Now" to fetch episodes from GitHub.
                </p>
              )}

              {triggerSync.isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-primary"
                >
                  <Check className="w-4 h-4" />
                  <span>Sync completed successfully!</span>
                </motion.div>
              )}

              {triggerSync.isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Sync failed. Please try again.</span>
                </motion.div>
              )}

              <p className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                Episodes are synced daily from{" "}
                <a 
                  href="https://github.com/ChatPRD/lennys-podcast-transcripts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Lenny's Podcast Transcripts
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
