# CallScreen AI - Design System

Single theme per surface: marketing landing is dark brand (`#0f0f11`, accent `#ff5c35`, display font Space Grotesk), product app stays light (`#F8FAFC`, accent `#2563EB`). One accent locked per surface.

## Tokens

- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Subtle: `#F1F5F9`
- Border: `#E2E8F0`
- Text primary: `#0F172A`
- Text secondary: `#64748B`
- Text muted: `#94A3B8`
- Brand: `#2563EB`, hover `#1D4ED8`, subdued bg `#EFF6FF`, subdued border `#BFDBFE`
- Success: text `#15803D`, bg `#F0FDF4`, border `#BBF7D0`
- Warning: text `#B45309`, bg `#FFFBEB`, border `#FDE68A`
- Danger: text `#BE123C`, bg `#FEF2F2`, border `#FECACA`
- Info calling: text `#1D4ED8`, bg `#EFF6FF`, border `#BFDBFE`

No purple glow, no gradient hero, no black shadows on light surfaces. Card shadow: `0 1px 2px rgb(0 0 0 / 0.04)`.

## Typography

System stack (no webfont dependency): `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`. Monospace for phones, durations, run IDs.

- Page title: 28px, 700, tracking tight, slate-900
- Section title: 18px, 600, slate-900
- Card title: 15px, 600, slate-900
- Body: 14px, slate-700, relaxed
- Secondary: 13px, slate-500
- Micro label: 11px uppercase, 700, tracking wider, slate-400

No em-dash anywhere in UI copy. Use period, comma, or hyphen.

## Shape and spacing

Shape lock: cards `rounded-xl` (12px), controls and inputs `rounded-lg` (8px), pills `rounded-full`. One rule everywhere.

App shell: sidebar 232px, topbar 64px, content `max-w-[1440px]`, padding 24 to 32px. Landing container `max-w-7xl`.

Motion: 150 to 250ms ease out for hover, press `scale-[0.98]`, table row hover `bg-slate-50`. GSAP reveals only on dashboard stat and funnel entrance, gated by `prefers-reduced-motion`. No scroll hijack, no marquee in app. Landing uses CSS reveals only.

## Components

- `AppShell`: root `(app)` layout, sidebar plus topbar plus main.
- `Sidebar`: grouped nav. Overview: Dashboard. Recruitment: AI Screenings, Jobs and Criteria, Candidates. System: CALL-E Engine. Active: `bg-blue-50 text-blue-700` with blue icon, 8px radius. Footer: live CALL-E status from `/api/settings`, green dot for live PSTN, amber dot for Sandbox.
- `Topbar`: 64px, search input routing to `/candidates?q=`, Cmd K hint, engine pill (subtle), bell, avatar with initials.
- `PageHeader`: title plus description plus primary and secondary actions. One primary blue CTA per page.
- `MetricCard`: label, 28px number, small real context (for example `18% of screened`). No invented delta percentages.
- `StatusBadge`: always icon plus text. Qualified check emerald, Maybe help amber, Not Fit x rose, Calling phone blue pulse (single animation), Ready clock slate, Queued clock amber, No Answer x rose, Failed alert red, Incomplete alert slate.
- `CandidateTable`: compact 13px rows, masked phones `+62 812 ... 1234`, sticky header on scroll, horizontal scroll under 768px.
- `FilterBar`: pill filters with `aria-pressed`, single active blue pill.
- `EmptyState`: icon, title, one sentence, one CTA.
- `LoadingState`: skeleton rows matching table shape, never bare `Loading...` on detail pages.
- `ErrorState`: title naming the failed action, reason line, Retry button.
- `ConfirmDialog`: used before any real outbound call. Shows candidate count, masked numbers, job title, Sandbox or Live label, Cancel plus Start Call.
- `ScorecardCard`: keeps existing evidence grid and human decision buttons. AI recommends, recruiter decides. Transcript collapsed by default.

## Status language

Qualified, Maybe, Not Fit for outcomes. Calling, Waiting, Completed, Failed, No Answer, Busy, Incomplete for calls. Same pill everywhere.

## Demo versus live

Sandbox pill is amber `Sandbox Simulator`. Live pill is emerald `Live CALL-E` with single pulse dot. Mock transcripts labeled Demo in screening hub. Never present mock as live.

## Landing rules (taste-skill applied)

Split hero, headline max 2 lines, subtext max 20 words, CTAs visible without scroll, top padding max `pt-24`. Max 1 eyebrow per 3 sections. No three-equal feature cards. Workflow uses 4 steps labeled Import, Call, Extract, Decide in an asymmetric grid. No div fake screenshots: hero preview is a real mini scorecard component with sample data labeled Sample. Real lucide icons only (project already uses lucide). One CTA intent per label: `Start screening` for app entry, `View live demo` for dashboard preview.
