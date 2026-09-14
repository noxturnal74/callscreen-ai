import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = readDb();
  const job = db.jobs.find((j) => j.id === params.id);
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = readDb();
  const idx = db.jobs.findIndex((j) => j.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  db.jobs[idx] = { ...db.jobs[idx], ...body };
  writeDb(db);
  return NextResponse.json(db.jobs[idx]);
}
