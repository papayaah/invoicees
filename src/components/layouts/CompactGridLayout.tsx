import { InvoiceData } from '@/types/invoice';
import { calculateTotal, formatCurrency } from '@/lib/ai-agent';

interface CompactGridLayoutProps {
  invoice: InvoiceData;
}

export function CompactGridLayout({ invoice }: CompactGridLayoutProps) {
  const total = calculateTotal(invoice.items);

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
          <div style={{ fontSize: '13px', color: '#881337', fontWeight: '600' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div style={{
          background: '#ddd6fe',
          padding: '20px',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            color: '#5b21b6',
            marginBottom: '8px',
          }}>FROM</div>
          <div style={{ fontSize: '13px', color: '#4c1d95', lineHeight: '1.6' }}>
            {invoice.businessName && (
              <div style={{ fontWeight: '600' }}>
                {invoice.businessName}
              </div>
            )}
            {invoice.businessEmail && <div style={{ fontSize: '11px' }}>{invoice.businessEmail}</div>}
          </div>
        </div>

        <div style={{
          background: '#ccfbf1',
          padding: '20px',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            color: '#115e59',
            marginBottom: '8px',
          }}>TO</div>
          <div style={{ fontSize: '13px', color: '#134e4a', lineHeight: '1.6' }}>
            {invoice.clientName && (
              <div style={{ fontWeight: '600' }}>
                {invoice.clientName}
              </div>
            )}
            {invoice.clientEmail && <div style={{ fontSize: '11px' }}>{invoice.clientEmail}</div>}
          </div>
        </div>
      </div>

      {/* Address Grid */}
      {(invoice.businessAddress || invoice.clientAddress || invoice.businessPhone || invoice.clientPhone) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}>
          {(invoice.businessAddress || invoice.businessPhone) && (
            <div style={{
              background: '#f5f3ff',
              padding: '15px',
              fontSize: '12px',
              color: '#5b21b6',
              lineHeight: '1.6',
            }}>
              {invoice.businessAddress && <div>{invoice.businessAddress}</div>}
              {invoice.businessPhone && <div>Tel: {invoice.businessPhone}</div>}
            </div>
          )}
          {(invoice.clientAddress || invoice.clientPhone) && (
            <div style={{
              background: '#f0fdfa',
              padding: '15px',
              fontSize: '12px',
              color: '#115e59',
              lineHeight: '1.6',
            }}>
              {invoice.clientAddress && <div>{invoice.clientAddress}</div>}
              {invoice.clientPhone && <div>Tel: {invoice.clientPhone}</div>}
            </div>
          )}
        </div>
      )}

      {/* Items Compact Table */}
      <div style={{
        background: '#fafafa',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
              <th style={{
                textAlign: 'left',
                padding: '10px 0',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#737373',
              }}>DESCRIPTION</th>
              <th style={{
                textAlign: 'center',
                padding: '10px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#737373',
                width: '60px',
              }}>QTY</th>
              <th style={{
                textAlign: 'right',
                padding: '10px',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#737373',
                width: '100px',
              }}>PRICE</th>
              <th style={{
                textAlign: 'right',
                padding: '10px 0',
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#737373',
                width: '100px',
              }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const quantity = item.quantity || 0;
              const unitPrice = item.unitPrice || 0;
              const total = quantity * unitPrice;
              
              return (
                <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 0', color: '#262626' }}>
                    {item.description}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#525252' }}>
                    {quantity}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px', color: '#525252' }}>
                    ${formatCurrency(unitPrice)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px 0', color: '#262626', fontWeight: '600' }}>
                    ${formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '20px',
      }}>
        {/* Payment Info */}
        <div>
          {(invoice.bankName || invoice.bankAccountNumber || invoice.paymentInstructions) && (
            <div style={{
              background: '#fff7ed',
              padding: '15px',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#9a3412',
                marginBottom: '8px',
              }}>PAYMENT</div>
              <div style={{ fontSize: '12px', color: '#7c2d12', lineHeight: '1.6' }}>
                {invoice.bankName && <div>{invoice.bankName}</div>}
                {invoice.bankAccountNumber && <div>Acc: {invoice.bankAccountNumber}</div>}
                {invoice.bankAccountType && <div>{invoice.bankAccountType}</div>}
                {invoice.paymentInstructions && (
                  <div style={{ marginTop: invoice.bankName || invoice.bankAccountNumber ? '8px' : '0', whiteSpace: 'pre-line' }}>
                    {invoice.paymentInstructions}
                  </div>
                )}
              </div>
            </div>
          )}
          {invoice.notes && (
            <div style={{
              background: '#fef9c3',
              padding: '15px',
              marginTop: invoice.bankName ? '10px' : '0',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#713f12',
                marginBottom: '8px',
              }}>NOTES</div>
              <div style={{ fontSize: '12px', color: '#854d0e', lineHeight: '1.6' }}>
                {invoice.notes}
              </div>
            </div>
          )}
        </div>

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

