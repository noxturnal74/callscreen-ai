'use client';

import React, { useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle2, Clock, MapPin, Phone, Briefcase, Plus, Filter } from 'lucide-react';
import { Candidate } from '@/types';

interface EmployeeItem {
  id: string;
  name: string;
  nik: string;
  role: string;
  department: string;
  assignedShift: string;
  status: 'Permanent' | 'Contract' | 'Probation';
  joinDate: string;
}

export default function EmployeesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([
    { id: 'emp_1', name: 'Andi Pratama', nik: 'EMP-2026-001', role: 'Warehouse Staff', department: 'Logistics', assignedShift: 'SHIFT PAGI (07:00-15:00)', status: 'Contract', joinDate: '12 Sep 2026' },
    { id: 'emp_2', name: 'Budi Santoso', nik: 'EMP-2026-002', role: 'Warehouse Operator', department: 'Logistics', assignedShift: 'SHIFT MALAM (15:00-23:00)', status: 'Probation', joinDate: '13 Sep 2026' },
    { id: 'emp_3', name: 'Siti Rahma', nik: 'EMP-2026-003', role: 'Store Crew', department: 'Retail Operations', assignedShift: 'NON SHIFT (08:00-17:00)', status: 'Permanent', joinDate: '10 Aug 2026' },
  ]);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then((data: Candidate[]) => {
        setCandidates(data.filter(c => c.status === 'completed' && c.screeningResult?.outcome === 'Qualified'));
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Karyawan & Roster (SemartHRIS)</h1>
        <p className="text-xs text-slate-500">
          Kelola data penempatan karyawan aktif hasil seleksi AI voice screening CALL-E.
        </p>
      </div>

      {/* Roster Metrics (Hrismi style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Status Kepegawaian</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">50</span>
            <span className="text-xs text-slate-400">Total Karyawan</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-blue-600 h-full w-[20%]" title="Permanent: 10" />
            <div className="bg-blue-400 h-full w-[80%]" title="Contract: 40" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
            <span>Permanent: 10 (20%)</span>
            <span>Contract: 40 (80%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Kandidat Siap Diangkat (Qualified)</span>
          <div className="text-2xl font-bold text-emerald-700">{candidates.length}</div>
          <p className="text-[11px] text-slate-400">Telah lulus verifikasi suara CALL-E</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Departemen Operasional</span>
          <div className="text-2xl font-bold text-slate-900">Logistics & Supply Chain</div>
          <p className="text-[11px] text-slate-400">Penempatan Cabang: Malang & Jawa Timur</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Daftar Karyawan Aktif</h3>
          <span className="text-xs text-slate-400 font-medium">{employees.length} Karyawan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">NIK</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Departemen</th>
                <th className="px-4 py-3">Alokasi Shift</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Gabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{emp.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{emp.nik}</td>
                  <td className="px-4 py-3 text-slate-700">{emp.role}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.department}</td>
                  <td className="px-4 py-3 font-mono text-blue-700 font-medium">{emp.assignedShift}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{emp.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
