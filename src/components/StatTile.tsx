import React from "react";

export interface StatTileProps {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}

export function StatTile({ label, value, sub, accent }: StatTileProps) {
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
