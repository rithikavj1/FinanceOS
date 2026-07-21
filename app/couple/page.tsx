'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { useFinance } from '@/lib/financeContext';
import AddExpenseModal from '@/components/expense/AddExpenseModal';
import { 
  Heart, Users2, Mail, Phone, QrCode, Link2, Copy, Check, ChevronRight, 
  Wallet, Sparkles, Plus, AlertCircle, Calendar, ShieldCheck, Target, 
  TrendingUp, Play, Trash2, Camera, Compass, PlusCircle, CheckCircle, 
  Clock, ToggleLeft, ToggleRight, Info, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export default function CouplePage() {
  const { 
    coupleOnboarded, coupleOnboardingDetails, savingsVaults, recurringBills, memories, splitDefaultsRatio,
    onboardCouple, addSavingsVaultContribution, toggleRecurringBillAutomation, toggleBillReminder,
    markBillAsPaid, addFinancialMemory, disconnectPartner, updateSplitDefaults,
    partner, user, transactions, addTransaction, deleteTransaction, goals, sharedWallet,
    couple, invitePartner, simulatePartnerAccept
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'overview' | 'wallets' | 'goals' | 'analytics' | 'bills' | 'predictions' | 'timeline' | 'settings'>('overview');
  
  // Onboarding Phase States
  const [onboardStep, setOnboardStep] = useState<'welcome' | 'invite' | 'awaiting_partner' | 'details'>('welcome');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone' | 'qr' | 'link'>('email');
  
  // Onboarding Form Details
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [relStartDate, setRelStartDate] = useState('2024-11-20');
  const [combinedIncome, setCombinedIncome] = useState('180000');
  const [fixedExpenses, setFixedExpenses] = useState('60000');
  const [loans, setLoans] = useState('15000');
  const [financialGoals, setFinancialGoals] = useState('Buy a home & travel Japan');
  const [lifestyle, setLifestyle] = useState<'frugal' | 'balanced' | 'luxury'>('balanced');
  const [hasChildren, setHasChildren] = useState(false);
  const [travelFreq, setTravelFreq] = useState<'low' | 'medium' | 'high'>('medium');
  const [city, setCity] = useState('Bengaluru');

  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Active Wallet selection (my | partner | joint)
  const [activeWallet, setActiveWallet] = useState<'my' | 'partner' | 'joint'>('joint');

  // Vault contribution inputs
  const [selectedVault, setSelectedVault] = useState('vault_joint');
  const [contributionAmt, setContributionAmt] = useState('');

  // AI budget questionnaire outputs
  const [aiBudgets, setAiBudgets] = useState<any>(null);
  const [isGeneratingBudgets, setIsGeneratingBudgets] = useState(false);

  // Simulation Sliders
  const [savingShift, setSavingShift] = useState(20); // % reduction in spends
  const [incomeShift, setIncomeShift] = useState(10); // % increase in income
  const [carPurchaseSim, setCarPurchaseSim] = useState(false); // buy a car simulation

  // Milestone memory inputs
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryDate, setNewMemoryDate] = useState('');
  const [newMemoryCost, setNewMemoryCost] = useState('');
  const [newMemoryDesc, setNewMemoryDesc] = useState('');
  const [newMemoryPhoto, setNewMemoryPhoto] = useState('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80');

  // UI toast alerts
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://financeos.ai/invite/cpl_89fd7s98');
    setCopiedLink(true);
    triggerToast('Invite link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStartOnboarding = () => {
    setOnboardStep('invite');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = inviteMethod === 'email' ? inviteEmail : invitePhone;
    invitePartner(contact || 'partner@financeos.com');
    setOnboardStep('awaiting_partner');
    triggerToast('Invitation successfully dispatched to partner.');
  };

  const handleSkipOnboarding = () => {
    const details = {
      relationshipStartDate: '2024-11-20',
      connectedDate: new Date().toISOString().split('T')[0],
      combinedIncome: 180000,
      fixedExpenses: 60000,
      loans: 15000,
      financialGoals: 'Japan trip, House down payment',
      lifestyle: 'balanced' as const,
      children: false,
      travelFrequency: 'medium' as const,
      city: 'Bengaluru'
    };
    onboardCouple(details);
    triggerToast('Couples Workspace connected.');
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      relationshipStartDate: relStartDate,
      connectedDate: new Date().toISOString().split('T')[0],
      combinedIncome: parseFloat(combinedIncome) || 180000,
      fixedExpenses: parseFloat(fixedExpenses) || 60000,
      loans: parseFloat(loans) || 15000,
      financialGoals,
      lifestyle,
      children: hasChildren,
      travelFrequency: travelFreq,
      city
    };
    onboardCouple(details);
    triggerToast('Couple workspace successfully created.');
  };

  const triggerAiBudgets = () => {
    setIsGeneratingBudgets(true);
    setTimeout(() => {
      const inc = coupleOnboardingDetails?.combinedIncome || 180000;
      setAiBudgets({
        food: Math.round(inc * 0.15),
        shopping: Math.round(inc * 0.12),
        entertainment: Math.round(inc * 0.08),
        vacation: Math.round(inc * 0.10),
        emergency: Math.round(inc * 0.15),
        investment: Math.round(inc * 0.20),
        bills: Math.round(inc * 0.20)
      });
      setIsGeneratingBudgets(false);
      triggerToast('AI generated fresh spending allocations.');
    }, 1500);
  };

  const handleVaultContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contributionAmt);
    if (!amt || amt <= 0) return;
    addSavingsVaultContribution(selectedVault, amt);
    setContributionAmt('');
    triggerToast(`Contributed ₹${amt.toLocaleString()} to savings vault.`);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryTitle || !newMemoryCost || !newMemoryDate) return;
    
    addFinancialMemory({
      title: newMemoryTitle,
      expense: parseFloat(newMemoryCost) || 0,
      date: newMemoryDate,
      description: newMemoryDesc || 'Shared milestone.',
      photoUrl: newMemoryPhoto
    });

    setNewMemoryTitle('');
    setNewMemoryCost('');
    setNewMemoryDate('');
    setNewMemoryDesc('');
    triggerToast('Logged new financial memory.');
  };

  // Isolate personal transactions from business transactions
  const personalTransactions = transactions.filter(
    (t: any) => !t.isBusiness && !t.categoryId?.startsWith('cat_biz_')
  );

  const walletTransactions = personalTransactions.filter((t: any) => {
    if (activeWallet === 'my') return t.whoIsFor === 'me';
    if (activeWallet === 'partner') return t.whoIsFor === 'partner';
    return t.whoIsFor === 'both' || t.whoPaid === 'joint' || !t.whoIsFor;
  });

  const walletIncome = walletTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const walletExpense = walletTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const relationshipScore = 92;
  const jointIncome = coupleOnboardingDetails?.combinedIncome || 180000;
  const jointExpense = personalTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  const jointSavings = savingsVaults.reduce((sum: number, v: any) => sum + v.amount, 0);
  const totalBillsDue = recurringBills.filter((b: any) => b.status !== 'paid').reduce((sum: number, b: any) => sum + b.amount, 0);

  const unautomatedBill = recurringBills.find((b: any) => !b.isAutomated);

  return (
    <Shell>
      <div className="space-y-8 pb-20 relative">
        
        {toastMessage && (
          <div className="fixed top-4 right-4 z-55 bg-zinc-900 border border-amber-500/30 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle className="h-4.5 w-4.5 text-amber-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {!coupleOnboarded ? (
          <div className="w-full max-w-2xl mx-auto py-8">
            {onboardStep === 'welcome' && (
              <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-900 rounded-3xl relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/2 rounded-full blur-3xl pointer-events-none" />
                
                <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
                </div>

                <h1 className="text-3xl font-normal font-serif text-stone-900 dark:text-white">
                  Build your financial future together.
                </h1>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
                  Manage shared money, goals, bills and savings with your partner using AI. Connect bank statements and forecast allocations seamlessly.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={handleStartOnboarding}
                    className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all active:scale-[0.98]"
                  >
                    Connect Partner
                  </button>
                  <button
                    onClick={handleSkipOnboarding}
                    className="py-3 px-6 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-stone-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 'invite' && (
              <div className="p-8 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-900 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 dark:border-zinc-850 pb-4">
                  <Heart className="h-5 w-5 text-amber-500" />
                  <h2 className="font-serif text-lg font-bold">Partner Connection Settings</h2>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[9px] font-bold uppercase tracking-wider bg-stone-50 dark:bg-zinc-950 p-1 rounded-xl">
                  {(['email', 'phone', 'qr', 'link'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setInviteMethod(method)}
                      className={`py-2 rounded-lg cursor-pointer ${
                        inviteMethod === method ? 'bg-white dark:bg-zinc-850 text-amber-600 shadow-sm' : 'text-stone-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {inviteMethod === 'email' && (
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Partner Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="partner@financeos.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer">
                      Send Email Invitation
                    </button>
                  </form>
                )}

                {inviteMethod === 'phone' && (
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Partner Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={invitePhone}
                        onChange={(e) => setInvitePhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer">
                      Send SMS Invitation
                    </button>
                  </form>
                )}

                {inviteMethod === 'qr' && (
                  <div className="flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-zinc-950 rounded-2xl border border-stone-200 dark:border-zinc-850">
                    <div className="bg-white p-3 rounded-xl shadow-md border border-stone-100 mb-3">
                      <QrCode className="h-32 w-32 text-stone-850" />
                    </div>
                    <p className="text-[10px] text-stone-500 text-center uppercase tracking-wider">
                      Have partner scan this QR code using their FinanceOS camera
                    </p>
                    <button 
                      onClick={() => { invitePartner('partner@financeos.com'); setOnboardStep('awaiting_partner'); triggerToast('Connected via QR scan.'); }}
                      className="mt-4 bg-zinc-900 dark:bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
                    >
                      Verify Connection
                    </button>
                  </div>
                )}

                {inviteMethod === 'link' && (
                  <div className="space-y-4">
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Direct Invitation URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://financeos.ai/invite/cpl_89fd7s98"
                        className="flex-1 bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-mono select-all focus:outline-none"
                      />
                      <button
                        onClick={copyInviteLink}
                        className="p-2.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl cursor-pointer"
                      >
                        {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <button 
                      onClick={() => { invitePartner('partner@financeos.com'); setOnboardStep('awaiting_partner'); }}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer"
                    >
                      Proceed to configuration
                    </button>
                  </div>
                )}
              </div>
            )}

            {onboardStep === 'awaiting_partner' && (
              <div className="p-8 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-900 rounded-3xl shadow-sm text-center space-y-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-75" />
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 relative z-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-normal font-serif text-stone-900 dark:text-white">Awaiting Partner Response</h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Invitation link dispatched! We are waiting for your partner to join this shared session.
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-zinc-950 p-6 rounded-2xl border border-stone-200/60 dark:border-zinc-850 space-y-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-[8px] font-bold text-amber-600 uppercase tracking-widest font-mono bg-amber-500/10 px-2 py-0.5 rounded w-max mx-auto">
                    <Sparkles className="h-3 w-3" /> Console Sandbox Simulator
                  </div>
                  <p className="text-[10px] text-stone-550 dark:text-zinc-400 leading-normal">
                    In a production SaaS, the partner would click the email/SMS link to accept. Click the mock trigger below to simulate partner acceptance instantly!
                  </p>
                  <button
                    onClick={() => {
                      simulatePartnerAccept();
                      setOnboardStep('details');
                      triggerToast('🎉 Partner accepted! Proceeding to setup shared limits.');
                    }}
                    className="w-full py-2.5 bg-gradient-to-tr from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest cursor-pointer shadow-md transition-all active:scale-[0.99]"
                  >
                    Simulate Partner Acceptance
                  </button>
                </div>
              </div>
            )}

            {onboardStep === 'details' && (
              <form onSubmit={handleCompleteOnboarding} className="p-8 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-900 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 dark:border-zinc-850 pb-4">
                  <Heart className="h-5 w-5 text-amber-500" />
                  <h2 className="font-serif text-lg font-bold">Workspace Configuration</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Relationship Anniversary</label>
                    <input
                      type="date"
                      required
                      value={relStartDate}
                      onChange={(e) => setRelStartDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Combined Monthly Income (INR)</label>
                    <input
                      type="number"
                      required
                      value={combinedIncome}
                      onChange={(e) => setCombinedIncome(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fixed Monthly Rent/EMI</label>
                    <input
                      type="number"
                      required
                      value={fixedExpenses}
                      onChange={(e) => setFixedExpenses(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Outstanding Loans</label>
                    <input
                      type="number"
                      required
                      value={loans}
                      onChange={(e) => setLoans(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Lifestyle Preference</label>
                    <select
                      value={lifestyle}
                      onChange={(e) => setLifestyle(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="frugal">Frugal (Maximum savings)</option>
                      <option value="balanced">Balanced (Proportionate spends)</option>
                      <option value="luxury">Luxury (Comfort-oriented spends)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Do you have children?</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs">
                        <input type="radio" checked={hasChildren} onChange={() => setHasChildren(true)} />
                        Yes
                      </label>
                      <label className="flex items-center gap-1.5 text-xs">
                        <input type="radio" checked={!hasChildren} onChange={() => setHasChildren(false)} />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Primary Financial Goals</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel Japan, Wedding next winter"
                    value={financialGoals}
                    onChange={(e) => setFinancialGoals(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer">
                  Activate Couple OS Workspace
                </button>
              </form>
            )}
          </div>
        ) : (
          
          <div className="space-y-8">
            
            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full bg-zinc-950 border border-stone-200 flex items-center justify-center text-xs font-bold text-amber-500 font-serif">
                    R
                  </div>
                  <div className="h-9 w-9 rounded-full bg-amber-500 border border-white flex items-center justify-center text-xs font-bold text-zinc-950 font-serif">
                    R
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif flex items-center gap-1.5 text-stone-900 dark:text-white">
                    {user?.fullName || 'Rithika'} <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 stroke-[1]" /> {partner?.fullName || 'Rahul'}
                  </h3>
                  <span className="text-[8px] font-mono uppercase text-stone-400 tracking-wider">
                    Connected workspace since {coupleOnboardingDetails?.connectedDate || 'Nov 2024'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-[9px] font-bold font-mono text-emerald-500 uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                  <ShieldCheck className="h-3 w-3" />
                  Connected
                </div>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-[9px] py-2 px-4 rounded-xl cursor-pointer"
                >
                  Log Shared Expense
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-stone-200 dark:border-zinc-900 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-zinc-400 bg-stone-50/50 dark:bg-zinc-900/10 rounded-xl p-1 gap-1">
              {([
                { id: 'overview', name: 'Overview' },
                { id: 'wallets', name: 'Three Wallets' },
                { id: 'goals', name: 'Goals & Budgets' },
                { id: 'analytics', name: 'Analytics' },
                { id: 'bills', name: 'Bills & Vaults' },
                { id: 'predictions', name: 'AI Forecast' },
                { id: 'timeline', name: 'Memories' },
                { id: 'settings', name: 'Settings' }
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-4.5 rounded-lg cursor-pointer transition-all flex-shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-zinc-855 text-amber-600 dark:text-amber-400 shadow-sm' 
                      : 'hover:text-stone-850 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl relative overflow-hidden luxury-card flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Financial Health Score</span>
                      <p className="text-[9px] text-stone-500 leading-relaxed mt-1">AI calculated allocation health</p>
                    </div>

                    <div className="my-6 flex items-baseline justify-center gap-1.5">
                      <span className="text-5xl font-serif font-normal text-stone-850 dark:text-white">{relationshipScore}</span>
                      <span className="text-stone-400 text-sm font-mono">/ 100</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase text-emerald-500 tracking-wider bg-emerald-500/5 py-1 px-2.5 rounded-lg border border-emerald-500/10">
                      <Award className="h-3 w-3 stroke-[1.2]" />
                      <span>Optimal saving velocity index</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest mb-4 block">Shared Treasury Stats</span>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-2">
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Joint Income</span>
                        <h4 className="text-lg font-serif font-normal text-stone-900 dark:text-white mt-1">₹{jointIncome.toLocaleString()}</h4>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Joint Expenses</span>
                        <h4 className="text-lg font-serif font-normal text-stone-900 dark:text-white mt-1">₹{jointExpense.toLocaleString()}</h4>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Joint Savings</span>
                        <h4 className="text-lg font-serif font-normal text-amber-600 dark:text-amber-400 mt-1">₹{jointSavings.toLocaleString()}</h4>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Bills Outstanding</span>
                        <h4 className="text-lg font-serif font-normal text-rose-500 mt-1">₹{totalBillsDue.toLocaleString()}</h4>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 border-t border-stone-100 dark:border-zinc-850 pt-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-stone-500">
                          <span>Target Progress (Japan Trip)</span>
                          <span>34% Saved</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 rounded-full" style={{ width: '34%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {unautomatedBill && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 stroke-[1.2] mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-stone-850 dark:text-zinc-200">AI Recurring Bill Detected</h4>
                        <p className="text-xs text-stone-500 mt-1">
                          We noticed {unautomatedBill.name} billing of ₹{unautomatedBill.amount.toLocaleString()} repeating monthly. Would you like to automate it?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { toggleRecurringBillAutomation(unautomatedBill.id); triggerToast('Automated bill payout active.'); }}
                        className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Automate It
                      </button>
                    </div>
                  </div>
                )}

                <div 
                  className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden"
                  style={{ border: '1px solid rgba(197, 168, 128, 0.12)' }}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
                    AI Relationship Coach Bulletins
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#FAF8F5] dark:bg-zinc-950/40 border border-stone-200/40 dark:border-zinc-850 rounded-xl">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Discretionary Index</span>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">
                        "You saved ₹14,800 more than last month."
                      </p>
                    </div>
                    <div className="p-4 bg-[#FAF8F5] dark:bg-zinc-950/40 border border-stone-200/40 dark:border-zinc-850 rounded-xl">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Budgets Pacing</span>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">
                        "You stayed under your grocery budget limit."
                      </p>
                    </div>
                    <div className="p-4 bg-[#FAF8F5] dark:bg-zinc-950/40 border border-stone-200/40 dark:border-zinc-850 rounded-xl">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Spending Alerts</span>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">
                        "Dining expenses increased by 12%."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Recent Shared Activity Log</h3>
                  <div className="space-y-4">
                    {personalTransactions.slice(0, 3).map((t: any) => (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-stone-50/50 dark:bg-zinc-950/25 border border-stone-200/25 dark:border-zinc-850 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">{t.merchant}</p>
                          <span className="text-[8px] font-mono text-stone-400 uppercase">
                            Logged: {new Date(t.date).toLocaleDateString()} • Paid by {t.whoPaid || 'me'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold font-mono">₹{t.amount.toLocaleString()}</p>
                          {t.splitOwedAmount ? (
                            <span className="text-[8px] font-mono font-bold text-amber-600 block">Split Owed: ₹{t.splitOwedAmount.toLocaleString()}</span>
                          ) : (
                            <span className="text-[8px] font-mono text-stone-400 block">Joint Account</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'wallets' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-3 gap-2 bg-[#FAF8F5] dark:bg-zinc-950 p-1.5 rounded-xl border border-stone-200 dark:border-zinc-850">
                  {([
                    { id: 'my', name: 'My Wallet', desc: 'Salary, personal expenses' },
                    { id: 'partner', name: "Partner's Wallet", desc: 'Rahul salary & shopping' },
                    { id: 'joint', name: 'Joint Wallet', desc: 'Rent, household bills, trips' }
                  ] as const).map(w => (
                    <button
                      key={w.id}
                      onClick={() => setActiveWallet(w.id)}
                      className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                        activeWallet === w.id 
                          ? 'bg-white dark:bg-zinc-850 text-amber-600 dark:text-amber-400 shadow-sm border border-stone-200/50 dark:border-zinc-800' 
                          : 'text-stone-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">{w.name}</span>
                      <span className="text-[7.5px] uppercase tracking-wider block mt-0.5 opacity-80">{w.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl relative overflow-hidden luxury-card">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      {activeWallet === 'my' ? 'My Portfolio' : activeWallet === 'partner' ? 'Partner Portfolio' : 'Joint Household Ledger'}
                    </span>
                    <Wallet className="h-4.5 w-4.5 text-amber-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Checking Balance</span>
                      <h2 className="text-3xl font-normal font-serif text-amber-600 dark:text-amber-400">
                        ₹{(activeWallet === 'joint' ? sharedWallet?.balance || 142000 : activeWallet === 'my' ? 75000 : 82000).toLocaleString()}
                      </h2>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Statement Income</span>
                      <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1">
                        ₹{(activeWallet === 'joint' ? jointIncome : walletIncome || 90000).toLocaleString()}
                      </h4>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Accrued Expenses</span>
                      <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1">
                        ₹{(activeWallet === 'joint' ? jointExpense : walletExpense || 32000).toLocaleString()}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Ledger Statements</h3>
                  <div className="space-y-4">
                    {walletTransactions.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-6">No records matched this portfolio ledger</p>
                    ) : (
                      walletTransactions.map((t: any) => (
                        <div key={t.id} className="flex justify-between items-center p-3 bg-stone-50/50 dark:bg-zinc-950/25 border border-stone-200/25 dark:border-zinc-800 rounded-xl">
                          <div>
                            <p className="text-xs font-bold text-stone-900 dark:text-white">{t.merchant}</p>
                            <span className="text-[8px] font-mono text-stone-400 uppercase block mt-0.5">
                              {new Date(t.date).toLocaleDateString()} • Paid via {t.paymentMethod}
                            </span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="text-xs font-bold font-mono">₹{t.amount.toLocaleString()}</p>
                              {t.splitOwedAmount && (
                                <span className="text-[7.5px] font-mono font-bold text-amber-600 block">Partner owes ₹{t.splitOwedAmount.toLocaleString()}</span>
                              )}
                            </div>
                            <button
                              onClick={() => { deleteTransaction(t.id); triggerToast('Transaction deleted.'); }}
                              className="p-1 hover:text-rose-500 text-stone-300 dark:text-zinc-600 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 stroke-[1.2]" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                
                <div 
                  className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden"
                  style={{ border: '1px solid rgba(197, 168, 128, 0.12)' }}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
                    AI Combined Budget Allocation Builder
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-lg mb-6">
                    Our AI models can automatically generate separate monthly budget pacing limits based on fixed loan margins, lifestyle preference, and city dynamics.
                  </p>

                  <button
                    onClick={triggerAiBudgets}
                    disabled={isGeneratingBudgets}
                    className="py-3 px-5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
                  >
                    {isGeneratingBudgets ? 'Generating Projections...' : 'Generate AI Allocation Budgets'}
                  </button>

                  {aiBudgets && (
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(aiBudgets).map((key: string) => (
                        <div key={key} className="p-3 bg-stone-50 dark:bg-zinc-950/40 border border-stone-200/50 dark:border-zinc-800 rounded-xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block capitalize">{key} Budget</span>
                          <h4 className="text-lg font-serif font-normal text-stone-900 dark:text-white mt-1">₹{aiBudgets[key].toLocaleString()}</h4>
                          <span className="text-[7.5px] font-mono text-stone-400 uppercase mt-0.5 block">AI Suggested Pacing Limit</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                  <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-6">Savings Milestones</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((g: any) => {
                      const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
                      const remains = Math.max(0, g.targetAmount - g.currentAmount);
                      return (
                        <div key={g.id} className="p-4 bg-stone-50/50 dark:bg-zinc-950/25 border border-stone-200/30 dark:border-zinc-900 rounded-xl flex items-center justify-between">
                          <div className="space-y-1.5 flex-1 pr-4">
                            <span className="text-xs font-bold block">{g.name}</span>
                            <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 mt-1">
                              <span>Saved: ₹{g.currentAmount.toLocaleString()}</span>
                              <span className="text-amber-500">Target: ₹{g.targetAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[9px] text-stone-400 italic mt-1 leading-relaxed">
                              "To reach this goal on time, both of you should contribute ₹{(Math.round(remains / 6)).toLocaleString()}/month."
                            </p>
                          </div>
                          
                          <div className="h-12 w-12 rounded-full border-2 border-amber-500/10 flex items-center justify-center text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/5 flex-shrink-0">
                            {pct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Spend Allocation Breakdown</h3>
                    
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Dining', value: 4800 },
                              { name: 'Trips Together', value: 24000 },
                              { name: 'Utilities/Rent', value: 25420 },
                              { name: 'Celebrations', value: 5500 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {['#c5a880', '#a88a64', '#78716c', '#57534e'].map((color, idx) => (
                              <Cell key={idx} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Velocity Ledger</h3>
                    
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { month: 'Mar', spent: 15400 },
                          { month: 'Apr', spent: 18200 },
                          { month: 'May', spent: 34500 },
                          { month: 'Jun', spent: 12100 }
                        ]}>
                          <XAxis dataKey="month" stroke="#a8a29e" fontSize={10} tickLine={false} />
                          <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="spent" fill="#c5a880" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/30 dark:border-zinc-800 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Weekend Allocation Index</span>
                    <h2 className="text-2xl font-normal font-serif text-stone-900 dark:text-white">64%</h2>
                    <p className="text-[9px] text-stone-500 mt-1">Most discretionary spends occur Saturday & Sunday</p>
                  </div>
                  <div className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/30 dark:border-zinc-800 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Most Expensive Month</span>
                    <h2 className="text-2xl font-normal font-serif text-stone-900 dark:text-white">May 2026</h2>
                    <p className="text-[9px] text-stone-500 mt-1">Due to First Vacation shared Goa trip billing</p>
                  </div>
                  <div className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/30 dark:border-zinc-800 rounded-xl text-center">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Top Merchant Category</span>
                    <h2 className="text-2xl font-normal font-serif text-amber-600 dark:text-amber-400">Dining Out</h2>
                    <p className="text-[9px] text-stone-500 mt-1">Swiggy/Zomato orders constitute 24% of bills</p>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'bills' && (
              <div className="space-y-6">
                
                <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                  <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-6">Upcoming Shared Bills</span>
                  
                  <div className="space-y-4">
                    {recurringBills.map((b: any) => (
                      <div key={b.id} className="p-4 bg-stone-50/50 dark:bg-zinc-950/25 border border-stone-200/20 dark:border-zinc-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            b.status === 'paid' ? 'bg-emerald-500' : b.status === 'late' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          <div>
                            <span className="text-xs font-bold text-stone-800 dark:text-zinc-200">{b.name} ({b.category})</span>
                            <span className="text-[8px] font-mono text-stone-400 uppercase block mt-0.5">Due: {b.dueDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono">₹{b.amount.toLocaleString()}</span>
                            <span className="text-[8px] font-mono text-stone-400 block uppercase">{b.status}</span>
                          </div>

                          <div className="flex gap-2">
                            {b.status !== 'paid' && (
                              <button
                                onClick={() => markBillAsPaid(b.id)}
                                className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              onClick={() => { toggleBillReminder(b.id); triggerToast('Reminder configuration updated.'); }}
                              className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850 rounded-lg text-stone-400"
                            >
                              {b.reminderEnabled ? 'Mute' : 'Remind'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                  <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-6">Shared Vaults Registry</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {savingsVaults.map((v: any) => (
                      <div key={v.id} className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-850 rounded-xl">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block capitalize">{v.name}</span>
                        <h4 className="text-lg font-serif font-normal text-amber-600 dark:text-amber-400 mt-1">₹{v.amount.toLocaleString()}</h4>
                        <span className="text-[8px] font-mono text-stone-400 block mt-1">Target: ₹{v.target.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleVaultContribution} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-[#FAF8F5] dark:bg-zinc-950 p-4 rounded-xl border border-stone-200 dark:border-zinc-800">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 font-mono">Select Target Vault</label>
                      <select
                        value={selectedVault}
                        onChange={(e) => setSelectedVault(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      >
                        {savingsVaults.map((v: any) => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 font-mono">Contribution Amount (INR)</label>
                      <input
                        type="number"
                        required
                        placeholder="5000"
                        value={contributionAmt}
                        onChange={(e) => setContributionAmt(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-98">
                      Confirm Contribution
                    </button>
                  </form>
                </div>

              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="space-y-6">
                
                <div 
                  className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden"
                  style={{ border: '1px solid rgba(197, 168, 128, 0.12)' }}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
                    Predictive Modeling Simulator
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-lg mb-8">
                    Slide selectors to simulate the impact of lifestyle modifications or major upcoming expenditures on your long term goals timelines.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span>Discretionary Spending Reduction (%)</span>
                        <span className="font-mono text-amber-600">{savingShift}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={savingShift}
                        onChange={(e) => setSavingShift(parseInt(e.target.value))}
                        className="w-full h-1 bg-stone-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span>Combined Income Increment (%)</span>
                        <span className="font-mono text-amber-600">+{incomeShift}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={incomeShift}
                        onChange={(e) => setIncomeShift(parseInt(e.target.value))}
                        className="w-full h-1 bg-stone-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-[#FAF8F5] dark:bg-zinc-950 rounded-xl border border-stone-200 dark:border-zinc-850">
                      <div>
                        <span className="text-xs font-bold block">Purchase Shared Vehicle?</span>
                        <span className="text-[8px] text-stone-400 uppercase font-mono">Estimated deposit: ₹1,50,000</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCarPurchaseSim(!carPurchaseSim)}
                        className="p-1 hover:text-amber-600 text-stone-400 cursor-pointer"
                      >
                        {carPurchaseSim ? (
                          <ToggleRight className="h-9 w-9 text-amber-600" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-stone-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                    <span className="text-[8px] font-bold text-stone-400 uppercase block mb-1 font-mono">Emergency Fund Yield Date</span>
                    <h4 className="text-lg font-serif font-normal text-amber-600 dark:text-amber-400 mt-1">
                      {savingShift >= 20 ? '4 Months Early' : 'On Track (6 Months)'}
                    </h4>
                    <p className="text-[9px] text-stone-500 mt-1">Timeline projection for ₹2,00,000 threshold</p>
                  </div>

                  <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                    <span className="text-[8px] font-bold text-stone-400 uppercase block mb-1 font-mono">House Down Payment Completion</span>
                    <h4 className="text-lg font-serif font-normal text-stone-800 dark:text-white mt-1">
                      {carPurchaseSim ? 'Delayed by 3 Months' : savingShift >= 15 ? 'December 2026' : 'March 2027'}
                    </h4>
                    <p className="text-[9px] text-stone-500 mt-1">Timeline projection for ₹5,00,000 threshold</p>
                  </div>

                  <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                    <span className="text-[8px] font-bold text-stone-400 uppercase block mb-1 font-mono">AI Risk Forecast</span>
                    <h4 className={`text-lg font-serif font-normal mt-1 ${carPurchaseSim && savingShift < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {carPurchaseSim && savingShift < 10 ? 'Cash Runway Low Alert' : 'Healthy Reserve Index'}
                    </h4>
                    <p className="text-[9px] text-stone-500 mt-1">Projected cash surplus health status</p>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                
                <form onSubmit={handleAddMemory} className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-stone-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
                    <h3 className="font-serif text-sm font-bold text-amber-600 flex items-center gap-1.5">
                      <Camera className="h-4.5 w-4.5 stroke-[1.2]" />
                      Add Financial Milestone
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Memory Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Renting First Apartment"
                        value={newMemoryTitle}
                        onChange={(e) => setNewMemoryTitle(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Expense Cost (INR)</label>
                      <input
                        type="number"
                        required
                        placeholder="10000"
                        value={newMemoryCost}
                        onChange={(e) => setNewMemoryCost(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Anniversary Date</label>
                      <input
                        type="date"
                        required
                        value={newMemoryDate}
                        onChange={(e) => setNewMemoryDate(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Milestone Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Put down the advance key deposit for our home."
                      value={newMemoryDesc}
                      onChange={(e) => setNewMemoryDesc(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer">
                    Log Milestone Memory
                  </button>
                </form>

                <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                  <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-6">Financial Milestone Gallery</span>
                  
                  <div className="relative border-l border-stone-200 dark:border-zinc-800 ml-4.5 space-y-10 py-3">
                    {memories.map((mem: any) => (
                      <div key={mem.id} className="relative pl-7">
                        <div className="absolute -left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-amber-500" />
                        
                        <div className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/30 dark:border-zinc-850 rounded-xl max-w-xl flex flex-col md:flex-row gap-4">
                          <img
                            src={mem.photoUrl}
                            alt="milestone"
                            className="h-24 w-full md:w-32 object-cover rounded-lg border border-stone-200/40"
                          />
                          <div>
                            <span className="text-[8px] font-mono text-stone-400 block mb-1 uppercase tracking-widest">{mem.date}</span>
                            <h4 className="text-xs font-bold text-stone-900 dark:text-white font-serif">{mem.title}</h4>
                            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-2 leading-relaxed">{mem.description}</p>
                            <span className="text-[9px] font-mono font-bold text-amber-600 block mt-2.5">Capital Disbursed: ₹{mem.expense.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Split Defaults Configuration</h3>
                  <p className="text-xs text-stone-550 leading-normal mb-6">
                    Set up default split percentage ratios for shared expenses when logged under "Both".
                  </p>

                  <div className="space-y-4">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={splitDefaultsRatio}
                      onChange={(e) => updateSplitDefaults(parseInt(e.target.value))}
                      className="w-full h-1 bg-stone-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-zinc-300 font-mono">
                      <span>Your Split Default: {splitDefaultsRatio}%</span>
                      <span>Partner Split Default: {100 - splitDefaultsRatio}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Workspace Actions</h3>
                  <p className="text-xs text-stone-550 leading-normal mb-6">
                    Disconnecting will separate your wallets and goals, returning you to individual personal mode.
                  </p>

                  <button
                    onClick={() => { disconnectPartner(); triggerToast('Couple workspace terminated.'); }}
                    className="py-3 px-5 border border-rose-500/20 hover:bg-rose-500/5 text-rose-500 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                  >
                    Disconnect Partner & Terminate Workspace
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
      />
    </Shell>
  );
}
