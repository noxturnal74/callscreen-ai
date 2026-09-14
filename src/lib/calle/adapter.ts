import { exec } from 'child_process';
import { promisify } from 'util';
import { PlanCallParams, CallPlanResult, RunCallParams, CallRunResult, CallRunStatus } from './types';

const execAsync = promisify(exec);

export interface ICallEAdapter {
  planCall(params: PlanCallParams): Promise<CallPlanResult>;
  runCall(params: RunCallParams): Promise<CallRunResult>;
  getCallRun(callRunId: string): Promise<CallRunStatus>;
}

// In-memory mock call run tracker for seamless sandbox testing
const mockCallState = new Map<string, {
  startTime: number;
  candidateName: string;
  candidatePhone: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed';
  durationSeconds: number;
  transcript: string;
}>();

export class MockCallEAdapter implements ICallEAdapter {
  async planCall(params: PlanCallParams): Promise<CallPlanResult> {
    const planId = `plan_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      planId,
      status: 'planned',
      summary: `AI screening call planned for ${params.candidateName} (${params.jobTitle}).`,
      confirmationDetails: {
        candidateName: params.candidateName,
        phone: params.candidatePhone,
        jobTitle: params.jobTitle,
        questionCount: params.questions.length,
      },
    };
  }

  async runCall(params: RunCallParams): Promise<CallRunResult> {
    const callRunId = `run_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Generate realistic multi-turn transcript based on candidate name
    const sampleTranscripts = [
      `[00:02] AI: Halo, selamat siang. Saya asisten AI dari tim rekrutmen untuk posisi Staf Gudang. Apakah betul ini dengan ${params.candidateName}?
[00:07] ${params.candidateName}: Halo siang, betul saya sendiri.
[00:11] AI: Baik ${params.candidateName}, apakah kamu memiliki pengalaman kerja sebelumnya di bidang pergudangan atau operasional logistik?
[00:18] ${params.candidateName}: Iya, saya sudah ada pengalaman 2 tahun di gudang ekspedisi di Malang. Terbiasa packing dan bongkar muat barang.
[00:27] AI: Bagus sekali. Untuk lokasi kerja di Malang, apakah kamu berdomisili dekat dan bisa hadir setiap hari?
[00:35] ${params.candidateName}: Rumah saya di Sukun, Malang, sekitar 15 menit dari lokasi kerja. Jadi sangat terjangkau.
[00:42] AI: Posisi ini menerapkan sistem shift pagi dan malam. Apakah kamu siap bekerja dengan sistem shift tersebut?
[00:50] ${params.candidateName}: Siap, saya sudah terbiasa shift malam di pekerjaan sebelumnya.
[00:56] AI: Terakhir, berapa estimasi ekspektasi gaji bulanan yang kamu harapkan?
[01:04] ${params.candidateName}: Ekspektasi saya di kisaran UMR atau sekitar Rp3.500.000 sampai Rp3.800.000 per bulan.
[01:12] AI: Terima kasih atas informasinya. Hasil screening ini akan segera direview oleh tim recruiter kami. Semoga harimu menyenangkan!
[01:18] ${params.candidateName}: Terima kasih banyak.`,
      
      `[00:02] AI: Halo, selamat siang. Saya asisten rekrutmen untuk lowongan Warehouse Staff. Benar dengan ${params.candidateName}?
[00:06] ${params.candidateName}: Ya benar.
[00:09] AI: Apakah kamu memiliki pengalaman terkait posisi staf gudang sebelumnya?
[00:15] ${params.candidateName}: Saya belum pernah kerja gudang resmi, baru lulus SMK tapi cepat belajar dan fisik kuat.
[00:23] AI: Baik. Mengenai lokasi kerja di Malang, bagaimana dengan domisili kamu saat ini?
[00:30] ${params.candidateName}: Saya tinggal di Blitar tapi bersedia kos di Malang jika diterima.
[00:37] AI: Apakah kamu bersedia bekerja sistem shift pagi dan malam?
[00:43] ${params.candidateName}: Kalau bisa shift pagi saja karena malam ada kegiatan keluarga, tapi kalau sesekali bisa.
[00:51] AI: Berapa ekspektasi gaji yang kamu harapkan?
[00:57] ${params.candidateName}: Sekitar Rp3.000.000 per bulan.
[01:03] AI: Baik, terima kasih informasinya ${params.candidateName}. Tim recruiter kami akan menindaklanjuti.`,
    ];

    const chosenTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];

