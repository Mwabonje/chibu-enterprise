import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, Plus, Trash2, Download,
  Send, Phone, Mail, MapPin, ChevronDown, CheckCircle2, AlertTriangle, FileEdit, XCircle
} from "lucide-react";

const SERVICE_OPTIONS = [
  { name: "CCTV Installation", icon: Camera, color: "#3FC1E0" },
  { name: "Solar Installation", icon: Sun, color: "#FFB020" },
  { name: "Alarm System Installation", icon: ShieldCheck, color: "#FF7A59" },
  { name: "Window & Staircase Grill", icon: Grid3x3, color: "#9BA8B4" },
  { name: "Electric Fence Installation", icon: Zap, color: "#35D399" },
];

const STATUS_META = {
  "Draft": { color: "#9BA8B4", bg: "rgba(155,168,180,0.13)", icon: FileEdit },
  "Sent": { color: "#3FC1E0", bg: "rgba(63,193,224,0.13)", icon: Send },
  "Approved": { color: "#35D399", bg: "rgba(53,211,153,0.13)", icon: CheckCircle2 },
  "Declined": { color: "#FF7A59", bg: "rgba(255,122,89,0.13)", icon: XCircle },
};

const COMMON_MATERIALS = [
  "6MP smart hybrid cameras",
  "16 port PoE switch",
  "UTP cable",
  "Adapter box",
  "HDD Surveillance",
  "1\" Conduit pipe",
  "3/4\" Conduit pipe",
  "Surge Protector",
  "Installation Labor"
];

const VAT_RATE = 0.16;
let idSeed = 100; // for new unique IDs

const initialItems = [
  {
    id: 1,
    service: "CCTV Installation",
    materials: [
      { id: 10, name: "4-Channel DVR System", qty: 1, price: 12000 },
      { id: 11, name: "HD Night-Vision Cameras", qty: 4, price: 4500 },
      { id: 12, name: "RG59 Coaxial Cable (Roll)", qty: 1, price: 6500 },
      { id: 13, name: "Installation Labor", qty: 1, price: 8500 }
    ]
  },
  {
    id: 2,
    service: "Electric Fence Installation",
    materials: [
      { id: 20, name: "Energizer Unit 8 Joule", qty: 1, price: 28000 },
      { id: 21, name: "High Tensile Wire (m)", qty: 120, price: 50 },
      { id: 22, name: "Installation Labor", qty: 1, price: 15000 }
    ]
  },
];

const PAST_QUOTES = [
  {
    id: "QT-2026-0147",
    client: { name: "David Kimani", phone: "+254 700 111 222", email: "david.k@example.com", location: "Mtwapa, Kilifi" },
    date: "18 Aug 2026",
    validUntil: "01 Sep 2026",
    status: "Approved",
    items: [
      {
        id: 1,
        service: "Solar Installation",
        materials: [
          { id: 10, name: "5kW Inverter", qty: 1, price: 85000 },
          { id: 11, name: "Solar Panels 450W", qty: 6, price: 14000 },
          { id: 12, name: "Installation Labor", qty: 1, price: 25000 }
        ]
      }
    ],
    notes: "50% deposit on acceptance. 5-year warranty on inverter."
  },
  {
    id: "QT-2026-0146",
    client: { name: "Fatuma Said", phone: "+254 722 333 444", email: "fatuma.s@example.com", location: "Diani Beach" },
    date: "15 Aug 2026",
    validUntil: "29 Aug 2026",
    status: "Sent",
    items: [
      {
        id: 1,
        service: "Window & Staircase Grill",
        materials: [
          { id: 10, name: "Window Grills (Custom)", qty: 8, price: 4500 },
          { id: 11, name: "Steel Door", qty: 1, price: 18000 },
          { id: 12, name: "Fabrication & Labor", qty: 1, price: 15000 }
        ]
      }
    ],
    notes: "Quote valid for 14 days."
  }
];

function money(n: number) {
  return "KES " + n.toLocaleString("en-KE", { minimumFractionDigits: 0 });
}

