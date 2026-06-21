'use client'
import { useRouter } from 'next/navigation'
import { Shield, FileText, AlertTriangle, MessageSquare, ArrowRight, CheckCircle, Zap } from 'lucide-react'

const FEATURES = [
  { icon: FileText, title: 'ROPA Generator', desc: 'Auto-generate Record of Processing Activities compliant with PDPL Article 12' },
  { icon: Shield, title: 'DPIA-Lite', desc: 'Data Protection Impact Assessment tailored to your risk profile and industry' },
  { icon: AlertTriangle, title: 'Gap Analysis', desc: 'Rule-based checker that identifies compliance gaps and prioritizes actions' },
  { icon: MessageSquare, title: 'AI Assistant', desc: 'Ask compliance questions and get contextual answers based on your company data' },
]

const STEPS = [
  { n: '01', label: 'Enter company details', sub: '5 minutes' },
  { n: '02', label: 'AI generates documents', sub: 'Instant' },
  { n: '03', label: 'Review your dashboard', sub: 'Complete overview' },
  { n: '04', label: 'Download & share', sub: 'PDF / Markdown' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">PDPL Shield</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">Demo v1.0</span>
          <button
            onClick={() => router.push('/onboarding')}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-4xl mx-auto">
        {/* Glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-800/40 rounded-full px-4 py-1.5 mb-6 text-sm text-brand-300">
            <Zap className="w-3.5 h-3.5" />
            Saudi Arabia PDPL Compliance — Automated
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            PDPL compliance,{' '}
            <span className="text-gradient">done in minutes</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate ROPA, DPIA, Privacy Policies, and Risk Registers automatically.
            Built for Saudi SMEs navigating the Personal Data Protection Law.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/onboarding')}
              className="flex items-center gap-2 justify-center bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-105 glow"
            >
              Start Free Compliance Check
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/onboarding?demo=true')}
              className="flex items-center gap-2 justify-center glass glass-hover text-slate-300 font-medium px-8 py-3.5 rounded-xl transition-all"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-12 text-slate-200">
          Everything you need to get compliant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-xl p-6 glass-hover transition-all group">
              <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-display font-semibold text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-12 text-slate-200">How it works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map(({ n, label, sub }) => (
            <div key={n} className="text-center">
              <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 text-white font-bold font-display text-sm">
                {n}
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">{label}</p>
              <p className="text-xs text-brand-400 font-medium">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PDPL badges */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Covers all key PDPL requirements</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Art. 5 — Lawful Basis', 'Art. 8 — Consent', 'Art. 10 — Data Minimization',
              'Art. 12 — ROPA', 'Art. 13 — Sensitive Data', 'Art. 17 — Security',
              'Art. 18–25 — Data Subject Rights', 'Art. 29 — Cross-Border Transfers'].map(tag => (
              <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-brand-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 px-6 py-8 text-center text-sm text-slate-600">
        PDPL Shield — Demo Platform • Saudi Arabia Personal Data Protection Law (Royal Decree M/19, 2021)
        <br />Not a substitute for legal advice. Consult a qualified legal professional for compliance matters.
      </footer>
    </div>
  )
}
