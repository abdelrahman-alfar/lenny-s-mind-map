import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Podcast, BookOpen, ZoomIn } from "lucide-react";
import { Topic, categoryLabels } from "@/data/knowledgeMap";
import { Button } from "@/components/ui/button";

interface TopicDetailProps {
  topic: Topic | null;
  onClose: () => void;
  onZoomIn?: (topic: Topic) => void;
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    'core-pm': 'bg-core-pm/20 text-core-pm border-core-pm/30',
    'growth': 'bg-growth/20 text-growth border-growth/30',
    'leadership': 'bg-leadership/20 text-leadership border-leadership/30',
    'companies': 'bg-companies/20 text-companies border-companies/30',
    'skills': 'bg-skills/20 text-skills border-skills/30',
    'career': 'bg-career/20 text-career border-career/30',
    'technology': 'bg-technology/20 text-technology border-technology/30',
  };
  return classes[category] || 'bg-primary/20 text-primary';
};

export function TopicDetail({ topic, onClose, onZoomIn }: TopicDetailProps) {
  const githubUrl = `https://github.com/ChatPRD/lennys-podcast-transcripts/blob/main/index/${topic?.id}.md`;

  return (
    <AnimatePresence>
      {topic && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="glass-panel rounded-2xl p-6 w-full max-w-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-2 ${getCategoryBadgeClass(topic.category)}`}>
                {categoryLabels[topic.category]}
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {topic.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <p className="text-muted-foreground text-sm mb-6">
            {topic.description}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
              <Podcast className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">{topic.episodeCount}</span>
              <span className="text-muted-foreground text-sm">episodes</span>
            </div>
          </div>

          <div className="space-y-3">
            {onZoomIn && (
              <Button
                variant="default"
                className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => onZoomIn(topic)}
              >
                <ZoomIn className="w-4 h-4" />
                Zoom In & Explore
              </Button>
            )}
            
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => window.open(githubUrl, '_blank')}
            >
              <BookOpen className="w-4 h-4" />
              View Episodes
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
            
            <Button
              variant="ghost"
              className="w-full gap-2 text-muted-foreground"
              onClick={() => window.open('https://www.lennyspodcast.com/', '_blank')}
            >
              <Podcast className="w-4 h-4" />
              Listen on Lenny's Podcast
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Data sourced from{" "}
              <a 
                href="https://github.com/ChatPRD/lennys-podcast-transcripts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ChatPRD's transcript archive
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
