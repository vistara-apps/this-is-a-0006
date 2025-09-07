import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename?: string;
  format?: 'pdf' | 'png' | 'json';
  includeTimestamp?: boolean;
}

// Export Lean Canvas to PDF
export async function exportLeanCanvasToPDF(
  canvasData: any,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'lean-canvas',
    includeTimestamp = true
  } = options;

  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Lean Canvas', pageWidth / 2, 20, { align: 'center' });

  // Canvas sections layout
  const sections = [
    { key: 'problem', title: 'Problem', x: 10, y: 35, w: 50, h: 40 },
    { key: 'solution', title: 'Solution', x: 70, y: 35, w: 50, h: 40 },
    { key: 'uniqueValueProposition', title: 'Unique Value Proposition', x: 130, y: 35, w: 50, h: 40 },
    { key: 'unfairAdvantage', title: 'Unfair Advantage', x: 190, y: 35, w: 50, h: 40 },
    { key: 'customerSegments', title: 'Customer Segments', x: 250, y: 35, w: 40, h: 40 },
    
    { key: 'keyMetrics', title: 'Key Metrics', x: 10, y: 85, w: 50, h: 40 },
    { key: 'channels', title: 'Channels', x: 70, y: 85, w: 50, h: 40 },
    { key: 'costStructure', title: 'Cost Structure', x: 130, y: 85, w: 80, h: 40 },
    { key: 'revenueStreams', title: 'Revenue Streams', x: 220, y: 85, w: 70, h: 40 },
  ];

  // Draw sections
  sections.forEach(section => {
    // Draw border
    pdf.rect(section.x, section.y, section.w, section.h);
    
    // Section title
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, section.x + 2, section.y + 8);
    
    // Section content
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const content = canvasData[section.key] || '';
    const lines = pdf.splitTextToSize(content, section.w - 4);
    pdf.text(lines, section.x + 2, section.y + 15);
  });

  // Add timestamp if requested
  if (includeTimestamp) {
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 10, pageHeight - 10);
  }

  // Save the PDF
  const finalFilename = includeTimestamp 
    ? `${filename}-${new Date().toISOString().split('T')[0]}.pdf`
    : `${filename}.pdf`;
  
  pdf.save(finalFilename);
}

// Export Pitch Deck to PDF
export async function exportPitchDeckToPDF(
  slides: any[],
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'pitch-deck',
    includeTimestamp = true
  } = options;

  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  slides.forEach((slide, index) => {
    if (index > 0) {
      pdf.addPage();
    }

    // Slide title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(slide.title, pageWidth / 2, 30, { align: 'center' });

    // Slide content
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(slide.content, pageWidth - 40);
    pdf.text(lines, 20, 50);

    // Slide number
    pdf.setFontSize(10);
    pdf.text(`${index + 1} / ${slides.length}`, pageWidth - 30, pageHeight - 10);
  });

  // Save the PDF
  const finalFilename = includeTimestamp 
    ? `${filename}-${new Date().toISOString().split('T')[0]}.pdf`
    : `${filename}.pdf`;
  
  pdf.save(finalFilename);
}

// Export element as image
export async function exportElementAsImage(
  elementId: string,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'export',
    format = 'png',
    includeTimestamp = true
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
    });

    // Create download link
    const link = document.createElement('a');
    link.download = includeTimestamp 
      ? `${filename}-${new Date().toISOString().split('T')[0]}.${format}`
      : `${filename}.${format}`;
    
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  } catch (error) {
    console.error('Error exporting element as image:', error);
    throw error;
  }
}

// Export data as JSON
export function exportAsJSON(
  data: any,
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    includeTimestamp = true
  } = options;

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = includeTimestamp 
    ? `${filename}-${new Date().toISOString().split('T')[0]}.json`
    : `${filename}.json`;
  
  link.href = url;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Utility function to format business concept for export
export function formatBusinessConceptForExport(concept: any) {
  return {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      appName: 'ConceptCraft AI'
    },
    businessConcept: {
      id: concept.conceptId,
      problemStatement: concept.problemStatement,
      solutionStatement: concept.solutionStatement,
      targetPersona: concept.targetPersonaDescription,
      leanCanvas: concept.leanCanvasData,
      pitchDeck: concept.pitchDeckSlidesData,
      createdAt: concept.createdAt,
      updatedAt: concept.updatedAt
    }
  };
}
