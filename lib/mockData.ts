import { 
  User, Account, Category, Transaction, Budget, 
  BusinessAccount, Invoice, GstLedger, Goal, Couple, SharedWallet,
  RecurringExpense, MileageLog, TaxRecord, Notification
} from '@/types';

// Standard mock user
export const mockUser: User = {
  id: 'u1',
  email: 'john.doe@entrepreneur.com',
  fullName: 'John Doe',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
};

// Partner user
export const mockPartner: User = {
  id: 'u2',
  email: 'jane.smith@partner.com',
  fullName: 'Jane Smith',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
};

// Couple connection
export const mockCouple: Couple = {
  id: 'c1',
  user1Id: 'u1',
  user2Id: 'u2',
  inviteCode: 'LOVE-FIN-500',
  inviteStatus: 'accepted',
  createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
};

// Accounts
export const mockAccounts: Account[] = [
  {
    id: 'acc1',
    userId: 'u1',
    name: 'HDFC Savings Account',
    type: 'savings',
    balance: 145200.00,
    currency: 'INR',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'acc2',
    userId: 'u1',
    name: 'ICICI Credit Card',
    type: 'credit_card',
    balance: 24500.00, // outstanding limit
    currency: 'INR',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'acc3',
    userId: 'u1',
    name: 'Cash Wallet',
    type: 'cash',
    balance: 4500.00,
    currency: 'INR',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Joint Wallet
export const mockSharedWallet: SharedWallet = {
  id: 'sw1',
  coupleId: 'c1',
  name: 'Joint House Wallet',
  balance: 38400.00,
  currency: 'INR',
  createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
};

// Business Accounts
export const mockBusinessAccount: BusinessAccount = {
  id: 'biz1',
  userId: 'u1',
  businessName: 'PixelCraft Studio LLC',
  gstin: '29ABCDE1234F1Z5',
  currency: 'INR',
  balance: 624500.00,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
};

// Categories (Global & Custom)
export const mockCategories: Category[] = [
  // Income
  { id: 'cat_sal', name: 'Salary', type: 'income', color: '#10B981', icon: 'DollarSign', isCustom: false },
  { id: 'cat_fre', name: 'Freelance Revenue', type: 'income', color: '#3B82F6', icon: 'Briefcase', isCustom: false },
  
  // Expenses - Needs
  { id: 'cat_rent', name: 'Rent & Housing', type: 'expense', color: '#EF4444', icon: 'Home', isCustom: false },
  { id: 'cat_groc', name: 'Groceries', type: 'expense', color: '#F59E0B', icon: 'ShoppingCart', isCustom: false },
  { id: 'cat_util', name: 'Electricity & Wifi', type: 'expense', color: '#8B5CF6', icon: 'Zap', isCustom: false },
  { id: 'cat_med', name: 'Medicines', type: 'expense', color: '#EC4899', icon: 'HeartPulse', isCustom: false },
  { id: 'cat_fuel', name: 'Fuel & Commute', type: 'expense', color: '#6B7280', icon: 'Car', isCustom: false },
  
  // Expenses - Wants
  { id: 'cat_cafe', name: 'Cafe & Coffee', type: 'expense', color: '#F97316', icon: 'Coffee', isCustom: false },
  { id: 'cat_dine', name: 'Dining Out', type: 'expense', color: '#EF4444', icon: 'Utensils', isCustom: false },
  { id: 'cat_sub', name: 'Subscriptions', type: 'expense', color: '#06B6D4', icon: 'Tv', isCustom: false },
  { id: 'cat_shop', name: 'Shopping', type: 'expense', color: '#14B8A6', icon: 'Shirt', isCustom: false },
  { id: 'cat_ent', name: 'Entertainment', type: 'expense', color: '#A855F7', icon: 'Sparkles', isCustom: false },
  
  // Business Categories
  { id: 'cat_biz_soft', name: 'Software & SaaS', type: 'expense', color: '#3B82F6', icon: 'Cpu', isCustom: true },
  { id: 'cat_biz_mktg', name: 'Ads & Marketing', type: 'expense', color: '#EAB308', icon: 'Megaphone', isCustom: true },
  { id: 'cat_biz_host', name: 'Hosting & Server', type: 'expense', color: '#6366F1', icon: 'Server', isCustom: true },
  { id: 'cat_biz_trav', name: 'Client Travel', type: 'expense', color: '#10B981', icon: 'Plane', isCustom: true },
  { id: 'cat_biz_off', name: 'Office Supplies', type: 'expense', color: '#EC4899', icon: 'Paperclip', isCustom: true }
];

// Seed Transactions (Last 15 days)
export const mockTransactions: Transaction[] = [
  // Income
  {
    id: 'tx_inc1',
    userId: 'u1',
    accountId: 'acc1',
    categoryId: 'cat_sal',
    amount: 120000.00,
    type: 'income',
    merchant: 'Acme Corp',
    description: 'Monthly Salary Credit',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'bank_transfer',
    needVsWant: 'need',
    isRecurring: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx_inc2',
    userId: 'u1',
    accountId: 'acc1',
    categoryId: 'cat_fre',
    amount: 45000.00,
    type: 'income',
    merchant: 'Upwork Client',
    description: 'UI Redesign Milestone',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'bank_transfer',
    needVsWant: 'need',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  
  // Personal Needs
  {
    id: 'tx1',
    userId: 'u1',
    accountId: 'acc1',
    categoryId: 'cat_rent',
    amount: 22000.00,
    type: 'expense',
    merchant: 'Owner Sharma',
    description: 'Rent for Flat 402',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'bank_transfer',
    needVsWant: 'need',
    isRecurring: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx2',
    userId: 'u1',
    accountId: 'acc3',
    categoryId: 'cat_groc',
    amount: 2450.00,
    type: 'expense',
    merchant: 'Nature Basket',
    description: 'Weekly veggies and snacks',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'cash',
    needVsWant: 'need',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx3',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_util',
    amount: 3420.00,
    type: 'expense',
    merchant: 'BESCOM Electricity',
    description: 'Electricity Bill',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'card',
    needVsWant: 'need',
    isRecurring: true,
    createdAt: new Date().toISOString()
  },
  
  // Personal Wants (Cafe cluster, dining out)
  {
    id: 'tx4',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_cafe',
    amount: 280.00,
    type: 'expense',
    merchant: 'Starbucks Coffee',
    description: 'Iced Latte & Cinnamon Roll',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'want',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx5',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_cafe',
    amount: 310.00,
    type: 'expense',
    merchant: 'Starbucks Coffee',
    description: 'Java Chip Frappe',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'want',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx6',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_cafe',
    amount: 250.00,
    type: 'expense',
    merchant: 'Starbucks Coffee',
    description: 'Espresso',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'want',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx7',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_dine',
    amount: 2400.00,
    type: 'expense',
    merchant: 'Toscano Restaurant',
    description: 'Dinner with friends',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'want',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx8',
    userId: 'u1',
    accountId: 'acc2',
    categoryId: 'cat_sub',
    amount: 649.00,
    type: 'expense',
    merchant: 'Netflix India',
    description: 'Monthly Premium Plan',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'card',
    needVsWant: 'want',
    isRecurring: true,
    createdAt: new Date().toISOString()
  },
  
  // Couple transactions (marked with shared wallet)
  {
    id: 'tx_cp1',
    userId: 'u1',
    sharedWalletId: 'sw1',
    categoryId: 'cat_dine',
    amount: 3400.00,
    type: 'expense',
    merchant: 'Olive Beach Restaurant',
    description: 'Romantic Couple Dinner date',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'want',
    isRecurring: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tx_cp2',
    userId: 'u1',
    sharedWalletId: 'sw1',
    categoryId: 'cat_groc',
    amount: 1800.00,
    type: 'expense',
    merchant: 'Instamart Groceries',
    description: 'Household groceries weekly split',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    needVsWant: 'need',
    isRecurring: false,
    createdAt: new Date().toISOString()
  }
];

// Budgets (This Month)
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

export const mockBudgets: Budget[] = [
  {
    id: 'b1',
    userId: 'u1',
    categoryId: 'cat_groc',
    limitAmount: 12000.00,
    spentAmount: 4250.00,
    period: 'monthly',
    startDate: new Date(currentYear, currentMonth, 1).toISOString(),
    endDate: new Date(currentYear, currentMonth, daysInMonth).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    userId: 'u1',
    categoryId: 'cat_cafe',
    limitAmount: 5000.00,
    spentAmount: 4100.00, // 82% overspent indicator!
    period: 'monthly',
    startDate: new Date(currentYear, currentMonth, 1).toISOString(),
    endDate: new Date(currentYear, currentMonth, daysInMonth).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    userId: 'u1',
    categoryId: 'cat_dine',
    limitAmount: 15000.00,
    spentAmount: 5800.00,
    period: 'monthly',
    startDate: new Date(currentYear, currentMonth, 1).toISOString(),
    endDate: new Date(currentYear, currentMonth, daysInMonth).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'b4',
    userId: 'u1',
    categoryId: 'cat_fuel',
    limitAmount: 6000.00,
    spentAmount: 2500.00,
    period: 'monthly',
    startDate: new Date(currentYear, currentMonth, 1).toISOString(),
    endDate: new Date(currentYear, currentMonth, daysInMonth).toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Recurring Expenses
export const mockRecurringExpenses: RecurringExpense[] = [
  {
    id: 'rec1',
    userId: 'u1',
    categoryId: 'cat_sub',
    merchant: 'Netflix',
    amount: 649.00,
    frequency: 'monthly',
    nextDueDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec2',
    userId: 'u1',
    categoryId: 'cat_util',
    merchant: 'BESCOM Electricity',
    amount: 3200.00,
    frequency: 'monthly',
    nextDueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec3',
    userId: 'u1',
    categoryId: 'cat_rent',
    merchant: 'Apartment Rent',
    amount: 22000.00,
    frequency: 'monthly',
    nextDueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Savings Goals
export const mockGoals: Goal[] = [
  {
    id: 'g1',
    userId: 'u1',
    name: 'Emergency Fund',
    targetAmount: 200000.00,
    currentAmount: 145000.00,
    targetDate: new Date(currentYear, 11, 31).toISOString(), // End of year
    category: 'emergency',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g2',
    userId: 'u1',
    coupleId: 'c1',
    name: 'Trip to Tokyo',
    targetAmount: 350000.00,
    currentAmount: 180000.00,
    targetDate: new Date(currentYear + 1, 3, 30).toISOString(), // Cherry blossom season next year
    category: 'vacation',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g3',
    userId: 'u1',
    coupleId: 'c1',
    name: 'New Living Room Couch',
    targetAmount: 60000.00,
    currentAmount: 45000.00,
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'house',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Entrepreneur Mode: Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    businessAccountId: 'biz1',
    invoiceNumber: 'INV-2026-004',
    clientName: 'Google Cloud Platform Dev',
    clientEmail: 'billing@gcp.com',
    clientAddress: '1600 Amphitheatre Pkwy, Mountain View, CA',
    issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { id: 'i1', description: 'Design Sprint and Wireframing', quantity: 1, rate: 80000.00, amount: 80000.00 },
      { id: 'i2', description: 'Next.js Frontend Architecture consulting', quantity: 40, rate: 3000.00, amount: 120000.00 }
    ],
    subtotal: 200000.00,
    gstRate: 18,
    gstAmount: 36000.00,
    totalAmount: 236000.00,
    status: 'sent',
    notes: 'Please pay within 30 days. Wire transfer details on invoice.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inv2',
    businessAccountId: 'biz1',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Stripe Payments Inc',
    clientEmail: 'billing@stripe.com',
    clientAddress: '354 Oyster Point Blvd, South San Francisco, CA',
    issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { id: 'i3', description: 'Tailwind CSS V4 component design library', quantity: 1, rate: 150000.00, amount: 150000.00 }
    ],
    subtotal: 150000.00,
    gstRate: 18,
    gstAmount: 27000.00,
    totalAmount: 177000.00,
    status: 'paid',
    notes: 'Thank you for your business!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inv3',
    businessAccountId: 'biz1',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Meta Platforms Inc',
    clientEmail: 'invoice@meta.com',
    clientAddress: '1 Hacker Way, Menlo Park, CA',
    issueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { id: 'i4', description: 'React 19 Server Components tuning', quantity: 10, rate: 5000.00, amount: 50000.00 }
    ],
    subtotal: 50000.00,
    gstRate: 18,
    gstAmount: 9000.00,
    totalAmount: 59000.00,
    status: 'overdue',
    notes: 'Payment overdue by 5 days.',
    createdAt: new Date().toISOString()
  }
];

// Entrepreneur Mode: GST Ledger
export const mockGstLedger: GstLedger[] = [
  {
    id: 'gst1',
    businessAccountId: 'biz1',
    invoiceId: 'inv2',
    type: 'collected',
    gstin: '29ABCDE1234F1Z5',
    gstRate: 18,
    gstAmount: 27000.00,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'reconciled',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gst2',
    businessAccountId: 'biz1',
    invoiceId: 'inv1',
    type: 'collected',
    gstin: '29ABCDE1234F1Z5',
    gstRate: 18,
    gstAmount: 36000.00,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  // Paid GST on software expense
  {
    id: 'gst3',
    businessAccountId: 'biz1',
    type: 'paid',
    gstin: '33AWSDE5678H1Z8',
    gstRate: 18,
    gstAmount: 3240.00, // GST on Rs. 18,000 server expense
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// Entrepreneur Mode: Mileage Logs
export const mockMileageLogs: MileageLog[] = [
  {
    id: 'mil1',
    businessAccountId: 'biz1',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purpose: 'Client Meetup - Google Office Bengaluru',
    distanceKm: 28.5,
    ratePerKm: 12.00,
    deductionAmount: 342.00,
    startLocation: 'HSR Layout Sector 3',
    endLocation: 'RMZ Infinity, Old Madras Road',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mil2',
    businessAccountId: 'biz1',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purpose: 'Tech Conference & Networking',
    distanceKm: 42.0,
    ratePerKm: 12.00,
    deductionAmount: 504.00,
    startLocation: 'HSR Layout Sector 3',
    endLocation: 'Whitefield Sheraton Hotel',
    createdAt: new Date().toISOString()
  }
];

// Entrepreneur Mode: Tax Records
export const mockTaxRecords: TaxRecord[] = [
  {
    id: 'tax1',
    businessAccountId: 'biz1',
    financialYear: '2025-2026',
    quarter: 'Q1',
    estimatedTax: 12500.00,
    actualPaid: 12500.00,
    status: 'paid',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tax2',
    businessAccountId: 'biz1',
    financialYear: '2026-2027',
    quarter: 'Q1',
    estimatedTax: 34500.00,
    actualPaid: 0.00,
    status: 'estimated',
    createdAt: new Date().toISOString()
  }
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'nt1',
    userId: 'u1',
    title: 'Starbucks budget alert',
    body: "You're 82% through your Cafe budget with 12 days remaining in the month.",
    type: 'overspending',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    id: 'nt2',
    userId: 'u1',
    title: 'Invoice paid!',
    body: 'Stripe Payments Inc paid invoice INV-2026-003 for amount ₹1,77,000.',
    type: 'invoice_paid',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'nt3',
    userId: 'u1',
    title: 'Couple split request',
    body: 'Jane Smith tagged you in a split for restaurant visit: Olive Beach (₹3,400).',
    type: 'couple_action',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];
