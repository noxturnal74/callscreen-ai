import { ICallEAdapter, MockCallEAdapter, CallECliAdapter } from './adapter';
import { PlanCallParams, CallPlanResult, RunCallParams, CallRunResult, CallRunStatus } from './types';

class CallEService {
  private mockAdapter: ICallEAdapter = new MockCallEAdapter();
  private liveAdapter: ICallEAdapter = new CallECliAdapter();

  private isMockMode(): boolean {
    const envVal = process.env.CALLE_MOCK_MODE;
    if (envVal === 'false') return false;
    return true; // Default to safe mock sandbox
  }

  private getAdapter(): ICallEAdapter {
    return this.isMockMode() ? this.mockAdapter : this.liveAdapter;
  }

  async planScreeningCall(params: PlanCallParams): Promise<CallPlanResult> {
    return this.getAdapter().planCall(params);
  }

  async startScreeningCall(params: RunCallParams): Promise<CallRunResult> {
    return this.getAdapter().runCall(params);
  }

  async runScreeningCall(params: RunCallParams): Promise<CallRunResult> {
    return this.getAdapter().runCall(params);
  }

  async getScreeningCall(callRunId: string): Promise<CallRunStatus> {
    return this.getAdapter().getCallRun(callRunId);
  }

  async getCallResult(callRunId: string): Promise<CallRunStatus> {
    return this.getAdapter().getCallRun(callRunId);
  }

  async getScreeningResult(callRunId: string): Promise<CallRunStatus> {
    return this.getAdapter().getCallRun(callRunId);
  }

  async retryScreeningCall(params: RunCallParams): Promise<CallRunResult> {
    return this.getAdapter().runCall(params);
  }
}

export const callEService = new CallEService();
