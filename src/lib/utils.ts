/**
 * Safely check if a string field has content (not empty, null, or undefined)
 */
export function hasContent(value: any): boolean {
  return value && typeof value === 'string' && value.trim().length > 0;
}

/**
 * Safely check if payment details have any content
 */
export function hasPaymentDetails(invoice: {
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  bankBranch?: string;
  paymentInstructions?: string;
}): boolean {
  const hasContent = (value: any): boolean => {
    return value && typeof value === 'string' && value.trim().length > 0;
  };

  const result = !!(
    hasContent(invoice.bankName) ||
    hasContent(invoice.bankAccountNumber) ||
    hasContent(invoice.bankAccountType) ||
    hasContent(invoice.bankBranch) ||
    hasContent(invoice.paymentInstructions)
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Payment details check:', {
      bankName: invoice.bankName,
      bankAccountNumber: invoice.bankAccountNumber,
      bankAccountType: invoice.bankAccountType,
      bankBranch: invoice.bankBranch,
      paymentInstructions: invoice.paymentInstructions,
      hasContent: result
    });
  }

  return result;
}
