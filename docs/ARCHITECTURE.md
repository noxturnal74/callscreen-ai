# Technical Architecture
## CallScreen AI (HireCall)

### 1. System Overview
CallScreen AI is structured as a full-stack Next.js application with modular backend services and an isolated CALL-E adapter layer.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Web App                        │
│   (Next.js App Router / React / Tailwind CSS / Radix UI)   │
└──────────────┬───────────────────────────────▲──────────────┘
               │ HTTP Requests                 │ Polling / SSE
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API Layer                      │
│      (/api/jobs, /api/candidates, /api/calls, /api/mcp)     │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
               ▼                               │
┌──────────────────────────────┐ ┌─────────────┴──────────────┐
│       Core App Services      │ │      Data Store / DB       │
│  - CandidateService          │ │  - SQLite / Prisma / Memory│
│  - JobService                │ │  - Candidate Records       │
│  - ExtractionService (LLM)   │ │  - Call Logs & Transcripts │
└──────────────┬───────────────┘ └────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    CallEService Adapter                     │
│  - planScreeningCall()                                      │
│  - runScreeningCall()                                       │
│  - getCallResult()                                          │
│  - Mode: Live (CLI/MCP/API) vs Mock (Sandbox)               │
└──────────────┬───────────────────────────────▲──────────────┘
               │ CLI Execution / IPC           │ Results & Transcript
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                        CALL-E Engine                        │
│       (@call-e/cli / CALL-E MCP Server / Skills.sh)         │
│  - Real Outbound PSTN Telephony & Speech Agent              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Key Architecture Components

#### A. Presentation Layer (Frontend)
- **Job Dashboard**: Job listing, status toggles, screening question customization.
- **Candidate Queue**: Roster management with inline status badges, phone verification, and screening triggers.
- **Pre-Dial Safety Modal**: Pre-flight verification showing recipient phone, job title, and script intent.
- **Candidate Detail & Audit View**: Real-time transcript viewer and extracted evaluation scorecard.

#### B. API & Business Logic Layer (Backend)
- **JobService**: Handles job specifications and 5-stage screening prompt template generation.
- **CandidateService**: Ingests candidate batches, normalizes phone numbers (E.164 format), and tracks call lifecycle states.
- **ExtractionService**: Ingests raw conversation transcripts and extracts structured fields (Name/Role confirmation, Experience, Location/Commute, Availability, Salary) with fallbacks.

#### C. CALL-E Integration Layer (`CallEService`)
- Strict decoupling interface:
  ```typescript
  export interface ICallEService {
    planCall(params: PlanCallParams): Promise<CallPlanResult>;
    runCall(params: RunCallParams): Promise<CallRunResult>;
    getCallRun(callRunId: string): Promise<CallRunStatus>;
  }
  ```
- **Live Provider (`CallECliAdapter` / `CallEMcpAdapter`)**: Dispatches commands to CALL-E via CLI sub-processes or MCP endpoints.
- **Mock Provider (`MockCallEAdapter`)**: Deterministic local simulator for testing UI, extraction, and error handling without making real outbound phone calls.

### 3. Data Flow & Call Lifecycle
1. **Trigger**: Recruiter triggers a call via `POST /api/calls/start`.
2. **Plan**: `CallEService.planCall` compiles prompt context, applicant details, and screening questionnaire.
3. **Execute**: `CallEService.runCall` dispatches the call run; candidate status transitions from `pending` -> `queued` -> `calling`.
4. **Monitor**: Frontend/backend polls `CallEService.getCallRun(callRunId)` until call completes or terminates.
5. **Extract**: On completion, `ExtractionService` parses transcript into structured fields.
6. **Store & Display**: Candidate record updated to `completed`; transcript and scorecard persisted and rendered on dashboard.

### 4. Safety & Fail-Safe Mechanisms
- Phone number normalization (E.164 standard) to prevent malformed dialing.
- Explicit recruiter confirmation modal to prevent accidental real calls.
- `CALLE_MOCK_MODE=true` default setting during development/testing.
