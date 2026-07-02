import { useMemo, useState } from "react";

type Workspace = "ops" | "roi" | "market";
type CaseStatus = "In progress" | "Needs QA" | "Ready" | "Escalated";
type PlanId = "pilot" | "managed" | "enterprise";
type PurchaseStage = "browse" | "checkout" | "paid";

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

type Plan = {
  id: PlanId;
  name: string;
  price: number;
  cadence: string;
  description: string;
  bestFor: string;
  includes: string[];
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

const lanes = [
  ["Intake", "Classify ask and define deliverable"],
  ["Evidence", "Find source-backed artifacts"],
  ["Draft", "Write answer packet with citations"],
  ["Review", "Route gaps to human QA"],
  ["Ship", "Deliver customer-ready output"],
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

const plans: Plan[] = [
  {
    id: "pilot",
    name: "Paid Pilot",
    price: 1500,
    cadence: "one packet",
    description: "Turn one urgent review into a delivered packet in 48 hours.",
    bestFor: "First questionnaire or urgent audit ask",
    includes: [
      "48-hour security questionnaire turnaround",
      "Source-backed answer packet",
      "Human QA on every answer",
      "Customer ROI summary",
    ],
  },
  {
    id: "managed",
    name: "Managed Ops",
    price: 8000,
    cadence: "per month",
    description: "A monthly compliance desk for repeat enterprise reviews.",
    bestFor: "10-30 monthly requests",
    includes: [
      "Unlimited intake queue",
      "SOC 2, HIPAA, ISO, GDPR coverage",
      "Dedicated compliance operator",
      "Reusable answer bank",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Desk",
    price: 18000,
    cadence: "per month",
    description: "High-volume service operations with custom workflow controls.",
    bestFor: "Heavy enterprise sales motion",
    includes: [
      "Priority SLA",
      "Custom evidence graph",
      "Legal and security routing",
      "Quarterly control refresh",
    ],
  },
];

const portalSteps = [
  ["Upload request", "Drop in questionnaire, audit ask, policy docs, and prior answers."],
  ["Connect sources", "Invite security, sales, legal, and engineering owners to add evidence."],
  ["Review draft", "Approve answers, inspect citations, and route exceptions before delivery."],
  ["Ship packet", "Download final packet and share the customer-facing audit trail."],
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
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pilot");
  const [purchaseStage, setPurchaseStage] = useState<PurchaseStage>("browse");
  const [isProcessing, setIsProcessing] = useState(false);
  const [companyName, setCompanyName] = useState("Northstar Health");
  const [buyerEmail, setBuyerEmail] = useState("security@northstar.example");
  const [requestCount, setRequestCount] = useState(28);
  const [manualHours, setManualHours] = useState(10);
  const [loadedCost, setLoadedCost] = useState(150);
  const [completed, setCompleted] = useState<string[]>(["Finish first 10 concierge packets"]);

  const weeklyRevenue = useMemo(
    () => cases.reduce((total, item) => total + item.value, 0),
    [],
  );

  const averageConfidence = Math.round(
    cases.reduce((total, item) => total + item.confidence, 0) / cases.length,
  );
  const manualCost = requestCount * manualHours * loadedCost;
  const auditlaneCost = requestCount * 620;
  const savings = manualCost - auditlaneCost;
  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];

  function toggleChecklist(label: string) {
    setCompleted((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function scrollToSection(id: string) {
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function startCheckout(plan: PlanId) {
    setSelectedPlan(plan);
    setPurchaseStage("checkout");
    scrollToSection("checkout");
  }

  function showPaidPortal() {
    setPurchaseStage("paid");
    scrollToSection("portal");
  }

  function completePayment() {
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      showPaidPortal();
    }, 350);
  }

  return (
    <main className="page-shell">
      <section className="command-screen" id="top" aria-label="Auditlane product console">
        <aside className="side-rail">
          <a className="brand" href="#top" aria-label="Auditlane home">
            <span className="brand-icon">A</span>
            <span>
              <strong>Auditlane</strong>
              <small>Service OS</small>
            </span>
          </a>

          <nav className="rail-nav" aria-label="Main sections">
            <a href="#product">Product</a>
            <a href="#checkout">Pricing</a>
            <a href="#portal">Portal</a>
            <a href="#playbook">Launch</a>
          </nav>

          <div className="rail-metric">
            <span>Work in queue</span>
            <strong>{money(weeklyRevenue)}</strong>
          </div>
          <div className="rail-metric">
            <span>Source confidence</span>
            <strong>{averageConfidence}%</strong>
          </div>
          <button className="rail-button" onClick={() => startCheckout("pilot")} type="button">
            Book pilot
          </button>
        </aside>

        <section className="workbench">
          <header className="workbench-top">
            <div>
              <span className="eyebrow">AI-native compliance operations</span>
              <h1>Ship audit packets, not promises.</h1>
            </div>
            <div className="top-actions">
              <button className="button secondary" onClick={showPaidPortal} type="button">
                Preview portal
              </button>
              <button className="button primary" onClick={() => startCheckout("pilot")} type="button">
                Pay for pilot
              </button>
            </div>
          </header>

          <div className="console-grid">
            <div className="queue-panel">
              <div className="panel-heading">
                <span>Live service queue</span>
                <strong>{cases.length} active</strong>
              </div>
              <div className="case-stack">
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
            </div>

            <div className="focus-panel">
              <div className="focus-header">
                <div>
                  <span>Selected packet</span>
                  <h2>{activeCase.customer}</h2>
                </div>
                <strong>{money(activeCase.value)}</strong>
              </div>

              <div className="packet-grid">
                <div>
                  <span>Buyer</span>
                  <strong>{activeCase.buyer}</strong>
                </div>
                <div>
                  <span>Due</span>
                  <strong>{activeCase.due}</strong>
                </div>
                <div>
                  <span>Margin</span>
                  <strong>{activeCase.margin}%</strong>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>{activeCase.confidence}%</strong>
                </div>
              </div>

              <div className="risk-line">
                <span>Risk</span>
                <strong>{activeCase.risk}</strong>
              </div>

              <div className="progress-module">
                <div>
                  <span>Packet progress</span>
                  <strong>{activeCase.progress}%</strong>
                </div>
                <div className="bar">
                  <span style={{ width: `${activeCase.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="lane-panel">
              <div className="panel-heading">
                <span>Service pipeline</span>
                <strong>48h SLA</strong>
              </div>
              <div className="lane-grid">
                {lanes.map(([title, copy], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="conversion-rail" id="checkout">
          {purchaseStage === "browse" && (
            <div className="conversion-card">
              <span className="eyebrow">Checkout</span>
              <h2>Start with a paid packet.</h2>
              <p>Pick a plan and open checkout. No dead buttons now.</p>
              <div className="mini-plans">
                {plans.map((plan) => (
                  <button
                    className={plan.id === selectedPlan ? "mini-plan active" : "mini-plan"}
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    type="button"
                  >
                    <span>{plan.name}</span>
                    <strong>{money(plan.price)}</strong>
                  </button>
                ))}
              </div>
              <button className="pay-button" onClick={() => startCheckout(selectedPlan)} type="button">
                Continue to checkout
              </button>
            </div>
          )}

          {purchaseStage === "checkout" && (
            <form className="checkout-card" onSubmit={(event) => event.preventDefault()}>
              <span className="eyebrow">Secure checkout</span>
              <h2>Start {selectedPlanData.name}.</h2>
              <p>{selectedPlanData.description}</p>
              <div className="receipt-strip">
                <span>Today</span>
                <strong>{money(selectedPlanData.price)}</strong>
                <small>{selectedPlanData.cadence}</small>
              </div>
              <label>
                Company
                <input
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Company name"
                  type="text"
                  value={companyName}
                />
              </label>
              <label>
                Work email
                <input
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  placeholder="security@company.com"
                  type="email"
                  value={buyerEmail}
                />
              </label>
              <label>
                Card number
                <input placeholder="4242 4242 4242 4242" inputMode="numeric" />
              </label>
              <div className="card-row">
                <label>
                  Expiry
                  <input placeholder="08 / 28" />
                </label>
                <label>
                  CVC
                  <input placeholder="123" inputMode="numeric" />
                </label>
              </div>
              <button className="pay-button" disabled={isProcessing} onClick={completePayment} type="button">
                {isProcessing ? "Processing..." : `Pay ${money(selectedPlanData.price)}`}
              </button>
              <button className="ghost-button" onClick={() => setPurchaseStage("browse")} type="button">
                Change plan
              </button>
            </form>
          )}

          {purchaseStage === "paid" && (
            <div className="paid-card" id="portal">
              <span className="eyebrow">Payment complete</span>
              <h2>Welcome to your Auditlane portal.</h2>
              <p>{companyName} is set up on {selectedPlanData.name}.</p>
              <div className="receipt-strip light">
                <span>Receipt</span>
                <strong>{money(selectedPlanData.price)}</strong>
                <small>{buyerEmail}</small>
              </div>
              <button className="pay-button" onClick={() => startCheckout("managed")} type="button">
                Upgrade plan
              </button>
            </div>
          )}
        </aside>
      </section>

      {purchaseStage === "paid" && (
        <section className="portal-section" aria-label="Paid customer portal">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Customer portal</span>
              <h2>What the app looks like after paying.</h2>
            </div>
            <p>The buyer sees intake, upload, SLA, packet progress, and clear next actions.</p>
          </div>

          <div className="portal-grid">
            <div className="portal-main">
              <span>Step 1</span>
              <h3>Upload your request</h3>
              <div className="dropzone">
                <strong>Drop questionnaire or audit request</strong>
                <small>PDF, XLSX, DOCX, CSV, screenshots, policy links</small>
              </div>
              <button className="portal-action" type="button">Add sample request</button>
            </div>
            <div className="portal-stat">
              <span>Service SLA</span>
              <strong>47:58</strong>
              <p>Timer starts after evidence is attached.</p>
            </div>
            <div className="portal-stat">
              <span>Current packet</span>
              <strong>24%</strong>
              <div className="bar">
                <span style={{ width: "24%" }} />
              </div>
              <p>Intake opened. Evidence mapping begins next.</p>
            </div>
          </div>

          <div className="portal-steps">
            {portalSteps.map(([title, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="workspace-section" id="product" aria-label="Product workspace">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Product</span>
            <h2>Operator controls, buyer ROI, and GTM system.</h2>
          </div>
          <p>Switch views to inspect the live service business from ops, customer, and market angles.</p>
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
          <div className="ops-cards">
            {cases.map((item) => (
              <article key={item.id}>
                <span>{item.id}</span>
                <strong>{item.customer}</strong>
                <p>{item.request}</p>
                <div className="bar">
                  <span style={{ width: `${item.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        )}

        {workspace === "roi" && (
          <div className="roi-grid" id="roi">
            <div className="calculator">
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
            <div className="savings">
              <span>Estimated monthly savings</span>
              <strong>{money(savings)}</strong>
              <p>Manual cost {money(manualCost)} minus Auditlane service fee {money(auditlaneCost)}.</p>
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

      <section className="system-section" aria-label="Auditlane service map">
        <div>
          <span className="section-kicker">System</span>
          <h2>Every delivered answer has a source trail.</h2>
          <p>The design now treats Auditlane as a real operating product: evidence graph, agent work, QA, and final delivery.</p>
        </div>
        <img src="./brand/auditlane-service-map.svg" alt="Auditlane service workflow map" />
      </section>

      <section className="launch-section" id="playbook" aria-label="Launch checklist">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Founder OS</span>
            <h2>30-day execution board.</h2>
          </div>
          <p>Click items as you finish them. YC wants speed, paid users, and proof.</p>
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
              <small>{item.owner} - {item.week}</small>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <strong>Auditlane</strong>
        <span>AI-native compliance operations, designed as a paid service from day one.</span>
        <button className="footer-button" onClick={() => startCheckout("pilot")} type="button">Start pilot</button>
      </footer>
    </main>
  );
}
