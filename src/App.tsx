/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, LayoutDashboard, Briefcase,
  Users, Package, Settings, Plus, MapPin, ChevronRight, Menu, X,
  TrendingUp, Clock, CheckCircle2, FileText, Radio, FileSpreadsheet, Banknote
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const services = [
  { name: "CCTV Installation", icon: Camera, active: 9, color: "#3FC1E0", tint: "rgba(63,193,224,0.12)" },
  { name: "Solar Installation", icon: Sun, active: 5, color: "#FFB020", tint: "rgba(255,176,32,0.12)" },
  { name: "Alarm System Installation", icon: ShieldCheck, active: 6, color: "#FF7A59", tint: "rgba(255,122,89,0.12)" },
  { name: "Window & Staircase Grill", icon: Grid3x3, active: 4, color: "#9BA8B4", tint: "rgba(155,168,180,0.12)" },
  { name: "Electric Fence Installation", icon: Zap, active: 3, color: "#35D399", tint: "rgba(53,211,153,0.12)" },
];

const jobs = [
  { client: "Aisha Mwangi", service: "CCTV Installation", loc: "Nyali, Mombasa", status: "In Progress", date: "Aug 19" },
  { client: "James Otieno", service: "Solar Installation", loc: "Bamburi, Mombasa", status: "Quoted", date: "Aug 18" },
  { client: "Fatuma Said", service: "Electric Fence Installation", loc: "Kilifi", status: "Completed", date: "Aug 17" },
  { client: "David Kimani", service: "Alarm System Installation", loc: "Diani", status: "In Progress", date: "Aug 16" },
  { client: "Grace Wanjiru", service: "Window & Staircase Grill", loc: "Nakuru", status: "Scheduled", date: "Aug 15" },
  { client: "Peter Mwakio", service: "CCTV Installation", loc: "Malindi", status: "Completed", date: "Aug 14" },
  { client: "Halima Abdi", service: "Solar Installation", loc: "Kilifi", status: "In Progress", date: "Aug 13" },
];

type StatusType = "Completed" | "In Progress" | "Scheduled" | "Quoted";

const statusStyle: Record<StatusType, { color: string; bg: string }> = {
  "Completed": { color: "#35D399", bg: "rgba(53,211,153,0.12)" },
  "In Progress": { color: "#FFB020", bg: "rgba(255,176,32,0.12)" },
  "Scheduled": { color: "#3FC1E0", bg: "rgba(63,193,224,0.12)" },
  "Quoted": { color: "#9BA8B4", bg: "rgba(155,168,180,0.12)" },
};

const chartData = services.map(s => ({ name: s.name.split(" ")[0], jobs: s.active, color: s.color }));

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Clients", icon: Users },
  { label: "Quotes", icon: FileText },
  { label: "Invoices", icon: FileSpreadsheet },
  { label: "Payments", icon: Banknote },
  { label: "Performance", icon: TrendingUp },
];

interface StatTileProps {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}

