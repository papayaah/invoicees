import { InvoiceData, InvoiceLayout } from '@/types/invoice';
import { MinimalistLayout } from './layouts/MinimalistLayout';
import { LeftHeaderLayout } from './layouts/LeftHeaderLayout';
import { CenteredLayout } from './layouts/CenteredLayout';
import { CompactGridLayout } from './layouts/CompactGridLayout';

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  layout: InvoiceLayout;
  onUpdate?: (id: string, updates: Partial<InvoiceData>) => void;
  isGenerating?: boolean;
}

export function InvoiceTemplate({ invoice, layout, onUpdate, isGenerating = false }: InvoiceTemplateProps) {
  const renderLayout = () => {
    switch (layout) {
      case 'minimalist':
        return <MinimalistLayout invoice={invoice} onUpdate={onUpdate} isGenerating={isGenerating} />;
      case 'leftHeader':
        return <LeftHeaderLayout invoice={invoice} onUpdate={onUpdate} isGenerating={isGenerating} />;
      case 'centered':
        return <CenteredLayout invoice={invoice} onUpdate={onUpdate} isGenerating={isGenerating} />;
      case 'compactGrid':
        return <CompactGridLayout invoice={invoice} onUpdate={onUpdate} isGenerating={isGenerating} />;
      default:
        return <MinimalistLayout invoice={invoice} onUpdate={onUpdate} isGenerating={isGenerating} />;
    }
  };

  return (
    <div id={`invoice-${invoice.id}`} style={{ background: '#ffffff' }}>
      {renderLayout()}
    </div>
  );
}

