/**
 * Single source of truth for public site identity, SEO, and contact.
 * Update NEXT_PUBLIC_SITE_URL after the Vercel deployment gives a domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://callscreen-ai.vercel.app';

export const SITE_NAME = 'CallScreen AI';

export const SITE_DESCRIPTION =
  'CallScreen AI menelepon kandidat frontline lewat CALL-E, memverifikasi pengalaman, domisili, shift, dan gaji, lalu mengembalikan scorecard siap putusan untuk rekruter.';

export const SITE_AUTHOR = {
  name: 'Albert William Saputra',
  email: 'albertwilliamsaputra@gmail.com',
  location: 'Malang, East Java, Indonesia',
} as const;

export const SITE_KEYWORDS = [
  'AI phone screening',
  'screening telepon AI',
  'rekrutmen frontline',
  'high-volume hiring',
  'perekrutan massal',
  'voice screening',
  'CALL-E',
  'ATS Indonesia',
  'SemartHRIS',
  'warehouse recruitment',
  'rekrutmen gudang',
  'blue-collar hiring',
  'interview telepon otomatis',
] as const;

export const CONTACT_EMAIL_HREF = `mailto:${SITE_AUTHOR.email}?subject=${encodeURIComponent(
  'Demo CallScreen AI'
)}`;
