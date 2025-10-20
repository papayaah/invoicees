import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';
import { hasPaymentDetails } from '@/lib/utils';
import { BusinessInfo } from '@/components/invoices/BusinessInfo';
import { ClientInfo } from '@/components/invoices/ClientInfo';
import { PaymentDetails } from '@/components/invoices/PaymentDetails';
import { InvoiceItemsTable } from '@/components/invoices/InvoiceItemsTable';
import { Notes } from '@/components/invoices/Notes';

interface MinimalistLayoutProps {
  invoice: InvoiceData;
  onUpdate?: (id: string, updates: Partial<InvoiceData>) => void;
  isGenerating?: boolean;
}

export function MinimalistLayout({ invoice, onUpdate, isGenerating = false }: MinimalistLayoutProps) {
  const handleUpdate = (field: keyof InvoiceData, value: string) => {
    if (onUpdate && invoice.id) {
      onUpdate(invoice.id, { [field]: value });
    }
  };

  // Check if payment details have any content
  const hasPaymentDetailsContent = hasPaymentDetails(invoice);

  const total = calculateTotal(invoice.items);

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '300',
          margin: 0,
          marginBottom: '6px',
          color: '#1a202c',
        }}>INVOICE</h1>
        <div style={{ fontSize: '14px', color: '#718096' }}>
          {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Business and Client Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginBottom: '20px',
      }}>
        <BusinessInfo
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(0, 0, 0, 0.02)"
          isLoading={isGenerating}
          styles={{
            label: {
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              color: '#a0aec0',
              marginBottom: '12px',
            },
            content: {
              fontSize: '14px',
              lineHeight: '1.8',
            },
            nameStyle: {
              fontWeight: '600',
              color: '#1a202c',
            },
            fieldStyle: {},
            addressStyle: {
              marginTop: '8px',
              color: '#718096',
            },
          }}
        />

        <ClientInfo
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(0, 0, 0, 0.02)"
          isLoading={isGenerating}
          styles={{
            label: {
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              color: '#a0aec0',
              marginBottom: '12px',
            },
            content: {
              fontSize: '14px',
              lineHeight: '1.8',
            },
            nameStyle: {
              fontWeight: '600',
              color: '#1a202c',
            },
            fieldStyle: {},
            addressStyle: {
              marginTop: '8px',
              color: '#718096',
            },
          }}
        />
      </div>

      {/* Items Table */}
      <InvoiceItemsTable
        items={invoice.items}
        isLoading={isGenerating}
        skeletonRows={3}
        styles={{
          container: { marginBottom: '40px' },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '15px',
          },
          headerRow: { borderBottom: '2px solid #e2e8f0' },
          headerCell: {
            textAlign: 'left',
            padding: '12px 0',
            fontWeight: '600',
            fontSize: '13px',
            letterSpacing: '1px',
            color: '#a0aec0',
          },
          bodyRow: { borderBottom: '1px solid #f7fafc' },
          descriptionCell: { padding: '16px 0', color: '#2d3748', fontSize: '15px' },
          quantityCell: { textAlign: 'right', padding: '16px 0', color: '#718096', fontSize: '15px' },
          priceCell: { textAlign: 'right', padding: '16px 0', color: '#718096', fontSize: '15px' },
          totalCell: { textAlign: 'right', padding: '16px 0', color: '#2d3748', fontWeight: '500', fontSize: '15px' },
        }}
      />

      {/* Total */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '200px',
          borderTop: '2px solid #2d3748',
          paddingTop: '16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a202c',
          }}>
            <span>TOTAL</span>
            <span>${formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {hasPaymentDetailsContent && (
        <PaymentDetails
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(0, 0, 0, 0.02)"
          isLoading={isGenerating}
          styles={{
            container: { marginBottom: '15px' },
            label: {
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
              color: '#a0aec0',
              marginBottom: '12px',
            },
            content: {
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#718096',
            },
            fieldStyle: {},
            textareaStyle: { marginTop: '12px' },
          }}
        />
      )}

      {/* Notes */}
      <Notes 
        invoice={invoice}
        styles={{
          container: { marginTop: '15px' },
          label: { color: '#a0aec0' },
          content: { color: '#718096' },
        }}
      />
    </div>
  );
}

