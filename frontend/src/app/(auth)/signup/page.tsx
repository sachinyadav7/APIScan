'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth-store';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  orgName: z.string().min(2, 'Organization name must be at least 2 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError('');
    try {
      await signup(data);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Left Side: Digital Surgeon Branding */}
      <section className="hidden lg:flex lg:w-7/12 relative bg-on-surface overflow-hidden items-center justify-center p-24">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-[#2563eb] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">clinical_notes</span>
            </div>
            <h1 className="font-headline font-black text-3xl text-surface tracking-tighter">APIScan</h1>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline text-5xl font-extrabold text-white leading-tight tracking-tight">
              Join the clinical <br/>
              <span className="text-primary-fixed">intelligence network.</span>
            </h2>
            <p className="text-secondary-fixed text-lg max-w-md font-light leading-relaxed">
              Get started with diagnostic-grade API security scanning. Create your workspace and start protecting your endpoints in seconds.
            </p>

            <div className="mt-16 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-sm">shield_with_heart</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-label">Protected APIs</span>
                </div>
                <div className="text-3xl font-headline font-bold text-white">12.4k</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#ffb596] text-sm">groups</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-label">Active Teams</span>
                </div>
                <div className="text-3xl font-headline font-bold text-white">840+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Minimalist Signup Form */}
      <main className="w-full lg:w-5/12 bg-background flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#2563eb] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">clinical_notes</span>
              </div>
              <h1 className="font-headline font-black text-2xl text-on-surface tracking-tighter">APIScan</h1>
            </div>
          </div>

          <header className="mb-10">
            <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Create Account</h3>
            <p className="text-on-surface-variant font-medium text-sm">Set up your workspace to begin scanning.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-error/20 bg-error-container/20 px-4 py-3 text-sm text-error flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1 font-label" htmlFor="name">Full Name</label>
              <div className="relative">
                <input
                  {...register('name')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none"
                  id="name" placeholder="Dr. Jane Smith" type="text" autoComplete="name"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors pointer-events-none">person</span>
              </div>
              {errors.name && <p className="text-xs font-medium text-error pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1 font-label" htmlFor="org">Organization</label>
              <div className="relative">
                <input
                  {...register('orgName')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none"
                  id="org" placeholder="Acme Corporation" type="text"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors pointer-events-none">apartment</span>
              </div>
              {errors.orgName && <p className="text-xs font-medium text-error pl-1">{errors.orgName.message}</p>}
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1 font-label" htmlFor="s-email">Email Address</label>
              <div className="relative">
                <input
                  {...register('email')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none"
                  id="s-email" placeholder="name@company.com" type="email" autoComplete="email"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors pointer-events-none">alternate_email</span>
              </div>
              {errors.email && <p className="text-xs font-medium text-error pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1 font-label" htmlFor="s-password">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none"
                  id="s-password" placeholder="••••••••" type="password" autoComplete="new-password"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors pointer-events-none">lock</span>
              </div>
              {errors.password && <p className="text-xs font-medium text-error pl-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-br from-primary to-[#2563eb] text-white font-bold rounded-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" href="/login">Sign In</Link>
            </p>
          </footer>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full lg:w-7/12 px-12 py-8 z-20 pointer-events-none hidden lg:block">
        <div className="flex justify-between items-center opacity-60">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary-fixed">System Version 2.4.0-Clinical</span>
        </div>
      </div>
    </div>
  );
}
