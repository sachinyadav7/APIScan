import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-background flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#2563eb] text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
          </div>
          <h1 className="font-headline font-black text-on-surface text-lg tracking-tight">APIScan</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/login" className="text-on-surface-variant hover:bg-surface-container-high px-3 py-1 rounded-lg transition-colors font-headline font-bold text-sm tracking-tight">Login</Link>
          <Link href="/signup" className="bg-primary text-white px-5 py-2 rounded-lg font-headline font-bold text-sm hover:bg-primary-dim transition-colors shadow-md">Get Started</Link>
        </nav>
      </header>

      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-headline font-bold text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Diagnostic Grade Intelligence
            </div>
            <h2 className="font-headline font-extrabold text-5xl lg:text-7xl text-on-surface leading-[1.1] tracking-tight">
              AI-Powered <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#2563eb]">API Intelligence</span>
            </h2>
            <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl leading-relaxed">
              Automate your API vulnerability review with precision endpoint extraction and real-time risk analysis. The digital surgeon for your cloud ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup" className="bg-gradient-to-r from-primary to-[#2563eb] text-white px-8 py-4 rounded-lg font-headline font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 shadow-lg shadow-primary/20">
                Start Scanning
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <button className="bg-surface-container-highest text-on-primary-fixed-variant px-8 py-4 rounded-lg font-headline font-bold text-lg hover:bg-surface-container-high transition-all">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col">
                <span className="font-headline font-black text-3xl text-on-surface tracking-tighter">99.8%</span>
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Accuracy Rate</span>
              </div>
              <div className="w-px h-12 bg-outline-variant/30"></div>
              <div className="flex flex-col">
                <span className="font-headline font-black text-3xl text-on-surface tracking-tighter">2s</span>
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Analysis Time</span>
              </div>
            </div>
          </div>

          {/* Visual Right (Asymmetric Bento) */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="col-span-2 bg-white/80 backdrop-blur-3xl p-6 rounded-xl border border-outline-variant/15 shadow-[0px_12px_32px_rgba(13,28,46,0.06)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-headline font-bold text-sm text-on-surface">Endpoint Analysis Engine</span>
                  </div>
                  <span className="text-xs font-label text-on-surface-variant">V3.2 Active</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary">dns</span>
                      <div>
                        <div className="text-sm font-bold text-on-surface">/api/v1/auth/login</div>
                        <div className="text-[10px] text-on-surface-variant">Authentication Service</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-error-container text-on-error-container text-[10px] font-bold uppercase tracking-wider">High Risk</div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary">history_edu</span>
                      <div>
                        <div className="text-sm font-bold text-on-surface">/api/v1/users/profile</div>
                        <div className="text-[10px] text-on-surface-variant">Resource Pattern - Standard</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-surface-container-high text-primary text-[10px] font-bold uppercase tracking-wider">Low Risk</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-6 rounded-xl text-white">
                <span className="material-symbols-outlined text-4xl mb-4">analytics</span>
                <div className="text-sm font-bold mb-1">Pulse Monitor</div>
                <div className="text-2xl font-black font-headline">1.4k</div>
                <div className="text-[10px] opacity-70 uppercase tracking-widest mt-2">Daily Scans</div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center font-bold text-xs text-on-surface">JD</div>
                  <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-white flex items-center justify-center font-bold text-xs text-on-primary-container">SA</div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface">+12</div>
                </div>
                <div className="text-xs font-bold text-on-surface mt-4 leading-tight">Trusted by global security departments.</div>
              </div>
            </div>

            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-r from-primary to-[#2563eb] rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary rounded-full opacity-10 blur-2xl -z-10"></div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="font-headline font-extrabold text-4xl mb-4 text-on-surface">Precision Diagnostic Tools</h3>
            <p className="text-on-surface-variant">Our AI doesn&apos;t just scan; it understands the clinical structure of your application logic.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'magnification_small', title: 'Deep Extraction', desc: 'Isolate over 150+ vulnerability classes with 99.8% precision, identifying nuances that traditional active scanners miss.' },
              { icon: 'monitoring', title: 'Risk Diagnosis', desc: 'Real-time risk scoring using clinical data models to highlight unfavorable exposure and missing auth protections.' },
              { icon: 'sync_alt', title: 'Surgical Remediation', desc: "Automated code revision suggestions based on your organization's tech stack and historical precedent." }
            ].map((f, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 group hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-[#2563eb] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">{f.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-[#2563eb] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
              </div>
              <span className="font-headline font-black text-on-surface">APIScan</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">Revolutionizing API security with the precision of clinical intelligence.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">Product</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Scan Engine</a></li>
              <li><a className="hover:text-primary" href="#">Risk Diagnosis</a></li>
              <li><a className="hover:text-primary" href="#">Remediation Playbooks</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">Company</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">About</a></li>
              <li><a className="hover:text-primary" href="#">Clinical Standards</a></li>
              <li><a className="hover:text-primary" href="#">Security</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">Trust</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary" href="#">SOC2 Compliance</a></li>
              <li><a className="hover:text-primary" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-outline-variant/30 flex justify-between items-center text-[10px] text-on-surface-variant uppercase tracking-widest font-label">
          <span>© 2026 APIScan Security. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">Twitter</a>
            <a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
