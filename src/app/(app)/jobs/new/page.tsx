'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Logistics & Warehouse');
  const [location, setLocation] = useState('Malang');
  const [shift, setShift] = useState('Sistem Shift (Pagi / Malam)');
  const [salaryRange, setSalaryRange] = useState('Rp3.000.000 - Rp4.000.000');
  const [experienceRequired, setExperienceRequired] = useState('0 - 2 tahun');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const defaultQuestions = [
        { id: 'q1', order: 1, question: 'Silakan perkenalkan diri dan posisi yang dilamar.', key: 'name_role' },
        { id: 'q2', order: 2, question: 'Apakah memiliki pengalaman kerja terkait posisi ini?', key: 'experience' },
        { id: 'q3', order: 3, question: 'Di mana lokasi domisili saat ini dan akses transportasi ke lokasi?', key: 'location' },
        { id: 'q4', order: 4, question: 'Apakah bersedia bekerja dengan sistem shift pagi dan malam?', key: 'shift' },
        { id: 'q5', order: 5, question: 'Berapa ekspektasi gaji bulanan yang diharapkan?', key: 'salary' },
      ];

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          department,
          location,
          shift,
          salaryRange,
          experienceRequired,
          questions: defaultQuestions,
        }),
      });

      if (res.ok) {
        router.push('/jobs');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Create Frontline Job Opening</h1>
          <p className="text-xs text-slate-400">Add a new role and configure AI screening requirements.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Warehouse Staff, Delivery Driver, Store Crew"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Shift Info</label>
              <input
                type="text"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
