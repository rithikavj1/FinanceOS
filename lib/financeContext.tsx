'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Account, Category, Transaction, Budget, 
  BusinessAccount, Invoice, GstLedger, Goal, Couple, SharedWallet,
  RecurringExpense, MileageLog, TaxRecord, Notification, AiInsight,
  CoupleOnboardingDetails, SharedSavingsVault, RecurringBill, FinancialMemory,
  Client, StockItem, CashBookLog
} from '@/types';
import * as mockSeeds from './mockData';

interface OnboardingData {
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

interface FinanceContextType {
  // Authentication & Mode
  user: User | null;
  partner: User | null;
  couple: Couple | null;
  currentMode: 'personal' | 'business';
  setCurrentMode: (mode: 'personal' | 'business') => void;
  login: (email: string, mode?: 'personal' | 'business') => void;
  logout: () => void;
  onboardUser: (data: OnboardingData) => void;
  invitePartner: (email: string) => void;
  simulatePartnerAccept: () => void;
  isOnboarded: boolean;
  pushNotification: { title: string; body: string } | null;

  // Data Lists
  accounts: Account[];
  sharedWallet: SharedWallet | null;
  businessAccount: BusinessAccount | null;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  recurringExpenses: RecurringExpense[];
  goals: Goal[];
  invoices: Invoice[];
  gstLedger: GstLedger[];
  mileageLogs: MileageLog[];
  taxRecords: TaxRecord[];
  notifications: Notification[];
  aiInsights: AiInsight[];
  clients: Client[];

  // Mutators
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => Budget;
  updateBudgetLimit: (id: string, limit: number) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  addMileageLog: (log: Omit<MileageLog, 'id' | 'createdAt' | 'deductionAmount' | 'ratePerKm'>) => MileageLog;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoalAmount: (id: string, amount: number) => void;
  addNotification: (title: string, body: string, type: Notification['type']) => void;
  onboardBusiness: (details: BusinessAccount) => void;
  resetBusinessWorkspace: () => void;
  updateBusinessAccount: (details: BusinessAccount) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClientStatus: (clientId: string, status: Client['status']) => void;
  deleteClient: (clientId: string) => void;
  markNotificationsAsRead: () => void;

  // Bill Book Features
  stockItems: StockItem[];
  cashBookLogs: CashBookLog[];
  addStockItem: (item: Omit<StockItem, 'id' | 'createdAt'>) => StockItem;
  updateStockQuantity: (id: string, qty: number) => void;
  deleteStockItem: (id: string) => void;
  addCashBookLog: (log: Omit<CashBookLog, 'id' | 'createdAt'>) => CashBookLog;
  reconcileClientUdhaarPayment: (clientId: string, amt: number, method: 'UPI' | 'cash' | 'card' | 'bank_transfer') => void;

  // Couple Finance Additions
  coupleOnboarded: boolean;
  coupleOnboardingDetails: CoupleOnboardingDetails | null;
  savingsVaults: SharedSavingsVault[];
  recurringBills: RecurringBill[];
  memories: FinancialMemory[];
  splitDefaultsRatio: number;
  onboardCouple: (details: CoupleOnboardingDetails) => void;
  addSavingsVaultContribution: (vaultId: string, amount: number) => void;
  toggleRecurringBillAutomation: (billId: string) => void;
  toggleBillReminder: (billId: string) => void;
  markBillAsPaid: (billId: string) => void;
  addFinancialMemory: (memory: Omit<FinancialMemory, 'id'>) => void;
  disconnectPartner: () => void;
  updateSplitDefaults: (splitRatio: number) => void;

  // AI & Voice Operations
  parseVoiceCommand: (transcript: string) => Promise<any>;
  parseReceiptOCR: (fileType: 'pdf' | 'image', fileName: string) => Promise<any>;
  parseUpiScreenshot: (screenshotName: string) => Promise<any>;
  generateAiCoachInsights: () => Promise<AiInsight>;
  generateCoupleInsights: () => Promise<any>;
  generateBusinessInsights: () => Promise<any>;
  
