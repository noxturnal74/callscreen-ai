# CallScreen AI 📞🤖
> **AI Phone Screening Layer for Frontline & High-Volume Recruitment**  
> Powered by [CALL-E](https://github.com/CALLE-AI/call-e-integrations) Voice Telephony Intelligence.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![CALL-E](https://img.shields.io/badge/CALL--E-MCP%20%2F%20CLI%20Integration-0284c7)](https://open.heycall-e.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🎯 Overview

**CallScreen AI** automates repetitive outbound first-round screening phone calls for high-volume blue-collar and frontline hiring (warehouse operators, store crew, drivers, customer service). 

Instead of recruiters spending hours manually dialing applicants to ask the same qualification questions, CallScreen AI uses **CALL-E** to conduct structured 2-way phone conversations, captures verbatim speech transcripts, and auto-extracts standardized candidate scorecards for human recruiter review.

### 🌟 Key Product Value Loop
`Candidate Queue` ➔ `CALL-E Voice Call` ➔ `Structured Scorecard Extraction` ➔ `Recruiter Decision`

---

## 🚀 Key Features

- **Autonomous Voice Screening**: Connects with candidates via outbound PSTN phone calls using CALL-E CLI/MCP tools (`plan_call`, `run_call`, `get_call_run`).
- **5 Core Frontline Dimensions**:
  1. *Name & Applied Role Confirmation*
  2. *Relevant Experience Match*
  3. *Location / Commute Feasibility*
  4. *Shift Flexibility (Morning / Night / Overtime)*
  5. *Salary Expectation Alignment*
- **Evidence-Based Candidate Scorecards**: Deterministic categorization into `Qualified Fit`, `Maybe / Negotiable`, and `Not Fit` with full transcript audit trail and "Why This Candidate?" rationale panel.
- **Human-in-the-Loop Controls**: Explicit recruiter actions (*"Advance to Interview"*, *"Keep as Backup"*, *"Pass / Not Fit"*).
- **Safety Pre-flight Confirmation**: Pre-dial review of recipient phone numbers, job role, and call objective to avoid accidental dialing.
- **Dual Telephony Mode**:
  - **Live Outbound Mode**: Places real phone calls via `@call-e/cli`.
  - **Sandbox Simulator Mode**: Interactive local mock mode with realistic speech transcripts and instant scorecard generation.
- **Plug-and-Play Architecture**: Zero external database setup required (built-in file persistence).

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons, Radix UI primitives
- **Voice Engine**: CALL-E CLI (`@call-e/cli`) / Portable Skill (`skills.sh`)
- **Intelligence**: Rule-based & LLM extraction adapter (`ExtractionService`)
- **Persistence**: File-backed JSON store with instant seed generator

```
┌─────────────────────────────────────────────────────────────┐
│                    CallScreen AI Web App                    │
│   (/dashboard, /jobs, /candidates, /screening, /settings)   │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Next.js API Routes            │ State & Transcripts
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                    CallEService Adapter                     │
│  - planScreeningCall()                                      │
│  - runScreeningCall()                                       │
│  - getCallResult()                                          │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Child Process / MCP Pipe      │ Real-time Audio Status
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                        CALL-E Engine                        │
│          (@call-e/cli / CALL-E Telephony Gateway)           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js >= 18 with `npm` and `npx`
- `@call-e/cli` installed:
  ```bash
  npm install -g @call-e/cli
  npx -y skills add https://github.com/CALLE-AI/call-e-integrations --skill calle -g
  ```

### 2. Installation & Run
```bash
git clone https://github.com/yourusername/callscreen-ai.git
cd callscreen-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 3-Minute Demo Guide

Follow the full presenter runbook in [`docs/DEMO-RUNBOOK.md`](./docs/DEMO-RUNBOOK.md):
1. **Dashboard Overview**: Open `/dashboard` to view 50 pre-seeded frontline candidates and operational funnel.
2. **Review Criteria**: Go to `/jobs/job_warehouse_malang_01` to inspect the 5 screening questions.
3. **Trigger AI Screening**: Go to `/candidates`, select a candidate, review the confirmation modal, and click **"Start AI Screening"**.
4. **Live Transcript Tracking**: Watch the real-time speech conversation unfold.
5. **Review Scorecard**: Inspect the generated scorecard (Experience, Commute, Shift, Salary) and record the human recruiter decision.

---

## 📄 Submission & Contribution

- **Target Repository**: [awesome-phone-call-agents](https://github.com/CALLE-AI/awesome-phone-call-agents)
- **Category**: `User-Facing Applications` / `Recruitment & HR Agents`

---

## 🙏 Acknowledgements

This project was developed for the **CALL-E: Your Code Is Calling Hackathon**, demonstrating how autonomous telephony agents empower high-volume recruitment workflows while keeping humans at the center of hiring decisions.
