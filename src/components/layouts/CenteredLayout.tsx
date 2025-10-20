import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';
import { hasPaymentDetails } from '@/lib/utils';
import { BusinessInfo } from '@/components/invoices/BusinessInfo';
import { ClientInfo } from '@/components/invoices/ClientInfo';
import { PaymentDetails } from '@/components/invoices/PaymentDetails';
import { InvoiceItemsTable } from '@/components/invoices/InvoiceItemsTable';
import { Notes } from '@/components/invoices/Notes';

interface CenteredLayoutProps {
  invoice: InvoiceData;
  onUpdate?: (id: string, updates: Partial<InvoiceData>) => void;
  isGenerating?: boolean;
}

export function CenteredLayout({ invoice, onUpdate, isGenerating = false }: CenteredLayoutProps) {
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
      padding: '60px',
      maxWidth: '700px',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: '300',
        margin: '0 0 10px 0',
        color: '#374151',
        letterSpacing: '2px',
      }}>INVOICE</h1>

      <div style={{
        fontSize: '14px',
        color: '#9ca3af',
        marginBottom: '50px',
      }}>
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Business Info */}
      <div style={{ background: '#fef3c7', padding: '30px', marginBottom: '30px', textAlign: 'center' }}>
        <BusinessInfo
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(120, 53, 15, 0.1)"
          isLoading={isGenerating}
          styles={{
            content: { fontSize: '14px', color: '#78350f', lineHeight: '1.8' },
            nameStyle: { fontSize: '20px', fontWeight: '600', color: '#92400e', marginBottom: '10px', textAlign: 'center' },
            fieldStyle: { textAlign: 'center' },
            addressStyle: { textAlign: 'center' },
          }}
        />
      </div>

      {/* Client Info */}
      <div style={{ background: '#dbeafe', padding: '30px', marginBottom: '40px', textAlign: 'center' }}>
        <ClientInfo
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(30, 64, 175, 0.1)"
          isLoading={isGenerating}
          labelText="BILLED TO"
          styles={{
            label: {
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#1e40af',
              marginBottom: '10px',
            },
            content: { fontSize: '14px', color: '#1e40af', lineHeight: '1.8' },
            nameStyle: { fontSize: '18px', fontWeight: '600', color: '#1e3a8a', marginBottom: '8px', textAlign: 'center' },
            fieldStyle: { textAlign: 'center' },
            addressStyle: { textAlign: 'center' },
          }}
        />
      </div>

      {/* Items */}
      <InvoiceItemsTable
        items={invoice.items}
        isLoading={isGenerating}
        styles={{
          table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            marginBottom: '30px',
          },
          headerRow: { borderBottom: '3px solid #e5e7eb' },
          headerCell: {
            textAlign: 'left',
            padding: '12px 0',
            fontWeight: '700',
            fontSize: '11px',
            letterSpacing: '1.5px',
            color: '#6b7280',
          },
          bodyRow: { borderBottom: '1px solid #f3f4f6' },
          descriptionCell: { padding: '18px 0', color: '#374151', textAlign: 'left' },
          quantityCell: { padding: '18px 0', color: '#6b7280', textAlign: 'center' },
          priceCell: { padding: '18px 0', color: '#6b7280', textAlign: 'right' },
          totalCell: { padding: '18px 0', color: '#374151', fontWeight: '600', textAlign: 'right' },
        }}
      />

      {/* Total */}
      <div style={{
        background: '#374151',
        color: 'white',
        padding: '25px',
        marginBottom: '40px',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
        }}>
          TOTAL: ${formatCurrency(total)}
        </div>
      </div>

      {/* Payment Details */}
      {hasPaymentDetailsContent && (
        <div style={{ background: '#f3f4f6', padding: '25px', marginBottom: '30px', textAlign: 'left' }}>
          <PaymentDetails
            invoice={invoice}
            onUpdate={handleUpdate}
            inputHoverColor="rgba(75, 85, 99, 0.1)"
            isLoading={isGenerating}
            labelText="PAYMENT INFORMATION"
            styles={{
              label: {
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                color: '#6b7280',
                marginBottom: '12px',
              },
              content: { fontSize: '13px', color: '#4b5563', lineHeight: '1.8' },
              fieldStyle: {},
              textareaStyle: { marginTop: '12px' },
            }}
          />
        </div>
      )}

      {/* Notes */}
      <Notes 
        invoice={invoice}
        styles={{
          container: { textAlign: 'left' },
          label: { 
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#6b7280',
          },
          content: { 
            fontSize: '13px', 
            color: '#6b7280' 
          },
        }}
      />
    </div>
  );
}

