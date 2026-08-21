import React, { useState, useMemo } from "react";
import {
  Smartphone, Landmark, Banknote, Search, CheckCircle2, Clock, XCircle,
  HelpCircle, Send, Download, ChevronDown, Plus
} from "lucide-react";

const METHODS = [
  { name: "M-Pesa", icon: Smartphone, color: "#35D399" },
  { name: "Bank Transfer", icon: Landmark, color: "#3FC1E0" },
  { name: "Cash", icon: Banknote, color: "#FFB020" },
];

const STATUS_META = {
  "Reconciled": { color: "#35D399", bg: "rgba(53,211,153,0.13)", icon: CheckCircle2 },
  "Pending Match": { color: "#FFB020", bg: "rgba(255,176,32,0.13)", icon: Clock },
  "Unmatched": { color: "#9BA8B4", bg: "rgba(155,168,180,0.13)", icon: HelpCircle },
  "Failed": { color: "#FF7A59", bg: "rgba(255,122,89,0.13)", icon: XCircle },
};

const INVOICES = [
  { no: "INV-2026-0132", client: "Peter Mwakio", location: "Malindi", total: 60320 },
  { no: "INV-2026-0133", client: "Fatuma Said", location: "Kilifi", total: 91501 },
  { no: "INV-2026-0134", client: "David Kimani", location: "Diani", total: 70760 },
  { no: "INV-2026-0135", client: "Grace Wanjiru", location: "Nakuru", total: 40020 },
  { no: "INV-2026-0137", client: "James Otieno", location: "Bamburi, Mombasa", total: 181424 },
];

const initialTx = [
  { id: 1, ref: "PMT-2026-0311", txCode: "QF7X2KL9M0", client: "Peter Mwakio", invoiceNo: "INV-2026-0132", method: "M-Pesa", amount: 60320, date: "18 Aug 2026", status: "Reconciled" },
  { id: 2, ref: "PMT-2026-0312", txCode: "EQTY-88213", client: "Fatuma Said", invoiceNo: "INV-2026-0133", method: "Bank Transfer", amount: 91501, date: "19 Aug 2026", status: "Reconciled" },
  { id: 3, ref: "PMT-2026-0313", txCode: "QG1P9DT4R2", client: "David Kimani", invoiceNo: "INV-2026-0134", method: "M-Pesa", amount: 30000, date: "20 Aug 2026", status: "Pending Match" },
  { id: 4, ref: "PMT-2026-0314", txCode: "CASH-0044", client: "James Otieno", invoiceNo: "INV-2026-0137", method: "Cash", amount: 90000, date: "18 Aug 2026", status: "Reconciled" },
  { id: 5, ref: "PMT-2026-0315", txCode: "QH4M8VW2N1", client: "Grace Wanjiru", invoiceNo: "INV-2026-0135", method: "M-Pesa", amount: 40020, date: "12 Aug 2026", status: "Failed" },
  { id: 6, ref: "PMT-2026-0316", txCode: "QJ0K3RT7B5", client: "Unknown Sender", invoiceNo: null, method: "M-Pesa", amount: 15000, date: "19 Aug 2026", status: "Unmatched" },
];

function money(n: number) {
  return "KES " + Math.round(n).toLocaleString("en-KE");
}
function methodMeta(name: string) {
  return METHODS.find((m) => m.name === name) || METHODS[0];
}

const TABS = ["All", "M-Pesa", "Bank Transfer", "Cash"];

