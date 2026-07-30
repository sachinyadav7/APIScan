'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import Sidebar from '@/components/layout/sidebar';
import TopBar from '@/components/layout/top-bar';
import api from '@/lib/api';
import type { Organization, ApiResponse } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, hydrate, currentOrg, setCurrentOrg } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isMounted) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, isMounted]);

  // Fetch user's organizations once authenticated
  const { data: orgs } = useQuery({
    queryKey: ['userOrgs'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Organization[]>>('/api/orgs');
      return data.data;
    },
    enabled: isAuthenticated && !currentOrg,
  });

  useEffect(() => {
    if (orgs && orgs.length > 0 && !currentOrg) {
      setCurrentOrg(orgs[0]);
    }
  }, [orgs, currentOrg, setCurrentOrg]);

  if (isLoading || !isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg">
             <span className="material-symbols-outlined text-3xl">clinical_notes</span>
           </div>
          <p className="text-sm font-medium text-on-surface-variant tracking-wide font-body">Initializing workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <TopBar />
      <Sidebar />
      <main className="md:ml-64 pt-24 pb-20 md:pb-10 px-6 lg:px-10 min-h-screen">
        {children}
      </main>
      
      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 w-full z-50 md:hidden bg-surface-container-lowest/90 backdrop-blur-lg flex justify-around items-center px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-outline-variant/20">
        <a className="flex flex-col items-center justify-center text-primary bg-primary-container rounded-xl px-3 py-1" href="/dashboard">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="/projects">
          <span className="material-symbols-outlined">folder</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Projects</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="/scanner">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Scan</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="/reports">
          <span className="material-symbols-outlined">description</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest mt-1">Reports</span>
        </a>
      </nav>
    </>
  );
}
