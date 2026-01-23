import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import { categoryLabels } from '@/data/knowledgeMap';
import { useToast } from '@/hooks/use-toast';

interface Bookmark {
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

export function useExportBookmarksPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportBookmarksToPdf = useCallback(async (bookmarks: Bookmark[]) => {
    if (bookmarks.length === 0) {
      toast({
        title: 'No bookmarks to export',
        description: 'Save some insights first to export them.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      // Helper to add page break if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
      };

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(30, 30, 30);
      pdf.text('Saved Insights', margin, yPos);
      yPos += 10;

      // Subtitle
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${bookmarks.length} bookmarked item${bookmarks.length > 1 ? 's' : ''} • Exported ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 15;

      // Divider
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Sort bookmarks by category then by savedAt
      const sortedBookmarks = [...bookmarks].sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return b.savedAt - a.savedAt;
      });

      let currentCategory = '';

      sortedBookmarks.forEach((bookmark, index) => {
        // Category header
        if (bookmark.category !== currentCategory) {
          currentCategory = bookmark.category;
          checkPageBreak(20);
          
          if (index > 0) yPos += 5;
          
          pdf.setFontSize(14);
          pdf.setTextColor(60, 60, 60);
          const categoryLabel = categoryLabels[currentCategory as keyof typeof categoryLabels] || currentCategory;
          pdf.text(categoryLabel.toUpperCase(), margin, yPos);
          yPos += 8;
        }

        checkPageBreak(30);

        // Bookmark item
        const typeLabel = bookmark.type === 'insight' ? '💡' : '📖';
        
        // Path
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        const pathParts = [bookmark.topicName, ...bookmark.subTopicPath.map(s => s.name)];
        const pathText = pathParts.join(' → ');
        pdf.text(`${typeLabel}  ${pathText}`, margin + 2, yPos);
        yPos += 5;

        // Title
        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        const titleLines = pdf.splitTextToSize(bookmark.title, contentWidth - 5);
        pdf.text(titleLines, margin + 2, yPos);
        yPos += titleLines.length * 5 + 2;

        // Content
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const contentLines = pdf.splitTextToSize(bookmark.content, contentWidth - 5);
        pdf.text(contentLines, margin + 2, yPos);
        yPos += contentLines.length * 4 + 8;
      });

      // Footer on all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages} • Lenny's Podcast Knowledge Map - Saved Insights`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      const filename = `saved-insights-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
      toast({
        title: 'Bookmarks exported',
        description: `${bookmarks.length} saved insight${bookmarks.length > 1 ? 's' : ''} exported to PDF`,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: 'Export failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  return { exportBookmarksToPdf, isExporting };
}
