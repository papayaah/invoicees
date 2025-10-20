import { useState, useEffect } from 'preact/hooks';
import { InvoiceData, InvoiceLayout } from '@/types/invoice';
import { saveInvoice, getAllSavedInvoices, deleteSavedInvoice } from '@/lib/db';

const createEmptyInvoice = (): InvoiceData => ({
  id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  invoiceDate: new Date().toISOString(),
  dueDate: undefined,
  invoiceNumber: undefined,
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
  const [isLoading, setIsLoading] = useState(true);
  const [savedInvoiceIds, setSavedInvoiceIds] = useState<Set<string>>(new Set());

  // Load saved invoices on mount
  useEffect(() => {
    const loadSavedInvoices = async () => {
      try {
        const savedInvoices = await getAllSavedInvoices();
        // Saved invoices are already ordered newest first by the database query
        setInvoices(savedInvoices);
        // Mark all loaded invoices as saved
        setSavedInvoiceIds(new Set(savedInvoices.map(inv => inv.id!)));
      } catch (error) {
        console.error('Failed to load saved invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedInvoices();
  }, []);

  const addNewInvoice = () => {
    const newInvoice = createEmptyInvoice();
    setInvoices((prev) => [newInvoice, ...prev]); // Add to beginning of array
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

  const loadInvoice = (invoice: InvoiceData) => {
    setInvoices((prev) => [invoice, ...prev]); // Add to beginning of array
  };

  // Manual save to IndexedDB
  const saveInvoiceToDB = async (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    try {
      await saveInvoice(invoice);
      setSavedInvoiceIds(prev => new Set([...prev, id]));
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  // Remove from IndexedDB (unsave)
  const unsaveInvoice = async (id: string) => {
    try {
      await deleteSavedInvoice(id);
      setSavedInvoiceIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to unsave invoice:', error);
    }
  };

  // Check if invoice is saved
  const isInvoiceSaved = (id: string) => savedInvoiceIds.has(id);

  return {
    invoices,
    layout,
    setLayout,
    addNewInvoice,
    updateInvoice,
    deleteInvoice,
    resetAllInvoices,
    removeItem,
    loadInvoice,
    saveInvoiceToDB,
    unsaveInvoice,
    isInvoiceSaved,
    isLoading,
  };
}

