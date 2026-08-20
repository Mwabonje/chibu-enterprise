import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, FileText, Printer, Plus } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useStore } from '../store';

export default function InvoiceDetailView() {
  const { id } = useParams();
  
  const { invoices, customers, payments: allPayments, addPayment } = useStore();
  
  const invoice = invoices.find(i => i.id === id);
  const customer = customers.find(c => c.id === invoice?.customer_id);
  const payments = allPayments.filter(p => p.invoice_id === id);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');

  if (!invoice) return <div className="p-8">Invoice not found</div>;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = invoice.grand_total - totalPaid;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    addPayment({
      invoice_id: invoice.id,
      amount: amountNum,
      payment_date: new Date().toISOString(),
      payment_method: paymentMethod,
    });
    
    setShowPaymentModal(false);
    setPaymentAmount('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/invoices" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {invoice.invoice_number}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {invoice.status}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">Billed to <span className="font-medium text-gray-900">{customer?.name}</span></p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </button>
          {outstandingBalance > 0 && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Issue Date</p>
                  <p className="text-gray-900">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Due Date</p>
                  <p className="text-gray-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-100">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-600">Total</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(invoice.grand_total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Status & History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Outstanding Balance</p>
              <p className={`text-4xl font-bold mb-6 ${outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(outstandingBalance)}
              </p>
              
              <div className="w-full space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Invoice Total</span>
                  <span className="font-medium text-gray-900">{formatCurrency(invoice.grand_total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Payment History</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No payments recorded yet.</div>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">{payment.payment_method}</span>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors">
                        <FileText className="w-3 h-3" />
                        View Receipt ({payment.receipt_number})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
              <p className="text-sm text-gray-500 mt-1">Log a partial or full payment for {invoice.invoice_number}</p>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (KES)</label>
                <input 
                  type="number" 
                  max={outstandingBalance}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Max: ${outstandingBalance}`}
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Save Payment & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
