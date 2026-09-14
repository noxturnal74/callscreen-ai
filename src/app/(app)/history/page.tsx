'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Candidate, Job } from '@/types';
import { ScreeningOutcomeBadge, CandidateStatusBadge } from '@/components/screening/ScreeningStatusBadge';
import { History, Filter, Search, ArrowUpRight, PhoneCall, CheckCircle2, Clock } from 'lucide-react';

function maskPhone(phone: string) {
  if (!phone || phone.length < 8) return phone;
  return phone.slice(0, 4) + ' •••• ' + phone.slice(-4);
}

export default function HistoryPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data: Candidate[]) => setCandidates(data.filter((c) => c.status === 'completed' || c.status === 'calling')));
  }, []);

  const filtered = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.screeningResult?.outcome === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Screening Call History</h1>
          <p className="text-xs text-slate-500">
            Audit log of all completed and in-progress voice screening conversations.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Total Logs: {candidates.length} calls
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['all', 'Qualified', 'Needs Review', 'Not Qualified'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition shrink-0 ${
                statusFilter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'all' ? 'All Calls' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Call Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Call Status</th>
                <th className="px-4 py-3">AI Recommendation</th>
                <th className="px-4 py-3">Call Duration</th>
                <th className="px-4 py-3">Screened At</th>
                <th className="px-4 py-3 text-right">Scorecard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cand) => {
                const res = cand.screeningResult;
                const duration = res?.durationSeconds ? `${Math.floor(res.durationSeconds / 60)}:${(res.durationSeconds % 60).toString().padStart(2, '0')}` : '-';
                const date = res?.completedAt ? new Date(res.completedAt).toLocaleString('id-ID') : '-';

                return (
                  <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{cand.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{maskPhone(cand.phone)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cand.position}</td>
                    <td className="px-4 py-3">
                      <CandidateStatusBadge status={cand.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ScreeningOutcomeBadge outcome={res?.outcome} />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{duration}</td>
                    <td className="px-4 py-3 text-slate-500">{date}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/candidates/${cand.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <span>Review</span>
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
    </div>
  );
}
