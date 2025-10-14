import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';

interface MinimalistLayoutProps {
  invoice: InvoiceData;
}

export function MinimalistLayout({ invoice }: MinimalistLayoutProps) {
  const total = calculateTotal(invoice.items);

  return (
    <div style={{
      padding: '60px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '300',
          margin: 0,
          marginBottom: '8px',
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
        marginBottom: '60px',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#a0aec0',
            marginBottom: '12px',
          }}>FROM</div>
          <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
            {invoice.businessName && (
              <div style={{ fontWeight: '600', color: '#1a202c' }}>
                {invoice.businessName}
              </div>
            )}
            {invoice.businessEmail && <div>{invoice.businessEmail}</div>}
            {invoice.businessPhone && <div>{invoice.businessPhone}</div>}
            {invoice.businessAddress && (
              <div style={{ marginTop: '8px', color: '#718096' }}>
                {invoice.businessAddress}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#a0aec0',
            marginBottom: '12px',
          }}>TO</div>
          <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
            {invoice.clientName && (
              <div style={{ fontWeight: '600', color: '#1a202c' }}>
                {invoice.clientName}
              </div>
            )}
            {invoice.clientEmail && <div>{invoice.clientEmail}</div>}
            {invoice.clientPhone && <div>{invoice.clientPhone}</div>}
            {invoice.clientAddress && (
              <div style={{ marginTop: '8px', color: '#718096' }}>
                {invoice.clientAddress}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: '40px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{
                textAlign: 'left',
                padding: '12px 0',
                fontWeight: '600',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#a0aec0',
              }}>DESCRIPTION</th>
              <th style={{
                textAlign: 'right',
                padding: '12px 0',
                fontWeight: '600',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#a0aec0',
              }}>QTY</th>
              <th style={{
                textAlign: 'right',
                padding: '12px 0',
                fontWeight: '600',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#a0aec0',
              }}>PRICE</th>
              <th style={{
                textAlign: 'right',
                padding: '12px 0',
                fontWeight: '600',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#a0aec0',
              }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const quantity = item.quantity || 0;
              const unitPrice = item.unitPrice || 0;
              const total = quantity * unitPrice;
              
              return (
                <tr key={index} style={{ borderBottom: '1px solid #f7fafc' }}>
                  <td style={{ padding: '16px 0', color: '#2d3748' }}>
                    {item.description}
                  </td>
                    <td style={{ textAlign: 'right', padding: '16px 0', color: '#718096' }}>
                      {quantity}
                    </td>
                    <td style={{ textAlign: 'right', padding: '16px 0', color: '#718096' }}>
                      ${formatCurrency(unitPrice)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '16px 0', color: '#2d3748', fontWeight: '500' }}>
                      ${formatCurrency(total)}
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '60px',
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
      {(invoice.bankName || invoice.bankAccountNumber || invoice.paymentInstructions) && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#a0aec0',
            marginBottom: '12px',
          }}>PAYMENT DETAILS</div>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#718096' }}>
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
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#a0aec0',
            marginBottom: '12px',
          }}>NOTES</div>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#718096' }}>
            {invoice.notes}
          </div>
        </div>
      )}
    </div>
  );
}

