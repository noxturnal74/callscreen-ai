# 3-Minute Hackathon Demo Runbook
## CallScreen AI: Autonomous Voice Screening for Frontline Hiring

### ⏱️ Timeline & Script

#### 1. The Hook (0:00 - 0:30)
- **Visual**: `/dashboard`
- **Narrative**:
  > "High-volume recruitment for frontline roles (warehouse staff, drivers, store crew) is overwhelmed by hundreds of applicants. Recruiters spend over 60% of their day manually calling candidates just to check basic shift availability, commute distance, and salary expectations."
  > "Meet **CallScreen AI** — an AI phone screening layer powered by CALL-E that automates repetitive phone interviews and turns conversations into structured recruiter scorecards."

#### 2. Position & Screening Criteria (0:30 - 1:00)
- **Action**: Click "Job Command Center" -> `/jobs/job_warehouse_malang_01`
- **Narrative**:
  > "Here is our Warehouse Staff position in Malang. We configured 5 core screening questions directly spoken by the AI: confirming identity, 2+ years warehouse experience, commute feasibility, morning/night shift readiness, and salary expectation."

#### 3. Triggering AI Voice Screening (1:00 - 1:45)
- **Action**: Select a candidate in queue, click **"Start AI Screening"**.
- **Visual**: Safety Pre-Flight Confirmation Modal opens.
- **Narrative**:
  > "Before any call is made, our safety layer verifies candidate phone numbers and intent. Clicking 'Launch Now' initiates the CALL-E voice agent."

#### 4. Live Call & Speech Stream (1:45 - 2:20)
- **Visual**: Live Call Tracker with streaming dialogue.
- **Narrative**:
  > "CALL-E dials the candidate's phone number and conducts a natural 2-way conversation in Indonesian. It confirms their experience, verifies shift flexibility, and records spoken answers without rigid DTMF keypad menus."

#### 5. Scorecard & Recruiter Decision (2:20 - 3:00)
- **Visual**: Open Candidate Scorecard (`/candidates/cand_1`).
- **Narrative**:
  > "Immediately after the call ends, CallScreen AI parses the conversation into an evidence-based scorecard: Experience confirmed, Commute feasible, Shift ready, Salary in budget. Outcome: **Qualified Fit**."
  > "The AI assists with first-round screening, but the human recruiter makes the final hire."
