import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Candidate } from '@/types';

function sanitizeString(input: string): string {
  if (!input) return '';
  let sanitized = String(input).trim();
  // Strip formula injection prefixes for CSV exports (=, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(sanitized)) {
    sanitized = "'" + sanitized;
  }
  return sanitized.replace(/<[^>]*>?/gm, ''); // Strip direct HTML tags
}

function normalizePhone(phone: string): string {
  if (!phone) return '+628120000000';
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  const status = searchParams.get('status');

  const db = readDb();
  let list = db.candidates;

  if (jobId) {
    list = list.filter((c) => c.jobId === jobId);
  }
  if (status) {
    list = list.filter((c) => c.status === status);
  }

  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    if (Array.isArray(body)) {
      const createdList: Candidate[] = body.map((item, idx) => ({
        id: `cand_${Date.now()}_${idx}`,
        jobId: item.jobId || (db.jobs[0]?.id ?? 'job_default'),
        name: sanitizeString(item.name) || 'Candidate',
        phone: normalizePhone(item.phone),
        email: sanitizeString(item.email) || '',
        position: sanitizeString(item.position) || (db.jobs[0]?.title ?? 'Frontline Staff'),
        location: sanitizeString(item.location) || 'Indonesia',
        experience: sanitizeString(item.experience) || 'Belum ada data',
        status: 'ready',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      db.candidates.unshift(...createdList);
      writeDb(db);
      return NextResponse.json(createdList, { status: 201 });
    }

    const newCandidate: Candidate = {
      id: `cand_${Date.now()}`,
      jobId: body.jobId || (db.jobs[0]?.id ?? 'job_default'),
      name: sanitizeString(body.name) || 'Candidate',
      phone: normalizePhone(body.phone),
      email: sanitizeString(body.email) || '',
      position: sanitizeString(body.position) || (db.jobs[0]?.title ?? 'Frontline Staff'),
      location: sanitizeString(body.location) || 'Indonesia',
      experience: sanitizeString(body.experience) || 'Belum ada data',
      notes: sanitizeString(body.notes) || '',
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.candidates.unshift(newCandidate);
    writeDb(db);
    return NextResponse.json(newCandidate, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to process candidate payload' }, { status: 400 });
  }
}
