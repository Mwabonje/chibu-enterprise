import React, { useState, useMemo } from "react";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, Search, Download, Send,
  CheckCircle2, Clock, AlertTriangle, FileEdit, MapPin, Banknote, ArrowUp, ArrowDown, Trash2
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
  "Paid": { color: "#35D399", bg: "rgba(53,211,153,0.13)", icon: CheckCircle2 },
  "Unpaid": { color: "#FFB020", bg: "rgba(255,176,32,0.13)", icon: Clock },
  "Overdue": { color: "#FF7A59", bg: "rgba(255,122,89,0.13)", icon: AlertTriangle },
  "Draft": { color: "#9BA8B4", bg: "rgba(155,168,180,0.13)", icon: FileEdit },
};

const invoices = [
  {
    id: 1, no: "INV-2026-0132", client: "Peter Mwakio", location: "Malindi", phone: "+254 721 004 552",
    service: "CCTV Installation", issued: "14 Aug 2026", due: "21 Aug 2026", status: "Paid", paidOn: "18 Aug 2026",
    items: [{ service: "CCTV Installation", desc: "8-channel CCTV kit, 6 cameras, cabling & setup", qty: 1, price: 52000 }],
  },
  {
    id: 2, no: "INV-2026-0133", client: "Fatuma Said", location: "Kilifi", phone: "+254 700 118 226",
    service: "Electric Fence Installation", issued: "17 Aug 2026", due: "24 Aug 2026", status: "Paid", paidOn: "19 Aug 2026",
    items: [{ service: "Electric Fence Installation", desc: "Perimeter fencing, 140m, energizer unit", qty: 1, price: 78880 }],
  },
  {
    id: 3, no: "INV-2026-0134", client: "David Kimani", location: "Diani", phone: "+254 733 402 918",
    service: "Alarm System Installation", issued: "16 Aug 2026", due: "30 Aug 2026", status: "Unpaid",
    items: [{ service: "Alarm System Installation", desc: "Wireless alarm system, 6 sensors, control panel", qty: 1, price: 61000 }],
  },
  {
    id: 4, no: "INV-2026-0135", client: "Grace Wanjiru", location: "Nakuru", phone: "+254 745 662 301",
    service: "Window & Staircase Grill", issued: "28 Jul 2026", due: "11 Aug 2026", status: "Overdue",
    items: [{ service: "Window & Staircase Grill", desc: "Steel window grills (6 units) & staircase railing", qty: 1, price: 34500 }],
  },
  {
    id: 5, no: "INV-2026-0136", client: "Halima Abdi", location: "Kilifi", phone: "+254 711 987 044",
    service: "Solar Installation", issued: "—", due: "—", status: "Draft",
    items: [{ service: "Solar Installation", desc: "5kW solar system, panels, inverter & battery bank", qty: 1, price: 210000 }],
  },
  {
    id: 6, no: "INV-2026-0137", client: "James Otieno", location: "Bamburi, Mombasa", phone: "+254 707 331 890",
    service: "Solar Installation", issued: "18 Aug 2026", due: "01 Sep 2026", status: "Unpaid",
    items: [
      { service: "Solar Installation", desc: "3.5kW solar system with battery backup", qty: 1, price: 142000 },
      { service: "CCTV Installation", desc: "Additional camera for solar equipment room", qty: 1, price: 14400 },
    ],
  },
];

const VAT_RATE = 0.16;
const TABS = ["All", "Paid", "Unpaid", "Overdue", "Draft"];

function money(n) {
  return "KES " + n.toLocaleString("en-KE", { minimumFractionDigits: 0 });
}
function invoiceTotal(inv) {
  const sub = inv.items.reduce((s, it) => s + it.qty * it.price, 0);
  return { sub, vat: sub * VAT_RATE, total: sub * (1 + VAT_RATE) };
}

