import React, { useState } from 'react';
import { useStore } from '../store';
import { FileText, Plus, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Quote } from '../types';

export default function QuotationsView() {
  const { quotes, customers, addQuote, createInvoiceFromQuote } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ id: '1', description: '', quantity: 1, unit_price: 0, total_price: 0 }]
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Math.random().toString(), description: '', quantity: 1, unit_price: 0, total_price: 0 }]
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return;

    const grand_total = formData.items.reduce((sum, item) => sum + item.total_price, 0);

    addQuote({
      customer_id: formData.customer_id,
      status: 'Sent',
      items: formData.items,
      grand_total
    });

    setShowAddModal(false);
    setFormData({
      customer_id: '',
      items: [{ id: '1', description: '', quantity: 1, unit_price: 0, total_price: 0 }]
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project quotes.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Quote #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((quote) => {
              const customer = customers.find(c => c.id === quote.customer_id);
              return (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{quote.quote_number}</td>
                  <td className="px-6 py-4 text-gray-600">{customer?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(quote.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(quote.grand_total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {quote.status !== 'Accepted' && (
                      <button 
                        onClick={() => createInvoiceFromQuote(quote.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                        Convert to Invoice
                      </button>
                    )}
                    {quote.status === 'Accepted' && (
                       <span className="inline-flex items-center text-green-600 font-medium">
                         <CheckCircle className="w-4 h-4 mr-1.5" />
                         Invoiced
                       </span>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No quotations found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create New Quotation</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                <select 
                  required
                  value={formData.customer_id} 
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Line Items</label>
                  <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 font-medium flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input 
                          type="text" required placeholder="Description"
                          value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="w-24">
                        <input 
                          type="number" required placeholder="Qty" min="1"
                          value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <input 
                          type="number" required placeholder="Price" min="0"
                          value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="w-32 py-2 text-right font-medium text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 px-3">
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-right font-bold text-lg text-gray-900">
                  Total: {formatCurrency(formData.items.reduce((s, i) => s + i.total_price, 0))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save & Issue Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
