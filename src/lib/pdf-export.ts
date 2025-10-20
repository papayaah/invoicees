import { track } from '@vercel/analytics';
import type { InvoiceData } from '@/types/invoice';

// Lightweight HTML snapshot export without external libs
export async function exportInvoices(invoices: InvoiceData[], filename: string = 'invoices.pdf') {
  // Open a print window that contains clones of the actual rendered invoice nodes, with inline styles
  const printWin = window.open('', '_blank');
  if (!printWin) throw new Error('Popup blocked');

  // Helper: deep-clone element and inline computed styles
  const cloneWithStyles = (source: HTMLElement): HTMLElement => {
    const cloned = source.cloneNode(false) as HTMLElement;
    const computed = window.getComputedStyle(source);
    cloned.setAttribute('style', computed.cssText || Array.from(computed).map(k => `${k}: ${computed.getPropertyValue(k)};`).join(' '));
    // Replace inputs/textarea with static divs
    if (source.tagName === 'TEXTAREA') {
      const div = document.createElement('div');
      div.textContent = (source as HTMLTextAreaElement).value;
      div.setAttribute('style', cloned.getAttribute('style') || '');
      return div;
    }
    if (source.tagName === 'INPUT') {
      const span = document.createElement('span');
      span.textContent = (source as HTMLInputElement).value;
      span.setAttribute('style', cloned.getAttribute('style') || '');
      return span;
    }
    Array.from(source.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        cloned.appendChild(cloneWithStyles(child as HTMLElement));
      } else if (child.nodeType === Node.TEXT_NODE) {
        cloned.appendChild(child.cloneNode(false));
      }
    });
    return cloned;
  };

  // Build HTML skeleton
  const doc = printWin.document;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${filename}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 12mm; }
    * {
      box-sizing: border-box;
    }
    body { 
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: white;
    }
    .page { 
      page-break-after: always;
      min-height: 297mm;
      width: 100%;
      padding: 0;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    /* Container for scaled content */
    .fit { 
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 186mm; /* A4 width minus margins */
      margin: 0 auto;
    }
    /* The actual invoice content wrapper */
    .invoice-wrapper {
      transform-origin: center center;
      width: 100%;
    }
    /* Hide focus/inputs visuals */
    input, textarea, button { display: none !important; }
    .page * { caret-color: transparent !important; }
  </style>
  </head><body></body></html>`);

  // Append each invoice clone into its own page section
  const PX_PER_MM = 3.7795275591;
  const printableHeightPx = (297 - 24) * PX_PER_MM; // A4 minus 12mm top/bottom

  for (const inv of invoices) {
    const src = document.getElementById(`invoice-${inv.id}`) as HTMLElement | null;
    const section = doc.createElement('section');
    section.className = 'page';
    
    if (src) {
      // Get dimensions from original element in current window
      const originalRect = src.getBoundingClientRect();
      
      const cloned = cloneWithStyles(src);
      
      // Create wrapper for proper centering
      const wrapper = doc.createElement('div');
      wrapper.className = 'fit';
      
      const invoiceWrapper = doc.createElement('div');
      invoiceWrapper.className = 'invoice-wrapper';
      invoiceWrapper.appendChild(cloned);
      
      // Calculate scale based on original dimensions
      const desiredBaseScale = inv.items.length <= 10 ? 0.75 : 0.85;
      let scale = desiredBaseScale;
      
      if (originalRect.height * scale > printableHeightPx) {
        scale = Math.min(scale, (printableHeightPx - 20) / originalRect.height);
      }
      
      // Apply scaling
      invoiceWrapper.style.transform = `scale(${scale})`;
      invoiceWrapper.style.transformOrigin = 'center center';
      
      wrapper.appendChild(invoiceWrapper);
      section.appendChild(wrapper);
      doc.body.appendChild(section);
    } else {
      // Fallback text if not found
      const div = doc.createElement('div');
      div.textContent = 'Invoice content not found';
      div.style.textAlign = 'center';
      section.appendChild(div);
      doc.body.appendChild(section);
    }
  }

  // Close document to finalize content
  doc.close();

  // Wait a bit for rendering, then print
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Close window after print dialog is closed (whether printed or cancelled)
  printWin.onafterprint = () => {
    printWin.close();
  };
  
  // Also close if user closes the window directly
  printWin.onbeforeunload = () => {
    printWin.close();
  };
  
  printWin.print();

  track('pdf_export', { filename, count: invoices.length, engine: 'print-clone', timestamp: new Date().toISOString() });
}

