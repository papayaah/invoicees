import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';
import { hasPaymentDetails } from '@/lib/utils';
import { BusinessInfo } from '@/components/invoices/BusinessInfo';
import { ClientInfo } from '@/components/invoices/ClientInfo';
import { PaymentDetails } from '@/components/invoices/PaymentDetails';
import { InvoiceItemsTable } from '@/components/invoices/InvoiceItemsTable';
import { Notes } from '@/components/invoices/Notes';

interface LeftHeaderLayoutProps {
  invoice: InvoiceData;
  onUpdate?: (id: string, updates: Partial<InvoiceData>) => void;
  isGenerating?: boolean;
}

export function LeftHeaderLayout({ invoice, onUpdate, isGenerating = false }: LeftHeaderLayoutProps) {
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
      display: 'grid',
      gridTemplateColumns: 'minmax(200px, 250px) 1fr',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left Sidebar */}
      <div style={{
        background: '#e0e7ff',
        padding: '40px 20px',
        color: '#1e293b',
        minWidth: '0',
        overflowWrap: 'break-word',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 40px 0',
          color: '#3730a3',
        }}>INVOICE</h1>

        <BusinessInfo
          invoice={invoice}
          onUpdate={handleUpdate}
          inputHoverColor="rgba(255, 255, 255, 0.15)"
          isLoading={isGenerating}
          styles={{
            container: { marginBottom: '40px' },
            label: {
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#6366f1',
              marginBottom: '12px',
            },
            content: {
              fontSize: '13px',
              lineHeight: '1.8',
            },
            nameStyle: { fontWeight: '600' },
            fieldStyle: {},
            addressStyle: { marginTop: '8px', fontSize: '12px', opacity: 0.8 },
          }}
        />

        {hasPaymentDetailsContent && (
          <PaymentDetails
            invoice={invoice}
            onUpdate={handleUpdate}
            inputHoverColor="rgba(255, 255, 255, 0.15)"
            isLoading={isGenerating}
            compact={true}
            labelText="PAYMENT"
            styles={{
              label: {
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                color: '#6366f1',
                marginBottom: '12px',
              },
              content: {
                fontSize: '12px',
                lineHeight: '1.8',
              },
              fieldStyle: {},
              textareaStyle: { marginTop: '8px' },
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '40px 20px',
        minWidth: '0',
        overflow: 'auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '50px',
        }}>
          <ClientInfo
            invoice={invoice}
            onUpdate={handleUpdate}
            inputHoverColor="rgba(0, 0, 0, 0.02)"
            isLoading={isGenerating}
            labelText="BILL TO"
            styles={{
              label: {
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                color: '#94a3b8',
                marginBottom: '12px',
              },
              content: {
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#1e293b',
              },
              nameStyle: { fontWeight: '600' },
              fieldStyle: {},
              addressStyle: { marginTop: '8px', color: '#64748b' },
            }}
          />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {new Date().toLocaleDateString('en-US')}
            </div>
          </div>
        </div>

        <InvoiceItemsTable
          items={invoice.items}
          isLoading={isGenerating}
          styles={{
            container: { 
              overflowX: 'auto',
              marginBottom: '30px',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              minWidth: '500px',
            },
            headerRow: { background: '#f1f5f9' },
            headerCell: {
              textAlign: 'left',
              padding: '14px 16px',
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '1.5px',
              color: '#475569',
            },
            bodyRow: { borderBottom: '1px solid #f1f5f9' },
            descriptionCell: { padding: '16px', color: '#1e293b' },
            quantityCell: { textAlign: 'center', padding: '16px', color: '#64748b' },
            priceCell: { textAlign: 'right', padding: '16px', color: '#64748b' },
            totalCell: { textAlign: 'right', padding: '16px', color: '#1e293b', fontWeight: '600' },
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            background: '#3730a3',
            color: 'white',
            padding: '20px 30px',
            minWidth: '200px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              fontWeight: '700',
            }}>
              <span>TOTAL</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <Notes 
          invoice={invoice}
          styles={{
            container: { marginTop: '40px' },
            label: { 
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#94a3b8',
            },
            content: { 
              fontSize: '13px', 
              color: '#64748b' 
            },
          }}
        />
      </div>
    </div>
  );
}

