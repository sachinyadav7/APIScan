'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">lens</span>
        <h1 className="text-xl font-black text-on-surface tracking-tighter font-headline">APIScan</h1>
      </div>
      <div className="flex items-center gap-4 relative">
        <div className="hidden md:flex gap-6 mr-8">
          <Link href="/dashboard" className={pathname.startsWith('/dashboard') ? 'text-primary font-bold font-headline' : 'text-on-surface-variant hover:bg-primary-container transition-colors px-2 py-1 rounded font-headline'}>Dashboard</Link>
          <Link href="/projects" className={pathname.startsWith('/projects') ? 'text-primary font-bold font-headline px-2 py-1 bg-primary-container rounded' : 'text-on-surface-variant hover:bg-primary-container transition-colors px-2 py-1 rounded font-headline'}>Projects</Link>
          <Link href="/scanner" className={pathname.startsWith('/scanner') ? 'text-primary font-bold font-headline px-2 py-1 bg-primary-container rounded' : 'text-on-surface-variant hover:bg-primary-container transition-colors px-2 py-1 rounded font-headline'}>Scanner</Link>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden font-bold text-primary shadow-sm border border-outline-variant/30 hover:ring-2 ring-primary/50 transition-all cursor-pointer focus:outline-none"
          >
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-md shadow-lg py-1 border border-outline-variant/20 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/10 mb-1">
                <p className="text-sm font-bold text-on-surface truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
              </div>
              <Link 
                href="/settings" 
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                </span>
              </Link>
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left block px-4 py-2 text-sm text-error hover:bg-error-container/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
