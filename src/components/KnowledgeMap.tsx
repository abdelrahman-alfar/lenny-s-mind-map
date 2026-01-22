import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Network, Grid3X3 } from "lucide-react";
import { topics, Topic, TopicCategory, getTotalEpisodes, connections } from "@/data/knowledgeMap";
import { TopicNode } from "./TopicNode";
import { TopicDetail } from "./TopicDetail";
import { CategoryLegend } from "./CategoryLegend";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export function KnowledgeMap() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    
    if (activeCategory) {
      filtered = filtered.filter(t => t.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => b.episodeCount - a.episodeCount);
  }, [activeCategory, searchQuery]);

  // Calculate node positions after render
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const nodes = container.querySelectorAll('[data-topic-id]');
      const containerRect = container.getBoundingClientRect();
      
      const positions: NodePosition[] = [];
      nodes.forEach((node) => {
        const id = node.getAttribute('data-topic-id');
        if (id) {
          const rect = node.getBoundingClientRect();
          positions.push({
            id,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          });
        }
      });
      
      setNodePositions(positions);
    };

    // Update positions after animations complete
    const timer = setTimeout(updatePositions, 500);
    window.addEventListener('resize', updatePositions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [filteredTopics]);

  const visibleConnections = useMemo(() => {
    if (!showConnections) return [];
    
    const visibleIds = new Set(filteredTopics.map(t => t.id));
    return connections.filter(c => visibleIds.has(c.from) && visibleIds.has(c.to));
  }, [filteredTopics, showConnections]);

  const getConnectionsForTopic = (topicId: string) => {
    return connections.filter(c => c.from === topicId || c.to === topicId);
  };

  const isConnectionHighlighted = (from: string, to: string) => {
    if (!hoveredTopic) return false;
    return from === hoveredTopic || to === hoveredTopic;
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic === selectedTopic ? null : topic);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 constellation-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
      
      {/* Central glow effect */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground">
                    PM Knowledge Map
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {getTotalEpisodes()} episodes from Lenny's Podcast
                  </p>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-3">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <Button
                  variant={showConnections ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowConnections(!showConnections)}
                  className="gap-2"
                >
                  <Network className="w-4 h-4" />
                  <span className="hidden sm:inline">Connections</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map area */}
            <div className="flex-1">
              {/* Hero section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Interactive Knowledge Graph</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Explore Product Wisdom
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Navigate through {filteredTopics.length} topics extracted from the best product management podcast. 
                  {showConnections && " Hover to see connections."}
                </p>
              </motion.div>

              {/* Category Legend */}
              <div className="mb-6">
                <CategoryLegend 
                  activeCategory={activeCategory} 
                  onCategoryClick={setActiveCategory} 
                />
              </div>

              {/* Topic nodes with connections */}
              <div className="relative" ref={containerRef}>
                {/* SVG Connection Lines */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  style={{ minHeight: '500px' }}
                >
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="connectionGradientHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  
                  <AnimatePresence>
                    {showConnections && visibleConnections.map((connection, index) => {
                      const fromPos = nodePositions.find(p => p.id === connection.from);
                      const toPos = nodePositions.find(p => p.id === connection.to);
                      
                      if (!fromPos || !toPos) return null;
                      
                      const highlighted = isConnectionHighlighted(connection.from, connection.to);
                      const dimmed = hoveredTopic && !highlighted;
                      
                      // Calculate control point for curved line
                      const midX = (fromPos.x + toPos.x) / 2;
                      const midY = (fromPos.y + toPos.y) / 2;
                      const dx = toPos.x - fromPos.x;
                      const dy = toPos.y - fromPos.y;
                      const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
                      const controlX = midX - dy * 0.2;
                      const controlY = midY + dx * 0.2;
                      
                      return (
                        <motion.path
                          key={`${connection.from}-${connection.to}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ 
                            pathLength: 1, 
                            opacity: dimmed ? 0.1 : highlighted ? 1 : 0.4 
                          }}
                          exit={{ pathLength: 0, opacity: 0 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: index * 0.02,
                            opacity: { duration: 0.2 }
                          }}
                          d={`M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`}
                          stroke={highlighted ? "url(#connectionGradientHighlight)" : "url(#connectionGradient)"}
                          strokeWidth={highlighted ? connection.strength + 1 : connection.strength}
                          fill="none"
                          strokeLinecap="round"
                          className="transition-all duration-200"
                        />
                      );
                    })}
                  </AnimatePresence>
                </svg>

                {/* Topic Nodes */}
                <motion.div 
                  layout
                  className="flex flex-wrap gap-3 justify-center p-4 min-h-[400px] relative z-10"
                >
                  {filteredTopics.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="p-4 bg-secondary rounded-full mb-4">
                        <Brain className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        No topics found
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search or category filter
                      </p>
                    </motion.div>
                  ) : (
                    filteredTopics.map((topic, index) => (
                      <TopicNode
                        key={topic.id}
                        topic={topic}
                        onClick={handleTopicClick}
                        onHover={setHoveredTopic}
                        isSelected={selectedTopic?.id === topic.id}
                        isHighlighted={
                          hoveredTopic === topic.id ||
                          getConnectionsForTopic(hoveredTopic || '').some(
                            c => c.from === topic.id || c.to === topic.id
                          )
                        }
                        isDimmed={hoveredTopic !== null && hoveredTopic !== topic.id && 
                          !getConnectionsForTopic(hoveredTopic).some(
                            c => c.from === topic.id || c.to === topic.id
                          )}
                        delay={index}
                      />
                    ))
                  )}
                </motion.div>
              </div>

              {/* Connection legend */}
              {showConnections && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-sm text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded" />
                    Hover on topics to reveal {visibleConnections.length} connections
                  </span>
                </motion.div>
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <TopicDetail topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
              
              {!selectedTopic && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="glass-panel rounded-2xl p-6 text-center"
                >
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Select a Topic
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any node to explore episodes and learn more about that topic.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Built with data from{" "}
              <a 
                href="https://github.com/ChatPRD/lennys-podcast-transcripts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Lenny's Podcast Transcripts
              </a>
              {" "}• {getTotalEpisodes()} episodes indexed
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
