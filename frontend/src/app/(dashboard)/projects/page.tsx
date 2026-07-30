'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate } from '@/lib/utils';
import type { Project, ApiResponse, PageResponse } from '@/lib/types';
import Link from 'next/link';

const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  baseUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const currentOrg = useAuthStore((s) => s.currentOrg);
  const orgId = currentOrg?.id;
  const queryClient = useQueryClient();

  const { data: projectsPage, isLoading } = useQuery({
    queryKey: ['projects', orgId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<Project>>>(`/api/orgs/${orgId}/projects?size=50`);
      return data.data;
    },
    enabled: !!orgId,
  });

  const createProject = useMutation({
    mutationFn: async (form: ProjectForm) => {
      await api.post(`/api/orgs/${orgId}/projects`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
      reset();
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/api/orgs/${orgId}/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({ resolver: zodResolver(projectSchema) });

  const onSubmit = (data: ProjectForm) => {
    createProject.mutate(data);
  };

  const projects = projectsPage?.content || [];

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block font-label">Management</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 font-headline">Security Projects</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Deploy intelligent scanning agents to your API endpoints. Monitor vulnerabilities and maintain security integrity across your entire infrastructure.
        </p>
      </section>

      <section className="mb-12">
        <div className="bg-surface-container rounded-xl p-1 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
               <div className="flex-1">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1" htmlFor="project-name">Project Name</label>
                  <div className="relative group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">folder</span>
                     <input
                        id="project-name"
                        {...register('name')}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all focus:outline-none"
                        placeholder="Payment Gateway API"
                        type="text"
                     />
                  </div>
                  {errors.name && <p className="text-xs text-error mt-1 ml-1">{errors.name.message}</p>}
               </div>
               <div className="flex-1">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1" htmlFor="api-url">Add API URL</label>
                  <div className="relative group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">link</span>
                     <input 
                        id="api-url" 
                        {...register('baseUrl')}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl text-on-surface placeholder:text-outline transition-all focus:outline-none" 
                        placeholder="https://api.example.com" 
                        type="text" 
                     />
                  </div>
                  {errors.baseUrl && <p className="text-xs text-error mt-1 ml-1">{errors.baseUrl.message}</p>}
               </div>
            </div>
            <button 
               type="submit"
               disabled={createProject.isPending}
               className="w-full md:w-auto px-8 py-4 bg-gradient-to-br from-primary to-primary-dim text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {createProject.isPending ? (
                 <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              ) : (
                 <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              )}
              Add Project
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold tracking-tight font-headline">Active Repositories</h3>
            <span className="bg-primary-container text-on-primary-container px-3 py-0.5 rounded-full text-xs font-bold">{projects.length} Total</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-container text-outline transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container text-outline transition-colors">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="p-12 text-center text-on-surface-variant font-medium">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
               No active repositories. Add a project above.
            </div>
          ) : (
             projects.map((project, idx) => (
               <div key={project.id} className={`group bg-surface-container-low hover:bg-surface-container-lowest border-l-4 ${idx % 2 === 0 ? 'border-primary' : 'border-outline-variant'} rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all shadow-sm hover:shadow-md`}>
                  <div className="flex items-start gap-5">
                     <div className={`w-12 h-12 rounded-lg ${idx % 2 === 0 ? 'bg-primary-container text-primary' : 'bg-surface-container text-outline'} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-2xl" style={idx % 2 === 0 ? {fontVariationSettings: "'FILL' 1"} : {}}>
                          {idx % 2 === 0 ? 'api' : 'dns'}
                        </span>
                     </div>
                     <div>
                        <h4 className="font-bold text-lg text-on-surface tracking-tight mb-1 font-headline">{project.name}</h4>
                        <p className="text-sm text-outline font-medium">{project.baseUrl || 'No base URL provided'}</p>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">history</span>
                              Added on: {formatDate(project.createdAt)}
                           </div>
                           <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">shield</span>
                              0 Vulnerabilities
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between md:justify-end">
                     <button
                        onClick={() => deleteProject.mutate(project.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-2"
                     >
                       <span className="material-symbols-outlined">delete</span>
                     </button>
                     <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 font-label">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        Active
                     </span>
                     <Link href="/scanner" className="px-6 py-2.5 bg-surface-container-high text-on-surface font-bold rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2 group-hover:scale-105">
                        <span className="material-symbols-outlined text-lg">search</span>
                        Scan
                     </Link>
                  </div>
               </div>
             ))
          )}
        </div>
      </section>
    </div>
  );
}
