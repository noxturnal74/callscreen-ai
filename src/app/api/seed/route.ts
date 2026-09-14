import { NextResponse } from 'next/server';
import { generateSeedData, writeDb } from '@/lib/db';

export async function POST() {
  const seed = generateSeedData();
  writeDb(seed);
  return NextResponse.json({
    message: 'Seed data successfully generated with 50 frontline candidates and Warehouse Staff job.',
    stats: {
      totalCandidates: seed.candidates.length,
      qualified: seed.screenings.filter((s) => s.outcome === 'Qualified').length,
      needsReview: seed.screenings.filter((s) => s.outcome === 'Needs Review').length,
      notQualified: seed.screenings.filter((s) => s.outcome === 'Not Qualified').length,
      pending: seed.candidates.filter((c) => c.status === 'ready').length,
    },
  });
}
