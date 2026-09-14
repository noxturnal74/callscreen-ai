import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = readDb();
  const cand = db.candidates.find((c) => c.id === params.id);
  if (!cand) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  return NextResponse.json(cand);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = readDb();
  const idx = db.candidates.findIndex((c) => c.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

  db.candidates[idx] = {
    ...db.candidates[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return NextResponse.json(db.candidates[idx]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const db = readDb();
  db.candidates = db.candidates.filter((c) => c.id !== params.id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
