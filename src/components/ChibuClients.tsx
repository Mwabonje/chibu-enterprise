import React, { useState, useMemo } from "react";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, Search, Phone, Mail, MapPin,
  Crown, Calendar, Wallet, Briefcase, CheckCircle2, Clock, FileText,
  Banknote, UserPlus, PhoneCall, ArrowUp, ArrowDown, Trash2
} from "lucide-react";
import { DeleteModal } from "./DeleteModal";

const SERVICE_META = {
  "CCTV Installation": { icon: Camera, color: "#3FC1E0" },
  "Solar Installation": { icon: Sun, color: "#FFB020" },
  "Alarm System Installation": { icon: ShieldCheck, color: "#FF7A59" },
  "Window & Staircase Grill": { icon: Grid3x3, color: "#9BA8B4" },
  "Electric Fence Installation": { icon: Zap, color: "#35D399" },
};

const STATUS_META = {
  "Active": { color: "#35D399", bg: "rgba(53,211,153,0.13)" },
  "Lead": { color: "#3FC1E0", bg: "rgba(63,193,224,0.13)" },
  "Inactive": { color: "#9BA8B4", bg: "rgba(155,168,180,0.13)" },
};

const clients = [
  {
    id: 1, name: "Samuel Njoroge", type: "Commercial", location: "Diani", status: "Active", vip: true,
    phone: "+254 722 550 118", email: "samuel.njoroge@example.com", since: "12 Mar 2026",
    lifetime: 385000, outstanding: 0, jobs: 4,
    notes: "Repeat client across two rental properties. Prefers bank transfer, always pays on invoice date.",
    history: [
      { service: "CCTV Installation", desc: "12-camera system, two properties", date: "15 Mar 2026", amount: 148000, status: "Paid" },
      { service: "Alarm System Installation", desc: "Wireless alarm, both units", date: "02 May 2026", amount: 96000, status: "Paid" },
      { service: "Electric Fence Installation", desc: "Perimeter fencing, main property", date: "20 Jun 2026", amount: 84000, status: "Paid" },
      { service: "Window & Staircase Grill", desc: "Balcony & staircase grills", date: "30 Jul 2026", amount: 57000, status: "Paid" },
    ],
  },
  {
    id: 2, name: "James Otieno", type: "Commercial", location: "Bamburi, Mombasa", status: "Active", vip: false,
    phone: "+254 707 331 890", email: "james.otieno@example.com", since: "18 Aug 2026",
    lifetime: 181424, outstanding: 91424, jobs: 1,
    notes: "Warehouse solar + CCTV upgrade. Paid 90,000 deposit via cash, balance due 01 Sep.",
    history: [
      { service: "Solar Installation", desc: "3.5kW system with battery backup", date: "18 Aug 2026", amount: 164720, status: "Unpaid" },
      { service: "CCTV Installation", desc: "Camera for solar equipment room", date: "18 Aug 2026", amount: 16704, status: "Unpaid" },
    ],
  },
  {
    id: 3, name: "David Kimani", type: "Residential", location: "Diani", status: "Active", vip: false,
    phone: "+254 733 402 918", email: "david.kimani@example.com", since: "16 Aug 2026",
    lifetime: 70760, outstanding: 40760, jobs: 1,
    notes: "Partial M-Pesa payment received, awaiting reconciliation on remainder.",
    history: [
      { service: "Alarm System Installation", desc: "Wireless alarm, 6 sensors, control panel", date: "16 Aug 2026", amount: 70760, status: "Unpaid" },
    ],
  },
  {
    id: 4, name: "Fatuma Said", type: "Residential", location: "Kilifi", status: "Active", vip: false,
    phone: "+254 700 118 226", email: "fatuma.said@example.com", since: "17 Aug 2026",
    lifetime: 91501, outstanding: 0, jobs: 1,
    notes: "Referred Halima Abdi. Paid in full via bank transfer.",
    history: [
      { service: "Electric Fence Installation", desc: "Perimeter fencing, 140m, energizer unit", date: "17 Aug 2026", amount: 91501, status: "Paid" },
    ],
  },
  {
    id: 5, name: "Aisha Mwangi", type: "Residential", location: "Nyali, Mombasa", status: "Active", vip: false,
    phone: "+254 712 345 678", email: "aisha.mwangi@example.com", since: "19 Aug 2026",
    lifetime: 52200, outstanding: 52200, jobs: 1,
    notes: "Job currently in progress on site.",
    history: [
      { service: "CCTV Installation", desc: "4-channel CCTV kit, night-vision cameras", date: "19 Aug 2026", amount: 52200, status: "Unpaid" },
    ],
  },
  {
    id: 6, name: "Peter Mwakio", type: "Residential", location: "Malindi", status: "Active", vip: false,
    phone: "+254 721 004 552", email: "peter.mwakio@example.com", since: "14 Aug 2026",
    lifetime: 60320, outstanding: 0, jobs: 1,
    notes: "Quick turnaround, paid same week via M-Pesa.",
    history: [
      { service: "CCTV Installation", desc: "8-channel CCTV kit, 6 cameras, cabling & setup", date: "14 Aug 2026", amount: 60320, status: "Paid" },
    ],
  },
  {
    id: 7, name: "Grace Wanjiru", type: "Residential", location: "Nakuru", status: "Active", vip: false,
    phone: "+254 745 662 301", email: "grace.wanjiru@example.com", since: "28 Jul 2026",
    lifetime: 40020, outstanding: 40020, jobs: 1,
    notes: "Payment attempt failed on 12 Aug — follow up needed, invoice now overdue.",
    history: [
      { service: "Window & Staircase Grill", desc: "Steel window grills (6 units) & staircase railing", date: "28 Jul 2026", amount: 40020, status: "Unpaid" },
    ],
  },
  {
    id: 8, name: "Halima Abdi", type: "Residential", location: "Kilifi", status: "Lead", vip: false,
    phone: "+254 711 987 044", email: "halima.abdi@example.com", since: "20 Aug 2026",
    lifetime: 0, outstanding: 0, jobs: 0,
    notes: "Referred by Fatuma Said. Quote drafted for 5kW solar system, awaiting sign-off.",
    history: [
      { service: "Solar Installation", desc: "5kW solar system, panels, inverter & battery bank (quoted)", date: "Draft", amount: 243600, status: "Draft" },
    ],
  },
];

