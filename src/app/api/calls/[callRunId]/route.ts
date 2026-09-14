import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { callEService } from '@/lib/calle/service';
import { ExtractionService } from '@/lib/calle/extractor';
import { ScreeningResult } from '@/types';

export async function GET(req: Request, { params }: { params: { callRunId: string } }) {
  try {
    const callRunId = params.callRunId;
    const db = readDb();
    const candidate = db.candidates.find((c) => c.callRunId === callRunId);

    if (!candidate) {
      return NextResponse.json({ error: 'Call run not found' }, { status: 404 });
    }

    const job = db.jobs.find((j) => j.id === candidate.jobId) || db.jobs[0];

    // Poll live/mock status from CALL-E adapter
    const callStatus = await callEService.getScreeningResult(callRunId);

    if (callStatus.status === 'completed' && candidate.status !== 'completed') {
      // Extract structured criteria
      const extraction = ExtractionService.extractFromTranscript(
        callStatus.transcript,
        { name: candidate.name, position: candidate.position },
        job
      );

      const screening: ScreeningResult = {
        id: `scr_${Date.now()}`,
        candidateId: candidate.id,
        jobId: candidate.jobId,
        callRunId,
        outcome: extraction.outcome,
        durationSeconds: callStatus.durationSeconds || 65,
        structured: extraction.structured,
        extractedCriteria: extraction.extractedCriteria,
        transcript: callStatus.transcript,
        completedAt: new Date().toISOString(),
      };

      candidate.status = 'completed';
      candidate.screeningResult = screening;
      candidate.updatedAt = new Date().toISOString();

      // Upsert into screenings table
      const existingScrIdx = db.screenings.findIndex((s) => s.callRunId === callRunId);
      if (existingScrIdx >= 0) {
        db.screenings[existingScrIdx] = screening;
      } else {
        db.screenings.unshift(screening);
      }

      writeDb(db);
    }

    return NextResponse.json({
      callRunId,
      status: callStatus.status,
      durationSeconds: callStatus.durationSeconds,
      transcript: callStatus.transcript,
      candidate,
      screeningResult: candidate.screeningResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to get call status' }, { status: 500 });
  }
}
