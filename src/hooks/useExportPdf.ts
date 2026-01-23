import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Topic, SubTopic, categoryLabels, normalizeDeepDivePoint } from '@/data/knowledgeMap';
import { useToast } from '@/hooks/use-toast';

type ViewableContent = Topic | SubTopic;

interface ExportOptions {
  topic: Topic;
  currentContent: ViewableContent;
  subTopicPath: SubTopic[];
  includeDeepDive?: boolean;
}

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToPdf = useCallback(async (options: ExportOptions) => {
    const { topic, currentContent, subTopicPath, includeDeepDive = true } = options;
    
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

      // Category label
      const category = 'category' in topic ? topic.category : 'strategy';
      const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || category;
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const pathText = subTopicPath.length > 0 
        ? `${categoryLabel} → ${topic.name} → ${subTopicPath.map(s => s.name).join(' → ')}`
        : `${categoryLabel} → ${topic.name}`;
      pdf.text(pathText, margin, yPos);
      yPos += 10;

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(30, 30, 30);
      const titleLines = pdf.splitTextToSize(currentContent.name, contentWidth);
      pdf.text(titleLines, margin, yPos);
      yPos += titleLines.length * 10 + 5;

      // Description
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      const descLines = pdf.splitTextToSize(currentContent.description, contentWidth);
      pdf.text(descLines, margin, yPos);
      yPos += descLines.length * 6 + 10;

      // Episode count if available
      if ('episodeCount' in currentContent && typeof currentContent.episodeCount === 'number') {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`${currentContent.episodeCount} episodes`, margin, yPos);
        yPos += 10;
      }

      // Key Insights Section
      checkPageBreak(20);
      yPos += 5;
      pdf.setFontSize(16);
      pdf.setTextColor(30, 30, 30);
      pdf.text('Key Insights', margin, yPos);
      yPos += 10;

      currentContent.keyInsights.forEach((insight, index) => {
        checkPageBreak(25);
        
        // Insight title
        pdf.setFontSize(12);
        pdf.setTextColor(40, 40, 40);
        const insightTitle = `${index + 1}. ${insight.title}`;
        const titleLines = pdf.splitTextToSize(insightTitle, contentWidth - 5);
        pdf.text(titleLines, margin + 5, yPos);
        yPos += titleLines.length * 5 + 2;

        // Insight summary
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const summaryLines = pdf.splitTextToSize(insight.summary, contentWidth - 10);
        pdf.text(summaryLines, margin + 10, yPos);
        yPos += summaryLines.length * 4 + 6;
      });

      // Deep Dive Section
      if (includeDeepDive && currentContent.deepDive.length > 0) {
        checkPageBreak(20);
        yPos += 10;
        pdf.setFontSize(16);
        pdf.setTextColor(30, 30, 30);
        pdf.text('Deep Dive', margin, yPos);
        yPos += 10;

        currentContent.deepDive.forEach((rawPoint) => {
          const point = normalizeDeepDivePoint(rawPoint);
          const hasBoldHeader = point.text.startsWith('**');
          const parts = hasBoldHeader ? point.text.split('**') : [point.text];
          const header = hasBoldHeader ? parts[1] : null;
          const content = hasBoldHeader ? parts.slice(2).join('').replace(/^:\s*/, '') : point.text;

          checkPageBreak(25);

          if (header) {
            pdf.setFontSize(11);
            pdf.setTextColor(40, 40, 40);
            const headerLines = pdf.splitTextToSize(`• ${header}`, contentWidth - 5);
            pdf.text(headerLines, margin + 5, yPos);
            yPos += headerLines.length * 5 + 2;
          }

          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          const contentLines = pdf.splitTextToSize(content, contentWidth - 10);
          pdf.text(contentLines, margin + 10, yPos);
          yPos += contentLines.length * 4 + 2;

          // Add speaker attribution
          if (point.speaker) {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 180);
            pdf.text(`— ${point.speaker}`, margin + 10, yPos);
            yPos += 6;
          }
          
          yPos += 4;
        });
      }

      // Sub-topics list if available
      if (currentContent.subTopics && currentContent.subTopics.length > 0) {
        checkPageBreak(20);
        yPos += 10;
        pdf.setFontSize(16);
        pdf.setTextColor(30, 30, 30);
        pdf.text('Sub-topics to Explore', margin, yPos);
        yPos += 10;

        currentContent.subTopics.forEach((subTopic) => {
          checkPageBreak(15);
          pdf.setFontSize(11);
          pdf.setTextColor(40, 40, 40);
          pdf.text(`• ${subTopic.name}`, margin + 5, yPos);
          yPos += 5;
          
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          const subDescLines = pdf.splitTextToSize(subTopic.description, contentWidth - 15);
          pdf.text(subDescLines, margin + 10, yPos);
          yPos += subDescLines.length * 4 + 4;
        });
      }

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages} • Generated from Lenny's Podcast Knowledge Map`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Generate filename
      const filename = subTopicPath.length > 0 
        ? `${topic.name}-${subTopicPath[subTopicPath.length - 1].name}.pdf`
        : `${topic.name}.pdf`;
      
      pdf.save(filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase());
      
      toast({
        title: 'PDF exported successfully',
        description: `Saved as ${filename}`,
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

  return { exportToPdf, isExporting };
}
