'use client';

import React, { useState } from 'react';
import { Clock, Plus, Search, Filter, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

interface ShiftItem {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  isNightShift: boolean;
  isActive: boolean;
}

const INITIAL_SHIFTS: ShiftItem[] = [
  { id: '1', code: 'NSFT', name: 'NON SHIFT (REGULER)', startTime: '08:00', endTime: '17:00', isNightShift: false, isActive: true },
  { id: '2', code: 'SH-PAGI', name: 'SHIFT PAGI WAREHOUSE', startTime: '07:00', endTime: '15:00', isNightShift: false, isActive: true },
  { id: '3', code: 'SH-MLM', name: 'SHIFT MALAM WAREHOUSE', startTime: '15:00', endTime: '23:00', isNightShift: true, isActive: true },
  { id: '4', code: 'SH-MID', name: 'SHIFT DINI HARI', startTime: '23:00', endTime: '07:00', isNightShift: true, isActive: true },
];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<ShiftItem[]>(INITIAL_SHIFTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('08:00');
  const [newEnd, setNewEnd] = useState('17:00');
  const [isNight, setIsNight] = useState(false);

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ShiftItem = {
      id: Date.now().toString(),
      code: newCode.toUpperCase(),
      name: newName,
      startTime: newStart,
      endTime: newEnd,
      isNightShift: isNight,
      isActive: true,
    };
    setShifts([...shifts, item]);
    setShowAddModal(false);
    setNewCode('');
    setNewName('');
  };

  const handleDelete = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  const filtered = shifts.filter(s => 
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Shift Kerja (SemartHRIS)</h1>
          <p className="text-xs text-slate-500">
            Daftar jam kerja dan kode shift untuk alokasi penempatan kandidat frontline yang lolos screening CALL-E.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Shift Kerja</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode shift atau nama shift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 transition"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">Total: {shifts.length} Shift</span>
      </div>

      {/* Table (SemartHris Shiftment style) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Kode Shift</th>
                <th className="px-4 py-3">Nama Shift</th>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3">Jam Pulang</th>
                <th className="px-4 py-3">Tipe Shift</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{s.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{s.startTime}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{s.endTime}</td>
                  <td className="px-4 py-3">
                    {s.isNightShift ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Shift Malam
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        Reguler Pagi
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Hapus Shift"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Shift */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Shift Kerja Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddShift} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kode Shift (cth: SH-SORE)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="KODE SHIFT"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Shift</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="cth: SHIFT SORE PACKING GUDANG"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jam Masuk</label>
                  <input
                    type="time"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jam Pulang</label>
                  <input
                    type="time"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nightshift"
                  checked={isNight}
                  onChange={(e) => setIsNight(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="nightshift" className="text-slate-700 cursor-pointer">
                  Tandai sebagai shift malam (kandidat perlu diverifikasi ketersediaan malam)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                >
                  Simpan Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
