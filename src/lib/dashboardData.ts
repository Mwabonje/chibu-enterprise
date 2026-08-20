import { Camera, Sun, ShieldCheck, Grid3x3, Zap } from "lucide-react";

export const services = [
  { name: "CCTV Installation", icon: Camera, active: 9, color: "#3FC1E0", tint: "rgba(63,193,224,0.12)" },
  { name: "Solar Installation", icon: Sun, active: 5, color: "#FFB020", tint: "rgba(255,176,32,0.12)" },
  { name: "Alarm System Installation", icon: ShieldCheck, active: 6, color: "#FF7A59", tint: "rgba(255,122,89,0.12)" },
  { name: "Window & Staircase Grill", icon: Grid3x3, active: 4, color: "#9BA8B4", tint: "rgba(155,168,180,0.12)" },
  { name: "Electric Fence Installation", icon: Zap, active: 3, color: "#35D399", tint: "rgba(53,211,153,0.12)" },
];

export const jobs = [
  { client: "Aisha Mwangi", service: "CCTV Installation", loc: "Nyali, Mombasa", status: "In Progress", date: "Aug 19" },
  { client: "James Otieno", service: "Solar Installation", loc: "Bamburi, Mombasa", status: "Quoted", date: "Aug 18" },
  { client: "Fatuma Said", service: "Electric Fence Installation", loc: "Kilifi", status: "Completed", date: "Aug 17" },
  { client: "David Kimani", service: "Alarm System Installation", loc: "Diani", status: "In Progress", date: "Aug 16" },
  { client: "Grace Wanjiru", service: "Window & Staircase Grill", loc: "Nakuru", status: "Scheduled", date: "Aug 15" },
  { client: "Peter Mwakio", service: "CCTV Installation", loc: "Malindi", status: "Completed", date: "Aug 14" },
  { client: "Halima Abdi", service: "Solar Installation", loc: "Kilifi", status: "In Progress", date: "Aug 13" },
];

export type StatusType = "Completed" | "In Progress" | "Scheduled" | "Quoted";

export const statusStyle: Record<StatusType, { color: string; bg: string }> = {
  "Completed": { color: "#35D399", bg: "rgba(53,211,153,0.12)" },
  "In Progress": { color: "#FFB020", bg: "rgba(255,176,32,0.12)" },
  "Scheduled": { color: "#3FC1E0", bg: "rgba(63,193,224,0.12)" },
  "Quoted": { color: "#9BA8B4", bg: "rgba(155,168,180,0.12)" },
};

export const chartData = services.map(s => ({ name: s.name.split(" ")[0], jobs: s.active, color: s.color }));
