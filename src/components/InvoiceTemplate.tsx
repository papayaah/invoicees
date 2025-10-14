import { InvoiceData, InvoiceLayout } from '@/types/invoice';
import { MinimalistLayout } from './layouts/MinimalistLayout';
import { LeftHeaderLayout } from './layouts/LeftHeaderLayout';
import { CenteredLayout } from './layouts/CenteredLayout';
import { CompactGridLayout } from './layouts/CompactGridLayout';

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  layout: InvoiceLayout;
}

export function InvoiceTemplate({ invoice, layout }: InvoiceTemplateProps) {
  const renderLayout = () => {
    switch (layout) {
      case 'minimalist':
        return <MinimalistLayout invoice={invoice} />;
      case 'leftHeader':
        return <LeftHeaderLayout invoice={invoice} />;
      case 'centered':
        return <CenteredLayout invoice={invoice} />;
      case 'compactGrid':
        return <CompactGridLayout invoice={invoice} />;
      default:
        return <MinimalistLayout invoice={invoice} />;
    }
  };

  return (
    <div id="invoice-template" style={{ background: '#ffffff' }}>
      {renderLayout()}
    </div>
  );
}

