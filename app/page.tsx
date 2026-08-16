"use client";

import { useMemo, useState } from "react";

type CheckStatus = "passed" | "warning" | "failed";
const lineItems = [
  { no: "01", item: "RTU Control Panel — IP54 GRP Kiosk", qty: 2, unit: "No.", rate: 18750, discount: 5 },
  { no: "02", item: "Electromagnetic Flow Meter — DN450", qty: 1, unit: "No.", rate: 32600, discount: 8 },
  { no: "03", item: "Pressure Transmitter — 0–16 bar", qty: 4, unit: "No.", rate: 2150, discount: 0 },
  { no: "04", item: "Engineering, Testing & Documentation", qty: 1, unit: "Lot", rate: 12800, discount: 0 },
];
const checks: { title: string; detail: string; status: CheckStatus; section: string }[] = [
  { title: "Arithmetic verified", detail: "All item totals, discount and VAT calculations reconcile.", status: "passed", section: "Commercial" },
  { title: "Payment terms need approval", detail: "90 days PDC exceeds the standard 60-day credit policy.", status: "warning", section: "Commercial" },
  { title: "Flow meter PN rating missing", detail: "Confirm PN16 or PN25 before order placement.", status: "failed", section: "Technical" },
  { title: "Warranty aligned", detail: "18 months from delivery or 12 months from commissioning.", status: "passed", section: "Commercial" },
  { title: "Remote cable length unconfirmed", detail: "Sensor-to-transmitter cable length is not stated.", status: "warning", section: "Technical" },
  { title: "Installation excluded", detail: "Supply-only scope is clearly stated in exclusions.", status: "passed", section: "Scope" },
];
const activity = [
  ["Rahul S.", "Requested PN rating clarification", "Today, 09:42"],
  ["Sarang V.", "Updated payment terms to 90 days PDC", "Yesterday, 16:18"],
  ["Bharath", "Added review note on warranty", "Yesterday, 11:05"],
];
function money(value: number) { return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", minimumFractionDigits: 2 }).format(value); }

export default function Home() {
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All checks");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [resolved, setResolved] = useState<string[]>([]);
  const subtotal = useMemo(() => lineItems.reduce((s, r) => s + r.qty * r.rate * (1 - r.discount / 100), 0), []);
  const vat = subtotal * 0.05, total = subtotal + vat;
  const filteredChecks = checks.filter((c) => (filter === "All checks" || c.status === filter.toLowerCase()) && (c.title + c.detail + c.section).toLowerCase().includes(query.toLowerCase()));
  const runReview = () => { setNotice("Review refreshed — 6 checks completed in under a second."); window.setTimeout(() => setNotice(""), 3500); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">Q</span><span>QuoteGuard</span></div>
      <nav aria-label="Primary navigation">
        <a className="nav-item active" href="#"><span>⌂</span> Dashboard</a><a className="nav-item" href="#quotation"><span>▤</span> Quotations <b>12</b></a><a className="nav-item" href="#reviews"><span>✓</span> Reviews <b>4</b></a><a className="nav-item" href="#"><span>♙</span> Customers</a><a className="nav-item" href="#"><span>◫</span> Templates</a>
      </nav>
      <div className="sidebar-bottom"><a className="nav-item" href="#"><span>⚙</span> Settings</a><a className="nav-item" href="#"><span>?</span> Help & support</a><div className="user-card"><div className="avatar">SV</div><div><strong>Sarang V.</strong><small>Internal Sales Engineer</small></div><button aria-label="User menu">•••</button></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><div className="eyebrow">QUOTATIONS / REVIEW</div><h1>Quotation review</h1></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications">♢<i /></button><button className="secondary">Export PDF</button><button className="primary" onClick={runReview}>Run review <span>→</span></button></div></header>
      {notice && <div className="toast" role="status">✓ {notice}</div>}
      <section className="quote-head" id="quotation"><div className="quote-title"><div className="file-icon">Q</div><div><div className="title-row"><h2>QD26-S25-372-R0</h2><span className="status-pill">IN REVIEW</span></div><p>RTU Panels & Field Instruments · Dubai Municipality</p></div></div><div className="meta-grid"><div><span>Customer</span><strong>Arabian Coast Contracting</strong></div><div><span>Project</span><strong>DM Irrigation Network — Park 3</strong></div><div><span>Prepared by</span><strong><i className="mini-avatar">SV</i> Sarang V.</strong></div><div><span>Quote value</span><strong>{money(total)}</strong></div></div></section>
      <div className="tabs" role="tablist">{["Overview", "Line items", "Commercial terms", "Technical scope", "Activity"].map((name) => <button key={name} className={tab === name ? "selected" : ""} onClick={() => setTab(name)} role="tab" aria-selected={tab === name}>{name}{name === "Technical scope" && <em>2</em>}</button>)}</div>

      {tab === "Overview" && <>
        <section className="metrics"><article><div className="metric-icon green">✓</div><div><span>Review score</span><strong>82<small>/100</small></strong><p className="positive">↑ 6 points from R-1</p></div></article><article><div className="metric-icon amber">!</div><div><span>Attention needed</span><strong>3 <small>items</small></strong><p>2 technical · 1 commercial</p></div></article><article><div className="metric-icon blue">◷</div><div><span>Quote validity</span><strong>27 <small>days left</small></strong><p>Expires 12 Sep 2026</p></div></article><article><div className="metric-icon purple">◈</div><div><span>Gross margin</span><strong>18.4%</strong><p className="positive">Within target range</p></div></article></section>
        <div className="content-grid" id="reviews"><section className="panel review-panel"><div className="panel-head"><div><h3>Review checks</h3><p>Automated and manual checks against your quotation policy</p></div><span className="last-run">Last run: just now</span></div><div className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search checks..." /></label><div className="filter-group">{["All checks", "Failed", "Warning", "Passed"].map(f => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div></div><div className="check-list">{filteredChecks.map(check => { const isResolved = resolved.includes(check.title); return <article className={`check-row ${isResolved ? "resolved" : ""}`} key={check.title}><span className={`check-icon ${check.status}`}>{isResolved || check.status === "passed" ? "✓" : check.status === "warning" ? "!" : "×"}</span><div className="check-copy"><div><strong>{check.title}</strong><span>{check.section}</span></div><p>{isResolved ? "Marked resolved by reviewer." : check.detail}</p></div>{check.status !== "passed" && !isResolved && <button onClick={() => setResolved([...resolved, check.title])}>Resolve</button>}</article>})}{!filteredChecks.length && <div className="empty">No checks match your search.</div>}</div></section>
          <aside className="right-column"><section className="panel summary-panel"><div className="panel-head"><div><h3>Commercial summary</h3><p>Verified against line items</p></div><span className="verified">✓ Verified</span></div><dl><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>Discount</dt><dd>Included by line</dd></div><div><dt>VAT (5%)</dt><dd>{money(vat)}</dd></div><div className="grand"><dt>Total value</dt><dd>{money(total)}</dd></div><div><dt>Gross margin</dt><dd className="green-text">18.4%</dd></div></dl><button className="full-button" onClick={() => setTab("Line items")}>View price breakdown <span>→</span></button></section><section className="panel activity-panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest changes and comments</p></div></div>{activity.map(([name, action, time], i) => <div className="activity" key={action}><div className={`avatar av-${i}`}>{name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><strong>{name}</strong><p>{action}</p><small>{time}</small></div></div>)}<button className="text-button" onClick={() => setTab("Activity")}>View all activity →</button></section></aside></div>
      </>}
      {tab === "Line items" && <section className="panel tab-panel"><div className="panel-head"><div><h3>Price breakdown</h3><p>Reviewed line-item calculations</p></div><span className="verified">✓ Arithmetic verified</span></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit price</th><th>Discount</th><th>Total</th></tr></thead><tbody>{lineItems.map(r => <tr key={r.no}><td>{r.no}</td><td><strong>{r.item}</strong></td><td>{r.qty}</td><td>{r.unit}</td><td>{money(r.rate)}</td><td>{r.discount}%</td><td><strong>{money(r.qty*r.rate*(1-r.discount/100))}</strong></td></tr>)}</tbody><tfoot><tr><td colSpan={6}>Subtotal</td><td>{money(subtotal)}</td></tr><tr><td colSpan={6}>VAT (5%)</td><td>{money(vat)}</td></tr><tr><td colSpan={6}>Quotation total</td><td>{money(total)}</td></tr></tfoot></table></div></section>}
      {tab === "Commercial terms" && <section className="panel tab-panel"><div className="panel-head"><div><h3>Commercial terms</h3><p>Contractual conditions included in the offer</p></div></div><div className="terms-grid">{[["Payment", "80% upon delivery and 20% after commissioning, by 90 days PDC", "warning"],["Delivery", "12–14 weeks from approved drawings and advance payment", "ok"],["Validity", "30 days from quotation date", "ok"],["Warranty", "18 months from delivery or 12 months from commissioning", "ok"],["Currency", "United Arab Emirates Dirham (AED)", "ok"],["Incoterm", "Delivered Duty Paid — Dubai project site", "ok"]].map(([a,b,c]) => <div className="term" key={a}><span>{a}</span><strong>{b}</strong><em className={c}>{c === "ok" ? "✓ Compliant" : "! Approval needed"}</em></div>)}</div></section>}
      {tab === "Technical scope" && <section className="panel tab-panel"><div className="panel-head"><div><h3>Technical scope</h3><p>Supply boundaries, compliance and open clarifications</p></div></div><div className="scope-grid"><div><h4>Included</h4><ul><li>RTU panels with ABB RTU560 hardware</li><li>DN450 electromagnetic flow meter</li><li>Pressure transmitters and accessories</li><li>Panel engineering and factory testing</li><li>Drawings, manuals and test certificates</li></ul></div><div><h4>Excluded</h4><ul><li>Installation, testing and commissioning at site</li><li>Shutdowns, permits and civil works</li><li>SCADA software modification or upgrades</li><li>Power and signal field cabling</li><li>Communication card for flow meter–RTU link</li></ul></div><div className="clarifications"><h4>Open clarifications</h4><div><b>01</b><p><strong>Flow meter pressure rating</strong><span>Confirm PN16 or PN25.</span></p></div><div><b>02</b><p><strong>Remote cable distance</strong><span>Confirm sensor-to-transmitter distance.</span></p></div></div></div></section>}
      {tab === "Activity" && <section className="panel tab-panel"><div className="panel-head"><div><h3>Review activity</h3><p>Complete audit trail for this quotation</p></div></div><div className="timeline">{[...activity,["System", "Completed 6 automated review checks", "Yesterday, 10:58"],["Sarang V.", "Created revision R0 from approved template", "14 Aug 2026, 15:32"]].map(([name,action,time],i)=><div key={action}><span>{i+1}</span><p><strong>{name}</strong> {action}<small>{time}</small></p></div>)}</div></section>}
    </main>
  </div>;
}
