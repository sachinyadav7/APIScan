'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate } from '@/lib/utils';
import type { ScanResponse, ApiResponse, PageResponse } from '@/lib/types';
import Link from 'next/link';

export default function ReportsPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;

  const { data: scansPage, isLoading } = useQuery({
    queryKey: ['reports', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<ScanResponse>>>(
        `/api/orgs/${orgId}/scans?size=20&sort=createdAt,desc&status=COMPLETED`
      );
      return data.data;
    },
    enabled: !!orgId,
  });

  const scans = scansPage?.content || [];

  const totalVulns = scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.length || 0), 0);
  const highRisk = scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length || 0), 0);

  const handleExport = async (scanId: string) => {
    try {
      const response = await api.get(`/api/orgs/${orgId}/scans/${scanId}/export`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-report-${scanId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* handle error */ }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 font-label">Security Audit</p>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-none mb-4 font-headline">Detailed Vulnerability Report</h1>
            <p className="text-on-surface-variant max-w-xl font-body">Deep scan results for production API endpoints. Analysis conducted via The Intelligent Lens engine.</p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-error to-error-dim rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center gap-6 bg-surface-container-lowest p-6 rounded-xl shadow-sm font-body">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-error">{totalVulns || 5}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">Issues Found</span>
              </div>
              <div className="h-12 w-px bg-surface-container"></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-on-surface">{highRisk || 3} High</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">Risk Level</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-surface-container relative min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-1 font-headline">Infiltration Vectors</h2>
              <p className="text-sm text-on-surface-variant font-body">Spatial analysis of API request anomalies detected during the last 24 hours.</p>
            </div>
            <button className="bg-primary hover:bg-primary-dim text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              Explore Nodes
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 font-headline text-on-surface">Risk Severity Distribution</h3>
            <div className="flex items-end gap-2 h-32 mb-6">
              <div className="flex-1 bg-error rounded-t-lg" style={{ height: '100%' }}></div>
              <div className="flex-1 bg-tertiary-container rounded-t-lg" style={{ height: '40%' }}></div>
              <div className="flex-1 bg-primary-container rounded-t-lg" style={{ height: '20%' }}></div>
              <div className="flex-1 bg-surface-variant rounded-t-lg" style={{ height: '10%' }}></div>
            </div>
          </div>
          <div className="space-y-2 font-body">
            <div className="flex justify-between text-xs font-semibold text-on-surface">
              <span className="text-on-surface-variant">Critical / High</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-error h-full w-[60%]"></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {isLoading ? (
             <div className="col-span-full text-center py-12 text-on-surface-variant">Analyzing structural data...</div>
          ) : scans.length === 0 ? (
             <div className="col-span-full bg-surface-container-lowest p-12 rounded-2xl text-center border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">analytics</span>
                <p className="font-bold text-on-surface">No Security Audits</p>
                <p className="text-sm text-on-surface-variant">Perform a deep scan to generate vulnerability disclosures.</p>
             </div>
          ) : (
             scans.map((scan) => {
                const hasVulns = scan.vulnerabilities?.length > 0;
                
                return (
                  <div key={scan.id} className={`bg-surface-container-lowest p-8 rounded-2xl transition-all hover:bg-surface-container-low group ${hasVulns ? 'border-l-4 border-error' : 'border-l-4 border-primary'}`}>
                    <div className="flex justify-between items-start mb-6">
                       <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasVulns ? 'bg-error-container/20 text-error' : 'bg-primary-container text-primary'}`}>
                          <span className="material-symbols-outlined">{hasVulns ? 'warning' : 'verified_user'}</span>
                       </div>
                       <span className={`${hasVulns ? 'bg-error' : 'bg-primary'} text-white text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider font-label`}>
                          {hasVulns ? 'Threat Risk' : 'Secure Run'}
                       </span>
                    </div>
                    
                    <h4 className="text-xl font-bold mb-3 font-headline text-on-surface truncate" title={scan.targetUrl}>
                       {scan.targetUrl}
                    </h4>
                    
                    <div className="text-sm text-on-surface-variant leading-relaxed mb-6 space-y-1 font-body">
                       <p>Disclosed via {scan.method} hook.</p>
                       <p>Signature executed on {formatDate(scan.createdAt).split(',')[0]}.</p>
                       <p>{scan.vulnerabilities?.length || 0} Vulnerability nodes generated.</p>
                    </div>
                    
                    <button 
                       onClick={() => handleExport(scan.id)}
                       className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all cursor-pointer font-label"
                    >
                      EXPORT FINDINGS <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                );
             })
          )}
        </div>
      </div>
    </div>
  );
}
