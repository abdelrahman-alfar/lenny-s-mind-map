import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Lightbulb } from "lucide-react";
import { Topic, categoryLabels } from "@/data/knowledgeMap";
import { Button } from "@/components/ui/button";

interface TopicDetailProps {
  topic: Topic | null;
  onClose: () => void;
  onZoomIn?: (topic: Topic) => void;
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    'strategy': 'bg-strategy/20 text-strategy border-strategy/30',
    'growth': 'bg-growth/20 text-growth border-growth/30',
    'leadership': 'bg-leadership/20 text-leadership border-leadership/30',
    'execution': 'bg-execution/20 text-execution border-execution/30',
    'skills': 'bg-skills/20 text-skills border-skills/30',
    'career': 'bg-career/20 text-career border-career/30',
  };
  return classes[category] || 'bg-primary/20 text-primary';
};

export function TopicDetail({ topic, onClose, onZoomIn }: TopicDetailProps) {
  return (
    <AnimatePresence>
      {topic && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel rounded-2xl p-6 w-full max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-2 ${getCategoryBadgeClass(topic.category)}`}>
                {categoryLabels[topic.category]}
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">{topic.name}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <p className="text-muted-foreground text-sm mb-4">{topic.description}</p>
          <p className="text-xs text-muted-foreground mb-4">{topic.episodeCount} episodes</p>

          {/* Preview of first insight */}
          {topic.keyInsights[0] && (
            <div className="bg-secondary/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-primary mb-1">
                <Lightbulb className="w-3 h-3" />
                Key Insight
              </div>
              <p className="text-sm font-medium text-foreground">{topic.keyInsights[0].title}</p>
              <p className="text-xs text-muted-foreground mt-1">{topic.keyInsights[0].summary}</p>
            </div>
          )}

          {onZoomIn && (
            <Button variant="default" className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => onZoomIn(topic)}>
              <ZoomIn className="w-4 h-4" />
              Explore Full Topic
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
