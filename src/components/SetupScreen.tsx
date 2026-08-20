export default function SetupScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Supabase Configuration Required</h1>
          <p className="text-gray-600 mb-8">
            This application requires a Supabase PostgreSQL database to function. Please configure your environment variables in the AI Studio Settings (Secrets panel).
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">1. Add Environment Secrets</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VITE_SUPABASE_URL</code>: Your Supabase project URL</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VITE_SUPABASE_ANON_KEY</code>: Your Supabase public anon key</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">2. Run SQL Schema</h2>
              <p className="text-sm text-gray-600 mb-3">Execute the following SQL in your Supabase SQL Editor to set up the required tables for the Quotation to Receipt workflow:</p>
              <pre className="bg-gray-900 text-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{`-- Chibu Enterprises Schema

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Sent, Partial, Paid
  grand_total NUMERIC NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  receipt_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            After configuring your secrets, the application will automatically connect and load.
          </p>
        </div>
      </div>
    </div>
  );
}
