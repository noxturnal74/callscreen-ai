import React from 'react';
import Link from 'next/link';
import { Candidate } from '@/types';
import { ScreeningOutcomeBadge, CandidateStatusBadge } from '@/components/screening/ScreeningStatusBadge';
import { ArrowUpRight, PhoneCall } from 'lucide-react';

interface RecentCallsTableProps {
  candidates: Candidate[];
}

export function RecentCallsTable({ candidates }: RecentCallsTableProps) {
  const mask = (phone: string) =>
    !phone || phone.length < 8 ? phone : `${phone.slice(0, 7)} ... ${phone.slice(-4)}`;
  const recentScreened = candidates
    .filter((c) => c.status === 'completed' || c.status === 'calling')
    .slice(0, 10);

  if (recentScreened.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2 shadow-xs">
        <PhoneCall className="w-6 h-6 text-slate-400 mx-auto" />
        <h4 className="font-semibold text-slate-800 text-sm">Belum ada panggilan screening</h4>
        <p className="text-xs text-slate-500">
          Mulai screening pada antrean kandidat untuk melihat hasil AI Voice Call.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Recent AI Screening Calls</h3>
          <p className="text-xs text-slate-500">Hasil percakapan screening terbaru via CALL-E</p>
        </div>
        <Link
          href="/screening"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>View All Screenings</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5">Candidate</th>
              <th className="px-4 py-2.5">Position</th>
              <th className="px-4 py-2.5">Call Status</th>
              <th className="px-4 py-2.5">AI Screening Result</th>
              <th className="px-4 py-2.5">Duration</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentScreened.map((cand) => {
              const res = cand.screeningResult;
              const duration = res?.durationSeconds ? `${Math.floor(res.durationSeconds / 60)}:${(res.durationSeconds % 60).toString().padStart(2, '0')}` : '-';

              return (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{cand.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{mask(cand.phone)}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{cand.position}</td>
                  <td className="px-4 py-3">
                    <CandidateStatusBadge status={cand.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ScreeningOutcomeBadge outcome={res?.outcome} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{duration}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/candidates/${cand.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <span>Scorecard</span>
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
  );
}