export default function ChibuQuote() {
  const [viewMode, setViewMode] = useState<"builder" | "history">("builder");
  const [selectedPastQuoteId, setSelectedPastQuoteId] = useState<string | null>(PAST_QUOTES[0].id);

  const [client, setClient] = useState({
    name: "Aisha Mwangi",
    phone: "+254 712 345 678",
    email: "aisha.mwangi@example.com",
    location: "Nyali, Mombasa",
  });
  const [quoteNo] = useState("QT-2026-0148");
  const [date] = useState("20 Aug 2026");
  const [validUntil] = useState("03 Sep 2026");
  const [status, setStatus] = useState("Draft");
  const [items, setItems] = useState(initialItems);
  const [notes, setNotes] = useState("50% deposit on acceptance, balance due on completion. Quote valid for 14 days. 12-month warranty on installation workmanship.");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
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

  const addService = () => {
    idSeed += 1;
    setItems([...items, { id: idSeed, service: "CCTV Installation", materials: [{ id: idSeed + 1000, name: "", qty: 1, price: 0 }] }]);
  };

  const removeService = (id: number) => setItems(items.filter((it) => it.id !== id));
  
  const updateServiceType = (id: number, newService: string) =>
    setItems(items.map((it) => (it.id === id ? { ...it, service: newService } : it)));

  const addMaterial = (serviceId: number) => {
    idSeed += 1;
    setItems(items.map((it) => {
      if (it.id === serviceId) {
        return { ...it, materials: [...it.materials, { id: idSeed, name: "", qty: 1, price: 0 }] };
      }
      return it;
    }));
  };

  const removeMaterial = (serviceId: number, matId: number) => {
    setItems(items.map((it) => {
      if (it.id === serviceId) {
        return { ...it, materials: it.materials.filter(m => m.id !== matId) };
      }
      return it;
    }));
  };

  const updateMaterial = (serviceId: number, matId: number, field: string, value: string | number) => {
    setItems(items.map((it) => {
      if (it.id === serviceId) {
        return {
          ...it,
          materials: it.materials.map(m => (m.id === matId ? { ...m, [field]: value } : m))
        };
      }
      return it;
    }));
  };

  // Calculate totals based on viewMode
  const activeQuote = viewMode === "history" 
    ? (PAST_QUOTES.find(q => q.id === selectedPastQuoteId) || PAST_QUOTES[0])
    : {
        id: quoteNo,
        client: client,
        date: date,
        validUntil: validUntil,
        status: status,
        items: items,
        notes: notes
      };

  const subtotal = activeQuote.items.reduce((sum, service) => {
    const serviceTotal = service.materials.reduce((mSum, m) => mSum + (Number(m.qty) || 0) * (Number(m.price) || 0), 0);
    return sum + serviceTotal;
  }, 0);
  
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  const serviceMeta = (name: string) => SERVICE_OPTIONS.find((s) => s.name === name) || SERVICE_OPTIONS[0];

  return (
    <div className="quote-app-wrapper">
      <datalist id="common-materials">
        {COMMON_MATERIALS.map(m => <option key={m} value={m} />)}
      </datalist>
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

        .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 18px; align-items: stretch; }

        /* ---- Tabs ---- */
        .tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .tab-btn { font-size: 11.5px; font-weight: 600; padding: 6px 11px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: transparent; }
        .tab-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        /* ---- History List ---- */
        .quote-row { display: flex; align-items: center; gap: 12px; padding: 12px 10px; border-radius: 9px; cursor: pointer; border: 1px solid transparent; margin-bottom: 4px; }
        .quote-row:hover { background: var(--panel-2); }
        .quote-row.selected { background: var(--panel-2); border-color: var(--amber); }
        .quote-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .quote-mid { flex: 1; min-width: 0; }
        .quote-client { font-size: 13px; font-weight: 600; }
        .quote-meta { font-size: 11px; color: var(--dim); margin-top: 2px; display: flex; gap: 6px; align-items: center; }
        .quote-right { text-align: right; }
        .quote-amount { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 600; margin-top: 4px; }
        .empty-state { text-align: center; padding: 30px 10px; color: var(--dim); font-size: 13px; }

        /* ---- Builder (dark control panel) ---- */
        .left-panel { min-width: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; }
        .block-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 9px; font-weight: 600; }
        .field-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; margin-bottom: 10px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; color: var(--dim); }
        .field input, .field textarea, .field select {
          background: var(--panel-2); border: 1px solid var(--border); border-radius: 7px;
          padding: 9px 10px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif;
          outline: none; width: 100%; min-width: 0;
        }
        .field input:focus, .field textarea:focus, .field select:focus { border-color: var(--amber); }
        .divider { height: 1px; background: var(--border); margin: 18px 0; }

        .service-block { background: var(--panel-2); border: 1px solid var(--border); border-radius: 9px; padding: 14px; margin-bottom: 12px; }
        .service-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
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
        
        /* Material rows */
        .mat-row { display: grid; grid-template-columns: 2fr 0.8fr 1fr 1fr auto; gap: 8px; align-items: end; margin-bottom: 8px; }
        .mat-row .field label { font-size: 9.5px; }
        .line-total { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; padding-bottom: 10px; color: var(--amber); text-align: right; }
        
        .add-mat-btn { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--dim); cursor: pointer; margin-top: 6px; padding: 4px 8px; border-radius: 6px; }
        .add-mat-btn:hover { color: var(--text); background: var(--panel); }

        .service-summary { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
        .service-total-label { font-size: 11px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .service-total-val { font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; color: var(--text); }

        .add-item-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;
          border: 1px dashed var(--border); border-radius: 9px; padding: 11px; color: var(--dim);
          font-size: 12.5px; font-weight: 600; cursor: pointer; background: transparent;
        }
        .add-item-btn:hover { border-color: var(--amber); color: var(--amber); }

        .notes-field textarea { min-height: 70px; resize: vertical; }

        /* ---- Preview (printed quote, light paper) ---- */
        .preview-shell { min-width: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; }
        .preview-tag { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .preview-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); display: inline-block; margin-right: 6px; }

        .paper {
          position: relative;
          background: #F7F3EC; color: #23201B; border-radius: 4px; padding: 34px 32px;
          font-family: 'Inter', sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
        }
        .stamp { position: absolute; top: 92px; right: 40px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 30px; letter-spacing: 0.08em; border: 4px solid; padding: 4px 16px; border-radius: 8px; transform: rotate(-14deg); opacity: 0.85; pointer-events: none; }
        .stamp.approved { color: #1F9D6B; border-color: #1F9D6B; }
        .stamp.declined { color: #E24E3C; border-color: #E24E3C; }

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
        .paper-table td { padding: 8px 0; border-bottom: 1px solid #D8D0C0; font-size: 12.5px; vertical-align: middle; }
        
        .paper-service-row { border-bottom: none !important; }
        .paper-service-row td { padding-top: 16px; padding-bottom: 4px; border-bottom: none; }
        .paper-item-service { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .paper-item-service .sw { width: 7px; height: 7px; border-radius: 2px; }
        
        .paper-mat-row td { color: #4A443B; font-size: 11.5px; }
        .paper-table td.mono, .paper-totals .mono { font-family: 'IBM Plex Mono', monospace; }

        .paper-totals { margin-left: auto; width: 230px; margin-top: 14px; font-size: 12.5px; }
        .paper-totals-row { display: flex; justify-content: space-between; padding: 6px 0; color: #4A443B; }
        .paper-totals-row.grand { border-top: 2px solid #23201B; margin-top: 6px; padding-top: 10px; font-weight: 700; font-size: 15px; color: #23201B; }

        .paper-notes { border-top: 1px dashed #C9BFAC; padding-top: 14px; font-size: 11px; color: #5A5347; line-height: 1.7; }
        .paper-notes-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C8375; font-weight: 600; margin-bottom: 5px; }
        .paper-foot { margin-top: 22px; text-align: center; font-size: 10.5px; color: #8C8375; letter-spacing: 0.03em; }

        @media (max-width: 980px) {
          .layout { grid-template-columns: minmax(0, 1fr); }
          .field-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .mat-row { grid-template-columns: 1fr 1fr; align-items: start; }
          .mat-row .line-total { display: none; }
        }
        @media (max-width: 560px) {
          .field-row { grid-template-columns: minmax(0, 1fr); }
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
          <div className="page-title">Quotations</div>
          <div className="page-sub">Create and manage client quotations</div>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={handleDownloadPdf} disabled={isGenerating}>
            <Download size={15} /> {isGenerating ? "Generating..." : "Download PDF"}
          </button>
          <button className="btn btn-primary"><Send size={15} /> Send to Client</button>
        </div>
      </div>

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="tabs">
            <div className={`tab-btn ${viewMode === "builder" ? "active" : ""}`} onClick={() => setViewMode("builder")}>New Quote</div>
            <div className={`tab-btn ${viewMode === "history" ? "active" : ""}`} onClick={() => setViewMode("history")}>Quote History</div>
          </div>

          {viewMode === "builder" && (
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, marginRight: -4, display: "flex", flexDirection: "column" }}>
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

              <div className="block-label">Quotation Details</div>
              <div className="field-row">
                <div className="field">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="divider" />

              <div className="block-label">Services &amp; Materials</div>
              {items.map((serviceBlock) => {
                const meta = serviceMeta(serviceBlock.service);
            const Icon = meta.icon;
            
            const serviceTotal = serviceBlock.materials.reduce((sum, m) => sum + (Number(m.qty) || 0) * (Number(m.price) || 0), 0);
            
            return (
              <div className="service-block" key={serviceBlock.id}>
                <div className="service-top">
                  <div className="service-select">
                    <div className="service-pill" style={{ color: meta.color }} onClick={() => setOpenMenu(openMenu === serviceBlock.id ? null : serviceBlock.id)}>
                      <Icon size={13} /> {serviceBlock.service} <ChevronDown size={12} />
                    </div>
                    {openMenu === serviceBlock.id && (
                      <div className="service-dropdown">
                        {SERVICE_OPTIONS.map((s) => {
                          const SIcon = s.icon;
                          return (
                            <div
                              key={s.name}
                              className="service-dropdown-item"
                              style={{ color: s.color }}
                              onClick={() => { updateServiceType(serviceBlock.id, s.name); setOpenMenu(null); }}
                            >
                              <SIcon size={13} /> {s.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="trash-btn" onClick={() => removeService(serviceBlock.id)}><Trash2 size={15} /></div>
                </div>

                {serviceBlock.materials.map((mat, i) => (
                  <div className="mat-row" key={mat.id}>
                    <div className="field">
                      {i === 0 && <label>Material / Description</label>}
                      <input
                        list="common-materials"
                        placeholder="e.g. 4-Channel DVR"
                        value={mat.name}
                        onChange={(e) => updateMaterial(serviceBlock.id, mat.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      {i === 0 && <label>Qty</label>}
                      <input type="number" min="0" value={mat.qty} onChange={(e) => updateMaterial(serviceBlock.id, mat.id, "qty", e.target.value)} />
                    </div>
                    <div className="field">
                      {i === 0 && <label>Price (KES)</label>}
                      <input type="number" min="0" value={mat.price} onChange={(e) => updateMaterial(serviceBlock.id, mat.id, "price", e.target.value)} />
                    </div>
                    <div className="line-total">{money((Number(mat.qty) || 0) * (Number(mat.price) || 0))}</div>
                    <div className="trash-btn" style={{ paddingBottom: 10 }} onClick={() => removeMaterial(serviceBlock.id, mat.id)}><Trash2 size={14} /></div>
                  </div>
                ))}
                
                <div className="add-mat-btn" onClick={() => addMaterial(serviceBlock.id)}>
                  <Plus size={13} /> Add Material
                </div>

                <div className="service-summary">
                  <div className="service-total-label">Service Subtotal</div>
                  <div className="service-total-val">{money(serviceTotal)}</div>
                </div>
              </div>
            );
          })}
          <div className="add-item-btn" onClick={addService}><Plus size={15} /> Add Service</div>

          <div className="divider" />

          <div className="block-label">Terms &amp; Notes</div>
          <div className="field notes-field">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
            </div>
          )}

          {viewMode === "history" && (
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, marginRight: -4 }}>
              {PAST_QUOTES.length === 0 && <div className="empty-state">No past quotations found.</div>}
              {PAST_QUOTES.map((pq) => {
                const total = pq.items.reduce((acc, svc) => {
                  return acc + svc.materials.reduce((mSum, m) => mSum + (Number(m.qty) || 0) * (Number(m.price) || 0), 0);
                }, 0) * (1 + VAT_RATE);
                
                return (
                  <div
                    key={pq.id}
                    className={`quote-row ${selectedPastQuoteId === pq.id ? "selected" : ""}`}
                    onClick={() => setSelectedPastQuoteId(pq.id)}
                  >
                    <div className="quote-icon" style={{ background: "rgba(255,176,32,0.15)" }}>
                      <Zap size={16} color="#FFB020" />
                    </div>
                    <div className="quote-mid">
                      <div className="quote-client">{pq.client.name}</div>
                      <div className="quote-meta">{pq.id} &middot; <MapPin size={10} /> {pq.client.location}</div>
                    </div>
                    <div className="quote-right">
                      <div className="quote-amount">{money(Math.round(total))}</div>
                      <div className="quote-meta" style={{ justifyContent: "flex-end", marginTop: 4 }}>{pq.date}</div>
                      {pq.status && (
                        <div className="badge" style={{ color: STATUS_META[pq.status as keyof typeof STATUS_META]?.color, background: STATUS_META[pq.status as keyof typeof STATUS_META]?.bg }}>
                          {React.createElement(STATUS_META[pq.status as keyof typeof STATUS_META]?.icon || FileEdit, { size: 10 })} {pq.status}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div className="preview-shell">
          <div className="preview-tag">
            <span>
              {viewMode === "builder" ? <><span className="dot" />Live Preview</> : "Quotation Viewer"}
            </span> 
            A4 &middot; Quotation
          </div>
          <div className="paper" ref={printRef}>
            {activeQuote.status === "Approved" && <div className="stamp approved">APPROVED</div>}
            {activeQuote.status === "Declined" && <div className="stamp declined">DECLINED</div>}

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
                <div className="paper-info-name">{activeQuote.client.name || "—"}</div>
                <div>{activeQuote.client.location || "—"}</div>
                <div>{activeQuote.client.phone}{activeQuote.client.email ? " · " + activeQuote.client.email : ""}</div>
              </div>
              <div className="paper-info-block" style={{ textAlign: "right" }}>
                <div className="paper-title">Quotation</div>
                <div style={{ marginTop: 8 }}>
                  <span className="paper-info-label" style={{ display: "inline" }}>No.</span> {activeQuote.id}<br />
                  <span className="paper-info-label" style={{ display: "inline" }}>Date</span> {activeQuote.date}<br />
                  <span className="paper-info-label" style={{ display: "inline" }}>Valid Until</span> {activeQuote.validUntil}
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
                  {activeQuote.items.map((serviceBlock) => {
                    const meta = serviceMeta(serviceBlock.service);
                    return (
                      <React.Fragment key={serviceBlock.id}>
                        {/* Service Header Row */}
                        <tr className="paper-service-row">
                          <td colSpan={4}>
                            <div className="paper-item-service" style={{ color: meta.color }}>
                              <span className="sw" style={{ background: meta.color }} /> {serviceBlock.service}
                            </div>
                          </td>
                        </tr>
                        {/* Material Rows */}
                        {serviceBlock.materials.map((mat) => (
                          <tr className="paper-mat-row" key={mat.id}>
                            <td style={{ paddingLeft: 14 }}>{mat.name || "—"}</td>
                            <td className="num mono">{mat.qty}</td>
                            <td className="num mono">{money(Number(mat.price) || 0)}</td>
                            <td className="num mono">{money((Number(mat.qty) || 0) * (Number(mat.price) || 0))}</td>
                          </tr>
                        ))}
                      </React.Fragment>
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

            <div style={{ flex: 1, minHeight: 24 }} />

            <div className="paper-notes">
              <div className="paper-notes-label">Terms &amp; Notes</div>
              {activeQuote.notes}
            </div>

            <div className="paper-foot">Thank you for choosing Chibu Enterprises &middot; chibuenterprises.co.ke</div>
          </div>
        </div>
      </div>
    </div>
  );
}

