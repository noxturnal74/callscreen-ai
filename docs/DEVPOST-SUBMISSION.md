# CALL-E Hackathon — Devpost Submission Content
## Project Name: CallScreen AI
### Tagline:
Autonomous AI phone screening layer for high-volume frontline recruitment powered by CALL-E.

---

### 👤 Submitter Info
- **Name**: Albert William Saputra SAPUTRA
- **Devpost Username**: `albertwilliamsaputra`
- **CALL-E Account Email**: `albertwilliamsaputra@gmail.com`
- **Location**: Malang, East Java, Indonesia

---

### 💡 Inspiration
High-volume frontline recruitment (warehousing, retail, logistics, hospitality) is overwhelmed by hundreds of applicants. Recruiters spend over 60% of their day stuck in repetitive outbound phone calls just to check basic qualification criteria: shift availability, commute feasibility, experience, and salary expectations. We built **CallScreen AI** to automate repetitive first-round voice phone screening while preserving the human recruiter's authority as the ultimate decision maker.

---

### 🚀 What it does
- **Autonomous Outbound Phone Screening**: Uses **CALL-E** voice agents to place real PSTN phone calls to job applicants.
- **Natural 2-Way Voice Conversations**: Converses naturally in spoken Indonesian/English to verify 5 core qualification dimensions:
  1. Identity and role confirmation
  2. Relevant work experience
  3. Location and commute feasibility
  4. Morning/night shift availability
  5. Salary expectation alignment
- **Instant Structured Scorecards**: Converts verbatim call transcripts into deterministic evidence scorecards (`Qualified Fit`, `Maybe / Negotiable`, `Not Fit`).
- **Human Decision Layer**: Empowers recruiters with clear evidence cards, transcript audit trails, and one-click next-step actions (*"Advance to Interview"*, *"Keep as Backup"*, *"Pass"*).
- **Safety Pre-Flight Modal**: Verifies recipient phone numbers and script intent prior to outbound dialing to prevent unintended calls.
- **Dual Telephony Mode**: Seamlessly switches between **Live Outbound PSTN** (via `@call-e/cli`) and **Sandbox Simulator Mode**.

---

### 🛠️ How we built it
- **Full-Stack Framework**: Next.js 14 (App Router, TypeScript) with modern Tailwind CSS and Lucide Icons.
- **Telephony & Voice Engine**: Integrated directly with `@call-e/cli` and CALL-E MCP/Skills.sh tooling (`plan_call`, `run_call`, `get_call_run`).
- **Data Persistence**: File-backed `.data/db.json` store with instant deterministic seed generation for 50 Indonesian applicants.
- **Extraction Engine**: Deterministic parser mapping conversational speech into structured JSON criteria.

---

### 🧗 Challenges we ran into
- Handling asynchronous PSTN call lifecycle states (`queued`, `ringing`, `in_progress`, `completed`) while streaming real-time status updates to the UI.
- Structuring natural conversational speech transcripts into strict, deterministic qualification criteria without LLM hallucination.
- Designing an intuitive "human-in-the-loop" interface that prevents discriminatory automated rejections.

---

### 🏆 Accomplishments that we're proud of
- Created an end-to-end working loop: **Candidate Queue → CALL-E Real Phone Call → Verbatim Transcript → Structured Scorecard → Recruiter Review**.
- Built an evidence-based "Why This Candidate?" rationale panel that highlights exact spoken candidate statements.
- Developed zero-dependency local sandbox and production builds that compile cleanly with 0 TypeScript errors.

---

### 📚 What we learned
- How to harness CALL-E CLI and MCP tools for reliable programmatic PSTN telephony.
- Best practices in prompt engineering for voice agents where brevity and clear question pacing are critical.

---

### 🔮 What's next for CallScreen AI
- Multi-language voice screening support (Javanese, Sundanese, Hindi, Spanish).
- Automated SMS calendar booking for qualified candidates to schedule on-site interviews.
- Direct ATS connectors (Workday, Greenhouse, BambooHR).

---

### 🔗 Submission Links
- **GitHub Repository**: https://github.com/albertwilliamsaputra/callscreen-ai
- **Awesome Phone Call Agents PR**: https://github.com/CALLE-AI/awesome-phone-call-agents/pulls
- **Demo Video**: [Upload 3-min video to YouTube / Vimeo and paste link here]
- **CALL-E Registered Email**: `albertwilliamsaputra@gmail.com`
