import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';
import { hasPaymentDetails } from '@/lib/utils';
import { BusinessInfo } from '@/components/invoices/BusinessInfo';
import { ClientInfo } from '@/components/invoices/ClientInfo';
import { PaymentDetails } from '@/components/invoices/PaymentDetails';
import { InvoiceItemsTable } from '@/components/invoices/InvoiceItemsTable';
import { Notes } from '@/components/invoices/Notes';

interface CompactGridLayoutProps {
  invoice: InvoiceData;
  onUpdate?: (id: string, updates: Partial<InvoiceData>) => void;
  isGenerating?: boolean;
}

export function CompactGridLayout({ invoice, onUpdate, isGenerating = false }: CompactGridLayoutProps) {
  const handleUpdate = (field: keyof InvoiceData, value: string) => {
    if (onUpdate && invoice.id) {
      onUpdate(invoice.id, { [field]: value });
    }
  };

  // Check if payment details have any content
  const hasPaymentDetailsContent = hasPaymentDetails(invoice);

  const total = calculateTotal(invoice.items);

  const inputStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    padding: '2px 4px',
    margin: '-2px -4px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    transition: 'background 0.15s ease',
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Header Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          background: '#fce7f3',
          padding: '20px',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            color: '#9f1239',
            marginBottom: '8px',
          }}>INVOICE</div>
          <div style={{ fontSize: '16px', color: '#881337', fontWeight: '600' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div style={{ background: '#ddd6fe', padding: '20px' }}>
          <BusinessInfo
            invoice={invoice}
            onUpdate={handleUpdate}
            inputHoverColor="rgba(91, 33, 182, 0.15)"
            isLoading={isGenerating}
            styles={{
              label: {
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#5b21b6',
                marginBottom: '8px',
              },
              content: { fontSize: '15px', color: '#4c1d95', lineHeight: '1.6' },
              nameStyle: { fontWeight: '600' },
              fieldStyle: { fontSize: '14px' },
              addressStyle: {},
            }}
          />
        </div>

        <div style={{ background: '#ccfbf1', padding: '20px' }}>
          <ClientInfo
            invoice={invoice}
            onUpdate={handleUpdate}
            inputHoverColor="rgba(17, 94, 89, 0.15)"
            isLoading={isGenerating}
            styles={{
              label: {
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#115e59',
                marginBottom: '8px',
              },
              content: { fontSize: '15px', color: '#134e4a', lineHeight: '1.6' },
              nameStyle: { fontWeight: '600' },
              fieldStyle: { fontSize: '14px' },
              addressStyle: {},
            }}
          />
        </div>
      </div>

      {/* Address Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          background: '#f5f3ff',
          padding: '15px',
          fontSize: '15px',
          color: '#5b21b6',
          lineHeight: '1.6',
        }}>
          <div>
            <input
              type="text"
              value={invoice.businessAddress}
              onChange={(e) => handleUpdate('businessAddress', (e.target as HTMLInputElement).value)}
              placeholder="Business address"
              style={inputStyle}
              onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: 'rgba(91, 33, 182, 0.1)', borderRadius: '3px' })}
              onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
            />
          </div>
          <div>
            Tel: <input
              type="tel"
              value={invoice.businessPhone}
              onChange={(e) => handleUpdate('businessPhone', (e.target as HTMLInputElement).value)}
              placeholder="Phone"
              style={{ ...inputStyle, width: 'calc(100% - 35px)', display: 'inline-block' }}
              onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: 'rgba(91, 33, 182, 0.1)', borderRadius: '3px' })}
              onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
            />
          </div>
        </div>
        <div style={{
          background: '#f0fdfa',
          padding: '15px',
          fontSize: '15px',
          color: '#115e59',
          lineHeight: '1.6',
        }}>
          <div>
            <input
              type="text"
              value={invoice.clientAddress}
              onChange={(e) => handleUpdate('clientAddress', (e.target as HTMLInputElement).value)}
              placeholder="Client address"
              style={inputStyle}
              onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: 'rgba(17, 94, 89, 0.1)', borderRadius: '3px' })}
              onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
            />
          </div>
          <div>
            Tel: <input
              type="tel"
              value={invoice.clientPhone}
              onChange={(e) => handleUpdate('clientPhone', (e.target as HTMLInputElement).value)}
              placeholder="Phone"
              style={{ ...inputStyle, width: 'calc(100% - 35px)', display: 'inline-block' }}
              onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: 'rgba(17, 94, 89, 0.1)', borderRadius: '3px' })}
              onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
            />
          </div>
        </div>
      </div>

      {/* Items Compact Table */}
      <div style={{ background: '#fafafa', padding: '20px', marginBottom: '20px' }}>
        <InvoiceItemsTable
          items={invoice.items}
          isLoading={isGenerating}
          styles={{
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '15px',
            },
            headerRow: { borderBottom: '2px solid #e5e5e5' },
            headerCell: {
              textAlign: 'left',
              padding: '10px 0',
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '1px',
              color: '#737373',
            },
            bodyRow: { borderBottom: '1px solid #f5f5f5' },
            descriptionCell: { padding: '12px 0', color: '#262626' },
            quantityCell: { textAlign: 'center', padding: '12px', color: '#525252' },
            priceCell: { textAlign: 'right', padding: '12px', color: '#525252', width: '100px' },
            totalCell: { textAlign: 'right', padding: '12px 0', color: '#262626', fontWeight: '600', width: '100px' },
          }}
        />
      </div>

      {/* Footer Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '20px',
      }}>
        {/* Payment Info */}
        {hasPaymentDetailsContent && (
          <div>
            <div style={{ background: '#fff7ed', padding: '15px' }}>
              <PaymentDetails
                invoice={invoice}
                onUpdate={handleUpdate}
                inputHoverColor="rgba(154, 52, 18, 0.1)"
                isLoading={isGenerating}
                compact={true}
                labelText="PAYMENT"
                styles={{
                  label: {
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: '#9a3412',
                    marginBottom: '8px',
                  },
                  content: { fontSize: '15px', color: '#7c2d12', lineHeight: '1.6' },
                  fieldStyle: {},
                  textareaStyle: { marginTop: '8px' },
                }}
              />
            </div>
          </div>
        )}
        <Notes 
          invoice={invoice}
          styles={{
            container: { 
              background: '#fef9c3',
              padding: '15px',
              marginTop: hasPaymentDetailsContent ? '10px' : '0',
            },
            label: { 
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1px',
              color: '#713f12',
            },
            content: { 
              fontSize: '12px', 
              color: '#854d0e',
              lineHeight: '1.6',
            },
          }}
        />
        
        {/* Total */}
        <div style={{
          background: '#18181b',
          color: 'white',
          padding: '20px 30px',
          minWidth: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '8px',
            opacity: 0.7,
          }}>TOTAL DUE</div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
          }}>
            ${formatCurrency(total)}
          </div>
        </div>
      </div>
    </div>
  );
}

