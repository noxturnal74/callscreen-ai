import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = readDb();
  const scr = db.screenings.find((s) => s.id === params.id || s.candidateId === params.id);
  if (!scr) return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
  return NextResponse.json(scr);
}
