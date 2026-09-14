import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { callEService } from '@/lib/calle/service';

// In-memory rate limiting tracker (max 20 calls per minute per IP / session)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(identifier: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

function normalizeAndValidatePhone(phone: string): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  // Validate E.164 length (10 to 16 characters)
  if (cleaned.length < 10 || cleaned.length > 16 || !/^\+[1-9]\d{8,14}$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

function maskPhone(phone: string): string {
  if (phone.length < 7) return '***';
  return phone.substring(0, 5) + '******' + phone.substring(phone.length - 2);
}

export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || 'local-recruiter';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before initiating more calls.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { candidateId, candidateIds } = body;

    const idsToCall: string[] = candidateIds || (candidateId ? [candidateId] : []);
    if (idsToCall.length === 0) {
      return NextResponse.json({ error: 'No candidates specified for screening' }, { status: 400 });
    }

    const db = readDb();
    const results = [];

    for (const id of idsToCall) {
      const candidate = db.candidates.find((c) => c.id === id);
      if (!candidate) continue;

      // Duplicate Call Protection Guard: Prevent triggering if already in calling state
      if (candidate.status === 'calling') {
        results.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          phone: maskPhone(candidate.phone),
          callRunId: candidate.callRunId,
          status: 'calling',
          message: 'Active call already in progress',
        });
        continue;
      }

      // Validate and sanitize phone number server-side
      const validPhone = normalizeAndValidatePhone(candidate.phone);
      if (!validPhone) {
        return NextResponse.json(
          { error: `Invalid phone format for candidate ${candidate.name}: ${candidate.phone}` },
          { status: 400 }
        );
      }
      candidate.phone = validPhone;

      const job = db.jobs.find((j) => j.id === candidate.jobId) || db.jobs[0];

      // 1. Plan call via CALL-E adapter
      const plan = await callEService.planScreeningCall({
        candidateName: candidate.name,
        candidatePhone: validPhone,
        jobTitle: job?.title || candidate.position,
        jobLocation: job?.location || 'Lokasi Kerja',
        shiftInfo: job?.shift || 'Sistem Shift',
        salaryRange: job?.salaryRange || 'Sesuai UMR',
        questions: (job?.questions || []).map((q) => ({
          order: q.order,
          question: q.question,
          key: q.key,
        })),
      });

      // 2. Start screening call execution
      const runResult = await callEService.runScreeningCall({
        planId: plan.planId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidatePhone: validPhone,
        prompt: plan.summary,
      });

      // Update candidate state in database
      candidate.status = 'calling';
      candidate.callRunId = runResult.callRunId;
      candidate.updatedAt = new Date().toISOString();

      results.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        phone: maskPhone(validPhone),
        callRunId: runResult.callRunId,
        status: runResult.status,
      });
    }

    writeDb(db);
    return NextResponse.json({ success: true, calls: results });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to initiate screening call securely.' }, { status: 500 });
  }
}
