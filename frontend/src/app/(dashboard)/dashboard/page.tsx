'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate } from '@/lib/utils';
import type { ScanResponse, UsageResponse, ApiResponse } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;

  const { data: recentScans } = useQuery({
    queryKey: ['recentScans', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ content: ScanResponse[] }>>(
        `/api/orgs/${orgId}/scans?size=50&sort=createdAt,desc`
      );
      return data.data.content || [];
    },
    enabled: !!orgId,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UsageResponse>>(`/api/orgs/${orgId}/billing/usage`);
      return data.data;
    },
    enabled: !!orgId,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ totalElements: number; content: any[] }>>(`/api/orgs/${orgId}/projects?size=50`);
      return data.data;
    },
    enabled: !!orgId,
  });

  const totalScans = usage?.usedQuota || 0;
  const totalApis = projectsData?.totalElements || 0;
  
  const criticalVulns = recentScans?.reduce((sum, s) => 
    sum + (s.vulnerabilities?.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length || 0)
  , 0) || 0;

  // Process scans for the graph (last 7 days)
  const getGraphHeights = () => {
    const defaultHeights = [20, 30, 45, 10, 80, 25, 40]; // Fallback purely visual heights
    if (!recentScans || recentScans.length === 0) return defaultHeights;
    
    // Create a 7-day bucket
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    recentScans.forEach(scan => {
      const scanDate = new Date(scan.createdAt);
      scanDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - scanDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      if (diffDays < 7) {
         // Subtracted from 6 so that index 6 is 'Today', 5 is 'Yesterday', etc.
         counts[6 - diffDays]++;
      }
    });
    
    const maxCount = Math.max(...counts, 1); // Avoid division by zero
    // Scale to percentages (min 10% for visibility)
    return counts.map(c => Math.max(10, Math.floor((c / maxCount) * 100)));
  };
  
  const graphHeights = getGraphHeights();

  return (
    <>
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Security Overview</h2>
        <p className="text-on-surface-variant font-body">Real-time telemetry and API vulnerability assessment.</p>
      </header>

      {/* Bento Grid for Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/projects" className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(42,52,57,0.03)] border-l-4 border-primary relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(42,52,57,0.06)] transition-all cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-9xl">api</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-outline-variant uppercase tracking-[0.15em] font-label">Total APIs</span>
            <span className="material-symbols-outlined text-primary text-xl">lens</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-headline tracking-tighter text-on-surface">{totalApis}</span>
          </div>
        </Link>

        <Link href="/scanner" className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(42,52,57,0.03)] border-l-4 border-secondary relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(42,52,57,0.06)] transition-all cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-9xl">radar</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-outline-variant uppercase tracking-[0.15em] font-label">Total Scans</span>
            <span className="material-symbols-outlined text-secondary text-xl">search</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-headline tracking-tighter text-on-surface">{totalScans}</span>
            <span className="text-xs font-semibold text-on-surface-variant">Total automated cycles</span>
          </div>
        </Link>

        <Link href="/reports" className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(42,52,57,0.03)] border-l-4 border-error relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(42,52,57,0.06)] transition-all cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-9xl">warning</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-outline-variant uppercase tracking-[0.15em] font-label">Critical Risk</span>
            <span className="material-symbols-outlined text-error text-xl">shield</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-headline tracking-tighter text-error">{criticalVulns}</span>
            <span className="text-xs font-semibold text-error-container bg-error/10 px-2 py-0.5 rounded-sm">Found recently</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-bold font-headline tracking-tight mb-1">Security Pulse</h3>
                <p className="text-sm text-on-surface-variant">API health and traffic patterns over the last 7 days.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-md">Weekly</span>
                <span className="px-3 py-1 text-on-surface-variant text-xs font-semibold hover:bg-surface-container cursor-pointer rounded-md">Monthly</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-48 gap-4 px-2">
              {graphHeights.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-lg transition-all duration-500 group relative ${i === 6 ? 'bg-primary' : 'bg-surface-container hover:bg-primary/50'}`} style={{ height: `${h}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-on-surface text-white text-[10px] py-1 px-2 rounded transition-opacity">{h}%</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-outline-variant uppercase tracking-widest font-label">
               <span>D-6</span><span>D-5</span><span>D-4</span><span>D-3</span><span>D-2</span><span>Yest</span><span>Today</span>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-lg">
            <h3 className="text-lg font-bold font-headline mb-6 text-on-surface">Threat Intelligence Feed</h3>
            <div className="space-y-4">
              {recentScans?.slice(0, 3).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-md">
                   <div className="flex items-center gap-4 border-l pl-2 border-transparent">
                      <div className={`w-2 h-10 ${scan.vulnerabilities.length > 0 ? 'bg-error' : 'bg-primary'} rounded-full`}></div>
                      <div>
                         <h4 className="text-sm font-bold text-on-surface truncate max-w-[200px] md:max-w-xs">{scan.targetUrl}</h4>
                         <p className="text-xs text-on-surface-variant">Detected in scan on {formatDate(scan.createdAt).split(',')[0]} (Found {scan.vulnerabilities.length})</p>
                      </div>
                   </div>
                   <Link href={`/reports/${scan.id}`} className="bg-primary hover:bg-primary-dim text-white text-xs font-bold py-2 px-4 rounded-md transition-colors">View Details</Link>
                </div>
              ))}
              {(!recentScans || recentScans.length === 0) && (
                 <div className="p-4 text-sm text-on-surface-variant text-center bg-surface-container rounded-md">No recent scan activity</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-outline-variant mb-6 font-label">Recent Activity</h3>
            <ul className="space-y-8 relative font-body">
              {recentScans?.slice(0, 3).map((scan, i) => (
                 <li key={i} className={`relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full ${scan.vulnerabilities.length > 0 ? 'before:bg-error' : 'before:bg-primary'}`}>
                   <p className="text-xs font-bold leading-tight text-on-surface truncate pr-2">Scan: {scan.targetUrl}</p>
                   <span className="text-[10px] text-on-surface-variant uppercase font-semibold">{formatDate(scan.createdAt).split(',')[0]}</span>
                 </li>
              ))}
              {projectsData?.content?.slice(0, 2).map((proj: any, i: number) => (
                 <li key={`proj-${i}`} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-outline-variant before:rounded-full">
                   <p className="text-xs font-bold leading-tight text-on-surface truncate pr-2">Project "{proj.name}" active</p>
                   <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Running</span>
                 </li>
              ))}
              {(!recentScans || recentScans.length === 0) && (!projectsData?.content || projectsData.content.length === 0) && (
                 <li className="text-xs text-on-surface-variant">No activity logged.</li>
              )}
            </ul>
          </div>
          
          <div className="bg-primary-container p-6 rounded-lg relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
             <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">terminal</span>
                <h4 className="text-sm font-bold text-on-primary-container font-headline">Live Trace Node</h4>
             </div>
             <div className="bg-on-surface/90 p-3 rounded-md text-[10px] font-mono text-blue-300 mb-4 leading-relaxed overflow-hidden">
                 {recentScans && recentScans.length > 0 ? (
                    <>
                      {recentScans[0].method} {recentScans[0].targetUrl.substring(0, 25)}...<br/>
                      Status: {recentScans[0].status}<br/>
                      Findings: <span className={recentScans[0].vulnerabilities.length > 0 ? "text-error" : "text-green-400"}>{recentScans[0].vulnerabilities.length} items logged</span>
                    </>
                 ) : projectsData?.content && projectsData.content.length > 0 ? (
                    <>
                      WATCH {projectsData.content[0].baseUrl || 'unknown'}<br/>
                      Initializing monitoring...<br/>
                      Status: STANDBY
                    </>
                 ) : (
                    <>
                      Awaiting connection...<br/>
                      No targets registered.<br/>
                      Status: IDLE
                    </>
                 )}
             </div>
             <p className="text-xs text-on-primary-container/70 font-medium font-body">Monitoring active endpoint traffic for anomalies.</p>
          </div>
        </div>
      </div>
      
      <Link href="/scanner" className="fixed right-6 bottom-24 md:bottom-10 bg-primary hover:bg-primary-dim text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90 z-40">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </Link>
    </>
  );
}
