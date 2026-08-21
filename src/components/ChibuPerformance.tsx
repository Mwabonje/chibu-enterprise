import React, { useState } from "react";
import {
  Camera, Sun, ShieldCheck, Grid3x3, Zap, TrendingUp, TrendingDown,
  Star, MapPin, Award, Target, CheckCircle2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const SERVICES = [
  { name: "Solar Installation", icon: Sun, color: "#FFB020", jobs: 21, revenue: 945000 },
  { name: "CCTV Installation", icon: Camera, color: "#3FC1E0", jobs: 34, revenue: 615000 },
  { name: "Alarm System Installation", icon: ShieldCheck, color: "#FF7A59", jobs: 28, revenue: 420000 },
  { name: "Electric Fence Installation", icon: Zap, color: "#35D399", jobs: 22, revenue: 290000 },
  { name: "Window & Staircase Grill", icon: Grid3x3, color: "#9BA8B4", jobs: 33, revenue: 285200 },
];

const revenueTrend = [
  { month: "Jan", revenue: 195000 },
  { month: "Feb", revenue: 228000 },
  { month: "Mar", revenue: 252000 },
  { month: "Apr", revenue: 288000 },
  { month: "May", revenue: 326000 },
  { month: "Jun", revenue: 368000 },
  { month: "Jul", revenue: 412000 },
  { month: "Aug", revenue: 486200 },
];

const yearlyRevenue = [
  { year: "2023", revenue: 1120000 },
  { year: "2024", revenue: 1680000 },
  { year: "2025", revenue: 2100000 },
  { year: "2026 YTD", revenue: 2555200 },
];

const technicians = [
  { name: "Brian Mwangangi", role: "Lead Installer", jobs: 42, revenue: 820000, onTime: 98, rating: 4.9 },
  { name: "Josephat Karisa", role: "CCTV & Alarm Specialist", jobs: 35, revenue: 640000, onTime: 95, rating: 4.8 },
  { name: "Ali Bakari", role: "Solar Technician", jobs: 27, revenue: 700000, onTime: 92, rating: 4.7 },
  { name: "Naomi Chege", role: "Grill & Fence Fabricator", jobs: 34, revenue: 395200, onTime: 96, rating: 4.9 },
];

const locations = [
  { name: "Mombasa (Nyali / Bamburi)", jobs: 46 },
  { name: "Kilifi", jobs: 28 },
  { name: "Diani", jobs: 22 },
  { name: "Malindi", jobs: 19 },
  { name: "Nakuru", jobs: 14 },
  { name: "Other counties", jobs: 9 },
];

const revenueYtd = SERVICES.reduce((s, v) => s + v.revenue, 0);
const jobsYtd = SERVICES.reduce((s, v) => s + v.jobs, 0);
const avgJobValue = revenueYtd / jobsYtd;
const onTimeRate = Math.round(technicians.reduce((s, t) => s + t.jobs * t.onTime, 0) / jobsYtd);
const maxServiceRevenue = Math.max(...SERVICES.map((s) => s.revenue));
const maxLocationJobs = Math.max(...locations.map((l) => l.jobs));
const maxTechRevenue = Math.max(...technicians.map((t) => t.revenue));

const currentMonthRevenue = revenueTrend[revenueTrend.length - 1].revenue;
const priorMonthRevenue = revenueTrend[revenueTrend.length - 2].revenue;
const monthlyGrowthPct = ((currentMonthRevenue - priorMonthRevenue) / priorMonthRevenue) * 100;

const currentYearRevenue = yearlyRevenue[yearlyRevenue.length - 1].revenue;
const priorYearRevenue = yearlyRevenue[yearlyRevenue.length - 2].revenue;
const yearlyGrowthPct = ((currentYearRevenue - priorYearRevenue) / priorYearRevenue) * 100;

function money(n: number) {
  return "KES " + Math.round(n).toLocaleString("en-KE");
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function Trend({ value, positive = true }: { value: string; positive?: boolean }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? "#35D399" : "#FF7A59";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, fontWeight: 600 }}>
      <Icon size={12} /> {value}
    </span>
  );
}

