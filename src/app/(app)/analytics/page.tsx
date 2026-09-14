'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Candidate } from '@/types';
import { BarChart3, CheckCircle2, HelpCircle, XCircle, Clock, PhoneCall, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => setCandidates(data));
  }, []);

  const total = candidates.length;
  const screened = candidates.filter((c) => c.status === 'completed');
  const qualified = screened.filter((c) => c.screeningResult?.outcome === 'Qualified');
  const needsReview = screened.filter((c) => c.screeningResult?.outcome === 'Needs Review');
  const notQualified = screened.filter((c) => c.screeningResult?.outcome === 'Not Qualified');

  const avgDuration = screened.length > 0 
    ? Math.round(screened.reduce((acc, c) => acc + (c.screeningResult?.durationSeconds || 0), 0) / screened.length)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Screening Analytics</h1>
        <p className="text-xs text-slate-500">
          Operational metrics derived from real stored screening outcomes.
        </p>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Screening Completion Rate</span>
          <div className="text-2xl font-bold text-slate-900">
            {total > 0 ? Math.round((screened.length / total) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-400">{screened.length} of {total} candidates screened</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Qualified Conversion Rate</span>
          <div className="text-2xl font-bold text-emerald-700">
            {screened.length > 0 ? Math.round((qualified.length / screened.length) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-400">{qualified.length} qualified candidates</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Average Screening Duration</span>
          <div className="text-2xl font-bold text-blue-700 font-mono">
            {Math.floor(avgDuration / 60)}:{(avgDuration % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-[11px] text-slate-400">Target: 2-3 mins per applicant</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Needs Review Follow-ups</span>
          <div className="text-2xl font-bold text-amber-700">
            {needsReview.length}
          </div>
          <p className="text-[11px] text-slate-400">Candidates with partial matches</p>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Outcome Distribution</h3>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Qualified Fit ({qualified.length})</span>
              <span>{screened.length > 0 ? Math.round((qualified.length / screened.length) * 100) : 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full" 
                style={{ width: `${screened.length > 0 ? (qualified.length / screened.length) * 100 : 0}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Needs Review ({needsReview.length})</span>
              <span>{screened.length > 0 ? Math.round((needsReview.length / screened.length) * 100) : 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${screened.length > 0 ? (needsReview.length / screened.length) * 100 : 0}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Not Qualified ({notQualified.length})</span>
              <span>{screened.length > 0 ? Math.round((notQualified.length / screened.length) * 100) : 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full" 
                style={{ width: `${screened.length > 0 ? (notQualified.length / screened.length) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
