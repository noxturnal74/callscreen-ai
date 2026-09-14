'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Job, Candidate } from '@/types';
import { ScreeningOutcomeBadge, CandidateStatusBadge } from '@/components/screening/ScreeningStatusBadge';
import { CallConfirmationModal } from '@/components/screening/CallConfirmationModal';
import { 
  ArrowLeft, 
  PhoneCall, 
  Sparkles, 
  Check, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  Award,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isMock, setIsMock] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);

  const fetchData = async () => {
    try {
      const [jobRes, candRes, setRes] = await Promise.all([
        fetch(`/api/jobs/${params.id}`),
        fetch(`/api/candidates?jobId=${params.id}`),
        fetch('/api/settings'),
      ]);
      const jobData = await jobRes.json();
      const candData = await candRes.json();
      const settings = await setRes.json();
      setJob(jobData);
      setCandidates(candData);
      setIsMock(settings.calleMode !== 'live');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const readyCandidates = candidates.filter((c) => c.status === 'ready' || c.status === 'queued');
  const screenedCandidates = candidates.filter((c) => c.status === 'completed');
  const qualifiedCandidates = screenedCandidates.filter((c) => c.screeningResult?.outcome === 'Qualified');

  const handleStartScreeningAll = async () => {
    setIsCalling(true);
    try {
      await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds: readyCandidates.map((c) => c.id) }),
      });
      setIsModalOpen(false);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalling(false);
    }
  };

  if (loading || !job) {
    return <div className="p-8 text-center text-slate-400">Loading job command center...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </Link>

      {/* Hero Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {job.department}
            </span>
            <span className="text-xs text-slate-400">• Created on {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{job.shift}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>{job.salaryRange}</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={readyCandidates.length === 0}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start AI Screening ({readyCandidates.length} Candidates)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Candidates</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{candidates.length}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Screened Calls</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{screenedCandidates.length}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Qualified Fit</span>
            <div className="text-2xl font-bold text-emerald-700 mt-0.5">{qualifiedCandidates.length}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Screening Requirements Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">Core Screening Requirements</h3>
          </div>
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>{showQuestions ? 'Hide 5 Voice Questions' : 'Inspect 5 Voice Questions'}</span>
            {showQuestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{job.experienceRequired} Experience</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Located in {job.location}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{job.shift}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Budget ≤ {job.salaryRange.split('-')[1]?.trim() || job.salaryRange}</span>
          </div>
        </div>

        {/* Spoken Voice Script Details */}
        {showQuestions && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              CALL-E Spoken Questionnaire:
            </span>
            <div className="space-y-1.5">
              {job.questions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 font-medium">{q.question}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidates List for this Job */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Candidate Roster</h3>
            <p className="text-xs text-slate-500">Applicants assigned to this position</p>
          </div>
          <span className="text-xs text-slate-400">{candidates.length} candidates in queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Candidate</th>
                <th className="px-4 py-2.5">Phone</th>
                <th className="px-4 py-2.5">Screening Status</th>
                <th className="px-4 py-2.5">Experience</th>
                <th className="px-4 py-2.5">Shift Match</th>
                <th className="px-4 py-2.5 text-right">Scorecard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((cand) => {
                const res = cand.screeningResult;
                return (
                  <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{cand.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{cand.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CandidateStatusBadge status={cand.status} />
                        <ScreeningOutcomeBadge outcome={res?.outcome} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {res?.extractedCriteria?.experienceSummary || cand.experience || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {res?.extractedCriteria?.shiftMatch ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Shift Ready
                        </span>
                      ) : res ? (
                        <span className="text-rose-600 font-medium">Limited</span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/candidates/${cand.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <CallConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartScreeningAll}
        candidateNames={readyCandidates.map((c) => c.name)}
        candidatePhones={readyCandidates.map((c) => c.phone)}
        jobTitle={job.title}
        isMock={isMock}
        isLoading={isCalling}
      />
    </div>
  );
}
