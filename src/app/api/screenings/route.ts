import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  const db = readDb();
  let list = db.screenings;

  if (jobId) {
    list = list.filter((s) => s.jobId === jobId);
  }

  return NextResponse.json(list);
}