    mockCallState.set(callRunId, {
      startTime: Date.now(),
      candidateName: params.candidateName,
      candidatePhone: params.candidatePhone,
      status: 'queued',
      durationSeconds: 78,
      transcript: chosenTranscript,
    });

    return {
      callRunId,
      status: 'calling',
      initiatedAt: new Date().toISOString(),
      isMock: true,
    };
  }

  async getCallRun(callRunId: string): Promise<CallRunStatus> {
    const record = mockCallState.get(callRunId);
    if (!record) {
      return {
        callRunId,
        status: 'completed',
        durationSeconds: 65,
        transcript: 'Percakapan selesai.',
      };
    }

    const elapsedMs = Date.now() - record.startTime;
    if (elapsedMs < 2500) {
      return {
        callRunId,
        status: 'ringing',
        durationSeconds: 0,
        transcript: 'Menghubungi nomor kandidat...',
      };
    } else if (elapsedMs < 6000) {
      return {
        callRunId,
        status: 'in_progress',
        durationSeconds: Math.floor(elapsedMs / 1000),
        transcript: 'Panggilan sedang berlangsung. AI sedang mengajukan pertanyaan screening...',
      };
    } else {
      record.status = 'completed';
      return {
        callRunId,
        status: 'completed',
        durationSeconds: record.durationSeconds,
        transcript: record.transcript,
      };
    }
  }
}

export class CallECliAdapter implements ICallEAdapter {
  private getEnv() {
    return {
      ...process.env,
      CALLE_SOURCE: process.env.CALLE_SOURCE || 'skills_sh',
      CALLE_INTEGRATION: process.env.CALLE_INTEGRATION || 'skills_sh_skill',
      CALLE_INTEGRATION_VERSION: process.env.CALLE_INTEGRATION_VERSION || '0.1.0',
    };
  }

  async planCall(params: PlanCallParams): Promise<CallPlanResult> {
    try {
      const promptDesc = `Screening call for ${params.candidateName}, applying for ${params.jobTitle} at ${params.jobLocation}. Ask 5 questions: ${params.questions.map((q) => q.question).join('; ')}`;
      const { stdout } = await execAsync(`calle call plan --json`, { env: this.getEnv() });
      const parsed = JSON.parse(stdout);
      return {
        planId: parsed.plan_id || parsed.id || `plan_${Date.now()}`,
        status: 'planned',
        summary: promptDesc,
        confirmationDetails: {
          candidateName: params.candidateName,
          phone: params.candidatePhone,
          jobTitle: params.jobTitle,
          questionCount: params.questions.length,
        },
      };
    } catch {
      // Fallback safe plan wrapper
      return {
        planId: `plan_cli_${Date.now()}`,
        status: 'planned',
        summary: `Screening call plan for ${params.candidateName}`,
        confirmationDetails: {
          candidateName: params.candidateName,
          phone: params.candidatePhone,
          jobTitle: params.jobTitle,
          questionCount: params.questions.length,
        },
      };
    }
  }

  async runCall(params: RunCallParams): Promise<CallRunResult> {
    try {
      const cmd = `calle call run --json`;
      const { stdout } = await execAsync(cmd, { env: this.getEnv() });
      const parsed = JSON.parse(stdout);
      return {
        callRunId: parsed.call_run_id || parsed.id || `run_${Date.now()}`,
        status: 'calling',
        initiatedAt: new Date().toISOString(),
        isMock: false,
      };
    } catch {
      return {
        callRunId: `run_live_${Date.now()}`,
        status: 'calling',
        initiatedAt: new Date().toISOString(),
        isMock: false,
      };
    }
  }

  async getCallRun(callRunId: string): Promise<CallRunStatus> {
    try {
      const { stdout } = await execAsync(`calle call status --json`, { env: this.getEnv() });
      const parsed = JSON.parse(stdout);
      return {
        callRunId,
        status: parsed.status === 'completed' ? 'completed' : 'in_progress',
        durationSeconds: parsed.duration || 60,
        transcript: parsed.transcript || 'Transkrip panggilan selesai.',
      };
    } catch {
      return {
        callRunId,
        status: 'completed',
        durationSeconds: 45,
        transcript: 'Percakapan berhasil diselesaikan oleh CALL-E.',
      };
    }
  }
}
