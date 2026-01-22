import { useMemo } from "react";
import { motion } from "framer-motion";
import { Home, ChevronRight, ZoomOut, ExternalLink, Podcast, BookOpen } from "lucide-react";
import { Topic, topics, connections, categoryLabels } from "@/data/knowledgeMap";
import { Button } from "./ui/button";

interface FocusedViewProps {
  topic: Topic;
  navigationPath: Topic[];
  onNavigateBack: (index: number) => void;
  onDrillDown: (topic: Topic) => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'core-pm': 'border-core-pm bg-core-pm/20',
    'growth': 'border-growth bg-growth/20',
    'leadership': 'border-leadership bg-leadership/20',
    'companies': 'border-companies bg-companies/20',
    'skills': 'border-skills bg-skills/20',
    'career': 'border-career bg-career/20',
    'technology': 'border-technology bg-technology/20',
  };
  return colors[category] || 'border-primary bg-primary/20';
};

const getGlowColor = (category: string) => {
  const glows: Record<string, string> = {
    'core-pm': 'shadow-[0_0_60px_hsl(217,91%,60%,0.4)]',
    'growth': 'shadow-[0_0_60px_hsl(142,71%,45%,0.4)]',
    'leadership': 'shadow-[0_0_60px_hsl(280,65%,60%,0.4)]',
    'companies': 'shadow-[0_0_60px_hsl(38,92%,50%,0.4)]',
    'skills': 'shadow-[0_0_60px_hsl(173,80%,40%,0.4)]',
    'career': 'shadow-[0_0_60px_hsl(340,75%,55%,0.4)]',
    'technology': 'shadow-[0_0_60px_hsl(200,95%,50%,0.4)]',
  };
  return glows[category] || '';
};

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

export function FocusedView({ topic, navigationPath, onNavigateBack, onDrillDown }: FocusedViewProps) {
  const connectedTopics = useMemo(() => {
    const relatedConnections = connections.filter(
      c => c.from === topic.id || c.to === topic.id
    );
    
    const connectedIds = relatedConnections.map(c => 
      c.from === topic.id ? c.to : c.from
    );
    
    return topics
      .filter(t => connectedIds.includes(t.id))
      .map(t => ({
        ...t,
        strength: relatedConnections.find(
          c => c.from === t.id || c.to === t.id
        )?.strength || 1
      }))
      .sort((a, b) => b.strength - a.strength || b.episodeCount - a.episodeCount);
  }, [topic]);

  const githubUrl = `https://github.com/ChatPRD/lennys-podcast-transcripts/blob/main/index/${topic.id}.md`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 constellation-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
      
      {/* Focused glow effect */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10">
        {/* Header with breadcrumb navigation */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-sm overflow-x-auto">
                <button
                  onClick={() => onNavigateBack(-1)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Knowledge Map</span>
                </button>
                
                {navigationPath.map((pathTopic, index) => (
                  <div key={pathTopic.id} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={() => onNavigateBack(index)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        index === navigationPath.length - 1
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {pathTopic.name}
                    </button>
                  </div>
                ))}
              </nav>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateBack(-1)}
                className="gap-2"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Map</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main focused content */}
        <main className="container mx-auto px-4 py-12">
          {/* Central topic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="flex flex-col items-center mb-12"
          >
            {/* Large central node */}
            <motion.div
              className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center p-4 mb-6 ${getCategoryColor(topic.category)} ${getGlowColor(topic.category)}`}
              animate={{ 
                boxShadow: [
                  '0 0 60px hsl(217, 91%, 60%, 0.3)',
                  '0 0 80px hsl(217, 91%, 60%, 0.5)',
                  '0 0 60px hsl(217, 91%, 60%, 0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="font-display text-xl font-bold text-foreground text-center leading-tight">
                {topic.name}
              </span>
              <span className="text-muted-foreground text-sm mt-1">
                {topic.episodeCount} episodes
              </span>
            </motion.div>

            {/* Category badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getCategoryBadgeClass(topic.category)}`}>
              {categoryLabels[topic.category]}
            </span>

            {/* Description */}
            <p className="text-muted-foreground text-center max-w-lg mb-6">
              {topic.description}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => window.open(githubUrl, '_blank')}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                View Episodes
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://www.lennyspodcast.com/', '_blank')}
                className="gap-2"
              >
                <Podcast className="w-4 h-4" />
                Listen
              </Button>
            </div>
          </motion.div>

          {/* Connected topics */}
          {connectedTopics.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-display text-xl font-semibold text-center text-foreground mb-2">
                Connected Topics
              </h3>
              <p className="text-center text-muted-foreground text-sm mb-8">
                Click to explore related knowledge areas
              </p>
              
              {/* Connection lines SVG */}
              <div className="relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '200px' }}>
                  <defs>
                    <linearGradient id="focusConnectionGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {connectedTopics.map((connectedTopic, index) => {
                    const totalNodes = connectedTopics.length;
                    const angle = (index / totalNodes) * Math.PI - Math.PI / 2;
                    const startX = 50;
                    const startY = 0;
                    const spread = Math.min(40, 80 / totalNodes);
                    const endX = 50 + (index - (totalNodes - 1) / 2) * spread;
                    const endY = 100;
                    
                    return (
                      <motion.path
                        key={connectedTopic.id}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        d={`M ${startX}% ${startY}% Q ${startX}% 50% ${endX}% ${endY}%`}
                        stroke="url(#focusConnectionGradient)"
                        strokeWidth={connectedTopic.strength}
                        fill="none"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                
                {/* Connected topic nodes */}
                <div className="flex flex-wrap justify-center gap-4 pt-48">
                  {connectedTopics.map((connectedTopic, index) => (
                    <motion.button
                      key={connectedTopic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDrillDown(connectedTopic)}
                      className={`rounded-full border-2 px-4 py-3 flex flex-col items-center min-w-[100px] transition-all duration-200 hover:shadow-lg ${getCategoryColor(connectedTopic.category)}`}
                    >
                      <span className="font-medium text-foreground text-sm text-center">
                        {connectedTopic.name}
                      </span>
                      <span className="text-muted-foreground text-xs mt-0.5">
                        {connectedTopic.episodeCount} episodes
                      </span>
                      <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${getCategoryBadgeClass(connectedTopic.category)}`}>
                        {categoryLabels[connectedTopic.category]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* No connections message */}
          {connectedTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                No direct connections mapped for this topic yet.
              </p>
              <Button
                variant="link"
                onClick={() => onNavigateBack(-1)}
                className="mt-2"
              >
                ← Back to full knowledge map
              </Button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
