import { motion } from "framer-motion";
import { ExternalLink, Mic, Hash } from "lucide-react";
import { useEpisodesForTopic, SyncedEpisode } from "@/hooks/useSyncedEpisodes";

interface RelatedEpisodesProps {
  topicId: string;
  topicName: string;
}

export function RelatedEpisodes({ topicId, topicName }: RelatedEpisodesProps) {
  const { data: episodes, isLoading, error } = useEpisodesForTopic(topicId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !episodes || episodes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Mic className="w-4 h-4" />
        Related Episodes ({episodes.length})
      </h4>
      
      <div className="space-y-2">
        {episodes.map((episode, index) => (
          <EpisodeCard key={episode.id} episode={episode} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function EpisodeCard({ episode, index }: { episode: SyncedEpisode; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      href={episode.github_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {episode.episode_number && (
              <span className="text-xs text-primary font-mono flex items-center gap-0.5">
                <Hash className="w-3 h-3" />
                {episode.episode_number}
              </span>
            )}
            {episode.guest_name && (
              <span className="text-xs text-muted-foreground truncate">
                {episode.guest_name}
              </span>
            )}
          </div>
          <h5 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {episode.episode_title}
          </h5>
          {episode.transcript_preview && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {episode.transcript_preview.slice(0, 100)}...
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </motion.a>
  );
}
