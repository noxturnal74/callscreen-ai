'use client';

import React, { useState } from 'react';
import { ScreeningResult } from '@/types';
import { ScreeningOutcomeBadge } from './ScreeningStatusBadge';
import { 
  Check, 
  X, 
  Clock, 
  Sparkles, 
  MessageSquareQuote, 
  UserCheck, 
  UserX, 
  Bookmark, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Award
} from 'lucide-react';

export function ScorecardCard({ result }: { result: ScreeningResult }) {
  const { extractedCriteria, structured, transcript, durationSeconds, outcome, completedAt, callRunId } = result;
  const [recruiterDecision, setRecruiterDecision] = useState<string | null>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Voice Screening Scorecard</h3>
            <ScreeningOutcomeBadge outcome={outcome} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Completed on {new Date(completedAt).toLocaleString('id-ID')} • Duration: {timeFormatted} • CALL-E Run ID: <span className="font-mono text-slate-700">{callRunId}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-md border border-blue-100 text-xs text-blue-800 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>CALL-E Voice Telephony</span>
        </div>
      </div>

      {/* "Why This Candidate?" Panel for high visibility */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Award className="w-4 h-4" />
            <h4 className="font-semibold text-xs uppercase tracking-wider">AI Screening Rationale</h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {outcome === 'Qualified' ? 'Verified 4/4 Core Criteria' : (outcome === 'Needs Review' ? 'Partial Match / Review Required' : 'Criteria Mismatch')}
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
          {structured?.summary || extractedCriteria.overallSummary}
        </p>
        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
          <span className="font-semibold text-slate-800">Reason: </span>
          {structured?.reason || (outcome === 'Qualified' ? 'Kandidat memenuhi seluruh kriteria operasional posisi.' : 'Terdapat kriteria yang belum sesuai.')}
        </div>
      </div>

      {/* Evidence-Based Screening Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Evidence-Based Criteria Breakdown
          </span>
          <span className="text-[11px] text-slate-400">Extracted from 2-way spoken dialogue</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Experience Check */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">1. Experience Requirement</span>
              {extractedCriteria.experienceMatch ? (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Confirmed
                </span>
              ) : (
                <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 font-semibold">
                  <X className="w-3 h-3" /> Incomplete
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">{extractedCriteria.experienceSummary}</p>
          </div>

          {/* Location & Commute */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">2. Location & Commute Feasibility</span>
              {extractedCriteria.commuteMatch ? (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Feasible
                </span>
              ) : (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" /> Outside Area
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">{extractedCriteria.locationSummary}</p>
          </div>

          {/* Shift Flexibility */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">3. Shift Availability (Morning / Night)</span>
              {extractedCriteria.shiftMatch ? (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Shift Ready
                </span>
              ) : (
                <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 font-semibold">
                  <X className="w-3 h-3" /> Restricted
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">{extractedCriteria.shiftSummary}</p>
          </div>

          {/* Expected Salary */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">4. Salary Expectation</span>
              {extractedCriteria.salaryMatch ? (
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> In Budget
                </span>
              ) : (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" /> Above Budget
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">{extractedCriteria.salaryExpectation}</p>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Decision Action */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-xs uppercase tracking-wider">Human Recruiter Decision</h4>
          </div>
          <span className="text-[11px] text-slate-400">AI assists, Recruiter decides</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRecruiterDecision('interview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              recruiterDecision === 'interview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Advance to Interview</span>
          </button>

          <button
            onClick={() => setRecruiterDecision('backup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              recruiterDecision === 'backup'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Keep as Backup</span>
          </button>

          <button
            onClick={() => setRecruiterDecision('pass')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              recruiterDecision === 'pass'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Pass / Not Fit</span>
          </button>
        </div>

        {recruiterDecision && (
          <p className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Recruiter decision recorded: <span className="uppercase font-bold">{recruiterDecision}</span>
          </p>
        )}
      </div>

      {/* Transcript Section */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowFullTranscript(!showFullTranscript)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition"
        >
          <div className="flex items-center gap-1.5">
            <MessageSquareQuote className="w-4 h-4 text-blue-600" />
            <span>Verbatim Call Transcript Audit</span>
          </div>
          {showFullTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className={`bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap transition-all ${
          showFullTranscript ? 'max-h-[500px] overflow-y-auto' : 'max-h-36 overflow-hidden relative'
        }`}>
          {transcript}
          {!showFullTranscript && (
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
