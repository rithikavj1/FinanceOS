'use client';

import React, { useState } from 'react';
import Shell from '@/components/layout/Shell';
import { useFinance } from '@/lib/financeContext';
import AddExpenseModal from '@/components/expense/AddExpenseModal';
import { 
  Plus, Trash2, Wallet, CreditCard, Landmark, ArrowUpRight, ArrowDownRight, 
  AlertCircle, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function DashboardPage() {
  const { 
    accounts, transactions, budgets, categories, deleteTransaction 
  } = useFinance();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'me' | 'partner' | 'both'>('all');

  // Isolate personal transactions from business transactions
  const personalTransactions = transactions.filter(
    (t: any) => !t.isBusiness && !t.categoryId?.startsWith('cat_biz_')
  );

  // Calculations
  const totalAssets = accounts
    .filter((a: any) => a.type !== 'credit_card')
    .reduce((sum: number, a: any) => sum + a.balance, 0);
  
  const creditDebt = accounts
    .filter((a: any) => a.type === 'credit_card')
    .reduce((sum: number, a: any) => sum + a.balance, 0);

  const monthlyExpenseTotal = personalTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const monthlyIncomeTotal = personalTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  // Pie chart formatting
  const expenseTransactions = personalTransactions.filter((t: any) => t.type === 'expense');
  const categorySummary: { [key: string]: number } = {};
  
  expenseTransactions.forEach((t: any) => {
    if (t.categoryId) {
      const cat = categories.find((c: any) => c.id === t.categoryId);
      const name = cat?.name || 'Other';
      categorySummary[name] = (categorySummary[name] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categorySummary).map((name: string) => ({
    name,
    value: categorySummary[name]
  }));

  // Luxury Gold / Muted Charcoal color spectrum
  const COLORS = ['#c5a880', '#a88a64', '#8f724d', '#78716c', '#57534e', '#44403c', '#d6d3d1'];

  // Last 7 Days spending
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayTotal = personalTransactions
      .filter((t: any) => t.type === 'expense' && t.date.split('T')[0] === dateStr)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      amount: dayTotal,
      rawDate: dateStr
    };
  }).reverse();

  return (
    <Shell>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/25 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-normal font-serif text-stone-900 dark:text-white">Personal Portfolio</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500 mt-1">
              Asset tracking, allocations and pacing ledgers
            </p>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[1.5]" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Wealth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Available Assets */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl relative overflow-hidden luxury-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Available Capital</span>
              <Landmark className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
            </div>
            <h2 className="text-3xl font-normal font-serif text-amber-600 dark:text-amber-400">₹{totalAssets.toLocaleString()}</h2>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-stone-400 mt-3">
              <Wallet className="h-3.5 w-3.5 stroke-[1.2]" />
              <span>Checking, Savings & Cash balances</span>
            </div>
          </div>

          {/* Card 2: Debt outstanding */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl relative overflow-hidden luxury-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Credit Outstanding</span>
              <CreditCard className="h-4.5 w-4.5 text-stone-500 stroke-[1.2]" />
            </div>
            <h2 className="text-3xl font-normal font-serif text-stone-600 dark:text-stone-400">₹{creditDebt.toLocaleString()}</h2>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-stone-400 mt-3">
              <AlertCircle className="h-3.5 w-3.5 stroke-[1.2]" />
              <span>Outstanding credit limits accrued</span>
            </div>
          </div>

          {/* Card 3: Cashflow trajectory */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl relative overflow-hidden luxury-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Net Surplus</span>
              <TrendingUp className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
            </div>
            <h2 className={`text-3xl font-normal font-serif ${monthlyIncomeTotal - monthlyExpenseTotal >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-500'}`}>
              ₹{(monthlyIncomeTotal - monthlyExpenseTotal).toLocaleString()}
            </h2>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-stone-400 mt-3">
              {monthlyIncomeTotal - monthlyExpenseTotal >= 0 ? (
                <>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-500 stroke-[1.2]" />
                  <span>Positive trajectory this cycle</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-500 stroke-[1.2]" />
                  <span>Deficit trajectory this cycle</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Spending Speed Bar */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Velocity Ledger (Last 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysData}>
                  <XAxis dataKey="day" stroke="#a8a29e" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121214', 
                      borderColor: 'rgba(197, 168, 128, 0.15)',
                      borderRadius: '12px',
                      color: '#fafafa',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Bar dataKey="amount" fill="#c5a880" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Share Pie */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm flex flex-col justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Portfolio Allocation</h3>
            <div className="h-48 flex items-center justify-center">
              {pieData.length === 0 ? (
                <p className="text-xs text-stone-400 uppercase tracking-widest">No allocations recorded</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#121214', 
                        borderColor: 'rgba(197, 168, 128, 0.15)',
                        borderRadius: '12px',
                        color: '#fafafa',
                        fontSize: '11px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {/* Pie Legend */}
            <div className="flex flex-wrap gap-2 justify-center mt-2 max-h-16 overflow-y-auto">
              {pieData.slice(0, 4).map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate max-w-[60px]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Budgets Progress Bar & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Budgets Limits */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Limits Pacing</h3>
            
            <div className="space-y-5 flex-1">
              {budgets.length === 0 ? (
                <p className="text-xs text-stone-400 uppercase tracking-wider">No budgets allocated</p>
              ) : (
                budgets.map((b: any) => {
                  const cat = categories.find((c: any) => c.id === b.categoryId);
                  const progress = Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
                  const isHigh = progress >= 80;
                  return (
                    <div key={b.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="uppercase text-[10px] tracking-wide text-stone-600 dark:text-zinc-400">{cat?.name || 'Category'}</span>
                        <span className="font-mono text-stone-850 dark:text-zinc-200">
                          ₹{b.spentAmount.toLocaleString()} / <span className="text-stone-400">₹{b.limitAmount.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? 'bg-amber-600' : 'bg-stone-500 dark:bg-amber-500/60'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-stone-450">
                        <span>{progress}% Allocated</span>
                        {isHigh && (
                          <span className="text-amber-600 font-bold flex items-center gap-0.5 animate-pulse">
                            <AlertCircle className="h-2.5 w-2.5" />
                            Overspending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Ledger List */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Recent Ledger Entries</h3>
              
              {/* Purpose filter segmented control */}
              <div className="flex bg-stone-50 dark:bg-zinc-950 p-1 border border-stone-200/40 dark:border-zinc-800 rounded-xl text-[9px] font-bold uppercase tracking-wider">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'me', label: 'Me' },
                  { id: 'partner', label: 'Partner' },
                  { id: 'both', label: 'Shared' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPurposeFilter(opt.id as any)}
                    className={`py-1 px-3.5 rounded-lg transition-all cursor-pointer ${
                      purposeFilter === opt.id
                        ? 'bg-amber-600 text-white shadow-sm font-bold'
                        : 'text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3.5 flex-1 max-h-80 overflow-y-auto">
              {personalTransactions.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-10 uppercase tracking-widest">No ledger transactions</p>
              ) : (
                personalTransactions
                  .filter((t: any) => {
                    if (purposeFilter === 'all') return true;
                    return t.whoIsFor === purposeFilter;
                  })
                  .map((t: any) => {
                    const cat = categories.find((c: any) => c.id === t.categoryId);
                    const isExpense = t.type === 'expense';
                    const purposeLabel = 
                      t.whoIsFor === 'both' ? 'Shared' : 
                      t.whoIsFor === 'partner' ? 'Partner' : 'Me';
                    const purposeColor = 
                      t.whoIsFor === 'both' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 
                      t.whoIsFor === 'partner' ? 'bg-stone-500/5 text-stone-500 border-stone-500/10' : 
                      'bg-amber-500/5 text-amber-600 border-amber-500/10';

                    return (
                      <div 
                        key={t.id} 
                        className="flex items-center justify-between p-3.5 bg-stone-50/50 dark:bg-zinc-950/40 border border-stone-200/25 dark:border-zinc-900 rounded-xl"
                      >
                        <div className="flex items-center gap-3.5">
                          <div 
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat?.color || '#a8a29e' }}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold tracking-tight text-stone-850 dark:text-zinc-200">{t.merchant}</span>
                              <span className={`text-[7px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${purposeColor}`}>
                                {purposeLabel}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-stone-400 uppercase mt-1">
                              {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {t.paymentMethod}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className={`text-xs font-bold font-mono ${isExpense ? 'text-stone-850 dark:text-zinc-200' : 'text-amber-500'}`}>
                              {isExpense ? '-' : '+'}₹{t.amount.toLocaleString()}
                            </span>
                            {isExpense && (
                              <span className="text-[7px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5 border border-stone-200 dark:border-zinc-800 tracking-widest text-stone-500 dark:text-zinc-400 font-mono">
                                {t.needVsWant}
                              </span>
                            )}
                          </div>

                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-stone-300 dark:text-zinc-650 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[1.2]" />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

        </div>

      </div>

      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
      />
    </Shell>
  );
}
