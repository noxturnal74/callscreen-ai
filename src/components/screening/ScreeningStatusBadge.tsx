import React from 'react';
import { CandidateStatus, ScreeningOutcome } from '@/types';
import { CheckCircle2, AlertCircle, XCircle, Clock, PhoneCall, HelpCircle } from 'lucide-react';

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Screened
        </span>
      );
    case 'calling':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
          <PhoneCall className="w-3 h-3 text-blue-600 animate-bounce" /> Calling...
        </span>
      );
    case 'queued':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" /> Queued
        </span>
      );
    case 'not_answered':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" /> No Answer
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-3 h-3 text-red-600" /> Failed
        </span>
      );
    case 'ready':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-400" /> Ready to Screen
        </span>
      );
  }
}

export function ScreeningOutcomeBadge({ outcome }: { outcome?: ScreeningOutcome }) {
  if (!outcome) return null;

  switch (outcome) {
    case 'Qualified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Qualified
        </span>
      );
    case 'Needs Review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <HelpCircle className="w-3 h-3 text-amber-600" /> Needs Review
        </span>
      );
    case 'Not Qualified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" /> Not Qualified
        </span>
      );
    case 'Incomplete':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <AlertCircle className="w-3 h-3 text-slate-400" /> Incomplete
        </span>
      );
  }
}
