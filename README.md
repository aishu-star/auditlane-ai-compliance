# Auditlane

Auditlane is an AI-native compliance operations service for B2B SaaS, fintech,
and healthcare companies. It sells completed compliance work instead of another
software seat: security questionnaires, SOC 2 evidence packets, HIPAA vendor
reviews, ISO control refreshes, and exception memos.

The product in this repository is a launch-ready static React app that shows the
customer-facing site, service command center, ROI calculator, market operating
system, and founder launch checklist.

## Why This Exists

YC's highest-ROI RFS pattern is the AI-native service company: use AI internally
to deliver an expensive service faster and with better margins, then productize
the operating system underneath.

Auditlane starts with compliance evidence work because it has:

- urgent buyer pain;
- clear budgets;
- repeated workflows;
- high labor cost;
- source-backed quality requirements;
- expansion paths into governance, risk, sales enablement, and audit operations.

## Product Surface

- Modern product-first hero with service pipeline visualization.
- Live service command center for active packets.
- Case selection, evidence confidence, risk routing, and margin visibility.
- Dynamic customer ROI calculator.
- Market OS for wedge, customer, pricing, and moat.
- Founder 30-day launch checklist.
- Custom visual asset at `public/brand/auditlane-service-map.svg`.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS
- GitHub Pages deployment via GitHub Actions

## Local Development

```bash
npm ci
npm run dev
```

The local app runs on:

```text
http://localhost:3002/
```

## Production Build

```bash
npm run lint
npm test
npm run build
```

The static site is emitted to `dist/`.

## Payment Flow

The app includes a complete buyer UX:

1. choose a service plan;
2. open checkout;
3. simulate payment;
4. enter the paid customer portal.

Because GitHub Pages is static hosting, it cannot securely process real card
payments by itself. For launch, connect the `Pay` button in `src/App.tsx` to
Stripe Payment Links or a backend-created Stripe Checkout Session.

## GitHub Pages Deployment

This repo includes `.github/workflows/deploy.yml`.

After pushing to `main`, GitHub Actions will:

1. install dependencies;
2. run lint;
3. build the static site;
4. upload `dist/` as a Pages artifact;
5. deploy to GitHub Pages.

In GitHub, enable Pages with:

- Source: GitHub Actions.
- Branch: workflow-managed.

## Business Documents

Founder strategy docs are in `docs/` and `outputs/`:

- `docs/AUDITLANE_FOUNDER_PLAYBOOK.md`
- `outputs/auditlane_yc_application_brief.md`
- `outputs/yc_ranked_development_plan.md`
- `outputs/yc_rfs_deep_analysis.md`

## Positioning

One-liner:

> Auditlane replaces manual compliance evidence work with an AI-operated service
> desk that ships QA-approved audit packets in 48 hours.

Initial wedge:

> Security questionnaires and SOC 2 evidence packets for B2B SaaS companies
> selling into enterprises.

Expansion:

> Become the operating layer for compliance services across evidence,
> controls, policies, exceptions, audits, and revenue-blocking customer reviews.
