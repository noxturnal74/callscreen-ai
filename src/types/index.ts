export type CandidateStatus = 'ready' | 'queued' | 'calling' | 'completed' | 'not_answered' | 'failed';
export type ScreeningOutcome = 'Qualified' | 'Needs Review' | 'Not Qualified' | 'Incomplete';

export interface ScreeningQuestion {
  id: string;
  order: number;
  question: string;
  key: 'name_role' | 'experience' | 'location' | 'shift' | 'salary';
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  shift: string;
  salaryRange: string;
  experienceRequired: string;
  additionalRequirements?: string;
  questions: ScreeningQuestion[];
  createdAt: string;
}

export interface StructuredScreeningResult {
  candidate_name: string;
  position: string;
  experience: string;
  location: string;
  availability: string;
  salary_expectation: string;
  screening_status: 'qualified' | 'needs_review' | 'not_qualified' | 'incomplete';
  reason: string;
  follow_up_needed: boolean;
  summary: string;
}

export interface ExtractedCriteria {
  confirmedNameAndRole: boolean;
  experienceSummary: string;
  experienceMatch: boolean;
  locationSummary: string;
  commuteMatch: boolean;
  shiftSummary: string;
  shiftMatch: boolean;
  salaryExpectation: string;
  salaryMatch: boolean;
  overallSummary: string;
}

export interface ScreeningResult {
  id: string;
  candidateId: string;
  jobId: string;
  callRunId: string;
  outcome: ScreeningOutcome;
  durationSeconds: number;
  structured: StructuredScreeningResult;
  extractedCriteria: ExtractedCriteria;
  transcript: string;
  audioUrl?: string;
  completedAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  phone: string;
  email?: string;
  position: string;
  location?: string;
  experience?: string;
  notes?: string;
  status: CandidateStatus;
  callRunId?: string;
  screeningResult?: ScreeningResult;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  calleMode: 'mock' | 'live';
  source: string;
  integration: string;
  integrationVersion: string;
  defaultPhoneCountry: string;
}
