import { InvoiceData } from '@/types/invoice';
import { SkeletonLoader } from './SkeletonLoader';

interface ClientInfoProps {
  invoice: InvoiceData;
  onUpdate?: (field: keyof InvoiceData, value: string) => void;
  styles?: {
    container?: React.CSSProperties;
    label?: React.CSSProperties;
    content?: React.CSSProperties;
    nameStyle?: React.CSSProperties;
    fieldStyle?: React.CSSProperties;
    addressStyle?: React.CSSProperties;
  };
  inputHoverColor?: string;
  labelText?: string;
  isLoading?: boolean;
}

export function ClientInfo({ invoice, onUpdate, styles = {}, inputHoverColor = 'rgba(0, 0, 0, 0.02)', labelText = 'TO', isLoading = false }: ClientInfoProps) {
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

  const placeholderStyles = `
    .client-info-input::placeholder {
      color: #a0aec0;
      opacity: 0.7;
      font-style: italic;
    }
  `;

  const handleUpdate = (field: keyof InvoiceData, value: string) => {
    if (onUpdate) {
      onUpdate(field, value);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        {styles.label && (
          <div style={styles.label}>{labelText}</div>
        )}
        <div style={styles.content}>
          <div style={styles.nameStyle}>
            <SkeletonLoader height="20px" width="65%" />
          </div>
          <div style={styles.fieldStyle}>
            <SkeletonLoader height="16px" width="55%" style={{ marginTop: '8px' }} />
          </div>
          <div style={styles.fieldStyle}>
            <SkeletonLoader height="16px" width="48%" style={{ marginTop: '4px' }} />
          </div>
          <div style={styles.addressStyle}>
            <SkeletonLoader height="16px" width="75%" style={{ marginTop: '8px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{placeholderStyles}</style>
      <div style={styles.container}>
        {styles.label && (
          <div style={styles.label}>{labelText}</div>
        )}
        <div style={styles.content}>
          <div style={styles.nameStyle}>
            <input
              type="text"
              value={invoice.clientName || ''}
              onChange={(e) => handleUpdate('clientName', (e.target as HTMLInputElement).value)}
              placeholder="Client name"
              className="client-info-input"
              style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.fieldStyle}>
          <input
            type="email"
            value={invoice.clientEmail || ''}
            onChange={(e) => handleUpdate('clientEmail', (e.target as HTMLInputElement).value)}
            placeholder="Email"
            className="client-info-input"
            style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.fieldStyle}>
          <input
            type="tel"
            value={invoice.clientPhone || ''}
            onChange={(e) => handleUpdate('clientPhone', (e.target as HTMLInputElement).value)}
            placeholder="Phone"
            className="client-info-input"
            style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.addressStyle}>
          <input
            type="text"
            value={invoice.clientAddress || ''}
            onChange={(e) => handleUpdate('clientAddress', (e.target as HTMLInputElement).value)}
            placeholder="Address"
            className="client-info-input"
            style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
      </div>
    </div>
    </>
  );
}

