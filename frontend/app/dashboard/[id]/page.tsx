'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Shield, FileText, AlertTriangle, CheckCircle, Download,
    MessageSquare, Send, ArrowLeft, ExternalLink, Activity,
    Lock, AlertCircle, Info, ChevronRight, Loader2
} from 'lucide-react'
import { api, Dashboard as DashboardType } from '@/lib/api'

export default function DashboardPage() {
    const { id } = useParams()
    const router = useRouter()
    const [data, setData] = useState<DashboardType | null>(null)
    const [loading, setLoading] = useState(true)
    const [chatMsg, setChatMsg] = useState('')
    const [chatLog, setChatLog] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "I've analyzed your company's data. You're particularly exposed in Article 17 (Security). How can I help you fix this?" }
    ])

    useEffect(() => {
        const fetch = async () => {
            try {
                const d = await api.getDashboard(Number(id))
                setData(d)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id])

    const handleChat = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatMsg.trim()) return
        const msg = chatMsg
        setChatMsg('')
        setChatLog(prev => [...prev, { role: 'user', text: msg }])
        try {
            const res = await api.chat(Number(id), msg)
            setChatLog(prev => [...prev, { role: 'bot', text: res.answer }])
        } catch (err) {
            setChatLog(prev => [...prev, { role: 'bot', text: 'Error connecting to compliance assistant.' }])
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
    )

    if (!data) return <div>Dashboard not found</div>

    const { company, compliance_score, documents } = data
    const score = compliance_score?.overall_score || 0
    const riskColor = compliance_score?.risk_level === 'High' ? 'text-red-400' :
        compliance_score?.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Sidebar - Web view */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg text-white">PDPL Shield</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-brand-500/10 text-brand-400 rounded-lg text-sm font-medium">
                        <Activity className="w-4 h-4" /> Overview
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                        <FileText className="w-4 h-4" /> Documents
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                        <Lock className="w-4 h-4" /> Risk Register
                    </button>
                </nav>

                <div className="bg-slate-800/40 rounded-xl p-4 mt-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Active Profile</p>
                    <p className="font-semibold text-sm text-white truncate">{company.name}</p>
                    <p className="text-xs text-slate-400">{company.industry}</p>
                </div>
            </aside>

            {/* Main */}
            <main className="lg:ml-64 p-6 lg:p-10 pb-20">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Compliance Health</h1>
                        <p className="text-slate-400 text-sm">Last updated: {new Date(compliance_score?.updated_at || '').toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Exit
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-sm transition-colors">
                            Share Report
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="w-20 h-20 text-brand-500" />
                        </div>
                        <p className="text-sm text-slate-400 mb-1">Overall Compliance</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">{Math.round(score)}%</span>
                            <span className={`text-sm font-bold ${riskColor}`}>{compliance_score?.risk_level} Risk</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4">
                            <div className="bg-brand-500 h-full rounded-full transition-all duration-1000" style={{ width: `${score}%` }} />
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-slate-400 mb-1">Identified Gaps</p>
                        <p className="text-3xl font-black text-white">{compliance_score?.gaps.length}</p>
                        <div className="flex gap-2 mt-4">
                            <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-bold uppercase">High: {compliance_score?.gaps.filter(g => g.severity === 'high').length}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold uppercase">Med: {compliance_score?.gaps.filter(g => g.severity === 'medium').length}</span>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <p className="text-sm text-slate-400 mb-1">Active Artifacts</p>
                        <p className="text-3xl font-black text-white">{documents.length}</p>
                        <div className="flex flex-wrap gap-1.5 shadow-sm mt-4">
                            {documents.map(d => (
                                <span key={d.id} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded uppercase font-medium">{d.doc_type}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Two Col Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Gaps List */}
                    <div className="xl:col-span-2 space-y-6">
                        <section>
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" /> Critical Compliance Gaps
                            </h2>
                            <div className="space-y-4">
                                {compliance_score?.gaps.map((gap, i) => (
                                    <div key={i} className="glass rounded-xl p-5 border-l-4 border-l-red-500">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{gap.article} • {gap.code}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${gap.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {gap.severity}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-white mb-2">{gap.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-4">{gap.description}</p>
                                        <button className="text-xs text-brand-400 font-bold flex items-center gap-1 hover:text-brand-300 transition-colors">
                                            View Resolution Guide <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-brand-400" /> Generated Artifacts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map(doc => (
                                    <div key={doc.id} className="glass rounded-xl p-4 flex items-center justify-between group hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white uppercase">{doc.doc_type}</p>
                                                <p className="text-xs text-slate-500">Ready • Markdown / PDF</p>
                                            </div>
                                        </div>
                                        <button className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-brand-600 transition-all">
                                            <Download className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Chat Side */}
                    <div className="xl:col-span-1 border border-slate-800 bg-slate-900/50 rounded-2xl flex flex-col h-[600px] sticky top-28 overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
                            <MessageSquare className="w-4 h-4 text-brand-400" />
                            <h3 className="font-bold text-sm text-white">Compliance Assistant</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatLog.map((chat, i) => (
                                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${chat.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300'
                                        }`}>
                                        {chat.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleChat} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                            <input
                                type="text"
                                value={chatMsg}
                                onChange={e => setChatMsg(e.target.value)}
                                placeholder="Ask about a missing article..."
                                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-brand-500 outline-none"
                            />
                            <button type="submit" className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
