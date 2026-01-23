import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Database } from "lucide-react";
import { Button } from "./ui/button";
import { useLatestSync } from "@/hooks/useSyncedEpisodes";
import { formatDistanceToNow } from "date-fns";

export function SyncStatus() {
  const { data: latestSync, isLoading: syncLoading } = useLatestSync();
  const [showDetails, setShowDetails] = useState(false);

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
              <h4 className="font-medium text-sm">Episode Database</h4>

              {latestSync && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated: {lastSyncTime}</span>
                </div>
              )}

              {!latestSync && !syncLoading && (
                <p className="text-sm text-muted-foreground">
                  Episodes sync automatically every day.
                </p>
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
