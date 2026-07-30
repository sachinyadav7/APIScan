'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import type { Plan, UsageResponse, ApiResponse } from '@/lib/types';

export default function BillingPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Plan[]>>('/api/billing/plans');
      return data.data;
    },
  });

  const { data: usage } = useQuery({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UsageResponse>>(`/api/orgs/${orgId}/billing/usage`);
      return data.data;
    },
    enabled: !!orgId,
  });

  const handleCheckout = async (priceId: string) => {
    try {
      const { data } = await api.post<ApiResponse<{ url: string }>>('/api/billing/checkout', { priceId });
      window.location.href = data.data.url;
    } catch { /* handle error */ }
  };

  const handlePortal = async () => {
    try {
      const { data } = await api.post<ApiResponse<{ url: string }>>('/api/billing/portal');
      window.location.href = data.data.url;
    } catch { /* handle error */ }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section>
         <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block font-label">Enterprise</span>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-on-surface font-headline">Subscription & Quotas</h1>
         <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-body mt-2">
            Manage your organization&apos;s API scan limits, billing cycles, and active service tiers.
         </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {usage && (
            <div className="bg-surface-container-lowest border text-left border-outline-variant/20 rounded-2xl p-8 relative overflow-hidden shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary-container text-primary">
                     <span className="material-symbols-outlined text-[24px]">electric_bolt</span>
                   </div>
                   <div>
                     <h3 className="font-headline text-xl font-bold text-on-surface">Monthly Scans</h3>
                     <p className="text-sm font-medium text-on-surface-variant">Resource utilization for current cycle</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="font-headline text-3xl font-black text-primary">{usage.usedQuota}</span>
                   <span className="text-sm font-bold text-on-surface-variant"> / {usage.monthlyQuota}</span>
                 </div>
               </div>
               
               <div className="h-4 rounded-full bg-surface-container overflow-hidden">
                 <div
                   className={cn(
                     'h-full rounded-full transition-all duration-1000 ease-out shadow-sm',
                     usage.usagePercentage > 90 ? 'bg-error' : usage.usagePercentage > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary to-[#2563eb]'
                   )}
                   style={{ width: `${Math.max(2, Math.min(usage.usagePercentage, 100))}%` }}
                 />
               </div>
               
               <div className="flex justify-between items-center mt-4">
                 <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label">
                   {usage.remainingQuota} Operations Remaining
                 </p>
                 <p className={cn(
                   "text-[11px] font-black uppercase tracking-widest font-label",
                   usage.usagePercentage > 90 ? 'text-error' : usage.usagePercentage > 70 ? 'text-amber-600' : 'text-primary'
                 )}>
                   {usage.usagePercentage}% Consumed
                 </p>
               </div>
            </div>
          )}

          {currentOrg && currentOrg.tier !== 'FREE' && (
            <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-primary">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-3">
                  Active Tier: 
                  <span className="bg-primary text-white px-3 py-1 rounded text-xs tracking-wider uppercase font-black">{currentOrg.tier}</span>
                </h3>
                <p className="text-sm font-medium text-on-surface-variant mt-2 max-w-sm">Manage payment instruments, historical invoices, and billing lifecycle through our secure portal.</p>
              </div>
              <button
                onClick={handlePortal}
                className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 px-6 py-4 text-sm font-bold text-on-surface hover:text-primary transition-all shadow-sm hover:shadow-md active:scale-95 group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">open_in_new</span>
                Access Portal
              </button>
            </div>
          )}
        </div>

        <div className="bg-on-surface p-8 rounded-2xl flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden h-full min-h-[250px] shadow-lg">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/30 rounded-full blur-[50px] pointer-events-none" />
          <div className="h-14 w-14 rounded-full bg-white/10 p-[1px] mb-2 flex items-center justify-center backdrop-blur-md">
             <span className="material-symbols-outlined text-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          </div>
          <h3 className="font-headline text-xl font-bold text-white">Enterprise Ready</h3>
          <p className="text-sm font-medium text-outline-variant">
            Dedicated infrastructure, custom SLAs, and infinite scan capacity for corporate networks.
          </p>
          <a href="#" className="text-primary-fixed-dim text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5 pt-4">
            Contact Architecture Team <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">Service Volumes</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {(plans || []).map((plan, index) => {
            const isCurrent = currentOrg?.tier === plan.tier;
            const isPopular = index === 1;
            
            return (
              <div
                key={plan.tier}
                className={cn(
                  'bg-surface-container-lowest rounded-2xl p-8 flex flex-col relative transition-all duration-300 border shadow-sm',
                  isPopular ? 'border-primary shadow-lg scale-[1.02] z-10' : 'border-outline-variant/20 hover:border-primary/30 hover:shadow-md'
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-md">
                    Professional Standard
                  </div>
                )}
                
                <div className="flex flex-col mb-8 relative z-10">
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">{plan.tier}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline text-5xl font-black text-on-surface">${plan.price}</span>
                    <span className="text-sm font-bold text-on-surface-variant">/ mo</span>
                  </div>
                </div>
                
                <ul className="flex-1 space-y-5 mb-10 relative z-10">
                  {[
                     { text: `${plan.scans} automated scans`, highlight: true },
                     { text: `${plan.members} concurrent analysts`, highlight: true },
                     { text: `${plan.projects} project environments`, highlight: true },
                     { text: 'Diagnostic JSON / PDF Exports', highlight: false },
                     ...(index >= 1 ? [{ text: 'Priority SLA Support', highlight: false }] : []),
                     ...(index === 2 ? [{ text: 'On-Premise Deployment Engine', highlight: false }] : [])
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`material-symbols-outlined text-[18px] shrink-0 ${isPopular ? "text-primary" : "text-outline-variant"}`}>
                        check_circle
                      </span>
                      <span className={`text-sm tracking-wide ${item.highlight ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => plan.priceId && handleCheckout(plan.priceId)}
                  disabled={isCurrent || !plan.priceId}
                  className={cn(
                    'w-full rounded-xl px-4 py-4 text-sm font-bold tracking-widest uppercase transition-all relative z-10 flex items-center justify-center gap-2',
                    isCurrent
                      ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                      : isPopular
                        ? 'bg-primary text-white shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5'
                        : index === 2
                          ? 'bg-on-surface text-white hover:opacity-90 hover:-translate-y-0.5'
                          : 'bg-surface-container-lowest border-2 border-outline-variant/30 text-on-surface hover:border-primary/30 hover:bg-surface-container-low'
                  )}
                >
                  {isCurrent ? 'Current Tier' : plan.price === 0 ? 'Initialize Free' : 'Execute Upgrade'}
                  {!isCurrent && <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
