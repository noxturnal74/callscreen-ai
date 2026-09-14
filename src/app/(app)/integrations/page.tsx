'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Server, Check, ShieldCheck, PhoneCall, RefreshCw } from 'lucide-react';
import { AppSettings } from '@/types';

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    calleMode: 'mock',
    source: 'skills_sh',
    integration: 'skills_sh_skill',
    integrationVersion: '0.1.0',
    defaultPhoneCountry: '+62',
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  const handleSave = async (newMode?: 'mock' | 'live') => {
    setSaving(true);
    try {
      const payload = newMode ? { ...settings, calleMode: newMode } : settings;
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (newMode) setSettings(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Calling & Integrations</h1>
        <p className="text-xs text-slate-500">
          Manage telephony provider settings, switch between Sandbox and Live PSTN modes.
        </p>
      </div>

      {/* Main CALL-E Status Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">CALL-E Telephony Gateway</h3>
              <p className="text-xs text-slate-500">Autonomous voice agent over PSTN telephony</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Connected & Ready
          </span>
        </div>

        {/* Mode Selector (Section 35 / 36) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Telephony Environment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => handleSave('mock')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                settings.calleMode === 'mock'
                  ? 'bg-blue-50/60 border-blue-500 text-blue-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">Sandbox Simulator</span>
                {settings.calleMode === 'mock' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deterministic sandbox mode generating realistic multi-turn voice transcripts locally without placing real phone calls.
              </p>
            </div>

            <div
              onClick={() => handleSave('live')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                settings.calleMode === 'live'
                  ? 'bg-emerald-50/60 border-emerald-500 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">Live Outbound PSTN</span>
                {settings.calleMode === 'live' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct telephony connection via `@call-e/cli` / MCP. Places real outbound voice calls to candidate phone numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Health Matrix */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="font-semibold text-slate-800">Integration Health</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authentication: Verified</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Service: Ready</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skills.sh Tooling: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
