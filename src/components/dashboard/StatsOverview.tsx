'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Users, PhoneCall, CheckCircle2, HelpCircle, XCircle, Clock } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalCandidates: number;
    pendingScreening: number;
    callsCompleted: number;
    qualified: number;
    maybe: number;
    notFit: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from('.stat-card', {
          y: 10,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  const screened = stats.callsCompleted;
  const pct = (n: number) => (screened > 0 ? `${Math.round((n / screened) * 100)}% of screened` : 'No screenings yet');
  const cards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      hint: stats.pendingScreening > 0 ? `${stats.pendingScreening} waiting in queue` : 'Queue clear',
      icon: Users,
      iconColor: 'text-slate-600 bg-slate-100',
      textColor: 'text-slate-900',
    },
    {
      title: 'Pending Screening',
      value: stats.pendingScreening,
      hint: 'Ready or queued',
      icon: Clock,
      iconColor: 'text-amber-700 bg-amber-50',
      textColor: 'text-slate-900',
    },
    {
      title: 'Calls Completed',
      value: stats.callsCompleted,
      hint: screened > 0 ? `${screened} transcripts stored` : 'Start your first call',
      icon: PhoneCall,
      iconColor: 'text-blue-700 bg-blue-50',
      textColor: 'text-slate-900',
    },
    {
      title: 'Qualified Fit',
      value: stats.qualified,
      hint: pct(stats.qualified),
      icon: CheckCircle2,
      iconColor: 'text-emerald-700 bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Maybe / Review',
      value: stats.maybe,
      hint: pct(stats.maybe),
      icon: HelpCircle,
      iconColor: 'text-amber-700 bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Not Fit',
      value: stats.notFit,
      hint: pct(stats.notFit),
      icon: XCircle,
      iconColor: 'text-rose-700 bg-rose-50',
      textColor: 'text-rose-700',
    },
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="stat-card p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-300 transition-all duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className={`text-2xl font-bold tracking-tight ${card.textColor}`}>{card.value}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.hint}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
