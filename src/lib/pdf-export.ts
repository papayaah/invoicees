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
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .page { page-break-after: always; }
    /* Ensure the cloned invoice fits within printable width */
    .fit { width: 100%; box-sizing: border-box; }
    /* Hide focus/inputs visuals */
    .page * { caret-color: transparent !important; }
  </style>
  </head><body></body></html>`);
  doc.close();

  // Append each invoice clone into its own page section
  const PX_PER_MM = 3.7795275591;
  const printableHeightPx = (297 - 24) * PX_PER_MM; // A4 minus 12mm top/bottom

  for (const inv of invoices) {
    const src = document.getElementById(`invoice-${inv.id}`) as HTMLElement | null;
    const section = doc.createElement('section');
    section.className = 'page';
    if (src) {
      const cloned = cloneWithStyles(src);
      cloned.classList.add('fit');
      section.appendChild(cloned);
      doc.body.appendChild(section);

      // Compact scaling: shrink invoices with small item counts, and ensure one-page fit
      const desiredBaseScale = inv.items.length <= 10 ? 0.9 : 1;
      const contentRect = cloned.getBoundingClientRect();
      let scale = desiredBaseScale;
      if (contentRect.height * scale > printableHeightPx) {
        scale = Math.min(scale, (printableHeightPx - 8) / contentRect.height);
      }
      if (scale < 1) {
        cloned.style.transformOrigin = 'top left';
        cloned.style.transform = `scale(${scale})`;
        cloned.style.width = `calc(100% / ${scale})`;
      }
      continue;
    } else {
      // Fallback text if not found
      const div = doc.createElement('div');
      div.textContent = 'Invoice content not found';
      section.appendChild(div);
    }
    doc.body.appendChild(section);
  }

  // Print
  printWin.addEventListener('load', () => setTimeout(() => printWin.print(), 50));
  printWin.onafterprint = () => printWin.close();

  track('pdf_export', { filename, count: invoices.length, engine: 'print-clone', timestamp: new Date().toISOString() });
}

