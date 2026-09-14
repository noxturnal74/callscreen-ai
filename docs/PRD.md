# Product Requirements Document (PRD)
## CallScreen AI (HireCall)

### 1. Executive Summary
CallScreen AI is an AI-powered voice pre-screening solution designed for high-volume frontline and blue-collar recruitment. Leveraging CALL-E voice intelligence, CallScreen AI automates repetitive outbound screening calls to applicants, verifies key qualification parameters (identity, experience, shift availability, commute feasibility, compensation expectation), and compiles structured evaluation summaries. Recruiters gain actionable applicant digests without spending hours dialing candidate queues.

### 2. Problem Statement
Recruiters and staffing agencies handling frontline positions (e.g., warehouse operators, retail staff, delivery drivers, hospitality crew) face overwhelming applicant volume. Sifting through candidates requires manual outbound phone calls to check basic prerequisites (shift hours, commute distance, availability, rate expectations). Over 60% of recruiter time is lost to phone tag, unverified contact data, and repetitive questioning.

### 3. Target Users
- Talent Acquisition specialists & recruiters in high-volume staffing
- Outsource staffing agencies
- HR operations managers in logistics, retail, hospitality, and manufacturing

### 4. User Personas
- **Primary Persona: Sarah (Frontline Staffing Recruiter)**
  - *Goal*: Screen 80 applicants for 10 warehouse roles within 48 hours.
  - *Frustration*: Spends 4–5 hours daily making manual calls; candidates don't answer or fail basic criteria on question #1.
  - *Need*: Fast, automated, empathetic voice screening that delivers structured summaries directly into her pipeline.

### 5. User Stories
- As a recruiter, I want to create job postings with specific screening criteria so candidates are vetted against relevant requirements.
- As a recruiter, I want to batch-import candidate contact details so I don't have to enter them one-by-one.
- As a recruiter, I want to review candidate phone numbers and trigger automated screening calls via CALL-E with explicit confirmation.
- As a recruiter, I want to view structured conversation results and transcripts to prioritize follow-up interviews.
- As a candidate, I want a concise, polite phone screening that respects my time and collects my answers accurately.

### 6. Goals
- Automate 100% of initial outbound phone screening calls via CALL-E.
- Deliver structured JSON summaries (experience, location, availability, salary) for every completed call.
- Provide a responsive recruiter dashboard with real-time call tracking and transcript inspectability.
- Position the AI strictly as an information-gathering screening assistant, keeping the final hiring decision with humans.

### 7. Non-Goals
- Automated hiring decisions or automated rejection letters.
- Predictive scoring of candidate personality, character, or protected traits.
- Automated deep technical or behavioral evaluations beyond configured screening questions.
- Unattended outbound cold calling without explicit recruiter review and trigger.

### 8. MVP Scope
- Job creation and criteria management (5 core screening questions).
- Candidate import (CSV / manual entry) with phone number validation (E.164).
- Safe call dispatch mechanism with confirmation dialogs.
- CALL-E integration lifecycle (`plan_call` -> `run_call` -> `get_call_run`).
- Post-call transcript extraction and structured candidate scorecard.
- Recruiter dashboard for candidate review, filtering, and audit log.

### 9. User Flow
1. **Job Setup**: Recruiter defines Job Title, Department, and screening parameters.
2. **Candidate Import**: Recruiter uploads applicant list (Name, Phone, Email, Prior Experience).
3. **Review & Pre-call**: Recruiter verifies phone numbers and reviews script parameters.
4. **Call Trigger**: Recruiter clicks "Start Screening Call" with explicit confirmation modal.
5. **CALL-E Voice Interaction**: CALL-E places outbound call, executes conversational screening script, captures responses.
6. **Processing**: System ingests call transcript/audio result from CALL-E, extracts structured data fields.
7. **Dashboard Review**: Recruiter views status, extracted answers, transcript, and decides next recruitment stage.

### 10. Functional Requirements
- **FR-1 (Job Management)**: Create, view, update job openings and customize the 5 core screening questions.
- **FR-2 (Candidate Management)**: Add individual candidates or upload CSV with bulk import validation.
- **FR-3 (Calling Safety & Controls)**: Mandatory confirmation step before initiating calls; live call status indicators (queued, in-progress, completed, failed, busy).
- **FR-4 (CALL-E Integration)**: Asynchronous dispatch and polling of CALL-E call runs.
- **FR-5 (Data Extraction)**: Parse candidate responses into structured schema (Experience Summary, Location Fit, Shift Availability, Expected Rate, Notes).
- **FR-6 (Audit Trail & Transcript)**: Store full verbatim transcript alongside extracted summary.

