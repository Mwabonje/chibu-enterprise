import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Settings, Plus, Menu, X,
  TrendingUp, FileText, FileSpreadsheet, Banknote
} from "lucide-react";

import ChibuDashboard from "./components/ChibuDashboard";
import CustomersView from "./components/CustomersView";
import ChibuQuote from "./components/ChibuQuote";
import InvoicesView from "./components/ChibuInvoices";
import InvoiceDetailView from "./components/InvoiceDetailView";
import PaymentsView from "./components/PaymentsView";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Clients", icon: Users, path: "/customers" },
  { label: "Quotes", icon: FileText, path: "/quotes" },
  { label: "Invoices", icon: FileSpreadsheet, path: "/invoices" },
  { label: "Payments", icon: Banknote, path: "/payments" },
  { label: "Performance", icon: TrendingUp, path: "/performance" },
];

function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    setNavOpen(false);
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        .app {
          --bg: #10141A;
          --panel: #181F27;
          --panel-2: #1E2731;
          --border: #29323C;
          --text: #E9EFF4;
          --dim: #8A97A5;
          --amber: #FFB020;
          --green: #35D399;
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          background-image:
            radial-gradient(circle at 100% 0%, rgba(63,193,224,0.06), transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(255,176,32,0.05), transparent 40%);
        }
        .sidebar {
          width: 256px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          padding: 22px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .brand { display: flex; align-items: center; gap: 10px; padding: 0 6px; }
        .brand-mark {
          width: 34px; height: 34px; border-radius: 8px;
          background: linear-gradient(135deg, #FFB020, #FF7A59);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #14181D; font-size: 15px;
        }
        .brand-text { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.02em; line-height: 1.1; width: max-content; }
        .brand-sub { display: flex; justify-content: space-between; font-size: 8px; color: var(--dim); margin-top: 3px; font-weight: 600; width: 100%; text-transform: uppercase; }
        .nav { display: flex; flex-direction: column; gap: 2px; }
        .nav-item {
          display: flex; align-items: center; gap: 11px;
          padding: 9px 10px; border-radius: 8px; cursor: pointer;
          color: var(--dim); font-size: 13.5px; font-weight: 500;
          border: 1px solid transparent;
          transition: background 0.15s, color 0.15s;
        }
        .nav-item:hover { background: var(--panel); color: var(--text); }
        .nav-item.active { background: var(--panel-2); color: var(--text); border-color: var(--border); }
        .nav-item.active svg { color: var(--amber); }
        .sidebar-foot { margin-top: auto; border-top: 1px solid var(--border); padding-top: 14px; }
        .status-chip {
          display: flex; align-items: center; gap: 8px;
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;
          color: var(--green); letter-spacing: 0.08em;
        }
        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--green);
          box-shadow: 0 0 0 0 rgba(53,211,153,0.6);
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(53,211,153,0.55); }
          70% { box-shadow: 0 0 0 6px rgba(53,211,153,0); }
          100% { box-shadow: 0 0 0 0 rgba(53,211,153,0); }
        }

        .main { flex: 1; min-width: 0; padding: 22px 28px 40px; overflow-y: auto; overflow-x: hidden; }
        
        /* Overrides for light-themed old components so they look slightly better */
        .main .bg-white {
           background-color: var(--panel) !important;
           border-color: var(--border) !important;
           color: var(--text) !important;
        }
        .main .bg-gray-50 {
           background-color: var(--panel-2) !important;
        }
        .main .text-gray-900, .main .text-gray-800 { color: var(--text) !important; }
        .main .text-gray-500, .main .text-gray-600 { color: var(--dim) !important; }
        .main .border-gray-200, .main .border-gray-100 { border-color: var(--border) !important; }

        .topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .greeting { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 600; }
        .greeting-sub { color: var(--dim); font-size: 13px; margin-top: 3px; }
        .menu-btn { display: none; }
        .topbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .date-readout {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--dim);
          border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; background: var(--panel);
        }
        .btn-primary {
          display: flex; align-items: center; gap: 6px;
          background: var(--amber); color: #14181D; font-weight: 600; font-size: 13px;
          border: none; padding: 9px 14px; border-radius: 8px; cursor: pointer;
        }

        .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 26px; }
        .stat-tile {
          position: relative; background: var(--panel); border: 1px solid var(--border);
          border-radius: 10px; padding: 18px 18px 16px;
        }
        .corner { position: absolute; width: 12px; height: 12px; border: 2px solid; opacity: 0.9; }
        .corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        .corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        .corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        .corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        .stat-label { font-size: 11.5px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.09em; }
        .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; margin-top: 8px; }
        .stat-sub { font-size: 12px; margin-top: 6px; font-weight: 500; }

        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
        .section-title span.tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--dim); font-weight: 400; }

        .services-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin-bottom: 26px; }
        .service-card { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; transition: border-color 0.15s, transform 0.15s; }
        .service-card:hover { transform: translateY(-2px); }
        .service-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .service-name { font-size: 12.5px; font-weight: 600; line-height: 1.3; min-height: 32px; }
        .service-count { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 600; margin-top: 10px; }
        .service-count-label { font-size: 10.5px; color: var(--dim); margin-top: 1px; }

        .lower-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr); gap: 16px; align-items: start; }
        .panel-block { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); font-weight: 500; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
        td { padding: 11px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
        tr:last-child td { border-bottom: none; }
        .client-name { font-weight: 600; }
        .loc-cell { display: flex; align-items: center; gap: 5px; color: var(--dim); font-size: 12px; }
        .badge { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .date-cell { font-family: 'IBM Plex Mono', monospace; color: var(--dim); font-size: 12px; }

        .quick-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
        .quick-btn {
          display: flex; align-items: center; gap: 7px; background: var(--panel-2);
          border: 1px solid var(--border); color: var(--text); font-size: 12.5px; font-weight: 500;
          padding: 9px 13px; border-radius: 8px; cursor: pointer;
        }
        .quick-btn:hover { border-color: var(--amber); }

        .table-responsive { width: 100%; overflow-x: auto; }
        .sidebar-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 15; backdrop-filter: blur(2px);
        }

        @media (max-width: 980px) {
          .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .services-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .lower-grid { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 760px) {
          .sidebar-overlay.open { display: block; }
          .sidebar { position: fixed; z-index: 20; height: 100vh; background: var(--bg); transform: translateX(-100%); transition: transform 0.2s; }
          .sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
          .menu-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: var(--panel); border: 1px solid var(--border); color: var(--text); cursor: pointer; margin-right: 10px; }
          .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .stat-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .main { padding: 16px; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: minmax(0, 1fr); }
          .services-grid { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>

      {navOpen && <div className="sidebar-overlay open" onClick={() => setNavOpen(false)} />}
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">CE</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="brand-text">CHIBU ENTERPRISES</div>
            <div className="brand-sub">
              <span>Security</span>
              <span>&amp;</span>
              <span>Power</span>
              <span>Systems</span>
            </div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Handle both exact match or sub-routes (e.g. /invoices/:id)
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <div
                key={item.label}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div
            className={`nav-item ${location.pathname.startsWith("/settings") ? "active" : ""}`}
            onClick={() => handleNav("/settings")}
          >
            <Settings size={16} />
            Settings
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div className="menu-btn" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <X size={16} /> : <Menu size={16} />}
            </div>
            <div>
              <div className="greeting">Good afternoon, Chibu</div>
              <div className="greeting-sub">7 jobs in progress across 4 counties &middot; 2 quotes awaiting sign-off</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="date-readout">MOMBASA &middot; THU 20 AUG 2026</div>
            <button className="btn-primary"><Plus size={15} /> New Job</button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<ChibuDashboard />} />
          <Route path="/customers" element={<CustomersView />} />
          <Route path="/quotes" element={<ChibuQuote />} />
          <Route path="/invoices" element={<InvoicesView />} />
          <Route path="/invoices/:id" element={<InvoiceDetailView />} />
          <Route path="/payments" element={<PaymentsView />} />
          <Route path="/performance" element={<div className="panel-block"><h1 className="text-xl font-bold">Performance</h1><p className="text-sm mt-2 text-[#8A97A5]">Performance analytics coming soon...</p></div>} />
          <Route path="/settings" element={<div className="panel-block"><h1 className="text-xl font-bold">Settings</h1><p className="text-sm mt-2 text-[#8A97A5]">System configuration coming soon...</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