function StatTile({ label, value, sub, accent }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="corner tl" style={{ borderColor: accent }} />
      <div className="corner tr" style={{ borderColor: accent }} />
      <div className="corner bl" style={{ borderColor: accent }} />
      <div className="corner br" style={{ borderColor: accent }} />
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub" style={{ color: accent }}>{sub}</div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [navOpen, setNavOpen] = useState(false);

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
          width: 236px;
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
        .brand-text { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.02em; line-height: 1.1; }
        .brand-sub { font-size: 10.5px; color: var(--dim); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px; }
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

        .main { flex: 1; min-width: 0; padding: 22px 28px 40px; }
        .topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .greeting { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 600; }
        .greeting-sub { color: var(--dim); font-size: 13px; margin-top: 3px; }
        .menu-btn { display: none; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .date-readout {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--dim);
          border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; background: var(--panel);
        }
        .btn-primary {
          display: flex; align-items: center; gap: 6px;
          background: var(--amber); color: #14181D; font-weight: 600; font-size: 13px;
          border: none; padding: 9px 14px; border-radius: 8px; cursor: pointer;
        }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 26px; }
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

        .services-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 26px; }
        .service-card { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; transition: border-color 0.15s, transform 0.15s; }
        .service-card:hover { transform: translateY(-2px); }
        .service-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .service-name { font-size: 12.5px; font-weight: 600; line-height: 1.3; min-height: 32px; }
        .service-count { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 600; margin-top: 10px; }
        .service-count-label { font-size: 10.5px; color: var(--dim); margin-top: 1px; }

        .lower-grid { display: grid; grid-template-columns: 1.1fr 1.4fr; gap: 16px; align-items: start; }
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

        @media (max-width: 980px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .services-grid { grid-template-columns: repeat(3, 1fr); }
          .lower-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .sidebar { position: fixed; z-index: 20; height: 100vh; background: var(--bg); transform: translateX(-100%); transition: transform 0.2s; }
          .sidebar.open { transform: translateX(0); }
          .menu-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: var(--panel); border: 1px solid var(--border); color: var(--text); cursor: pointer; margin-right: 10px; }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .main { padding: 18px; }
        }
      `}</style>

      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">CE</div>
          <div>
            <div className="brand-text">CHIBU ENTERPRISES</div>
            <div className="brand-sub">Security &amp; Power Systems</div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`nav-item ${active === item.label ? "active" : ""}`}
                onClick={() => { setActive(item.label); setNavOpen(false); }}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div
            className={`nav-item ${active === "Settings" ? "active" : ""}`}
            onClick={() => { setActive("Settings"); setNavOpen(false); }}
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

        <div className="stat-grid">
          <StatTile label="Active Installations" value="14" sub="+3 this week" accent="#3FC1E0" />
          <StatTile label="Pending Quotes" value="07" sub="Awaiting approval" accent="#FFB020" />
          <StatTile label="Revenue, MTD" value="KES 486,200" sub="+18% vs last month" accent="#35D399" />
          <StatTile label="Completed Jobs, MTD" value="22" sub="98% on schedule" accent="#FF7A59" />
        </div>

        <div className="section-title">
          Service Lines <span className="tag">ACTIVE JOBS BY CATEGORY</span>
        </div>
        <div className="services-grid">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div className="service-card" key={s.name}>
                <div className="service-icon" style={{ background: s.tint }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div className="service-name">{s.name}</div>
                <div className="service-count" style={{ color: s.color }}>{s.active}</div>
                <div className="service-count-label">active jobs</div>
              </div>
            );
          })}
        </div>

        <div className="lower-grid">
          <div className="panel-block">
            <div className="section-title">
              Jobs by Category <span className="tag">THIS MONTH</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#29323C" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={{ stroke: "#29323C" }} tickLine={false} />
                <YAxis tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "#1E2731", border: "1px solid #29323C", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#E9EFF4" }}
                />
                <Bar dataKey="jobs" radius={[5, 5, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="quick-actions">
              <button className="quick-btn"><Users size={14} /> New Client</button>
              <button className="quick-btn"><FileText size={14} /> Generate Quote</button>
              <button className="quick-btn"><Radio size={14} /> Site Check-in</button>
            </div>
          </div>

          <div className="panel-block">
            <div className="section-title">
              Recent Jobs <span className="tag">LAST 7 ENTRIES</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={i}>
                    <td>
                      <div className="client-name">{j.client}</div>
                      <div className="date-cell">{j.date}</div>
                    </td>
                    <td style={{ fontSize: 12.5 }}>{j.service}</td>
                    <td>
                      <div className="loc-cell"><MapPin size={11} /> {j.loc}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ color: statusStyle[j.status as StatusType].color, background: statusStyle[j.status as StatusType].bg }}>
                        {j.status}
                      </span>
                    </td>
                    <td><ChevronRight size={14} color="#8A97A5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

