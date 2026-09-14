import { ExtractedCriteria, ScreeningOutcome, StructuredScreeningResult, Job } from '@/types';

export class ExtractionService {
  /**
   * Parses a conversation transcript and produces deterministic structured screening output.
   */
  static extractFromTranscript(
    transcript: string,
    candidate: { name: string; position: string },
    job?: Job
  ): {
    outcome: ScreeningOutcome;
    structured: StructuredScreeningResult;
    extractedCriteria: ExtractedCriteria;
  } {
    const lower = transcript.toLowerCase();

    // 1. Name & Role check
    const nameMatch =
      lower.includes('ya') ||
      lower.includes('benar') ||
      lower.includes('betul') ||
      lower.includes('yes') ||
      lower.includes('saya') ||
      lower.includes(candidate.name.toLowerCase().split(' ')[0]);

    // 2. Experience check
    let experienceMatch = false;
    let experienceSummary = 'unknown';
    if (
      lower.includes('tahun') ||
      lower.includes('pengalaman') ||
      lower.includes('pernah kerja') ||
      lower.includes('gudang') ||
      lower.includes('operator') ||
      lower.includes('packing')
    ) {
      experienceMatch = true;
      if (lower.includes('2 tahun') || lower.includes('dua tahun') || lower.includes('3 tahun') || lower.includes('tiga tahun')) {
        experienceSummary = '2+ tahun operasional pergudangan & packing';
      } else if (lower.includes('1 tahun') || lower.includes('satu tahun')) {
        experienceSummary = '1 tahun staf logistik/distribusi';
      } else {
        experienceSummary = 'Pernah bekerja di posisi operasional sejenis';
      }
    } else if (lower.includes('fresh') || lower.includes('lulusan baru') || lower.includes('belum pernah')) {
      experienceSummary = 'Fresh graduate / tanpa pengalaman langsung';
      experienceMatch = job ? job.experienceRequired.includes('0') : true;
    }

    // 3. Location / Commute check
    let commuteMatch = false;
    let locationSummary = 'unknown';
    const targetLoc = job?.location.toLowerCase() || 'malang';
    if (
      lower.includes(targetLoc) ||
      lower.includes('dekat') ||
      lower.includes('bisa hadir') ||
      lower.includes('bisa ke lokasi') ||
      lower.includes('menit')
    ) {
      commuteMatch = true;
      locationSummary = `Domisili cocok / dekat area ${job?.location || 'kerja'}`;
    } else if (
      lower.includes('luar kota') ||
      lower.includes('jauh') ||
      lower.includes('surabaya') ||
      lower.includes('jakarta')
    ) {
      commuteMatch = false;
      locationSummary = 'Domisili luar kota / jarak tempuh signifikan';
    } else {
      commuteMatch = true;
      locationSummary = 'Bersedia datang ke lokasi kerja';
    }

    // 4. Shift check
    let shiftMatch = false;
    let shiftSummary = 'unknown';
    if (
      lower.includes('bisa shift') ||
      lower.includes('siap') ||
      lower.includes('pagi') ||
      lower.includes('malam') ||
      lower.includes('bersedia')
    ) {
      shiftMatch = true;
      shiftSummary = 'Siap bekerja sistem shift pagi dan malam';
    } else if (
      lower.includes('tidak bisa shift') ||
      lower.includes('hanya pagi') ||
      lower.includes('tidak bisa malam')
    ) {
      shiftMatch = false;
      shiftSummary = 'Hanya bisa shift pagi / tidak bisa shift malam';
    }

    // 5. Salary check
    let salaryMatch = true;
    let salaryExpectation = 'unknown';
    if (lower.includes('juta') || lower.includes('rp') || lower.includes('000') || lower.includes('umr')) {
      if (lower.includes('5.5') || lower.includes('5 juta') || lower.includes('6 juta') || lower.includes('7 juta')) {
        salaryExpectation = 'Rp5.000.000 - Rp6.000.000';
        salaryMatch = false;
      } else if (lower.includes('3') || lower.includes('3.5') || lower.includes('3.8') || lower.includes('4') || lower.includes('umr')) {
        salaryExpectation = 'Rp3.200.000 - Rp3.800.000';
        salaryMatch = true;
      } else {
        salaryExpectation = 'Kisaran standar UMR wilayah';
      }
    }

    // Determine classification
    const matches = [experienceMatch, commuteMatch, shiftMatch, salaryMatch].filter(Boolean).length;

    let outcome: ScreeningOutcome = 'Not Qualified';
    let structuredStatus: StructuredScreeningResult['screening_status'] = 'not_qualified';
    let reason = '';

    if (transcript.length < 40 || !nameMatch) {
      outcome = 'Incomplete';
      structuredStatus = 'incomplete';
      reason = 'Percakapan terputus sebelum semua pertanyaan screening terjawab.';
    } else if (matches >= 3 && commuteMatch && shiftMatch) {
      outcome = 'Qualified';
      structuredStatus = 'qualified';
      reason = 'Kandidat memenuhi kriteria pengalaman, domisili dekat, siap shift, dan ekspektasi gaji sesuai anggaran.';
    } else if (matches >= 2) {
      outcome = 'Needs Review';
      structuredStatus = 'needs_review';
      reason = 'Kandidat potensial namun terdapat kriteria yang perlu dikonfirmasi rekruter (misal: shift/gaji).';
    } else {
      outcome = 'Not Qualified';
      structuredStatus = 'not_qualified';
      reason = 'Kandidat tidak memenuhi prasyarat dasar posisi (jarak domisili atau kendala jadwal shift).';
    }

    const summary = `Screening posisi ${candidate.position}: ${candidate.name} ${outcome === 'Qualified' ? 'memenuhi seluruh' : outcome === 'Needs Review' ? 'memenuhi sebagian' : 'tidak memenuhi'} kriteria. Pengalaman: ${experienceSummary}. Domisili: ${locationSummary}. Shift: ${shiftSummary}. Gaji: ${salaryExpectation}.`;

    return {
      outcome,
      structured: {
        candidate_name: candidate.name,
        position: candidate.position,
        experience: experienceSummary,
        location: locationSummary,
        availability: shiftSummary,
        salary_expectation: salaryExpectation,
        screening_status: structuredStatus,
        reason,
        follow_up_needed: structuredStatus === 'qualified' || structuredStatus === 'needs_review',
        summary,
      },
      extractedCriteria: {
        confirmedNameAndRole: nameMatch,
        experienceSummary,
        experienceMatch,
        locationSummary,
        commuteMatch,
        shiftSummary,
        shiftMatch,
        salaryExpectation,
        salaryMatch,
        overallSummary: summary,
      },
    };
  }
}
