export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Quote {
  id: string;
  customer_id: string;
  quote_number: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  items: LineItem[];
  grand_total: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  quote_id?: string;
  invoice_number: string;
  status: 'Draft' | 'Sent' | 'Partial' | 'Paid' | 'Overdue';
  items: LineItem[];
  grand_total: number;
  issue_date: string;
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  receipt_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  created_at: string;
}
