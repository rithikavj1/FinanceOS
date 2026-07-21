'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/lib/financeContext';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Fingerprint, Globe } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceType, setWorkspaceType] = useState<'personal' | 'business'>('personal');
  const { login } = useFinance();
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, workspaceType);
      setIsLoading(false);
      if (workspaceType === 'business') {
        router.push('/business');
      } else {
        router.push('/onboarding');
      }
    }, 1200);
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}@financeos.com`, workspaceType);
      setIsLoading(false);
      if (workspaceType === 'business') {
        router.push('/business');
      } else {
        router.push('/onboarding');
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070708] overflow-hidden text-zinc-150 font-sans">
      {/* Premium Amber/Gold Ambient Mesh Glow */}
      <div className="absolute top-[-30%] left-[20%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[20%] w-[60%] h-[60%] rounded-full bg-stone-500/5 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md px-6 z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center shadow-2xl shadow-amber-500/10 mb-6"
          >
            <span className="text-md font-bold text-zinc-950 font-serif">F</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-normal tracking-tight font-serif text-white mb-2"
          >
            FinanceOS
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-stone-400 text-xs font-mono uppercase tracking-widest"
          >
            Executive Grade Financial Copilot
          </motion.p>
        </div>

        {/* Input Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-900 rounded-2xl p-8 shadow-2xl relative"
          style={{ border: '1px solid rgba(197, 168, 128, 0.08)' }}
        >
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            
            {/* Workspace Select Toggle */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                Select Operating Console
              </label>
              <div className="flex bg-zinc-950 p-1 border border-zinc-900 rounded-xl relative" style={{ border: '1px solid rgba(197, 168, 128, 0.05)' }}>
                <button
                  type="button"
                  onClick={() => setWorkspaceType('personal')}
                  className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                    workspaceType === 'personal'
                      ? 'bg-amber-600/90 text-white font-bold'
                      : 'text-stone-500 hover:text-zinc-300'
                  }`}
                >
                  Personal Wallet OS
                </button>
                <button
                  type="button"
                  onClick={() => setWorkspaceType('business')}
                  className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                    workspaceType === 'business'
                      ? 'bg-amber-600/90 text-white font-bold'
                      : 'text-stone-500 hover:text-zinc-300'
                  }`}
                >
                  Business CFO OS
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <label htmlFor="email" className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Email Authentication
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-650">
                  <Mail className="h-3.5 w-3.5 text-stone-500 stroke-[1.2]" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 pl-11 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-amber-500/40 transition-all font-mono"
                  style={{ border: '1px solid rgba(197, 168, 128, 0.05)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-900 text-zinc-950 disabled:text-zinc-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent"></div>
              ) : (
                <>
                  <span>Initialize Console</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-900"></div>
            </div>
            <span className="relative bg-[#070708] px-4 text-[9px] font-bold text-stone-500 uppercase tracking-widest">
              Secured Integrations
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthLogin('Google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900/20 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl text-[10px] uppercase font-bold tracking-widest text-zinc-400 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Globe className="h-3.5 w-3.5 stroke-[1.2]" />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('Apple')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900/20 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl text-[10px] uppercase font-bold tracking-widest text-zinc-400 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Fingerprint className="h-3.5 w-3.5 stroke-[1.2]" />
              <span>Apple ID</span>
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[10px] text-stone-600 mt-8 tracking-wide font-mono uppercase">
          Authorized workspace entry only
        </p>
      </div>
    </div>
  );
}
