'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { useFinance } from '@/lib/financeContext';
import { 
  Briefcase, Plus, FileText, CheckCircle2, AlertTriangle, Landmark, 
  MapPin, Printer, Calculator, Download, Receipt, Users, PlusCircle, 
  ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, ShieldCheck, 
  DollarSign, Eye, Mail, MessageSquare, Edit3, Trash2, Search, Bell, 
  Settings, FileSpreadsheet, RefreshCw, BarChart3, HelpCircle, Activity, 
  Sparkles, Scale, Info, Check, Trash, Trash2 as Trash2Icon, Send, Sparkle, Camera
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Client, Invoice, InvoiceItem, Transaction, BusinessAccount } from '@/types';
import AddExpenseModal from '@/components/expense/AddExpenseModal';

const COLORS = ['#c5a880', '#a88a64', '#8f724d', '#78716c', '#57534e', '#44403c', '#d6d3d1'];

export default function BusinessPage() {
  const { 
    currentMode, setCurrentMode, businessAccount, invoices, gstLedger, 
    mileageLogs, taxRecords, transactions, addInvoice, updateInvoiceStatus, 
    addMileageLog, generateBusinessInsights, clients, onboardBusiness, 
    resetBusinessWorkspace, updateBusinessAccount, addClient, updateClientStatus, 
    deleteClient, addTransaction, deleteTransaction, budgets, categories, accounts,
    stockItems, cashBookLogs, addStockItem, updateStockQuantity, deleteStockItem, 
    addCashBookLog, reconcileClientUdhaarPayment
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [bizInsights, setBizInsights] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  
  // Onboarding Form State
  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState('Freelancer');
  const [bizReg, setBizReg] = useState('Sole Proprietor');
  const [isGst, setIsGst] = useState(false);
  const [gstinNum, setGstinNum] = useState('');
  const [panNum, setPanNum] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [finYear, setFinYear] = useState('FY 2026-27');
  const [currencyVal, setCurrencyVal] = useState('INR');
  const [bankAccVal, setBankAccVal] = useState('HDFC Business Account');
  const [primaryInd, setPrimaryInd] = useState('Creative & Digital Agency');

  // Client Form State
  const [showClientCreator, setShowClientCreator] = useState(false);
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientGst, setClientGst] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientStatus, setClientStatus] = useState<'active' | 'inactive' | 'lead' | 'vip'>('active');

  // Invoice Form State
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);
  const [invoiceClientSelect, setInvoiceClientSelect] = useState('');
  const [invoiceItemName, setInvoiceItemName] = useState('');
  const [invoiceItemRate, setInvoiceItemRate] = useState('');
  const [invoiceItemQty, setInvoiceItemQty] = useState('1');
  const [invoiceItemsList, setInvoiceItemsList] = useState<any[]>([]);
  const [invoiceDiscount, setInvoiceDiscount] = useState('0');
  const [invoiceNotes, setInvoiceNotes] = useState('Thank you for partnering with us.');

  // Expense Modal state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Mileage Form State
  const [showMileageCreator, setShowMileageCreator] = useState(false);
  const [mDate, setMDate] = useState(new Date().toISOString().split('T')[0]);
  const [mPurpose, setMPurpose] = useState('');
  const [mDistance, setMDistance] = useState('');
  const [mFuel, setMFuel] = useState('');
  const [mParking, setMParking] = useState('0');
  const [mToll, setMToll] = useState('0');
  const [mFood, setMFood] = useState('0');
  const [mStay, setMStay] = useState('0');
  const [mTravelExpense, setMTravelExpense] = useState('0');
  const [mReceiptUrl, setMReceiptUrl] = useState('');
  const [mReceiptName, setMReceiptName] = useState('');
  const [mIsScanning, setMIsScanning] = useState(false);
  const [mValidationError, setMValidationError] = useState('');

  // AI-powered travel receipt OCR scanner
  const handleMileageReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setMReceiptName(file.name);
    setMIsScanning(true);
    setMValidationError('');

    setTimeout(() => {
      setMIsScanning(false);
      // Mock values scanned from receipt
      setMParking('250');
      setMFood('1850');
      setMStay('4800');
      setMTravelExpense('6500');
      setMReceiptUrl('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=300&q=80');
      triggerToast('AI OCR complete. Parking, Stay, Food, and Travel expenses auto-filled.');
    }, 1500);
  };

  // Cash Flow Simulation Settings
  const [cfMonthForecast, setCfMonthForecast] = useState<number>(3);
  const [expectedGrowth, setExpectedGrowth] = useState<number>(10);

  // AI CFO Coach Chat States
  const [coachMessages, setCoachMessages] = useState<any[]>([
    { sender: 'coach', text: 'Good day. I am your CFO Copilot. I have reconciled your ledger files. Ask me about cash runway, tax write-offs, or client balances.', date: new Date().toLocaleTimeString() }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachIsTyping, setCoachIsTyping] = useState(false);

  // Bill Book Sub-Navigation States
  const [billBookSubTab, setBillBookSubTab] = useState<'crm' | 'stock' | 'cashbook'>('crm');

  // Client Credit Collection States
  const [payClientSelect, setPayClientSelect] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'UPI' | 'cash' | 'card' | 'bank_transfer'>('UPI');
  const [showPaymentRecorder, setShowPaymentRecorder] = useState(false);

  // Stock Inventory States
  const [newStockName, setNewStockName] = useState('');
  const [newStockQty, setNewStockQty] = useState('');
  const [newStockCost, setNewStockCost] = useState('');
  const [newStockSell, setNewStockSell] = useState('');
  const [newStockLow, setNewStockLow] = useState('5');
  const [showStockCreator, setShowStockCreator] = useState(false);

  // Daily Cash Book States
  const [newCashAmount, setNewCashAmount] = useState('');
  const [newCashType, setNewCashType] = useState<'in' | 'out'>('in');
  const [newCashDesc, setNewCashDesc] = useState('');
  const [showCashLogCreator, setShowCashLogCreator] = useState(false);

  useEffect(() => {
    const fetchBizData = async () => {
      const data = await generateBusinessInsights();
      setBizInsights(data);
    };
    if (businessAccount) {
      fetchBizData();
    }
  }, [invoices, transactions, gstLedger, mileageLogs, businessAccount]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Onboarding Submit
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName) return;
    const newBiz: BusinessAccount = {
      id: `biz_${Date.now()}`,
      userId: 'u1',
      businessName: bizName,
      gstin: isGst ? gstinNum : undefined,
      currency: currencyVal,
      balance: 142000,
      createdAt: new Date().toISOString(),
      businessType: bizType,
      registrationType: bizReg,
      isGstRegistered: isGst,
      pan: panNum,
      address: addressVal,
      financialYear: finYear,
      bankAccount: bankAccVal,
      primaryIndustry: primaryInd,
      businessCategories: ['Marketing', 'Software', 'Hosting', 'Office Rent', 'Electricity', 'Salaries', 'Travel']
    };
    onboardBusiness(newBiz);
    triggerToast('Business Workspace Created.');
  };

  // Add Client Submit
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompanyName || !clientContact) return;
    addClient({
      companyName: clientCompanyName,
      contactPerson: clientContact,
      phone: clientPhone,
      email: clientEmail,
      gstin: clientGst || undefined,
      billingAddress: clientAddress,
      outstandingAmount: 0,
      status: clientStatus
    });
    setClientCompanyName('');
    setClientContact('');
    setClientPhone('');
    setClientEmail('');
    setClientGst('');
    setClientAddress('');
    setShowClientCreator(false);
    triggerToast('Client Registered.');
  };

  // Add invoice item
  const handleAddInvoiceItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceItemName || !invoiceItemRate) return;
    setInvoiceItemsList(prev => [
      ...prev,
      {
        description: invoiceItemName,
        rate: parseFloat(invoiceItemRate) || 0,
        quantity: parseInt(invoiceItemQty) || 1
      }
    ]);
    setInvoiceItemName('');
    setInvoiceItemRate('');
    setInvoiceItemQty('1');
  };

  // Create Invoice
  const handleCreateInvoiceSubmit = () => {
    if (!invoiceClientSelect || invoiceItemsList.length === 0) {
      triggerToast('Provide a client and at least one item.');
      return;
    }
    const sub = invoiceItemsList.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const gstRate = 18;
    const gstAmt = Math.round(sub * 0.18);
    const disc = parseFloat(invoiceDiscount) || 0;
    const total = sub + gstAmt - disc;

    const itemsArr: InvoiceItem[] = invoiceItemsList.map((item, index) => ({
      id: `inv_item_${index}_${Date.now()}`,
      description: item.description,
      rate: item.rate,
      quantity: item.quantity,
      amount: item.rate * item.quantity
    }));

    const clientObj = clients.find(c => c.id === invoiceClientSelect);

    const newInv = addInvoice({
      businessAccountId: businessAccount?.id || 'biz1',
      invoiceNumber: `INV-2026-${invoices.length + 101}`,
      clientName: clientObj?.companyName || invoiceClientSelect,
      clientEmail: clientObj?.email || 'billing@client.com',
      clientAddress: clientObj?.billingAddress || 'Client Office Address',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: itemsArr,
      subtotal: sub,
      gstRate,
      gstAmount: gstAmt,
      totalAmount: total,
      status: 'sent',
      notes: invoiceNotes
    });

    // Update Client Outstanding
    if (clientObj) {
      clientObj.outstandingAmount += total;
    }

    // Auto-generate transaction representing sales revenue
    addTransaction({
      userId: 'u1',
      amount: total,
      type: 'income',
      merchant: clientObj?.companyName || invoiceClientSelect,
      description: `Invoice ${newInv.invoiceNumber} Sent`,
      date: new Date().toISOString(),
      paymentMethod: 'bank_transfer',
      needVsWant: 'need',
      isRecurring: false,
      isBusiness: true,
      businessCategory: 'Sales',
      gstAmount: gstAmt,
      gstRate
    });

    // Decrement inventory stock count automatically for matches in the stock catalog
    itemsArr.forEach(invItem => {
      const matchedStockItem = stockItems.find(s => s.name.toLowerCase() === invItem.description.toLowerCase());
      if (matchedStockItem) {
        updateStockQuantity(matchedStockItem.id, matchedStockItem.quantity - invItem.quantity);
      }
    });

    setInvoiceItemsList([]);
    setInvoiceClientSelect('');
    setInvoiceDiscount('0');
    setShowInvoiceCreator(false);
    triggerToast('Invoice Generated.');
  };

  // Add Mileage
  const handleAddMileageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mPurpose || !mDistance) return;
    
    const dist = parseFloat(mDistance) || 0;
    const rate = 8; // ₹8 per km deduction
    const decAmt = dist * rate;

    const fuel = parseFloat(mFuel) || 0;
    const parking = parseFloat(mParking) || 0;
    const toll = parseFloat(mToll) || 0;
    const food = parseFloat(mFood) || 0;
    const stay = parseFloat(mStay) || 0;
    const travel = parseFloat(mTravelExpense) || 0;

    // Compliance verification rules (Anti-cheating checks)
    const extraOpexClaimed = parking > 0 || food > 0 || stay > 0 || travel > 0;
    if (extraOpexClaimed && !mReceiptUrl) {
      setMValidationError('Verification receipt upload is required for parking, food, stay, or long-distance travel expenses to prevent fraud.');
      return;
    }

    addMileageLog({
      businessAccountId: businessAccount?.id || 'biz1',
      date: mDate,
      purpose: mPurpose,
      distanceKm: dist,
      vehicle: 'Business Sedan (MH02-EC-4421)',
      fuelCost: fuel,
      parking: parking,
      toll: toll,
      foodCost: food,
      stayCost: stay,
      travelExpenseCost: travel,
      receiptPhotoUrl: mReceiptUrl || undefined,
      isVerified: !!mReceiptUrl,
      notes: mReceiptUrl 
        ? `Verified travel opex claim. Receipt: ${mReceiptName}` 
        : 'Standard driving distance claim (exempt from receipt rules).'
    });



    setMPurpose('');
    setMDistance('');
    setMFuel('');
    setMParking('0');
    setMToll('0');
    setMFood('0');
    setMStay('0');
    setMTravelExpense('0');
    setMReceiptUrl('');
    setMReceiptName('');
    setMValidationError('');
    setShowMileageCreator(false);
    triggerToast('Mileage & travel expenses logged successfully.');
  };

  // Reconcile Invoice as Paid
  const handleReconcileInvoice = (invId: string) => {
    updateInvoiceStatus(invId, 'paid');
    const invObj = invoices.find(i => i.id === invId);
    if (invObj) {
      // Re-add as resolved bank income
      addTransaction({
        userId: 'u1',
        amount: invObj.totalAmount,
        type: 'income',
        merchant: invObj.clientName,
        description: `Settlement for Invoice ${invObj.invoiceNumber}`,
        date: new Date().toISOString(),
        paymentMethod: 'bank_transfer',
        needVsWant: 'need',
        isRecurring: false,
        isBusiness: true,
        businessCategory: 'Sales'
      });
      // Update outstanding client
      const cl = clients.find(c => c.companyName === invObj.clientName);
      if (cl) {
        cl.outstandingAmount = Math.max(0, cl.outstandingAmount - invObj.totalAmount);
      }
    }
    triggerToast('Invoice Marked Paid & Reconciled.');
  };

  // Bill Book Handlers
  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockName || !newStockSell) return;

    addStockItem({
      name: newStockName,
      quantity: parseInt(newStockQty) || 0,
      costPrice: parseFloat(newStockCost) || 0,
      sellingPrice: parseFloat(newStockSell) || 0,
      lowStockLimit: parseInt(newStockLow) || 5
    });

    setNewStockName('');
    setNewStockQty('');
    setNewStockCost('');
    setNewStockSell('');
    setNewStockLow('5');
    setShowStockCreator(false);
    triggerToast('Stock catalog item registered successfully.');
  };

  const handleCashLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashAmount || !newCashDesc) return;

    addCashBookLog({
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(newCashAmount) || 0,
      type: newCashType,
      description: newCashDesc,
      paymentMethod: 'cash'
    });

    setNewCashAmount('');
    setNewCashDesc('');
    setShowCashLogCreator(false);
    triggerToast(`Daily cash-${newCashType === 'in' ? 'in' : 'out'} recorded.`);
  };

  const handleCreditPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payClientSelect || !payAmount) return;

    reconcileClientUdhaarPayment(
      payClientSelect,
      parseFloat(payAmount) || 0,
      payMethod
    );

    setPayClientSelect('');
    setPayAmount('');
    setPayMethod('UPI');
    setShowPaymentRecorder(false);
    triggerToast('Udhaar/Credit payment reconciled successfully.');
  };

  // Generate and download/print Invoice PDF
  const handleDownloadInvoice = (inv: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Pop-up blocked. Please allow popups for downloading invoices.');
      return;
    }

    const itemsHtml = inv.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.rate.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.amount.toLocaleString()}</td>
      </tr>
    `).join('');

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${inv.invoiceNumber} - ${inv.clientName}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            line-height: 1.5;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #e5e7eb;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #c5a880;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #a88a64;
          }
          .title {
            font-size: 28px;
            font-weight: 300;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            font-size: 13px;
          }
          .details-col {
            width: 45%;
          }
          .label {
            font-weight: bold;
            color: #78716c;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 13px;
          }
          th {
            background-color: #f9fafb;
            color: #4b5563;
            font-weight: bold;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
          }
          .totals-table {
            width: 40%;
            margin-left: auto;
            margin-bottom: 0;
          }
          .totals-table td {
            padding: 8px 10px;
          }
          .total-row {
            font-size: 16px;
            font-weight: bold;
            color: #a88a64;
            border-top: 1px solid #e5e7eb;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            font-size: 11px;
            color: #78716c;
            text-align: center;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-box {
              border: none;
              box-shadow: none;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo">${businessAccount?.businessName || 'PixelCraft Studio'}</div>
              <div style="font-size: 12px; color: #78716c; margin-top: 5px;">
                GSTIN: ${businessAccount?.gstin || 'N/A'}<br>
                PAN: ${businessAccount?.pan || 'N/A'}<br>
                ${businessAccount?.address || 'BKC, Mumbai, India'}
              </div>
            </div>
            <div style="text-align: right;">
              <div class="title">INVOICE</div>
              <div style="font-size: 13px; font-weight: bold; color: #78716c; margin-top: 5px;">
                ${inv.invoiceNumber}
              </div>
            </div>
          </div>

          <div class="details-row">
            <div class="details-col">
              <div class="label">Billed To:</div>
              <strong>${inv.clientName}</strong><br>
              ${inv.clientEmail}<br>
              ${inv.clientAddress}
            </div>
            <div class="details-col" style="text-align: right;">
              <div class="label">Invoice Details:</div>
              Date of Issue: <strong>${inv.issueDate}</strong><br>
              Due Date: <strong>${inv.dueDate}</strong><br>
              Status: <strong>${inv.status.toUpperCase()}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 120px;">Rate</th>
                <th style="text-align: right; width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="width: 50%; font-size: 11px; color: #78716c;">
              <div class="label">Notes:</div>
              ${inv.notes || 'Thank you for choosing us.'}
            </div>
            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">₹${inv.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>GST (18%)</td>
                <td style="text-align: right;">₹${inv.gstAmount.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Total Amount</td>
                <td style="text-align: right;">₹${inv.totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            This is an electronically generated document. No physical signature is required.
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    triggerToast('PDF print preview generated.');
  };

  // Global & AI Search Function
  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setAiReply(null);
      setAiSearchActive(false);
      return;
    }
    setAiSearchActive(true);

    const norm = query.toLowerCase();
    if (norm.includes('facebook') || norm.includes('ads') || norm.includes('marketing')) {
      const spend = transactions
        .filter((t: any) => t.isBusiness && t.businessCategory === 'Marketing')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      setAiReply(`CFO Intelligence: You have logged ₹${spend.toLocaleString()} under Marketing/Advertising. Last log was ₹18,500 on Facebook Ads.`);
    } else if (norm.includes('unpaid') || norm.includes('outstanding') || norm.includes('invoice')) {
      const unpaid = invoices.filter(i => i.status !== 'paid');
      setAiReply(`CFO Intelligence: Found ${unpaid.length} outstanding invoices. Cumulative unpaid balance is ₹${unpaid.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}.`);
    } else if (norm.includes('software') || norm.includes('hosting')) {
      const spend = transactions
        .filter((t: any) => t.isBusiness && (t.businessCategory === 'Software' || t.businessCategory === 'Hosting'))
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      setAiReply(`CFO Intelligence: Software & Hosting spending this month equals ₹${spend.toLocaleString()}, matching budget boundaries.`);
    } else {
      setAiReply(`Search matched ${transactions.filter((t: any) => t.merchant?.toLowerCase().includes(norm)).length} entries in business ledger database.`);
    }
  };

  // CFO Coach Send Message
  const handleCoachSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    const userMsg = { sender: 'user', text: coachInput, date: new Date().toLocaleTimeString() };
    setCoachMessages(prev => [...prev, userMsg]);
    const query = coachInput.toLowerCase();
    setCoachInput('');
    setCoachIsTyping(true);

    setTimeout(() => {
      let reply = "I am processing your business balance sheet logs. Ask me about tax deductions, outstanding cash, cash runway, client credit balances, or inventory stock levels.";
      
      if (query.includes('runway') || query.includes('shortage') || query.includes('cash')) {
        const cashInToday = cashBookLogs.filter(l => l.type === 'in').reduce((sum, l) => sum + l.amount, 0);
        const cashOutToday = cashBookLogs.filter(l => l.type === 'out').reduce((sum, l) => sum + l.amount, 0);
        const liquidCashBalance = 25000 + cashInToday - cashOutToday;
        const opexBurn = transactions
          .filter((t: any) => t.isBusiness && t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0) || 45000;
        const runwayDays = Math.round((liquidCashBalance / (opexBurn || 1)) * 30);
        reply = `CFO Forecast: With your current liquid Cash Book balance (₹${liquidCashBalance.toLocaleString()}) and average business OPEX burn, your runway is approximately ${runwayDays} days. Daily cash ledger records today show: Cash-In ₹${cashInToday} | Cash-Out ₹${cashOutToday}.`;
      } else if (query.includes('tax') || query.includes('gst') || query.includes('save')) {
        const gstPaid = gstLedger.filter((g: any) => g.type === 'paid').reduce((sum: number, g: any) => sum + g.gstAmount, 0);
        reply = `CFO Insight: Input Tax Credit (ITC) balance available is ₹${gstPaid.toLocaleString()}. Logging mileage deductions has saved ₹2,400 under section 37(1) this month. Ensure you collect GST invoices for hosting tools.`;
      } else if (query.includes('unpaid') || query.includes('client') || query.includes('due') || query.includes('udhaar') || query.includes('credit')) {
        const outstanding = clients.reduce((sum, c) => sum + c.outstandingAmount, 0);
        const outstandingList = clients.filter(c => c.outstandingAmount > 0).map(c => `${c.companyName}: ₹${c.outstandingAmount}`).join(', ');
        reply = `CFO Credit Ledger Alert: Client outstanding accounts (Udhaar Ledger) total ₹${outstanding.toLocaleString()}${outstanding > 0 ? ` [${outstandingList}]` : ''}. Recommend triggering custom payment reminder templates to clear these receivables.`;
      } else if (query.includes('stock') || query.includes('inventory') || query.includes('product') || query.includes('alert')) {
        const lowStock = stockItems.filter(s => s.quantity <= s.lowStockLimit);
        if (lowStock.length > 0) {
          const list = lowStock.map(s => `${s.name} (${s.quantity} remaining)`).join(', ');
          reply = `CFO Stock Alert: You have ${lowStock.length} items with low inventory levels: ${list}. Recommend replenishment soon to prevent delivery delays on pending invoices.`;
        } else {
          reply = `CFO Inventory Report: All stock levels are healthy! Total catalog items: ${stockItems.length}. Estimated asset value: ₹${stockItems.reduce((sum, s) => sum + (s.quantity * s.costPrice), 0).toLocaleString()} (At Cost).`;
        }
      } else if (query.includes('growth') || query.includes('revenue')) {
        reply = "CFO Revenue Intelligence: Month-over-month growth index is pacing at +14.2%. Your top margin generator is Projects/Retainers (62%).";
      }

      setCoachMessages(prev => [...prev, { sender: 'coach', text: reply, date: new Date().toLocaleTimeString() }]);
      setCoachIsTyping(false);
    }, 1500);
  };

  // Math helper stats (Connected states)
  const bizTransactions = transactions.filter((t: any) => t.isBusiness || t.categoryId?.startsWith('cat_biz_'));
  
  const bizRevenueToday = bizTransactions
    .filter((t: any) => t.type === 'income' && t.date.split('T')[0] === new Date().toISOString().split('T')[0])
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const bizExpenseToday = bizTransactions
    .filter((t: any) => t.type === 'expense' && t.date.split('T')[0] === new Date().toISOString().split('T')[0])
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const bizRevenueMonthly = bizTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const bizExpenseMonthly = bizTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const bizCashBalance = (businessAccount?.balance || 142000) + bizRevenueMonthly - bizExpenseMonthly;
  const bizNetProfit = Math.max(0, bizRevenueMonthly - bizExpenseMonthly);
  const profitMargin = bizRevenueMonthly > 0 ? Math.round((bizNetProfit / bizRevenueMonthly) * 100) : 75;

  // Dynamic opex category summaries for Profit Analysis
  const dynamicSoftwareOpex = bizTransactions
    .filter((t: any) => t.type === 'expense' && (t.categoryId === 'cat_biz_software' || t.categoryId === 'cat_biz_hosting' || t.categoryId === 'cat_biz_marketing' || t.businessCategory === 'Software' || t.businessCategory === 'Hosting' || t.businessCategory === 'Marketing'))
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const dynamicRentUtilitiesOpex = bizTransactions
    .filter((t: any) => t.type === 'expense' && (t.categoryId === 'cat_biz_rent' || t.categoryId === 'cat_biz_legal' || t.categoryId === 'cat_biz_taxes' || t.businessCategory === 'Office Rent' || t.businessCategory === 'Legal' || t.businessCategory === 'Taxes'))
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const dynamicSalariesOpex = bizTransactions
    .filter((t: any) => t.type === 'expense' && (t.categoryId === 'cat_biz_salary' || t.businessCategory === 'Employee Salary' || t.businessCategory === 'Salaries'))
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const opexSoftwareValue = dynamicSoftwareOpex || Math.round(bizExpenseMonthly * 0.4);
  const opexRentValue = dynamicRentUtilitiesOpex || Math.round(bizExpenseMonthly * 0.3);
  const opexSalariesValue = dynamicSalariesOpex || Math.round(bizExpenseMonthly * 0.3);

  const gstCollectedVal = gstLedger.filter((g: any) => g.type === 'collected').reduce((sum: number, g: any) => sum + g.gstAmount, 0);
  const gstPaidVal = gstLedger.filter((g: any) => g.type === 'paid').reduce((sum: number, g: any) => sum + g.gstAmount, 0);
  const netGstPayable = Math.max(0, gstCollectedVal - gstPaidVal);

  const outstandingInvoices = invoices.filter(i => i.status !== 'paid');
  const outstandingInvoicesSum = outstandingInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  // Recharts Revenue Trend Chart
  const revenueChartData = [
    { name: 'Week 1', Revenue: bizRevenueMonthly * 0.2, Expense: bizExpenseMonthly * 0.15, Profit: (bizRevenueMonthly * 0.2) - (bizExpenseMonthly * 0.15) },
    { name: 'Week 2', Revenue: bizRevenueMonthly * 0.3, Expense: bizExpenseMonthly * 0.35, Profit: (bizRevenueMonthly * 0.3) - (bizExpenseMonthly * 0.35) },
    { name: 'Week 3', Revenue: bizRevenueMonthly * 0.25, Expense: bizExpenseMonthly * 0.25, Profit: (bizRevenueMonthly * 0.25) - (bizExpenseMonthly * 0.25) },
    { name: 'Week 4', Revenue: bizRevenueMonthly * 0.25, Expense: bizExpenseMonthly * 0.25, Profit: (bizRevenueMonthly * 0.25) - (bizExpenseMonthly * 0.25) },
  ];

  // Cash Flow Projections Calculations
  const monthlyFlowIn = bizRevenueMonthly || 185000;
  const monthlyFlowOut = bizExpenseMonthly || 42000;
  const cashForecastData = Array.from({ length: cfMonthForecast }).map((_, i) => {
    const projectedGrowthMultiplier = 1 + (expectedGrowth / 100) * (i + 1);
    const expectedIn = Math.round(monthlyFlowIn * projectedGrowthMultiplier);
    const expectedOut = Math.round(monthlyFlowOut * (1 + 0.03 * (i + 1))); // 3% inflation on opex
    const projectedBalance = bizCashBalance + (expectedIn - expectedOut) * (i + 1);
    return {
      month: `Month +${i + 1}`,
      Inflow: expectedIn,
      Outflow: expectedOut,
      Balance: projectedBalance
    };
  });

  return (
    <Shell>
      <div className="space-y-8 pb-20 relative">

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-4 right-4 z-55 bg-zinc-900 border border-amber-500/35 text-white text-xs px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 font-medium"
            >
              <Check className="h-4 w-4 text-amber-500" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header containing Segmented Toggle Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/50 dark:border-zinc-900 pb-6">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1 font-mono">Workspace Gateway</span>
            <h1 className="text-3xl font-normal font-serif text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-600 stroke-[1.2] animate-pulse" />
              Entrepreneur Workspace
            </h1>
          </div>

          {/* Segmented Toggle Control */}
          <div className="bg-stone-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-stone-250/60 dark:border-zinc-900 flex relative overflow-hidden">
            <button
              onClick={() => setCurrentMode('personal')}
              className={`py-1.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                currentMode === 'personal' 
                  ? 'text-amber-700 dark:text-amber-400 bg-white dark:bg-zinc-900 shadow border border-stone-200/40 dark:border-zinc-800' 
                  : 'text-stone-450 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Personal Finance
            </button>
            <button
              onClick={() => setCurrentMode('business')}
              className={`py-1.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                currentMode === 'business' 
                  ? 'text-amber-700 dark:text-amber-400 bg-white dark:bg-zinc-900 shadow border border-stone-200/40 dark:border-zinc-800' 
                  : 'text-stone-450 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Business Finance
            </button>
          </div>
        </div>

        {/* Global Search Interface */}
        <div className="relative">
          <div className="flex gap-2 items-center bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-900 rounded-xl px-3.5 py-2.5 shadow-sm">
            <Search className="h-4.5 w-4.5 text-stone-400" />
            <input
              type="text"
              placeholder="Ask CFO Engine (e.g. 'Show all software expenses' or 'Outstanding invoices')"
              value={searchQuery}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-stone-900 dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => handleGlobalSearch('')}
                className="text-[10px] uppercase font-bold text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {aiSearchActive && aiReply && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 mt-2 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl z-20 backdrop-blur-md"
            >
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-605 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">AI Financial Retrieval</h4>
                  <p className="text-xs text-stone-700 dark:text-zinc-300 mt-1">{aiReply}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* WORKSPACE VIEW RENDERING */}

        {/* ----------------PERSONAL WORKSPACE---------------- */}
        {currentMode === 'personal' && (
          <div className="space-y-6">
            {/* Quick alert bar */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-serif italic">
                “Your discretionary coffee spending pacing is normal. You saved ₹1,450 this week.”
              </p>
              <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-500/10 rounded-md">Pacing Normal</span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">Personal Assets</span>
                <h3 className="text-2xl font-normal font-serif text-stone-850 dark:text-white">
                  ₹{accounts.filter((a: any) => a.type !== 'credit_card').reduce((sum: number, a: any) => sum + a.balance, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">Credit Card Debt</span>
                <h3 className="text-2xl font-normal font-serif text-rose-500">
                  ₹{accounts.filter((a: any) => a.type === 'credit_card').reduce((sum: number, a: any) => sum + a.balance, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">Personal Monthly Spends</span>
                <h3 className="text-2xl font-normal font-serif text-stone-850 dark:text-white">
                  ₹{transactions.filter((t: any) => !t.isBusiness && t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">Personal Monthly Income</span>
                <h3 className="text-2xl font-normal font-serif text-amber-600 dark:text-amber-400">
                  ₹{transactions.filter((t: any) => !t.isBusiness && t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString()}
                </h3>
              </div>
            </div>

            {/* Split row: Personal expense entry & personal budgets pacing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Personal Expense entry & transactions */}
              <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Personal Ledger Entries</h3>
                  <button 
                    onClick={() => setIsAddExpenseOpen(true)}
                    className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                  >
                    Add Personal Expense
                  </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {transactions.filter((t: any) => !t.isBusiness).slice(0, 5).map((t: any) => {
                    const catObj = categories.find((c: any) => c.id === t.categoryId);
                    return (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-stone-50/50 dark:bg-zinc-950/30 border border-stone-100 dark:border-zinc-850 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">{t.merchant}</p>
                          <span className="text-[8.5px] font-mono text-stone-400 uppercase block mt-0.5">
                            {new Date(t.date).toLocaleDateString()} • {catObj?.name || 'Personal'}
                          </span>
                        </div>
                        <p className="text-xs font-bold font-mono text-stone-800 dark:text-zinc-200">
                          ₹{t.amount.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal budgets pacing */}
              <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Budget Limits Pacing</h3>
                
                <div className="space-y-4">
                  {budgets.slice(0, 3).map((b: any) => {
                    const catObj = categories.find((c: any) => c.id === b.categoryId);
                    const pct = Math.round((b.spentAmount / b.limitAmount) * 100);
                    return (
                      <div key={b.id} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-stone-500 uppercase text-[9px] tracking-wide">{catObj?.name}</span>
                          <span className="font-mono text-stone-900 dark:text-white">₹{b.spentAmount} / ₹{b.limitAmount}</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                        <span className="text-[8px] font-mono uppercase text-stone-400 block tracking-wider">{pct}% Allocated</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------BUSINESS WORKSPACE---------------- */}
        {currentMode === 'business' && (
          <div>
            {!businessAccount ? (
              /* ONBOARDING FLOW */
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-3xl p-8 shadow-xl"
                style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
              >
                <div className="flex justify-center mb-6">
                  <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-amber-600 stroke-[1.2]" />
                  </div>
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-normal font-serif text-stone-900 dark:text-white">Manage your business like a CFO.</h2>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    Input your corporate credentials to activate high-performance dashboards, invoice pipelines, and GST ledgers.
                  </p>
                </div>

                <form onSubmit={handleOnboardSubmit} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Business Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. PixelCraft Agency"
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Primary Industry</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Software & Consultancy"
                        value={primaryInd}
                        onChange={(e) => setPrimaryInd(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Business Type</label>
                      <select 
                        value={bizType}
                        onChange={(e) => setBizType(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      >
                        <option>Freelancer</option>
                        <option>Agency</option>
                        <option>Startup</option>
                        <option>Consultancy</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Healthcare</option>
                        <option>Construction</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Business Registration</label>
                      <select 
                        value={bizReg}
                        onChange={(e) => setBizReg(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      >
                        <option>Sole Proprietor</option>
                        <option>LLP</option>
                        <option>Partnership</option>
                        <option>Private Limited</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Financial Year</label>
                      <select 
                        value={finYear}
                        onChange={(e) => setFinYear(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      >
                        <option>FY 2026-27</option>
                        <option>FY 2025-26</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Default Currency</label>
                      <select 
                        value={currencyVal}
                        onChange={(e) => setCurrencyVal(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[9px] uppercase tracking-wider text-stone-600 dark:text-zinc-400">GST Registered?</span>
                      <input 
                        type="checkbox" 
                        checked={isGst} 
                        onChange={(e) => setIsGst(e.target.checked)} 
                        className="h-4 w-4 accent-amber-600"
                      />
                    </div>
                    {isGst && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">GSTIN Number</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. 27AAAAA1111A1Z1"
                            value={gstinNum}
                            onChange={(e) => setGstinNum(e.target.value)}
                            className="w-full bg-[#FAF8F5] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Company PAN</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. ABCDE1234F"
                            value={panNum}
                            onChange={(e) => setPanNum(e.target.value)}
                            className="w-full bg-[#FAF8F5] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Business Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Corporate Tower, Bandra Kurla Complex, Mumbai, India"
                      value={addressVal}
                      onChange={(e) => setAddressVal(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-md transition-all cursor-pointer"
                  >
                    Confirm CFO Configuration
                  </button>
                </form>
              </motion.div>
            ) : (
              /* BUSINESS OS WORKSPACE PANEL */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side sub-navigation list */}
                <div className="lg:col-span-3 space-y-2 border-r border-stone-200/50 dark:border-zinc-900 pr-4">
                  <div className="pb-3 border-b border-stone-200/40 dark:border-zinc-900 mb-4">
                    <span className="text-[10px] font-bold text-amber-605 uppercase tracking-widest font-mono block">CFO Operating Workspace</span>
                    <p className="text-xs font-bold text-stone-900 dark:text-white mt-1">{businessAccount.businessName}</p>
                    <span className="text-[8px] font-mono text-stone-400 block mt-0.5">{businessAccount.businessType} • {businessAccount.registrationType}</span>
                  </div>

                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                    { id: 'expenses', name: 'Business Expenses', icon: Receipt },
                    { id: 'revenue', name: 'Revenue Streams', icon: DollarSign },
                    { id: 'clients', name: 'Bill Book & CRM', icon: Users },
                    { id: 'invoices', name: 'Invoice Generator', icon: FileText },
                    { id: 'gst', name: 'GST Hub', icon: ShieldCheck },
                    { id: 'cashflow', name: 'Cash Flow Forecast', icon: TrendingUp },
                    { id: 'profit', name: 'Profit Analytics', icon: Activity },
                    { id: 'mileage', name: 'Mileage Log', icon: MapPin },
                    { id: 'coach', name: 'AI CFO Coach', icon: Sparkle },
                    { id: 'reports', name: 'Export Center', icon: FileSpreadsheet },
                    { id: 'settings', name: 'Workspace Settings', icon: Settings },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          activeSubTab === tab.id 
                            ? 'bg-amber-500/5 border border-amber-500/15 text-amber-700 dark:text-amber-400 font-bold' 
                            : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-950 border border-transparent'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 stroke-[1.2]" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right side workspaces render panel */}
                <div className="lg:col-span-9 space-y-6">

                  {/* 1. Dashboard View */}
                  {activeSubTab === 'dashboard' && (
                    <div className="space-y-6">
                      
                      {/* Top KPIs Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Today's Revenue</span>
                          <h4 className="text-lg font-serif font-normal text-amber-700 dark:text-amber-450 mt-1">₹{bizRevenueToday.toLocaleString()}</h4>
                          <span className="text-[7px] text-emerald-500 block font-mono mt-0.5 font-bold">Real-time update</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Today's Expense</span>
                          <h4 className="text-lg font-serif font-normal text-rose-500 mt-1">₹{bizExpenseToday.toLocaleString()}</h4>
                          <span className="text-[7px] text-stone-400 block font-mono mt-0.5">Reconciled logs</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Cash Balance</span>
                          <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1 font-bold">₹{bizCashBalance.toLocaleString()}</h4>
                          <span className="text-[7px] text-stone-400 block font-mono mt-0.5">{businessAccount.bankAccount}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Net Monthly Profit</span>
                          <h4 className="text-lg font-serif font-normal text-amber-600 mt-1 font-bold">₹{bizNetProfit.toLocaleString()}</h4>
                          <span className="text-[7.5px] font-mono text-amber-600 font-bold block mt-0.5">{profitMargin}% Margin</span>
                        </div>
                      </div>

                      {/* Second KPIs Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">GST Pending</span>
                          <h4 className="text-lg font-serif font-normal text-stone-800 dark:text-zinc-100 mt-1">₹{netGstPayable.toLocaleString()}</h4>
                          <span className="text-[7px] text-amber-500 block font-mono mt-0.5">Filing due soon</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Invoices Outstanding</span>
                          <h4 className="text-lg font-serif font-normal text-stone-800 dark:text-zinc-100 mt-1">₹{outstandingInvoicesSum.toLocaleString()}</h4>
                          <span className="text-[7px] text-stone-400 block font-mono mt-0.5">{outstandingInvoices.length} Pending Invoices</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Today's Net Flow</span>
                          <h4 className="text-lg font-serif font-normal mt-1 text-emerald-500">₹{(bizRevenueToday - bizExpenseToday).toLocaleString()}</h4>
                          <span className="text-[7px] text-emerald-500 block font-mono mt-0.5">Surplus index</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono block">Financial Year</span>
                          <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1">{businessAccount.financialYear}</h4>
                          <span className="text-[7px] text-stone-400 block font-mono mt-0.5">Currency: {businessAccount.currency}</span>
                        </div>
                      </div>

                      {/* AI CFO Alert Summary */}
                      <div className="p-5 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                          <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                          <span>AI CFO Summary Report</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-normal">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                            <span>Revenue increased by 14% month-over-month.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-rose-500 rounded-full" />
                            <span>Hosting server expenses increased 32% above forecast.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                            <span>GST filing return deadline approaches in 5 days.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                            <span>Runway: Expected cash shortage alert in 18 days if retainers lag.</span>
                          </div>
                        </div>
                      </div>

                      {/* Chart & Recent Log columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Weekly Revenue trend */}
                        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Revenue & OPEX Weekly Flow</h3>
                          <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueChartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Bar dataKey="Revenue" fill="#c5a880" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#78716c" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Recent Invoice Registry */}
                        <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Outstanding Invoices</h3>
                          <div className="space-y-4">
                            {outstandingInvoices.slice(0, 3).map(inv => (
                              <div key={inv.id} className="p-3 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-850 rounded-xl text-xs flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-stone-900 dark:text-white">{inv.clientName}</p>
                                  <span className="text-[8px] font-mono text-stone-400 block mt-0.5">Due: {inv.dueDate}</span>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                  <div>
                                    <p className="font-bold text-amber-700 dark:text-amber-400 font-mono">₹{inv.totalAmount.toLocaleString()}</p>
                                    <button
                                      onClick={() => handleReconcileInvoice(inv.id)}
                                      className="text-[8px] uppercase font-bold text-amber-600 hover:text-amber-800 cursor-pointer block mt-1"
                                    >
                                      Mark Paid
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleDownloadInvoice(inv)}
                                    className="p-1.5 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850 rounded-lg text-stone-400 cursor-pointer flex items-center justify-center"
                                    title="Download PDF"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {outstandingInvoices.length === 0 && (
                              <p className="text-[10px] text-stone-400 py-6 text-center">All invoices reconciled.</p>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* 2. Business Expenses Tab */}
                  {activeSubTab === 'expenses' && (
                    <div className="space-y-6">
                      
                      {/* Sub-header row */}
                      <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Business OPEX Ledger</h3>
                          <p className="text-[10px] text-stone-500 dark:text-zinc-400 mt-1">
                            Input business expenses, capture tax deductions, and attach receipt PDFs.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsAddExpenseOpen(true)}
                          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                        >
                          Log Expense (Voice/Screenshot/Manual)
                        </button>
                      </div>

                      {/* Expenses List */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                        <div className="space-y-4">
                          {bizTransactions.filter((t: any) => t.type === 'expense').map((t: any) => (
                            <div key={t.id} className="p-3.5 bg-stone-50/50 dark:bg-zinc-950/30 border border-stone-200/25 dark:border-zinc-850 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-stone-900 dark:text-white">{t.merchant}</p>
                                <div className="flex gap-2 text-[8px] font-mono text-stone-400 uppercase mt-0.5">
                                  <span>{new Date(t.date).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{t.businessCategory || 'OPEX'}</span>
                                  {t.gstAmount > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="text-amber-600 font-bold">GST INCLUDED (₹{t.gstAmount})</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold font-mono">₹{t.amount.toLocaleString()}</p>
                                  {t.gstAmount > 0 && (
                                    <span className="text-[7.5px] font-mono text-stone-400 block">
                                      CGST: ₹{Math.round(t.gstAmount/2)} | SGST: ₹{Math.round(t.gstAmount/2)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => { deleteTransaction(t.id); triggerToast('Expense deleted.'); }}
                                  className="text-stone-300 hover:text-rose-500 cursor-pointer"
                                >
                                  <Trash className="h-4 w-4 stroke-[1.2]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 3. Revenue Streams */}
                  {activeSubTab === 'revenue' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Business Revenue Management</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Track monthly invoicing yield, retainer projects, and product sales.</p>
                      </div>

                      {/* Cumulative stats row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">Sales Revenue</span>
                          <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1 font-bold">₹{(bizRevenueMonthly * 0.4).toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-400 mt-1 font-mono">Direct Stripe / bank settlements</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">Project Retainers</span>
                          <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1 font-bold">₹{(bizRevenueMonthly * 0.5).toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-400 mt-1 font-mono">Recurring client agreements</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">Ad-hoc Services</span>
                          <h4 className="text-lg font-serif font-normal text-stone-850 dark:text-white mt-1 font-bold">₹{(bizRevenueMonthly * 0.1).toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-400 mt-1 font-mono">Hourly consultation invoice items</p>
                        </div>
                      </div>

                      {/* Revenue Ledger entries */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Reconciled Receivables</h4>
                        <div className="space-y-3">
                          {bizTransactions.filter((t: any) => t.type === 'income').map((t: any) => (
                            <div key={t.id} className="p-3 bg-[#FAF8F5] dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-850 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-stone-900 dark:text-white">{t.merchant}</p>
                                <span className="text-[8px] font-mono text-stone-400 block mt-0.5">
                                  Settled: {new Date(t.date).toLocaleDateString()} • {t.businessCategory || 'Sales'} • {t.paymentMethod}
                                </span>
                              </div>
                              <p className="font-bold font-mono text-emerald-500">
                                +₹{t.amount.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 4. Bill Book & Client CRM */}
                  {activeSubTab === 'clients' && (
                    <div className="space-y-6">
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Bill Book & CRM</h3>
                          <p className="text-[10px] text-stone-500 mt-1">Manage client accounts (Udhaar), track inventory, and log daily liquid cash books.</p>
                        </div>
                        
                        {/* Sub-Tab Toggle */}
                        <div className="flex bg-stone-55 dark:bg-zinc-950 p-1 border border-stone-200/40 dark:border-zinc-800 rounded-xl text-[9px] font-bold uppercase tracking-wider">
                          {[
                            { id: 'crm', label: 'Credit Ledger (Udhaar)' },
                            { id: 'stock', label: 'Stock Book' },
                            { id: 'cashbook', label: 'Daily Cash Book' }
                          ].map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => setBillBookSubTab(sub.id as any)}
                              className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${
                                billBookSubTab === sub.id
                                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* --- BILL BOOK SECTION 1: CRM & UDHAAR LEDGER --- */}
                      {billBookSubTab === 'crm' && (
                        <div className="space-y-6">
                          {/* Credit / Udhaar Stats Widgets */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-stone-400 tracking-widest block">Total Registered Clients</span>
                              <p className="font-serif text-lg font-bold text-stone-900 dark:text-white mt-1.5">{clients.length}</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-rose-500 tracking-widest block">Total Udhaar Outstanding</span>
                              <p className="font-mono text-lg font-bold text-rose-600 mt-1.5">
                                ₹{clients.reduce((sum, c) => sum + c.outstandingAmount, 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs flex items-center justify-between">
                              <div>
                                <span className="text-[8px] font-mono font-bold uppercase text-stone-450 tracking-widest block">Ledger Actions</span>
                                <p className="text-[10px] text-stone-500 mt-1">Reconcile partial payments or remind clients.</p>
                              </div>
                              <button
                                onClick={() => setShowClientCreator(prev => !prev)}
                                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-[8px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                              >
                                {showClientCreator ? 'Close Client' : '+ Client'}
                              </button>
                            </div>
                          </div>

                          {/* Client Creator Form */}
                          {showClientCreator && (
                            <motion.form 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              onSubmit={handleAddClientSubmit} 
                              className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl space-y-4 text-xs"
                            >
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Register New Customer / Client</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-450 uppercase mb-1">Company Name</label>
                                  <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Nexus Corp Ltd"
                                    value={clientCompanyName}
                                    onChange={(e) => setClientCompanyName(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Contact Person</label>
                                  <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. John Doe"
                                    value={clientContact}
                                    onChange={(e) => setClientContact(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Email</label>
                                  <input 
                                    type="email" 
                                    required 
                                    placeholder="billing@nexus.com"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Phone</label>
                                  <input 
                                    type="text" 
                                    placeholder="+91 999999999"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Client status</label>
                                  <select 
                                    value={clientStatus}
                                    onChange={(e: any) => setClientStatus(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="lead">Lead</option>
                                    <option value="vip">VIP</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Client GSTIN (Optional)</label>
                                  <input 
                                    type="text" 
                                    placeholder="27BBBBB2222B1Z2"
                                    value={clientGst}
                                    onChange={(e) => setClientGst(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Billing Address</label>
                                  <input 
                                    type="text" 
                                    placeholder="Client Headquarters Address"
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                              </div>

                              <button 
                                type="submit"
                                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Save Client Records
                              </button>
                            </motion.form>
                          )}

                          {/* Record Payment Form Modal/Drawer */}
                          {showPaymentRecorder && (
                            <motion.form 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              onSubmit={handleCreditPaySubmit}
                              className="p-5 bg-stone-55 dark:bg-zinc-950 border border-amber-500/10 rounded-2xl space-y-4 text-xs"
                            >
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-mono">Reconcile Client Credit (Udhaar Collection)</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Select Client</label>
                                  <select 
                                    value={payClientSelect} 
                                    onChange={(e) => setPayClientSelect(e.target.value)}
                                    required
                                    className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                  >
                                    <option value="" disabled>-- Select Client --</option>
                                    {clients.map(c => (
                                      <option key={c.id} value={c.id}>
                                        {c.companyName} (Outstanding: ₹{c.outstandingAmount})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Collection Amount (INR)</label>
                                  <input 
                                    type="number" 
                                    required 
                                    placeholder="e.g. 5000"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Payment Method</label>
                                  <select 
                                    value={payMethod} 
                                    onChange={(e: any) => setPayMethod(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                                  >
                                    <option value="UPI">UPI / GPay</option>
                                    <option value="cash">Cash Ledger (Auto Cash-In)</option>
                                    <option value="bank_transfer">Direct Bank Transfer</option>
                                    <option value="card">Credit/Debit Card</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button" 
                                  onClick={() => setShowPaymentRecorder(false)}
                                  className="py-2 px-4 border border-stone-200 dark:border-zinc-800 text-stone-500 rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button 
                                  type="submit" 
                                  className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                                >
                                  Save & Reconcile Payment
                                </button>
                              </div>
                            </motion.form>
                          )}

                          {/* Clients list cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clients.map(c => {
                              const pending = c.outstandingAmount > 0;
                              return (
                                <div key={c.id} className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between gap-4 text-xs shadow-sm">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white">{c.companyName}</h4>
                                      <span className="text-[8px] text-stone-450 block mt-0.5">Contact: {c.contactPerson} • {c.phone}</span>
                                    </div>
                                    <span className={`text-[7px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                      c.status === 'vip' ? 'bg-amber-500/10 text-amber-600' : c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-stone-100 text-stone-450'
                                    }`}>
                                      {c.status}
                                    </span>
                                  </div>
                                  
                                  <div className="border-t border-stone-100 dark:border-zinc-850 pt-3 flex justify-between items-center">
                                    <div>
                                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Outstanding Udhaar</span>
                                      <p className={`font-bold font-mono mt-0.5 ${pending ? 'text-rose-500' : 'text-stone-400'}`}>
                                        ₹{c.outstandingAmount.toLocaleString()}
                                      </p>
                                    </div>
                                    
                                    <div className="flex gap-2 items-center">
                                      {pending && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setPayClientSelect(c.id);
                                              setPayAmount(c.outstandingAmount.toString());
                                              setShowPaymentRecorder(true);
                                            }}
                                            className="py-1.5 px-3 bg-stone-50 hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-stone-700 dark:text-zinc-200 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer border border-stone-200 dark:border-zinc-800"
                                            title="Record a payment from this client"
                                          >
                                            Record Pay
                                          </button>
                                          
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const msg = `Dear ${c.contactPerson}, this is a gentle reminder from ${businessAccount?.businessName || 'us'} regarding your outstanding credit balance of ₹${c.outstandingAmount.toLocaleString()}. Please settle via UPI or Bank Transfer. Thank you!`;
                                              navigator.clipboard.writeText(msg);
                                              triggerToast(`Payment reminder SMS template copied to clipboard!`);
                                            }}
                                            className="py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer border border-amber-500/15"
                                            title="Copy SMS reminder link"
                                          >
                                            Remind
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => { deleteClient(c.id); triggerToast('Client removed.'); }}
                                        className="text-stone-400 hover:text-rose-500 cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
                                      >
                                        <Trash className="h-4 w-4 stroke-[1.2]" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* --- BILL BOOK SECTION 2: STOCK INVENTORY BOOK --- */}
                      {billBookSubTab === 'stock' && (
                        <div className="space-y-6">
                          {/* Stock Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-stone-400 tracking-widest block">Total Catalog Products</span>
                              <p className="font-serif text-lg font-bold text-stone-900 dark:text-white mt-1.5">{stockItems.length}</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-amber-600 tracking-widest block">Low Stock Alert Items</span>
                              <p className="font-mono text-lg font-bold text-amber-600 mt-1.5">
                                {stockItems.filter(s => s.quantity <= s.lowStockLimit).length}
                              </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs flex items-center justify-between">
                              <div>
                                <span className="text-[8px] font-mono font-bold uppercase text-stone-450 tracking-widest block">Inventory Value</span>
                                <p className="font-mono text-xs font-bold text-emerald-500 mt-1">
                                  ₹{stockItems.reduce((sum, s) => sum + (s.quantity * s.costPrice), 0).toLocaleString()} (At Cost)
                                </p>
                              </div>
                              <button
                                onClick={() => setShowStockCreator(prev => !prev)}
                                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-[8px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                              >
                                {showStockCreator ? 'Close Catalog' : '+ Add Stock'}
                              </button>
                            </div>
                          </div>

                          {/* Stock Catalog Add Form */}
                          {showStockCreator && (
                            <motion.form 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              onSubmit={handleStockSubmit}
                              className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl space-y-4 text-xs"
                            >
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-mono">Register New Product or Service Catalog Item</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Item Name</label>
                                  <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Premium Leather Diary Set"
                                    value={newStockName}
                                    onChange={(e) => setNewStockName(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Cost Price (₹)</label>
                                    <input 
                                      type="number" 
                                      required 
                                      placeholder="450"
                                      value={newStockCost}
                                      onChange={(e) => setNewStockCost(e.target.value)}
                                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Sell Price (₹)</label>
                                    <input 
                                      type="number" 
                                      required 
                                      placeholder="1200"
                                      value={newStockSell}
                                      onChange={(e) => setNewStockSell(e.target.value)}
                                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Low Limit</label>
                                    <input 
                                      type="number" 
                                      placeholder="5"
                                      value={newStockLow}
                                      onChange={(e) => setNewStockLow(e.target.value)}
                                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Starting Stock Quantity</label>
                                  <input 
                                    type="number" 
                                    placeholder="50"
                                    value={newStockQty}
                                    onChange={(e) => setNewStockQty(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button 
                                    type="submit" 
                                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                                  >
                                    Add Item to Catalog
                                  </button>
                                </div>
                              </div>
                            </motion.form>
                          )}

                          {/* Inventory items list */}
                          <div className="grid grid-cols-1 gap-4">
                            {stockItems.map(s => {
                              const isLowStock = s.quantity <= s.lowStockLimit;
                              const marginAmt = s.sellingPrice - s.costPrice;
                              const marginPercentage = s.sellingPrice > 0 ? Math.round((marginAmt / s.sellingPrice) * 100) : 0;
                              return (
                                <div key={s.id} className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                      <h4 className="font-bold text-stone-900 dark:text-white text-sm">{s.name}</h4>
                                      {isLowStock && (
                                        <span className="flex items-center gap-1 text-[7px] font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase tracking-widest font-mono">
                                          <AlertTriangle className="h-3 w-3" /> Low Stock
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                                      <span>Cost: <strong className="font-mono text-stone-700 dark:text-zinc-300">₹{s.costPrice}</strong></span>
                                      <span>Sell Price: <strong className="font-mono text-stone-700 dark:text-zinc-300">₹{s.sellingPrice}</strong></span>
                                      <span className="text-emerald-500 font-bold">Margin: {marginPercentage}% (₹{marginAmt})</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-stone-100 dark:border-zinc-850 pt-3 md:pt-0">
                                    <div className="flex items-center gap-3">
                                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">Current Stock</span>
                                      <div className="flex items-center bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl p-1">
                                        <button
                                          type="button"
                                          onClick={() => updateStockQuantity(s.id, s.quantity - 1)}
                                          className="h-6 w-6 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-850 rounded-lg text-stone-600 dark:text-zinc-400 cursor-pointer font-bold"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          value={s.quantity}
                                          onChange={(e) => updateStockQuantity(s.id, parseInt(e.target.value) || 0)}
                                          className="w-12 text-center bg-transparent border-none outline-none font-bold font-mono focus:ring-0 text-xs"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => updateStockQuantity(s.id, s.quantity + 1)}
                                          className="h-6 w-6 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-850 rounded-lg text-stone-600 dark:text-zinc-400 cursor-pointer font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => { deleteStockItem(s.id); triggerToast('Item removed.'); }}
                                      className="text-stone-400 hover:text-rose-500 cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
                                    >
                                      <Trash className="h-4 w-4 stroke-[1.2]" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* --- BILL BOOK SECTION 3: DAILY CASH BOOK --- */}
                      {billBookSubTab === 'cashbook' && (
                        <div className="space-y-6">
                          {/* Cash Book Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-stone-400 tracking-widest block">Opening Balance</span>
                              <p className="font-mono text-sm font-bold text-stone-900 dark:text-white mt-1.5">₹25,000</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-emerald-500 tracking-widest block">Total Cash In Today</span>
                              <p className="font-mono text-sm font-bold text-emerald-500 mt-1.5">
                                +₹{cashBookLogs.filter(l => l.type === 'in').reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs">
                              <span className="text-[8px] font-mono font-bold uppercase text-rose-500 tracking-widest block">Total Cash Out Today</span>
                              <p className="font-mono text-sm font-bold text-rose-500 mt-1.5">
                                -₹{cashBookLogs.filter(l => l.type === 'out').reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm text-xs flex items-center justify-between">
                              <div>
                                <span className="text-[8px] font-mono font-bold uppercase text-stone-450 tracking-widest block">Closing Drawer Cash</span>
                                <p className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">
                                  ₹{(25000 + cashBookLogs.filter(l => l.type === 'in').reduce((sum, l) => sum + l.amount, 0) - cashBookLogs.filter(l => l.type === 'out').reduce((sum, l) => sum + l.amount, 0)).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => setShowCashLogCreator(prev => !prev)}
                                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-[8px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                              >
                                {showCashLogCreator ? 'Close' : '+ Log Cash'}
                              </button>
                            </div>
                          </div>

                          {/* Cash Book Log form */}
                          {showCashLogCreator && (
                            <motion.form 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              onSubmit={handleCashLogSubmit}
                              className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl space-y-4 text-xs"
                            >
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-mono">Log Liquid Drawer Cash Flow</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Flow Type</label>
                                  <div className="flex bg-stone-50 dark:bg-zinc-950 p-1 border border-stone-200/40 dark:border-zinc-800 rounded-xl">
                                    <button
                                      type="button"
                                      onClick={() => setNewCashType('in')}
                                      className={`flex-1 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                                        newCashType === 'in' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-stone-400'
                                      }`}
                                    >
                                      Cash In (+)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setNewCashType('out')}
                                      className={`flex-1 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                                        newCashType === 'out' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-stone-400'
                                      }`}
                                    >
                                      Cash Out (-)
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Cash Amount (₹)</label>
                                  <input 
                                    type="number" 
                                    required 
                                    placeholder="e.g. 1500"
                                    value={newCashAmount}
                                    onChange={(e) => setNewCashAmount(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Reference / Description</label>
                                  <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Office stationery, Customer X cash pay"
                                    value={newCashDesc}
                                    onChange={(e) => setNewCashDesc(e.target.value)}
                                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                                  />
                                </div>
                              </div>
                              <button 
                                type="submit" 
                                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                              >
                                Record Cash Transaction
                              </button>
                            </motion.form>
                          )}

                          {/* Cash timeline entries list */}
                          <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-5 space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Cash Flow Activity Logs</h4>
                            <div className="space-y-3.5">
                              {cashBookLogs.length === 0 ? (
                                <p className="text-xs text-stone-400 text-center py-10 uppercase tracking-widest">No cash book logs</p>
                              ) : (
                                cashBookLogs.map(l => {
                                  const isIn = l.type === 'in';
                                  return (
                                    <div key={l.id} className="flex justify-between items-center p-3 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-250/20 dark:border-zinc-850 rounded-xl text-xs">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${isIn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                          {isIn ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                        </div>
                                        <div>
                                          <p className="font-bold text-stone-900 dark:text-white">{l.description}</p>
                                          <span className="text-[8px] font-mono text-stone-400 block mt-0.5">Date: {l.date} • Reference ID: {l.id}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className={`font-bold font-mono ${isIn ? 'text-emerald-500' : 'text-rose-500'}`}>
                                          {isIn ? '+' : '-'}₹{l.amount.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. Invoice Generator */}
                  {activeSubTab === 'invoices' && (
                    <div className="space-y-6">
                      
                      <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Professional Invoice Builder</h3>
                          <p className="text-[10px] text-stone-500 mt-1">Draft, customize, and issue GST compliant invoices for your clients.</p>
                        </div>
                        <button
                          onClick={() => setShowInvoiceCreator(prev => !prev)}
                          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                        >
                          {showInvoiceCreator ? 'Collapse Builder' : 'Create New Invoice'}
                        </button>
                      </div>

                      {/* Invoice Creator form block */}
                      {showInvoiceCreator && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-3xl space-y-6 text-xs shadow-sm"
                        >
                          {/* Invoice Client selector */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Select Client</label>
                              <select
                                value={invoiceClientSelect}
                                onChange={(e) => setInvoiceClientSelect(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                              >
                                <option value="">Select Company</option>
                                {clients.map(c => (
                                  <option key={c.id} value={c.id}>{c.companyName}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Discount (INR)</label>
                              <input 
                                type="number" 
                                placeholder="0"
                                value={invoiceDiscount}
                                onChange={(e) => setInvoiceDiscount(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Line items creator */}
                          <form onSubmit={handleAddInvoiceItem} className="p-4 bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200/40 dark:border-zinc-850 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div className="md:col-span-2">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-[8px] font-bold text-stone-450 uppercase">Item Description</label>
                                {stockItems.length > 0 && (
                                  <select
                                    onChange={(e) => {
                                      const stockId = e.target.value;
                                      if (!stockId) return;
                                      const item = stockItems.find(s => s.id === stockId);
                                      if (item) {
                                        setInvoiceItemName(item.name);
                                        setInvoiceItemRate(item.sellingPrice.toString());
                                      }
                                    }}
                                    className="bg-transparent text-[8px] font-bold text-amber-600 dark:text-amber-400 border-none outline-none cursor-pointer focus:ring-0"
                                    defaultValue=""
                                  >
                                    <option value="" disabled>Or Select Catalog</option>
                                    {stockItems.map(s => (
                                      <option key={s.id} value={s.id} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-white">
                                        {s.name} (₹{s.sellingPrice} - Stock: {s.quantity})
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <input 
                                type="text" 
                                placeholder="e.g. Monthly Social Media Management"
                                value={invoiceItemName}
                                onChange={(e) => setInvoiceItemName(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Rate (INR)</label>
                              <input 
                                type="number" 
                                placeholder="5000"
                                value={invoiceItemRate}
                                onChange={(e) => setInvoiceItemRate(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-2.5 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Qty</label>
                              <div className="flex gap-2">
                                <input 
                                  type="number" 
                                  value={invoiceItemQty}
                                  onChange={(e) => setInvoiceItemQty(e.target.value)}
                                  className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-2 focus:outline-none"
                                />
                                <button type="submit" className="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 cursor-pointer">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </form>

                          {/* List of items */}
                          {invoiceItemsList.length > 0 && (
                            <div className="space-y-2 border-t border-stone-100 dark:border-zinc-850 pt-4">
                              <span className="font-bold text-[9px] uppercase tracking-wider text-stone-400">Invoice Items Draft</span>
                              {invoiceItemsList.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 dark:bg-zinc-950/40 border border-stone-200/30 dark:border-zinc-850 rounded-xl">
                                  <span>{item.description} (x{item.quantity})</span>
                                  <div className="flex gap-4 items-center">
                                    <span className="font-bold font-mono">₹{(item.rate * item.quantity).toLocaleString()}</span>
                                    <button 
                                      onClick={() => setInvoiceItemsList(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-stone-400 hover:text-rose-500 cursor-pointer"
                                    >
                                      <Trash className="h-4.5 w-4.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={handleCreateInvoiceSubmit}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl uppercase tracking-widest cursor-pointer shadow"
                          >
                            Finalize and Log Invoice
                          </button>
                        </motion.div>
                      )}

                      {/* Invoices registry database */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
                        <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block">Invoice Registry</span>
                        
                        <div className="space-y-4">
                          {invoices.map(inv => (
                            <div key={inv.id} className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
                              <div>
                                <p className="font-bold text-stone-900 dark:text-white">{inv.invoiceNumber} • {inv.clientName}</p>
                                <span className="text-[8px] font-mono text-stone-400 block mt-1 uppercase">
                                  Date: {inv.issueDate} • Due: {inv.dueDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 justify-between md:justify-end">
                                <div className="text-right">
                                  <p className="font-bold font-mono text-amber-700 dark:text-amber-400">₹{inv.totalAmount.toLocaleString()}</p>
                                  <span className={`text-[7px] font-bold uppercase tracking-wider mt-0.5 inline-block ${
                                    inv.status === 'paid' ? 'text-emerald-500' : 'text-amber-600'
                                  }`}>{inv.status}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  {inv.status !== 'paid' && (
                                    <button
                                      onClick={() => handleReconcileInvoice(inv.id)}
                                      className="py-1 px-3 bg-amber-605 text-white hover:bg-amber-700 rounded-lg text-[8.5px] uppercase font-bold tracking-wider cursor-pointer"
                                    >
                                      Reconcile Paid
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDownloadInvoice(inv)}
                                    className="p-1.5 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850 rounded-lg text-stone-400 cursor-pointer flex items-center justify-center"
                                    title="Download / Print PDF"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 6. GST Management */}
                  {activeSubTab === 'gst' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">GST Compliance Portal</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Track CGST, SGST, IGST collected from sales vs GST paid on business expenses.</p>
                      </div>

                      {/* Cumulative ITC calculation */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">GST Collected (Output Tax)</span>
                          <h4 className="text-lg font-serif font-normal text-rose-500 mt-1 font-bold">₹{gstCollectedVal.toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-400 mt-1 font-mono">Payable liabilities from sales</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">GST Paid (Input Tax Credit)</span>
                          <h4 className="text-lg font-serif font-normal text-emerald-500 mt-1 font-bold">₹{gstPaidVal.toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-450 mt-1 font-mono">Reclaimable from vendor expenses</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl">
                          <span className="text-[8px] font-bold text-stone-400 uppercase font-mono">Net GST Payable</span>
                          <h4 className="text-lg font-serif font-normal text-amber-600 dark:text-amber-400 mt-1 font-mono font-bold">₹{netGstPayable.toLocaleString()}</h4>
                          <p className="text-[7.5px] text-stone-400 mt-1 font-mono">Output Tax - ITC</p>
                        </div>
                      </div>

                      {/* GST ledger list */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6">
                        <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">GST Ledger Records</span>
                        <div className="space-y-3">
                          {gstLedger.map((g: any) => (
                            <div key={g.id} className="p-3 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-850 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-stone-900 dark:text-white">GST {g.type === 'collected' ? 'Collected' : 'Paid'} • GSTIN {g.gstin || 'None'}</p>
                                <span className="text-[8px] font-mono text-stone-400 block mt-0.5">
                                  Logged: {new Date(g.date).toLocaleDateString()} • GST Rate: {g.gstRate}%
                                </span>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold font-mono ${g.type === 'collected' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                  {g.type === 'collected' ? '+' : '-'}₹{g.gstAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 7. Cash Flow Projections */}
                  {activeSubTab === 'cashflow' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Cash Flow Forecasting Engine</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Simulate future cash balances based on growth expectations and recurring expenditures.</p>
                      </div>

                      {/* Simulation controls */}
                      <div className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 text-xs shadow-sm">
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 font-mono">Expected Monthly Revenue Growth (%)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={expectedGrowth} 
                            onChange={(e) => setExpectedGrowth(parseInt(e.target.value))}
                            className="w-full accent-amber-600"
                          />
                          <div className="flex justify-between font-mono text-[9px] text-stone-400">
                            <span>0% (Flat)</span>
                            <span className="font-bold text-amber-600">{expectedGrowth}% MoM</span>
                            <span>50% (High Growth)</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 font-mono">Forecast Horizon (Months)</label>
                          <select
                            value={cfMonthForecast}
                            onChange={(e) => setCfMonthForecast(parseInt(e.target.value))}
                            className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                          >
                            <option value="3">3 Months Projections</option>
                            <option value="6">6 Months Projections</option>
                            <option value="12">12 Months Projections</option>
                          </select>
                        </div>
                      </div>

                      {/* Projection Charts */}
                      <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Projected Balance Growth Curve</h4>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashForecastData}>
                              <XAxis dataKey="month" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                              <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                              <Tooltip formatter={(value) => `₹${value}`} />
                              <Area type="monotone" dataKey="Balance" stroke="#c5a880" fill="#c5a880" fillOpacity={0.1} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 8. Profit Analytics Waterfall */}
                  {activeSubTab === 'profit' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Profit & Margin waterfall Analytics</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Deduct operating expenses, taxes, and software costs to isolate net cash yield.</p>
                      </div>

                      {/* Waterfall diagram container */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-3xl p-8 space-y-5 text-xs shadow-sm">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Net Cash Waterfall Statement</h4>

                        <div className="space-y-4 text-xs font-semibold">
                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850">
                            <span className="font-bold text-stone-700 dark:text-zinc-200">Gross Monthly Revenue</span>
                            <span className="font-mono text-emerald-500 font-bold">+₹{bizRevenueMonthly.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850 pl-4 text-stone-450">
                            <span>(-) Software, Hosting & Advertising</span>
                            <span className="font-mono text-rose-500">-₹{opexSoftwareValue.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850 pl-4 text-stone-450">
                            <span>(-) Rent, Utilities & Mileage logs</span>
                            <span className="font-mono text-rose-500">-₹{opexRentValue.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850 pl-4 text-stone-450">
                            <span>(-) Salaries & Contractors</span>
                            <span className="font-mono text-rose-500">-₹{opexSalariesValue.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850">
                            <span className="font-bold text-stone-700 dark:text-zinc-200">Net Operating Profit</span>
                            <span className="font-mono font-bold text-stone-850 dark:text-white">₹{bizNetProfit.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-zinc-850 pl-4 text-stone-450">
                            <span>(-) Provision for Corporate Tax (25% Estimate)</span>
                            <span className="font-mono text-rose-500">-₹{Math.round(bizNetProfit * 0.25).toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 pt-4 border-t-2 border-double border-stone-250 dark:border-zinc-800 text-sm">
                            <span className="font-bold font-serif text-amber-700 dark:text-amber-400">Final Net Profit Yield</span>
                            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">₹{Math.round(bizNetProfit * 0.75).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Health score badge */}
                        <div className="pt-6 flex items-center justify-between border-t border-stone-100 dark:border-zinc-850 mt-8 text-xs">
                          <div>
                            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Business Health Index</span>
                            <span className="font-serif text-stone-900 dark:text-white font-bold text-sm block mt-0.5">Optimal runway reserves (94/100)</span>
                          </div>
                          <div className="h-2.5 w-24 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-805 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '94%' }} />
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* 9. Mileage Log */}
                  {activeSubTab === 'mileage' && (
                    <div className="space-y-6">
                      
                      <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Deductible travel Mileage Log</h3>
                          <p className="text-[10px] text-stone-500 mt-1">Reclaim travel fuel, tolls, and parking as legitimate business expenses.</p>
                        </div>
                        <button
                          onClick={() => setShowMileageCreator(prev => !prev)}
                          className="py-2.5 px-4 bg-amber-605 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                        >
                          {showMileageCreator ? 'Collapse' : 'Log Travel Drive'}
                        </button>
                      </div>

                      {/* Mileage creator form */}
                      {showMileageCreator && (
                        <motion.form 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onSubmit={handleAddMileageSubmit} 
                          className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl space-y-4 text-xs shadow-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[8px] font-bold text-stone-450 uppercase mb-1">Travel Date</label>
                              <input 
                                type="date" 
                                required
                                value={mDate}
                                onChange={(e) => setMDate(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-450 uppercase mb-1">Drive Purpose</label>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. Client consultation BKC"
                                value={mPurpose}
                                onChange={(e) => setMPurpose(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Distance (Km)</label>
                              <input 
                                type="number" 
                                required
                                placeholder="24"
                                value={mDistance}
                                onChange={(e) => setMDistance(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Compliance Alert */}
                          <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl text-[10px] text-stone-700 dark:text-stone-350 space-y-1">
                            <span className="font-bold block uppercase tracking-wider text-amber-600 dark:text-amber-400">⚠️ Travel Compliance & Anti-Cheating Policy</span>
                            <p className="leading-relaxed">
                              Short-distance travel fuel claims do not require photo receipts. However, <strong>Parking, Food/Dining, Hotel Stay, and Flights/Transit</strong> must include a verified receipt photo. Claims lacking receipt proof will be blocked.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Fuel cost (INR)</label>
                              <input 
                                type="number" 
                                placeholder="200"
                                value={mFuel}
                                onChange={(e) => setMFuel(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Parking (INR)</label>
                              <input 
                                type="number" 
                                value={mParking}
                                onChange={(e) => setMParking(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Tolls (INR)</label>
                              <input 
                                type="number" 
                                value={mToll}
                                onChange={(e) => setMToll(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Food / Dining (INR)</label>
                              <input 
                                type="number" 
                                placeholder="0"
                                value={mFood}
                                onChange={(e) => setMFood(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Stay / Lodging (INR)</label>
                              <input 
                                type="number" 
                                placeholder="0"
                                value={mStay}
                                onChange={(e) => setMStay(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-stone-455 uppercase mb-1">Flights / Transit (INR)</label>
                              <input 
                                type="number" 
                                placeholder="0"
                                value={mTravelExpense}
                                onChange={(e) => setMTravelExpense(e.target.value)}
                                className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-855 rounded-xl py-2 px-3 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Uploader Section */}
                          <div className="border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl p-4.5 bg-stone-50/30 dark:bg-zinc-950/10 flex flex-col items-center justify-center text-center">
                            {mIsScanning ? (
                              <div className="flex flex-col items-center space-y-2 py-2">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 animate-pulse font-mono">Running AI OCR Scan...</span>
                              </div>
                            ) : mReceiptUrl ? (
                              <div className="flex items-center gap-3 w-full justify-between bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg text-left">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                  <div>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Receipt Verified</span>
                                    <span className="text-[9px] text-stone-400 block mt-0.5 truncate max-w-[200px] font-mono">{mReceiptName}</span>
                                  </div>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => { setMReceiptUrl(''); setMReceiptName(''); }} 
                                  className="text-[9px] text-rose-500 font-bold uppercase tracking-wider hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer w-full flex flex-col items-center py-2">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleMileageReceiptUpload}
                                  className="hidden" 
                                />
                                <span className="text-[10px] font-bold text-stone-700 dark:text-zinc-300 hover:text-amber-500 transition-all uppercase tracking-wider">
                                  📸 Upload Verification Receipt (One Photo Scan)
                                </span>
                                <span className="text-[8px] text-stone-400 mt-1">Upload receipt containing Parking, Stay, Food bills to auto-fill details</span>
                              </label>
                            )}
                          </div>

                          {mValidationError && (
                            <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-2">
                              <span>⚠️ Error: {mValidationError}</span>
                            </div>
                          )}

                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-amber-605 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Log Travel Claim
                          </button>
                        </motion.form>
                      )}

                      {/* Mileage logs database */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 shadow-sm">
                        <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">Mileage Travel Records</span>
                        
                        <div className="space-y-3">
                          {mileageLogs.map(log => (
                            <div key={log.id} className="p-4 bg-stone-50/50 dark:bg-zinc-950/20 border border-stone-200/20 dark:border-zinc-850 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-stone-900 dark:text-white">{log.purpose} ({log.distanceKm} Km)</p>
                                  {log.isVerified ? (
                                    <span className="text-[7px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 px-1.5 py-0.5 rounded-full font-mono">
                                      ✓ Verified Proof
                                    </span>
                                  ) : (
                                    <span className="text-[7px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-zinc-900 text-stone-400 px-1.5 py-0.5 rounded-full font-mono">
                                      Standard Claim
                                    </span>
                                  )}
                                </div>
                                <span className="text-[8px] font-mono text-stone-400 block mt-1 uppercase">
                                  Logged: {log.date} • Vehicle: {log.vehicle || 'Business Sedan'} • Tolls: ₹{log.toll} | Fuel: ₹{log.fuelCost}
                                </span>
                                {(log.foodCost || log.stayCost || log.travelExpenseCost) ? (
                                  <span className="text-[8px] font-mono text-stone-500 dark:text-zinc-400 block mt-1">
                                    Extra Opex: Food ₹{log.foodCost || 0} | Stay ₹{log.stayCost || 0} | Travel ₹{log.travelExpenseCost || 0}
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-right">
                                <p className="font-bold font-mono text-amber-700 dark:text-amber-400">
                                  ₹{(log.deductionAmount + (log.fuelCost || 0) + (log.parking || 0) + (log.toll || 0) + (log.foodCost || 0) + (log.stayCost || 0) + (log.travelExpenseCost || 0)).toLocaleString()}
                                </p>
                                <span className="text-[7.5px] font-mono text-stone-400 block">IT Claim amount</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. AI CFO Coach */}
                  {activeSubTab === 'coach' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">AI CFO Coaching Copilot</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Interrogate our models regarding tax savings, runway pace, and spending outliers.</p>
                      </div>

                      {/* Conversational interface */}
                      <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-3xl p-6 space-y-4 shadow-sm">
                        
                        {/* Messages box */}
                        <div className="h-[250px] overflow-y-auto space-y-4 pr-1 text-xs">
                          {coachMessages.map((msg: any, index: number) => (
                            <div 
                              key={index}
                              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[75%] p-3.5 rounded-2xl relative ${
                                msg.sender === 'user' 
                                  ? 'bg-amber-600 text-white rounded-tr-none' 
                                  : 'bg-stone-50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 text-stone-900 dark:text-white rounded-tl-none'
                              }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className="text-[7px] text-stone-400 block text-right mt-1 font-mono">{msg.date}</span>
                              </div>
                            </div>
                          ))}
                          
                          {coachIsTyping && (
                            <div className="flex justify-start">
                              <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 p-3 rounded-2xl rounded-tl-none">
                                <span className="text-[10px] font-bold text-amber-605 uppercase tracking-widest animate-pulse font-mono">CFO Reconciling Ledgers...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Input line */}
                        <form onSubmit={handleCoachSend} className="flex gap-2 border-t border-stone-100 dark:border-zinc-855 pt-4">
                          <input 
                            type="text" 
                            placeholder="Ask: 'Calculate tax write-offs' or 'What is my current cash runway?'"
                            value={coachInput}
                            onChange={(e) => setCoachInput(e.target.value)}
                            className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 focus:outline-none text-xs text-stone-900 dark:text-white"
                          />
                          <button 
                            type="submit" 
                            className="py-2.5 px-4 bg-amber-650 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Ask CFO
                          </button>
                        </form>

                      </div>

                    </div>
                  )}

                  {/* 11. Export Reports */}
                  {activeSubTab === 'reports' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Business Reports Export Center</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Compile and compile professional Excel, CSV, or PDF financial logs.</p>
                      </div>

                      {/* Download parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between items-start gap-4 shadow-sm text-xs">
                          <div>
                            <span className="font-bold text-stone-900 dark:text-white block font-serif">Profit & Loss Spreadsheet</span>
                            <p className="text-[9px] text-stone-400 mt-1">Detailed opex vs sales waterfall parameters.</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => triggerToast('Spreadsheet downloaded.')} className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[8px] flex items-center gap-1 cursor-pointer">
                              <Download className="h-3 w-3" /> EXCEL
                            </button>
                            <button onClick={() => triggerToast('CSV exported.')} className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[8px] flex items-center gap-1 cursor-pointer">
                              <Download className="h-3 w-3" /> CSV
                            </button>
                          </div>
                        </div>

                        <div className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between items-start gap-4 shadow-sm text-xs">
                          <div>
                            <span className="font-bold text-stone-905 dark:text-white block font-serif">GST Summary filing</span>
                            <p className="text-[9px] text-stone-400 mt-1">Breakdown of output tax and ITC for filing GSTR-1 & GSTR-3B.</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => triggerToast('GST PDF downloaded.')} className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[8px] flex items-center gap-1 cursor-pointer">
                              <Download className="h-3 w-3" /> PDF
                            </button>
                            <button onClick={() => triggerToast('GST Excel exported.')} className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[8px] flex items-center gap-1 cursor-pointer">
                              <Download className="h-3 w-3" /> EXCEL
                            </button>
                          </div>
                        </div>

                        <div className="p-5 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between items-start gap-4 shadow-sm text-xs">
                          <div>
                            <span className="font-bold text-stone-905 dark:text-white block font-serif">Client Aging Balance Report</span>
                            <p className="text-[9px] text-stone-400 mt-1">Outstanding receivables sorting by days overdue.</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => triggerToast('Client CSV downloaded.')} className="p-2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[8px] flex items-center gap-1 cursor-pointer">
                              <Download className="h-3 w-3" /> CSV
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 12. Workspace Settings */}
                  {activeSubTab === 'settings' && (
                    <div className="space-y-6">
                      
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Workspace Settings</h3>
                        <p className="text-[10px] text-stone-500 mt-1">Configure company registry details, branding logo assets, and toggle workspace data.</p>
                      </div>

                      {/* Details editor */}
                      <form 
                        onSubmit={(e) => { e.preventDefault(); triggerToast('Settings saved.'); }}
                        className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-3xl space-y-4 text-xs shadow-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Company Registered Name</label>
                            <input 
                              type="text" 
                              value={businessAccount.businessName}
                              onChange={(e) => updateBusinessAccount({ ...businessAccount, businessName: e.target.value })}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">GSTIN Number</label>
                            <input 
                              type="text" 
                              value={businessAccount.gstin || ''}
                              onChange={(e) => updateBusinessAccount({ ...businessAccount, gstin: e.target.value })}
                              placeholder="27AAAAA1111A1Z1"
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Default Bank Account</label>
                            <input 
                              type="text" 
                              value={businessAccount.bankAccount || ''}
                              onChange={(e) => updateBusinessAccount({ ...businessAccount, bankAccount: e.target.value })}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-stone-400 uppercase mb-1">Business PAN</label>
                            <input 
                              type="text" 
                              value={businessAccount.pan || ''}
                              onChange={(e) => updateBusinessAccount({ ...businessAccount, pan: e.target.value })}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl py-2 px-3 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button type="submit" className="py-2.5 px-6 bg-amber-605 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer">
                          Save Changes
                        </button>
                      </form>

                      {/* Reset Workspace */}
                      <div className="p-6 bg-[#FFF5F5] dark:bg-rose-950/10 border border-rose-200 dark:border-rose-950/20 rounded-3xl text-xs space-y-4 shadow-sm">
                        <div>
                          <h4 className="font-bold text-rose-700 dark:text-rose-500 font-serif text-sm">Danger Zone: Reset Business Workspace</h4>
                          <p className="text-stone-500 dark:text-rose-350/70 mt-1">
                            This action will permanently delete your onboarded Business entity details, all generated client outstanding balances, mileage records, and business invoices from local database.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete and reset the Business Workspace?")) {
                              resetBusinessWorkspace();
                              triggerToast('Workspace Reset Successfully.');
                            }
                          }}
                          className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Delete Business Workspace
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}
          </div>
        )}

        {/* Global Add Expense Modal wrapper */}
        <AddExpenseModal 
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
        />

      </div>
    </Shell>
  );
}
