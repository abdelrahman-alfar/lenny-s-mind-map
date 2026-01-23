import { motion } from "framer-motion";
import { TopicCategory, categoryLabels } from "@/data/knowledgeMap";

interface CategoryLegendProps {
  activeCategory: TopicCategory | null;
  onCategoryClick: (category: TopicCategory | null) => void;
}

const categories: { key: TopicCategory; colorClass: string }[] = [
  { key: 'strategy', colorClass: 'bg-strategy' },
  { key: 'growth', colorClass: 'bg-growth' },
  { key: 'leadership', colorClass: 'bg-leadership' },
  { key: 'execution', colorClass: 'bg-execution' },
  { key: 'skills', colorClass: 'bg-skills' },
  { key: 'career', colorClass: 'bg-career' },
  { key: 'startup', colorClass: 'bg-startup' },
  { key: 'people', colorClass: 'bg-people' },
];

export function CategoryLegend({ activeCategory, onCategoryClick }: CategoryLegendProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-xl p-4"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryClick(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeCategory === null 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All
        </button>
        {categories.map(({ key, colorClass }) => (
          <button
            key={key}
            onClick={() => onCategoryClick(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === key 
                ? 'bg-secondary ring-2 ring-primary' 
                : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${colorClass}`} />
            <span className="text-foreground">{categoryLabels[key]}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
