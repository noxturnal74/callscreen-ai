import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Job } from '@/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.jobs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = readDb();

  const newJob: Job = {
    id: `job_${Date.now()}`,
    title: body.title || 'Posisi Baru',
    department: body.department || 'Operasional',
    location: body.location || 'Indonesia',
    shift: body.shift || 'Reguler / Shift',
    salaryRange: body.salaryRange || 'Sesuai UMR',
    experienceRequired: body.experienceRequired || '0-1 tahun',
    additionalRequirements: body.additionalRequirements || '',
    questions: body.questions || [],
    createdAt: new Date().toISOString(),
  };

  db.jobs.unshift(newJob);
  writeDb(db);
  return NextResponse.json(newJob, { status: 201 });
}
