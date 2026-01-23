import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, X, Lightbulb, BookOpen, ChevronRight, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { topics, Topic, SubTopic, categoryLabels } from "@/data/knowledgeMap";

const RECENT_SEARCHES_KEY = 'knowledge-map-recent-searches';
const MAX_RECENT_SEARCHES = 5;

interface SearchResult {
  topicId: string;
  topicName: string;
  category: string;
  subTopicPath: SubTopic[];
  matchType: 'insight' | 'deepDive' | 'description';
  matchText: string;
  matchContext: string;
}

interface ContentSearchBarProps {
  onResultClick: (topicId: string, subTopicPath: SubTopic[]) => void;
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
    'strategy': 'bg-strategy/20 text-strategy',
    'growth': 'bg-growth/20 text-growth',
    'leadership': 'bg-leadership/20 text-leadership',
    'execution': 'bg-execution/20 text-execution',
    'skills': 'bg-skills/20 text-skills',
    'career': 'bg-career/20 text-career',
  };
  return classes[category] || 'bg-primary/20 text-primary';
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-accent/40 text-foreground rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  );
}

function searchInContent(
  topic: Topic,
  query: string,
  subTopicPath: SubTopic[] = []
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  const currentContent = subTopicPath.length > 0 
    ? subTopicPath[subTopicPath.length - 1] 
    : topic;
  
  // Search in key insights
  currentContent.keyInsights.forEach(insight => {
    const titleMatch = insight.title.toLowerCase().includes(lowerQuery);
    const summaryMatch = insight.summary.toLowerCase().includes(lowerQuery);
    
    if (titleMatch || summaryMatch) {
      results.push({
        topicId: topic.id,
        topicName: topic.name,
        category: topic.category,
        subTopicPath: [...subTopicPath],
        matchType: 'insight',
        matchText: insight.title,
        matchContext: insight.summary,
      });
    }
  });
  
  // Search in deep dive
  currentContent.deepDive.forEach(point => {
    if (point.toLowerCase().includes(lowerQuery)) {
      // Extract header if exists
      const hasBoldHeader = point.startsWith('**');
      const parts = hasBoldHeader ? point.split('**') : [point];
      const header = hasBoldHeader ? parts[1] : null;
      const content = hasBoldHeader ? parts.slice(2).join('').replace(/^:\s*/, '') : point;
      
      results.push({
        topicId: topic.id,
        topicName: topic.name,
        category: topic.category,
        subTopicPath: [...subTopicPath],
        matchType: 'deepDive',
        matchText: header || 'Deep Dive',
        matchContext: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
      });
    }
  });
  
  // Search in description
  if (currentContent.description.toLowerCase().includes(lowerQuery)) {
    results.push({
      topicId: topic.id,
      topicName: topic.name,
      category: topic.category,
      subTopicPath: [...subTopicPath],
      matchType: 'description',
      matchText: subTopicPath.length > 0 ? subTopicPath[subTopicPath.length - 1].name : topic.name,
      matchContext: currentContent.description,
    });
  }
  
  // Recursively search sub-topics
  if (currentContent.subTopics) {
    currentContent.subTopics.forEach(subTopic => {
      const subResults = searchInContent(topic, query, [...subTopicPath, subTopic]);
      results.push(...subResults);
    });
  }
  
  return results;
}

export function ContentSearchBar({ onResultClick }: ContentSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  }, []);
  
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent searches:', e);
      }
      return updated;
    });
  }, []);
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches:', e);
    }
  }, []);
  
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    
    const allResults: SearchResult[] = [];
    
    topics.forEach(topic => {
      const topicResults = searchInContent(topic, query);
      allResults.push(...topicResults);
    });
    
    const seen = new Set<string>();
    return allResults.filter(result => {
      const key = `${result.topicId}-${result.subTopicPath.map(s => s.id).join('-')}-${result.matchText}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, [query]);
  
  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults, query]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);
  
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onResultClick(result.topicId, result.subTopicPath);
    setQuery("");
    setIsFocused(false);
    setSelectedIndex(-1);
  };
  
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    inputRef.current?.focus();
  };
  
  const showResults = isFocused && query.trim().length >= 2;
  const showRecentSearches = isFocused && query.trim().length < 2 && recentSearches.length > 0;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle recent searches navigation
    if (showRecentSearches) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < recentSearches.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : recentSearches.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < recentSearches.length) {
            handleRecentSearchClick(recentSearches[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsFocused(false);
          setSelectedIndex(-1);
          break;
      }
      return;
    }
    
    if (!showResults || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };
  
  const showDropdown = showResults || showRecentSearches;
  
  return (
    <div ref={containerRef} className="relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 100))}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search all insights..."
          className="w-full md:w-80 pl-12 pr-10 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </motion.div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
          >
            {/* Recent Searches */}
            {showRecentSearches && (
              <div>
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecentSearches();
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                <div ref={resultsRef} role="listbox">
                  {recentSearches.map((term, index) => (
                    <button
                      key={term}
                      id={`search-item-${index}`}
                      onClick={() => handleRecentSearchClick(term)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors ${
                        selectedIndex === index 
                          ? 'bg-secondary/70' 
                          : 'hover:bg-secondary/50'
                      }`}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search Results */}
            {showResults && (
              <>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div ref={resultsRef} className="divide-y divide-border/30" role="listbox">
                    {searchResults.map((result, index) => (
                      <motion.button
                        key={`${result.topicId}-${result.subTopicPath.map(s => s.id).join('-')}-${index}`}
                        id={`search-item-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full p-3 text-left transition-colors ${
                          selectedIndex === index 
                            ? 'bg-secondary/70 ring-1 ring-primary/30' 
                            : 'hover:bg-secondary/50'
                        }`}
                        role="option"
                        aria-selected={selectedIndex === index}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {result.matchType === 'insight' ? (
                              <Lightbulb className="w-4 h-4 text-accent" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Breadcrumb path */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 flex-wrap">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${getCategoryBadgeClass(result.category)}`}>
                                {categoryLabels[result.category as keyof typeof categoryLabels]}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                              <span>{result.topicName}</span>
                              {result.subTopicPath.map((sub) => (
                                <span key={sub.id} className="flex items-center gap-1">
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{sub.name}</span>
                                </span>
                              ))}
                            </div>
                            
                            {/* Match title */}
                            <p className="font-medium text-foreground text-sm truncate">
                              {highlightMatch(result.matchText, query)}
                            </p>
                            
                            {/* Match context */}
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {highlightMatch(result.matchContext, query)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}