### 11. Non-Functional Requirements
- **NFR-1 (Security)**: All secrets and tokens stored in environment variables; zero hardcoding.
- **NFR-2 (Latency)**: Web UI updates call status within 2 seconds of state change.
- **NFR-3 (Reliability)**: Graceful handling of network timeouts, busy signals, and non-responsive lines.
- **NFR-4 (Compliance)**: Clear disclosure at call start that call is conducted by an AI assistant.

### 12. CALL-E Integration Requirements
- Utilize CALL-E CLI / MCP / SDK calling tools:
  - `plan_call`: Validate script structure, candidate details, and intent.
  - `run_call`: Initiate outbound voice call.
  - `get_call_run`: Retrieve call lifecycle status, duration, recording/transcript metadata.
- Maintain isolation via a unified `CallEService` interface for testability and mock capability.

### 13. Data Model
```typescript
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
  questions: ScreeningQuestion[];
  createdAt: string;
}

interface ScreeningQuestion {
  id: string;
  order: number;
  prompt: string;
  expectedField: 'name_role' | 'experience' | 'location' | 'availability' | 'salary';
}

interface Candidate {
  id: string;
  jobId: string;
  name: string;
  phone: string;
  email?: string;
  status: 'pending' | 'queued' | 'calling' | 'completed' | 'failed' | 'no_answer';
  callRunId?: string;
  screeningResult?: ScreeningResult;
  createdAt: string;
}

interface ScreeningResult {
  completedAt: string;
  durationSeconds: number;
  confirmedNameAndRole: boolean;
  experienceSummary: string;
  locationCommuteFit: string;
  availabilitySchedule: string;
  salaryExpectation: string;
  transcript: string;
  rawSummary: string;
}
```

### 14. API Requirements
- `POST /api/jobs`: Create job opening.
- `GET /api/jobs`: List all job openings.
- `POST /api/candidates`: Create candidate / bulk import.
- `GET /api/candidates?jobId={id}`: Fetch candidate list with screening statuses.
- `POST /api/calls/start`: Trigger screening call for candidate ID.
- `GET /api/calls/:callRunId`: Query CALL-E status and update candidate result.
- `POST /api/calls/webhook`: Ingest CALL-E completion callbacks if available.

### 15. UI Requirements
- Clean, responsive dashboard (Tailwind CSS / Next.js).
- Visual status badges (Pending, Calling, Completed, No Answer).
- Modal confirmation preview displaying candidate name, phone number, and screening objective before dialing.
- Candidate detail drawer showing transcript and structured scorecards.

### 16. Error Handling
- Invalid phone format: Highlight immediately prior to calling.
- Unanswered / Busy: Mark candidate status as `no_answer` or `failed` with retry capability.
- Call drops / timeouts: Graceful state capture without corrupted records.
- CALL-E authentication or quota errors: Surface clear operational alerts to the recruiter.

### 17. Safety & Privacy Considerations
- **Non-Discriminatory**: The AI acts purely as an interviewer/scribe and never assigns automated qualification or rejection badges.
- **Explicit Consent**: Opening prompt clearly announces: *"Hello, this is CallScreen AI calling on behalf of [Company] for the [Job Title] role..."*
- **Privacy**: PII masked where appropriate and audio data treated under strict data privacy practices.

### 18. Demo Plan
1. Recruiter logs into CallScreen AI.
2. Selects "Warehouse Associate" role with 5 preconfigured screening questions.
3. Adds demo candidate with verified phone number.
4. Confirms call modal and triggers live CALL-E call.
5. Demo phone rings, candidate answers and converses naturally with CALL-E.
6. CALL-E finishes call; dashboard updates in real-time.
7. Recruiter opens candidate drawer to review transcript and extracted responses.

### 19. Success Metrics
- 100% of planned screening runs successfully dispatched to CALL-E.
- Minimum 90% accuracy in structured field extraction from call transcripts.
- Zero unintended outbound phone calls during development and testing.
- Complete call-to-dashboard workflow latency < 5 seconds upon call completion.

### 20. Future Roadmap
- Multi-language voice screening (Spanish, Bahasa Indonesia, Hindi, Mandarin).
- Automated SMS appointment booking for candidates who pass human recruiter review.
- Direct ATS integrations (Workday, Greenhouse, BambooHR).
