'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { useFinance } from '@/lib/financeContext';
import { 
  Sparkles, MessageSquare, Send, Brain, RefreshCw, Landmark, Lightbulb, TrendingUp, AlertTriangle
} from 'lucide-react';

interface Message {
  sender: 'user' | 'coach';
  text: string;
  time: string;
}

export default function CoachPage() {
  const { 
    aiInsights, generateAiCoachInsights, isGeneratingCoach, budgets, transactions, categories 
  } = useFinance();
  
  const [activeInsight, setActiveInsight] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: "Welcome to your wealth advisement channel. Ask me any details regarding your active allocations, projected savings target velocity, or billing EMIs.",
      time: '10:00 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (aiInsights.length > 0) {
      setActiveInsight(aiInsights[0].content);
    } else {
      handleRefreshInsights();
    }
  }, [aiInsights]);

  const handleRefreshInsights = async () => {
    const freshInsight = await generateAiCoachInsights();
    setActiveInsight(freshInsight.content);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Analyzing ledgers. Would you like to review personal portfolio balances or business GST logs?";
      
      if (query.includes('starbucks') || query.includes('coffee')) {
        const starbucksVisits = transactions.filter((t: any) => t.merchant?.toLowerCase().includes('starbucks')).length;
        replyText = `You have logged ${starbucksVisits || 3} Starbucks transactions recently. Setting up a local espresso bar will recover approximately ₹1,650/month in capital.`;
      } else if (query.includes('budget') || query.includes('spend')) {
        const overspent = budgets.find((b: any) => b.spentAmount > b.limitAmount * 0.8);
        if (overspent) {
          const cat = categories.find((c: any) => c.id === overspent.categoryId);
          replyText = `Your ${cat?.name || 'food'} budget is pacing high. You've consumed ₹${overspent.spentAmount} of ₹${overspent.limitAmount}. I recommend pausing discretionary shopping.`;
        } else {
          replyText = "All active budget channels are pacing within green boundaries. Runway levels are optimal.";
        }
      } else if (query.includes('saving') || query.includes('money')) {
        replyText = "With yesterday's discretionary index at 68%, you have a potential daily recovery of ₹620. Let's redirect this to your emergency reserves.";
      } else if (query.includes('rent') || query.includes('recurring')) {
        replyText = "Rent invoice obligations of ₹22,000 are due in 16 days. Cash reserves are fully allocated to cover this.";
      }

      const coachMsg: Message = {
        sender: 'coach',
        text: replyText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Shell>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/25 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-normal font-serif text-stone-900 dark:text-white">AI Coach Workspace</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500 mt-1">
              Personalized predictive modeling and cash-flow advice
            </p>
          </div>

          <button
            onClick={handleRefreshInsights}
            disabled={isGeneratingCoach}
            className="flex items-center justify-center gap-2 py-3 px-5 border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98]"
          >
            <RefreshCw className={`h-3.5 w-3.5 stroke-[1.5] ${isGeneratingCoach ? 'animate-spin' : ''}`} />
            <span>Recalculate Projections</span>
          </button>
        </div>

        {/* Coach Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Digest Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeInsight ? (
              <div 
                className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden"
                style={{ border: '1px solid rgba(197, 168, 128, 0.12)' }}
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/2 dark:bg-amber-500/2 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-xl font-normal font-serif flex items-center gap-2 mb-6">
                  <Brain className="h-4.5 w-4.5 text-amber-500 stroke-[1.2]" />
                  {activeInsight.greeting || "Daily Advisement Brief"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yesterday Spends */}
                  <div className="p-4 bg-[#FAF8F5] dark:bg-zinc-950/40 border border-stone-200/40 dark:border-zinc-900 rounded-xl">
                    <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Yesterday Summary</span>
                    <p className="text-xl font-serif text-stone-900 dark:text-white">₹{activeInsight.yesterday_summary?.total_spent?.toLocaleString() || '1,240'}</p>
                    <p className="text-[9px] text-stone-500 dark:text-zinc-400 mt-1.5 uppercase font-mono tracking-wider">
                      <span className="text-amber-600 font-bold">{activeInsight.yesterday_summary?.discretionary_percentage || 68}%</span> discretionary index.
                    </p>
                  </div>

                  {/* Salary Projection */}
                  <div className="p-4 bg-[#FAF8F5] dark:bg-zinc-950/40 border border-stone-200/40 dark:border-zinc-900 rounded-xl">
                    <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Runway Projection</span>
                    <p className="text-xl font-serif text-amber-600 dark:text-amber-400">₹{activeInsight.cash_flow_projection?.projected_end_of_month_balance?.toLocaleString() || '8,400'}</p>
                    <p className="text-[9px] text-stone-500 dark:text-zinc-400 mt-1.5 uppercase font-mono tracking-wider">
                      Confidence: <span className="font-bold text-amber-500">{activeInsight.cash_flow_projection?.confidence || 'high'}</span>
                    </p>
                  </div>
                </div>

                {/* Overspending Alerts */}
                {activeInsight.alerts && activeInsight.alerts.length > 0 && (
                  <div 
                    className="mt-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-3"
                    style={{ border: '1px solid rgba(239, 68, 68, 0.15)' }}
                  >
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5 stroke-[1.2]" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Pacing Overrun Alert</h4>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                        {activeInsight.alerts[0].message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommendations Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-stone-200/50 dark:border-zinc-800 rounded-xl flex gap-3">
                    <Lightbulb className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 stroke-[1.2]" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider">Short-term Recovery</h4>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {activeInsight.recommendation?.description || "Avoid ordering food. Potential saving: ₹620."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border border-stone-200/50 dark:border-zinc-800 rounded-xl flex gap-3">
                    <TrendingUp className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 stroke-[1.2]" />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider">Capital Opportunity</h4>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {activeInsight.long_term_insight?.pattern_detected} {activeInsight.long_term_insight?.actionable_alternative}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl p-10 text-center flex flex-col items-center">
                <Brain className="h-8 w-8 text-stone-300 dark:text-zinc-700 animate-pulse mb-3" />
                <p className="text-xs text-stone-400 uppercase tracking-widest font-mono">Generating analysis...</p>
              </div>
            )}

          </div>

          {/* Chat Portal Panel */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-900 rounded-2xl h-[480px] flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-stone-100 dark:border-zinc-850 pb-3">
              <MessageSquare className="h-4 w-4 text-amber-500 stroke-[1.2]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Advisement Chat</span>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-zinc-900 dark:bg-zinc-950 text-white rounded-tr-none'
                        : 'bg-stone-50 dark:bg-zinc-950/20 border border-stone-200/50 dark:border-zinc-850 rounded-tl-none'
                    }`}
                    style={msg.sender === 'coach' ? { border: '1px solid rgba(197, 168, 128, 0.12)' } : {}}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[8px] font-mono block mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-stone-400' : 'text-stone-550'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl rounded-tl-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Query accounts e.g. What is my saving velocity?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500/40"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-amber-500/5"
              >
                <Send className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </Shell>
  );
}
