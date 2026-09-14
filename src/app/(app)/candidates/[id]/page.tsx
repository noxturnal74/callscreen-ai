'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Candidate, Job } from '@/types';
import { CandidateStatusBadge } from '@/components/screening/ScreeningStatusBadge';
import { ScorecardCard } from '@/components/screening/ScorecardCard';
import { CallConfirmationModal } from '@/components/screening/CallConfirmationModal';
import { LiveCallTracker } from '@/components/screening/LiveCallTracker';
import { ArrowLeft, PhoneCall, Mail, MapPin, Briefcase } from 'lucide-react';

export default function CandidateDetailPage() {
  const params = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isMock, setIsMock] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  const fetchData = async () => {
    try {
      const candRes = await fetch(`/api/candidates/${params.id}`);
      const candData = await candRes.json();
      setCandidate(candData);

      if (candData.jobId) {
        const jobRes = await fetch(`/api/jobs/${candData.jobId}`);
        const jobData = await jobRes.json();
        setJob(jobData);
      }

      const setRes = await fetch('/api/settings');
      const settings = await setRes.json();
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

  const handleStartCall = async () => {
    if (!candidate) return;
    setIsCalling(true);
    try {
      await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id }),
      });
      setIsModalOpen(false);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalling(false);
    }
  };

  if (loading || !candidate) {
    return (
      <div className="max-w-5xl mx-auto space-y-4" aria-busy="true" aria-label="Loading candidate">
        <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="h-28 rounded-xl bg-white border border-slate-200 animate-pulse" />
        <div className="h-64 rounded-xl bg-white border border-slate-200 animate-pulse" />
      </div>
    );
  }

  const maskedPhone =
    candidate.phone && candidate.phone.length >= 8
      ? `${candidate.phone.slice(0, 7)} ... ${candidate.phone.slice(-4)}`
      : candidate.phone;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/candidates" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Candidate Roster
      </Link>

      {/* Candidate Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{candidate.name}</h1>
            <CandidateStatusBadge status={candidate.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1 font-mono text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>{showPhone ? candidate.phone : maskedPhone}</span>
              <button
                onClick={() => setShowPhone((v) => !v)}
                className="ml-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                {showPhone ? 'Mask' : 'Reveal'}
              </button>
            </div>
            {candidate.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{candidate.email}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.location || 'Indonesia'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.position}</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{candidate.status === 'completed' ? 'Re-run Screening Call' : 'Launch Screening Call'}</span>
          </button>
        </div>
      </div>

      {/* Live Call Tracker */}
      {candidate.status === 'calling' && candidate.callRunId && (
        <LiveCallTracker
          callRunId={candidate.callRunId}
          candidate={candidate}
          onCallCompleted={fetchData}
        />
      )}

      {/* Structured Scorecard */}
      {candidate.screeningResult && (
        <ScorecardCard result={candidate.screeningResult} />
      )}

      {/* Confirmation Modal */}
      <CallConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartCall}
        candidateNames={[candidate.name]}
        candidatePhones={[candidate.phone]}
        jobTitle={job?.title || candidate.position}
        isMock={isMock}
        isLoading={isCalling}
      />
    </div>
  );
}
