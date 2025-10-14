import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';

interface LeftHeaderLayoutProps {
  invoice: InvoiceData;
}

export function LeftHeaderLayout({ invoice }: LeftHeaderLayoutProps) {
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

        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#6366f1',
            marginBottom: '12px',
          }}>FROM</div>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            {invoice.businessName && (
              <div style={{ fontWeight: '600' }}>
                {invoice.businessName}
              </div>
            )}
            {invoice.businessEmail && <div>{invoice.businessEmail}</div>}
            {invoice.businessPhone && <div>{invoice.businessPhone}</div>}
            {invoice.businessAddress && (
              <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                {invoice.businessAddress}
              </div>
            )}
          </div>
        </div>

        {(invoice.bankName || invoice.bankAccountNumber || invoice.paymentInstructions) && (
          <div>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#6366f1',
              marginBottom: '12px',
            }}>PAYMENT</div>
            <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
              {invoice.bankName && <div>{invoice.bankName}</div>}
              {invoice.bankAccountNumber && <div>{invoice.bankAccountNumber}</div>}
              {invoice.bankAccountType && <div>{invoice.bankAccountType}</div>}
              {invoice.paymentInstructions && (
                <div style={{ marginTop: invoice.bankName || invoice.bankAccountNumber ? '8px' : '0', whiteSpace: 'pre-line' }}>
                  {invoice.paymentInstructions}
                </div>
              )}
            </div>
          </div>
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
          <div>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#94a3b8',
              marginBottom: '12px',
            }}>BILL TO</div>
            <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#1e293b' }}>
              {invoice.clientName && (
                <div style={{ fontWeight: '600' }}>
                  {invoice.clientName}
                </div>
              )}
              {invoice.clientEmail && <div>{invoice.clientEmail}</div>}
              {invoice.clientPhone && <div>{invoice.clientPhone}</div>}
              {invoice.clientAddress && (
                <div style={{ marginTop: '8px', color: '#64748b' }}>
                  {invoice.clientAddress}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {new Date().toLocaleDateString('en-US')}
            </div>
          </div>
        </div>

        <div style={{ 
          overflowX: 'auto',
          marginBottom: '30px',
        }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          minWidth: '500px',
        }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{
                textAlign: 'left',
                padding: '14px 16px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: '#475569',
              }}>DESCRIPTION</th>
              <th style={{
                textAlign: 'center',
                padding: '14px 16px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: '#475569',
              }}>QTY</th>
              <th style={{
                textAlign: 'right',
                padding: '14px 16px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: '#475569',
              }}>PRICE</th>
              <th style={{
                textAlign: 'right',
                padding: '14px 16px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: '#475569',
              }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const quantity = item.quantity || 0;
              const unitPrice = item.unitPrice || 0;
              const total = quantity * unitPrice;
              
              return (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', color: '#1e293b' }}>
                    {item.description}
                  </td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                    {quantity}
                  </td>
                  <td style={{ textAlign: 'right', padding: '16px', color: '#64748b' }}>
                    ${formatCurrency(unitPrice)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '16px', color: '#1e293b', fontWeight: '600' }}>
                    ${formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

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

        {invoice.notes && (
          <div style={{ marginTop: '40px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#94a3b8',
              marginBottom: '12px',
            }}>NOTES</div>
            <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#64748b' }}>
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