const TABS = ["All", "Active", "Lead", "Inactive"];

function money(n: number) {
  return "KES " + Math.round(n).toLocaleString("en-KE");
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const HISTORY_STATUS = {
  "Paid": { color: "#35D399", bg: "rgba(53,211,153,0.13)", icon: CheckCircle2 },
  "Unpaid": { color: "#FFB020", bg: "rgba(255,176,32,0.13)", icon: Clock },
  "Draft": { color: "#9BA8B4", bg: "rgba(155,168,180,0.13)", icon: FileText },
};

export default function ChibuClients() {
  const [clientList, setClientList] = useState(clients);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(clients[0].id);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let res = clientList.filter((c) => {
      const matchesTab = tab === "All" || c.status === tab;
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });

    if (sortConfig !== null) {
      res.sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortConfig.key === 'date') {
          const dateA = new Date(a.since).getTime();
          const dateB = new Date(b.since).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    } else {
      res.sort((a, b) => b.lifetime - a.lifetime);
    }
    return res;
  }, [tab, query, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowDown size={12} style={{ opacity: 0.3 }} />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} color="var(--text)" /> : <ArrowDown size={12} color="var(--text)" />;
  };

  const selected = clientList.find((c) => c.id === selectedId) || filtered[0];

  const totals = useMemo(() => {
    const active = clientList.filter((c) => c.status === "Active").length;
    const lifetimeValue = clientList.reduce((s, c) => s + c.lifetime, 0);
    const outstanding = clientList.reduce((s, c) => s + c.outstanding, 0);
    return { total: clientList.length, active, lifetimeValue, outstanding };
  }, [clientList]);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; }
        .page-sub { color: var(--dim); font-size: 12.5px; margin-top: 3px; }
        .btn { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; padding: 9px 15px; border-radius: 8px; cursor: pointer; border: none; }
        .btn-primary { background: var(--amber); color: #14181D; }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .stat-tile { position: relative; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
        .corner { position: absolute; width: 11px; height: 11px; border: 2px solid; opacity: 0.9; }
        .corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        .corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        .corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        .corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        .stat-label { font-size: 11px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.08em; }
        .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 600; margin-top: 7px; }

        .layout { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }

        /* ---- LIST ---- */
        .list-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
        .search-box { display: flex; align-items: center; gap: 8px; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 11px; margin-bottom: 12px; }
        .search-box input { background: transparent; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .tab-btn { font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: transparent; }
        .tab-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        .list-header { display: grid; grid-template-columns: 2fr 1.5fr 1.2fr 1fr auto; gap: 16px; align-items: center; padding: 0 16px 12px 16px; border-bottom: 1px solid var(--border); margin-bottom: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--dim); letter-spacing: 0.05em; }
        .sortable-col { display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
        .sortable-col:hover { color: var(--text); }

        .client-row { display: grid; grid-template-columns: 2fr 1.5fr 1.2fr 1fr auto; gap: 16px; align-items: center; padding: 16px; border-radius: 9px; cursor: pointer; border: 1px solid var(--border); margin-bottom: 8px; }
        .client-row:hover { background: var(--panel-2); border-color: var(--amber); }
        .client-row.selected { background: var(--panel-2); border-color: var(--amber); }
        .client-col { display: flex; flex-direction: column; gap: 4px; }
        
        .avatar { width: 42px; height: 42px; border-radius: 999px; background: var(--panel-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        
        .client-name-group { display: flex; align-items: center; gap: 12px; }
        .client-name { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .client-meta { font-size: 12px; color: var(--dim); display: flex; gap: 6px; align-items: center; }
        .client-spend { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; }
        .client-balance { font-size: 11px; color: var(--amber); font-weight: 500; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .empty-state { text-align: center; padding: 40px 10px; color: var(--dim); font-size: 14px; }

        /* ---- DETAIL ---- */
        .detail-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
        .detail-id { display: flex; align-items: center; gap: 14px; }
        .avatar-lg { width: 54px; height: 54px; border-radius: 999px; background: var(--panel-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; flex-shrink: 0; }
        .detail-name-row { display: flex; align-items: center; gap: 8px; }
        .detail-name { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; }
        .detail-tags { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
        .tag { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); }
        .vip-tag { color: #FFB020; border-color: rgba(255,176,32,0.4); background: rgba(255,176,32,0.1); display: flex; align-items: center; gap: 4px; }
        .contact-block { text-align: right; font-size: 12px; color: var(--dim); line-height: 1.9; }
        .contact-line { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }

        .mini-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
        .mini-stat { background: var(--panel-2); border: 1px solid var(--border); border-radius: 9px; padding: 11px 13px; }
        .mini-stat-label { font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.07em; display: flex; align-items: center; gap: 5px; }
        .mini-stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 15.5px; font-weight: 600; margin-top: 6px; }

        .quick-actions { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .quick-btn { display: flex; align-items: center; gap: 6px; background: var(--panel-2); border: 1px solid var(--border); color: var(--text); font-size: 12px; font-weight: 600; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
        .quick-btn:hover { border-color: var(--amber); }

        .notes-box { background: var(--panel-2); border: 1px solid var(--border); border-radius: 9px; padding: 12px 14px; font-size: 12.5px; color: var(--dim); margin-bottom: 20px; line-height: 1.6; }
        .notes-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); font-weight: 600; margin-bottom: 5px; }

        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 12px; }

        .hist-row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); }
        .hist-row:last-child { border-bottom: none; }
        .hist-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hist-mid { flex: 1; min-width: 0; }
        .hist-service { font-size: 12.5px; font-weight: 600; }
        .hist-desc { font-size: 11.5px; color: var(--dim); margin-top: 1px; }
        .hist-right { text-align: right; flex-shrink: 0; }
        .hist-amount { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; }
        .hist-date { font-size: 10.5px; color: var(--dim); margin-top: 2px; }

        @media (max-width: 980px) {
          .stat-grid { grid-template-columns: 1fr 1fr; }
        }
        
        @media (max-width: 768px) {
          .list-header { display: none; }
          .client-row { grid-template-columns: 1fr; gap: 12px; }
          .client-col { align-items: flex-start; }
          .client-row > div:last-child { text-align: left; }
        }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">Clients</div>
          <div className="page-sub">{totals.total} clients &middot; {totals.active} active &middot; {clientList.filter(c => c.status === "Lead").length} leads</div>
        </div>
        <button className="btn btn-primary"><UserPlus size={15} /> New Client</button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#3FC1E0" }} /><div className="corner tr" style={{ borderColor: "#3FC1E0" }} />
          <div className="corner bl" style={{ borderColor: "#3FC1E0" }} /><div className="corner br" style={{ borderColor: "#3FC1E0" }} />
          <div className="stat-label">Total Clients</div>
          <div className="stat-value">{totals.total}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#35D399" }} /><div className="corner tr" style={{ borderColor: "#35D399" }} />
          <div className="corner bl" style={{ borderColor: "#35D399" }} /><div className="corner br" style={{ borderColor: "#35D399" }} />
          <div className="stat-label">Active Clients</div>
          <div className="stat-value" style={{ color: "#35D399" }}>{totals.active}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FFB020" }} /><div className="corner tr" style={{ borderColor: "#FFB020" }} />
          <div className="corner bl" style={{ borderColor: "#FFB020" }} /><div className="corner br" style={{ borderColor: "#FFB020" }} />
          <div className="stat-label">Lifetime Value</div>
          <div className="stat-value">{money(totals.lifetimeValue)}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FF7A59" }} /><div className="corner tr" style={{ borderColor: "#FF7A59" }} />
          <div className="corner bl" style={{ borderColor: "#FF7A59" }} /><div className="corner br" style={{ borderColor: "#FF7A59" }} />
          <div className="stat-label">Outstanding Balances</div>
          <div className="stat-value" style={{ color: "#FF7A59" }}>{money(totals.outstanding)}</div>
        </div>
      </div>

      <div className="layout">
        {/* LIST */}
        <div className="list-panel">
          <div className="search-box">
            <Search size={14} color="#8A97A5" />
            <input placeholder="Search name or location" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="tabs">
            {TABS.map((t) => (
              <div key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>
            ))}
          </div>

          {filtered.length === 0 && <div className="empty-state">No clients match this filter.</div>}

          <div className="list-header">
            <div className="sortable-col" onClick={() => handleSort('name')}>
              Client Name <SortIcon columnKey="name" />
            </div>
            <div>Contact Info</div>
            <div className="sortable-col" onClick={() => handleSort('date')}>
              Info &amp; Date <SortIcon columnKey="date" />
            </div>
            <div>Financials</div>
            <div style={{ textAlign: "right" }}>Status</div>
          </div>

          {filtered.map((c) => {
            const sMeta = STATUS_META[c.status as keyof typeof STATUS_META];
            return (
              <div
                key={c.id}
                className={`client-row ${selected && selected.id === c.id ? "selected" : ""}`}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="client-name-group">
                  <div className="avatar">{initials(c.name)}</div>
                  <div className="client-col">
                    <div className="client-name">
                      {c.name}
                      {c.vip && <Crown size={12} color="#FFB020" />}
                    </div>
                    <div className="client-meta">
                      <MapPin size={12} /> {c.location}
                    </div>
                  </div>
                </div>
                
                <div className="client-col">
                  <div className="client-meta" style={{ color: "var(--text)" }}>
                    <Phone size={12} /> {c.phone}
                  </div>
                  <div className="client-meta">
                    <Mail size={12} /> {c.email}
                  </div>
                </div>

                <div className="client-col">
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.type}</div>
                  <div className="client-meta">Client since {c.since}</div>
                </div>

                <div className="client-col">
                  <div className="client-spend">{money(c.lifetime)}</div>
                  {c.outstanding > 0 ? (
                    <div className="client-balance">Due {money(c.outstanding)}</div>
                  ) : (
                    <div className="client-meta" style={{ color: "var(--green)" }}>Settled</div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
                  <div className="badge" style={{ color: sMeta.color, background: sMeta.bg }}>
                    {c.status}
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(c.id); }}
                    style={{ color: "var(--dim)", cursor: "pointer", display: "flex", padding: "4px" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#E24E3C")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <DeleteModal 
        isOpen={deletingId !== null}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone and all associated data will be lost."
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          setClientList(prev => prev.filter(c => c.id !== deletingId));
          setDeletingId(null);
        }}
      />
    </div>
  );
}
