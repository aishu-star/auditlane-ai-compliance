import { useMemo, useState } from "react";

type Workspace = "ops" | "roi" | "market";
type CaseStatus = "In progress" | "Needs QA" | "Ready" | "Escalated";

type ServiceCase = {
  id: string;
  customer: string;
  request: string;
  buyer: string;
  status: CaseStatus;
  due: string;
  value: number;
  margin: number;
  confidence: number;
  progress: number;
  risk: string;
};

type ChecklistItem = {
  label: string;
  owner: string;
  week: string;
};

const cases: ServiceCase[] = [
  {
    id: "AL-2841",
    customer: "Northstar Health",
    request: "HIPAA evidence packet for enterprise vendor review",
    buyer: "VP Security",
    status: "In progress",
    due: "4h 20m",
    value: 8400,
    margin: 72,
    confidence: 92,
    progress: 68,
    risk: "BAA exception needs legal sign-off",
  },
  {
    id: "AL-2842",
    customer: "AsterPay",
    request: "SOC 2 control refresh for finance buyer",
    buyer: "Head of Finance",
    status: "Needs QA",
    due: "6h 05m",
    value: 6200,
    margin: 78,
    confidence: 88,
    progress: 84,
    risk: "One access sample missing from Okta export",
  },
  {
    id: "AL-2843",
    customer: "VectorGrid",
    request: "Security questionnaire for $240k ARR deal",
    buyer: "Enterprise AE",
    status: "Ready",
    due: "Shipped",
    value: 3400,
    margin: 81,
    confidence: 97,
    progress: 100,
    risk: "No open risk",
  },
  {
    id: "AL-2844",
    customer: "MercuryStack",
    request: "GDPR retention exception memo",
    buyer: "General Counsel",
    status: "Escalated",
    due: "Tomorrow",
    value: 5100,
    margin: 59,
    confidence: 76,
    progress: 46,
    risk: "Contract interpretation required",
  },
];

const laneCards = [
  ["Intake", "Classifies requests, detects framework, scopes deliverables."],
  ["Evidence", "Finds source artifacts across docs, tickets, exports, and logs."],
  ["Draft", "Writes answers, memos, source notes, and customer-ready packets."],
  ["QA", "Routes uncertainty to the right human and locks the audit trail."],
];

const marketMoves = [
  ["Wedge", "Start with security questionnaires and SOC 2 evidence for B2B SaaS teams."],
  ["Customer", "Sell to VP Security, Head of Compliance, COO, and sales teams blocked by reviews."],
  ["Pricing", "Charge per packet first, then convert repeat customers into managed compliance ops."],
  ["Moat", "Build the evidence graph, answer bank, QA data, and workflow history per customer."],
];

const checklist: ChecklistItem[] = [
  { label: "Finish first 10 concierge packets", owner: "Founder", week: "Week 1" },
  { label: "Record before and after delivery time", owner: "Ops", week: "Week 1" },
  { label: "Close 3 paid pilot contracts", owner: "Sales", week: "Week 2" },
  { label: "Create answer quality eval set", owner: "AI", week: "Week 2" },
  { label: "Convert one pilot to monthly plan", owner: "Founder", week: "Week 3" },
  { label: "Publish customer ROI case study", owner: "Growth", week: "Week 4" },
];

