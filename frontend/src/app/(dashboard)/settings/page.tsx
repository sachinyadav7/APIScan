'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="mb-10">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">System Preferences</h1>
        <p className="text-sm text-on-surface-variant mt-2 font-body">Configure local account parameters, authentication credentials, and telemetry alerts.</p>
      </section>

      {/* Profile section */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 p-8 rounded-2xl shadow-sm mb-6">
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20 mb-6">
          <span className="material-symbols-outlined text-primary text-[24px]">manage_accounts</span>
          <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">Identity Matrix</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1 font-label">Display Alias</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full rounded-xl border-none bg-surface-container-low px-5 py-4 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1 font-label">Registered Endpoint (Email)</label>
            <div className="relative">
               <input
                 type="email"
                 defaultValue={user?.email || ''}
                 disabled
                 className="w-full rounded-xl border border-outline-variant/20 bg-surface-container px-5 py-4 text-sm font-medium text-on-surface-variant cursor-not-allowed opacity-80"
               />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">lock</span>
            </div>
          </div>
          <div className="md:col-span-2 pt-2">
            <button className="bg-primary hover:bg-primary-dim px-8 py-3 rounded-lg text-sm font-bold tracking-wide text-white transition-all shadow-md active:scale-95 inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span> Apply Changes
            </button>
          </div>
        </div>
      </div>

      {/* Security section */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 p-8 rounded-2xl shadow-sm mb-6">
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20 mb-6">
          <span className="material-symbols-outlined text-primary text-[24px]">security</span>
          <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">Access Protocols</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1 font-label">Current Cipher Key</label>
            <input type="password" placeholder="••••••••"
              className="w-full rounded-xl border-none bg-surface-container-low px-5 py-4 text-sm font-medium text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1 font-label">New Cipher Key</label>
            <input type="password" placeholder="Minimum 8 symbols"
              className="w-full rounded-xl border-none bg-surface-container-low px-5 py-4 text-sm font-medium text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button className="bg-surface-container-lowest hover:bg-surface-container border-2 border-outline-variant/30 px-8 py-3 rounded-lg text-sm font-bold tracking-wide text-on-surface transition-all hover:border-primary/30 inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">key</span> Rotate Key
            </button>
          </div>
        </div>
      </div>

      {/* Notifications section */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 p-8 rounded-2xl shadow-sm mb-6">
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20 mb-6">
          <span className="material-symbols-outlined text-primary text-[24px]">notifications_active</span>
          <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">Telemetry Output</h2>
        </div>
        <div className="space-y-1">
          {[
            { label: 'Diagnostic Completed', description: 'Receive broadcast when a deep scan finalizes.' },
            { label: 'Critical Threat Detected', description: 'Immediate alert on critical severity structural findings.' },
            { label: 'Quota Threshold Warning', description: 'Warn when scanning operations approach monthly capacity.' },
          ].map((item, idx) => (
            <div key={item.label} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-surface transition-colors ${idx !== 2 ? 'mb-2' : ''}`}>
               <div>
                 <p className="text-sm font-bold text-on-surface">{item.label}</p>
                 <p className="text-[13px] text-on-surface-variant font-medium">{item.description}</p>
               </div>
               <label className="relative inline-flex cursor-pointer items-center mt-4 sm:mt-0">
                 <input type="checkbox" defaultChecked className="peer sr-only" />
                 <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
               </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-error-container/20 border border-error/30 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 pb-6 border-b border-error/20 mb-6">
          <span className="material-symbols-outlined text-error text-[24px]">warning</span>
          <h2 className="font-headline font-bold text-xl text-error tracking-tight">Destructive Actions</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4">
          <div>
            <p className="text-sm font-bold text-on-surface">Terminate Account</p>
            <p className="text-[13px] text-on-surface-variant font-medium max-w-sm">Permanently wipe your identity matrix and purge all historical vulnerability records from our core storage.</p>
          </div>
          <button className="bg-surface-container-lowest border-2 border-error px-6 py-3 rounded-lg text-sm font-black uppercase tracking-widest text-error hover:bg-error hover:text-white transition-all shrink-0">
            Terminate
          </button>
        </div>
      </div>
    </div>
  );
}
