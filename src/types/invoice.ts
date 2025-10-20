export interface InvoiceItem {
  description: string;
  unitPrice: number;
  quantity: number;
}

export interface InvoiceData {
  id?: string;
  invoiceDate?: string; // ISO date string
  dueDate?: string; // ISO date string
  invoiceNumber?: string;
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessPhone: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountType: string;
  bankBranch: string;
  paymentInstructions?: string; // For custom payment methods like crypto wallets
  items: InvoiceItem[];
  notes: string;
}

export interface AIResponse {
  message: string;
  invoiceUpdate?: Partial<InvoiceData>;
}

export type InvoiceLayout = 'minimalist' | 'leftHeader' | 'centered' | 'compactGrid';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

