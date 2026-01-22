import { motion } from "framer-motion";
import { Topic } from "@/data/knowledgeMap";
import { cn } from "@/lib/utils";

interface TopicNodeProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
  onDoubleClick?: (topic: Topic) => void;
  onHover?: (topicId: string | null) => void;
  isSelected: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  delay?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'center';
}

const sizeClasses = (count: number, customSize?: string) => {
  if (customSize === 'center') return "w-36 h-36 text-lg";
  if (customSize === 'xl') return "w-28 h-28 text-base";
  if (customSize === 'lg') return "w-24 h-24 text-sm";
  if (customSize === 'md') return "w-20 h-20 text-sm";
  if (customSize === 'sm') return "w-16 h-16 text-xs";
  
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
    'core-pm': 'shadow-[0_0_30px_hsl(217,91%,60%,0.5)]',
    'growth': 'shadow-[0_0_30px_hsl(142,71%,45%,0.5)]',
    'leadership': 'shadow-[0_0_30px_hsl(280,65%,60%,0.5)]',
    'companies': 'shadow-[0_0_30px_hsl(38,92%,50%,0.5)]',
    'skills': 'shadow-[0_0_30px_hsl(173,80%,40%,0.5)]',
    'career': 'shadow-[0_0_30px_hsl(340,75%,55%,0.5)]',
    'technology': 'shadow-[0_0_30px_hsl(200,95%,50%,0.5)]',
  };
  return glows[category] || '';
};

export function TopicNode({ 
  topic, 
  onClick, 
  onDoubleClick,
  onHover,
  isSelected, 
  isHighlighted,
  isDimmed,
  delay = 0,
  size
}: TopicNodeProps) {
  return (
    <motion.button
      data-topic-id={topic.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        scale: isHighlighted ? 1.1 : 1,
        filter: isDimmed ? 'grayscale(0.5)' : 'grayscale(0)'
      }}
      transition={{ 
        delay: delay * 0.02, 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        opacity: { duration: 0.2 },
        filter: { duration: 0.2 }
      }}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(topic)}
      onDoubleClick={() => onDoubleClick?.(topic)}
      onMouseEnter={() => onHover?.(topic.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "relative rounded-full border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-200",
        sizeClasses(topic.episodeCount, size),
        getCategoryColor(topic.category),
        (isSelected || isHighlighted) && getGlowColor(topic.category),
        isSelected && "ring-2 ring-offset-2 ring-offset-background ring-accent"
      )}
    >
      {/* Pulse ring on highlight */}
      {isHighlighted && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-accent"
        />
      )}
      
      <span className="font-medium text-foreground text-center leading-tight line-clamp-2 px-1 relative z-10">
        {topic.name}
      </span>
      <span className="text-muted-foreground text-[10px] mt-0.5 relative z-10">
        {topic.episodeCount}
      </span>
    </motion.button>
  );
}
