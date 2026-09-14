'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Server, Check, Save } from 'lucide-react';
import { AppSettings } from '@/types';

export default function SettingsPage() {
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CALL-E Engine Settings</h1>
          <p className="text-xs text-slate-500">Configure telephony integration mode and telemetry parameters.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
        {/* Calling Mode Toggle */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Screening Telephony Engine</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => setSettings({ ...settings, calleMode: 'mock' })}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                settings.calleMode === 'mock'
                  ? 'bg-amber-50/50 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-sm text-slate-900 mb-1">CALL-E Sandbox Simulator</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generates realistic conversation transcripts and evaluation scorecards locally without placing real outbound phone calls.
              </p>
            </div>

            <div
              onClick={() => setSettings({ ...settings, calleMode: 'live' })}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                settings.calleMode === 'live'
                  ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-sm text-slate-900 mb-1">CALL-E Live Outbound PSTN</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connects directly to `@call-e/cli` / MCP server to place real phone calls to candidate phone numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Headers */}
        <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-slate-800">CALL-E Attribution & Telemetry</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">CALLE_SOURCE</label>
              <input
                type="text"
                value={settings.source}
                onChange={(e) => setSettings({ ...settings, source: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">CALLE_INTEGRATION</label>
              <input
                type="text"
                value={settings.integration}
                onChange={(e) => setSettings({ ...settings, integration: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">VERSION</label>
              <input
                type="text"
                value={settings.integrationVersion}
                onChange={(e) => setSettings({ ...settings, integrationVersion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
