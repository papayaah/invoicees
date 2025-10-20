import { InvoiceItem } from '@/types/invoice';
import { formatCurrency } from '@/lib/ai-agent';
import { SkeletonLoader } from './SkeletonLoader';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  styles?: {
    container?: React.CSSProperties;
    table?: React.CSSProperties;
    headerRow?: React.CSSProperties;
    headerCell?: React.CSSProperties;
    bodyRow?: React.CSSProperties;
    descriptionCell?: React.CSSProperties;
    quantityCell?: React.CSSProperties;
    priceCell?: React.CSSProperties;
    totalCell?: React.CSSProperties;
  };
  isLoading?: boolean;
  skeletonRows?: number;
}

export function InvoiceItemsTable({ items, styles = {}, isLoading = false, skeletonRows = 3 }: InvoiceItemsTableProps) {
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>DESCRIPTION</th>
            <th style={{ ...styles.headerCell, textAlign: 'center' }}>QTY</th>
            <th style={{ ...styles.headerCell, textAlign: 'right' }}>PRICE</th>
            <th style={{ ...styles.headerCell, textAlign: 'right' }}>
              {styles.container ? 'TOTAL' : 'AMOUNT'}
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, index) => (
              <tr key={index} style={styles.bodyRow}>
                <td style={styles.descriptionCell}>
                  <SkeletonLoader height="14px" width={`${Math.random() * 30 + 60}%`} />
                </td>
                <td style={styles.quantityCell}>
                  <SkeletonLoader height="14px" width="30px" style={{ margin: '0 auto' }} />
                </td>
                <td style={styles.priceCell}>
                  <SkeletonLoader height="14px" width="60px" style={{ marginLeft: 'auto' }} />
                </td>
                <td style={styles.totalCell}>
                  <SkeletonLoader height="14px" width="70px" style={{ marginLeft: 'auto' }} />
                </td>
              </tr>
            ))
          ) : (
            items.map((item, index) => {
              const quantity = item.quantity || 0;
              const unitPrice = item.unitPrice || 0;
              const total = quantity * unitPrice;
              
              return (
                <tr key={index} style={styles.bodyRow}>
                  <td style={styles.descriptionCell}>
                    {item.description}
                  </td>
                  <td style={styles.quantityCell}>
                    {quantity}
                  </td>
                  <td style={styles.priceCell}>
                    ${formatCurrency(unitPrice)}
                  </td>
                  <td style={styles.totalCell}>
                    ${formatCurrency(total)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

