'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/lib/financeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';

interface FormState {
  age: number;
  salary: number;
  city: string;
  occupation: string;
  business: boolean;
  married: boolean;
  financialGoals: string;
  monthlyRent: number;
  loans: number;
  savingsGoal: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardUser, budgets, categories } = useFinance();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [form, setForm] = useState<FormState>({
    age: 28,
    salary: 80000,
    city: 'Bengaluru',
    occupation: 'Software Engineer',
    business: false,
    married: false,
    financialGoals: 'Establish a premium cash reserve and invest in business assets.',
    monthlyRent: 20000,
    loans: 0,
    savingsGoal: 25000,
  });

  const updateField = (field: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      onboardUser(form);
      setIsGenerating(false);
      setShowSummary(true);
    }, 2500);
  };

  const handleStartApp = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-zinc-950 px-4 py-12 text-stone-850 dark:text-zinc-100 transition-colors">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          
          {/* Step 1 */}
          {step === 1 && !isGenerating && !showSummary && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-8 shadow-xl relative overflow-hidden"
              style={{ border: '1px solid rgba(197, 168, 128, 0.1)' }}
            >
              <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="h-4.5 w-4.5" />
                <span>AI Profile Setup</span>
              </div>
              
              <h2 className="text-3xl font-normal font-serif mb-2 text-stone-900 dark:text-white">Tell us about yourself</h2>
              <p className="text-stone-500 dark:text-zinc-400 text-xs mb-8">
                Our AI uses this information to establish your smart categorizations and base savings goals.
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Occupation</label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <label className="flex items-center gap-3 p-4 bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-900 rounded-xl cursor-pointer hover:border-amber-500/20 transition-all">
                    <input
                      type="checkbox"
                      checked={form.business}
                      onChange={(e) => updateField('business', e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 dark:border-zinc-700 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide">Entrepreneur?</p>
                      <p className="text-[9px] text-stone-500 mt-0.5">Activate treasury ledgers</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-900 rounded-xl cursor-pointer hover:border-amber-500/20 transition-all">
                    <input
                      type="checkbox"
                      checked={form.married}
                      onChange={(e) => updateField('married', e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 dark:border-zinc-700 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide">Couple Mode?</p>
                      <p className="text-[9px] text-stone-500 mt-0.5">Activate joint splitting</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg shadow-amber-500/5"
                >
                  <span>Obligations</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && !isGenerating && !showSummary && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-8 shadow-xl"
              style={{ border: '1px solid rgba(197, 168, 128, 0.1)' }}
            >
              <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="h-4.5 w-4.5" />
                <span>Financial Ledger Setup</span>
              </div>
              
              <h2 className="text-3xl font-normal font-serif mb-2 text-stone-900 dark:text-white">Income & Obligations</h2>
              <p className="text-stone-500 dark:text-zinc-400 text-xs mb-8">
                Provide basic numbers so our AI can structure your custom limits.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Salary (Monthly INR)</label>
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(e) => updateField('salary', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Rent (Monthly INR)</label>
                    <input
                      type="number"
                      value={form.monthlyRent}
                      onChange={(e) => updateField('monthlyRent', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">EMIs/Loans (Monthly INR)</label>
                    <input
                      type="number"
                      value={form.loans}
                      onChange={(e) => updateField('loans', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Savings Goal (Monthly INR)</label>
                    <input
                      type="number"
                      value={form.savingsGoal}
                      onChange={(e) => updateField('savingsGoal', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Primary Target Objective</label>
                  <textarea
                    rows={2}
                    value={form.financialGoals}
                    onChange={(e) => updateField('financialGoals', e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                  />
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850 text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 stroke-[1.2]" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg shadow-amber-500/5"
                  >
                    <span>Build Wallet OS</span>
                    <Sparkles className="h-3.5 w-3.5 stroke-[1.2]" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3 */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-12 shadow-xl text-center flex flex-col items-center justify-center min-h-[360px]"
              style={{ border: '1px solid rgba(197, 168, 128, 0.1)' }}
            >
              <div className="relative mb-6">
                <div className="h-16 w-16 animate-ping absolute rounded-full bg-amber-500/5"></div>
                <div className="h-16 w-16 animate-spin rounded-full border-2 border-amber-600 border-t-transparent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-amber-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-serif mb-2">Analyzing cash flow metrics...</h3>
              <p className="text-stone-500 dark:text-zinc-400 text-xs max-w-xs leading-relaxed font-mono uppercase tracking-wider text-[9px]">
                Calculating allocations, factoring in rent (₹{form.monthlyRent}) and mapping client modes.
              </p>
            </motion.div>
          )}

          {/* Step 4 */}
          {showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-8 shadow-xl"
              style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest mb-4">
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Onboarding Complete</span>
              </div>
              
              <h2 className="text-3xl font-normal font-serif mb-1 text-stone-900 dark:text-white">Workspace Allocated</h2>
              <p className="text-stone-500 dark:text-zinc-400 text-xs mb-8">
                The budget engine has structured your accounts under a luxury 50/30/20 framework.
              </p>

              <div className="space-y-3 mb-8">
                {budgets.map((b: any) => {
                  const cat = categories.find((c: any) => c.id === b.categoryId);
                  return (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-900 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: cat?.color || '#d6d3d1' }}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">{cat?.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400">₹{b.limitAmount.toLocaleString()}</span>
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest font-mono mt-0.5">{b.period}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleStartApp}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-amber-500/10"
              >
                <span>Enter Luxury Console</span>
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
