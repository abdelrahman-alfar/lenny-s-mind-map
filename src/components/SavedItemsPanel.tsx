import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Trash2, Lightbulb, BookOpen, ChevronRight, Clock, Download, Loader2 } from "lucide-react";
import { useBookmarkContext } from "@/contexts/BookmarkContext";
import { Button } from "./ui/button";
import { categoryLabels } from "@/data/knowledgeMap";
import { formatDistanceToNow } from "date-fns";
import { useExportBookmarksPdf } from "@/hooks/useExportBookmarksPdf";

interface SavedItemsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (topicId: string, subTopicPath: { id: string; name: string }[]) => void;
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    'strategy': 'bg-strategy/20 text-strategy',
    'growth': 'bg-growth/20 text-growth',
    'leadership': 'bg-leadership/20 text-leadership',
    'execution': 'bg-execution/20 text-execution',
    'skills': 'bg-skills/20 text-skills',
    'career': 'bg-career/20 text-career',
    'startup': 'bg-startup/20 text-startup',
    'people': 'bg-people/20 text-people',
  };
  return classes[category] || 'bg-primary/20 text-primary';
};

export function SavedItemsPanel({ isOpen, onClose, onItemClick }: SavedItemsPanelProps) {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarkContext();
  const { exportBookmarksToPdf, isExporting } = useExportBookmarksPdf();

  const handleItemClick = (bookmark: typeof bookmarks[0]) => {
    onItemClick(bookmark.topicId, bookmark.subTopicPath);
    onClose();
  };

  const handleExportPdf = () => {
    exportBookmarksToPdf(bookmarks);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass-panel border-l border-border/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">Saved Insights</h2>
                <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                  {bookmarks.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {bookmarks.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExportPdf}
                      disabled={isExporting}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      Export PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllBookmarks}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear all
                    </Button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 bg-secondary rounded-full mb-4">
                    <Bookmark className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    No saved insights yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Click the bookmark icon on any insight to save it for later reference.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks
                    .sort((a, b) => b.savedAt - a.savedAt)
                    .map((bookmark) => (
                      <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="group glass-panel rounded-xl p-4 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleItemClick(bookmark)}
                            className="flex-1 text-left"
                          >
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 flex-wrap">
                              <span className={`px-1.5 py-0.5 rounded ${getCategoryBadgeClass(bookmark.category)}`}>
                                {categoryLabels[bookmark.category as keyof typeof categoryLabels]}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                              <span>{bookmark.topicName}</span>
                              {bookmark.subTopicPath.map((sub) => (
                                <span key={sub.id} className="flex items-center gap-1">
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{sub.name}</span>
                                </span>
                              ))}
                            </div>

                            {/* Type icon and title */}
                            <div className="flex items-start gap-2">
                              {bookmark.type === 'insight' ? (
                                <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-foreground text-sm line-clamp-1">
                                  {bookmark.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {bookmark.content}
                                </p>
                              </div>
                            </div>

                            {/* Saved time */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Clock className="w-3 h-3" />
                              <span>Saved {formatDistanceToNow(bookmark.savedAt, { addSuffix: true })}</span>
                            </div>
                          </button>

                          {/* Remove button */}
                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="p-1.5 hover:bg-destructive/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove bookmark"
                          >
                            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}