export default function ChibuPayments() {
  const [tx, setTx] = useState(initialTx);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [methodOpen, setMethodOpen] = useState(false);
  const [invOpen, setInvOpen] = useState(false);

  const [form, setForm] = useState({
    invoiceNo: "INV-2026-0134",
    method: "M-Pesa",
    amount: "35000",
    txCode: "",
    date: "20 Aug 2026",
  });

  const invoice = INVOICES.find((i) => i.no === form.invoiceNo);
  const priorPaid = useMemo(
    () => tx.filter((t) => t.invoiceNo === form.invoiceNo && t.status !== "Failed").reduce((s, t) => s + t.amount, 0),
    [tx, form.invoiceNo]
  );
  const amountNum = Number(form.amount) || 0;
  const balanceAfter = invoice ? invoice.total - priorPaid - amountNum : 0;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tx.filter((t) => {
      const matchesTab = tab === "All" || t.method === tab;
      const matchesQuery = !q || t.client.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || (t.invoiceNo || "").toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tx, tab, query]);

  const totals = useMemo(() => {
    const received = tx.filter((t) => t.status !== "Failed").reduce((s, t) => s + t.amount, 0);
    const byMethod = (m: string) => tx.filter((t) => t.method === m && t.status !== "Failed").reduce((s, t) => s + t.amount, 0);
    return { received, mpesa: byMethod("M-Pesa"), bank: byMethod("Bank Transfer"), cash: byMethod("Cash") };
  }, [tx]);

  const recordPayment = () => {
    const nextId = Math.max(...tx.map((t) => t.id)) + 1;
    const nextRef = "PMT-2026-0" + (317 + (nextId - 7));
    setTx([
      { id: nextId, ref: nextRef, txCode: form.txCode || "—", client: invoice ? invoice.client : "—", invoiceNo: form.invoiceNo, method: form.method, amount: amountNum, date: form.date, status: balanceAfter <= 0 ? "Reconciled" : "Pending Match" },
      ...tx,
    ]);
    setForm({ ...form, amount: "", txCode: "" });
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:wght@500;600&display=swap');

        * { box-sizing: border-box; }

        .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; }
        .page-sub { color: var(--dim); font-size: 12.5px; margin-top: 3px; }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .stat-tile { position: relative; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
        .corner { position: absolute; width: 11px; height: 11px; border: 2px solid; opacity: 0.9; }
        .corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        .corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        .corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        .corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        .stat-label { font-size: 11px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px; }
        .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 600; margin-top: 7px; }

        .layout { display: grid; grid-template-columns: 1fr 1.15fr; gap: 16px; align-items: stretch; margin-bottom: 18px; }

        /* ---- FORM ---- */
        .form-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; }
        .block-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 10px; font-weight: 600; }
        .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .field label { font-size: 11px; color: var(--dim); }
        .field input {
          background: var(--panel-2); border: 1px solid var(--border); border-radius: 7px;
          padding: 9px 10px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif; outline: none;
        }
        .field input:focus { border-color: var(--amber); }
        .dropdown-wrap { position: relative; }
        .dropdown-face {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          background: var(--panel-2); border: 1px solid var(--border); border-radius: 7px;
          padding: 9px 10px; cursor: pointer; font-size: 13px;
        }
        .dropdown-face-left { display: flex; align-items: center; gap: 8px; }
        .dropdown-menu {
          position: absolute; top: 42px; left: 0; right: 0; z-index: 6; background: var(--panel);
          border: 1px solid var(--border); border-radius: 8px; padding: 5px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .dropdown-item { display: flex; align-items: center; gap: 8px; justify-content: space-between; padding: 9px 10px; border-radius: 6px; font-size: 12.5px; cursor: pointer; }
        .dropdown-item:hover { background: var(--panel-2); }
        .dropdown-item-left { display: flex; align-items: center; gap: 8px; }
        .dropdown-item-sub { color: var(--dim); font-size: 11px; }

        .method-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .method-pill {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          border: 1px solid var(--border); border-radius: 9px; padding: 11px 6px; cursor: pointer; background: var(--panel-2);
        }
        .method-pill.active { border-color: var(--amber); background: rgba(255,176,32,0.08); }
        .method-pill span { font-size: 11px; font-weight: 600; }

        .balance-strip { display: flex; justify-content: space-between; align-items: center; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; margin: 4px 0 16px; font-size: 12px; }
        .balance-strip .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }

        .submit-btn { margin-top: auto; }
        .btn { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; font-weight: 600; padding: 10px 15px; border-radius: 8px; cursor: pointer; border: none; width: 100%; }
        .btn-primary { background: var(--amber); color: #14181D; }

        /* ---- RECEIPT PREVIEW ---- */
        .preview-shell { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
        .preview-tag { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .preview-actions { display: flex; gap: 8px; }
        .icon-btn { display: flex; align-items: center; gap: 5px; background: var(--panel-2); border: 1px solid var(--border); color: var(--text); font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .icon-btn:hover { border-color: var(--amber); }

        .paper { position: relative; background: #F7F3EC; color: #23201B; border-radius: 4px; padding: 30px; font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.35); flex: 1; display: flex; flex-direction: column; }
        .paper-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #23201B; padding-bottom: 14px; margin-bottom: 16px; }
        .paper-brand { display: flex; align-items: center; gap: 10px; }
        .paper-mark { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg,#FFB020,#FF7A59); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; color:#20140A; font-size:13px; }
        .paper-company { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13.5px; width: max-content; }
        .paper-company-sub { display: flex; justify-content: space-between; font-size: 8px; text-transform: uppercase; color: #6B6255; margin-top: 3px; font-weight: 600; width: 100%; }
        .paper-title { font-family: 'Source Serif 4', serif; font-size: 22px; font-weight: 600; text-align: right; }
        .paper-title-sub { font-size: 10.5px; color: #6B6255; text-align: right; margin-top: 2px; }

        .amount-block { text-align: center; padding: 18px 0 20px; }
        .amount-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.12em; color: #8C8375; font-weight: 600; margin-bottom: 6px; }
        .amount-value { font-family: 'IBM Plex Mono', monospace; font-size: 34px; font-weight: 600; color: #1F9D6B; }

        .paper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; font-size: 12px; padding: 16px 0; border-top: 1px dashed #C9BFAC; border-bottom: 1px dashed #C9BFAC; margin-bottom: 18px; }
        .paper-grid-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; font-weight: 600; margin-bottom: 3px; }
        .paper-grid-value { font-weight: 600; }

        .paper-balance-row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 6px 0; }
        .paper-balance-row.total { font-weight: 700; font-size: 14px; padding-top: 10px; border-top: 2px solid #23201B; margin-top: 6px; }
        .paper-foot { margin-top: auto; padding-top: 20px; text-align: center; font-size: 10px; color: #8C8375; letter-spacing: 0.03em; }

        /* ---- TRANSACTION LOG ---- */
        .log-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
        .log-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
        .search-box { display: flex; align-items: center; gap: 8px; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 7px 11px; width: 220px; }
        .search-box input { background: transparent; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .tabs { display: flex; gap: 6px; }
        .tab-btn { font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: transparent; }
        .tab-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--dim); font-weight: 600; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
        th.num, td.num { text-align: right; }
        td { padding: 12px 8px 12px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
        tr:last-child td { border-bottom: none; }
        .method-cell { display: flex; align-items: center; gap: 8px; }
        .method-chip { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
        .tx-code { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--dim); }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .amount-cell { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
        .empty-state { text-align: center; padding: 26px 10px; color: var(--dim); font-size: 13px; }

        @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 700px) {
          .log-head { flex-direction: column; align-items: flex-start; }
          .search-box { width: 100%; }
          table, thead, tbody, tr, td, th { display: block; }
          thead { display: none; }
          tr { border-bottom: 1px solid var(--border); padding: 10px 0; }
          td { border-bottom: none; padding: 3px 0; }
          td.num { text-align: left; }
        }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">Payments</div>
          <div className="page-sub">{tx.length} transactions &middot; {tx.filter(t => t.status === "Pending Match" || t.status === "Unmatched").length} need reconciliation</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#E9EFF4" }} /><div className="corner tr" style={{ borderColor: "#E9EFF4" }} />
          <div className="corner bl" style={{ borderColor: "#E9EFF4" }} /><div className="corner br" style={{ borderColor: "#E9EFF4" }} />
          <div className="stat-label">Received, MTD</div>
          <div className="stat-value">{money(totals.received)}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#35D399" }} /><div className="corner tr" style={{ borderColor: "#35D399" }} />
          <div className="corner bl" style={{ borderColor: "#35D399" }} /><div className="corner br" style={{ borderColor: "#35D399" }} />
          <div className="stat-label"><Smartphone size={12} /> M-Pesa</div>
          <div className="stat-value" style={{ color: "#35D399" }}>{money(totals.mpesa)}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#3FC1E0" }} /><div className="corner tr" style={{ borderColor: "#3FC1E0" }} />
          <div className="corner bl" style={{ borderColor: "#3FC1E0" }} /><div className="corner br" style={{ borderColor: "#3FC1E0" }} />
          <div className="stat-label"><Landmark size={12} /> Bank Transfer</div>
          <div className="stat-value" style={{ color: "#3FC1E0" }}>{money(totals.bank)}</div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FFB020" }} /><div className="corner tr" style={{ borderColor: "#FFB020" }} />
          <div className="corner bl" style={{ borderColor: "#FFB020" }} /><div className="corner br" style={{ borderColor: "#FFB020" }} />
          <div className="stat-label"><Banknote size={12} /> Cash</div>
          <div className="stat-value" style={{ color: "#FFB020" }}>{money(totals.cash)}</div>
        </div>
      </div>

      <div className="layout">
        {/* RECORD PAYMENT FORM */}
        <div className="form-panel">
          <div className="block-label">Record a Payment</div>

          <div className="field">
            <label>Apply to invoice</label>
            <div className="dropdown-wrap">
              <div className="dropdown-face" onClick={() => setInvOpen(!invOpen)}>
                <div className="dropdown-face-left">{form.invoiceNo} &middot; {invoice ? invoice.client : ""}</div>
                <ChevronDown size={14} color="#8A97A5" />
              </div>
              {invOpen && (
                <div className="dropdown-menu">
                  {INVOICES.map((i) => (
                    <div key={i.no} className="dropdown-item" onClick={() => { setForm({ ...form, invoiceNo: i.no }); setInvOpen(false); }}>
                      <div className="dropdown-item-left">{i.no}<span className="dropdown-item-sub">{i.client}</span></div>
                      <span className="dropdown-item-sub">{money(i.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label style={{ fontSize: 11, color: "#8A97A5", marginBottom: 6, display: "block" }}>Payment method</label>
          <div className="method-row">
            {METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.name} className={`method-pill ${form.method === m.name ? "active" : ""}`} onClick={() => setForm({ ...form, method: m.name })}>
                  <Icon size={17} color={m.color} />
                  <span style={{ color: form.method === m.name ? m.color : "#8A97A5" }}>{m.name}</span>
                </div>
              );
            })}
          </div>

          <div className="field">
            <label>Amount received (KES)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="field">
            <label>Transaction code / reference</label>
            <input placeholder="e.g. QF7X2KL9M0" value={form.txCode} onChange={(e) => setForm({ ...form, txCode: e.target.value })} />
          </div>
          <div className="field">
            <label>Date received</label>
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <div className="balance-strip">
            <span style={{ color: "#8A97A5" }}>Balance after this payment</span>
            <span className="mono" style={{ color: balanceAfter <= 0 ? "#35D399" : "#FFB020" }}>
              {balanceAfter <= 0 ? "Paid in full" : money(balanceAfter)}
            </span>
          </div>

          <button className="btn btn-primary submit-btn" onClick={recordPayment}><Plus size={15} /> Record Payment</button>
        </div>

        {/* RECEIPT PREVIEW */}
        <div className="preview-shell">
          <div className="preview-tag">
            <span>Payment Receipt Preview</span>
            <div className="preview-actions">
              <div className="icon-btn"><Download size={13} /> PDF</div>
              <div className="icon-btn"><Send size={13} /> Send</div>
            </div>
          </div>
          <div className="paper">
            <div className="paper-head">
              <div className="paper-brand">
                <div className="paper-mark">CE</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="paper-company">CHIBU ENTERPRISES</div>
                  <div className="paper-company-sub">
                    <span>Security</span>
                    <span>&amp;</span>
                    <span>Power</span>
                    <span>Systems</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="paper-title">Receipt</div>
                <div className="paper-title-sub">{form.date}</div>
              </div>
            </div>

            <div className="amount-block">
              <div className="amount-label">Amount Received</div>
              <div className="amount-value">{money(amountNum)}</div>
            </div>

            <div className="paper-grid">
              <div>
                <div className="paper-grid-label">Received From</div>
                <div className="paper-grid-value">{invoice ? invoice.client : "—"}</div>
              </div>
              <div>
                <div className="paper-grid-label">Method</div>
                <div className="paper-grid-value">{form.method}</div>
              </div>
              <div>
                <div className="paper-grid-label">Applied to Invoice</div>
                <div className="paper-grid-value">{form.invoiceNo}</div>
              </div>
              <div>
                <div className="paper-grid-label">Reference</div>
                <div className="paper-grid-value" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{form.txCode || "—"}</div>
              </div>
            </div>

            <div className="paper-balance-row"><span>Invoice total</span><span className="mono">{invoice ? money(invoice.total) : "—"}</span></div>
            <div className="paper-balance-row"><span>Previously paid</span><span className="mono">{money(priorPaid)}</span></div>
            <div className="paper-balance-row total">
              <span>{balanceAfter <= 0 ? "Status" : "Balance Remaining"}</span>
              <span className="mono" style={{ color: balanceAfter <= 0 ? "#1F9D6B" : "#23201B" }}>
                {balanceAfter <= 0 ? "Paid in Full" : money(balanceAfter)}
              </span>
            </div>

            <div className="paper-foot">Thank you for choosing Chibu Enterprises &middot; chibuenterprises.co.ke</div>
          </div>
        </div>
      </div>

      {/* TRANSACTION LOG */}
      <div className="log-panel">
        <div className="log-head">
          <div className="tabs">
            {TABS.map((t) => (
              <div key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>
            ))}
          </div>
          <div className="search-box">
            <Search size={14} color="#8A97A5" />
            <input placeholder="Search client, ref, invoice" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No transactions match this filter.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Client</th>
                <th>Invoice</th>
                <th>Reference</th>
                <th>Date</th>
                <th className="num">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const mMeta = methodMeta(t.method);
                const MIcon = mMeta.icon;
                const sMeta = STATUS_META[t.status as keyof typeof STATUS_META];
                const SIcon = sMeta.icon;
                return (
                  <tr key={t.id}>
                    <td>
                      <div className="method-cell">
                        <div className="method-chip" style={{ background: mMeta.color + "20" }}>
                          <MIcon size={13} color={mMeta.color} />
                        </div>
                        {t.method}
                      </div>
                    </td>
                    <td>{t.client}</td>
                    <td style={{ color: t.invoiceNo ? "#E9EFF4" : "#8A97A5" }}>{t.invoiceNo || "Unmatched"}</td>
                    <td className="tx-code">{t.txCode}</td>
                    <td style={{ color: "#8A97A5", fontSize: 12 }}>{t.date}</td>
                    <td className="num amount-cell">{money(t.amount)}</td>
                    <td>
                      <span className="badge" style={{ color: sMeta.color, background: sMeta.bg }}>
                        <SIcon size={11} /> {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
