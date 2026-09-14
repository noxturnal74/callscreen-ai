'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PhoneForwarded, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Briefcase,
  Check,
  PhoneCall,
  Users,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Clock,
  Play,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import { Candidate, Job } from '@/types';
import { CandidateStatusBadge, ScreeningOutcomeBadge } from '@/components/screening/ScreeningStatusBadge';
import { RecentCallsTable } from '@/components/dashboard/RecentCallsTable';

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async () => {
    try {
      const [candRes, jobRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/jobs'),
      ]);
      const candData = await candRes.json();
      const jobData = await jobRes.json();
      setCandidates(candData);
      setJobs(jobData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSeeding(false);
    }
  };

  const callingCandidates = candidates.filter((c) => c.status === 'calling');
  const completedScreenings = candidates.filter((c) => c.status === 'completed');
  const qualifiedCandidates = completedScreenings.filter((c) => c.screeningResult?.outcome === 'Qualified');
  const needsReviewCandidates = completedScreenings.filter((c) => c.screeningResult?.outcome === 'Needs Review');
  const notQualifiedCandidates = completedScreenings.filter((c) => c.screeningResult?.outcome === 'Not Qualified');
  const readyCandidates = candidates.filter((c) => c.status === 'ready' || c.status === 'queued');

  const kpis = [
    { title: 'Total Candidates', value: candidates.length, icon: Users, href: '/candidates' },
    { title: 'Ready to Screen', value: readyCandidates.length, icon: Clock, href: '/candidates?status=ready' },
    { title: 'Screened Calls', value: completedScreenings.length, icon: PhoneCall, href: '/screening' },
    { title: 'Qualified', value: qualifiedCandidates.length, icon: CheckCircle2, textColor: 'text-emerald-700', href: '/candidates?status=Qualified' },
    { title: 'Needs Review', value: needsReviewCandidates.length, icon: HelpCircle, textColor: 'text-amber-700', href: '/candidates?status=Needs Review' },
    { title: 'Not Qualified', value: notQualifiedCandidates.length, icon: XCircle, textColor: 'text-rose-700', href: '/candidates?status=Not Qualified' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. PRODUCT HERO (Section 11) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3 h-3" /> AI Voice Telephony for Frontline Hiring
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Screen frontline applicants with AI phone calls.
          </h1>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xl">
            CallScreen AI automatically calls candidates, conducts structured screening conversations, and turns spoken answers into recruiter-ready hiring insights.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              href="/screening"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
            >
              <PhoneForwarded className="w-3.5 h-3.5" />
              <span>Start AI Screening</span>
            </Link>
            <Link
              href="/candidates"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Candidates</span>
            </Link>
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5"
              title="Reset 50 Demo Candidates"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin text-blue-600' : ''}`} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Workflow */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Voice Screening Workflow</span>
            <span className="text-[10px] text-blue-600 font-mono">CALL-E Connected</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-medium text-slate-600">
            <div className="p-2 rounded bg-white border border-slate-200">
              <PhoneCall className="w-3.5 h-3.5 mx-auto mb-1 text-blue-600" />
              CALL-E
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-blue-600" />
              AI Voice
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <Users className="w-3.5 h-3.5 mx-auto mb-1 text-slate-600" />
              Candidate
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-600" />
              Answers
            </div>
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
              Scorecard
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            2-way voice calls generate instant evidence scorecards for human recruiter review.
          </p>
        </div>
      </div>

      {/* 2. KPI ROW (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.href}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>{kpi.title}</span>
                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className={`text-2xl font-bold tracking-tight ${kpi.textColor || 'text-slate-900'}`}>
                {kpi.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. RECRUITMENT PIPELINE FUNNEL (Section 14) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recruitment Screening Pipeline</h2>
            <p className="text-xs text-slate-500">Candidate progression from import to final qualification</p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            Screening Rate: {candidates.length > 0 ? Math.round((completedScreenings.length / candidates.length) * 100) : 0}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">1. Queue</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{candidates.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">2. Ready to Dial</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{readyCandidates.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">3. Screened</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{completedScreenings.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
            <span className="text-[11px] font-medium text-amber-800">4. Needs Review</span>
            <div className="text-lg font-bold text-amber-800 mt-0.5">{needsReviewCandidates.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] font-medium text-emerald-800">5. Qualified</span>
            <div className="text-lg font-bold text-emerald-800 mt-0.5">{qualifiedCandidates.length}</div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE CALLS / OPERATIONAL SECTION (Section 15) */}
      {callingCandidates.length > 0 && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <h3 className="font-bold text-slate-900 text-sm">Active AI Phone Screening</h3>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-200">
              Live Dialing ({callingCandidates.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {callingCandidates.map((cand) => (
              <div key={cand.id} className="p-4 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{cand.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{cand.phone} • {cand.position}</p>
                </div>
                <Link
                  href={`/candidates/${cand.id}`}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1"
                >
                  <span>Track Live</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ACTIVE ROLES & CALL-E INTEGRATION STATUS (Sections 18 & 19) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Roles (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active Job Openings</h3>
            <Link href="/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View All Jobs</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {jobs.slice(0, 2).map((job) => (
            <div key={job.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{job.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-white text-slate-600 border border-slate-200">
                    {job.location}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {job.shift} • {job.salaryRange} • {job.questions.length} questions configured
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  Command Center
                </Link>
                <Link
                  href="/screening"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Screen
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CALL-E Integration Card (1 col - Section 19) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">CALL-E Integration</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Authentication</span>
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Call Service</span>
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Ready</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">MCP / Skills.sh</span>
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Environment</span>
                <span className="font-semibold text-slate-800">Sandbox Simulator</span>
              </div>
            </div>
          </div>

          <Link
            href="/integrations"
            className="w-full text-center px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
          >
            Manage Integration & Test Call
          </Link>
        </div>
      </div>

      {/* 6. RECENT SCREENING RESULTS TABLE (Section 17) */}
      <RecentCallsTable candidates={candidates} />
    </div>
  );
}