export default function ChibuInvoices() {
  const [invoiceList, setInvoiceList] = useState(invoices);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(invoices[0].id);
  const [statusOverride, setStatusOverride] = useState<Record<number, string>>({});
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const list = invoiceList.map((inv) => ({ ...inv, status: statusOverride[inv.id] || inv.status }));

  const filtered = useMemo(() => {
    let res = list.filter((inv) => {
      const matchesTab = tab === "All" || inv.status === tab;
      const q = query.toLowerCase();
      const matchesQuery = !q || inv.client.toLowerCase().includes(q) || inv.no.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });

    if (sortConfig !== null) {
      res.sort((a, b) => {
        if (sortConfig.key === 'client') {
          return sortConfig.direction === 'asc' 
            ? a.client.localeCompare(b.client) 
            : b.client.localeCompare(a.client);
        } else if (sortConfig.key === 'date') {
          const dateA = new Date(a.issued).getTime();
          const dateB = new Date(b.issued).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    }

    return res;
  }, [tab, query, list, sortConfig]);

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

  const selected = list.find((inv) => inv.id === selectedId) || filtered[0];
  const { sub, vat, total } = selected ? invoiceTotal(selected) : { sub: 0, vat: 0, total: 0 };

  const totals = useMemo(() => {
    const paid = list.filter((i) => i.status === "Paid").reduce((s, i) => s + invoiceTotal(i).total, 0);
    const outstanding = list.filter((i) => i.status === "Unpaid").reduce((s, i) => s + invoiceTotal(i).total, 0);
    const overdue = list.filter((i) => i.status === "Overdue").reduce((s, i) => s + invoiceTotal(i).total, 0);
    const invoicedMtd = list.filter((i) => i.status !== "Draft").reduce((s, i) => s + invoiceTotal(i).total, 0);
    return { paid, outstanding, overdue, invoicedMtd };
  }, [list]);

  const markPaid = (id) => setStatusOverride((prev) => ({ ...prev, [id]: "Paid" }));

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:wght@500;600&display=swap');

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

        .layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; align-items: stretch; }

        .list-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
        .search-box { display: flex; align-items: center; gap: 8px; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 11px; margin-bottom: 12px; }
        .search-box input { background: transparent; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .tab-btn { font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: transparent; }
        .tab-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        .inv-list-header { display: flex; align-items: center; padding: 0 10px 12px 10px; border-bottom: 1px solid var(--border); margin-bottom: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--dim); letter-spacing: 0.05em; }
        .sortable-col { display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
        .sortable-col:hover { color: var(--text); }

        .inv-row { display: flex; align-items: center; gap: 12px; padding: 12px 10px; border-radius: 9px; cursor: pointer; border: 1px solid transparent; margin-bottom: 4px; }
        .inv-row:hover { background: var(--panel-2); }
        .inv-row.selected { background: var(--panel-2); border-color: var(--amber); }
        .inv-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .inv-mid { flex: 1; min-width: 0; }
        .inv-client { font-size: 13px; font-weight: 600; }
        .inv-meta { font-size: 11px; color: var(--dim); margin-top: 2px; display: flex; gap: 6px; align-items: center; }
        .inv-right { text-align: right; }
        .inv-amount { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; margin-top: 4px; }
        .empty-state { text-align: center; padding: 30px 10px; color: var(--dim); font-size: 13px; }

        .preview-shell { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
        .preview-tag { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .preview-actions { display: flex; gap: 8px; }
        .icon-btn { display: flex; align-items: center; gap: 5px; background: var(--panel-2); border: 1px solid var(--border); color: var(--text); font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .icon-btn:hover { border-color: var(--amber); }
        .icon-btn.pay { color: var(--green); }
        .icon-btn.pay:hover { border-color: var(--green); }

        .paper { position: relative; background: #F7F3EC; color: #23201B; border-radius: 4px; padding: 32px; font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.35); overflow: hidden; flex: 1; display: flex; flex-direction: column; }
        .stamp { position: absolute; top: 92px; right: 40px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 0.08em; border: 4px solid; padding: 4px 16px; border-radius: 8px; transform: rotate(-14deg); opacity: 0.85; }
        .stamp.paid { color: #1F9D6B; border-color: #1F9D6B; }
        .stamp.overdue { color: #E24E3C; border-color: #E24E3C; }

        .paper-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #23201B; padding-bottom: 15px; margin-bottom: 16px; }
        .paper-brand { display: flex; align-items: center; gap: 10px; }
        .paper-mark { width: 34px; height: 34px; border-radius: 8px; background: linear-gradient(135deg,#FFB020,#FF7A59); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; color:#20140A; font-size:14px; }
        .paper-company { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.01em; width: max-content; }
        .paper-company-sub { display: flex; justify-content: space-between; font-size: 8px; text-transform: uppercase; color: #6B6255; margin-top: 3px; font-weight: 600; width: 100%; }
        .paper-meta { text-align: right; font-size: 11px; color: #4A443B; line-height: 1.7; }
        .paper-title { font-family: 'Source Serif 4', serif; font-size: 24px; font-weight: 600; }

        .paper-info-row { display: flex; justify-content: space-between; margin-bottom: 18px; gap: 18px; }
        .paper-info-block { font-size: 11.5px; line-height: 1.75; }
        .paper-info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; margin-bottom: 3px; font-weight: 600; }
        .paper-info-name { font-weight: 600; font-size: 13px; }

        .paper-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
        .paper-table th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #8C8375; font-weight: 600; padding-bottom: 7px; border-bottom: 1.5px solid #23201B; }
        .paper-table th.num, .paper-table td.num { text-align: right; }
        .paper-table td { padding: 9px 0; border-bottom: 1px solid #D8D0C0; font-size: 12px; vertical-align: top; }
        .paper-item-service { display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
        .paper-item-service .sw { width: 6px; height: 6px; border-radius: 2px; }
        .mono { font-family: 'IBM Plex Mono', monospace; }

        .paper-totals { margin-left: auto; width: 220px; margin-top: 12px; font-size: 12px; }
        .paper-totals-row { display: flex; justify-content: space-between; padding: 5px 0; color: #4A443B; }
        .paper-totals-row.grand { border-top: 2px solid #23201B; margin-top: 5px; padding-top: 9px; font-weight: 700; font-size: 14px; color: #23201B; }

        .paper-pay-block { margin-top: auto; border-top: 1px dashed #C9BFAC; padding-top: 13px; font-size: 10.5px; color: #5A5347; line-height: 1.8; display: flex; justify-content: space-between; gap: 20px; }
        .paper-pay-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; font-weight: 600; margin-bottom: 4px; }
        .paper-foot { margin-top: 18px; text-align: center; font-size: 10px; color: #8C8375; letter-spacing: 0.03em; }

        @media (max-width: 980px) { .layout { grid-template-columns: minmax(0, 1fr); } .stat-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
        @media (max-width: 560px) { .paper { padding: 20px 16px; } .paper-head, .paper-pay-block { flex-direction: column; gap: 10px; } .paper-meta { text-align: left; } .stamp { display: none; } }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">Invoices</div>
          <div className="page-sub">{list.length} invoices &middot; {list.filter(i => i.status === "Overdue").length} overdue &middot; {list.filter(i => i.status === "Draft").length} draft</div>
        </div>
        <button className="btn btn-primary"><Banknote size={15} /> New Invoice</button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#3FC1E0" }} /><div className="corner tr" style={{ borderColor: "#3FC1E0" }} />
          <div className="corner bl" style={{ borderColor: "#3FC1E0" }} /><div className="corner br" style={{ borderColor: "#3FC1E0" }} />
          <div className="stat-label">Invoiced, MTD</div>
          <div className="stat-value">{money(Math.round(totals.invoicedMtd))}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#35D399" }} /><div className="corner tr" style={{ borderColor: "#35D399" }} />
          <div className="corner bl" style={{ borderColor: "#35D399" }} /><div className="corner br" style={{ borderColor: "#35D399" }} />
          <div className="stat-label">Paid</div>
          <div className="stat-value" style={{ color: "#35D399" }}>{money(Math.round(totals.paid))}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FFB020" }} /><div className="corner tr" style={{ borderColor: "#FFB020" }} />
          <div className="corner bl" style={{ borderColor: "#FFB020" }} /><div className="corner br" style={{ borderColor: "#FFB020" }} />
          <div className="stat-label">Outstanding</div>
          <div className="stat-value" style={{ color: "#FFB020" }}>{money(Math.round(totals.outstanding))}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FF7A59" }} /><div className="corner tr" style={{ borderColor: "#FF7A59" }} />
          <div className="corner bl" style={{ borderColor: "#FF7A59" }} /><div className="corner br" style={{ borderColor: "#FF7A59" }} />
          <div className="stat-label">Overdue</div>
          <div className="stat-value" style={{ color: "#FF7A59" }}>{money(Math.round(totals.overdue))}</div>
        </div>
      </div>

      <div className="layout">
        <div className="list-panel">
          <div className="search-box">
            <Search size={14} color="#8A97A5" />
            <input placeholder="Search client or invoice no." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="tabs">
            {TABS.map((t) => (
              <div key={t} className={`tab-btn \${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, marginRight: -4 }}>
            {filtered.length === 0 && <div className="empty-state">No invoices match this filter.</div>}

            <div className="inv-list-header">
              <div className="sortable-col" onClick={() => handleSort('client')} style={{ flex: 1, paddingLeft: 46 }}>
                Client / Invoice <SortIcon columnKey="client" />
              </div>
              <div className="sortable-col" style={{ textAlign: "right", justifyContent: "flex-end" }} onClick={() => handleSort('date')}>
                Amount &amp; Status <SortIcon columnKey="date" />
              </div>
            </div>

            {filtered.map((inv) => {
              const meta = SERVICE_META[inv.service as keyof typeof SERVICE_META];
              const Icon = meta.icon;
              const sMeta = STATUS_META[inv.status as keyof typeof STATUS_META];
              const SIcon = sMeta.icon;
              const t = invoiceTotal(inv).total;
              return (
                <div
                  key={inv.id}
                  className={`inv-row \${selected && selected.id === inv.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(inv.id)}
                >
                  <div className="inv-icon" style={{ background: meta.color + "20" }}>
                    <Icon size={16} color={meta.color} />
                  </div>
                  <div className="inv-mid">
                    <div className="inv-client">{inv.client}</div>
                    <div className="inv-meta">{inv.no} &middot; <MapPin size={10} /> {inv.location}</div>
                  </div>
                  <div className="inv-right">
                    <div className="inv-amount">{money(Math.round(t))}</div>
                    <div className="badge" style={{ color: sMeta.color, background: sMeta.bg }}>
                      <SIcon size={10} /> {inv.status}
                    </div>
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(inv.id); }}
                    style={{ color: "var(--dim)", cursor: "pointer", display: "flex", padding: "4px" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#E24E3C")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="preview-shell">
            <div className="preview-tag">
              <span>Invoice {selected.no}</span>
              <div className="preview-actions">
                {selected.status !== "Paid" && (
                  <div className="icon-btn pay" onClick={() => markPaid(selected.id)}><CheckCircle2 size={13} /> Mark Paid</div>
                )}
                <div className="icon-btn"><Download size={13} /> PDF</div>
                <div className="icon-btn"><Send size={13} /> Send</div>
              </div>
            </div>

            <div className="paper">
              {selected.status === "Paid" && <div className="stamp paid">PAID</div>}
              {selected.status === "Overdue" && <div className="stamp overdue">OVERDUE</div>}

              <div className="paper-head">
                <div className="paper-brand">
                  <div className="paper-mark">CE</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="paper-company" >CHIBU ENTERPRISES</div>
                    <div className="paper-company-sub" >
                      <span>Security</span>
                      <span>&amp;</span>
                      <span>Power</span>
                      <span>Systems</span>
                    </div>
                  </div>
                </div>
                <div className="paper-meta">
                  <div>Nyali Road, Mombasa, Kenya</div>
                  <div>+254 733 900 214 &middot; hello@chibuenterprises.co.ke</div>
                </div>
              </div>

              <div className="paper-info-row">
                <div className="paper-info-block">
                  <div className="paper-info-label">Bill To</div>
                  <div className="paper-info-name">{selected.client}</div>
                  <div>{selected.location}</div>
                  <div>{selected.phone}</div>
                </div>
                <div className="paper-info-block" style={{ textAlign: "right" }}>
                  <div className="paper-title">Invoice</div>
                  <div style={{ marginTop: 7 }}>
                    <span className="paper-info-label" style={{ display: "inline" }}>No.</span> {selected.no}<br />
                    <span className="paper-info-label" style={{ display: "inline" }}>Issued</span> {selected.issued}<br />
                    <span className="paper-info-label" style={{ display: "inline" }}>Due</span> {selected.due}
                  </div>
                </div>
              </div>

              <table className="paper-table">
                <thead>
                  <tr>
                    <th style={{ width: "52%" }}>Description</th>
                    <th className="num">Qty</th>
                    <th className="num">Unit Price</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((it, i) => {
                    const meta = SERVICE_META[it.service as keyof typeof SERVICE_META];
                    return (
                      <tr key={i}>
                        <td>
                          <div className="paper-item-service" style={{ color: meta.color }}>
                            <span className="sw" style={{ background: meta.color }} /> {it.service}
                          </div>
                          {it.desc}
                        </td>
                        <td className="num mono">{it.qty}</td>
                        <td className="num mono">{money(it.price)}</td>
                        <td className="num mono">{money(it.qty * it.price)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="paper-totals">
                <div className="paper-totals-row"><span>Subtotal</span><span className="mono">{money(Math.round(sub))}</span></div>
                <div className="paper-totals-row"><span>VAT (16%)</span><span className="mono">{money(Math.round(vat))}</span></div>
                <div className="paper-totals-row grand"><span>Total Due</span><span className="mono">{money(Math.round(total))}</span></div>
              </div>

              <div className="paper-pay-block">
                <div>
                  <div className="paper-pay-label">Payment Method</div>
                  M-Pesa Paybill 400 200, Account: {selected.no}<br />
                  Bank: Equity Bank, Acc. 0450 221 986 331
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="paper-pay-label">Status</div>
                  {selected.status === "Paid" ? `Paid in full on \${selected.paidOn}` : `Balance of \${money(Math.round(total))} due \${selected.due}`}
                </div>
              </div>

              <div className="paper-foot">Thank you for choosing Chibu Enterprises &middot; chibuenterprises.co.ke</div>
            </div>
          </div>
        )}
      </div>
      <DeleteModal 
        isOpen={deletingId !== null}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          setInvoiceList(prev => prev.filter(i => i.id !== deletingId));
          setDeletingId(null);
        }}
      />
    </div>
  );
}
