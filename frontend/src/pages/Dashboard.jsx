import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import SAMPLE_ALERTS from "../data/sampleAlerts";

const ALERT_ORDER = ["flood", "cyclone", "fire"];
const TYPE_META = {
  flood: { label: "Flood", icon: "🌊", color: "text-sky-300", border: "border-sky-500/50" },
  cyclone: { label: "Cyclone", icon: "🌀", color: "text-orange-300", border: "border-orange-500/50" },
  fire: { label: "Fire", icon: "🔥", color: "text-red-300", border: "border-red-500/50" },
};

export default function Dashboard({ onProcess, navigate = () => {} }) {
  const deliveryCanvas = useRef(null);
  const languageCanvas = useRef(null);

  useEffect(() => {
    const deliveryChart = new Chart(deliveryCanvas.current, {
      type: "line",
      data: {
        labels: ["09:00", "09:10", "09:20", "09:30", "09:40", "09:50"],
        datasets: [{ label: "People reached", data: [1240, 3820, 6450, 8210, 10840, 12450], borderColor: "#F97316", backgroundColor: "rgba(249, 115, 22, 0.16)", fill: true, tension: 0.35 }],
      },
      options: chartOptions(),
    });
    const languageChart = new Chart(languageCanvas.current, {
      type: "doughnut",
      data: {
        labels: ["Hindi", "Bengali", "Tamil", "Telugu", "Spanish", "French", "Arabic", "Malay"],
        datasets: [{ data: [28, 17, 13, 11, 9, 8, 8, 6], backgroundColor: ["#F97316", "#38BDF8", "#34D399", "#FACC15", "#F87171", "#A78BFA", "#FB7185", "#2DD4BF"], borderColor: "#0F172A", borderWidth: 3 }],
      },
      options: { ...chartOptions(), cutout: "62%", plugins: { legend: { position: "bottom", labels: { color: "#CBD5E1", boxWidth: 12, padding: 14 } } } },
    });
    return () => { deliveryChart.destroy(); languageChart.destroy(); };
  }, []);

  const activeAlerts = ALERT_ORDER.map((type) => SAMPLE_ALERTS.find((alert) => alert.type === type)).filter(Boolean);
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-6"><p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-400">Operations center / overview</p><div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">LastMile Alert</h1><p className="mt-2 max-w-2xl text-slate-400">A clear view of every warning, translation, and delivery reaching the last mile.</p></div><div className="flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />SYSTEM OPERATIONAL</div></div></header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Active Alerts" value="3" detail="Requires attention" color="text-red-300" /><MetricCard label="People Reached" value="12,450" detail="Across all channels" color="text-sky-300" /><MetricCard label="Languages" value="8" detail="Ready for translation" color="text-emerald-300" /><MetricCard label="Acknowledgement" value="98%" detail="Of delivered alerts" color="text-orange-300" /></div>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold text-white">Active alerts</h2><p className="mt-1 text-sm text-slate-400">Process the latest warnings into accessible messages.</p></div><span className="text-xs font-bold uppercase tracking-wider text-slate-500">3 live incidents</span></div><div className="mt-5 grid gap-3 lg:grid-cols-3">{activeAlerts.map((alert) => <AlertRow key={alert.id} alert={alert} onProcess={() => onProcess(alert)} />)}</div></section>
      <div className="grid gap-6 xl:grid-cols-5"><ChartPanel title="Delivery over time" className="xl:col-span-3"><div className="h-72"><canvas ref={deliveryCanvas} /></div></ChartPanel><ChartPanel title="Translation coverage" className="xl:col-span-2"><div className="h-72"><canvas ref={languageCanvas} /></div></ChartPanel></div>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><h2 className="text-xl font-bold text-white">Quick actions</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><ActionButton icon="＋" label="Create Alert" onClick={() => navigate("alert-input")} /><ActionButton icon="文" label="Translate" onClick={() => navigate("translator")} /><ActionButton icon="↗" label="Track Deliveries" onClick={() => navigate("tracker")} /></div></section>
    </div>
  );
}

function chartOptions() { return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#CBD5E1" } } }, scales: { x: { ticks: { color: "#94A3B8" }, grid: { color: "rgba(148, 163, 184, 0.1)" } }, y: { ticks: { color: "#94A3B8" }, grid: { color: "rgba(148, 163, 184, 0.1)" } } } }; }
function MetricCard({ label, value, detail, color }) { return <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><p className={`text-3xl font-black ${color}`}>{value}</p><p className="mt-2 font-bold text-white">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>; }
function AlertRow({ alert, onProcess }) { const meta = TYPE_META[alert.type]; return <article className={`rounded-xl border ${meta.border} bg-slate-950/50 p-4`}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="text-3xl">{meta.icon}</span><div><h3 className={`font-bold ${meta.color}`}>{meta.label}</h3><p className="text-sm text-slate-400">{alert.area}</p></div></div><span className="rounded-full bg-red-950 px-2 py-1 text-[10px] font-black uppercase text-red-300">{alert.severity}</span></div><button onClick={onProcess} className="mt-4 w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 text-sm font-bold text-white transition hover:brightness-110">Process</button></article>; }
function ChartPanel({ title, className, children }) { return <section className={`rounded-2xl border border-slate-700 bg-slate-900/70 p-5 ${className}`}><h2 className="mb-4 text-lg font-bold text-white">{title}</h2>{children}</section>; }
function ActionButton({ icon, label, onClick }) { return <button onClick={onClick} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 font-bold text-slate-200 transition hover:border-orange-400 hover:bg-orange-500/10 hover:text-orange-300"><span className="text-xl text-orange-400">{icon}</span>{label}</button>; }