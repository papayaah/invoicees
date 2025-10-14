import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { track } from '@vercel/analytics';

/**
 * Export invoice to PDF
 */
export async function exportInvoiceToPDF(elementId: string, filename: string = 'invoice.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Invoice element not found');
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);

    // Track export event
    track('pdf_export', {
      filename,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export invoice to PDF');
  }
}

