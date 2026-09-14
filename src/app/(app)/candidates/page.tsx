'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Candidate, Job } from '@/types';
import { CandidateStatusBadge, ScreeningOutcomeBadge } from '@/components/screening/ScreeningStatusBadge';
import { CallConfirmationModal } from '@/components/screening/CallConfirmationModal';
import { 
  Users, 
  PhoneCall, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';

function maskPhone(phone: string) {
  if (!phone || phone.length < 8) return phone;
  return phone.slice(0, 4) + ' •••• ' + phone.slice(-4);
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading candidates...</div>}>
      <CandidatesContent />
    </Suspense>
  );
}

function CandidatesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isMock, setIsMock] = useState(true);

  // New Candidate Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPosition, setNewPosition] = useState('Warehouse Staff');

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

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearchTerm(q);
  }, [searchParams]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartCalls = async () => {
    setIsCalling(true);
    try {
      await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds: selectedIds }),
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

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          phone: newPhone,
          position: newPosition,
          jobId: jobs[0]?.id || 'job_default',
        }),
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter || c.screeningResult?.outcome === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCandidates = candidates.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidates Roster</h1>
          <p className="text-xs text-slate-500">
            Review applicant contact details, launch CALL-E phone screenings, and inspect evaluation scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start AI Screening ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['all', 'ready', 'completed', 'Qualified', 'Needs Review', 'Not Qualified'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition shrink-0 ${
                statusFilter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'all' ? 'All Applicants' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-700">
                    {selectedIds.length > 0 && selectedIds.length === filteredCandidates.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Screening Status</th>
                <th className="px-4 py-3">AI Evaluation</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((cand) => {
                const isSelected = selectedIds.includes(cand.id);

                return (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleSelect(cand.id)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{cand.name}</div>
                      <div className="text-[11px] text-slate-500">{cand.location || 'Indonesia'}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cand.position}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{maskPhone(cand.phone)}</td>
                    <td className="px-4 py-3">
                      <CandidateStatusBadge status={cand.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ScreeningOutcomeBadge outcome={cand.screeningResult?.outcome} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/candidates/${cand.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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

      {/* Calling Confirmation Modal */}
      <CallConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartCalls}
        candidateNames={selectedCandidates.map((c) => c.name)}
        candidatePhones={selectedCandidates.map((c) => c.phone)}
        jobTitle={jobs[0]?.title || 'Warehouse Staff'}
        isMock={isMock}
        isLoading={isCalling}
      />

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Add Candidate to Queue</h3>
            <form onSubmit={handleAddCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Andi Pratama"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number (E.164)</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +6281234567890"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Position Applied</label>
                <input
                  type="text"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
