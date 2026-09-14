'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { PhoneCall, Sparkles, Clock } from 'lucide-react';
import { Candidate } from '@/types';

interface LiveCallTrackerProps {
  callRunId: string;
  candidate: Candidate;
  onCallCompleted: () => void;
}

export function LiveCallTracker({ callRunId, candidate, onCallCompleted }: LiveCallTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const [callState, setCallState] = useState<{
    status: string;
    durationSeconds: number;
    transcript: string;
  }>({
    status: 'calling',
    durationSeconds: 0,
    transcript: 'Menghubungkan panggilan...',
  });

  useEffect(() => {
    if (!waveRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to('.wave-bar', {
          scaleY: 1.6,
          duration: 0.35,
          stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true,
          },
          ease: 'power1.inOut',
        });
      });
    }, waveRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let interval: any = null;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/calls/${callRunId}`);
        if (!res.ok) return;
        const data = await res.json();
        setCallState({
          status: data.status,
          durationSeconds: data.durationSeconds || 0,
          transcript: data.transcript || '',
        });

        if (data.status === 'completed') {
          clearInterval(interval);
          onCallCompleted();
        }
      } catch (e) {
        console.error('Error polling call status:', e);
      }
    };

    pollStatus();
    interval = setInterval(pollStatus, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callRunId, onCallCompleted]);

  return (
    <div ref={containerRef} className="bg-white border border-blue-200 rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">Live AI Screening in Progress</h4>
              <span className="text-[10px] uppercase font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                CALL-E Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate: <span className="text-slate-800 font-semibold">{candidate.name}</span> ({candidate.phone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Wave Visualizer */}
          <div ref={waveRef} className="hidden sm:flex items-center gap-1 h-5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200">
            {[0.6, 1, 0.4, 0.9, 0.5, 0.8, 0.3].map((h, i) => (
              <div
                key={i}
                className="wave-bar w-1 bg-blue-600 rounded-full"
                style={{ height: `${h * 14}px` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{Math.floor(callState.durationSeconds / 60)}:{(callState.durationSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-600" /> Live Speech Streaming Transcript
        </span>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {callState.transcript}
        </div>
      </div>
    </div>
  );
}
