export interface PlanCallParams {
  candidateName: string;
  candidatePhone: string;
  jobTitle: string;
  jobLocation: string;
  shiftInfo: string;
  salaryRange: string;
  questions: {
    order: number;
    question: string;
    key: string;
  }[];
}

export interface CallPlanResult {
  planId: string;
  status: 'planned' | 'failed';
  summary: string;
  confirmationDetails: {
    candidateName: string;
    phone: string;
    jobTitle: string;
    questionCount: number;
  };
}

export interface RunCallParams {
  planId?: string;
  candidateId: string;
  candidateName: string;
  candidatePhone: string;
  prompt: string;
}

export interface CallRunResult {
  callRunId: string;
  status: 'queued' | 'calling' | 'completed' | 'failed';
  initiatedAt: string;
  isMock: boolean;
}

export interface CallRunStatus {
  callRunId: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'not_answered' | 'failed';
  durationSeconds: number;
  transcript: string;
  summary?: string;
  recordingUrl?: string;
  error?: string;
}
