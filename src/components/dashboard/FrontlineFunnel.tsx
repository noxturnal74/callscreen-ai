'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Users, PhoneCall, CheckCircle2, Award } from 'lucide-react';

interface FrontlineFunnelProps {
  total: number;
  calling: number;
  screened: number;
  qualified: number;
}

export function FrontlineFunnel({ total, calling, screened, qualified }: FrontlineFunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from('.funnel-step', {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      label: '1. Candidate Queue',
      count: total,
      sub: 'Applicants Ready',
      icon: Users,
      iconColor: 'text-slate-600 bg-slate-100',
    },
    {
      label: '2. Calling / Live',
      count: calling,
      sub: 'In Progress via CALL-E',
      icon: PhoneCall,
      iconColor: calling > 0 ? 'text-blue-700 bg-blue-50 animate-pulse' : 'text-slate-600 bg-slate-100',
    },
    {
      label: '3. Screened Calls',
      count: screened,
      sub: 'Transcripts Extracted',
      icon: CheckCircle2,
      iconColor: 'text-slate-600 bg-slate-100',
    },
    {
      label: '4. Qualified Fit',
      count: qualified,
      sub: 'Ready for Human Interview',
      icon: Award,
      iconColor: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <div ref={containerRef} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Operational Screening Funnel</span>
          </h3>
          <p className="text-xs text-slate-500">
            Pipeline conversion through autonomous voice screening.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          Conversion: {screened > 0 ? Math.round((qualified / screened) * 100) : 0}% Qualified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="funnel-step p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{step.label}</span>
                <div className={`w-6 h-6 rounded flex items-center justify-center ${step.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">{step.count}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
