import React from "react";
import { Users, FileText, Radio, MapPin, ChevronRight, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { services, chartData, jobs, statusStyle, StatusType } from "../lib/dashboardData";
import { StatTile } from "./StatTile";
import { ClockCalendar } from "./ClockCalendar";

export default function ChibuDashboard() {
  return (
    <>
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
          <ClockCalendar />

          <div className="panel-block">
            <div className="section-title">
              Recent Jobs <span className="tag">LAST 7 ENTRIES</span>
            </div>
            <div className="table-responsive">
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
        </div>
    </>
  );
}
