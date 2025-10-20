import { InvoiceData } from '@/types/invoice';

interface NotesProps {
  invoice: InvoiceData;
  styles?: {
    container?: React.CSSProperties;
    label?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export function Notes({ invoice, styles = {} }: NotesProps) {
  if (!invoice.notes) {
    return null;
  }

  const defaultStyles = {
    container: {
      marginTop: '20px',
      padding: '15px',
      background: '#fef9c3',
      borderRadius: '4px',
    },
    label: {
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '1px',
      color: '#713f12',
      marginBottom: '8px',
      textTransform: 'uppercase' as const,
    },
    content: {
      fontSize: '14px',
      color: '#854d0e',
      lineHeight: '1.6',
    },
  };

  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    label: { ...defaultStyles.label, ...styles.label },
    content: { ...defaultStyles.content, ...styles.content },
  };

  return (
    <div style={mergedStyles.container}>
      <div style={mergedStyles.label}>NOTES</div>
      <div style={mergedStyles.content}>
        {invoice.notes}
      </div>
    </div>
  );
}
