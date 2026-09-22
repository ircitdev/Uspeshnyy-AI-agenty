import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReadinessPdfData {
  score: number;
  level: 'low' | 'moderate' | 'high';
  levelBadge: string;
  title: string;
  summary: string;
  recommendedAgent: string;
  nextSteps: string[];
  pillarScores: {
    crm: number;
    knowledge: number;
    roi: number;
  };
  answers: Array<{
    questionTitle: string;
    category: string;
    selectedOptionLabel: string;
    selectedOptionDesc?: string;
  }>;
}

export async function downloadReadinessPdf(
  element: HTMLElement,
  fileName: string = 'AI-Readiness-Plan.pdf'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 800,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // If content fits within one A4 page or needs multiple pages
  if (totalPdfHeight <= pdfHeight) {
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, totalPdfHeight);
  } else {
    let position = 0;
    let remainingHeight = totalPdfHeight;

    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight);
      remainingHeight -= pdfHeight;
      position -= pdfHeight;

      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }
  }

  pdf.save(fileName);
}
