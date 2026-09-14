# CallScreen AI - Architecture & Rework Plan
## From Generic ATS to Frontline AI Phone Screening Agent

### 1. Architectural Strategy
We construct CallScreen AI directly centered around the core value loop:
**CANDIDATE LIST → CALL-E OUTBOUND CALL → STRUCTURED EXTRACTION → HUMAN DECISION**

### 2. Information Architecture
- `/dashboard`: High-impact recruiter dashboard showing screening throughput (Total Candidates, Pending Screening, Calls Completed, Qualified, Maybe, Not Fit) and recent AI calls.
- `/jobs` & `/jobs/[id]`: Frontline job posting manager with customizable 5-stage screening questions.
- `/candidates` & `/candidates/[id]`: Candidate queue with bulk CSV import, phone number format verification (+62 / E.164), and status tracking.
- `/screening` & `/screening/[id]`: The central command center for launching AI screening runs (single & batch), monitoring live calling status, inspecting transcripts, and reviewing AI scorecards.
- `/settings`: CALL-E configuration, mode toggle (Mock vs Live PSTN Calling), and API health checks.

### 3. Key Components & Services
1. **`CallEService`**:
   - `CallECliAdapter`: Interfaces directly with `@call-e/cli` (`calle call plan`, `calle call run`, `calle call status`).
   - `MockCallEAdapter`: High-fidelity sandbox generating realistic conversational transcripts and timing for instant demoing.
2. **`ExtractionService`**:
   - Parses conversation transcripts into 5 core frontline evaluation dimensions:
     1. Name & Role Confirmation
     2. Experience Match
     3. Location / Commute Feasibility
     4. Shift Availability
     5. Salary Expectation Alignment
   - Assigns unbiased recruiter recommendations: `Qualified`, `Maybe`, `Not Fit`, `Incomplete`.
3. **Data Storage**:
   - File-backed persistent SQLite/JSON store for jobs, candidates, call runs, and screening results.
