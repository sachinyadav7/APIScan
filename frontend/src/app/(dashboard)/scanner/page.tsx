'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { formatDuration, formatDate } from '@/lib/utils';
import type { ScanResponse, ApiResponse, ScanStatusResponse } from '@/lib/types';

const scanSchema = z.object({
  targetUrl: z.string().min(1, 'Enter a valid URL'),
  method: z.string().min(1, 'Select a method'),
});

type ScanForm = z.infer<typeof scanSchema>;
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

export default function ScannerPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanForm>({
    resolver: zodResolver(scanSchema),
    defaultValues: { method: 'GET' },
  });

  const triggerScan = useMutation({
    mutationFn: async (data: ScanForm) => {
      const { data: res } = await api.post<ApiResponse<ScanResponse>>(
        `/api/orgs/${orgId}/scans`,
        { targetUrl: data.targetUrl, method: data.method }
      );
      return res.data;
    },
    onSuccess: (scan) => {
      setActiveScanId(scan.id);
      setScanResult(null);
    },
  });

  useQuery({
    queryKey: ['scanStatus', activeScanId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ScanStatusResponse>>(`/api/orgs/${orgId}/scans/${activeScanId}/status`);
      return data.data;
    },
    enabled: !!activeScanId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') {
        fetchScanResult(activeScanId!);
        return false;
      }
      return 2000;
    },
  });

  const fetchScanResult = async (scanId: string) => {
    try {
      const { data } = await api.get<ApiResponse<ScanResponse>>(`/api/orgs/${orgId}/scans/${scanId}`);
      setScanResult(data.data);
      setActiveScanId(null);
    } catch { /* ignore */ }
  };

  const onSubmit = (data: ScanForm) => triggerScan.mutate(data);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-4xl mx-auto py-12">
      {/* Decorative Background Element */}
      <div className="fixed bottom-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-20 z-[-1]">
        <div className="w-full h-full bg-gradient-to-t from-primary/10 to-transparent mix-blend-overlay border border-red-500"></div>
      </div>

      <div className="text-center max-w-2xl mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-primary font-bold text-xs rounded-full mb-4">
          <span className="material-symbols-outlined text-sm">bolt</span>
          ADVANCED DIAGNOSTICS
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-6 tracking-tight">Clinical API Intelligence.</h2>
        <p className="font-body text-on-surface-variant leading-relaxed">
          Execute a deep-tissue diagnostic of your API surface. Uncover SQL injections, structural vulnerabilities, and architectural leaks with surgical precision.
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest p-2 rounded-xl shadow-[0px_12px_32px_rgba(13,28,46,0.06)] flex flex-col md:flex-row gap-2 border border-outline-variant/15">
          <div className="w-full md:w-32 relative flex items-center border-b md:border-b-0 md:border-r border-outline-variant/20">
            <select
               {...register('method')}
               className="w-full pl-4 pr-8 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface font-bold appearance-none cursor-pointer"
            >
               {HTTP_METHODS.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
            <span className="absolute right-3 material-symbols-outlined text-outline-variant pointer-events-none">expand_more</span>
          </div>

          <div className="flex-1 relative flex items-center">
            <div className="absolute left-4 text-outline-variant">
              <span className="material-symbols-outlined">link</span>
            </div>
            <input 
              {...register('targetUrl')}
              className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface font-body placeholder:text-outline-variant" 
              placeholder="https://api.vanguard-logistics.com/v1" 
              type="text"
            />
          </div>
          
          <button 
             type="submit"
             disabled={triggerScan.isPending || !!activeScanId}
             className="bg-gradient-to-br from-primary to-primary-dim text-white font-bold py-4 px-8 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {triggerScan.isPending || activeScanId ? (
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            ) : (
                <>
                  Start Scan
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </>
            )}
          </button>
        </form>
        {errors.targetUrl && <p className="text-xs font-medium text-error pl-4">{errors.targetUrl.message}</p>}
        {triggerScan.isError && <p className="text-xs font-medium text-error pl-4">Failed to execute scan.</p>}

        {/* Analysis State (The "Security Pulse") */}
        {activeScanId && (
          <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-lg border border-outline-variant/10 relative overflow-hidden animate-in">
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary tracking-widest uppercase font-label">Live Diagnostic Pulse</p>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Analyzing API architecture...</h3>
                </div>
                <div className="text-right">
                  <span className="font-headline text-2xl font-extrabold text-primary animate-pulse">Running</span>
                </div>
              </div>
              <div className="w-full h-1 bg-outline-variant/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-primary w-full shadow-[0_0_8px_rgba(0,74,198,0.5)] animate-pulse rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 py-2 px-4 bg-surface-container-low rounded-lg border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-xs font-medium text-on-surface-variant">Schema Validation</span>
                </div>
                <div className="flex items-center gap-3 py-2 px-4 bg-surface-container-low rounded-lg border border-outline-variant/5">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-xs font-medium text-on-surface-variant">Auth Pattern Matching</span>
                </div>
                <div className="flex items-center gap-3 py-2 px-4 bg-surface-container-high rounded-lg border border-primary/10">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs font-bold text-primary">Injecting SQL Payloads...</span>
                </div>
                <div className="flex items-center gap-3 py-2 px-4 bg-surface-container-low rounded-lg border border-outline-variant/5 opacity-50">
                  <span className="material-symbols-outlined text-outline-variant text-sm">pending</span>
                  <span className="text-xs font-medium text-on-surface-variant">Sensitive Data Leakage Test</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 blur-3xl rounded-full z-0"></div>
          </div>
        )}

        {/* Scan Results (Adapted) */}
        {scanResult && !activeScanId && (
           <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in-95">
             <div className="p-8 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between gap-6 relative">
                 <div className={`absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none ${scanResult.vulnerabilities.length > 0 ? 'bg-error' : 'bg-primary'}`}></div>
                 <div className="flex items-center gap-5 relative z-10">
                   <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-sm ${scanResult.vulnerabilities.length > 0 ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
                      <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>{scanResult.vulnerabilities.length > 0 ? 'warning' : 'verified_user'}</span>
                   </div>
                   <div>
                     <h2 className="text-2xl font-extrabold text-on-surface font-headline">{scanResult.vulnerabilities.length} Threat{scanResult.vulnerabilities.length !== 1 ? 's' : ''} Detected</h2>
                     <div className="flex items-center gap-2 mt-1 text-sm font-medium text-on-surface-variant">
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-high uppercase">{scanResult.method}</span>
                       <span className="truncate">{scanResult.targetUrl}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex gap-6 items-center bg-surface px-6 py-4 rounded-xl border border-outline-variant/10">
                    <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest font-label">Duration</p>
                      <p className="text-sm font-semibold text-on-surface">{formatDuration(scanResult.durationMs)}</p>
                    </div>
                    <div className="w-px h-8 bg-outline-variant/30"></div>
                    <div>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest font-label">Date</p>
                      <p className="text-sm font-semibold text-on-surface">{formatDate(scanResult.createdAt).split(',')[0]}</p>
                    </div>
                 </div>
             </div>

             {scanResult.vulnerabilities.length > 0 && (
                <div className="p-8 space-y-6 bg-surface-container-low">
                   {scanResult.vulnerabilities.map(vuln => (
                      <div key={vuln.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container">
                           <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-sm ${
                                  vuln.severity === 'CRITICAL' ? 'bg-error text-white' : 
                                  vuln.severity === 'HIGH' ? 'bg-error-container text-on-error-container' : 
                                  vuln.severity === 'MEDIUM' ? 'bg-surface-variant text-on-surface' :
                                  'bg-primary-container text-primary'
                               }`}>
                                 {vuln.severity} Risk
                              </span>
                              <h4 className="text-lg font-bold text-on-surface font-headline">{vuln.type}</h4>
                           </div>
                           {vuln.confidence && (
                              <div className="flex items-center gap-1.5" title="Detection Confidence">
                                 <span className="material-symbols-outlined text-[16px] text-primary">radar</span>
                                 <span className="text-xs font-bold text-primary font-mono">{vuln.confidence}%</span>
                              </div>
                           )}
                        </div>
                        <div className="p-6">
                           <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{vuln.description}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {vuln.evidence && (
                                <div className="bg-on-surface rounded-lg overflow-hidden flex flex-col font-mono">
                                   <div className="bg-[#1e2528] px-4 py-2 border-b border-[#2a3439]">
                                     <span className="text-xs font-bold text-outline-variant uppercase tracking-widest font-label">Proof of Concept</span>
                                   </div>
                                   <code className="p-4 text-xs text-error-container whitespace-pre-wrap">{vuln.evidence}</code>
                                </div>
                              )}
                              {vuln.remediation && (
                                <div className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col">
                                   <div className="bg-surface-variant px-4 py-2 border-b border-outline-variant/20">
                                      <span className="text-xs font-bold text-on-surface uppercase tracking-widest font-label">Remediation Steps</span>
                                   </div>
                                   <p className="p-4 text-xs font-medium text-on-surface-variant leading-relaxed">{vuln.remediation}</p>
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                   ))}
                </div>
             )}
           </div>
        )}

        {/* Secondary Actions / Settings */}
        {!activeScanId && !scanResult && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">settings_ethernet</span>
                    <span className="font-label text-sm text-on-surface-variant">Scan Intensity</span>
                 </div>
                 <span className="text-xs font-bold text-primary bg-white px-2 py-1 rounded">High</span>
              </button>
              <button className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">history</span>
                    <span className="font-label text-sm text-on-surface-variant">Load Previous</span>
                 </div>
                 <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>
              </button>
              <button className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">tune</span>
                    <span className="font-label text-sm text-on-surface-variant">Custom Headers</span>
                 </div>
                 <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>
              </button>
           </div>
        )}

      </div>
    </div>
  );
}
