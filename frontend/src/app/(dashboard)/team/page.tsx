'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import type { MemberInfo, ApiResponse } from '@/lib/types';

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.string().optional(),
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function TeamPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MemberInfo[]>>(`/api/orgs/${orgId}/members`);
      return data.data;
    },
    enabled: !!orgId,
  });

  const inviteMember = useMutation({
    mutationFn: async (form: InviteForm) => {
      await api.post(`/api/orgs/${orgId}/invite`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', orgId] });
      setShowInvite(false);
      reset();
    },
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/api/orgs/${orgId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', orgId] });
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'TESTER' },
  });

  const onSubmit = (data: InviteForm) => inviteMember.mutate(data);

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block font-label">Administration</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-on-surface font-headline">Team Directory</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-body">
          Manage clinical access and infrastructure permissions for your API security personnel.
        </p>
      </section>

      <section className="mb-12">
        <div className="bg-surface-container rounded-xl p-1 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="bg-surface-container-lowest rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
               <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Invite Personnel</h3>
               <p className="text-on-surface-variant font-body text-sm">Add security testers or administrators tracking your API health.</p>
            </div>
            {!showInvite ? (
               <button 
                  onClick={() => setShowInvite(true)}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-br from-primary to-primary-dim text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
               >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Add Member
               </button>
            ) : (
               <button 
                  onClick={() => { setShowInvite(false); reset(); }}
                  className="w-full md:w-auto px-6 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-lg transition-all hover:bg-surface-variant"
               >
                  Cancel
               </button>
            )}
          </div>

          {showInvite && (
             <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest rounded-b-lg border-t border-outline-variant/20 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end">
               <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                   <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1 font-label">Email Address</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">mail</span>
                      <input
                        {...register('email')}
                        placeholder="colleague@organization.com"
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all font-body outline-none"
                        type="email"
                      />
                   </div>
                   {errors.email && <p className="text-xs font-bold text-error pl-1 mt-1">{errors.email.message}</p>}
                 </div>
                 <div className="w-full md:w-64 relative">
                   <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1 font-label">Role Permission</label>
                   <select
                     {...register('role')}
                     className="w-full px-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-on-surface transition-all font-body outline-none cursor-pointer appearance-none font-bold"
                   >
                     <option value="TESTER">Security Tester</option>
                     <option value="ADMIN">Administrator</option>
                   </select>
                   <span className="absolute right-4 top-[2.4rem] material-symbols-outlined text-outline pointer-events-none">expand_more</span>
                 </div>
               </div>
               <button 
                 type="submit" 
                 disabled={inviteMember.isPending}
                 className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dim active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {inviteMember.isPending ? (
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                 ) : (
                   <>
                     <span className="material-symbols-outlined text-lg">send</span>
                     Send Invite
                   </>
                 )}
               </button>
             </form>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold tracking-tight text-on-surface font-headline">Active Directory</h3>
            <span className="bg-primary-container text-on-primary-container px-3 py-0.5 rounded-full text-xs font-bold">{members?.length || 0} Members</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
             <div className="text-center py-12 text-on-surface-variant">Loading directory...</div>
          ) : !members || members.length === 0 ? (
             <div className="text-center py-12 text-on-surface-variant">
               <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">group_off</span>
               <p className="font-semibold">Your team is empty</p>
             </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
               {members.map((member) => (
                 <div key={member.userId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface transition-colors group">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#2563eb] text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-white">
                         {member.name?.[0]?.toUpperCase() || member.email[0]?.toUpperCase()}
                       </div>
                       <div>
                          <p className="font-bold text-on-surface text-lg flex items-center gap-2 font-headline">
                             {member.name || 'Unnamed Sentinel'}
                          </p>
                          <p className="text-on-surface-variant font-body text-sm flex items-center gap-1.5 mt-0.5">
                             <span className="material-symbols-outlined text-[14px]">mail</span>
                             {member.email}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                       <span className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border font-label',
                          member.role === 'OWNER' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          member.role === 'ADMIN' ? 'bg-tertiary-container/10 text-tertiary border-tertiary-container/30' :
                          member.role.includes('_PENDING') ? 'bg-slate-50 text-slate-500 border-slate-200' :
                          'bg-primary-container text-on-primary-container border-primary-container'
                       )}>
                          <span className="material-symbols-outlined text-[14px]">
                             {member.role === 'OWNER' ? 'shield_person' : member.role === 'ADMIN' ? 'admin_panel_settings' : member.role.includes('_PENDING') ? 'schedule' : 'badge'}
                          </span>
                          {member.role.replace('_PENDING', ' (Pending)')}
                       </span>

                       {member.role !== 'OWNER' && (
                          <button 
                             onClick={() => removeMember.mutate(member.userId)}
                             className="p-2 text-outline-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                             title={member.role.includes('_PENDING') ? "Revoke Invite" : "Revoke Access"}
                          >
                             <span className="material-symbols-outlined text-[20px]">
                                {member.role.includes('_PENDING') ? "cancel" : "person_remove"}
                             </span>
                          </button>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
