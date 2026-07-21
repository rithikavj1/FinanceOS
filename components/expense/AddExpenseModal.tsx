'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '@/lib/financeContext';
import { motion as motionImport, AnimatePresence as AnimatePresenceImport } from 'framer-motion';
import { 
  X, Mic, UploadCloud, Check, AlertCircle, FileText, Camera, Volume2, Sparkles
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { 
    categories, accounts, addTransaction, parseVoiceCommand, parseReceiptOCR, parseUpiScreenshot,
    coupleOnboarded, partner
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'manual' | 'voice' | 'ocr' | 'upi'>('manual');
  
  // Manual Entry Form State
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [needVsWant, setNeedVsWant] = useState<'need' | 'want'>('need');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'cash' | 'card' | 'bank_transfer' | 'other'>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');

  // Couple Split Form State
  const [whoIsFor, setWhoIsFor] = useState<'me' | 'partner' | 'both'>('me');
  const [whoPaid, setWhoPaid] = useState<'me' | 'partner' | 'joint'>('me');
  const [splitType, setSplitType] = useState<'50-50' | '60-40' | '70-30' | 'custom'>('50-50');
  const [customSplitPercent, setCustomSplitPercent] = useState('50');

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceParsedResult, setVoiceParsedResult] = useState<any>(null);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef<any>(null);

  // File Upload State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (accounts.length > 0) setAccountId(accounts[0].id);
    if (categories.length > 0) setCategoryId(categories[0].id);
  }, [accounts, categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';

        rec.onstart = () => {
          setIsListening(true);
          setTranscript('Listening...');
          setVoiceError('');
          setVoiceParsedResult(null);
        };

        rec.onresult = async (event: any) => {
          const resultText = event.results[0][0].transcript;
          setTranscript(resultText);
          setIsListening(false);
          
          try {
            const parsed = await parseVoiceCommand(resultText);
            setVoiceParsedResult(parsed);
          } catch (err) {
            setVoiceError('Could not process voice command. Please try manual entry.');
          }
        };

        rec.onerror = (e: any) => {
          setIsListening(false);
          setVoiceError('Voice recognition error: ' + (e.error || 'Check microphone permissions.'));
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      setVoiceError('Speech recognition is not supported in this browser. Please type or use manual mode.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const getSplitOwedAmount = (totalVal: number) => {
    if (whoIsFor !== 'both') return undefined;
    let myPercent = 50;
    let partnerPercent = 50;
    
    if (splitType === '50-50') {
      myPercent = 50;
      partnerPercent = 50;
    } else if (splitType === '60-40') {
      myPercent = 60;
      partnerPercent = 40;
    } else if (splitType === '70-30') {
      myPercent = 70;
      partnerPercent = 30;
    } else if (splitType === 'custom') {
      myPercent = parseFloat(customSplitPercent) || 50;
      partnerPercent = 100 - myPercent;
    }

    if (whoPaid === 'me') {
      return totalVal * (partnerPercent / 100);
    } else if (whoPaid === 'partner') {
      return totalVal * (myPercent / 100);
    }
    return 0; // paid by joint
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    addTransaction({
      userId: 'u1',
      amount: parseFloat(amount),
      type: 'expense',
      merchant: merchant || 'Miscellaneous',
      categoryId,
      needVsWant,
      paymentMethod,
      date: new Date(date).toISOString(),
      isRecurring: false,
      accountId: accountId || undefined,
      whoIsFor: coupleOnboarded ? whoIsFor : undefined,
      splitType: coupleOnboarded && whoIsFor === 'both' ? splitType : undefined,
      whoPaid: coupleOnboarded && whoIsFor === 'both' ? whoPaid : undefined,
      splitOwedAmount: coupleOnboarded ? getSplitOwedAmount(parseFloat(amount)) : undefined
    });

    resetForm();
    onClose();
  };

  const confirmVoiceTransaction = () => {
    if (!voiceParsedResult) return;
    addTransaction({
      userId: 'u1',
      amount: voiceParsedResult.amount,
      type: 'expense',
      merchant: voiceParsedResult.merchant,
      categoryId: voiceParsedResult.categoryId,
      needVsWant: voiceParsedResult.needVsWant,
      paymentMethod: voiceParsedResult.paymentMethod,
      date: new Date().toISOString(),
      isRecurring: voiceParsedResult.isRecurring,
      accountId: accountId || undefined,
      whoIsFor: coupleOnboarded ? whoIsFor : undefined,
      splitType: coupleOnboarded && whoIsFor === 'both' ? splitType : undefined,
      whoPaid: coupleOnboarded && whoIsFor === 'both' ? whoPaid : undefined,
      splitOwedAmount: coupleOnboarded ? getSplitOwedAmount(voiceParsedResult.amount) : undefined
    });
    resetForm();
    onClose();
  };

  const confirmScanTransaction = () => {
    if (!scanResult) return;
    addTransaction({
      userId: 'u1',
      amount: scanResult.amount,
      type: 'expense',
      merchant: scanResult.merchant,
      categoryId: scanResult.categoryId,
      needVsWant: scanResult.needVsWant,
      paymentMethod: scanResult.paymentMethod,
      date: new Date().toISOString(),
      isRecurring: scanResult.isRecurring,
      accountId: accountId || undefined,
      whoIsFor: coupleOnboarded ? whoIsFor : undefined,
      splitType: coupleOnboarded && whoIsFor === 'both' ? splitType : undefined,
      whoPaid: coupleOnboarded && whoIsFor === 'both' ? whoPaid : undefined,
      splitOwedAmount: coupleOnboarded ? getSplitOwedAmount(scanResult.amount) : undefined
    });
    resetForm();
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, scanType: 'ocr' | 'upi') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadedFile(file);
    setIsScanning(true);
    setScanResult(null);

    try {
      if (scanType === 'ocr') {
        const result = await parseReceiptOCR('image', file.name);
        setScanResult(result);
      } else {
        const result = await parseUpiScreenshot(file.name);
        setScanResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setMerchant('');
    setTranscript('');
    setVoiceParsedResult(null);
    setVoiceError('');
    setScanResult(null);
    setIsScanning(false);
    setUploadedFile(null);
    setWhoIsFor('me');
    setWhoPaid('me');
    setSplitType('50-50');
    setCustomSplitPercent('55');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <motionImport.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 dark:border-zinc-850">
          <h3 className="font-serif text-lg font-bold">Add Transaction</h3>
          <button 
            onClick={() => { resetForm(); onClose(); }}
            className="p-1 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4.5 w-4.5 stroke-[1.2]" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 border-b border-stone-100 dark:border-zinc-850 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-zinc-400 bg-stone-50/50 dark:bg-zinc-900/10">
          {(['manual', 'voice', 'ocr', 'upi'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              className={`py-3.5 text-center border-b-2 cursor-pointer transition-all ${
                activeTab === tab 
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5' 
                  : 'border-transparent hover:bg-stone-50 dark:hover:bg-zinc-950/20'
              }`}
            >
              {tab === 'ocr' ? 'OCR Scan' : tab === 'upi' ? 'UPI Screen' : tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          <AnimatePresenceImport mode="wait">
            
            {/* MANUAL ENTRY */}
            {activeTab === 'manual' && (
              <motionImport.form
                key="manual-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleManualSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Amount (INR)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Merchant</label>
                    <input
                      type="text"
                      placeholder="e.g. Starbucks"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    >
                      {categories.filter((c: any) => c.type === 'expense').map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    >
                      <option value="UPI">UPI</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Need vs Want</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] dark:bg-zinc-950 p-1 rounded-xl border border-stone-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setNeedVsWant('need')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                          needVsWant === 'need' 
                            ? 'bg-white dark:bg-zinc-850 shadow-sm text-amber-600 dark:text-amber-400' 
                            : 'text-stone-400'
                        }`}
                      >
                        Need
                      </button>
                      <button
                        type="button"
                        onClick={() => setNeedVsWant('want')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                          needVsWant === 'want' 
                            ? 'bg-white dark:bg-zinc-850 shadow-sm text-stone-500 dark:text-stone-400' 
                            : 'text-stone-400'
                        }`}
                      >
                        Want
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                {coupleOnboarded && (
                  <div className="space-y-4 border-t border-stone-250/20 dark:border-zinc-800/60 pt-4 mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Couple Split</h4>
                    
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Who is this expense for?</label>
                      <div className="grid grid-cols-3 gap-2 bg-[#FAF8F5] dark:bg-zinc-950 p-1 rounded-xl border border-stone-200 dark:border-zinc-800">
                        {(['me', 'partner', 'both'] as const).map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setWhoIsFor(option)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                              whoIsFor === option 
                                ? 'bg-white dark:bg-zinc-850 shadow-sm text-amber-600 dark:text-amber-400' 
                                : 'text-stone-400'
                            }`}
                          >
                            {option === 'me' ? 'Me Only' : option === 'partner' ? 'Partner Only' : 'Both (Split)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {whoIsFor === 'both' && (
                      <div className="space-y-4 bg-stone-50/50 dark:bg-zinc-950/30 p-3 border border-stone-200/40 dark:border-zinc-850 rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Who Paid?</label>
                            <select
                              value={whoPaid}
                              onChange={(e) => setWhoPaid(e.target.value as any)}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] focus:outline-none"
                            >
                              <option value="me">Me (You)</option>
                              <option value="partner">Partner ({partner?.fullName || 'Rahul'})</option>
                              <option value="joint">Joint Account</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Split Type</label>
                            <select
                              value={splitType}
                              onChange={(e) => setSplitType(e.target.value as any)}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px] focus:outline-none"
                            >
                              <option value="50-50">50-50 Split</option>
                              <option value="60-40">60-40 Split</option>
                              <option value="70-30">70-30 Split</option>
                              <option value="custom">Custom Split (%)</option>
                            </select>
                          </div>
                        </div>

                        {splitType === 'custom' && (
                          <div>
                            <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Your Split Share (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="50"
                              value={customSplitPercent}
                              onChange={(e) => setCustomSplitPercent(e.target.value)}
                              className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-[11px]"
                            />
                          </div>
                        )}

                        {amount && parseFloat(amount) > 0 && (
                          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-amber-600 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                            <span>Split Summary</span>
                            <span>
                              {whoPaid === 'joint' 
                                ? 'Deducted from Joint Wallet'
                                : whoPaid === 'me'
                                ? `Partner owes you ₹${(getSplitOwedAmount(parseFloat(amount)) || 0).toLocaleString()}`
                                : `You owe partner ₹${(getSplitOwedAmount(parseFloat(amount)) || 0).toLocaleString()}`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 text-xs uppercase tracking-wider active:scale-[0.99] mt-4"
                >
                  Log Transaction
                </button>
              </motionImport.form>
            )}

            {/* VOICE INPUT */}
            {activeTab === 'voice' && (
              <motionImport.div
                key="voice-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 max-w-xs">
                  Speak naturally, e.g., <span className="italic normal-case font-bold font-serif">"Paid 250 for coffee at Starbucks"</span>
                </p>

                {/* Animated Waveform and Mic */}
                <div className="relative flex items-center justify-center h-28 w-28">
                  {isListening && (
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping"></div>
                  )}
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                      isListening 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-500/10'
                    }`}
                  >
                    <Mic className="h-5 w-5 stroke-[1.2]" />
                  </button>
                </div>

                {isListening && (
                  <div className="flex justify-center items-end gap-1.5 h-12">
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                    <div className="w-1 bg-amber-500 rounded-full voice-bar"></div>
                  </div>
                )}

                {transcript && (
                  <div className="w-full bg-[#FAF8F5] dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-850 rounded-xl max-w-sm">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Live Transcript</span>
                    <p className="text-xs font-semibold mt-1 leading-normal italic font-serif text-stone-700 dark:text-zinc-300">"{transcript}"</p>
                  </div>
                )}

                {/* Parser Results Card */}
                {voiceParsedResult && (
                  <div 
                    className="w-full bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 p-5 rounded-2xl max-w-sm text-left relative"
                    style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
                  >
                    <Sparkles className="absolute top-4 right-4 h-4 w-4 text-amber-500 animate-pulse" />
                    <h4 className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mb-4 uppercase tracking-widest">AI Extracted Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Merchant</span>
                        <p className="font-bold">{voiceParsedResult.merchant}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Amount</span>
                        <p className="font-bold text-amber-600 dark:text-amber-400 font-mono">₹{voiceParsedResult.amount}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Category</span>
                        <p className="font-bold">{categories.find((c: any) => c.id === voiceParsedResult.categoryId)?.name}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Classification</span>
                        <p className="font-bold uppercase tracking-wider text-[10px]">{voiceParsedResult.needVsWant}</p>
                      </div>
                    </div>

                    <button
                      onClick={confirmVoiceTransaction}
                      className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider shadow-md"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Confirm & Save</span>
                    </button>
                  </div>
                )}

                {voiceError && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>{voiceError}</span>
                  </div>
                )}
              </motionImport.div>
            )}

            {/* OCR RECEIPT SCANNER */}
            {activeTab === 'ocr' && (
              <motionImport.div
                key="ocr-scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {!uploadedFile && (
                  <label className="flex flex-col items-center justify-center border border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl py-12 px-6 hover:bg-stone-50 dark:hover:bg-zinc-950/20 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, 'ocr')} 
                      className="hidden" 
                    />
                    <UploadCloud className="h-8 w-8 text-stone-455 mb-3 stroke-[1.2]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Receipt File</span>
                    <span className="text-[9px] text-stone-400 mt-1 uppercase">PDF, PNG, or JPG</span>
                  </label>
                )}

                {uploadedFile && isScanning && (
                  <div className="flex flex-col items-center py-10 justify-center text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent mb-3"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Performing optical scans...</span>
                  </div>
                )}

                {scanResult && (
                  <div 
                    className="bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl p-5"
                    style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
                  >
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold font-mono">
                      <FileText className="h-4 w-4 text-amber-500" />
                      <span>{uploadedFile?.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs mb-5">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Merchant</span>
                        <p className="font-bold">{scanResult.merchant}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Amount</span>
                        <p className="font-bold text-amber-600 dark:text-amber-400 font-mono">₹{scanResult.amount}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Category</span>
                        <p className="font-bold">{categories.find((c: any) => c.id === scanResult.categoryId)?.name}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Type</span>
                        <p className="font-bold uppercase tracking-wider text-[10px]">{scanResult.needVsWant}</p>
                      </div>
                    </div>

                    <button
                      onClick={confirmScanTransaction}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider shadow-md"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve extracted details</span>
                    </button>
                  </div>
                )}
              </motionImport.div>
            )}

            {/* UPI SCREENSHOT SCANNER */}
            {activeTab === 'upi' && (
              <motionImport.div
                key="upi-scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {!uploadedFile && (
                  <label className="flex flex-col items-center justify-center border border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl py-12 px-6 hover:bg-stone-50 dark:hover:bg-zinc-950/20 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'upi')} 
                      className="hidden" 
                    />
                    <Camera className="h-8 w-8 text-stone-455 mb-3 stroke-[1.2]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload payment screenshot</span>
                    <span className="text-[9px] text-stone-400 mt-1 uppercase">GPay, PhonePe, Paytm</span>
                  </label>
                )}

                {uploadedFile && isScanning && (
                  <div className="flex flex-col items-center py-10 justify-center text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent mb-3"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Parsing UPI metadata...</span>
                  </div>
                )}

                {scanResult && (
                  <div 
                    className="bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl p-5"
                    style={{ border: '1px solid rgba(197, 168, 128, 0.15)' }}
                  >
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold font-mono">
                      <Volume2 className="h-4 w-4 text-amber-500" />
                      <span>Screenshot Metadata Extracted</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs mb-5">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Merchant</span>
                        <p className="font-bold">{scanResult.merchant}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Amount</span>
                        <p className="font-bold text-amber-600 dark:text-amber-400 font-mono">₹{scanResult.amount}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Category</span>
                        <p className="font-bold">{categories.find((c: any) => c.id === scanResult.categoryId)?.name}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Reference UTR</span>
                        <p className="font-bold font-mono">{scanResult.refNumber}</p>
                      </div>
                    </div>

                    <button
                      onClick={confirmScanTransaction}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider shadow-md"
                    >
                      <Check className="h-4 w-4" />
                      <span>Log Transaction</span>
                    </button>
                  </div>
                )}
              </motionImport.div>
            )}

          </AnimatePresenceImport>
        </div>
      </motionImport.div>
    </div>
  );
}
