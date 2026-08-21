import React, { useState, useEffect } from "react";

export function ClockCalendar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentMonth = time.getMonth();
  const currentYear = time.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const grid = [];
  for (let i = 0; i < firstDay; i++) {
    grid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push(i);
  }

  return (
    <div className="panel-block" style={{ padding: "24px", flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px", minHeight: "120px" }}>
        <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-1px", lineHeight: 1 }}>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div style={{ color: "var(--amber)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginTop: 8 }}>
          {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{months[currentMonth]} {currentYear}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--dim)", marginBottom: 12 }}>
          {days.map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", fontSize: 13 }}>
          {grid.map((d, i) => (
            <div 
              key={i} 
              style={{ 
                padding: "8px 0",
                borderRadius: "6px",
                background: d === time.getDate() ? "var(--amber)" : "transparent",
                color: d === time.getDate() ? "#14181D" : (d ? "var(--text)" : "transparent"),
                fontWeight: d === time.getDate() ? 700 : 400
              }}
            >
              {d || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
