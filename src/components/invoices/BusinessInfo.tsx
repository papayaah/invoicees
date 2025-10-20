import { InvoiceData } from '@/types/invoice';
import { SkeletonLoader } from './SkeletonLoader';
import { commonStyles } from './commonStyles';

interface BusinessInfoProps {
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
  isLoading?: boolean;
}

export function BusinessInfo({ invoice, onUpdate, styles = {}, inputHoverColor = 'rgba(0, 0, 0, 0.02)', isLoading = false }: BusinessInfoProps) {
  const inputStyle: React.CSSProperties = {
    ...commonStyles.input,
  };

  const placeholderStyles = `
    .business-info-input::placeholder {
      color: ${commonStyles.placeholder.color};
      opacity: ${commonStyles.placeholder.opacity};
      font-style: ${commonStyles.placeholder.fontStyle};
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
          <div style={styles.label}>FROM</div>
        )}
        <div style={styles.content}>
          <div style={styles.nameStyle}>
            <SkeletonLoader height="20px" width="70%" />
          </div>
          <div style={styles.fieldStyle}>
            <SkeletonLoader height="16px" width="60%" style={{ marginTop: '8px' }} />
          </div>
          <div style={styles.fieldStyle}>
            <SkeletonLoader height="16px" width="50%" style={{ marginTop: '4px' }} />
          </div>
          <div style={styles.addressStyle}>
            <SkeletonLoader height="16px" width="80%" style={{ marginTop: '8px' }} />
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
          <div style={styles.label}>FROM</div>
        )}
        <div style={styles.content}>
          <div style={styles.nameStyle}>
            <input
              type="text"
              value={invoice.businessName || ''}
              onChange={(e) => handleUpdate('businessName', (e.target as HTMLInputElement).value)}
              placeholder="Business name"
              className="business-info-input"
              style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.fieldStyle}>
          <input
            type="email"
            value={invoice.businessEmail || ''}
            onChange={(e) => handleUpdate('businessEmail', (e.target as HTMLInputElement).value)}
            placeholder="Email"
            className="business-info-input"
            style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.fieldStyle}>
          <input
            type="tel"
            value={invoice.businessPhone || ''}
            onChange={(e) => handleUpdate('businessPhone', (e.target as HTMLInputElement).value)}
            placeholder="Phone"
            className="business-info-input"
            style={inputStyle}
            onMouseEnter={(e) => Object.assign((e.target as HTMLInputElement).style, { background: inputHoverColor, borderRadius: '3px' })}
            onMouseLeave={(e) => (e.target as HTMLInputElement).style.background = 'transparent'}
          />
        </div>
        <div style={styles.addressStyle}>
          <input
            type="text"
            value={invoice.businessAddress || ''}
            onChange={(e) => handleUpdate('businessAddress', (e.target as HTMLInputElement).value)}
            placeholder="Address"
            className="business-info-input"
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