function statusClass(status: CaseStatus) {
  if (status === "Ready") return "status ready";
  if (status === "Needs QA") return "status qa";
  if (status === "Escalated") return "status escalated";
  return "status progress";
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function App() {
  const [workspace, setWorkspace] = useState<Workspace>("ops");
  const [activeCase, setActiveCase] = useState(cases[0]);
  const [requestCount, setRequestCount] = useState(28);
  const [manualHours, setManualHours] = useState(10);
  const [loadedCost, setLoadedCost] = useState(150);
  const [completed, setCompleted] = useState<string[]>(["Finish first 10 concierge packets"]);

  const weeklyRevenue = useMemo(
    () => cases.reduce((total, item) => total + item.value, 0),
    [],
  );

  const manualCost = requestCount * manualHours * loadedCost;
  const auditlaneCost = requestCount * 620;
  const savings = manualCost - auditlaneCost;

  function toggleChecklist(label: string) {
    setCompleted((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <main className="page-shell">
      <section className="product-hero" aria-label="Auditlane product">
        <nav className="nav">
          <a className="brand" href="#top" aria-label="Auditlane home">
            <span className="brand-icon">A</span>
            <span>
              <strong>Auditlane</strong>
              <small>AI-native compliance operations</small>
            </span>
          </a>
          <div className="nav-links" aria-label="Page sections">
            <a href="#product">Product</a>
            <a href="#roi">ROI</a>
            <a href="#market">Market</a>
            <a href="#playbook">Playbook</a>
          </div>
          <a className="nav-cta" href="mailto:founder@auditlane.ai">
            Book pilot
          </a>
        </nav>

        <div className="hero-stage" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Rank 1 YC build - AI-native service company</p>
            <h1>Compliance work delivered in 48 hours, with proof attached.</h1>
            <p>
              Auditlane is a launch-ready service platform for audit evidence, security
              questionnaires, and exception memos. Customers send the request. The service engine
              ships the finished, citation-backed packet.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#product">
                Open command center
              </a>
              <a className="button secondary" href="#market">
                View launch plan
              </a>
            </div>
            <div className="trust-row" aria-label="Trust indicators">
              <span>Human QA</span>
              <span>Source citations</span>
              <span>Outcome pricing</span>
              <span>Enterprise workflow</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Auditlane service cockpit preview">
            <div className="glass-top">
              <span />
              <span />
              <span />
              <strong>Live service run</strong>
            </div>
            <div className="run-grid">
              <article>
                <span>Revenue in queue</span>
                <strong>{money(weeklyRevenue)}</strong>
              </article>
              <article>
                <span>Median delivery</span>
                <strong>48h</strong>
              </article>
              <article>
                <span>Gross margin</span>
                <strong>74%</strong>
              </article>
            </div>
            <div className="pipeline">
              {laneCards.map(([title, copy], index) => (
                <div className="pipeline-card" key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="workspace" id="product" aria-label="Product workspace">
        <div className="section-kicker">Product</div>
        <div className="section-heading">
          <h2>Not a homepage. A working service command center.</h2>
          <p>
            This is what the company operates: intake, agent work, evidence confidence, QA routing,
            customer ROI, and GTM execution in one launchable interface.
          </p>
        </div>

        <div className="workspace-tabs" role="tablist" aria-label="Workspace view">
          <button
            className={workspace === "ops" ? "tab active" : "tab"}
            onClick={() => setWorkspace("ops")}
            type="button"
          >
            Ops command
          </button>
          <button
            className={workspace === "roi" ? "tab active" : "tab"}
            onClick={() => setWorkspace("roi")}
            type="button"
          >
            Customer ROI
          </button>
          <button
            className={workspace === "market" ? "tab active" : "tab"}
            onClick={() => setWorkspace("market")}
            type="button"
          >
            Market OS
          </button>
        </div>

        {workspace === "ops" && (
          <div className="ops-grid">
            <div className="panel queue">
              <div className="panel-heading">
                <span>Live queue</span>
                <strong>4 active packets</strong>
              </div>
              {cases.map((item) => (
                <button
                  className={activeCase.id === item.id ? "case-row selected" : "case-row"}
                  key={item.id}
                  onClick={() => setActiveCase(item)}
                  type="button"
                >
                  <span className="case-id">{item.id}</span>
                  <span className="case-main">
                    <strong>{item.customer}</strong>
                    <small>{item.request}</small>
                  </span>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </button>
              ))}
            </div>

            <div className="panel detail">
              <div className="panel-heading">
                <span>Selected packet</span>
                <strong>{activeCase.customer}</strong>
              </div>
              <div className="packet-summary">
                <div>
                  <span>Buyer</span>
                  <strong>{activeCase.buyer}</strong>
                </div>
                <div>
                  <span>Due</span>
                  <strong>{activeCase.due}</strong>
                </div>
                <div>
                  <span>Packet value</span>
                  <strong>{money(activeCase.value)}</strong>
                </div>
                <div>
                  <span>Margin</span>
                  <strong>{activeCase.margin}%</strong>
                </div>
              </div>
              <div className="progress-block">
                <div>
                  <span>Progress</span>
                  <strong>{activeCase.progress}%</strong>
                </div>
                <div className="bar">
                  <span style={{ width: `${activeCase.progress}%` }} />
                </div>
              </div>
              <div className="risk-card">
                <span>Open risk</span>
                <strong>{activeCase.risk}</strong>
              </div>
            </div>

            <div className="panel evidence">
              <div className="panel-heading">
                <span>Evidence confidence</span>
                <strong>{activeCase.confidence}%</strong>
              </div>
              <div className="evidence-list">
                <div>
                  <span>Drive</span>
                  <strong>Vendor evidence folder</strong>
                  <small>97%</small>
                </div>
                <div>
                  <span>Jira</span>
                  <strong>Access review ticket</strong>
                  <small>93%</small>
                </div>
                <div>
                  <span>GitHub</span>
                  <strong>Change approval logs</strong>
                  <small>91%</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {workspace === "roi" && (
          <div className="roi-grid" id="roi">
            <div className="panel calculator">
              <div className="panel-heading">
                <span>Buyer calculator</span>
                <strong>Monthly payback</strong>
              </div>
              <label>
                <span>Monthly compliance requests</span>
                <input
                  max="90"
                  min="4"
                  onChange={(event) => setRequestCount(Number(event.target.value))}
                  type="range"
                  value={requestCount}
                />
                <strong>{requestCount}</strong>
              </label>
              <label>
                <span>Manual hours per request</span>
                <input
                  max="30"
                  min="2"
                  onChange={(event) => setManualHours(Number(event.target.value))}
                  type="range"
                  value={manualHours}
                />
                <strong>{manualHours}</strong>
              </label>
              <label>
                <span>Loaded hourly cost</span>
                <input
                  max="280"
                  min="50"
                  onChange={(event) => setLoadedCost(Number(event.target.value))}
                  step="5"
                  type="range"
                  value={loadedCost}
                />
                <strong>{money(loadedCost)}</strong>
              </label>
            </div>
            <div className="panel savings">
              <span>Estimated monthly savings</span>
              <strong>{money(savings)}</strong>
              <p>
                Manual cost {money(manualCost)} minus Auditlane service fee{" "}
                {money(auditlaneCost)}.
              </p>
              <div className="cost-bars" aria-hidden="true">
                <i style={{ height: "100%" }} />
                <i style={{ height: `${Math.max(16, (auditlaneCost / manualCost) * 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        {workspace === "market" && (
          <div className="market-grid" id="market">
            {marketMoves.map(([title, copy]) => (
              <article className="market-card" key={title}>
                <span>{title}</span>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="service-map" aria-label="Auditlane service map">
        <div>
          <span className="section-kicker">System</span>
          <h2>Every output carries source-backed trust.</h2>
          <p>
            The business becomes valuable when the evidence graph and QA history compound. That is
            the difference between a normal agency and an AI-native service company.
          </p>
        </div>
        <img src="./brand/auditlane-service-map.svg" alt="Auditlane service workflow map" />
      </section>

      <section className="launch" id="playbook" aria-label="Launch checklist">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Founder OS</span>
            <h2>Launch checklist for the first 30 days.</h2>
          </div>
          <p>
            YC does not need a perfect giant company on day one. It needs speed, truth, paid users,
            and a wedge that can become huge.
          </p>
        </div>

        <div className="checklist">
          {checklist.map((item) => (
            <button
              className={completed.includes(item.label) ? "check-item done" : "check-item"}
              key={item.label}
              onClick={() => toggleChecklist(item.label)}
              type="button"
            >
              <span className="checkmark">{completed.includes(item.label) ? "OK" : "+"}</span>
              <strong>{item.label}</strong>
              <small>
                {item.owner} - {item.week}
              </small>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <strong>Auditlane</strong>
        <span>Built for YC-style speed: sell the service, learn the workflow, productize the engine.</span>
        <a href="mailto:founder@auditlane.ai">founder@auditlane.ai</a>
      </footer>
    </main>
  );
}
