import { useState, useEffect, useCallback } from "react";

export interface BookmarkedInsight {
  id: string;
  topicId: string;
  topicName: string;
  subTopicPath: { id: string; name: string }[];
  type: 'insight' | 'deepDive';
  title: string;
  content: string;
  category: string;
  savedAt: number;
}

const STORAGE_KEY = 'pm-knowledge-map-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedInsight[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  }, []);

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }, [bookmarks]);

  const addBookmark = useCallback((insight: Omit<BookmarkedInsight, 'id' | 'savedAt'>) => {
    const id = `${insight.topicId}-${insight.subTopicPath.map(s => s.id).join('-')}-${insight.type}-${insight.title}`.slice(0, 100);
    
    setBookmarks(prev => {
      if (prev.some(b => b.id === id)) return prev;
      return [...prev, { ...insight, id, savedAt: Date.now() }];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const isBookmarked = useCallback((topicId: string, subTopicPath: { id: string }[], type: string, title: string) => {
    const id = `${topicId}-${subTopicPath.map(s => s.id).join('-')}-${type}-${title}`.slice(0, 100);
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    bookmarkCount: bookmarks.length,
  };
}