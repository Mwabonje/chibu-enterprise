import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useStore } from '../store';

export default function Dashboard() {
  const { customers, quotes, invoices, payments } = useStore();

  const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Partial');
  const pendingInvoicesTotal = pendingInvoices.reduce((sum, i) => sum + i.grand_total, 0);
  
  const recentQuotes = [...quotes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  // Simplified calendar generation for the UI mockup
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 3); // Padding for layout
  const today = 20;

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Calendar Card */}
        <div className="xl:col-span-2 flex flex-col md:flex-row bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
          {/* Left Dark Panel */}
          <div className="w-full md:w-1/3 bg-[#052e16] text-white p-8 flex flex-col relative">
            <div className="mb-12">
              <MoreHorizontal className="w-6 h-6 text-gray-400" />
            </div>
            
            <div className="mb-12">
              <h1 className="text-7xl font-bold mb-2 tracking-tighter">20</h1>
              <p className="text-lg font-medium tracking-widest uppercase">THURSDAY</p>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">CURRENT EVENTS</h3>
              <p className="text-sm text-emerald-100 mb-6">No bookings on this day</p>
              <button className="text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/50">
                See past events
              </button>
            </div>

            <div className="mt-auto pt-8">
              <button className="text-sm flex items-center justify-between w-full hover:text-emerald-200 transition-colors">
                <span>Create an Event</span>
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Calendar Panel */}
          <div className="w-full md:w-2/3 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-6 text-sm font-medium text-gray-400">
                {['Apr', 'May', 'Jun', 'Jul'].map(m => (
                  <span key={m} className="hover:text-gray-900 cursor-pointer">{m}</span>
                ))}
                <span className="text-[#052e16] border-b-2 border-[#052e16] pb-1 font-bold">Aug</span>
                {['Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <span key={m} className="hover:text-gray-900 cursor-pointer">{m}</span>
                ))}
              </div>
              <div className="flex items-center space-x-4 text-sm font-bold text-gray-900">
                <ChevronLeft className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900" />
                <span>2026</span>
                <ChevronRight className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-8 gap-x-2 text-center flex-1">
              {days.map(d => (
                <div key={d} className="text-xs font-bold text-[#052e16] tracking-wider mb-2">{d}</div>
              ))}
              
              {dates.map((date, idx) => {
                const isCurrentMonth = date > 0 && date <= 31;
                const isToday = date === today;
                return (
                  <div key={idx} className="flex flex-col items-center justify-start h-10">
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-sm
                      ${!isCurrentMonth ? 'text-gray-200' : 
                        isToday ? 'bg-[#052e16] text-white font-bold' : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}
                    `}>
                      {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                    </div>
                    {/* Add small dots under specific dates for mock events */}
                    {isCurrentMonth && [2, 4, 5].includes(date) && (
                      <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Metrics Column */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Top Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">TOTAL PENDING INVOICES</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(pendingInvoicesTotal)}</span>
                <span className="text-xs font-medium text-gray-400">({pendingInvoices.length} pending)</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">UPCOMING DEADLINES</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">0</span>
                <span className="text-xs font-medium text-gray-400">projects scheduled</span>
              </div>
            </div>
          </div>

          {/* Upcoming Shoots (Adapted to Installations) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">UPCOMING INSTALLS</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900">VIEW ALL</span>
            </div>
            <p className="text-sm text-gray-500">No upcoming installations.</p>
          </div>

          {/* Recent Quotes */}
          <div>
            <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">RECENT QUOTES</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900">CLEAR HISTORY</span>
            </div>
            
            <div className="space-y-4 mb-6">
              {recentQuotes.map(quote => {
                const customer = customers.find(c => c.id === quote.customer_id);
                return (
                  <div key={quote.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{customer?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">INSTALLATION PROJECT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(quote.grand_total)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{quote.status}</p>
                    </div>
                  </div>
                );
              })}
              
              {recentQuotes.length === 0 && (
                <p className="text-sm text-gray-500">No recent quotes.</p>
              )}
            </div>

            <Link 
              to="/quotes"
              className="w-full flex items-center justify-center py-3 border border-gray-900 rounded-lg text-xs font-bold text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              + CREATE NEW QUOTE
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
