'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth-store';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data);
      router.push(redirectUrl);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden selection:bg-primary-container selection:text-white">
      {/* Left Side: Digital Surgeon Branding */}
      <section className="hidden lg:flex lg:w-7/12 relative bg-on-surface overflow-hidden items-center justify-center p-24">
        {/* Abstract Security Geometry */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {/* Brand Mark */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-[#2563eb] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">clinical_notes</span>
            </div>
            <h1 className="font-headline font-black text-3xl text-surface tracking-tighter">APIScan</h1>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            <h2 className="font-headline text-5xl font-extrabold text-white leading-tight tracking-tight">
              Secure your APIs with <br/>
              <span className="text-primary-fixed">smart analysis.</span>
            </h2>
            <p className="text-secondary-fixed text-lg max-w-md font-light leading-relaxed">
              The precision of a medical instrument. The authority of clinical intelligence. Protect your digital architecture with the surgeon&apos;s touch.
            </p>

            {/* Data Visualizer Mock (Clinical Aesthetics) */}
            <div className="mt-16 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary-fixed-dim text-sm">shield_with_heart</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-label">Health Score</span>
                </div>
                <div className="text-3xl font-headline font-bold text-white">98.4%</div>
                <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-[#2563eb] h-full w-[98%] shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#ffb596] text-sm">analytics</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-label">Analysis Rate</span>
                </div>
                <div className="text-3xl font-headline font-bold text-white">4.2ms</div>
                <div className="flex gap-1 mt-4">
                  <div className="w-2 h-4 bg-primary/40 rounded-sm"></div>
                  <div className="w-2 h-6 bg-primary/60 rounded-sm"></div>
                  <div className="w-2 h-3 bg-primary/30 rounded-sm"></div>
                  <div className="w-2 h-8 bg-[#2563eb] rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Minimalist Login Form */}
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
            <h3 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Welcome Back</h3>
            <p className="text-on-surface-variant font-medium text-sm">Enter your credentials to access the terminal.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-error/20 bg-error-container/20 px-4 py-3 text-sm text-error flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Input: Email */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1 font-label" htmlFor="email">Email Address</label>
              <div className="relative">
                <input
                  {...register('email')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  autoComplete="email"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors pointer-events-none">alternate_email</span>
              </div>
              {errors.email && <p className="text-xs font-medium text-error pl-1">{errors.email.message}</p>}
            </div>

            {/* Input: Password */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-end ml-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label" htmlFor="password">Password</label>
                <a className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary-container transition-colors font-label" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  className="w-full px-5 py-4 bg-surface-container-low border-0 rounded-lg text-on-surface placeholder:text-outline text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 outline-none pr-12"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline focus:outline-none hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "lock"}</span>
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-error pl-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 text-primary border-outline-variant rounded bg-surface-container focus:ring-primary/20" id="remember" type="checkbox" />
              </div>
              <label className="text-xs font-medium text-on-surface-variant cursor-pointer" htmlFor="remember">Keep me logged in for 30 days</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-br from-primary to-[#2563eb] text-white font-bold rounded-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/30"></div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest font-label">Enterprise SSO</span>
            <div className="h-px flex-1 bg-outline-variant/30"></div>
          </div>

          {/* Social/SSO Login */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-lg">mail</span>
              <span>Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-lg">hub</span>
              <span>Okta</span>
            </button>
          </div>

          <footer className="mt-12 text-center">
            <p className="text-xs text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" href="/signup">Request Access</Link>
            </p>
          </footer>
        </div>
      </main>

      {/* Global Footer Branding */}
      <div className="fixed bottom-0 left-0 w-full lg:w-7/12 px-12 py-8 z-20 pointer-events-none hidden lg:block">
        <div className="flex justify-between items-center opacity-60">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary-fixed">System Version 2.4.0-Clinical</span>
          <div className="flex gap-6 pointer-events-auto">
            <a className="text-secondary-fixed font-label text-[10px] uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-secondary-fixed font-label text-[10px] uppercase tracking-widest hover:text-white transition-colors" href="#">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
