import React, { useState, useMemo } from "react";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, Search, Phone, Mail, MapPin,
  Crown, Calendar, Wallet, Briefcase, CheckCircle2, Clock, FileText,
  Banknote, UserPlus, PhoneCall
} from "lucide-react";

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
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(clients[0].id);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return clients.filter((c) => {
      const matchesTab = tab === "All" || c.status === tab;
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    }).sort((a, b) => b.lifetime - a.lifetime);
  }, [tab, query]);

  const selected = clients.find((c) => c.id === selectedId) || filtered[0];

  const totals = useMemo(() => {
    const active = clients.filter((c) => c.status === "Active").length;
    const lifetimeValue = clients.reduce((s, c) => s + c.lifetime, 0);
    const outstanding = clients.reduce((s, c) => s + c.outstanding, 0);
    return { total: clients.length, active, lifetimeValue, outstanding };
  }, []);

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

        .layout { display: grid; grid-template-columns: 1fr 1.35fr; gap: 16px; align-items: start; }

        /* ---- LIST ---- */
        .list-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
        .search-box { display: flex; align-items: center; gap: 8px; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 11px; margin-bottom: 12px; }
        .search-box input { background: transparent; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .tab-btn { font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: transparent; }
        .tab-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        .client-row { display: flex; align-items: center; gap: 12px; padding: 12px 10px; border-radius: 9px; cursor: pointer; border: 1px solid transparent; margin-bottom: 4px; }
        .client-row:hover { background: var(--panel-2); }
        .client-row.selected { background: var(--panel-2); border-color: var(--amber); }
        .avatar { width: 38px; height: 38px; border-radius: 999px; background: var(--panel-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; flex-shrink: 0; }
        .client-mid { flex: 1; min-width: 0; }
        .client-name { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .client-meta { font-size: 11px; color: var(--dim); margin-top: 2px; display: flex; gap: 5px; align-items: center; }
        .client-right { text-align: right; }
        .client-spend { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; }
        .client-balance { font-size: 10.5px; color: var(--amber); margin-top: 3px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; margin-top: 4px; }
        .empty-state { text-align: center; padding: 30px 10px; color: var(--dim); font-size: 13px; }

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
          .layout { grid-template-columns: 1fr; }
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .mini-stats { grid-template-columns: 1fr 1fr; }
          .contact-block { text-align: left; }
          .contact-line { justify-content: flex-start; }
        }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">Clients</div>
          <div className="page-sub">{totals.total} clients &middot; {totals.active} active &middot; {clients.filter(c => c.status === "Lead").length} leads</div>
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

          {filtered.map((c) => {
            const sMeta = STATUS_META[c.status as keyof typeof STATUS_META];
            return (
              <div
                key={c.id}
                className={`client-row ${selected && selected.id === c.id ? "selected" : ""}`}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="avatar">{initials(c.name)}</div>
                <div className="client-mid">
                  <div className="client-name">{c.name}{c.vip && <Crown size={12} color="#FFB020" />}</div>
                  <div className="client-meta"><MapPin size={10} /> {c.location}</div>
                </div>
                <div className="client-right">
                  <div className="client-spend">{money(c.lifetime)}</div>
                  <div className="badge" style={{ color: sMeta.color, background: sMeta.bg }}>{c.status}</div>
                  {c.outstanding > 0 && <div className="client-balance">Due {money(c.outstanding)}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL */}
        {selected && (
          <div className="detail-panel">
            <div className="detail-head">
              <div className="detail-id">
                <div className="avatar-lg">{initials(selected.name)}</div>
                <div>
                  <div className="detail-name-row">
                    <div className="detail-name">{selected.name}</div>
                  </div>
                  <div className="detail-tags">
                    <span className="tag" style={{ color: STATUS_META[selected.status as keyof typeof STATUS_META].color, borderColor: STATUS_META[selected.status as keyof typeof STATUS_META].color + "55" }}>{selected.status}</span>
                    <span className="tag">{selected.type}</span>
                    {selected.vip && <span className="tag vip-tag"><Crown size={11} /> VIP Client</span>}
                  </div>
                </div>
              </div>
              <div className="contact-block">
                <div className="contact-line"><Phone size={12} /> {selected.phone}</div>
                <div className="contact-line"><Mail size={12} /> {selected.email}</div>
                <div className="contact-line"><MapPin size={12} /> {selected.location}</div>
              </div>
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <div className="mini-stat-label"><Wallet size={11} /> Lifetime Value</div>
                <div className="mini-stat-value">{money(selected.lifetime)}</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-label"><Clock size={11} /> Outstanding</div>
                <div className="mini-stat-value" style={{ color: selected.outstanding > 0 ? "#FFB020" : "#35D399" }}>
                  {selected.outstanding > 0 ? money(selected.outstanding) : "Settled"}
                </div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-label"><Briefcase size={11} /> Jobs</div>
                <div className="mini-stat-value">{selected.jobs}</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-label"><Calendar size={11} /> Client Since</div>
                <div className="mini-stat-value" style={{ fontSize: 13 }}>{selected.since}</div>
              </div>
            </div>

            <div className="quick-actions">
              <div className="quick-btn"><FileText size={14} /> New Quote</div>
              <div className="quick-btn"><Banknote size={14} /> Log Payment</div>
              <div className="quick-btn"><PhoneCall size={14} /> Call</div>
              <div className="quick-btn"><Mail size={14} /> Email</div>
            </div>

            <div className="notes-box">
              <div className="notes-label">Notes</div>
              {selected.notes}
            </div>

            <div className="section-title">Service History</div>
            {selected.history.map((h, i) => {
              const meta = SERVICE_META[h.service as keyof typeof SERVICE_META];
              const Icon = meta.icon;
              const hMeta = HISTORY_STATUS[h.status as keyof typeof HISTORY_STATUS];
              const HIcon = hMeta.icon;
              return (
                <div className="hist-row" key={i}>
                  <div className="hist-icon" style={{ background: meta.color + "20" }}>
                    <Icon size={15} color={meta.color} />
                  </div>
                  <div className="hist-mid">
                    <div className="hist-service">{h.service}</div>
                    <div className="hist-desc">{h.desc}</div>
                  </div>
                  <div className="hist-right">
                    <div className="hist-amount">{money(h.amount)}</div>
                    <div className="hist-date">{h.date}</div>
                    <span className="badge" style={{ color: hMeta.color, background: hMeta.bg, marginTop: 4 }}>
                      <HIcon size={10} /> {h.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
