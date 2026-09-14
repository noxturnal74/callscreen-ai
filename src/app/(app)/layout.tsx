import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

const MOBILE_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/screening', label: 'AI Screenings' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/candidates', label: 'Candidates' },
  { href: '/shifts', label: 'Shift Kerja' },
  { href: '/employees', label: 'Data Karyawan' },
  { href: '/history', label: 'History' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/settings', label: 'Settings' },
];

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <nav id="app-sidebar-mobile" aria-label="Mobile Navigation" className="md:hidden border-b border-slate-200 bg-white px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 shrink-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/60">
          {children}
        </main>
      </div>
    </div>
  );
}
