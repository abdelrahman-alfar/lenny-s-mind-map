import { createContext, useContext, ReactNode } from "react";
import { useBookmarks, BookmarkedInsight } from "@/hooks/useBookmarks";

interface BookmarkContextType {
  bookmarks: BookmarkedInsight[];
  addBookmark: (insight: Omit<BookmarkedInsight, 'id' | 'savedAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (topicId: string, subTopicPath: { id: string }[], type: string, title: string) => boolean;
  clearAllBookmarks: () => void;
  bookmarkCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const bookmarkState = useBookmarks();

  return (
    <BookmarkContext.Provider value={bookmarkState}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
}