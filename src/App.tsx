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

const plans: Plan[] = [
  {
    id: "pilot",
    name: "Paid Pilot",
    price: 1500,
    cadence: "one packet",
    description: "The fastest way to unblock one enterprise review and prove value.",
    bestFor: "First questionnaire or urgent audit evidence ask",
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
    description: "A monthly compliance desk for teams with repeat enterprise reviews.",
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
    description: "High-volume service operations with custom workflow and SLA controls.",
    bestFor: "Revenue teams with heavy enterprise sales motion",
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
          <button className="nav-cta" onClick={() => startCheckout("pilot")} type="button">
            Book pilot
          </button>
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
              <button className="button primary" onClick={() => startCheckout("pilot")} type="button">
                Pay for pilot
              </button>
              <button className="button secondary" onClick={showPaidPortal} type="button">
                Preview paid portal
              </button>
              <a className="button tertiary" href="#market">
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

      <section className="checkout-zone" id="checkout" aria-label="Payment and onboarding">
        {purchaseStage === "browse" && (
          <>
            <div className="section-heading compact-heading">
              <div>
                <span className="section-kicker">Checkout</span>
                <h2>Pick a paid service package.</h2>
              </div>
              <p>
                These buttons now do real UI work: select a plan, open checkout, and then show the
                paid customer portal after payment.
              </p>
            </div>
            <div className="plan-grid">
              {plans.map((plan) => (
                <article className={plan.id === "managed" ? "plan-card featured" : "plan-card"} key={plan.id}>
                  <span>{plan.bestFor}</span>
                  <h3>{plan.name}</h3>
                  <strong>
                    {money(plan.price)}
                    <small> / {plan.cadence}</small>
                  </strong>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button className="plan-button" onClick={() => startCheckout(plan.id)} type="button">
                    Select {plan.name}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {purchaseStage === "checkout" && (
          <div className="checkout-grid">
            <div className="checkout-copy">
              <span className="section-kicker">Secure checkout</span>
              <h2>Start {selectedPlanData.name}.</h2>
              <p>
                This is the production checkout UX. On a real launch, this button should call
                Stripe Checkout or a Stripe Payment Link. In this static demo, it simulates payment
                and opens the paid portal.
              </p>
              <div className="checkout-summary">
                <span>Today</span>
                <strong>{money(selectedPlanData.price)}</strong>
                <small>{selectedPlanData.cadence}</small>
              </div>
            </div>

            <form className="payment-card" onSubmit={(event) => event.preventDefault()}>
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
          </div>
        )}

        {purchaseStage === "paid" && (
          <div className="success-panel" id="portal">
            <div>
              <span className="section-kicker">Payment complete</span>
              <h2>Welcome to your Auditlane portal.</h2>
              <p>
                {companyName || "Your company"} is now set up on {selectedPlanData.name}. The
                first evidence packet is ready for intake, QA routing, and final delivery.
              </p>
            </div>
            <div className="receipt-card">
              <span>Receipt</span>
              <strong>{money(selectedPlanData.price)}</strong>
              <small>{buyerEmail}</small>
            </div>
          </div>
        )}
      </section>

      {purchaseStage === "paid" && (
        <section className="paid-portal" aria-label="Paid customer portal">
          <div className="portal-header">
            <div>
              <span className="section-kicker">Customer portal</span>
              <h2>What the app looks like after paying.</h2>
            </div>
            <button className="button primary" onClick={() => startCheckout("managed")} type="button">
              Upgrade plan
            </button>
          </div>

          <div className="portal-grid">
            <div className="portal-card upload-card">
              <span>Step 1</span>
              <h3>Upload your request</h3>
              <div className="dropzone">
                <strong>Drop questionnaire or audit request</strong>
                <small>PDF, XLSX, DOCX, CSV, screenshots, policy links</small>
              </div>
              <button className="portal-action" type="button">
                Add sample request
              </button>
            </div>
            <div className="portal-card">
              <span>Service SLA</span>
              <h3>48-hour delivery clock</h3>
              <div className="sla-ring">47:58</div>
              <p>Timer starts when source evidence is attached.</p>
            </div>
            <div className="portal-card">
              <span>Current packet</span>
              <h3>Security questionnaire</h3>
              <div className="portal-progress">
                <i style={{ width: "24%" }} />
              </div>
              <p>Intake opened. Evidence mapping begins after upload.</p>
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
