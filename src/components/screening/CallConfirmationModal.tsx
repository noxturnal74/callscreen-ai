'use client';

import React from 'react';
import { PhoneCall, X, Shield } from 'lucide-react';

interface CallConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateNames: string[];
  candidatePhones: string[];
  jobTitle: string;
  isMock: boolean;
  isLoading?: boolean;
}

export function CallConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  candidateNames,
  candidatePhones,
  jobTitle,
  isMock,
  isLoading = false,
}: CallConfirmationModalProps) {
  if (!isOpen) return null;

  const count = candidateNames.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Confirm AI Phone Screening</h3>
              <p className="text-[11px] text-slate-400">CALL-E Outbound Telephony Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Target Position:</span>
              <span className="font-semibold text-slate-800">{jobTitle}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Total Candidates:</span>
              <span className="font-semibold text-blue-700">{count} applicant{count > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Screening Engine:</span>
              <span className={`font-semibold ${isMock ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isMock ? 'CALL-E Sandbox Simulator' : 'CALL-E Live PSTN Outbound'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Candidates to Call:</span>
            <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
              {candidateNames.map((name, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
                  <span className="font-medium text-slate-800">{name}</span>
                  <span className="font-mono text-slate-500">{candidatePhones[i] || 'No phone'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isMock
                ? 'Sandbox Mode Active: Simulates realistic 2-way conversation & structured extraction without dialing real phone numbers.'
                : 'Live PSTN Calling: CALL-E will dial these numbers immediately and conduct conversational voice interviews.'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching CALL-E...</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Launch {count} Call{count > 1 ? 's' : ''} Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