export default function ChibuPerformance() {
  const [revenueView, setRevenueView] = useState("Monthly");

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; }
        .page-sub { color: var(--dim); font-size: 12.5px; margin-top: 3px; }
        .range-tabs { display: flex; gap: 6px; }
        .range-btn { font-size: 11.5px; font-weight: 600; padding: 7px 13px; border-radius: 999px; border: 1px solid var(--border); color: var(--dim); cursor: pointer; background: var(--panel); }
        .range-btn.active { background: var(--panel-2); color: var(--text); border-color: var(--amber); }

        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
        .stat-tile { position: relative; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
        .corner { position: absolute; width: 11px; height: 11px; border: 2px solid; opacity: 0.9; }
        .corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        .corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        .corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        .corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        .stat-label { font-size: 11px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.08em; }
        .stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 23px; font-weight: 600; margin-top: 7px; }
        .stat-foot { font-size: 11.5px; margin-top: 6px; color: var(--dim); }

        .grid-2 { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; align-items: start; margin-bottom: 16px; }
        .grid-2b { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; align-items: start; }
        .panel-block { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 14.5px; font-weight: 600; margin-bottom: 4px; }
        .section-sub { font-size: 11.5px; color: var(--dim); margin-bottom: 16px; }

        /* service mix bars */
        .mix-row { margin-bottom: 15px; }
        .mix-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 12.5px; }
        .mix-name { display: flex; align-items: center; gap: 7px; font-weight: 600; }
        .mix-figs { color: var(--dim); font-size: 11.5px; }
        .mix-figs b { color: var(--text); font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
        .mix-track { height: 7px; background: var(--panel-2); border-radius: 999px; overflow: hidden; }
        .mix-fill { height: 100%; border-radius: 999px; }

        /* leaderboard */
        .tech-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
        .tech-row:last-child { border-bottom: none; }
        .rank { width: 20px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--dim); flex-shrink: 0; }
        .avatar { width: 36px; height: 36px; border-radius: 999px; background: var(--panel-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .tech-mid { flex: 1; min-width: 0; }
        .tech-name { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .tech-role { font-size: 11px; color: var(--dim); margin-top: 1px; }
        .tech-bar-track { height: 5px; background: var(--panel-2); border-radius: 999px; margin-top: 7px; overflow: hidden; }
        .tech-bar-fill { height: 100%; background: var(--amber); border-radius: 999px; }
        .tech-right { text-align: right; flex-shrink: 0; }
        .tech-revenue { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; }
        .tech-rating { display: flex; align-items: center; gap: 3px; justify-content: flex-end; font-size: 11px; color: var(--dim); margin-top: 3px; }
        .tech-ontime { font-size: 10.5px; color: var(--green); margin-top: 3px; }

        /* locations */
        .loc-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .loc-name { width: 42%; font-size: 12.5px; display: flex; align-items: center; gap: 6px; }
        .loc-track { flex: 1; height: 8px; background: var(--panel-2); border-radius: 999px; overflow: hidden; }
        .loc-fill { height: 100%; background: linear-gradient(90deg, #3FC1E0, #35D399); border-radius: 999px; }
        .loc-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; width: 30px; text-align: right; }

        @media (max-width: 1000px) {
          .stat-grid { grid-template-columns: 1fr 1fr; }
          .grid-2, .grid-2b { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-head">
        <div>
          <div className="page-title">Performance</div>
          <div className="page-sub">Business KPIs across all service lines &middot; Jan &ndash; Aug 2026</div>
        </div>
        <div className="range-tabs">
          <span style={{ fontSize: 11, color: "var(--dim)", alignSelf: "center", marginRight: 2 }}>Revenue view</span>
          {["Monthly", "Yearly"].map((r) => (
            <div key={r} className={`range-btn ${revenueView === r ? "active" : ""}`} onClick={() => setRevenueView(r)}>{r}</div>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FFB020" }} /><div className="corner tr" style={{ borderColor: "#FFB020" }} />
          <div className="corner bl" style={{ borderColor: "#FFB020" }} /><div className="corner br" style={{ borderColor: "#FFB020" }} />
          <div className="stat-label">Revenue, {revenueView === "Monthly" ? "This Month" : "This Year (YTD)"}</div>
          <div className="stat-value">{money(revenueView === "Monthly" ? currentMonthRevenue : currentYearRevenue)}</div>
          <div className="stat-foot">
            <Trend value={revenueView === "Monthly"
              ? `+${monthlyGrowthPct.toFixed(1)}% vs last month`
              : `+${yearlyGrowthPct.toFixed(1)}% vs 2025`} />
          </div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#3FC1E0" }} /><div className="corner tr" style={{ borderColor: "#3FC1E0" }} />
          <div className="corner bl" style={{ borderColor: "#3FC1E0" }} /><div className="corner br" style={{ borderColor: "#3FC1E0" }} />
          <div className="stat-label">Jobs Completed, YTD</div>
          <div className="stat-value">{jobsYtd}</div>
          <div className="stat-foot"><Trend value="+8 vs last month" /></div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#35D399" }} /><div className="corner tr" style={{ borderColor: "#35D399" }} />
          <div className="corner bl" style={{ borderColor: "#35D399" }} /><div className="corner br" style={{ borderColor: "#35D399" }} />
          <div className="stat-label">Avg. Job Value</div>
          <div className="stat-value">{money(avgJobValue)}</div>
          <div className="stat-foot"><Trend value="+3.2% vs last month" /></div>
        </div>
        <div className="stat-tile">
          <div className="corner tl" style={{ borderColor: "#FF7A59" }} /><div className="corner tr" style={{ borderColor: "#FF7A59" }} />
          <div className="corner bl" style={{ borderColor: "#FF7A59" }} /><div className="corner br" style={{ borderColor: "#FF7A59" }} />
          <div className="stat-label">On-Time Completion</div>
          <div className="stat-value">{onTimeRate}%</div>
          <div className="stat-foot"><Trend value="+1.4 pts vs last month" /></div>
        </div>
      </div>

      <div className="grid-2">
        {/* Revenue trend */}
        <div className="panel-block">
          <div className="section-title">Revenue Trend &mdash; {revenueView}</div>
          <div className="section-sub">
            {revenueView === "Monthly" ? "Monthly revenue across all service lines, KES (Jan\u2013Aug 2026)" : "Annual revenue across all service lines, KES"}
          </div>
          <ResponsiveContainer width="100%" height={230}>
            {revenueView === "Monthly" ? (
              <AreaChart data={revenueTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB020" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#FFB020" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#29323C" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={{ stroke: "#29323C" }} tickLine={false} />
                <YAxis tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000) + "k"} />
                <Tooltip
                  formatter={(v: number) => money(v)}
                  contentStyle={{ background: "#1E2731", border: "1px solid #29323C", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#E9EFF4" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FFB020" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            ) : (
              <BarChart data={yearlyRevenue} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#29323C" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={{ stroke: "#29323C" }} tickLine={false} />
                <YAxis tick={{ fill: "#8A97A5", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000) + "k"} />
                <Tooltip
                  formatter={(v: number) => money(v)}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "#1E2731", border: "1px solid #29323C", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#E9EFF4" }}
                />
                <Bar dataKey="revenue" fill="#FFB020" radius={[5, 5, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Service mix */}
        <div className="panel-block">
          <div className="section-title">Revenue by Service</div>
          <div className="section-sub">Jan &ndash; Aug 2026</div>
          {SERVICES.slice().sort((a, b) => b.revenue - a.revenue).map((s) => {
            const Icon = s.icon;
            return (
              <div className="mix-row" key={s.name}>
                <div className="mix-top">
                  <div className="mix-name"><Icon size={14} color={s.color} /> {s.name}</div>
                </div>
                <div className="mix-track">
                  <div className="mix-fill" style={{ width: `${(s.revenue / maxServiceRevenue) * 100}%`, background: s.color }} />
                </div>
                <div className="mix-figs" style={{ marginTop: 5 }}>
                  <b>{money(s.revenue)}</b> &middot; {s.jobs} jobs
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid-2b">
        {/* Technician leaderboard */}
        <div className="panel-block">
          <div className="section-title">Technician Leaderboard</div>
          <div className="section-sub">Ranked by jobs completed, YTD</div>
          {technicians.slice().sort((a, b) => b.jobs - a.jobs).map((t, i) => (
            <div className="tech-row" key={t.name}>
              <div className="rank">{i === 0 ? <Award size={16} color="#FFB020" /> : `#${i + 1}`}</div>
              <div className="avatar">{initials(t.name)}</div>
              <div className="tech-mid">
                <div className="tech-name">{t.name}</div>
                <div className="tech-role">{t.role} &middot; {t.jobs} jobs</div>
                <div className="tech-bar-track">
                  <div className="tech-bar-fill" style={{ width: `${(t.revenue / maxTechRevenue) * 100}%` }} />
                </div>
              </div>
              <div className="tech-right">
                <div className="tech-revenue">{money(t.revenue)}</div>
                <div className="tech-rating"><Star size={11} fill="#FFB020" color="#FFB020" /> {t.rating}</div>
                <div className="tech-ontime">{t.onTime}% on-time</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top locations */}
        <div className="panel-block">
          <div className="section-title">Jobs by Location</div>
          <div className="section-sub">Where the work is happening, YTD</div>
          {locations.map((l) => (
            <div className="loc-row" key={l.name}>
              <div className="loc-name"><MapPin size={12} color="#8A97A5" /> {l.name}</div>
              <div className="loc-track"><div className="loc-fill" style={{ width: `${(l.jobs / maxLocationJobs) * 100}%` }} /></div>
              <div className="loc-count">{l.jobs}</div>
            </div>
          ))}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}><Target size={13} /> Coverage area</span>
            <span style={{ fontWeight: 600 }}>Coastal Kenya + Nakuru</span>
          </div>
        </div>
      </div>
    </div>
  );
}