  // App state
  isGeneratingCoach: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [currentMode, setCurrentMode] = useState<'personal' | 'business'>('personal');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sharedWallet, setSharedWallet] = useState<SharedWallet | null>(null);
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [gstLedger, setGstLedger] = useState<GstLedger[]>([]);
  const [mileageLogs, setMileageLogs] = useState<MileageLog[]>([]);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushNotification, setPushNotification] = useState<{ title: string; body: string } | null>(null);
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isGeneratingCoach, setIsGeneratingCoach] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [cashBookLogs, setCashBookLogs] = useState<CashBookLog[]>([]);

  // Couple OS specific states
  const [coupleOnboarded, setCoupleOnboarded] = useState<boolean>(false);
  const [coupleOnboardingDetails, setCoupleOnboardingDetails] = useState<CoupleOnboardingDetails | null>(null);
  const [savingsVaults, setSavingsVaults] = useState<SharedSavingsVault[]>([]);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [memories, setMemories] = useState<FinancialMemory[]>([]);
  const [splitDefaultsRatio, setSplitDefaultsRatio] = useState<number>(50);

  // Load from localStorage on mount
  useEffect(() => {
    const localUser = localStorage.getItem('fo_user');
    if (localUser) {
      setUser(JSON.parse(localUser));
      setIsOnboarded(localStorage.getItem('fo_onboarded') === 'true');
      setPartner(JSON.parse(localStorage.getItem('fo_partner') || 'null'));
      setCouple(JSON.parse(localStorage.getItem('fo_couple') || 'null'));
      setCurrentMode(localStorage.getItem('fo_mode') as 'personal' | 'business' || 'personal');
      
      setAccounts(JSON.parse(localStorage.getItem('fo_accounts') || '[]'));
      setSharedWallet(JSON.parse(localStorage.getItem('fo_sharedWallet') || 'null'));
      setBusinessAccount(JSON.parse(localStorage.getItem('fo_businessAccount') || 'null'));
      setCategories(JSON.parse(localStorage.getItem('fo_categories') || '[]'));
      setTransactions(JSON.parse(localStorage.getItem('fo_transactions') || '[]'));
      setBudgets(JSON.parse(localStorage.getItem('fo_budgets') || '[]'));
      setRecurringExpenses(JSON.parse(localStorage.getItem('fo_recurring') || '[]'));
      setGoals(JSON.parse(localStorage.getItem('fo_goals') || '[]'));
      setInvoices(JSON.parse(localStorage.getItem('fo_invoices') || '[]'));
      setGstLedger(JSON.parse(localStorage.getItem('fo_gst') || '[]'));
      setMileageLogs(JSON.parse(localStorage.getItem('fo_mileage') || '[]'));
      setTaxRecords(JSON.parse(localStorage.getItem('fo_tax') || '[]'));
      setNotifications(JSON.parse(localStorage.getItem('fo_notifications') || '[]'));
      setAiInsights(JSON.parse(localStorage.getItem('fo_insights') || '[]'));
      setClients(JSON.parse(localStorage.getItem('fo_clients') || '[]'));
      setStockItems(JSON.parse(localStorage.getItem('fo_stockItems') || '[]'));
      setCashBookLogs(JSON.parse(localStorage.getItem('fo_cashBook') || '[]'));

      // Load Couple OS parameters
      setCoupleOnboarded(localStorage.getItem('fo_coupleOnboarded') === 'true');
      setCoupleOnboardingDetails(JSON.parse(localStorage.getItem('fo_coupleOnboardingDetails') || 'null'));
      setSavingsVaults(JSON.parse(localStorage.getItem('fo_savingsVaults') || '[]'));
      setRecurringBills(JSON.parse(localStorage.getItem('fo_recurringBills') || '[]'));
      setMemories(JSON.parse(localStorage.getItem('fo_memories') || '[]'));
      setSplitDefaultsRatio(parseInt(localStorage.getItem('fo_splitDefaultsRatio') || '50'));
    } else {
      // Seed with initial mock database for demonstration
      setUser(mockSeeds.mockUser);
      setPartner(mockSeeds.mockPartner);
      setCouple(mockSeeds.mockCouple);
      setIsOnboarded(true);
      
      setAccounts(mockSeeds.mockAccounts);
      setSharedWallet(mockSeeds.mockSharedWallet);
      setBusinessAccount(mockSeeds.mockBusinessAccount);
      setCategories(mockSeeds.mockCategories);
      setTransactions(mockSeeds.mockTransactions);
      setBudgets(mockSeeds.mockBudgets);
      setRecurringExpenses(mockSeeds.mockRecurringExpenses);
      setGoals(mockSeeds.mockGoals);
      setInvoices(mockSeeds.mockInvoices);
      setGstLedger(mockSeeds.mockGstLedger);
      setMileageLogs(mockSeeds.mockMileageLogs);
      setTaxRecords(mockSeeds.mockTaxRecords);
      setNotifications(mockSeeds.mockNotifications);
      
      // Seed Couple OS default values
      setCoupleOnboarded(false);
      setCoupleOnboardingDetails(null);
      
      const seedVaults: SharedSavingsVault[] = [
        { id: 'vault_joint', name: 'Joint Savings', amount: 320000, target: 500000, type: 'joint', updatedAt: new Date().toISOString() },
        { id: 'vault_pers', name: 'Personal Savings', amount: 95000, target: 150000, type: 'personal', updatedAt: new Date().toISOString() },
        { id: 'vault_em', name: 'Emergency Fund', amount: 145000, target: 200000, type: 'emergency', updatedAt: new Date().toISOString() },
        { id: 'vault_inv', name: 'Investment Fund', amount: 180000, target: 300000, type: 'investment', updatedAt: new Date().toISOString() },
        { id: 'vault_vac', name: 'Vacation Fund', amount: 65000, target: 100000, type: 'vacation', updatedAt: new Date().toISOString() }
      ];
      setSavingsVaults(seedVaults);

      const seedBills: RecurringBill[] = [
        { id: 'bill_rent', name: 'Rent', category: 'Rent', amount: 22000, dueDate: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0], status: 'upcoming', isAutomated: true, reminderEnabled: true },
        { id: 'bill_netflix', name: 'Netflix Premium', category: 'Subscriptions', amount: 649, dueDate: new Date(Date.now() + 12*24*60*60*1000).toISOString().split('T')[0], status: 'upcoming', isAutomated: true, reminderEnabled: false },
        { id: 'bill_elec', name: 'Electricity', category: 'Utilities', amount: 3420, dueDate: new Date(Date.now() + 8*24*60*60*1000).toISOString().split('T')[0], status: 'upcoming', isAutomated: false, reminderEnabled: true },
        { id: 'bill_wifi', name: 'Internet Broadband', category: 'Utilities', amount: 1200, dueDate: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], status: 'upcoming', isAutomated: true, reminderEnabled: true },
        { id: 'bill_gym', name: 'Gym Membership', category: 'Lifestyle', amount: 2500, dueDate: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0], status: 'upcoming', isAutomated: false, reminderEnabled: false }
      ];
      setRecurringBills(seedBills);

      const seedMemories: FinancialMemory[] = [
        { id: 'mem_1', title: 'First Vacation Together', expense: 24000, date: '2025-05-12', description: 'Weekend getaway in Goa. Muted sandy beaches & champagne sunsets.', photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
        { id: 'mem_2', title: 'Bought Shared Vehicle', expense: 150000, date: '2025-11-20', description: 'Put down deposit on our SUV.', photoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80' },
        { id: 'mem_3', title: 'Wedding Venue Booking', expense: 200000, date: '2026-02-14', description: 'Locked in the lakeside lawn venue.', photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
        { id: 'mem_4', title: 'First Shared Apartment', expense: 100000, date: '2026-06-01', description: 'Moved into our new HSR layout home.', photoUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80' }
      ];
      setMemories(seedMemories);
      setSplitDefaultsRatio(50);
      
      // Save seeds to local storage
      localStorage.setItem('fo_user', JSON.stringify(mockSeeds.mockUser));
      localStorage.setItem('fo_partner', JSON.stringify(mockSeeds.mockPartner));
      localStorage.setItem('fo_couple', JSON.stringify(mockSeeds.mockCouple));
      localStorage.setItem('fo_onboarded', 'true');
      localStorage.setItem('fo_accounts', JSON.stringify(mockSeeds.mockAccounts));
      localStorage.setItem('fo_sharedWallet', JSON.stringify(mockSeeds.mockSharedWallet));
      localStorage.setItem('fo_businessAccount', JSON.stringify(mockSeeds.mockBusinessAccount));
      localStorage.setItem('fo_categories', JSON.stringify(mockSeeds.mockCategories));
      localStorage.setItem('fo_transactions', JSON.stringify(mockSeeds.mockTransactions));
      localStorage.setItem('fo_budgets', JSON.stringify(mockSeeds.mockBudgets));
      localStorage.setItem('fo_recurring', JSON.stringify(mockSeeds.mockRecurringExpenses));
      localStorage.setItem('fo_goals', JSON.stringify(mockSeeds.mockGoals));
      localStorage.setItem('fo_invoices', JSON.stringify(mockSeeds.mockInvoices));
      localStorage.setItem('fo_gst', JSON.stringify(mockSeeds.mockGstLedger));
      localStorage.setItem('fo_mileage', JSON.stringify(mockSeeds.mockMileageLogs));
      localStorage.setItem('fo_tax', JSON.stringify(mockSeeds.mockTaxRecords));
      localStorage.setItem('fo_notifications', JSON.stringify(mockSeeds.mockNotifications));
      localStorage.setItem('fo_insights', '[]');

      // Bill Book Seeds
      const seedStock: StockItem[] = [
        { id: 'stock_1', name: 'Software Development Retainer (Hour)', quantity: 120, costPrice: 800, sellingPrice: 2500, lowStockLimit: 10, createdAt: new Date().toISOString() },
        { id: 'stock_2', name: 'UI/UX Mobile Design Package', quantity: 15, costPrice: 15000, sellingPrice: 45000, lowStockLimit: 2, createdAt: new Date().toISOString() },
        { id: 'stock_3', name: 'Cloud Infrastructure Setup', quantity: 8, costPrice: 20000, sellingPrice: 60000, lowStockLimit: 2, createdAt: new Date().toISOString() },
        { id: 'stock_4', name: 'AI Fine-tuning Consultation', quantity: 25, costPrice: 5000, sellingPrice: 15000, lowStockLimit: 5, createdAt: new Date().toISOString() }
      ];
      setStockItems(seedStock);
      localStorage.setItem('fo_stockItems', JSON.stringify(seedStock));

      const seedCashLogs: CashBookLog[] = [
        { id: 'cash_1', date: new Date().toISOString().split('T')[0], amount: 15000, type: 'in', description: 'Cash advance from Client X', paymentMethod: 'cash', createdAt: new Date().toISOString() },
        { id: 'cash_2', date: new Date().toISOString().split('T')[0], amount: 3500, type: 'out', description: 'Office refreshments & snacks', paymentMethod: 'cash', createdAt: new Date().toISOString() },
        { id: 'cash_3', date: new Date().toISOString().split('T')[0], amount: 1200, type: 'out', description: 'Local travel auto fare re-route', paymentMethod: 'cash', createdAt: new Date().toISOString() }
      ];
      setCashBookLogs(seedCashLogs);
      localStorage.setItem('fo_cashBook', JSON.stringify(seedCashLogs));

      // Couple OS local storage seeds
      localStorage.setItem('fo_coupleOnboarded', 'false');
      localStorage.setItem('fo_coupleOnboardingDetails', 'null');
      localStorage.setItem('fo_savingsVaults', JSON.stringify(seedVaults));
      localStorage.setItem('fo_recurringBills', JSON.stringify(seedBills));
      localStorage.setItem('fo_memories', JSON.stringify(seedMemories));
      localStorage.setItem('fo_splitDefaultsRatio', '50');
    }
  }, []);

  // Save specific states utility helper with auto-sync database bridge
  const saveState = async (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));

    // Asynchronously sync to Neon serverless database via Route Handler API
    try {
      fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      }).then(res => {
        if (!res.ok) {
          console.debug(`Database sync returned status code: ${res.status}`);
        }
      }).catch(err => {
        // Suppress developer alerts in local offline mode
        console.debug('Neon database sync skipped (running offline/local storage)');
      });
    } catch (e) {
      // Offline fallback
    }
  };

  // Auth Operations
  const login = (email: string, mode: 'personal' | 'business' = 'personal') => {
    const newUser: User = {
      id: 'u1',
      email,
      fullName: email.split('@')[0].toUpperCase(),
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    saveState('fo_user', newUser);
    setCurrentMode(mode);
    localStorage.setItem('fo_mode', mode);

    // Bootstrap basic accounts and default categories
    const initialAccounts: Account[] = [
      { id: 'acc1', userId: 'u1', name: 'Main Checking Account', type: 'checking', balance: 50000.00, currency: 'INR', createdAt: new Date().toISOString() }
    ];
    setAccounts(initialAccounts);
    saveState('fo_accounts', initialAccounts);
    setCategories(mockSeeds.mockCategories);
    saveState('fo_categories', mockSeeds.mockCategories);
    setTransactions([]);
    saveState('fo_transactions', []);
    setBudgets([]);
    saveState('fo_budgets', []);
    setIsOnboarded(false);
    localStorage.setItem('fo_onboarded', 'false');
  };

  const logout = () => {
    setUser(null);
    setPartner(null);
    setCouple(null);
    localStorage.clear();
  };

  // Onboarding
  const onboardUser = (data: OnboardingData) => {
    setIsOnboarded(true);
    localStorage.setItem('fo_onboarded', 'true');

    // Create automatic adaptive budgets based on rules
    // 50/30/20 baseline allocation
    const monthlyIncome = data.salary;
    const rentBudget = data.monthlyRent || 0;
    const loanBudget = data.loans || 0;
    
    // Remaining needs pool
    const totalNeedsPool = monthlyIncome * 0.5;
    const remainingNeeds = Math.max(0, totalNeedsPool - rentBudget - loanBudget);
    
    // Allocate wants pool (30%)
    const wantsPool = monthlyIncome * 0.3;
    
    // Allocate savings pool (20%)
    const savingsPool = Math.max(data.savingsGoal || 0, monthlyIncome * 0.2);

    const generatedBudgets: Budget[] = [
      {
        id: 'b_groc',
        userId: 'u1',
        categoryId: 'cat_groc',
        limitAmount: Math.round(remainingNeeds * 0.4),
        spentAmount: 0,
        period: 'monthly',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'b_util',
        userId: 'u1',
        categoryId: 'cat_util',
        limitAmount: Math.round(remainingNeeds * 0.2),
        spentAmount: 0,
        period: 'monthly',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'b_cafe',
        userId: 'u1',
        categoryId: 'cat_cafe',
        limitAmount: Math.round(wantsPool * 0.2),
        spentAmount: 0,
        period: 'monthly',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'b_dine',
        userId: 'u1',
        categoryId: 'cat_dine',
        limitAmount: Math.round(wantsPool * 0.4),
        spentAmount: 0,
        period: 'monthly',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'b_fuel',
        userId: 'u1',
        categoryId: 'cat_fuel',
        limitAmount: Math.round(remainingNeeds * 0.3),
        spentAmount: 0,
        period: 'monthly',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        createdAt: new Date().toISOString()
      }
    ];

    setBudgets(generatedBudgets);
    saveState('fo_budgets', generatedBudgets);

    // Bootstrap business accounts if business owner
    if (data.business) {
      const bizAcc: BusinessAccount = {
        id: 'biz1',
        userId: 'u1',
        businessName: `${data.occupation || 'Consultant'} Studio`,
        currency: 'INR',
        balance: 100000.00,
        createdAt: new Date().toISOString()
      };
      setBusinessAccount(bizAcc);
      saveState('fo_businessAccount', bizAcc);
    }

    // Bootstrap couple if married
    if (data.married) {
      const coupleObj: Couple = {
        id: 'c1',
        user1Id: 'u1',
        inviteCode: 'LOVE-MATE-700',
        inviteStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      setCouple(coupleObj);
      saveState('fo_couple', coupleObj);
      
      const jointWallet: SharedWallet = {
        id: 'sw1',
        coupleId: 'c1',
        name: 'Shared Expenses Wallet',
        balance: 0.00,
        currency: 'INR',
        createdAt: new Date().toISOString()
      };
      setSharedWallet(jointWallet);
      saveState('fo_sharedWallet', jointWallet);
    }
  };

  const invitePartner = (email: string) => {
    let activeCouple = couple;
    if (!activeCouple) {
      activeCouple = {
        id: 'c1',
        user1Id: 'u1',
        inviteCode: 'LOVE-MATE-700',
        inviteStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      setCouple(activeCouple);
      saveState('fo_couple', activeCouple);
      
      const jointWallet: SharedWallet = {
        id: 'sw1',
        coupleId: 'c1',
        name: 'Shared Expenses Wallet',
        balance: 0.00,
        currency: 'INR',
        createdAt: new Date().toISOString()
      };
      setSharedWallet(jointWallet);
      saveState('fo_sharedWallet', jointWallet);
    }

    localStorage.setItem('fo_partner_invite_email', email);
    const updatedCouple = { ...activeCouple, inviteStatus: 'pending' as const };
    setCouple(updatedCouple);
    saveState('fo_couple', updatedCouple);

    addNotification(
      'Invitation Dispatched',
      `Direct link invite code LOVE-MATE-700 sent to ${email}. Waiting for verification.`,
      'couple_action'
    );
  };

  const simulatePartnerAccept = () => {
    if (couple) {
      const partnerEmail = localStorage.getItem('fo_partner_invite_email') || 'partner@financeos.com';
      const updatedCouple = { ...couple, inviteStatus: 'accepted' as const, user2Id: 'u2' };
      setCouple(updatedCouple);
      saveState('fo_couple', updatedCouple);

      const partnerObj: User = {
        id: 'u2',
        email: partnerEmail,
        fullName: partnerEmail.split('@')[0].toUpperCase(),
        createdAt: new Date().toISOString()
      };
      setPartner(partnerObj);
      saveState('fo_partner', partnerObj);

      addNotification(
        'Partner Joined!',
        `${partnerObj.fullName} accepted your invitation. Shared wallet and couple metrics are now active.`,
        'couple_action'
      );
    }
  };

  // Mutators
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveState('fo_transactions', updated);

    // Update account balances
    if (tx.accountId) {
      setAccounts(prev => {
        const u = prev.map(a => {
          if (a.id === tx.accountId) {
            const newBal = tx.type === 'income' ? a.balance + tx.amount : a.balance - tx.amount;
            return { ...a, balance: newBal };
          }
          return a;
        });
        saveState('fo_accounts', u);
        return u;
      });
    }

    // Update shared wallet balance if joint
    if (tx.sharedWalletId && sharedWallet) {
      const newBal = tx.type === 'income' ? sharedWallet.balance + tx.amount : sharedWallet.balance - tx.amount;
      const updatedWallet = { ...sharedWallet, balance: newBal };
      setSharedWallet(updatedWallet);
      saveState('fo_sharedWallet', updatedWallet);
    }

    // Update business account balance if business mode
    if (currentMode === 'business' && businessAccount) {
      const newBal = tx.type === 'income' ? businessAccount.balance + tx.amount : businessAccount.balance - tx.amount;
      const updatedBiz = { ...businessAccount, balance: newBal };
      setBusinessAccount(updatedBiz);
      saveState('fo_businessAccount', updatedBiz);
    }

    // Recalculate budgets spent amount
    if (tx.type === 'expense' && tx.categoryId) {
      setBudgets(prev => {
        const u = prev.map(b => {
          if (b.categoryId === tx.categoryId) {
            const newSpent = b.spentAmount + tx.amount;
            
            // Check overspending alerts
            if (newSpent >= b.limitAmount) {
              addNotification(
                'Budget Limit Exceeded!',
                `You have overspent on category: ${categories.find(c => c.id === tx.categoryId)?.name}. Limit: ₹${b.limitAmount}, Spent: ₹${newSpent}.`,
                'overspending'
              );
            } else if (newSpent >= b.limitAmount * 0.8) {
              addNotification(
                'Budget Warning (80%)',
                `You have used 80% of your budget for category: ${categories.find(c => c.id === tx.categoryId)?.name}.`,
                'budget_alert'
              );
            }
            
            return { ...b, spentAmount: newSpent };
          }
          return b;
        });
        saveState('fo_budgets', u);
        return u;
      });
    }

    // Auto-detect recurring expenses
    // Heuristic: If we add a transaction with a recurring merchant name, set notification or auto-create it
    if (tx.type === 'expense') {
      const recurringMerchants = ['netflix', 'spotify', 'electricity', 'rent', 'broadband', 'hostinger', 'aws'];
      const normalizedMerchant = tx.merchant?.toLowerCase() || '';
      const matches = recurringMerchants.some(m => normalizedMerchant.includes(m));
      if (matches && !tx.isRecurring) {
        // Auto create recurring expense entry
        const isExist = recurringExpenses.some(r => r.merchant.toLowerCase().includes(normalizedMerchant));
        if (!isExist) {
          const newRecur: RecurringExpense = {
            id: `rec_${Date.now()}`,
            userId: 'u1',
            categoryId: tx.categoryId,
            merchant: tx.merchant || 'Recurring Provider',
            amount: tx.amount,
            frequency: 'monthly',
            nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isActive: true,
            createdAt: new Date().toISOString()
          };
          const updatedRecurring = [...recurringExpenses, newRecur];
          setRecurringExpenses(updatedRecurring);
          saveState('fo_recurring', updatedRecurring);

          addNotification(
            'Recurring Expense Detected',
            `AI detected a potential recurring subscription for ${tx.merchant}. Added to subscriptions tracking.`,
            'budget_alert'
          );
        }
      }
    }

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveState('fo_transactions', updated);

    // Revert balances
    if (tx.accountId) {
      setAccounts(prev => {
        const u = prev.map(a => {
          if (a.id === tx.accountId) {
            const newBal = tx.type === 'income' ? a.balance - tx.amount : a.balance + tx.amount;
            return { ...a, balance: newBal };
          }
          return a;
        });
        saveState('fo_accounts', u);
        return u;
      });
    }

    if (tx.sharedWalletId && sharedWallet) {
      const newBal = tx.type === 'income' ? sharedWallet.balance - tx.amount : sharedWallet.balance + tx.amount;
      const updatedWallet = { ...sharedWallet, balance: newBal };
      setSharedWallet(updatedWallet);
      saveState('fo_sharedWallet', updatedWallet);
    }

    if (tx.type === 'expense' && tx.categoryId) {
      setBudgets(prev => {
        const u = prev.map(b => {
          if (b.categoryId === tx.categoryId) {
            return { ...b, spentAmount: Math.max(0, b.spentAmount - tx.amount) };
          }
          return b;
        });
        saveState('fo_budgets', u);
        return u;
      });
    }
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `b_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    saveState('fo_budgets', updated);
    return newBudget;
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    const updated = budgets.map(b => b.id === id ? { ...b, limitAmount: limit } : b);
    setBudgets(updated);
    saveState('fo_budgets', updated);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    saveState('fo_invoices', updated);

    // Log to GST ledger automatically if business account invoice has GST
    if (invoice.gstAmount > 0 && businessAccount) {
      const newGstEntry: GstLedger = {
        id: `gst_${Date.now()}`,
        businessAccountId: businessAccount.id,
        invoiceId: newInvoice.id,
        type: 'collected',
        gstin: businessAccount.gstin,
        gstRate: invoice.gstRate,
        gstAmount: invoice.gstAmount,
        date: invoice.issueDate,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const updatedGst = [newGstEntry, ...gstLedger];
      setGstLedger(updatedGst);
      saveState('fo_gst', updatedGst);
    }

    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        // If transitioning to paid, add business transaction automatically
        if (status === 'paid' && inv.status !== 'paid' && businessAccount) {
          addTransaction({
            userId: 'u1',
            amount: inv.totalAmount,
            type: 'income',
            merchant: inv.clientName,
            description: `Payment for Invoice ${inv.invoiceNumber}`,
            date: new Date().toISOString(),
            paymentMethod: 'bank_transfer',
            needVsWant: 'need',
            isRecurring: false
          });

          addNotification(
            'Invoice Paid!',
            `Invoice ${inv.invoiceNumber} (₹${inv.totalAmount.toLocaleString()}) has been marked as PAID by ${inv.clientName}.`,
            'invoice_paid'
          );
        }
        return { ...inv, status };
      }
      return inv;
    });
    setInvoices(updated);
    saveState('fo_invoices', updated);
  };

  const addMileageLog = (log: Omit<MileageLog, 'id' | 'createdAt' | 'deductionAmount' | 'ratePerKm'>) => {
    const rate = 8.00; // ₹8.00 per KM IT standard deduction
    const deduction = log.distanceKm * rate;
    const newLog: MileageLog = {
      ...log,
      id: `mil_${Date.now()}`,
      ratePerKm: rate,
      deductionAmount: deduction,
      createdAt: new Date().toISOString()
    };
    const updated = [newLog, ...mileageLogs];
    setMileageLogs(updated);
    saveState('fo_mileage', updated);

    // Deduct as business expense automatically
    if (businessAccount) {
      const extraCosts = 
        (log.fuelCost || 0) + 
        (log.parking || 0) + 
        (log.toll || 0) + 
        (log.foodCost || 0) + 
        (log.stayCost || 0) + 
        (log.travelExpenseCost || 0);

      const totalClaim = deduction + extraCosts;

      addTransaction({
        userId: 'u1',
        amount: totalClaim,
        type: 'expense',
        merchant: 'Mileage & Travel Reimbursement',
        description: `Travel Claim: ${log.purpose} (${log.distanceKm} Km)`,
        date: log.date,
        paymentMethod: 'cash',
        needVsWant: 'need',
        isRecurring: false,
        categoryId: 'cat_biz_trav',
        isBusiness: true,
        businessCategory: 'Travel'
      });
    }

    return newLog;
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `g_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveState('fo_goals', updated);
    return newGoal;
  };

  const updateGoalAmount = (id: string, amount: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextAmount = g.currentAmount + amount;
        const status = nextAmount >= g.targetAmount ? ('completed' as const) : g.status;
        return { ...g, currentAmount: nextAmount, status };
      }
      return g;
    });
    setGoals(updated);
    saveState('fo_goals', updated);
  };

  const addNotification = (title: string, body: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `nt_${Date.now()}`,
      userId: 'u1',
      title,
      body,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => {
      const u = [newNotif, ...prev];
      saveState('fo_notifications', u);
      return u;
    });
    setPushNotification({ title, body });
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setPushNotification(null);
    }, 4000);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => {
      const u = prev.map(n => ({ ...n, isRead: true }));
      saveState('fo_notifications', u);
      return u;
    });
  };

  // AI voice extraction
  const parseVoiceCommand = async (transcript: string) => {
    // Simulated GPT Parsing logic based on prompts/expense_parser.md rules
    // Matcher heuristics:
    const lowercase = transcript.toLowerCase();
    
    let amount = 0;
    const amountMatch = lowercase.match(/(?:rs\.?|₹|inr|paid|spent)\s*(\d+)/i) || lowercase.match(/(\d+)\s*(?:rupees|bucks|rs|for)/i);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1]);
    }

    let merchant = 'Unknown Merchant';
    if (lowercase.includes('starbucks')) merchant = 'Starbucks Coffee';
    else if (lowercase.includes('uber') || lowercase.includes('ola')) merchant = 'Ride Hailing';
    else if (lowercase.includes('amazon')) merchant = 'Amazon';
    else if (lowercase.includes('netflix')) merchant = 'Netflix India';
    else if (lowercase.includes('tea') || lowercase.includes('chai')) merchant = 'Tea Shop';
    else if (lowercase.includes('swiggy') || lowercase.includes('zomato')) merchant = 'Food Delivery';
    else if (lowercase.includes('electricity') || lowercase.includes('bescom')) merchant = 'BESCOM';
    else {
      // Try to extract name after "at" or "for"
      const merchantMatch = lowercase.match(/(?:at|to|from)\s+([a-z\s]+)/i);
      if (merchantMatch) {
        merchant = merchantMatch[1].trim();
      }
    }

    let categoryId = 'cat_shop'; // default shopping
    if (lowercase.includes('tea') || lowercase.includes('coffee') || lowercase.includes('starbucks')) categoryId = 'cat_cafe';
    else if (lowercase.includes('dinner') || lowercase.includes('lunch') || lowercase.includes('restaurant') || lowercase.includes('food')) categoryId = 'cat_dine';
    else if (lowercase.includes('netflix') || lowercase.includes('spotify') || lowercase.includes('subscription')) categoryId = 'cat_sub';
    else if (lowercase.includes('uber') || lowercase.includes('ola') || lowercase.includes('fuel') || lowercase.includes('petrol')) categoryId = 'cat_fuel';
    else if (lowercase.includes('rent')) categoryId = 'cat_rent';
    else if (lowercase.includes('grocery') || lowercase.includes('milk') || lowercase.includes('veggies')) categoryId = 'cat_groc';
    else if (lowercase.includes('bill') || lowercase.includes('electricity') || lowercase.includes('wifi')) categoryId = 'cat_util';

    const needVsWant = (categoryId === 'cat_rent' || categoryId === 'cat_groc' || categoryId === 'cat_util' || categoryId === 'cat_fuel') ? 'need' : 'want';
    const isRecurring = categoryId === 'cat_rent' || categoryId === 'cat_sub';

    return {
      merchant,
      amount,
      categoryId,
      needVsWant,
      isRecurring,
      paymentMethod: 'UPI',
      confidenceScore: 0.95
    };
  };

  // Simulated receipt scanner
  const parseReceiptOCR = async (fileType: 'pdf' | 'image', fileName: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI OCR delay
    
    // Different mocks depending on file name
    if (fileName.toLowerCase().includes('starbucks')) {
      return {
        merchant: 'Starbucks Coffee',
        amount: 320.00,
        categoryId: 'cat_cafe',
        needVsWant: 'want',
        paymentMethod: 'card',
        isRecurring: false,
        confidenceScore: 0.98
      };
    } else if (fileName.toLowerCase().includes('invoice') || fileName.toLowerCase().includes('aws')) {
      return {
        merchant: 'Amazon Web Services',
        amount: 8200.00,
        categoryId: 'cat_biz_host',
        needVsWant: 'need',
        paymentMethod: 'card',
        isRecurring: true,
        confidenceScore: 0.94
      };
    } else {
      return {
        merchant: 'Supermarket Grocery',
        amount: 1450.00,
        categoryId: 'cat_groc',
        needVsWant: 'need',
        paymentMethod: 'UPI',
        isRecurring: false,
        confidenceScore: 0.90
      };
    }
  };

  // Simulated screenshot reader
  const parseUpiScreenshot = async (screenshotName: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate OCR delay
    
    // Gpay, PhonePe, Paytm simulation
    if (screenshotName.toLowerCase().includes('phonepe')) {
      return {
        merchant: 'Chai Point',
        amount: 80.00,
        categoryId: 'cat_cafe',
        needVsWant: 'want',
        paymentMethod: 'UPI',
        isRecurring: false,
        confidenceScore: 0.99,
        refNumber: 'TXN2394829348'
      };
    } else if (screenshotName.toLowerCase().includes('paytm')) {
      return {
        merchant: 'Vikas General Store',
        amount: 1200.00,
        categoryId: 'cat_groc',
        needVsWant: 'need',
        paymentMethod: 'UPI',
        isRecurring: false,
        confidenceScore: 0.97,
        refNumber: 'PAYTM8384920'
      };
    } else {
      return {
        merchant: 'Auto Fare',
        amount: 180.00,
        categoryId: 'cat_fuel',
        needVsWant: 'need',
        paymentMethod: 'UPI',
        isRecurring: false,
        confidenceScore: 0.95,
        refNumber: 'GPAY9983948'
      };
    }
  };

  // AI coach logic
  const generateAiCoachInsights = async () => {
    setIsGeneratingCoach(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation delay
    
    // Calculate actual metrics from transactions
    const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const wants = transactions.filter(t => t.type === 'expense' && t.needVsWant === 'want').reduce((sum, t) => sum + t.amount, 0);
    const discretionaryPercent = totalSpent > 0 ? Math.round((wants / totalSpent) * 100) : 0;
    
    // Find Starbucks visits
    const starbucksVisits = transactions.filter(t => t.merchant?.toLowerCase().includes('starbucks')).length;
    const starbucksSpent = transactions.filter(t => t.merchant?.toLowerCase().includes('starbucks')).reduce((sum, t) => sum + t.amount, 0);

    const coachPayload: AiInsight = {
      id: `insight_${Date.now()}`,
      userId: 'u1',
      type: 'daily',
      content: {
        greeting: `Good evening, ${user?.fullName || 'John'}`,
        yesterday_summary: {
          total_spent: 1240,
          discretionary_percentage: discretionaryPercent || 68,
          need_percentage: 100 - (discretionaryPercent || 68)
        },
        alerts: [
          {
            type: 'budget_warning',
            message: "You're 82% through your food budget with 12 days remaining in the month.",
            severity: 'critical'
          }
        ],
        recommendation: {
          title: 'Discretionary spend alert',
          description: 'Avoid ordering food online tonight. Preparing a quick home meal instead saves ₹620.',
          potential_savings: 620
        },
        long_term_insight: {
          pattern_detected: `You visited Starbucks ${starbucksVisits || 3} times this week, spending ₹${starbucksSpent || 840}.`,
          actionable_alternative: 'Buying a premium espresso capsule machine saves over ₹19,800/year.',
          projected_annual_savings: 19800
        },
        cash_flow_projection: {
          projected_end_of_month_balance: 8400,
          confidence: 'high'
        }
      },
      createdAt: new Date().toISOString()
    };

    setAiInsights(prev => {
      const u = [coachPayload, ...prev];
      saveState('fo_insights', u);
      return u;
    });
    setIsGeneratingCoach(false);

    return coachPayload;
  };

  const generateCoupleInsights = async () => {
    // Generate split insights
    return {
      reconciliation: {
        who_owes_whom: 'partner2',
        amount: 800.00
      },
      goals_pace: [
        { goal_name: 'Trip to Tokyo', days_remaining: 280, pacing: 'on_track' },
        { goal_name: 'New Living Room Couch', days_remaining: 60, pacing: 'behind' }
      ],
      savings_tips: [
        { tip: 'You spent ₹3,400 eating out together last weekend. Cooking twice weekly could save ₹28,000/year.', annual_saving_potential: 28000 }
      ],
      memories_timeline: [
        { date: '2026-07-14', title: 'Romantic Anniversary Dinner at Olive Beach', amount: 3400 },
        { date: '2026-07-08', title: 'Booked flights for Weekend Getaway', amount: 12500 }
      ]
    };
  };

  const generateBusinessInsights = async () => {
    // Generate business recommendations
    // 44ADA Presumptive Tax estimate: 50% of gross revenue is taxed
    const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.subtotal, 0);
    const expenses = transactions.filter(t => t.type === 'expense' && t.categoryId?.startsWith('cat_biz_')).reduce((sum, t) => sum + t.amount, 0);
    
    // GST Collected
    const gstCollected = gstLedger.filter(g => g.type === 'collected').reduce((sum, g) => sum + g.gstAmount, 0);
    const gstPaid = gstLedger.filter(g => g.type === 'paid').reduce((sum, g) => sum + g.gstAmount, 0);

    return {
      net_profit: revenue - expenses,
      tax_estimate: Math.round(revenue * 0.5 * 0.15), // Mock 15% effective tax on half of consultant revenue
      gst_summary: {
        collected: gstCollected,
        paid: gstPaid,
        net_payable_or_credit: gstCollected - gstPaid
      },
      cash_flow_health: 'good',
      insights: [
        {
          title: 'GST Input Tax Credit Opportunity',
          metric: 'Software & SaaS expenses',
          recommendation: 'Ensure you supply PixelCraft Studio gstin on AWS billing pages to deduct ₹3,240 in pending Input Tax Credits.',
          impact_amount: 3240
        },
        {
          title: 'Client concentration risk',
          metric: 'Stripe Billing accounts for 75% of cash flow',
          recommendation: 'Consider onboarding 2 more medium retainers to reduce dependence on Stripe invoice payments.',
          impact_amount: 0
        }
      ]
    };
  };

  const onboardCouple = (details: CoupleOnboardingDetails) => {
    setCoupleOnboarded(true);
    setCoupleOnboardingDetails(details);
    localStorage.setItem('fo_coupleOnboarded', 'true');
    localStorage.setItem('fo_coupleOnboardingDetails', JSON.stringify(details));

    // Force setup status connect
    if (couple) {
      const updatedCouple = { ...couple, inviteStatus: 'accepted' as const, user2Id: 'u2' };
      setCouple(updatedCouple);
      localStorage.setItem('fo_couple', JSON.stringify(updatedCouple));
    }

    addNotification(
      'Couple OS Onboarded',
      'Your shared workspace was successfully created. Wallets, budgets, and milestones are active.',
      'couple_action'
    );
  };

  const onboardBusiness = (details: BusinessAccount) => {
    setBusinessAccount(details);
    saveState('fo_businessAccount', details);
    
    const defaultBizCategories = [
      { id: 'cat_biz_marketing', userId: user?.id || 'u1', name: 'Marketing', color: '#c5a880', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_software', userId: user?.id || 'u1', name: 'Software', color: '#a88a64', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_hosting', userId: user?.id || 'u1', name: 'Hosting', color: '#8f724d', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_rent', userId: user?.id || 'u1', name: 'Office Rent', color: '#78716c', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_salary', userId: user?.id || 'u1', name: 'Employee Salary', color: '#57534e', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_legal', userId: user?.id || 'u1', name: 'Legal', color: '#44403c', type: 'expense' as const, isCustom: false },
      { id: 'cat_biz_taxes', userId: user?.id || 'u1', name: 'Taxes', color: '#d6d3d1', type: 'expense' as const, isCustom: false },
    ];
    
    setCategories(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const newCats = defaultBizCategories.filter(c => !existingIds.has(c.id));
      if (newCats.length === 0) return prev;
      const updated = [...prev, ...newCats];
      saveState('fo_categories', updated);
      return updated;
    });

    addNotification(
      'Business Workspace Initialized',
      `Welcome to Entrepreneur Mode for ${details.businessName}. CFO engine is active.`,
      'budget_alert'
    );
  };

  const resetBusinessWorkspace = () => {
    setBusinessAccount(null);
    localStorage.removeItem('fo_businessAccount');
    
    const personalTxs = transactions.filter(t => !t.isBusiness && !t.categoryId?.startsWith('cat_biz_'));
    setTransactions(personalTxs);
    saveState('fo_transactions', personalTxs);
    
    setInvoices([]);
    saveState('fo_invoices', []);
    
    setMileageLogs([]);
    saveState('fo_mileageLogs', []);
    
    setGstLedger([]);
    saveState('fo_gst', []);
    
    setClients([]);
    saveState('fo_clients', []);
  };

  const updateBusinessAccount = (details: BusinessAccount) => {
    setBusinessAccount(details);
    saveState('fo_businessAccount', details);
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `client_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    saveState('fo_clients', updated);
    return newClient;
  };

  const updateClientStatus = (clientId: string, status: Client['status']) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, status } : c);
    setClients(updated);
    saveState('fo_clients', updated);
  };

  const deleteClient = (clientId: string) => {
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    saveState('fo_clients', updated);
  };

  const addStockItem = (item: Omit<StockItem, 'id' | 'createdAt'>) => {
    const newItem: StockItem = {
      ...item,
      id: `stock_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStockItems(prev => {
      const updated = [newItem, ...prev];
      saveState('fo_stockItems', updated);
      return updated;
    });
    return newItem;
  };

  const updateStockQuantity = (id: string, qty: number) => {
    setStockItems(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, quantity: Math.max(0, qty) } : s);
      saveState('fo_stockItems', updated);
      return updated;
    });
  };

  const deleteStockItem = (id: string) => {
    setStockItems(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveState('fo_stockItems', updated);
      return updated;
    });
  };

  const addCashBookLog = (log: Omit<CashBookLog, 'id' | 'createdAt'>) => {
    const newLog: CashBookLog = {
      ...log,
      id: `cash_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCashBookLogs(prev => {
      const updated = [newLog, ...prev];
      saveState('fo_cashBook', updated);
      return updated;
    });

    if (businessAccount) {
      addTransaction({
        userId: 'u1',
        amount: log.amount,
        type: log.type === 'in' ? 'income' : 'expense',
        merchant: `Cash Book: ${log.type === 'in' ? 'Received' : 'Paid'}`,
        description: log.description,
        date: log.date,
        paymentMethod: 'cash',
        needVsWant: 'need',
        isRecurring: false,
        isBusiness: true,
        businessCategory: log.type === 'in' ? 'Sales' : 'Office Rent'
      });
    }

    return newLog;
  };

  const reconcileClientUdhaarPayment = (clientId: string, amt: number, method: 'UPI' | 'cash' | 'card' | 'bank_transfer') => {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id === clientId) {
          const nextAmt = Math.max(0, c.outstandingAmount - amt);
          return { ...c, outstandingAmount: nextAmt };
        }
        return c;
      });
      saveState('fo_clients', updated);
      return updated;
    });

    const client = clients.find(c => c.id === clientId);

    addTransaction({
      userId: 'u1',
      amount: amt,
      type: 'income',
      merchant: `Credit Pay: ${client?.companyName || 'Client'}`,
      description: `Reconciled Udhaar/Credit partial pay. Outstanding balance cleared.`,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      needVsWant: 'need',
      isRecurring: false,
      isBusiness: true,
      businessCategory: 'Sales'
    });

    if (method === 'cash') {
      const cashLog: CashBookLog = {
        id: `cash_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: amt,
        type: 'in',
        description: `Udhaar Payment: ${client?.companyName || 'Client'}`,
        paymentMethod: 'cash',
        createdAt: new Date().toISOString()
      };
      setCashBookLogs(prev => {
        const updated = [cashLog, ...prev];
        saveState('fo_cashBook', updated);
        return updated;
      });
    }
  };

  const addSavingsVaultContribution = (vaultId: string, amount: number) => {
    setSavingsVaults(prev => {
      const updated = prev.map(v => {
        if (v.id === vaultId) {
          const nextVal = { ...v, amount: v.amount + amount, updatedAt: new Date().toISOString() };
          return nextVal;
        }
        return v;
      });
      localStorage.setItem('fo_savingsVaults', JSON.stringify(updated));
      return updated;
    });

    if (vaultId === 'vault_joint' && sharedWallet) {
      const updatedWallet = { ...sharedWallet, balance: Math.max(0, sharedWallet.balance - amount) };
      setSharedWallet(updatedWallet);
      localStorage.setItem('fo_sharedWallet', JSON.stringify(updatedWallet));
    }
  };

  const toggleRecurringBillAutomation = (billId: string) => {
    setRecurringBills(prev => {
      const updated = prev.map(b => b.id === billId ? { ...b, isAutomated: !b.isAutomated } : b);
      localStorage.setItem('fo_recurringBills', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBillReminder = (billId: string) => {
    setRecurringBills(prev => {
      const updated = prev.map(b => b.id === billId ? { ...b, reminderEnabled: !b.reminderEnabled } : b);
      localStorage.setItem('fo_recurringBills', JSON.stringify(updated));
      return updated;
    });
  };

  const markBillAsPaid = (billId: string) => {
    let billAmt = 0;
    let billName = '';
    setRecurringBills(prev => {
      const updated = prev.map(b => {
        if (b.id === billId) {
          billAmt = b.amount;
          billName = b.name;
          return { ...b, status: 'paid' as const };
        }
        return b;
      });
      localStorage.setItem('fo_recurringBills', JSON.stringify(updated));
      return updated;
    });

    if (billAmt > 0) {
      if (sharedWallet) {
        const updatedWallet = { ...sharedWallet, balance: Math.max(0, sharedWallet.balance - billAmt) };
        setSharedWallet(updatedWallet);
        localStorage.setItem('fo_sharedWallet', JSON.stringify(updatedWallet));
      }

      addTransaction({
        userId: 'u1',
        sharedWalletId: 'sw1',
        amount: billAmt,
        type: 'expense',
        merchant: billName,
        description: `Automated bill pay: ${billName}`,
        date: new Date().toISOString(),
        paymentMethod: 'UPI',
        needVsWant: 'need',
        isRecurring: true,
        whoIsFor: 'both',
        splitType: '50-50',
        whoPaid: 'joint',
        splitOwedAmount: billAmt / 2
      });

      addNotification(
        'Bill Paid Automatically',
        `Recurring bill ${billName} (₹${billAmt}) has been successfully paid and reconciled.`,
        'payment_due'
      );
    }
  };

  const addFinancialMemory = (memory: Omit<FinancialMemory, 'id'>) => {
    const newMemory: FinancialMemory = {
      ...memory,
      id: `mem_${Date.now()}`
    };
    setMemories(prev => {
      const updated = [newMemory, ...prev];
      localStorage.setItem('fo_memories', JSON.stringify(updated));
      return updated;
    });
  };

  const disconnectPartner = () => {
    setCoupleOnboarded(false);
    setCoupleOnboardingDetails(null);
    setPartner(null);
    if (couple) {
      setCouple({ ...couple, inviteStatus: 'pending', user2Id: undefined });
    }
    localStorage.setItem('fo_coupleOnboarded', 'false');
    localStorage.setItem('fo_coupleOnboardingDetails', 'null');
    localStorage.setItem('fo_partner', 'null');
    localStorage.setItem('fo_couple', JSON.stringify({ ...couple, inviteStatus: 'pending', user2Id: undefined }));
  };

  const updateSplitDefaults = (splitRatio: number) => {
    setSplitDefaultsRatio(splitRatio);
    localStorage.setItem('fo_splitDefaultsRatio', splitRatio.toString());
  };

  return (
    <FinanceContext.Provider value={{
      user, partner, couple, currentMode, setCurrentMode,
      login, logout, onboardUser, invitePartner, isOnboarded,
      accounts, sharedWallet, businessAccount, categories, transactions,
      budgets, recurringExpenses, goals, invoices, gstLedger, mileageLogs, taxRecords,
      notifications, pushNotification, aiInsights, clients, stockItems, cashBookLogs,
      addTransaction, deleteTransaction, addBudget, updateBudgetLimit,
      addInvoice, updateInvoiceStatus, addMileageLog, addGoal, updateGoalAmount,
      addNotification, markNotificationsAsRead,
      onboardBusiness, resetBusinessWorkspace, updateBusinessAccount,
      addClient, updateClientStatus, deleteClient,
      addStockItem, updateStockQuantity, deleteStockItem, addCashBookLog, reconcileClientUdhaarPayment,
      parseVoiceCommand, parseReceiptOCR, parseUpiScreenshot,
      generateAiCoachInsights, generateCoupleInsights, generateBusinessInsights,
      isGeneratingCoach,
      
      // Couple OS
      coupleOnboarded, coupleOnboardingDetails, savingsVaults, recurringBills, memories, splitDefaultsRatio,
      onboardCouple, addSavingsVaultContribution, toggleRecurringBillAutomation, toggleBillReminder,
      markBillAsPaid, addFinancialMemory, disconnectPartner, updateSplitDefaults, simulatePartnerAccept
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
