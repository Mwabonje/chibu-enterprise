import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, Plus, Trash2, Download,
  Send, Phone, Mail, MapPin, Calendar, Hash, ChevronDown
} from "lucide-react";

const SERVICE_OPTIONS = [
  { name: "CCTV Installation", icon: Camera, color: "#3FC1E0" },
  { name: "Solar Installation", icon: Sun, color: "#FFB020" },
  { name: "Alarm System Installation", icon: ShieldCheck, color: "#FF7A59" },
  { name: "Window & Staircase Grill", icon: Grid3x3, color: "#9BA8B4" },
  { name: "Electric Fence Installation", icon: Zap, color: "#35D399" },
];

const VAT_RATE = 0.16;
let idSeed = 3;

const initialItems = [
  { id: 1, service: "CCTV Installation", desc: "4-channel CCTV kit, night-vision cameras, installation & cabling", qty: 1, price: 45000 },
  { id: 2, service: "Electric Fence Installation", desc: "Perimeter electric fencing, 120m, energizer unit included", qty: 1, price: 68000 },
];

function money(n) {
  return "KES " + n.toLocaleString("en-KE", { minimumFractionDigits: 0 });
}

export default function ChibuQuote() {
  const [client, setClient] = useState({
    name: "Aisha Mwangi",
    phone: "+254 712 345 678",
    email: "aisha.mwangi@example.com",
    location: "Nyali, Mombasa",
  });
  const [quoteNo] = useState("QT-2026-0148");
  const [date] = useState("20 Aug 2026");
  const [validUntil] = useState("03 Sep 2026");
  const [items, setItems] = useState(initialItems);
  const [notes, setNotes] = useState("50% deposit on acceptance, balance due on completion. Quote valid for 14 days. 12-month warranty on installation workmanship.");
  const [openMenu, setOpenMenu] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // higher resolution
        useCORS: true,
        backgroundColor: "#F7F3EC"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quote_${quoteNo}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () => {
    idSeed += 1;
    setItems([...items, { id: idSeed, service: "CCTV Installation", desc: "", qty: 1, price: 0 }]);
  };
  const removeItem = (id) => setItems(items.filter((it) => it.id !== id));
  const updateItem = (id, field, value) =>
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  const serviceMeta = (name) => SERVICE_OPTIONS.find((s) => s.name === name) || SERVICE_OPTIONS[0];

  return (
    <div className="quote-app-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:wght@500;600&display=swap');

        .quote-app-wrapper {
          --bg: #10141A;
          --panel: #181F27;
          --panel-2: #1E2731;
          --border: #29323C;
          --text: #E9EFF4;
          --dim: #8A97A5;
          --amber: #FFB020;
          --green: #35D399;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          padding: 0;
        }
        .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; }
        .page-sub { color: var(--dim); font-size: 12.5px; margin-top: 3px; }
        .head-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; padding: 9px 15px; border-radius: 8px; cursor: pointer; border: 1px solid var(--border); }
        .btn-ghost { background: var(--panel); color: var(--text); }
        .btn-ghost:hover { border-color: var(--amber); }
        .btn-primary { background: var(--amber); color: #14181D; border: none; }

        .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 18px; align-items: start; }

        /* ---- Builder (dark control panel) ---- */
        .builder { min-width: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .block-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 9px; font-weight: 600; }
        .field-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; margin-bottom: 10px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; color: var(--dim); }
        .field input, .field textarea {
          background: var(--panel-2); border: 1px solid var(--border); border-radius: 7px;
          padding: 9px 10px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif;
          outline: none; width: 100%; min-width: 0;
        }
        .field input:focus, .field textarea:focus { border-color: var(--amber); }
        .divider { height: 1px; background: var(--border); margin: 18px 0; }

        .item-row { background: var(--panel-2); border: 1px solid var(--border); border-radius: 9px; padding: 12px; margin-bottom: 10px; }
        .item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }
        .service-select { position: relative; }
        .service-pill {
          display: flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 999px;
          border: 1px solid var(--border); cursor: pointer; font-size: 12px; font-weight: 600; background: var(--panel);
        }
        .service-dropdown {
          position: absolute; top: 34px; left: 0; z-index: 5; background: var(--panel); border: 1px solid var(--border);
          border-radius: 8px; width: 230px; padding: 5px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .service-dropdown-item { display: flex; align-items: center; gap: 8px; padding: 8px 9px; border-radius: 6px; font-size: 12.5px; cursor: pointer; }
        .service-dropdown-item:hover { background: var(--panel-2); }
        .trash-btn { color: var(--dim); cursor: pointer; padding: 4px; border-radius: 6px; }
        .trash-btn:hover { color: #FF7A59; background: rgba(255,122,89,0.1); }
        .desc-input { width: 100%; margin-bottom: 9px; }
        .qty-price-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 1fr; gap: 8px; }
        .qty-price-row .field label { font-size: 10px; }
        .line-total { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; align-self: flex-end; padding-bottom: 9px; color: var(--amber); }

        .add-item-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;
          border: 1px dashed var(--border); border-radius: 9px; padding: 11px; color: var(--dim);
          font-size: 12.5px; font-weight: 600; cursor: pointer; background: transparent;
        }
        .add-item-btn:hover { border-color: var(--amber); color: var(--amber); }

        .notes-field textarea { min-height: 70px; resize: vertical; }

        /* ---- Preview (printed quote, light paper) ---- */
        .preview-shell { min-width: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
        .preview-tag { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .preview-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); display: inline-block; margin-right: 6px; }

        .paper {
          background: #F7F3EC; color: #23201B; border-radius: 4px; padding: 34px 32px;
          font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .paper-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #23201B; padding-bottom: 16px; margin-bottom: 18px; }
        .paper-brand { display: flex; align-items: center; gap: 10px; }
        .paper-mark { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg,#FFB020,#FF7A59); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-weight:700; color:#20140A; font-size:15px; }
        .paper-company { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.01em; width: max-content; }
        .paper-company-sub { display: flex; justify-content: space-between; font-size: 8px; text-transform: uppercase; color: #6B6255; margin-top: 3px; font-weight: 600; width: 100%; }
        .paper-meta { text-align: right; font-size: 11.5px; color: #4A443B; line-height: 1.7; }
        .paper-title { font-family: 'Source Serif 4', serif; font-size: 26px; font-weight: 600; letter-spacing: 0.01em; }

        .paper-info-row { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 20px; }
        .paper-info-block { font-size: 12px; line-height: 1.8; }
        .paper-info-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; margin-bottom: 4px; font-weight: 600; }
        .paper-info-name { font-weight: 600; font-size: 13.5px; }

        .paper-table th {
          text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.08em;
          color: #8C8375; font-weight: 600; padding-bottom: 8px; border-bottom: 1.5px solid #23201B;
        }
        .paper-table th.num, .paper-table td.num { text-align: right; }
        .paper-table td { padding: 10px 0; border-bottom: 1px solid #D8D0C0; font-size: 12.5px; vertical-align: top; }
        .paper-item-service { display: flex; align-items: center; gap: 6px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
        .paper-item-service .sw { width: 7px; height: 7px; border-radius: 2px; }
        .paper-table td.mono, .paper-totals .mono { font-family: 'IBM Plex Mono', monospace; }

        .paper-totals { margin-left: auto; width: 230px; margin-top: 14px; font-size: 12.5px; }
        .paper-totals-row { display: flex; justify-content: space-between; padding: 6px 0; color: #4A443B; }
        .paper-totals-row.grand { border-top: 2px solid #23201B; margin-top: 6px; padding-top: 10px; font-weight: 700; font-size: 15px; color: #23201B; }

        .paper-notes { margin-top: 24px; border-top: 1px dashed #C9BFAC; padding-top: 14px; font-size: 11px; color: #5A5347; line-height: 1.7; }
        .paper-notes-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; font-weight: 600; margin-bottom: 5px; }
        .paper-foot { margin-top: 22px; text-align: center; font-size: 10.5px; color: #8C8375; letter-spacing: 0.03em; }

        @media (max-width: 980px) {
          .layout { grid-template-columns: minmax(0, 1fr); }
          .field-row, .qty-price-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        }
        @media (max-width: 560px) {
          .field-row { grid-template-columns: minmax(0, 1fr); }
          .qty-price-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .paper { padding: 22px 18px; }
          .paper-head { flex-direction: column; gap: 12px; }
          .paper-meta { text-align: left; }
          .paper-info-row { flex-direction: column; gap: 14px; }
          .paper-info-block { text-align: left !important; }
        }
        .paper-table-wrapper { width: 100%; overflow-x: auto; margin-bottom: 6px; }
        .paper-table { width: 100%; border-collapse: collapse; min-width: 480px; }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">New Quote</div>
          <div className="page-sub">Quote {quoteNo} &middot; build line items on the left, preview updates live</div>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={handleDownloadPdf} disabled={isGenerating}>
            <Download size={15} /> {isGenerating ? "Generating..." : "Download PDF"}
          </button>
          <button className="btn btn-primary"><Send size={15} /> Send to Client</button>
        </div>
      </div>

      <div className="layout">
        {/* BUILDER */}
        <div className="builder">
          <div className="block-label">Client Details</div>
          <div className="field-row">
            <div className="field">
              <label>Client name</label>
              <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Site location</label>
              <input value={client.location} onChange={(e) => setClient({ ...client, location: e.target.value })} />
            </div>
          </div>

          <div className="divider" />

          <div className="block-label">Line Items</div>
          {items.map((it) => {
            const meta = serviceMeta(it.service);
            const Icon = meta.icon;
            return (
              <div className="item-row" key={it.id}>
                <div className="item-top">
                  <div className="service-select">
                    <div className="service-pill" style={{ color: meta.color }} onClick={() => setOpenMenu(openMenu === it.id ? null : it.id)}>
                      <Icon size={13} /> {it.service} <ChevronDown size={12} />
                    </div>
                    {openMenu === it.id && (
                      <div className="service-dropdown">
                        {SERVICE_OPTIONS.map((s) => {
                          const SIcon = s.icon;
                          return (
                            <div
                              key={s.name}
                              className="service-dropdown-item"
                              style={{ color: s.color }}
                              onClick={() => { updateItem(it.id, "service", s.name); setOpenMenu(null); }}
                            >
                              <SIcon size={13} /> {s.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="trash-btn" onClick={() => removeItem(it.id)}><Trash2 size={15} /></div>
                </div>

                <div className="field desc-input">
                  <input
                    placeholder="Describe the work / materials included"
                    value={it.desc}
                    onChange={(e) => updateItem(it.id, "desc", e.target.value)}
                  />
                </div>

                <div className="qty-price-row">
                  <div className="field">
                    <label>Qty</label>
                    <input type="number" min="0" value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Unit price (KES)</label>
                    <input type="number" min="0" value={it.price} onChange={(e) => updateItem(it.id, "price", e.target.value)} />
                  </div>
                  <div className="line-total">{money((Number(it.qty) || 0) * (Number(it.price) || 0))}</div>
                </div>
              </div>
            );
          })}
          <div className="add-item-btn" onClick={addItem}><Plus size={15} /> Add line item</div>

          <div className="divider" />

          <div className="block-label">Terms &amp; Notes</div>
          <div className="field notes-field">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        {/* PREVIEW */}
        <div className="preview-shell">
          <div className="preview-tag"><span><span className="dot" />Live Preview</span> A4 &middot; Quotation</div>
          <div className="paper" ref={printRef}>
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
              <div className="paper-meta">
                <div>Nyali Road, Mombasa, Kenya</div>
                <div>+254 733 900 214 &middot; hello@chibuenterprises.co.ke</div>
              </div>
            </div>

            <div className="paper-info-row">
              <div className="paper-info-block">
                <div className="paper-info-label">Prepared For</div>
                <div className="paper-info-name">{client.name || "—"}</div>
                <div>{client.location || "—"}</div>
                <div>{client.phone}{client.email ? " · " + client.email : ""}</div>
              </div>
              <div className="paper-info-block" style={{ textAlign: "right" }}>
                <div className="paper-title">Quotation</div>
                <div style={{ marginTop: 8 }}>
                  <span className="paper-info-label" style={{ display: "inline" }}>No.</span> {quoteNo}<br />
                  <span className="paper-info-label" style={{ display: "inline" }}>Date</span> {date}<br />
                  <span className="paper-info-label" style={{ display: "inline" }}>Valid Until</span> {validUntil}
                </div>
              </div>
            </div>

            <div className="paper-table-wrapper">
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
                  {items.map((it) => {
                    const meta = serviceMeta(it.service);
                    return (
                      <tr key={it.id}>
                        <td>
                          <div className="paper-item-service" style={{ color: meta.color }}>
                            <span className="sw" style={{ background: meta.color }} /> {it.service}
                          </div>
                          {it.desc || "—"}
                        </td>
                        <td className="num mono">{it.qty}</td>
                        <td className="num mono">{money(Number(it.price) || 0)}</td>
                        <td className="num mono">{money((Number(it.qty) || 0) * (Number(it.price) || 0))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="paper-totals">
              <div className="paper-totals-row"><span>Subtotal</span><span className="mono">{money(subtotal)}</span></div>
              <div className="paper-totals-row"><span>VAT (16%)</span><span className="mono">{money(vat)}</span></div>
              <div className="paper-totals-row grand"><span>Total</span><span className="mono">{money(total)}</span></div>
            </div>

            <div className="paper-notes">
              <div className="paper-notes-label">Terms &amp; Notes</div>
              {notes}
            </div>

            <div className="paper-foot">Thank you for choosing Chibu Enterprises &middot; chibuenterprises.co.ke</div>
          </div>
        </div>
      </div>
    </div>
  );
}
