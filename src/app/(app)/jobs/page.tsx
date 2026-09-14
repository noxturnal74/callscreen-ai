'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Briefcase, MapPin, DollarSign, Clock, Plus, ArrowRight } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Jobs & Screening Criteria</h1>
          <p className="text-xs text-slate-500">
            Define frontline position requirements and customize the 5 core AI screening questions.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job Opening</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 space-y-4 shadow-xs transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {job.department}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="p-1.5 rounded-md bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.shift}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.salaryRange}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {job.questions?.length || 5} AI Screening Questions
              </span>
              <Link
                href={`/jobs/${job.id}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Edit Setup & Script →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
