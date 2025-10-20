import Dexie, { Table } from 'dexie';
import { InvoiceData } from '@/types/invoice';

export interface DocumentationEntry {
  id?: number;
  topic: string;
  content: string;
  keywords: string[];
  createdAt: number;
}

export interface SavedInvoice extends InvoiceData {
  savedAt: number;
}

export class InvoiceesDB extends Dexie {
  documentation!: Table<DocumentationEntry>;
  invoices!: Table<SavedInvoice>;

  constructor() {
    super('InvoiceesDB');
    this.version(1).stores({
      documentation: '++id, topic, *keywords, createdAt',
    });
    // Version 2: Add invoices table
    this.version(2).stores({
      documentation: '++id, topic, *keywords, createdAt',
      invoices: 'id, savedAt, businessName, clientName',
    });
  }
}

export const db = new InvoiceesDB();

/**
 * Initialize the database with default documentation
 */
export async function initializeDocumentation() {
  const count = await db.documentation.count();
  if (count > 0) {
    return; // Already initialized
  }

  const defaultDocs: Omit<DocumentationEntry, 'id'>[] = [
    {
      topic: 'Getting Started',
      content: `Welcome to Invoicees! This AI-powered app helps you create professional invoices through natural conversation.

Simply type what you need in the chat window:
- "Create an invoice for John Smith"
- "Add an item: Web Development $1500"
- "Set my business name to Acme Corp"
- "Change the layout to minimalist"

The invoice updates in real-time as you chat!`,
      keywords: ['help', 'start', 'introduction', 'guide', 'how to'],
      createdAt: Date.now(),
    },
    {
      topic: 'Adding Business Information',
      content: `To add your business details, say:
- "My business name is [name]"
- "My email is [email]"
- "My address is [address]"
- "My phone is [phone]"

Example: "Set my business as Tech Solutions Inc, email: info@techsolutions.com, phone: 555-0123"`,
      keywords: ['business', 'company', 'seller', 'from', 'my info'],
      createdAt: Date.now(),
    },
    {
      topic: 'Adding Client Information',
      content: `To add client details, say:
- "Client name is [name]"
- "Bill to [name]"
- "Client email: [email]"
- "Client address: [address]"

Example: "Create invoice for Sarah Johnson at sarah@example.com"`,
      keywords: ['client', 'customer', 'bill to', 'buyer', 'recipient'],
      createdAt: Date.now(),
    },
    {
      topic: 'Adding Items',
      content: `To add items to your invoice:
- "Add item: [description] $[price] x [quantity]"
- "Add [description] for $[price]"
- "10 hours of consulting at $150/hour"

Example: "Add web design service $2500" or "Add 5 widgets at $25 each"`,
      keywords: ['item', 'product', 'service', 'add', 'line item'],
      createdAt: Date.now(),
    },
    {
      topic: 'Bank Details',
      content: `To add payment information:
- "Bank name: [name]"
- "Account number: [number]"
- "Account type: [checking/savings]"
- "Branch: [branch name]"

Example: "Set bank to Wells Fargo, account 12345678, checking"`,
      keywords: ['bank', 'payment', 'account', 'transfer'],
      createdAt: Date.now(),
    },
    {
      topic: 'Layout Templates',
      content: `Available invoice layouts:
- Minimalist: Clean and simple
- Left Header: Business info on left
- Centered: All content centered
- Compact Grid: Space-efficient design

Say: "Switch to [layout name]" or "Change layout to minimalist"`,
      keywords: ['layout', 'template', 'design', 'style', 'format'],
      createdAt: Date.now(),
    },
    {
      topic: 'Exporting Invoice',
      content: `To export your invoice as PDF:
- "Export to PDF"
- "Download invoice"
- "Save as PDF"

The PDF will be generated using the current layout and all information.`,
      keywords: ['export', 'pdf', 'download', 'save', 'print'],
      createdAt: Date.now(),
    },
    {
      topic: 'Supported Commands',
      content: `This app only processes invoice-related requests:
✓ Business and client information
✓ Adding/editing invoice items
✓ Bank and payment details
✓ Layout changes
✓ Export to PDF

✗ Unrelated topics will be rejected
✗ Illegal or inappropriate content is not allowed`,
      keywords: ['commands', 'what can', 'features', 'capabilities'],
      createdAt: Date.now(),
    },
  ];

  await db.documentation.bulkAdd(defaultDocs);
}

/**
 * Search documentation by keywords
 */
export async function searchDocumentation(query: string): Promise<DocumentationEntry[]> {
  const lowercaseQuery = query.toLowerCase();
  const words = lowercaseQuery.split(/\s+/);

  const results = await db.documentation
    .filter((doc) => {
      const searchText = `${doc.topic} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();
      return words.some((word) => searchText.includes(word));
    })
    .toArray();

  return results;
}

/**
 * Save an invoice to IndexedDB
 */
export async function saveInvoice(invoice: InvoiceData): Promise<void> {
  const savedInvoice: SavedInvoice = {
    ...invoice,
    savedAt: Date.now(),
  };
  await db.invoices.put(savedInvoice);
}

/**
 * Get all saved invoices
 */
export async function getAllSavedInvoices(): Promise<SavedInvoice[]> {
  return await db.invoices.orderBy('savedAt').reverse().toArray();
}

/**
 * Delete a saved invoice
 */
export async function deleteSavedInvoice(id: string): Promise<void> {
  await db.invoices.delete(id);
}

/**
 * Get a single invoice by ID
 */
export async function getSavedInvoice(id: string): Promise<SavedInvoice | undefined> {
  return await db.invoices.get(id);
}

