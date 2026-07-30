'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMsg, setErrorMsg] = useState('');
  
  const setCurrentOrg = useAuthStore((s) => s.setCurrentOrg);

  const acceptInvite = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/api/orgs/invites/${token}/accept`);
      return data.data; // Should return OrgResponse
    },
    onSuccess: (orgResponse) => {
      setStatus('SUCCESS');
      setCurrentOrg(orgResponse);
      setTimeout(() => router.push('/dashboard'), 2000);
    },
    onError: (error: any) => {
      setStatus('ERROR');
      setErrorMsg(error.response?.data?.error || 'Failed to accept invitation. It may be expired or invalid.');
    }
  });

  useEffect(() => {
    if (token) {
      acceptInvite.mutate();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        {status === 'LOADING' && (
          <>
            <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Validating Invite</h2>
            <p className="text-on-surface-variant font-body">Please wait while we secure your organization access...</p>
          </>
        )}
        
        {status === 'SUCCESS' && (
          <>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="material-symbols-outlined text-4xl text-primary">verified</span>
            </div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Welcome Aboard!</h2>
            <p className="text-on-surface-variant font-body mb-6">You have successfully joined the organization.</p>
            <p className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase font-mono">Redirecting to Dashboard...</p>
          </>
        )}
        
        {status === 'ERROR' && (
          <>
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="material-symbols-outlined text-4xl text-error">gpp_bad</span>
            </div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Access Denied</h2>
            <p className="text-error font-body mb-6">{errorMsg}</p>
            <button 
               onClick={() => router.push('/dashboard')}
               className="px-6 py-2.5 bg-surface-container text-on-surface font-bold rounded-lg hover:bg-surface-variant transition-colors"
            >
               Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
