# CALL-E Integration Guide & Specification
## CallScreen AI (HireCall)

### 1. Overview
CALL-E provides autonomous two-way voice calling over PSTN telephony. CallScreen AI connects to CALL-E to execute structured candidate pre-screening conversations and extract conversation transcripts.

### 2. Supported Primitives & Tool Interfaces
The integration adheres to CALL-E's core tools:

1. **`plan_call`**: Pre-computes the conversation plan and conversational parameters based on candidate info and screening questions.
2. **`run_call`**: Initiates the live outbound phone call to the target phone number using the planned configuration.
3. **`get_call_run`**: Retrieves status (`queued`, `ringing`, `in-progress`, `completed`, `failed`), duration, transcript, and output payloads.

### 3. Installation & Authentication Lifecycle

#### Prerequisites
- Node.js >= 18 with `npm` and `npx`.
- Active CALL-E account.

#### Step 1: Install Portable Skill
```bash
npx -y skills add https://github.com/CALLE-AI/call-e-integrations --skill calle -g
```

#### Step 2: Install CALL-E CLI
```bash
npm install -g @call-e/cli
```

#### Step 3: CLI Help & Verification
```bash
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle --help
```

#### Step 4: Authentication
Browser-based login:
```bash
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle auth login
```
Headless/agent login (start and complete):
```bash
# Generate link without opening browser automatically
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle auth login --start-only --no-browser-open

# Confirm login after authorising in browser
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle auth login --no-browser-open
```

#### Step 5: Verification
```bash
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle auth status
env CALLE_SOURCE=skills_sh CALLE_INTEGRATION=skills_sh_skill CALLE_INTEGRATION_VERSION=0.1.0 calle mcp tools
```

### 4. Adapter Architecture (`CallEService`)
To ensure safety, testability, and stability, CallScreen AI isolates CALL-E into `CallEService`:
- When `CALLE_MOCK_MODE=true`, `MockCallEAdapter` simulates realistic call lifecycles, latency, and sample transcripts for safe testing.
- When `CALLE_MOCK_MODE=false`, `CallECliAdapter` executes live CLI/MCP calls with telemetry headers (`CALLE_SOURCE=skills_sh`).

### 5. Awesome-Phone-Call-Agents Contribution
In accordance with https://github.com/CALLE-AI/awesome-phone-call-agents, this project fits into:
- **Category**: **User-Facing Applications / Recruitment Workflow Agent**
- **Contribution Artifacts**:
  - Standalone web application & agent package.
  - Reusable screening skill definition (`screening-agent`).
  - Standardized JSON input/output schemas for pre-screening workflows.
