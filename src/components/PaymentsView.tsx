import { useStore } from '../store';
import { Banknote, FileText } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function PaymentsView() {
  const { payments, invoices, customers } = useStore();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">View all recorded incoming payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Receipt #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Invoice Ref</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => {
              const invoice = invoices.find(i => i.id === payment.invoice_id);
              const customer = customers.find(c => c.id === invoice?.customer_id);
              return (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    {payment.receipt_number}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{customer?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    {invoice ? (
                      <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                        {invoice.invoice_number}
                      </Link>
                    ) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      {payment.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    +{formatCurrency(payment.amount)}
                  </td>
                </tr>
              );
            })}
            
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Banknote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No payments recorded yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
