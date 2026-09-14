'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Candidate, Job } from '@/types';
import { ScreeningOutcomeBadge, CandidateStatusBadge } from '@/components/screening/ScreeningStatusBadge';
import { CallConfirmationModal } from '@/components/screening/CallConfirmationModal';
import { 
  PhoneForwarded, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  ArrowUpRight,
  Filter,
  Check,
  X,
  CircleDot
} from 'lucide-react';

export default function ScreeningHubPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isMock, setIsMock] = useState(true);
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  const fetchData = async () => {
    const [candRes, jobRes, setRes] = await Promise.all([
      fetch('/api/candidates'),
      fetch('/api/jobs'),
      fetch('/api/settings'),
    ]);
    const candData = await candRes.json();
    const jobData = await jobRes.json();
    const settings = await setRes.json();
    setCandidates(candData);
    setJobs(jobData);
    setIsMock(settings.calleMode !== 'live');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const readyCandidates = candidates.filter((c) => c.status === 'ready' || c.status === 'queued');
  const callingCandidates = candidates.filter((c) => c.status === 'calling');
  const completedCandidates = candidates.filter((c) => c.status === 'completed');

  const filteredCompleted = completedCandidates.filter((c) => {
    if (outcomeFilter === 'all') return true;
    return c.screeningResult?.outcome === outcomeFilter;
  });

  const handleLaunchBatch = async () => {
    setIsCalling(true);
    try {
      await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds: selectedIds.length > 0 ? selectedIds : readyCandidates.map((c) => c.id) }),
      });
      setIsModalOpen(false);
      setSelectedIds([]);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 md:p-6 rounded-xl shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <Sparkles className="w-3 h-3" /> Autonomous Voice Telephony Engine
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">AI Phone Screening Hub</h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Trigger automated outbound 2-way phone screening calls via CALL-E. Watch live conversation progress and review structured candidate scorecards in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={readyCandidates.length === 0}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 transition disabled:opacity-40"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start AI Screening ({readyCandidates.length} Pending)</span>
          </button>
        </div>
      </div>

      {/* Active Screening Calls Visualizer */}
      {callingCandidates.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <PhoneCall className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">AI Screening in Progress</h3>
                <p className="text-xs text-slate-500">
                  CALL-E is conducting structured phone screening calls ({callingCandidates.length} active)
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-blue-800 bg-white px-2.5 py-0.5 rounded border border-blue-200">
              {isMock ? 'Sandbox Mode' : 'Live PSTN Calling'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {callingCandidates.map((cand) => (
              <div key={cand.id} className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CircleDot className="w-3.5 h-3.5 text-blue-600 animate-ping" />
                      <h4 className="font-semibold text-slate-900 text-sm">{cand.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{cand.phone} • {cand.position}</p>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                    Calling...
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
                  Current Step: Spoken Voice Qualification & Criteria Capture
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={`/candidates/${cand.id}`}
                    className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
                  >
                    <span>Track Live Dialogue</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Results */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Screening Results ({completedCandidates.length})
            </h2>
            <p className="text-xs text-slate-500">
              Deterministic evidence scorecards extracted from CALL-E transcripts
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {['all', 'Qualified', 'Needs Review', 'Not Qualified'].map((f) => (
              <button
                key={f}
                onClick={() => setOutcomeFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition shrink-0 ${
                  outcomeFilter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {f === 'all' ? 'All Outcomes' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompleted.map((cand) => {
            const res = cand.screeningResult;
            if (!res) return null;

            return (
              <div
                key={cand.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {cand.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{cand.phone}</p>
                    </div>
                    <ScreeningOutcomeBadge outcome={res.outcome} />
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                    {res.structured?.summary || res.extractedCriteria?.overallSummary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-500">
                      Shift: <span className="text-slate-800 font-medium inline-flex items-center gap-1">{res.extractedCriteria.shiftMatch ? (<>Ready <Check className="w-3 h-3 text-emerald-600" /></>) : (<>Limited <X className="w-3 h-3 text-rose-600" /></>)}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-500">
                      Salary: <span className="text-slate-800 font-medium inline-flex items-center gap-1">{res.extractedCriteria.salaryMatch ? (<>In Budget <Check className="w-3 h-3 text-emerald-600" /></>) : (<>Above <X className="w-3 h-3 text-amber-600" /></>)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    {Math.floor(res.durationSeconds / 60)}:{(res.durationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <Link
                    href={`/candidates/${cand.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Inspect Scorecard</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <CallConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLaunchBatch}
        candidateNames={readyCandidates.map((c) => c.name)}
        candidatePhones={readyCandidates.map((c) => c.phone)}
        jobTitle={jobs[0]?.title || 'Warehouse Staff'}
        isMock={isMock}
        isLoading={isCalling}
      />
    </div>
  );
}
