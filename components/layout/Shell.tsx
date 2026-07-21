'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFinance } from '@/lib/financeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquareText, Briefcase, Users2, Settings, 
  Sparkles, Bell, Sun, Moon, LogOut, ArrowLeftRight, X
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, currentMode, setCurrentMode, logout, businessAccount, couple, notifications, markNotificationsAsRead, pushNotification
  } = useFinance();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync theme with localStorage and document element on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme ? (savedTheme === 'dark') : systemPrefersDark;
    
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (typeof document !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleModeSwitch = () => {
    const nextMode = currentMode === 'personal' ? 'business' : 'personal';
    setCurrentMode(nextMode);
    if (nextMode === 'business') {
      router.push('/business');
    } else {
      router.push('/dashboard');
    }
  };

  const menuItems = [
    { name: 'Personal OS', path: '/dashboard', icon: LayoutDashboard, visible: currentMode === 'personal' },
    { name: 'AI Coach', path: '/coach', icon: MessageSquareText, visible: currentMode === 'personal' },
    { name: 'Entrepreneur', path: '/business', icon: Briefcase, visible: currentMode === 'business' },
    { name: 'Couple OS', path: '/couple', icon: Users2, visible: currentMode === 'personal' },
    { name: 'Settings', path: '/settings', icon: Settings, visible: true },
  ];

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-[#FAF8F5] text-stone-900'} transition-colors duration-500 font-sans`}>
      
      {/* Global Push Notification Toast */}
      <AnimatePresence>
        {pushNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 24, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="fixed top-0 left-0 right-0 z-55 mx-auto max-w-sm px-4 pointer-events-none"
          >
            <div 
              className="bg-black/90 dark:bg-zinc-900/95 border border-amber-500/25 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-xl pointer-events-auto"
              style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}
            >
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-500 mt-0.5 animate-pulse">
                <Sparkles className="h-4 w-4 fill-amber-500/10" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 font-mono">System Notification</h4>
                  <span className="text-[8px] font-mono text-stone-500">Just Now</span>
                </div>
                <p className="text-xs font-bold font-serif text-stone-100 leading-snug">{pushNotification.title}</p>
                <p className="text-[10px] text-stone-400 dark:text-zinc-400 leading-normal">{pushNotification.body}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-200 dark:border-zinc-900 p-6 flex-shrink-0 bg-white dark:bg-zinc-950">
        
        {/* Logo */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <span className="text-xs font-bold text-zinc-950 tracking-tight font-serif">F</span>
          </div>
          <span className="font-serif text-xl font-bold tracking-wide bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">FinanceOS</span>
        </div>

        {/* Executive Mode Switcher is hidden under separate login accounts workspace rules */}

        {/* Navigation Links */}
        <nav className="space-y-1 flex-1">
          {menuItems.filter(item => item.visible).map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                  isActive 
                    ? 'bg-amber-500/10 dark:bg-amber-500/10 border-l-2 border-amber-500 text-amber-700 dark:text-amber-400' 
                    : 'hover:bg-stone-100 dark:hover:bg-zinc-900/60 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.2] transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile and Settings Foot */}
        <div className="border-t border-stone-200/50 dark:border-zinc-900 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                alt="avatar" 
                className="h-8 w-8 rounded-full border border-stone-200/40 dark:border-zinc-800" 
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-tight truncate max-w-[100px]">{user?.fullName}</span>
                <span className="text-[9px] font-mono text-stone-400 dark:text-zinc-500 truncate max-w-[100px]">{user?.email}</span>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-stone-200/40 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-all text-stone-500 dark:text-zinc-400 cursor-pointer"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5 stroke-[1.2]" /> : <Moon className="h-3.5 w-3.5 stroke-[1.2]" />}
            </button>
          </div>

          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rose-500/10 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 text-rose-500 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[1.2]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Shell & Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-200/30 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3.5 md:hidden">
            <div className="h-7 w-7 rounded bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center text-zinc-950 font-bold font-serif text-xs">
              F
            </div>
            <span className="font-serif text-md font-bold tracking-wide">FinanceOS</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500 bg-stone-100 dark:bg-zinc-900/60 py-1.5 px-3.5 rounded-full border border-stone-200/20 dark:border-zinc-800/20">
            <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
            <span>AI Copilot — Executive Grade</span>
          </div>

          <div className="flex items-center gap-3 ml-auto relative">
            {/* Quick Switch Mobile is hidden under separate login accounts workspace rules */}

            {/* Notification Bell */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="p-2.5 rounded-xl border border-stone-200/50 dark:border-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-all text-stone-500 dark:text-zinc-400 relative cursor-pointer"
            >
              <Bell className="h-4 w-4 stroke-[1.2]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-stone-850 dark:text-zinc-100"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-stone-100 dark:border-zinc-800 pb-2">
                    <span className="text-xs font-bold font-serif">Inbox Notifications</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-[10px] text-stone-400 py-6">No recent updates</p>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n.id} className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-900 rounded-xl">
                          <p className="text-[11px] font-bold flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${n.type === 'overspending' ? 'bg-rose-500' : n.type === 'invoice_paid' ? 'bg-amber-500' : 'bg-zinc-400'}`} />
                            {n.title}
                          </p>
                          <p className="text-[9px] text-stone-500 dark:text-zinc-400 mt-1 leading-normal">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-stone-200/50 dark:border-zinc-900 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-around px-2 z-40">
        {menuItems.filter(item => item.visible).map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive 
                  ? 'text-amber-500' 
                  : 'text-stone-500 dark:text-zinc-500'
              }`}
            >
              <Icon className="h-5 w-5 stroke-[1.2]" />
              <span className="text-[9px] font-bold mt-1 tracking-wider uppercase truncate max-w-[50px]">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
