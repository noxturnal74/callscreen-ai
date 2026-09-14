'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ShieldCheck, User } from 'lucide-react';

export function Navbar() {
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setIsMock(data.calleMode !== 'live');
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs, or phone numbers... (⌘ K)"
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg pl-8 pr-12 py-1.5 text-xs text-slate-800 transition"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs">
          <div className={`w-2 h-2 rounded-full ${isMock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">Mode:</span>
          <span className={`font-semibold text-[11px] ${isMock ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isMock ? 'CALL-E Sandbox' : 'CALL-E Live PSTN'}
          </span>
        </div>

        <button
          title="Notifications"
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* User profile */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-800 leading-none">Albert Saputra</span>
            <span className="block text-[10px] text-slate-400 mt-0.5 leading-none">HR Recruiter</span>
          </div>
        </div>
      </div>
    </header>
  );
}
