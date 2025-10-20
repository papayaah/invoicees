import { InvoiceData } from '@/types/invoice';
import { SkeletonLoader } from './SkeletonLoader';

interface PaymentDetailsProps {
  invoice: InvoiceData;
  onUpdate?: (field: keyof InvoiceData, value: string) => void;
  styles?: {
    container?: React.CSSProperties;
    label?: React.CSSProperties;
    content?: React.CSSProperties;
    fieldStyle?: React.CSSProperties;
    textareaStyle?: React.CSSProperties;
  };
  inputHoverColor?: string;
  compact?: boolean;
  labelText?: string;
  isLoading?: boolean;
}

export function PaymentDetails({ 
  invoice, 
  onUpdate, 
  styles = {}, 
  inputHoverColor = 'rgba(0, 0, 0, 0.02)',
  compact = false,
  labelText = 'PAYMENT DETAILS',
  isLoading = false
}: PaymentDetailsProps) {
  const textareaStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    padding: '8px',
    margin: '-8px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    lineHeight: '1.6',
    fontWeight: 'inherit',
    transition: 'background 0.15s ease',
    resize: 'vertical' as const,
    minHeight: compact ? '80px' : '120px',
    whiteSpace: 'pre-line' as const,
  };

  const placeholderStyles = `
    .payment-details-textarea::placeholder {
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

  // Clean up malformed payment instructions
  const cleanPaymentInstructions = (instructions: string): string => {
    if (!instructions) return '';
    
    // Remove lines that contain "[object Object]"
    const lines = instructions.split('\n');
    const cleanLines = lines.filter(line => 
      !line.includes('[object Object]') && 
      !line.match(/^\d+:\s*\[object Object\]$/) &&
      line.trim() !== ''
    );
    
    return cleanLines.join('\n');
  };

  // Combine all payment details into a single formatted string
  const formatPaymentDetails = (invoice: InvoiceData): string => {
    const details: string[] = [];
    
    if (invoice.bankName) details.push(`Bank: ${invoice.bankName}`);
    if (invoice.bankAccountNumber) details.push(`Account: ${invoice.bankAccountNumber}`);
    if (invoice.bankAccountType) details.push(`Type: ${invoice.bankAccountType}`);
    if (invoice.bankBranch) details.push(`Branch: ${invoice.bankBranch}`);
    if (invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate);
      details.push(`Due Date: ${dueDate.toLocaleDateString()}`);
    }
    if (invoice.paymentInstructions) {
      const cleanedInstructions = cleanPaymentInstructions(invoice.paymentInstructions);
      if (cleanedInstructions) {
        details.push(cleanedInstructions);
      }
    }
    
    return details.join('\n');
  };

  // Parse the combined payment details back into individual fields
  const parsePaymentDetails = (text: string) => {
    const lines = text.split('\n');
    const updates: Partial<InvoiceData> = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('Bank:')) {
        updates.bankName = trimmed.replace('Bank:', '').trim();
      } else if (trimmed.startsWith('Account:')) {
        updates.bankAccountNumber = trimmed.replace('Account:', '').trim();
      } else if (trimmed.startsWith('Type:')) {
        updates.bankAccountType = trimmed.replace('Type:', '').trim();
      } else if (trimmed.startsWith('Branch:')) {
        updates.bankBranch = trimmed.replace('Branch:', '').trim();
      } else if (trimmed.startsWith('Due Date:')) {
        const dateStr = trimmed.replace('Due Date:', '').trim();
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          updates.dueDate = date.toISOString();
        }
      } else if (trimmed && !trimmed.includes(':')) {
        // This is likely additional payment instructions
        updates.paymentInstructions = trimmed;
      }
    });
    
    return updates;
  };

  const handleTextareaChange = (value: string) => {
    // Update the paymentInstructions field with the full text
    handleUpdate('paymentInstructions', value);
    
    // Also try to parse and update individual fields for backward compatibility
    const parsed = parsePaymentDetails(value);
    Object.entries(parsed).forEach(([key, val]) => {
      if (val !== undefined) {
        handleUpdate(key as keyof InvoiceData, val as string);
      }
    });
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        {styles.label && (
          <div style={styles.label}>{labelText}</div>
        )}
        <div style={styles.content}>
          <div style={styles.textareaStyle}>
            <SkeletonLoader height={compact ? "80px" : "120px"} width="100%" />
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
          <div style={styles.textareaStyle}>
            <textarea
              value={formatPaymentDetails(invoice)}
              onChange={(e) => handleTextareaChange((e.target as HTMLTextAreaElement).value)}
              placeholder={compact 
                ? "Enter payment details...\n\nExample:\nBank: Chase Bank\nAccount: 1234567890\nDue Date: 12/31/2024"
                : "Enter payment details here...\n\nExamples:\nBank: Chase Bank\nAccount: 1234567890\nType: Checking\nBranch: Main Street\nDue Date: 12/31/2024\n\nOr just write: 'Pay via PayPal: user@example.com'"
              }
              className="payment-details-textarea"
              style={textareaStyle}
              onMouseEnter={(e) => Object.assign((e.target as HTMLTextAreaElement).style, { background: inputHoverColor, borderRadius: '3px' })}
              onMouseLeave={(e) => (e.target as HTMLTextAreaElement).style.background = 'transparent'}
            />
          </div>
        </div>
      </div>
    </>
  );
}