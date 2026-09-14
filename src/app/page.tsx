'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import {
  PhoneCall,
  ArrowRight,
  Play,
  Pause,
  Upload,
  PhoneForwarded,
  ClipboardCheck,
  UserCheck,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';
import { CONTACT_EMAIL_HREF, SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

const NAV_LINKS = [
  { href: '#workflow', label: 'Cara Kerja' },
  { href: '#demo', label: 'Simulasi Percakapan' },
  { href: '#calculator', label: 'Kalkulator ROI' },
  { href: '#features', label: 'Modul SemartHRIS' },
  { href: '#pricing', label: 'Harga Paket' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontak', label: 'Kontak' },
];

const WORKFLOW = [
  {
    badge: 'INPUT',
    title: 'Impor dan Verifikasi Antrean',
    desc: 'Unggah data pelamar via CSV atau formulir. Nomor telepon divalidasi otomatis ke format internasional E.164 (+62).',
    icon: Upload,
  },
  {
    badge: 'PSTN CALL',
    title: 'CALL-E Menghubungi Pelamar',
    desc: 'Gateway CALL-E langsung mendial nomor GSM pelamar, bercakap dengan Bahasa Indonesia natural, dan memverifikasi 5 kriteria posisi.',
    icon: PhoneForwarded,
  },
  {
    badge: 'EXTRACTION',
    title: 'Transkrip dan Kartu Bukti Fakta',
    desc: 'Jawaban lisan seputar pengalaman kerja, domisili, shift malam, dan estimasi gaji terekstrak otomatis ke scorecard terstruktur.',
    icon: ClipboardCheck,
  },
  {
    badge: 'SEMARTHRIS',
    title: 'Alokasi Shift dan Roster Karyawan',
    desc: 'Kandidat yang lolos (Qualified) langsung dialokasikan ke jadwal shift kerja SemartHRIS dan siap ke tahap penandatanganan kontrak.',
    icon: UserCheck,
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Kecepatan Screening 50 Pelamar',
    manual: '12-18 jam kerja (2-3 hari)',
    tradAts: 'Pasif (menunggu form/email)',
    callscreen: 'Hitungan menit (paralel via CALL-E)',
  },
  {
    feature: 'Verifikasi Pengalaman dan Domisili',
    manual: 'Telepon manual satu per satu',
    tradAts: 'Teks form resume (rawan klaim palsu)',
    callscreen: 'Percakapan 2 arah dan transkrip verbatim',
  },
  {
    feature: 'Konfirmasi Kesiapan Shift Malam',
    manual: 'Sering terlewat saat interview',
    tradAts: 'Tidak terverifikasi lisan',
    callscreen: 'Wajib dijawab lisan dan tercatat di scorecard',
  },
  {
    feature: 'Integrasi Shift dan Jadwal HRIS',
    manual: 'Ketik ulang ke Excel/HRIS manual',
    tradAts: 'Terpisah dari modul jadwal shift',
    callscreen: 'Sinkron otomatis ke modul Shift SemartHRIS',
  },
  {
    feature: 'Pengambil Keputusan Akhir',
    manual: 'Rekruter (lelah dan rawan bias)',
    tradAts: 'Filter kata kunci teks otomatis',
    callscreen: 'Rekruter manusia dengan bukti objektif AI',
  },
];

const FAQS = [
  {
    q: 'Apakah AI yang menentukan penerimaan atau penolakan kerja pelamar?',
    a: 'Tidak. CallScreen AI bertindak khusus sebagai asisten pre-screening putaran pertama. AI hanya bertugas menelepon, menanyakan 5 pertanyaan objektif, dan merangkum bukti jawaban faktual. Rekruter manusia tetap memegang 100% wewenang keputusan akhir (Advance / Review / Reject).',
  },
  {
    q: 'Bagaimana CALL-E melakukan panggilan ke ponsel kandidat?',
    a: 'CALL-E menggunakan gateway PSTN resmi yang dapat menghubungi langsung nomor GSM seluler (+62). Pelamar tidak perlu menginstal aplikasi apapun, cukup mengangkat panggilan telepon biasa dari tim rekrutmen Anda.',
  },
  {
    q: 'Apakah tersedia mode Sandbox tanpa memotong pulsa/kredit telepon?',
    a: 'Ya. CallScreen AI dilengkapi CALL-E Sandbox Simulator lokal. Anda dapat mensimulasikan seluruh alur percakapan audio, live transcript streaming, dan pembuatan scorecard tanpa biaya telepon.',
  },
  {
    q: 'Bagaimana keterhubungan data dengan modul SemartHRIS?',
    a: 'Kandidat yang telah diverifikasi dan lolos screening dapat langsung dipasangkan ke kode shift kerja (Shiftment/Workshift) yang terdaftar di database SemartHRIS untuk penjadwalan operasional.',
  },
  {
    q: 'Apakah data pelamar dan rekaman suara aman?',
    a: 'Ya. Nomor telepon di-masking di tampilan publik, transkrip disimpan terenkripsi di server, dan tidak ada kredensial yang diekspos ke sisi browser.',
  },
];

const FACTS = [
  { icon: ClipboardCheck, title: '5 kriteria inti', desc: 'Terverifikasi lewat suara' },
  { icon: PhoneCall, title: 'Sandbox + Live PSTN', desc: 'Dua mode panggilan' },
  { icon: ShieldCheck, title: 'Nomor ter-masking', desc: 'Privasi pelamar terjaga' },
  { icon: UserCheck, title: 'Recruiter memutuskan', desc: 'AI hanya merekomendasikan' },
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [activeUtterance, setActiveUtterance] = useState(2);
  const [candidateCount, setCandidateCount] = useState(50);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlayingDemo(false);
      return;
    }
    if (!isPlayingDemo) return;
    const interval = setInterval(() => {
      setActiveUtterance((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlayingDemo]);

  const starterPrice = isAnnual ? 'Rp 399.000' : 'Rp 499.000';
  const proPrice = isAnnual ? 'Rp 1.199.000' : 'Rp 1.499.000';

  const manualHours = Math.round((candidateCount * 18) / 60);
  const aiMinutes = Math.max(1, Math.round(candidateCount * 0.1));

  return (
    <div className={`min-h-screen bg-[#0f0f11] text-zinc-100 antialiased selection:bg-[#ff5c35] selection:text-white overflow-x-hidden ${inter.className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: SITE_NAME,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            author: {
              '@type': 'Person',
              name: SITE_AUTHOR.name,
              email: SITE_AUTHOR.email,
            },
          }),
        }}
      />
      <div className="border-b border-white/10 bg-white/[0.02] py-2 px-4 text-center text-xs text-zinc-400">
        <span>CALL-E Hackathon Special: 20 panggilan screening PSTN gratis untuk coba-coba.</span>
        <Link href="/dashboard" className="ml-2 font-semibold text-[#ff8a66] hover:text-[#ff5c35] underline underline-offset-2">
          Buka Demo Live
        </Link>
      </div>

      <header className="sticky top-0 z-40 px-4 md:px-6 pt-3">
        <div className="max-w-7xl mx-auto min-h-[3.5rem] px-4 md:px-5 py-2 rounded-full border border-white/10 bg-[#0f0f11]/70 backdrop-blur-md flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-8 h-8 rounded-full bg-[#ff5c35] flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-90">
              <PhoneCall className="w-4 h-4" />
            </span>
            <span className="leading-tight">
              <span className="block font-bold tracking-tight text-sm text-white">CallScreen AI</span>
              <span className="hidden min-[420px]:block text-[10px] text-zinc-500 font-medium -mt-0.5">SemartHRIS and Telephony</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-zinc-400" aria-label="Navigasi utama">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/screening"
              className="hidden md:inline-flex px-4 py-1.5 rounded-full text-xs font-medium text-zinc-300 border border-white/15 hover:bg-white/5 transition whitespace-nowrap"
            >
              Uji Coba Sandbox
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#ff5c35] hover:bg-[#e14e2c] active:scale-[0.98] transition whitespace-nowrap shadow-[0_0_24px_rgba(255,92,53,0.35)]"
            >
              <span>Buka Portal HR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Buka menu navigasi"
              className="lg:hidden p-2 rounded-full text-zinc-300 hover:bg-white/10 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl border border-white/10 bg-[#161618] p-2" aria-label="Navigasi seluler">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-[#ff5c35]/10 rounded-full blur-[140px] -z-0 pointer-events-none animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-14 md:pt-24 pb-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Voice Screening untuk Frontline Hiring
              </span>
            </Reveal>

            <Reveal stagger={1}>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05]`}>
                Screening ratusan pelamar lewat <span className="text-[#ff5c35]">panggilan telepon AI.</span>
              </h1>
            </Reveal>

            <Reveal stagger={2}>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-[52ch] font-light">
                Agen suara CALL-E menelepon kandidat, memverifikasi pengalaman, domisili, shift malam, dan gaji, lalu mengembalikan scorecard siap putusan.
              </p>
            </Reveal>

            <Reveal stagger={3}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#ff5c35] hover:bg-[#e14e2c] active:scale-[0.98] transition shadow-[0_0_24px_rgba(255,92,53,0.35)]"
                >
                  <PhoneForwarded className="w-4 h-4" />
                  <span>Mulai AI Screening Gratis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-200 border border-white/15 hover:bg-white/5 active:scale-[0.98] transition"
                >
                  <Volume2 className="w-4 h-4 text-[#ff8a66]" />
                  <span>Dengar Simulasi Suara</span>
                </Link>
              </div>
            </Reveal>

            <Reveal stagger={4}>
              <p className="flex items-center gap-2 text-[13px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Human-in-the-loop: rekruter manusia pemutus akhir setiap pelamar.</span>
              </p>
            </Reveal>
          </div>

          <Reveal variant="scale" className="w-full">
            <div id="demo" className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 md:p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Live Call in Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                    aria-pressed={isPlayingDemo}
                    className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition"
                    title={isPlayingDemo ? 'Pause Simulation' : 'Play Simulation'}
                  >
                    {isPlayingDemo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] font-mono text-[#ff8a66] bg-[#ff5c35]/10 px-2 py-0.5 rounded-full border border-[#ff5c35]/20 font-semibold">
                    CALL-E PSTN
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-[15px]">Andi Pratama</h4>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Warehouse Staff, Malang
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" /> Qualified Fit
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className={`p-2.5 rounded-xl border transition-colors ${activeUtterance === 0 ? 'bg-[#ff5c35]/10 text-zinc-100 border-[#ff5c35]/30 border-l-2' : 'text-zinc-500 border-transparent'}`}>
                  <span className="font-bold text-[#ff8a66]">AI CALL-E:</span> "Halo Andi, apakah kamu memiliki pengalaman operasional gudang sebelumnya?"
                </div>
                <div className={`p-2.5 rounded-xl border transition-colors ${activeUtterance === 1 ? 'bg-white/10 text-zinc-100 border-white/20 border-l-2' : 'text-zinc-500 border-transparent'}`}>
                  <span className="font-bold text-zinc-300">Andi (Pelamar):</span> "Iya, saya sudah 2 tahun kerja di gudang ekspedisi Malang, bagian packing dan bongkar muat."
                </div>
                <div className={`p-2.5 rounded-xl border transition-colors ${activeUtterance === 2 ? 'bg-[#ff5c35]/10 text-zinc-100 border-[#ff5c35]/30 border-l-2' : 'text-zinc-500 border-transparent'}`}>
                  <span className="font-bold text-[#ff8a66]">AI CALL-E:</span> "Posisi ini menerapkan shift pagi dan malam. Apakah kamu siap?"
                </div>
                <div className={`p-2.5 rounded-xl border transition-colors ${activeUtterance === 3 ? 'bg-white/10 text-zinc-100 border-white/20 border-l-2' : 'text-zinc-500 border-transparent'}`}>
                  <span className="font-bold text-zinc-300">Andi (Pelamar):</span> "Siap, saya sudah terbiasa shift malam di pekerjaan sebelumnya."
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Pengalaman</span>
                  <span className="font-bold text-white">2 Tahun</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Shift Malam</span>
                  <span className="font-bold text-emerald-300">Siap</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FACTS.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={i} stagger={i as 0 | 1 | 2 | 3}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#ff5c35]/10 border border-[#ff5c35]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#ff8a66]" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{f.title}</span>
                    <span className="block text-xs text-zinc-500">{f.desc}</span>
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-[#ff8a66] uppercase tracking-widest">Alur Screening Operasional</p>
            <h2 className={`mt-3 text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
              Dari antrean ke keputusan dalam 4 langkah.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {WORKFLOW.map((w, idx) => {
            const Icon = w.icon;
            return (
              <Reveal key={idx} stagger={((idx % 4) + 1) as 1 | 2 | 3 | 4} className={idx % 2 === 1 ? 'md:mt-12' : ''}>
                <div className="group h-full p-7 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-[#ff5c35]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#ff8a66] bg-[#ff5c35]/10 px-2.5 py-1 rounded-full border border-[#ff5c35]/20 font-mono">
                      {w.badge}
                    </span>
                    <span className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#ff5c35] group-hover:border-[#ff5c35] transition-colors">
                      <Icon className="w-5 h-5 text-zinc-200" />
                    </span>
                  </div>
                  <h3 className={`mt-5 text-2xl font-semibold text-white tracking-tight`}>{w.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{w.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="calculator" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24 space-y-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
                Berapa jam kerja tim HR yang bisa dihemat?
              </h2>
              <p className="mt-3 text-sm text-zinc-500">Geser slider dan lihat estimasi perbandingannya.</p>
            </div>
          </Reveal>

          <Reveal variant="scale">
            <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#0f0f11] p-6 md:p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-zinc-200">
                  <label htmlFor="candidatesRange">Jumlah pelamar per rekrutmen</label>
                  <span className="text-2xl font-bold text-white font-mono">{candidateCount} <span className="text-sm font-medium text-zinc-500">pelamar</span></span>
                </div>
                <input
                  id="candidatesRange"
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={candidateCount}
                  onChange={(e) => setCandidateCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ff5c35]"
                />
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>10 pelamar</span>
                  <span>250 pelamar</span>
                  <span>500 pelamar</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                  <span className="text-xs text-zinc-500 font-medium">Screening manual via telepon</span>
                  <div className="text-4xl font-bold text-zinc-300 font-mono">~{manualHours} jam</div>
                  <p className="text-[11px] text-zinc-600">Asumsi 15-20 menit per pelamar</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#ff5c35]/10 border border-[#ff5c35]/25 text-center space-y-1">
                  <span className="text-xs text-[#ff8a66] font-bold">Dengan CallScreen AI</span>
                  <div className="text-4xl font-bold text-white font-mono">~{aiMinutes} mnt</div>
                  <p className="text-[11px] text-zinc-400">Panggilan otomatis paralel via CALL-E</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24 space-y-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className={`max-w-xl text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
              Kenapa cocok untuk frontline recruitment?
            </h2>
            <p className="max-w-sm text-sm text-zinc-500">Perbandingan jujur dengan cara lama. Angka bersifat estimasi ilustratif.</p>
          </div>
        </Reveal>

        <Reveal variant="scale">
          <div className="rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-[13px]">
                <thead className="bg-white/[0.04] text-zinc-300 font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Fitur dan kemampuan</th>
                    <th className="px-6 py-4 text-zinc-500">Telepon manual</th>
                    <th className="px-6 py-4 text-zinc-500">ATS formulir teks</th>
                    <th className="px-6 py-4 text-[#ff8a66] bg-[#ff5c35]/5">CallScreen AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{row.feature}</td>
                      <td className="px-6 py-4 text-zinc-500">{row.manual}</td>
                      <td className="px-6 py-4 text-zinc-500">{row.tradAts}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-100 bg-[#ff5c35]/[0.04]">{row.callscreen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="features" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24 space-y-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#ff8a66] uppercase tracking-widest">Integrasi SemartHRIS</p>
                <h2 className={`mt-3 max-w-xl text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
                  Platform HR operasional terpadu.
                </h2>
              </div>
              <Link href="/shifts" className="text-[13px] font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 shrink-0 pb-1">
                <span>Buka Modul Shift Kerja</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Reveal stagger={1} className="lg:col-span-2">
              <div className="h-full p-8 rounded-3xl bg-[#ff5c35]/[0.07] border border-[#ff5c35]/20">
                <span className="w-12 h-12 rounded-2xl bg-[#ff5c35] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </span>
                <h3 className={`mt-5 text-2xl font-semibold text-white tracking-tight`}>Manajemen Shift Kerja</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-lg">
                  Atur kode shift (Pagi, Malam, Reguler, Non-Shift) lengkap dengan jam masuk dan pulang. Sinkron dengan hasil wawancara kesiapan kerja kandidat, tanpa ketik ulang.
                </p>
              </div>
            </Reveal>

            <Reveal stagger={2}>
              <div className="h-full p-8 rounded-3xl border border-white/10 bg-white/[0.03]">
                <span className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-zinc-200" />
                </span>
                <h3 className={`mt-5 text-2xl font-semibold text-white tracking-tight`}>Roster dan Alokasi</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Kandidat lolos langsung dialokasikan ke jadwal harian dan penempatan cabang.
                </p>
              </div>
            </Reveal>

            <Reveal stagger={3} className="lg:col-span-3">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-5">
                <span className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hidden md:flex items-center justify-center">
                  <Users className="w-5 h-5 text-zinc-200" />
                </span>
                <div>
                  <h3 className={`text-2xl font-semibold text-white tracking-tight`}>Database Roster Frontline</h3>
                  <p className="mt-1 text-sm text-zinc-400">Riwayat karyawan, kontak terverifikasi, status keaktifan, dan bukti kualifikasi suara.</p>
                </div>
                <Link href="/candidates" className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-zinc-200 border border-white/15 hover:bg-white/5 transition whitespace-nowrap">
                  Lihat Kandidat <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24 space-y-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-xs font-bold text-[#ff8a66] uppercase tracking-widest">Pilihan Paket dan Investasi</p>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
              Harga transparan untuk setiap skala.
            </h2>
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Bulanan</span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                aria-pressed={isAnnual}
                aria-label="Toggle harga tahunan"
                className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${isAnnual ? 'bg-[#ff5c35]' : 'bg-white/15'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition duration-200 ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
                Tahunan
                <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/20">Hemat 20%</span>
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch max-w-5xl mx-auto">
          <Reveal stagger={1}>
            <div className="h-full rounded-3xl p-7 border border-white/10 bg-white/[0.03] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Starter Recruiter</h3>
                <p className="text-xs text-zinc-500">Toko ritel dan UKM, 10-50 staf per bulan.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{starterPrice}</span>
                  <span className="text-xs text-zinc-500">/bulan</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                  {['100 panggilan screening / bulan', '5 pertanyaan suara kustom', 'Transkrip dan kartu bukti', 'Shift dan absensi dasar', 'Mode Sandbox dan Live'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-full text-xs font-bold text-center block transition border border-white/15 text-zinc-200 hover:bg-white/5">
                Mulai Uji Coba Gratis
              </Link>
            </div>
          </Reveal>

          <Reveal stagger={2}>
            <div className="relative h-full rounded-3xl p-7 bg-[#ff5c35] text-white flex flex-col justify-between gap-6 shadow-[0_0_48px_rgba(255,92,53,0.3)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#0f0f11] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Paling Populer
              </span>
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Pro Staffing dan HRIS</h3>
                <p className="text-xs text-white/70">Agensi outsourcing dan logistik volume tinggi.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{proPrice}</span>
                  <span className="text-xs text-white/70">/bulan</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-white/20 text-xs">
                  {['500 panggilan screening / bulan', 'Unlimited lowongan dan impor', 'Ekstraksi gaji, domisili, shift', 'Sinkron shift dan roster', 'Masking nomor dan audit trail', 'Prioritas gateway PSTN'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-full text-xs font-bold text-center block transition bg-white text-[#0f0f11] hover:bg-zinc-100">
                Daftar Paket Pro
              </Link>
            </div>
          </Reveal>

          <Reveal stagger={3}>
            <div className="h-full rounded-3xl p-7 border border-white/10 bg-white/[0.03] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Enterprise Agency</h3>
                <p className="text-xs text-zinc-500">Ribuan pelamar per bulan dan integrasi API.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                  {['Volume fleksibel (1.000+)', 'Penyesuaian skrip suara', 'Multi-cabang dan multi-perusahaan', 'Webhook dan sinkronisasi ATS', 'Infrastruktur stabil volume tinggi'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-2.5 rounded-full text-xs font-bold text-center block transition border border-white/15 text-zinc-200 hover:bg-white/5">
                Hubungi Tim Sales
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 md:py-24 space-y-8">
          <Reveal>
            <h2 className={`text-center text-4xl md:text-5xl font-bold tracking-tighter text-white`}>
              Pertanyaan yang sering ditanyakan
            </h2>
          </Reveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={i}>
                  <div className={`rounded-2xl border overflow-hidden transition-colors ${isOpen ? 'border-[#ff5c35]/30 bg-[#ff5c35]/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                    >
                      <span className="font-semibold text-zinc-100 text-sm">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#ff8a66] shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-[13px] text-zinc-400 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-6 overflow-hidden" aria-hidden>
        <div className="bg-[#ff5c35] overflow-hidden whitespace-nowrap -rotate-1 scale-[1.02]">
          <div className="animate-marquee inline-block py-3 text-2xl md:text-4xl font-bold text-white/90 uppercase tracking-widest">
            <span>&nbsp;• AI Voice Screening • Frontline Hiring • Transkrip Verbatim • Human-in-the-Loop</span>
            <span>&nbsp;• AI Voice Screening • Frontline Hiring • Transkrip Verbatim • Human-in-the-Loop</span>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden px-4 md:px-6 pb-20">
        <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[20rem] bg-[#ff5c35]/10 rounded-full blur-[130px] pointer-events-none" />
        <Reveal variant="scale">
          <div className="relative max-w-4xl mx-auto text-center rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md p-10 md:p-16">
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter text-white`}>Punya volume rekrutmen besar?</h2>
            <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto font-light">Buka portal HR, impor kandidat, dan biarkan CALL-E menelepon sisanya.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#ff5c35] hover:bg-[#e14e2c] active:scale-[0.98] transition shadow-[0_0_24px_rgba(255,92,53,0.35)]"
              >
                Buka Portal HR <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/screening"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold text-zinc-200 border border-white/15 hover:bg-white/5 transition"
              >
                Uji Coba Sandbox
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="kontak" className="scroll-mt-24 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <p className="text-xs font-bold text-[#ff8a66] uppercase tracking-widest">Kontak</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Hubungi Albert William Saputra
              </h2>
              <p className="mt-4 text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg font-light">
                Mau lihat demo langsung, menjajal pilot rekrutmen untuk tim Anda, atau mendiskusikan integrasi SemartHRIS? Kirim email, ceritakan kebutuhan volume rekrutmen Anda.
              </p>
              <p className="mt-4 flex items-center gap-2 text-[13px] text-zinc-500">
                <MapPin className="w-4 h-4 text-[#ff8a66] shrink-0" />
                <span>{SITE_AUTHOR.location}</span>
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale">
            <div className="rounded-3xl border border-white/10 bg-[#0f0f11] p-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-[#ff5c35]/10 border border-[#ff5c35]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#ff8a66]" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{SITE_AUTHOR.email}</p>
                  <p className="text-xs text-zinc-500">Subjek otomatis: Demo CallScreen AI</p>
                </div>
              </div>
              <a
                href={CONTACT_EMAIL_HREF}
                className="group flex items-center justify-center gap-2 w-full px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#ff5c35] hover:bg-[#e14e2c] active:scale-[0.98] transition shadow-[0_0_24px_rgba(255,92,53,0.35)]"
              >
                Kirim Email Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#ff5c35] flex items-center justify-center text-white">
                <PhoneCall className="w-4 h-4" />
              </span>
              <span className="font-bold text-white">CallScreen AI</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Screening pelamar frontline lewat panggilan telepon AI, terintegrasi dengan SemartHRIS.
            </p>
          </div>
          <nav aria-label="Navigasi footer">
            <p className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Navigasi</p>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Produk footer">
            <p className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Produk</p>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard HR</Link></li>
              <li><Link href="/screening" className="hover:text-white transition-colors">AI Screening</Link></li>
              <li><Link href="/candidates" className="hover:text-white transition-colors">Data Kandidat</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">Lowongan</Link></li>
            </ul>
          </nav>
          <div>
            <p className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Mulai</p>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Buka Portal HR</Link></li>
              <li><Link href="/screening" className="hover:text-white transition-colors">Uji Coba Sandbox</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
            <span>© 2026 CallScreen AI. Powered by CALL-E Telephony Gateway.</span>
            <span>AI merekomendasikan, rekruter memutuskan.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
