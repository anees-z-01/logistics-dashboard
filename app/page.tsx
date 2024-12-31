"use client";

import { useMemo, useState } from "react";

type Status = "In transit" | "Delivered" | "Delayed";
type Shipment = { id: string; origin: string; destination: string; carrier: string; status: Status; progress: number; eta: string };
const shipments: Shipment[] = [
  { id: "DEMO-1048", origin: "Bristol", destination: "London", carrier: "Demo Freight A", status: "In transit", progress: 72, eta: "Today · 14:30" },
  { id: "DEMO-1047", origin: "Manchester", destination: "Leeds", carrier: "Demo Freight B", status: "Delivered", progress: 100, eta: "Delivered · 10:15" },
  { id: "DEMO-1046", origin: "London", destination: "Birmingham", carrier: "Demo Freight A", status: "Delayed", progress: 38, eta: "Review required" },
  { id: "DEMO-1045", origin: "Leeds", destination: "Bristol", carrier: "Demo Freight C", status: "In transit", progress: 54, eta: "Today · 16:45" },
  { id: "DEMO-1044", origin: "Birmingham", destination: "Manchester", carrier: "Demo Freight B", status: "Delivered", progress: 100, eta: "Delivered · 09:40" },
  { id: "DEMO-1043", origin: "London", destination: "Leeds", carrier: "Demo Freight C", status: "In transit", progress: 24, eta: "Today · 18:20" },
];
const statuses = ["All shipments", "In transit", "Delivered", "Delayed"] as const;

export default function Home() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All shipments");
  const [reviewed, setReviewed] = useState(false);
  const visible = useMemo(() => shipments.filter(item =>
    (status === "All shipments" || item.status === status) &&
    `${item.id} ${item.origin} ${item.destination} ${item.carrier}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [search, status]);
  const reset = () => { setSearch(""); setStatus("All shipments"); };
  function exportView() {
    const rows = [["Shipment", "Origin", "Destination", "Carrier", "Status", "Progress"],
      ...visible.map(item => [item.id, item.origin, item.destination, item.carrier, item.status, `${item.progress}%`])];
    const url = URL.createObjectURL(new Blob([rows.map(row => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "demo-shipments.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="workspace">
      <aside className="sidebar" aria-label="Workspace navigation">
        <a className="brand" href="#overview"><span className="brand-mark" aria-hidden="true">↗</span> Freightline<span className="brand-dot">.</span></a>
        <span className="nav-label">WORKSPACE</span>
        <a className="nav-item active" href="#overview"><span aria-hidden="true">▦</span> Overview</a>
        <a className="nav-item" href="#shipments"><span aria-hidden="true">↔</span> Shipments <span className="nav-count">6</span></a>
        <a className="nav-item" href="#attention"><span aria-hidden="true">◷</span> Needs attention <span className="nav-count warning">1</span></a>
        <div className="sidebar-note"><span className="online-dot" /> Local demo workspace<p>All records are synthetic.<br />No carrier account connected.</p></div>
        <div className="workspace-id"><div className="avatar" aria-hidden="true">FL</div><div>Operations team<small>Sample workspace</small></div></div>
      </aside>
      <div className="main-area">
        <header className="topbar"><span>Workspace <span className="breadcrumb">/</span> <strong>Overview</strong></span><span className="demo-badge">DEMO DATA</span></header>
        <main id="overview">
          <div className="heading-row"><div><p className="eyebrow">DISPATCH OVERVIEW</p><h1>Every shipment. One clear view.</h1><p className="subtitle">Keep deliveries moving and give the exceptions your attention.</p></div><button className="export-button" onClick={exportView}><span aria-hidden="true">↓</span> Export view</button></div>
          <section className="metrics" aria-label="Sample shipment summary">
            <article className="metric"><div className="metric-top">Total shipments <span className="metric-icon" aria-hidden="true">▤</span></div><strong>{shipments.length.toString().padStart(2, "0")}</strong><p>Across the sample delivery network</p></article>
            <article className="metric"><div className="metric-top">In transit <span className="metric-icon green" aria-hidden="true">↗</span></div><strong>{shipments.filter(item => item.status === "In transit").length.toString().padStart(2, "0")}</strong><p><span className="online-dot" /> Moving toward their destination</p></article>
            <article className="metric"><div className="metric-top">Delivered <span className="metric-icon green" aria-hidden="true">✓</span></div><strong>{shipments.filter(item => item.status === "Delivered").length.toString().padStart(2, "0")}</strong><p>Completed in this sample dataset</p></article>
            <article className="metric"><div className="metric-top">Needs attention <span className="metric-icon amber" aria-hidden="true">!</span></div><strong>{shipments.filter(item => item.status === "Delayed").length.toString().padStart(2, "0")}</strong><p>One exception ready for review</p></article>
          </section>
          <div className="content-grid">
            <section className="shipment-panel" id="shipments" aria-labelledby="shipment-heading">
              <div className="panel-heading"><div><h2 id="shipment-heading">Shipment activity</h2><p>Your sample delivery queue, from pickup to arrival.</p></div><span className="record-count">{shipments.length} records</span></div>
              <div className="toolbar"><div className="status-tabs" aria-label="Filter by shipment status">{statuses.map(option => <button key={option} aria-pressed={status === option} onClick={() => setStatus(option)}>{option}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">Search shipments</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search shipments…" type="search" /></label></div>
              <div className="table-scroll"><table><caption className="sr-only">Synthetic shipments matching the current filters</caption><thead><tr><th scope="col">SHIPMENT</th><th scope="col">ROUTE</th><th scope="col">STATUS</th><th scope="col">PROGRESS</th><th scope="col">ARRIVAL</th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><th scope="row"><span className="shipment-id">{item.id}</span><small>{item.carrier}</small></th><td><span className="route">{item.origin} <span aria-hidden="true">→</span> {item.destination}</span><small>Road freight</small></td><td><span className={`status-pill ${item.status.toLowerCase().replace(" ", "-")}`}><span aria-hidden="true">●</span> {item.status}</span></td><td><div className="progress-label">{item.progress}%</div><progress max="100" value={item.progress} aria-label={`${item.id} route progress`} /></td><td><span className={item.status === "Delayed" ? "arrival-warning" : "arrival"}>{item.eta}</span></td></tr>)}</tbody></table></div>
              {visible.length === 0 && <div className="empty-state"><h3>No shipments match those filters</h3><p>Try a route, carrier, or shipment ID.</p><button onClick={reset}>Clear filters</button></div>}
              <div className="table-footer" aria-live="polite">Showing {visible.length} of {shipments.length} sample shipments<span>No live tracking connected</span></div>
            </section>
            <aside className="attention-panel" id="attention"><div className="attention-symbol" aria-hidden="true">↗</div><p className="eyebrow">KEEP THINGS MOVING</p><h2>A little attention.<br /> A better delivery.</h2><p className="attention-copy">One sample shipment is delayed. Review the exception before planning the next handoff.</p><div className="exception"><div><strong>DEMO-1046</strong><span className="status-pill delayed">Delayed</span></div><p>London → Birmingham</p><small>Demo Freight A · sample exception</small></div><label className="review-check"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />{reviewed ? "Marked reviewed in this session" : "Mark exception reviewed"}</label><div className="note-divider" /><p className="sample-note">A working interface with synthetic data. Filters, CSV export, and this checklist work locally; no shipment is changed on a carrier system.</p></aside>
          </div>
          <footer className="page-footer"><span>Freightline · Logistics dashboard concept</span><span>Built for a clearer working day.</span></footer>
        </main>
      </div>
    </div>
  );
}
