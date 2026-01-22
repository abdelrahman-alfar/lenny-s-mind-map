import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { topics, Topic, TopicCategory, getTotalEpisodes } from "@/data/knowledgeMap";
import { TopicNode } from "./TopicNode";
import { TopicDetail } from "./TopicDetail";
import { CategoryLegend } from "./CategoryLegend";
import { SearchBar } from "./SearchBar";

export function KnowledgeMap() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
              
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
                  Click any node to dive deeper.
                </p>
              </motion.div>

              {/* Category Legend */}
              <div className="mb-6">
                <CategoryLegend 
                  activeCategory={activeCategory} 
                  onCategoryClick={setActiveCategory} 
                />
              </div>

              {/* Topic nodes grid */}
              <motion.div 
                layout
                className="flex flex-wrap gap-3 justify-center p-4 min-h-[400px]"
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
                      isSelected={selectedTopic?.id === topic.id}
                      delay={index}
                    />
                  ))
                )}
              </motion.div>
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
