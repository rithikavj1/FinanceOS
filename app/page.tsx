'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/lib/financeContext';

export default function RootPage() {
  const { user, isOnboarded } = useFinance();
  const router = useRouter();

  useEffect(() => {
    // Wait for context to initialize from localStorage
    const localUser = localStorage.getItem('fo_user');
    const localOnboarded = localStorage.getItem('fo_onboarded') === 'true';

    if (!localUser) {
      router.push('/login');
    } else if (!localOnboarded) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  }, [user, isOnboarded, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        {/* Sleek Apple-style spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading FinanceOS...</p>
      </div>
    </div>
  );
}
