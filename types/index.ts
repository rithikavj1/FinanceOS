// TypeScript Definitions for FinanceOS

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Couple {
  id: string;
  user1Id: string;
  user2Id?: string;
  inviteCode: string;
  inviteStatus: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'other';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface SharedWallet {
  id: string;
  coupleId: string;
  name: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId?: string; // null if global
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  sharedWalletId?: string;
  categoryId?: string;
  amount: number;
  type: 'income' | 'expense';
  merchant?: string;
  description?: string;
  date: string;
  paymentMethod: 'UPI' | 'cash' | 'card' | 'bank_transfer' | 'other';
  needVsWant: 'need' | 'want';
  isRecurring: boolean;
  gpsLat?: number;
  gpsLong?: number;
  whoIsFor?: 'me' | 'partner' | 'both';
  splitType?: '50-50' | '60-40' | '70-30' | 'custom';
  whoPaid?: 'me' | 'partner' | 'joint';
  splitOwedAmount?: number;
  createdAt: string;
  isBusiness?: boolean;
  gstAmount?: number;
  gstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  invoiceNumber?: string;
  receiptUrl?: string;
  businessCategory?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId?: string;
  limitAmount: number;
  spentAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  gstin?: string;
  currency: string;
  balance: number;
  createdAt: string;
  logoUrl?: string;
  businessType?: string;
  registrationType?: string;
  isGstRegistered?: boolean;
  pan?: string;
  address?: string;
  financialYear?: string;
  bankAccount?: string;
  primaryIndustry?: string;
  businessCategories?: string[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  businessAccountId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  pdfUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface GstLedger {
  id: string;
  businessAccountId: string;
  invoiceId?: string;
  transactionId?: string;
  type: 'collected' | 'paid';
  gstin?: string;
  gstRate: number;
  gstAmount: number;
  date: string;
  status: 'pending' | 'filed' | 'reconciled';
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  coupleId?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: 'vacation' | 'car' | 'house' | 'wedding' | 'emergency' | 'other';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface AiInsight {
  id: string;
  userId: string;
  coupleId?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'couple' | 'business';
  content: any; // matches the schema structure of respective prompts
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'overspending' | 'budget_alert' | 'payment_due' | 'couple_action' | 'invoice_paid';
  isRead: boolean;
  createdAt: string;
}

export interface VoiceLog {
  id: string;
  userId: string;
  audioUrl?: string;
  transcript?: string;
  structuredJson?: any;
  processed: boolean;
  createdAt: string;
}

export interface Receipt {
  id: string;
  userId: string;
  transactionId?: string;
  filePath: string;
  fileType: 'pdf' | 'image';
  ocrText?: string;
  confidenceScore?: number;
  extractedData?: any;
  createdAt: string;
}

export interface RecurringExpense {
  id: string;
  userId: string;
  categoryId?: string;
  merchant: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface TaxRecord {
  id: string;
  businessAccountId: string;
  financialYear: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  estimatedTax: number;
  actualPaid: number;
  status: 'estimated' | 'paid' | 'filed';
  createdAt: string;
}

export interface MileageLog {
  id: string;
  businessAccountId: string;
  date: string;
  purpose: string;
  distanceKm: number;
  ratePerKm: number;
  deductionAmount: number;
  startLocation?: string;
  endLocation?: string;
  createdAt: string;
  vehicle?: string;
  fuelCost?: number;
  parking?: number;
  toll?: number;
  foodCost?: number;
  stayCost?: number;
  travelExpenseCost?: number;
  receiptPhotoUrl?: string;
  isVerified?: boolean;
  notes?: string;
}

export interface CoupleOnboardingDetails {
  relationshipStartDate: string;
  connectedDate: string;
  combinedIncome: number;
  fixedExpenses: number;
  loans: number;
  financialGoals: string;
  lifestyle: 'frugal' | 'balanced' | 'luxury';
  children: boolean;
  travelFrequency: 'low' | 'medium' | 'high';
  city: string;
}

export interface SharedSavingsVault {
  id: string;
  name: string;
  amount: number;
  target: number;
  type: 'joint' | 'personal' | 'emergency' | 'investment' | 'vacation';
  updatedAt: string;
}

export interface RecurringBill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'late' | 'upcoming';
  isAutomated: boolean;
  reminderEnabled: boolean;
}

export interface FinancialMemory {
  id: string;
  title: string;
  expense: number;
  date: string;
  description: string;
  photoUrl: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  billingAddress: string;
  outstandingAmount: number;
  status: 'active' | 'inactive' | 'lead' | 'vip';
  createdAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockLimit: number;
  createdAt: string;
}

export interface CashBookLog {
  id: string;
  date: string;
  amount: number;
  type: 'in' | 'out';
  description: string;
  paymentMethod: 'UPI' | 'cash' | 'card' | 'bank_transfer';
  createdAt: string;
}

