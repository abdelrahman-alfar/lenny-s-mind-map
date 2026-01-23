import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ChevronRight, ZoomOut, ChevronDown, ChevronUp, Lightbulb, BookOpen, Layers, ArrowRight, Bookmark, Download, Loader2 } from "lucide-react";
import { Topic, SubTopic, topics, connections, categoryLabels, normalizeDeepDivePoint } from "@/data/knowledgeMap";
import { Button } from "./ui/button";
import { useBookmarkContext } from "@/contexts/BookmarkContext";
import { useExportPdf } from "@/hooks/useExportPdf";

type ViewableContent = Topic | SubTopic;

interface NavigationItem {
  id: string;
  name: string;
  type: 'topic' | 'subtopic';
}

interface FocusedViewProps {
  topic: Topic;
  navigationPath: Topic[];
  onNavigateBack: (index: number) => void;
  onDrillDown: (topic: Topic) => void;
  initialSubTopicPath?: SubTopic[];
  onSubTopicPathConsumed?: () => void;
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
    'startup': 'bg-startup/20 text-startup border-startup/30',
    'people': 'bg-people/20 text-people border-people/30',
  };
  return classes[category] || 'bg-primary/20 text-primary';
};

// Insights Section with bookmark buttons
function InsightsSection({ 
  topic, 
  currentContent, 
  subTopicPath 
}: { 
  topic: Topic; 
  currentContent: ViewableContent; 
  subTopicPath: SubTopic[];
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkContext();

  const handleBookmarkToggle = (insight: { title: string; summary: string }) => {
    const bookmarked = isBookmarked(topic.id, subTopicPath, 'insight', insight.title);
    
    if (bookmarked) {
      const id = `${topic.id}-${subTopicPath.map(s => s.id).join('-')}-insight-${insight.title}`.slice(0, 100);
      removeBookmark(id);
    } else {
      addBookmark({
        topicId: topic.id,
        topicName: topic.name,
        subTopicPath: subTopicPath.map(s => ({ id: s.id, name: s.name })),
        type: 'insight',
        title: insight.title,
        content: insight.summary,
        category: topic.category,
      });
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
      <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-accent" />
        Key Insights
      </h2>
      <div className="grid gap-4">
        {currentContent.keyInsights.map((insight, i) => {
          const bookmarked = isBookmarked(topic.id, subTopicPath, 'insight', insight.title);
          
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 + i * 0.1 }} 
              className="glass-panel rounded-xl p-4 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                  <p className="text-muted-foreground text-sm">{insight.summary}</p>
                </div>
                <button
                  onClick={() => handleBookmarkToggle(insight)}
                  className={`p-1.5 rounded-md transition-all ${
                    bookmarked 
                      ? 'text-primary bg-primary/20' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100'
                  }`}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark this insight'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// Deep Dive Section with bookmark buttons
function DeepDiveSection({ 
  topic, 
  currentContent, 
  subTopicPath,
  showDeepDive,
  setShowDeepDive
}: { 
  topic: Topic; 
  currentContent: ViewableContent; 
  subTopicPath: SubTopic[];
  showDeepDive: boolean;
  setShowDeepDive: (show: boolean) => void;
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkContext();

  const handleBookmarkToggle = (header: string | null, content: string) => {
    const title = header || 'Deep Dive';
    const bookmarked = isBookmarked(topic.id, subTopicPath, 'deepDive', title);
    
    if (bookmarked) {
      const id = `${topic.id}-${subTopicPath.map(s => s.id).join('-')}-deepDive-${title}`.slice(0, 100);
      removeBookmark(id);
    } else {
      addBookmark({
        topicId: topic.id,
        topicName: topic.name,
        subTopicPath: subTopicPath.map(s => ({ id: s.id, name: s.name })),
        type: 'deepDive',
        title,
        content: content.slice(0, 200),
        category: topic.category,
      });
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
      <button onClick={() => setShowDeepDive(!showDeepDive)} className="w-full flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-secondary/50 transition-colors">
        <span className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Deep Dive
        </span>
        {showDeepDive ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {showDeepDive && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4">
          {currentContent.deepDive.map((rawPoint, i) => {
            const point = normalizeDeepDivePoint(rawPoint);
            const hasBoldHeader = point.text.startsWith('**');
            const parts = hasBoldHeader ? point.text.split('**') : [point.text];
            const header = hasBoldHeader ? parts[1] : null;
            const content = hasBoldHeader ? parts.slice(2).join('').replace(/^:\s*/, '') : point.text;
            const title = header || 'Deep Dive';
            const bookmarked = isBookmarked(topic.id, subTopicPath, 'deepDive', title);
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="glass-panel rounded-lg p-4 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {header && (
                      <h4 className="font-semibold text-foreground mb-2">{header}</h4>
                    )}
                    <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
                    {point.speaker && (
                      <p className="text-xs text-primary mt-2 italic">— {point.speaker}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleBookmarkToggle(header, content)}
                    className={`p-1.5 rounded-md transition-all flex-shrink-0 ${
                      bookmarked 
                        ? 'text-primary bg-primary/20' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100'
                    }`}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark this insight'}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.section>
  );
}

export function FocusedView({ topic, navigationPath, onNavigateBack, onDrillDown, initialSubTopicPath, onSubTopicPathConsumed }: FocusedViewProps) {
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [subTopicPath, setSubTopicPath] = useState<SubTopic[]>([]);
  const { exportToPdf, isExporting } = useExportPdf();

  // Initialize with search result path if provided
  useEffect(() => {
    if (initialSubTopicPath && initialSubTopicPath.length > 0) {
      setSubTopicPath(initialSubTopicPath);
      onSubTopicPathConsumed?.();
    }
  }, [initialSubTopicPath, onSubTopicPathConsumed]);

  // Current content being viewed (either the topic or a sub-topic)
  const currentContent: ViewableContent = subTopicPath.length > 0 
    ? subTopicPath[subTopicPath.length - 1] 
    : topic;

  const handleExportPdf = () => {
    exportToPdf({
      topic,
      currentContent,
      subTopicPath,
      includeDeepDive: true,
    });
  };

  const currentSubTopics = currentContent.subTopics || [];

  const connectedTopics = useMemo(() => {
    if (subTopicPath.length > 0) return []; // No connected topics when viewing sub-topics
    
    const relatedConnections = connections.filter(
      c => c.from === topic.id || c.to === topic.id
    );
    
    return relatedConnections.map(conn => {
      const connectedId = conn.from === topic.id ? conn.to : conn.from;
      const connectedTopic = topics.find(t => t.id === connectedId);
      return connectedTopic ? { ...connectedTopic, relationship: conn.relationship } : null;
    }).filter(Boolean) as (Topic & { relationship?: string })[];
  }, [topic, subTopicPath.length]);

  const handleSubTopicClick = (subTopic: SubTopic) => {
    setSubTopicPath(prev => [...prev, subTopic]);
    setShowDeepDive(false);
  };

  const handleSubTopicBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setSubTopicPath([]);
    } else {
      setSubTopicPath(prev => prev.slice(0, index + 1));
    }
    setShowDeepDive(false);
  };

  const handleBackToMap = (index: number) => {
    setSubTopicPath([]);
    onNavigateBack(index);
  };

  // Build full navigation including sub-topics
  const fullNavigation: NavigationItem[] = [
    ...navigationPath.map(t => ({ id: t.id, name: t.name, type: 'topic' as const })),
    ...subTopicPath.map(st => ({ id: st.id, name: st.name, type: 'subtopic' as const })),
  ];

  const category = 'category' in topic ? topic.category : 'strategy';

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
                <button onClick={() => handleBackToMap(-1)} className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
                {navigationPath.map((pathTopic, index) => (
                  <div key={pathTopic.id} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <button 
                      onClick={() => {
                        if (index === navigationPath.length - 1 && subTopicPath.length === 0) return;
                        setSubTopicPath([]);
                        if (index < navigationPath.length - 1) {
                          handleBackToMap(index);
                        }
                      }} 
                      className={`px-2 py-1 rounded-md transition-colors ${
                        index === navigationPath.length - 1 && subTopicPath.length === 0 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer'
                      }`}
                    >
                      {pathTopic.name}
                    </button>
                  </div>
                ))}
                {subTopicPath.map((subTopic, index) => (
                  <div key={subTopic.id} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <button 
                      onClick={() => index < subTopicPath.length - 1 && handleSubTopicBreadcrumbClick(index)} 
                      className={`px-2 py-1 rounded-md transition-colors ${
                        index === subTopicPath.length - 1 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer'
                      }`}
                    >
                      {subTopic.name}
                    </button>
                  </div>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">PDF</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBackToMap(-1)} className="gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Topic Header */}
          <motion.div 
            key={currentContent.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-8"
          >
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getCategoryBadgeClass(category)}`}>
              {subTopicPath.length > 0 ? (
                <>
                  <Layers className="w-3 h-3 mr-1" />
                  Sub-topic • {categoryLabels[category as keyof typeof categoryLabels]}
                </>
              ) : (
                categoryLabels[category as keyof typeof categoryLabels]
              )}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{currentContent.name}</h1>
            <p className="text-muted-foreground text-lg">{currentContent.description}</p>
            {'episodeCount' in currentContent && typeof currentContent.episodeCount === 'number' && (
              <p className="text-sm text-muted-foreground mt-2">{currentContent.episodeCount} episodes</p>
            )}
          </motion.div>

          {/* Sub-Topics Section */}
          {currentSubTopics.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.05 }} 
              className="mb-8"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Explore Deeper
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {currentSubTopics.map((subTopic, i) => (
                  <motion.button
                    key={subTopic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => handleSubTopicClick(subTopic)}
                    className={`group p-4 rounded-xl border-2 text-left hover:scale-[1.02] transition-all ${getCategoryColor(category)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{subTopic.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{subTopic.description}</p>
                    {subTopic.subTopics && subTopic.subTopics.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary mt-2">
                        <Layers className="w-3 h-3" />
                        {subTopic.subTopics.length} more level{subTopic.subTopics.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {/* Key Insights */}
          <InsightsSection 
            topic={topic}
            currentContent={currentContent}
            subTopicPath={subTopicPath}
          />

          {/* Deep Dive - expandable */}
          <DeepDiveSection
            topic={topic}
            currentContent={currentContent}
            subTopicPath={subTopicPath}
            showDeepDive={showDeepDive}
            setShowDeepDive={setShowDeepDive}
          />

          {/* Connected Topics (only show at topic level, not sub-topic level) */}
          {connectedTopics.length > 0 && subTopicPath.length === 0 && (
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

          {/* Back to parent sub-topic button */}
          {subTopicPath.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => handleSubTopicBreadcrumbClick(subTopicPath.length - 2)}
                className="gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to {subTopicPath.length === 1 ? topic.name : subTopicPath[subTopicPath.length - 2].name}
              </Button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}