import { create } from 'zustand';
import { Customer, Quote, Invoice, Payment, LineItem } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  customers: Customer[];
  quotes: Quote[];
  invoices: Invoice[];
  payments: Payment[];

  // Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'created_at' | 'quote_number'>) => void;
  updateQuoteStatus: (id: string, status: Quote['status']) => void;
  createInvoiceFromQuote: (quoteId: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'receipt_number'>) => void;
}

// Initial mock data to make testing easier without a DB
const initialCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '0712345678',
    address: 'Nairobi, Kenya',
    created_at: new Date().toISOString(),
  },
];

const initialItems: LineItem[] = [
  {
    id: 'item_1',
    description: 'Complete 8-Camera CCTV Installation Kit',
    quantity: 1,
    unit_price: 120000,
    total_price: 120000,
  },
  {
    id: 'item_2',
    description: 'Labor & Configuration',
    quantity: 1,
    unit_price: 30000,
    total_price: 30000,
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv_1',
    customer_id: 'cust_1',
    invoice_number: 'INV-2024-001',
    status: 'Partial',
    items: initialItems,
    grand_total: 150000,
    issue_date: '2024-03-01',
    due_date: '2024-03-15',
    created_at: new Date().toISOString(),
  }
];

const initialPayments: Payment[] = [
  {
    id: 'pay_1',
    invoice_id: 'inv_1',
    receipt_number: 'RCT-2024-001',
    amount: 50000,
    payment_date: '2024-03-05',
    payment_method: 'Bank Transfer',
    created_at: new Date().toISOString(),
  }
];

export const useStore = create<AppState>((set, get) => ({
  customers: initialCustomers,
  quotes: [],
  invoices: initialInvoices,
  payments: initialPayments,

  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, { ...customer, id: uuidv4(), created_at: new Date().toISOString() }]
  })),

  addQuote: (quote) => set((state) => {
    const quote_number = `QT-${new Date().getFullYear()}-${(state.quotes.length + 1).toString().padStart(3, '0')}`;
    return {
      quotes: [...state.quotes, { ...quote, id: uuidv4(), quote_number, created_at: new Date().toISOString() }]
    };
  }),

  updateQuoteStatus: (id, status) => set((state) => ({
    quotes: state.quotes.map(q => q.id === id ? { ...q, status } : q)
  })),

  createInvoiceFromQuote: (quoteId) => set((state) => {
    const quote = state.quotes.find(q => q.id === quoteId);
    if (!quote) return state;

    const invoice_number = `INV-${new Date().getFullYear()}-${(state.invoices.length + 1).toString().padStart(3, '0')}`;
    const newInvoice: Invoice = {
      id: uuidv4(),
      customer_id: quote.customer_id,
      quote_id: quote.id,
      invoice_number,
      status: 'Sent',
      items: quote.items,
      grand_total: quote.grand_total,
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      created_at: new Date().toISOString(),
    };

    return {
      invoices: [...state.invoices, newInvoice],
      quotes: state.quotes.map(q => q.id === quoteId ? { ...q, status: 'Accepted' } : q)
    };
  }),

  addInvoice: (invoice) => set((state) => {
    const invoice_number = `INV-${new Date().getFullYear()}-${(state.invoices.length + 1).toString().padStart(3, '0')}`;
    return {
      invoices: [...state.invoices, { ...invoice, id: uuidv4(), invoice_number, created_at: new Date().toISOString() }]
    };
  }),

  addPayment: (payment) => set((state) => {
    const receipt_number = `RCT-${new Date().getFullYear()}-${(state.payments.length + 1).toString().padStart(3, '0')}`;
    const newPayment: Payment = { ...payment, id: uuidv4(), receipt_number, created_at: new Date().toISOString() };
    
    // Auto-update invoice status
    const invoice = state.invoices.find(i => i.id === payment.invoice_id);
    let updatedInvoices = state.invoices;
    
    if (invoice) {
      const totalPaid = state.payments.filter(p => p.invoice_id === invoice.id).reduce((sum, p) => sum + p.amount, 0) + newPayment.amount;
      const newStatus = totalPaid >= invoice.grand_total ? 'Paid' : 'Partial';
      
      updatedInvoices = state.invoices.map(i => 
        i.id === invoice.id ? { ...i, status: newStatus } : i
      );
    }

    return {
      payments: [...state.payments, newPayment],
      invoices: updatedInvoices
    };
  }),
}));
