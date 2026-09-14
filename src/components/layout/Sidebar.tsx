'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  PhoneForwarded, 
  History,
  BarChart3,
  Layers,
  Settings, 
  PhoneCall,
  Clock,
  UserCheck,
  CalendarCheck
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'AI Phone Screening',
    items: [
      { href: '/screening', label: 'AI Screenings', icon: PhoneForwarded, badge: 'Live' },
      { href: '/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/candidates', label: 'Candidates', icon: Users },
    ]
  },
  {
    title: 'SemartHRIS Operations',
    items: [
      { href: '/shifts', label: 'Shift Kerja', icon: Clock },
      { href: '/employees', label: 'Data Karyawan', icon: UserCheck },
    ]
  },
  {
    title: 'Activity & Stats',
    items: [
      { href: '/history', label: 'Call History', icon: History },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'System',
    items: [
      { href: '/integrations', label: 'Integrations', icon: Layers },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[230px] border-r border-slate-200 bg-white flex flex-col justify-between p-3.5 hidden md:flex shrink-0">
      <div className="space-y-5">
        {/* Brand header */}
        <div className="px-2 pt-1 pb-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">CallScreen AI</span>
              <span className="text-[10px] text-slate-400 font-medium block">SemartHRIS & CALL-E</span>
            </div>
          </Link>
        </div>

        {/* Categorized Navigation */}
        <div className="space-y-3.5">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-0.5">
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* CALL-E Engine Status Widget */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            CALL-E
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Connected
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Telephony Gateway Active.
        </p>
      </div>
    </aside>
  );
}
