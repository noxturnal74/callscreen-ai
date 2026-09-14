import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.settings || {
    calleMode: 'mock',
    source: 'skills_sh',
    integration: 'skills_sh_skill',
    integrationVersion: '0.1.0',
    defaultPhoneCountry: '+62',
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = readDb();
  db.settings = { ...db.settings, ...body };
  writeDb(db);
  return NextResponse.json(db.settings);
}
