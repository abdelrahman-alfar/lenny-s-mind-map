import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, ChevronRight, ZoomOut, ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react";
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
    'strategy': 'border-strategy bg-strategy/20',
    'growth': 'border-growth bg-growth/20',
    'leadership': 'border-leadership bg-leadership/20',
    'execution': 'border-execution bg-execution/20',
    'skills': 'border-skills bg-skills/20',
    'career': 'border-career bg-career/20',
  };
  return colors[category] || 'border-primary bg-primary/20';
};

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

export function FocusedView({ topic, navigationPath, onNavigateBack, onDrillDown }: FocusedViewProps) {
  const [showDeepDive, setShowDeepDive] = useState(false);

  const connectedTopics = useMemo(() => {
    const relatedConnections = connections.filter(
      c => c.from === topic.id || c.to === topic.id
    );
    
    return relatedConnections.map(conn => {
      const connectedId = conn.from === topic.id ? conn.to : conn.from;
      const connectedTopic = topics.find(t => t.id === connectedId);
      return connectedTopic ? { ...connectedTopic, relationship: conn.relationship } : null;
    }).filter(Boolean) as (Topic & { relationship?: string })[];
  }, [topic]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 constellation-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />

      <div className="relative z-10">
        {/* Breadcrumb Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-1 text-sm overflow-x-auto">
                <button onClick={() => onNavigateBack(-1)} className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
                {navigationPath.map((pathTopic, index) => (
                  <div key={pathTopic.id} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <button onClick={() => onNavigateBack(index)} className={`px-2 py-1 rounded-md transition-colors ${index === navigationPath.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                      {pathTopic.name}
                    </button>
                  </div>
                ))}
              </nav>
              <Button variant="outline" size="sm" onClick={() => onNavigateBack(-1)} className="gap-2">
                <ZoomOut className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Topic Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getCategoryBadgeClass(topic.category)}`}>
              {categoryLabels[topic.category]}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{topic.name}</h1>
            <p className="text-muted-foreground text-lg">{topic.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{topic.episodeCount} episodes</p>
          </motion.div>

          {/* Key Insights */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Key Insights
            </h2>
            <div className="grid gap-4">
              {topic.keyInsights.map((insight, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-panel rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                  <p className="text-muted-foreground text-sm">{insight.summary}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Deep Dive - expandable */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
            <button onClick={() => setShowDeepDive(!showDeepDive)} className="w-full flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-secondary/50 transition-colors">
              <span className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Deep Dive
              </span>
              {showDeepDive ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            {showDeepDive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                {topic.deepDive.map((point, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>

          {/* Connected Topics */}
          {connectedTopics.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Related Topics</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {connectedTopics.map((ct, i) => (
                  <motion.button key={ct.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }} onClick={() => onDrillDown(ct)} className={`p-4 rounded-xl border-2 text-left hover:scale-[1.02] transition-all ${getCategoryColor(ct.category)}`}>
                    <span className="font-medium text-foreground">{ct.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{ct.relationship}</p>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}
