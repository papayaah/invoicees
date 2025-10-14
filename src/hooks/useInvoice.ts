import { useState } from 'preact/hooks';
import { InvoiceData, InvoiceLayout } from '@/types/invoice';

const createEmptyInvoice = (): InvoiceData => ({
  id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  businessName: '',
  businessEmail: '',
  businessAddress: '',
  businessPhone: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  clientPhone: '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountType: '',
  bankBranch: '',
  paymentInstructions: '',
  items: [],
  notes: '',
});

export function useInvoice() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [layout, setLayout] = useState<InvoiceLayout>('minimalist');

  const addNewInvoice = () => {
    const newInvoice = createEmptyInvoice();
    setInvoices((prev) => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<InvoiceData>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const resetAllInvoices = () => {
    setInvoices([]);
  };

  const removeItem = (invoiceId: string, itemIndex: number) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, items: inv.items.filter((_, i) => i !== itemIndex) }
          : inv
      )
    );
  };

  return {
    invoices,
    layout,
    setLayout,
    addNewInvoice,
    updateInvoice,
    deleteInvoice,
    resetAllInvoices,
    removeItem,
  };
}

