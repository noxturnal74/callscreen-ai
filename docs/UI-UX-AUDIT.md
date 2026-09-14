# CallScreen AI - UI/UX Audit

Design Read: B2B SaaS recruitment operations product for recruiters and hackathon judges, with a Linear-style calm minimal language, leaning toward Tailwind utilities plus system font plus restrained motion.

Scope note (taste-skill Sec 13): taste-skill is for landing and marketing surfaces, not dashboards or data tables. Dashboard and app screens below follow the CallScreen SaaS brief. Taste-skill anti-slop rules still apply everywhere: no purple glow, no em-dash, no fake numbers, no three-equal cards, no div fake screenshots.

Dials:
- Landing: VARIANCE 7 / MOTION 5 / DENSITY 3
- App: VARIANCE 5 / MOTION 3 / DENSITY 5

Stack: Next.js 14 App Router, React 18, Tailwind v3, lucide-react (already a dependency, so kept per taste-skill Sec 3.C), gsap for micro reveals, file JSON store in `.data/`, no DB.

Routes (actual):
- `/` currently `redirect('/dashboard')` in `src/app/page.tsx:3`. This is why there is no landing page.
- `/dashboard` (`src/app/dashboard/page.tsx`): hero banner, funnel, stats, job hub, recent calls.
- `/screening` (`src/app/screening/page.tsx`): batch launch hub, live caller grid, result cards.
- `/screening/[id]` redirects to `/candidates/[id]`.
- `/jobs`, `/jobs/new`, `/jobs/[id]`
- `/candidates`, `/candidates/[id]`
- `/settings` (CALL-E mode mock/live)
- APIs: `/api/candidates`, `/api/jobs`, `/api/screenings`, `/api/calls/start`, `/api/calls/[callRunId]`, `/api/settings`, `/api/seed`. Business logic preserved. Do not touch.

## Current problems (verified in code)

1. No landing page. Root layout (`src/app/layout.tsx:18-25`) always renders Navbar plus Sidebar, so even if `/` had marketing copy it would show app chrome. Need route group split.
2. Duplicate hero messaging. Dashboard (`dashboard/page.tsx:74-106`) and screening (`screening/page.tsx:75-96`) render almost the same white banner with Sparkles pill and blue CTA. One message per surface is enough.
3. Sidebar is flat, not grouped. `Sidebar.tsx:15-21` lists 5 items with one Live badge. Brief asks for Overview / Recruitment / Activity / System grouping plus CALL-E status footer. Current footer is static marketing copy, not live status.
4. Topbar has no search. Brief asks for candidate and job search with Cmd K hint plus notifications and avatar. Current `Navbar.tsx` only shows engine pill and human-in-loop pill.
5. KPI duplication. Dashboard shows funnel (`FrontlineFunnel.tsx`) plus 6 stat cards (`StatsOverview.tsx`). Counts overlap (total, screened, qualified appear twice). Keep both but give each a distinct job: funnel for pipeline, stats for outcomes with real context (percent of screened, no fake delta).
6. Tables are solid but mixed language. `RecentCallsTable.tsx:18-24` empty state is Indonesian while headers are English. Candidate phone is shown full in recent table (`RecentCallsTable.tsx:65`) but masked in roster (`candidates/page.tsx:20-23`). Standardize masking everywhere except confirmation modal.
7. Screening results use cards grid (`screening/page.tsx:185-235`), not the scannable table the brief asks for. Cards hide duration, job, and start time. Switch to table, keep cards only for live calling state.
8. Candidate detail shows full phone (`candidates/[id]/page.tsx:87`) with no masking toggle. Add masked display plus reveal on explicit action. Loading state is plain text (`candidates/[id]/page.tsx:67`). Needs skeleton.
9. Settings uses div click toggles (`settings/page.tsx:72-99`) with no keyboard role, no focus ring. Convert to real buttons with aria-pressed.
10. Motion: gsap reveals in `StatsOverview.tsx:21-39` and `FrontlineFunnel.tsx:17-35` respect `prefers-reduced-motion`, good. Keep pattern, do not add scroll hijack or marquee in app.
11. Typography: system stack in `globals.css:13`, no Inter webfont install. This is intentional to avoid extra dependency. Hierarchy is close to brief but page titles vary (`text-xl` vs `text-2xl`). Lock to brief scale.
12. Colors: already light `#F8FAFC` with `#2563EB` primary, good. No purple glow found. Keep. Remove `animate-ping` plus `animate-bounce` combo on calling badge (`ScreeningStatusBadge.tsx:15-17`), one pulse is enough.
13. Accessibility: badges pair color with icon and label, good. Missing: focus-visible rings on table row actions, aria labels on select-all checkboxes, label above input is present in add-candidate modal, good.
14. Responsive: sidebar hidden on mobile (`Sidebar.tsx:27` with `hidden md:flex`) but no mobile nav replacement. Tables scroll horizontally, good. Dashboard hero stacks, good. Add bottom padding for mobile CTA reach.

## Recommended system

Light SaaS, one accent `#2563EB`, surfaces `#FFFFFF` on `#F8FAFC`, border `#E2E8F0`, radius `rounded-xl` for cards and `rounded-lg` for controls, shadow `shadow-xs` only. Status: Qualified emerald, Maybe amber, Not Fit rose, Calling blue, Waiting slate. Inter-style system stack, page title 28px bold, section 18px semibold, body 14px. Components: AppShell, Sidebar, Topbar, PageHeader, MetricCard, StatusBadge, CandidateTable, ScreeningProgress, CallStatus, JobCard, EmptyState, LoadingState, ErrorState, ConfirmDialog, FilterBar, SearchInput. All already partially exist, refine instead of rebuilding.

## What changes now

1. Route groups: root layout minimal, `(app)` layout owns Navbar and Sidebar. `/` becomes real landing.
2. Landing: split hero with real mini scorecard preview (real component, not fake screenshot div), workflow with 4 verb labels (Import, Call, Extract, Decide), integration strip, CTA, footer.
3. Shell: grouped sidebar with live CALL-E status, topbar with search that routes to `/candidates?q=`, notifications dot, avatar.
4. Dashboard: single hero, funnel plus stats with distinct roles, two-column Active Screening plus Recent Results table, Jobs Overview from real jobs API, CALL-E card from real settings API.
5. Screening, candidates, jobs: tables first, skeletons, empty states, masked phones, keyboard accessible filters.
6. No fake analytics, no invented deltas, demo data labeled Sandbox.
