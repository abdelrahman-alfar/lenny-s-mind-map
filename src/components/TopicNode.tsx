import { motion } from "framer-motion";
import { Topic, categoryColors } from "@/data/knowledgeMap";
import { cn } from "@/lib/utils";

interface TopicNodeProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
  isSelected: boolean;
  delay?: number;
}

const sizeClasses = (count: number) => {
  if (count >= 100) return "w-28 h-28 text-base";
  if (count >= 40) return "w-24 h-24 text-sm";
  if (count >= 20) return "w-20 h-20 text-sm";
  if (count >= 10) return "w-16 h-16 text-xs";
  return "w-14 h-14 text-xs";
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'core-pm': 'bg-core-pm/20 border-core-pm hover:bg-core-pm/30',
    'growth': 'bg-growth/20 border-growth hover:bg-growth/30',
    'leadership': 'bg-leadership/20 border-leadership hover:bg-leadership/30',
    'companies': 'bg-companies/20 border-companies hover:bg-companies/30',
    'skills': 'bg-skills/20 border-skills hover:bg-skills/30',
    'career': 'bg-career/20 border-career hover:bg-career/30',
    'technology': 'bg-technology/20 border-technology hover:bg-technology/30',
  };
  return colors[category] || 'bg-primary/20 border-primary';
};

const getGlowColor = (category: string) => {
  const glows: Record<string, string> = {
    'core-pm': 'shadow-[0_0_25px_hsl(217,91%,60%,0.4)]',
    'growth': 'shadow-[0_0_25px_hsl(142,71%,45%,0.4)]',
    'leadership': 'shadow-[0_0_25px_hsl(280,65%,60%,0.4)]',
    'companies': 'shadow-[0_0_25px_hsl(38,92%,50%,0.4)]',
    'skills': 'shadow-[0_0_25px_hsl(173,80%,40%,0.4)]',
    'career': 'shadow-[0_0_25px_hsl(340,75%,55%,0.4)]',
    'technology': 'shadow-[0_0_25px_hsl(200,95%,50%,0.4)]',
  };
  return glows[category] || '';
};

export function TopicNode({ topic, onClick, isSelected, delay = 0 }: TopicNodeProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay * 0.02, 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(topic)}
      className={cn(
        "relative rounded-full border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-300",
        sizeClasses(topic.episodeCount),
        getCategoryColor(topic.category),
        isSelected && getGlowColor(topic.category),
        isSelected && "ring-2 ring-offset-2 ring-offset-background"
      )}
    >
      <span className="font-medium text-foreground text-center leading-tight line-clamp-2 px-1">
        {topic.name}
      </span>
      <span className="text-muted-foreground text-[10px] mt-0.5">
        {topic.episodeCount}
      </span>
    </motion.button>
  );
}
