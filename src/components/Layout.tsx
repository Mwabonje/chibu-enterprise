import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Banknote, 
  PieChart, 
  Wrench, 
  Settings,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Quotes', href: '/quotes', icon: FileText },
  { name: 'Invoices', href: '/invoices', icon: FileSpreadsheet },
  { name: 'Payments', href: '/payments', icon: Banknote },
  { name: 'Performance', href: '/performance', icon: PieChart },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
  const { invoices } = useStore();
  const pendingInvoicesCount = invoices.filter(i => i.status === 'Sent' || i.status === 'Partial').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#052e16] text-white flex flex-col py-6">
        <div className="px-8 mb-6">
          <span className="text-xl font-extrabold tracking-widest text-white">CHIBU</span>
        </div>

        <div className="px-6 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#0a4020] text-sm text-white placeholder-gray-400 rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#052e16] rounded px-1.5 py-0.5 text-[10px] text-gray-400 font-medium">
              ⌘K
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 pl-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isInvoice = item.name === 'Invoices';
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-l-full text-sm font-medium transition-colors relative',
                    isActive
                      ? 'bg-gray-50 text-[#052e16]'
                      : 'text-gray-300 hover:text-white'
                  )
                }
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0")} />
                <span className="flex-1">{item.name}</span>
                {isInvoice && pendingInvoicesCount > 0 && (
                  <span className="bg-gray-700/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingInvoicesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
