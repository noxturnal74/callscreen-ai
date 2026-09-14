# CallScreen AI — UI/UX Reconstruction Audit & Transformation Architecture

## 1. Executive Summary & Design Read
**Design Read:** Modern Frontline Recruitment Operations SaaS platform (CallScreen AI). Built with restrained, high-density Ashby/Linear/Ramp ergonomics.
**Design Dials:**
- `DESIGN_VARIANCE: 5` (Structured ATS operational grid, predictable layout, consistent typographic scales)
- `MOTION_INTENSITY: 3` (Smooth, subtle GSAP & CSS microinteractions, 150–200ms transitions, accessibility reduced-motion compliant)
- `VISUAL_DENSITY: 6` (High-density candidate dossiers, instant-access evidence scorecards, zero fluff)

---

## 2. Information Architecture Restructuring

### Navigation Hierarchy:
1. **Overview**
   - `/dashboard` — Operational control center with Product Hero, Next Actions, Live Call Progress, Recruitment Pipeline, Recent Screenings, Active Roles, and Engine Status.
2. **Recruitment**
   - `/jobs` & `/jobs/[id]` — Role setup, candidate pipeline, and 5-stage voice screening questionnaire manager.
   - `/candidates` & `/candidates/[id]` — Roster table with filters, search, E.164 phone verification, and full transcript scorecard drawer.
   - `/screening` & `/screening/[id]` — AI Screening Center, active multi-candidate live monitor, and batch dispatch workflow.
3. **Activity**
   - `/history` — Detailed chronological screening call log with filterable statuses and durations.
   - `/analytics` — Truthful KPI aggregations (no fabricated data) derived directly from `.data/db.json`.
4. **System**
   - `/integrations` — CALL-E Telephony Gateway status, OAuth readiness, environment switcher (Sandbox vs Live PSTN), and single-click test call.
   - `/settings` — Recruiter preferences and system settings.

---

## 3. Component System Unification
- `Sidebar`: 230px crisp light shell with categorized navigation groups, active state highlights, and real-time engine pill.
- `Topbar`: Global search (⌘K), sandbox indicator, notifications, and recruiter profile.
- `ScorecardCard`: Standardized evidence rationale ("Why This Candidate?"), verbatim dialog stream, and explicit **Human Recruiter Decision Actions** (*Advance*, *Needs Review*, *Reject*).
- `ScreeningStatusBadge`: Standardized outcome terminology (`Qualified`, `Needs Review`, `Not Qualified`, `Calling`, `Completed`, `Failed`, `No Answer`).
