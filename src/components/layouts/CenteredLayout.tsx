import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';

interface CenteredLayoutProps {
  invoice: InvoiceData;
}

export function CenteredLayout({ invoice }: CenteredLayoutProps) {
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
      {(invoice.businessName || invoice.businessEmail || invoice.businessPhone || invoice.businessAddress) && (
        <div style={{
          background: '#fef3c7',
          padding: '30px',
          marginBottom: '30px',
        }}>
          {invoice.businessName && (
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '10px',
            }}>
              {invoice.businessName}
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.8' }}>
            {invoice.businessEmail && <div>{invoice.businessEmail}</div>}
            {invoice.businessPhone && <div>{invoice.businessPhone}</div>}
            {invoice.businessAddress && <div>{invoice.businessAddress}</div>}
          </div>
        </div>
      )}

      {/* Client Info */}
      {(invoice.clientName || invoice.clientEmail || invoice.clientPhone || invoice.clientAddress) && (
        <div style={{
          background: '#dbeafe',
          padding: '30px',
          marginBottom: '40px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#1e40af',
            marginBottom: '10px',
          }}>BILLED TO</div>
          {invoice.clientName && (
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e3a8a',
              marginBottom: '8px',
            }}>
              {invoice.clientName}
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.8' }}>
            {invoice.clientEmail && <div>{invoice.clientEmail}</div>}
            {invoice.clientPhone && <div>{invoice.clientPhone}</div>}
            {invoice.clientAddress && <div>{invoice.clientAddress}</div>}
          </div>
        </div>
      )}

      {/* Items */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        marginBottom: '30px',
      }}>
        <thead>
          <tr style={{ borderBottom: '3px solid #e5e7eb' }}>
            <th style={{
              textAlign: 'left',
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: '#6b7280',
            }}>ITEM</th>
            <th style={{
              textAlign: 'center',
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: '#6b7280',
            }}>QTY</th>
            <th style={{
              textAlign: 'right',
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: '#6b7280',
            }}>PRICE</th>
            <th style={{
              textAlign: 'right',
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '11px',
              letterSpacing: '1.5px',
              color: '#6b7280',
            }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => {
            const quantity = item.quantity || 0;
            const unitPrice = item.unitPrice || 0;
            const total = quantity * unitPrice;
            
            return (
              <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '18px 0', color: '#374151', textAlign: 'left' }}>
                  {item.description}
                </td>
                <td style={{ padding: '18px 0', color: '#6b7280', textAlign: 'center' }}>
                  {quantity}
                </td>
                <td style={{ padding: '18px 0', color: '#6b7280', textAlign: 'right' }}>
                  ${formatCurrency(unitPrice)}
                </td>
                <td style={{ padding: '18px 0', color: '#374151', fontWeight: '600', textAlign: 'right' }}>
                  ${formatCurrency(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
      {(invoice.bankName || invoice.bankAccountNumber || invoice.paymentInstructions) && (
        <div style={{
          background: '#f3f4f6',
          padding: '25px',
          marginBottom: '30px',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#6b7280',
            marginBottom: '12px',
          }}>PAYMENT INFORMATION</div>
          <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.8' }}>
            {invoice.bankName && <div>Bank: {invoice.bankName}</div>}
            {invoice.bankAccountNumber && <div>Account: {invoice.bankAccountNumber}</div>}
            {invoice.bankAccountType && <div>Type: {invoice.bankAccountType}</div>}
            {invoice.bankBranch && <div>Branch: {invoice.bankBranch}</div>}
            {invoice.paymentInstructions && (
              <div style={{ marginTop: invoice.bankName || invoice.bankAccountNumber ? '12px' : '0', whiteSpace: 'pre-line' }}>
                {invoice.paymentInstructions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#6b7280',
            marginBottom: '12px',
          }}>NOTES</div>
          <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
            {invoice.notes}
          </div>
        </div>
      )}
    </div>
  );
}

