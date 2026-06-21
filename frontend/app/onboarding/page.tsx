'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, Loader2, CheckCircle, Database, Building2, Users } from 'lucide-react'
import { api, CompanyCreate } from '@/lib/api'

const DATA_TYPES = ['PII (Names, IDs)', 'Financial Data', 'Health Records', 'Marketing Data', 'Biometric Data']
const TOOLS = ['Cloud Hosting (AWS/Azure)', 'Email Marketing (Mailchimp)', 'CRM (Salesforce/Hubspot)', 'Payment Gateway (Stripe/Paytabs)', 'Google Analytics']
const UNCERTAIN_OPTIONS = ["I don't understand", "I don't know"]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CompanyCreate>({
        name: '',
        industry: '',
        data_types: [],
        tools_used: [],
        third_party_vendors: [],
        processing_activities: '',
        employee_count: '',
        country: 'EU',
    })

    const handleToggle = (list: keyof CompanyCreate, val: string) => {
        const current = formData[list] as string[]
        const isSelected = current.includes(val)
        let next: string[]
        if (UNCERTAIN_OPTIONS.includes(val)) {
            // "I don't know" / "I don't understand" are exclusive: they replace any real answer.
            next = isSelected ? [] : [val]
        } else {
            const withoutUncertain = current.filter(i => !UNCERTAIN_OPTIONS.includes(i))
            next = isSelected ? withoutUncertain.filter(i => i !== val) : [...withoutUncertain, val]
        }
        setFormData({ ...formData, [list]: next })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // 1. Create company
            const company = await api.createCompany(formData)
            // 2. Trigger AI Generation (async, but we wait for demo purposes)
            await api.generateAll(company.id)
            // 3. To Dashboard
            router.push(`/dashboard/${company.id}`)
        } catch (err) {
            console.error(err)
            alert('Failed to initialize. Check if backend is running.')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-8 animate-pulse">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                <h1 className="text-2xl font-bold mb-2">Analyzing GDPR Compliance...</h1>
                <p className="text-slate-400 max-w-sm">Generating ROPA, Policy, and Gap Analysis for {formData.name} based on GDPR Article 30 & 9.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <div className="max-w-xl w-full">
                {/* Progress */}
                <div className="flex gap-2 mb-12">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-slate-800'}`} />
                    ))}
                </div>

                {/* Step 0: Basic Info */}
                {step === 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <header>
                            <Building2 className="w-10 h-10 text-brand-400 mb-4" />
                            <h1 className="text-3xl font-bold mb-2">Tell us about your company</h1>
                            <p className="text-slate-400">Basic details to tailor the GDPR assessment.</p>
                        </header>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors"
                                    placeholder="e.g. EU Retail Solutions"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Industry</label>
                                <select
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors"
                                >
                                    <option value="">Select industry</option>
                                    <option value="Retail">Retail & E-commerce</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Fintech">Financial Services / Fintech</option>
                                    <option value="Tech">Technology / SAAS</option>
                                    <option value="Real Estate">Real Estate</option>
                                </select>
                            </div>
                        </div>
                        <button
                            disabled={!formData.name || !formData.industry}
                            onClick={() => setStep(1)}
                            className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 mt-8 transition-colors"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Step 1: Data Types */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <header>
                            <Database className="w-10 h-10 text-brand-400 mb-4" />
                            <h1 className="text-3xl font-bold mb-2">What data do you handle?</h1>
                            <p className="text-slate-400">GDPR requirements vary based on the sensitivity of data.</p>
                        </header>
                        <div className="grid gap-3">
                            {DATA_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => handleToggle('data_types', type)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.data_types.includes(type) ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900'
                                        }`}
                                >
                                    <span className="font-medium">{type}</span>
                                    {formData.data_types.includes(type) && <CheckCircle className="w-5 h-5 text-brand-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {UNCERTAIN_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleToggle('data_types', opt)}
                                    className={`flex items-center justify-between p-3 rounded-xl border border-dashed transition-all text-sm ${formData.data_types.includes(opt) ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                                        }`}
                                >
                                    <span className="font-medium">{opt}</span>
                                    {formData.data_types.includes(opt) && <CheckCircle className="w-4 h-4 text-amber-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setStep(0)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-xl transition-colors">Back</button>
                            <button onClick={() => setStep(2)} className="flex-[2] bg-brand-600 hover:bg-brand-500 text-white font-semibold py-4 rounded-xl">Next Step</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Tools & Infrastructure */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <header>
                            <Users className="w-10 h-10 text-brand-400 mb-4" />
                            <h1 className="text-3xl font-bold mb-2">Tools & Vendors</h1>
                            <p className="text-slate-400">Select any 3rd party tools you use for data processing.</p>
                        </header>
                        <div className="grid gap-3">
                            {TOOLS.map(tool => (
                                <button
                                    key={tool}
                                    onClick={() => handleToggle('tools_used', tool)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.tools_used.includes(tool) ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900'
                                        }`}
                                >
                                    <span className="font-medium text-sm text-left">{tool}</span>
                                    {formData.tools_used.includes(tool) && <CheckCircle className="w-5 h-5 text-brand-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {UNCERTAIN_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleToggle('tools_used', opt)}
                                    className={`flex items-center justify-between p-3 rounded-xl border border-dashed transition-all text-sm ${formData.tools_used.includes(opt) ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                                        }`}
                                >
                                    <span className="font-medium">{opt}</span>
                                    {formData.tools_used.includes(opt) && <CheckCircle className="w-4 h-4 text-amber-500" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-xl transition-colors">Back</button>
                            <button
                                onClick={handleSubmit}
                                className="flex-[2] bg-brand-600 hover:bg-brand-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-brand-900/40"
                            >
                                Generate Compliance Package
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
