import fs from 'fs';
import path from 'path';
import { Job, Candidate, ScreeningResult, AppSettings } from '@/types';

interface DatabaseSchema {
  jobs: Job[];
  candidates: Candidate[];
  screenings: ScreeningResult[];
  settings: AppSettings;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    order: 1,
    question: 'Silakan perkenalkan diri dan konfirmasi posisi yang kamu lamar.',
    key: 'name_role' as const,
  },
  {
    id: 'q2',
    order: 2,
    question: 'Apakah kamu memiliki pengalaman kerja yang relevan dengan posisi ini?',
    key: 'experience' as const,
  },
  {
    id: 'q3',
    order: 3,
    question: 'Di mana lokasi domisili kamu saat ini dan bagaimana akses menuju lokasi kerja?',
    key: 'location' as const,
  },
  {
    id: 'q4',
    order: 4,
    question: 'Apakah kamu bersedia bekerja dengan sistem shift (pagi/malam)?',
    key: 'shift' as const,
  },
  {
    id: 'q5',
    order: 5,
    question: 'Berapa ekspektasi gaji bulanan yang kamu harapkan?',
    key: 'salary' as const,
  },
];

export function generateSeedData(): DatabaseSchema {
  const jobId = 'job_warehouse_malang_01';

  const defaultJob: Job = {
    id: jobId,
    title: 'Warehouse Staff',
    department: 'Logistics & Supply Chain',
    location: 'Malang, Jawa Timur',
    shift: 'Sistem Shift (Pagi 07.00-15.00 / Malam 15.00-23.00)',
    salaryRange: 'Rp3.200.000 - Rp4.000.000',
    experienceRequired: '0 - 2 tahun',
    additionalRequirements: 'Fisik prima, teliti, bersedia lembur jika diperlukan',
    questions: DEFAULT_QUESTIONS,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  };

  const indonesianNames = [
    'Andi Pratama', 'Budi Santoso', 'Siti Rahma', 'Rian Hidayat', 'Dewi Lestari',
    'Agus Setiawan', 'Bayu Nugroho', 'Nurul Aini', 'Dedi Kusuma', 'Eko Prasetyo',
    'Fajar Ramadhan', 'Gita Permata', 'Hadi Wijaya', 'Indra Gunawan', 'Joko Susilo',
    'Kartika Sari', 'Lukman Hakim', 'Mega Utami', 'Nanda Putra', 'Oki Pratama',
    'Putri Anggraini', 'Qori Iskandar', 'Rizky Firmansyah', 'Surya Saputra', 'Taufik Hidayat',
    'Umar Faruq', 'Vina Panduwinata', 'Wahyu Wibowo', 'Yudi Hermawan', 'Zainal Arifin',
    'Aditya Pratama', 'Bambang Sudiro', 'Citra Dewi', 'Dimas Anggara', 'Endang Triana',
    'Farhan Maulana', 'Gilang Ramadhan', 'Hendra Kurniawan', 'Irfan Bachdim', 'Julia Perez',
    'Kusuma Wardani', 'Latif Munandar', 'Muhamad Ilham', 'Nugraha Sanjaya', 'Panji Gumilang',
    'Rahmat Hidayatullah', 'Sandhika Galih', 'Teguh Prakoso', 'Wisnu Wardhana', 'Yoga Pratama'
  ];

  const candidates: Candidate[] = [];
  const screenings: ScreeningResult[] = [];

  indonesianNames.forEach((name, idx) => {
    const candidateId = `cand_${idx + 1}`;
    const phone = `+62812${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    let status: Candidate['status'] = 'ready';
    let outcome: ScreeningResult['outcome'] | null = null;

    if (idx < 8) {
      status = 'completed';
      outcome = 'Qualified';
    } else if (idx < 20) {
      status = 'completed';
      outcome = 'Needs Review';
    } else if (idx < 45) {
      status = 'completed';
      outcome = 'Not Qualified';
    } else {
      status = 'ready';
    }

    const candidate: Candidate = {
      id: candidateId,
      jobId,
      name,
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      position: 'Warehouse Staff',
      location: idx < 20 ? 'Malang' : (idx < 35 ? 'Surabaya / Luar Kota' : 'Kab. Malang'),
      experience: idx < 8 ? '2 tahun operator gudang' : (idx < 20 ? '1 tahun staf logistik' : 'Belum berpengalaman'),
      status,
      createdAt: new Date(Date.now() - (50 - idx) * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - (50 - idx) * 1800 * 1000).toISOString(),
    };

    if (outcome) {
      const callRunId = `run_seed_${idx + 1}`;
      candidate.callRunId = callRunId;

      const expSum = outcome === 'Qualified' ? '2 tahun operasional gudang & packing' : (outcome === 'Needs Review' ? 'Fresh graduate SMK, motivasi tinggi' : 'Pengalaman kasir minimarket');
      const locSum = outcome === 'Qualified' ? 'Lowokwaru, Malang (10 min)' : (outcome === 'Needs Review' ? 'Kabupaten Malang (35 min)' : 'Domisili Surabaya');
      const shiftSum = outcome === 'Qualified' ? 'Siap shift pagi dan malam' : (outcome === 'Needs Review' ? 'Siap shift pagi, malam perlu izin' : 'Hanya shift pagi normal');
      const salSum = outcome === 'Qualified' ? 'Rp3.500.000' : (outcome === 'Needs Review' ? 'Rp3.800.000' : 'Rp5.500.000');

      const structuredStatus = outcome === 'Qualified' ? 'qualified' : (outcome === 'Needs Review' ? 'needs_review' : 'not_qualified');
      const summaryText = `Screening posisi Warehouse Staff: ${name} ${outcome === 'Qualified' ? 'memenuhi seluruh' : outcome === 'Needs Review' ? 'memenuhi sebagian' : 'tidak memenuhi'} kriteria.`;

      const screening: ScreeningResult = {
        id: `scr_${idx + 1}`,
        candidateId,
        jobId,
        callRunId,
        outcome,
        durationSeconds: outcome === 'Qualified' ? 145 : (outcome === 'Needs Review' ? 112 : 68),
        completedAt: new Date(Date.now() - (45 - idx) * 2400 * 1000).toISOString(),
        structured: {
          candidate_name: name,
          position: 'Warehouse Staff',
          experience: expSum,
          location: locSum,
          availability: shiftSum,
          salary_expectation: salSum,
          screening_status: structuredStatus,
          reason: outcome === 'Qualified' ? 'Memenuhi semua kriteria posisi' : (outcome === 'Needs Review' ? 'Perlu konfirmasi jadwal shift malam' : 'Gaji/lokasi tidak sesuai'),
          follow_up_needed: outcome !== 'Not Qualified',
          summary: summaryText,
        },
        extractedCriteria: {
          confirmedNameAndRole: true,
          experienceSummary: expSum,
          experienceMatch: outcome === 'Qualified',
          locationSummary: locSum,
          commuteMatch: outcome !== 'Not Qualified' || idx % 2 === 0,
          shiftSummary: shiftSum,
          shiftMatch: outcome !== 'Not Qualified',
          salaryExpectation: `${salSum} ${outcome === 'Qualified' ? '(Sesuai budget)' : (outcome === 'Needs Review' ? '(Batas atas budget)' : '(Melampaui budget)')}`,
          salaryMatch: outcome !== 'Not Qualified',
          overallSummary: summaryText,
        },
        transcript: `[00:02] AI: Halo, selamat siang. Saya asisten rekrutmen untuk posisi Warehouse Staff di Malang. Benar dengan ${name}?
[00:07] ${name}: Halo, iya betul dengan saya.
[00:10] AI: Apakah kamu memiliki pengalaman kerja terkait operasional gudang?
[00:18] ${name}: ${outcome === 'Qualified' ? 'Iya, saya sudah bekerja 2 tahun di gudang distribusi.' : outcome === 'Needs Review' ? 'Belum ada pengalaman langsung, tapi saya cepat beradaptasi.' : 'Saya sebelumnya bekerja sebagai kasir minimarket.'}
[00:28] AI: Lokasi kerja berada di Malang. Bagaimana dengan domisili dan transportasi kamu?
[00:36] ${name}: ${outcome === 'Qualified' ? 'Saya tinggal di Malang, sekitar 15 menit dari lokasi.' : outcome === 'Needs Review' ? 'Saya tinggal di Singosari, ada motor pribadi.' : 'Saya tinggal di Surabaya.'}
[00:44] AI: Posisi ini menerapkan shift pagi dan malam. Apakah bersedia?
[00:52] ${name}: ${outcome !== 'Not Qualified' ? 'Siap, saya bersedia shift pagi maupun malam.' : 'Maaf, saya tidak bisa shift malam.'}
[00:60] AI: Berapa ekspektasi gaji bulanan kamu?
[01:08] ${name}: ${outcome === 'Qualified' ? 'Sekitar Rp3.500.000 per bulan.' : outcome === 'Needs Review' ? 'Di kisaran Rp3.800.000.' : 'Saya berharap sekitar Rp5.500.000.'}
[01:16] AI: Terima kasih atas informasinya. Tim recruiter kami akan meninjau hasil percakapan ini.
[01:22] ${name}: Terima kasih.`,
      };

      candidate.screeningResult = screening;
      screenings.push(screening);
    }

    candidates.push(candidate);
  });

  return {
    jobs: [defaultJob],
    candidates,
    screenings,
    settings: {
      calleMode: 'mock',
      source: 'skills_sh',
      integration: 'skills_sh_skill',
      integrationVersion: '0.1.0',
      defaultPhoneCountry: '+62',
    },
  };
}

export function readDb(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initialData = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const initialData = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function writeDb(data: DatabaseSchema) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
