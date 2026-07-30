'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/projects', label: 'Projects', icon: 'folder_open' },
  { href: '/scanner', label: 'Scanner', icon: 'troubleshoot' },
  { href: '/reports', label: 'Reports', icon: 'analytics' },
  { href: '/team', label: 'Team', icon: 'group' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="h-full w-64 fixed left-0 top-0 hidden md:block bg-surface z-40">
      <div className="flex flex-col gap-2 p-6 mt-20 h-full bg-surface-container">
        <div className="mb-6 px-4">
          <p className="font-headline font-bold text-primary uppercase tracking-widest text-[10px]">Main Menu</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-body font-medium text-sm transition-transform hover:translate-x-1 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container border-l-4 border-primary rounded-r-lg'
                    : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-surface-container-lowest/50 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">System Status</span>
          </div>
          <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[94%]"></div>
          </div>
          <p className="text-[10px] mt-2 text-on-surface-variant font-medium">94% Compliance</p>
        </div>

        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-body font-medium text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
