'use client';

import React, { useState } from 'react';
import Shell from '@/components/layout/Shell';
import { useFinance } from '@/lib/financeContext';
import { useRouter } from 'next/navigation';
import { 
  Settings, Key, RefreshCw, UserCheck, ShieldAlert, BadgeInfo
} from 'lucide-react';

export default function SettingsPage() {
  const { user, couple, businessAccount, logout } = useFinance();
  const router = useRouter();

  // Keys states
  const [openaiKey, setOpenaiKey] = useState('sk-proj-••••••••••••••••');
  const [supabaseUrl, setSupabaseUrl] = useState('https://oqjxplvsqd••••.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9••••');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetWorkspace = () => {
    if (confirm("Are you sure you want to reset all transactions, invoices, and budgets? This will clear local storage and log you out.")) {
      logout();
      router.push('/login');
    }
  };

  return (
    <Shell>
      <div className="space-y-8 max-w-2xl">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Configure integration keys, API services, and workspace settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
            Active User Profile
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Full Name</span>
              <p className="font-bold">{user?.fullName}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email Address</span>
              <p className="font-bold">{user?.email}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Couple Status</span>
              <p className="font-bold capitalize">{couple ? `Connected (${couple.inviteStatus})` : 'Inactive'}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Business Account</span>
              <p className="font-bold capitalize">{businessAccount ? businessAccount.businessName : 'Inactive'}</p>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">API Credentials</h3>
          </div>
          <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">
            FinanceOS runs with offline mock fallbacks by default. Add credentials below to enable live OpenAI models and Supabase Realtime synchronization.
          </p>

          <form onSubmit={handleSaveKeys} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-slate-55 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supabase Endpoint URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl text-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              {isSaved ? 'Credentials Locked Successfully!' : 'Save Integration Credentials'}
            </button>
          </form>
        </div>

        {/* Danger zone resetting */}
        <div className="bg-white dark:bg-zinc-900 border border-rose-500/10 rounded-3xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5" />
            Danger Zone
          </h3>
          <p className="text-[10px] text-slate-500 mb-4">
            Resetting the workspace purges all transaction logs, client invoice records, budgets, mileage history, and logs you out completely.
          </p>

          <button
            onClick={handleResetWorkspace}
            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-rose-500/30 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-xl cursor-pointer transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Active Workspace</span>
          </button>
        </div>

      </div>
    </Shell>
  );
}
