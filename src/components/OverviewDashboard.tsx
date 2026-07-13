import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  Calendar, 
  Bell, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign
} from 'lucide-react';
import { PainelData } from '../types';
import { getGiftReminders } from '../utils/dateUtils';

interface OverviewDashboardProps {
  data: PainelData;
  setActiveTab: (tab: string) => void;
  setActiveOrgSubTab?: (sub: any) => void;
  setActiveFinSubTab?: (sub: any) => void;
  setActiveStudiesSubTab?: (sub: any) => void;
  setActiveEntSubTab?: (sub: any) => void;
  userName: string;
  setUserName: (name: string) => void;
}

export default function OverviewDashboard({ 
  data, 
  setActiveTab, 
  setActiveOrgSubTab,
  setActiveFinSubTab,
  setActiveStudiesSubTab,
  setActiveEntSubTab,
  userName, 
  setUserName 
}: OverviewDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // 1. Task calculations
  const pendingTasks = data.tasks.filter(t => !t.completed);

  // 2. Financial calculations
  const totalIncome = data.finance
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = data.finance
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentBalance = totalIncome - totalExpense;

  // 3. Reminders calculations
  const giftReminders = getGiftReminders(data);
  const pendingReminders = [...data.reminders.filter(r => !r.completed), ...giftReminders];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto text-left">
      
      {/* 1. HERO AREA: GREETING & CLOCK */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden transition-all duration-300"
      >
        <div className="space-y-3 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 dark:bg-slate-800 px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-indigo-300 border border-slate-200 dark:border-slate-700/60">
            <Sparkles size={14} className="text-amber-500" />
            <span className="uppercase tracking-widest text-[9px] font-bold">Meu Painel de Vida</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                {getGreeting()}, {userName}
              </span>
            </div>
          </div>
        </div>

        {/* Live Clock Widget */}
        <div className="shrink-0 self-start lg:self-auto min-w-[240px] bg-slate-50 dark:bg-slate-950 p-5 border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-2xs transition-all duration-300">
          <div className="flex items-center justify-between gap-2 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1.5 font-mono">
            <span className="flex items-center gap-1"><Clock size={12} /></span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-widest block leading-none">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1.5 block uppercase tracking-wide">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </motion.div>

      {/* 2. DYNAMIC LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN LEFT: QUICK DAILY SUMMARY (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                Resumo Rápido do Dia
              </h3>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-955 text-indigo-700 dark:text-indigo-350 font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                {pendingTasks.length + pendingReminders.length} itens hoje
              </span>
            </div>

            {/* Sub-section: Pending Tasks */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550 font-mono">Tarefas Pendentes</span>
                <button 
                  onClick={() => { setActiveTab('organization'); setActiveOrgSubTab?.('tasks'); }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-bold flex items-center gap-1"
                >
                  Ver todas &rarr;
                </button>
              </div>
              
              {pendingTasks.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic pl-1 font-medium">Nenhuma tarefa pendente para hoje. Parabéns!</p>
              ) : (
                <div className="space-y-2">
                  {pendingTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border border-transparent dark:border-slate-850"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckSquare size={14} className="text-slate-300 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-stone-300 truncate">
                          {task.text}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wide text-amber-600 dark:text-amber-400 shrink-0 bg-amber-500/5 px-2 py-0.5 rounded">
                        {task.type === 'today' ? 'Hoje' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-section: Pending Reminders */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-550 font-mono">Lembretes Importantes</span>
                <button 
                  onClick={() => { setActiveTab('organization'); setActiveOrgSubTab?.('reminders'); }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-bold flex items-center gap-1"
                >
                  Ver alertas &rarr;
                </button>
              </div>

              {pendingReminders.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic pl-1 font-medium">Nenhum lembrete ou alerta pendente.</p>
              ) : (
                <div className="space-y-2">
                  {pendingReminders.slice(0, 3).map((rem) => (
                    <div 
                      key={rem.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border border-transparent dark:border-slate-850"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Bell size={14} className="text-amber-500 shrink-0 animate-bounce" />
                        <span className="text-xs font-bold text-slate-700 dark:text-stone-300 truncate">
                          {rem.text}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-455 dark:text-slate-400 shrink-0">
                        {rem.time || 'Aviso'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* COLUMN RIGHT: KEY INDICATORS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Indicator Card 1: Monthly Balance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="apple-icon-circle bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl">
                <DollarSign size={20} />
              </div>
              <button 
                onClick={() => setActiveTab('finance')}
                className="text-xs font-black text-slate-400 hover:text-indigo-500 flex items-center gap-1 uppercase font-mono tracking-wider cursor-pointer"
              >
                Finanças <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="mt-4 space-y-1 text-left">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-550 font-mono">Saldo Consolidado</span>
              <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">
                R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/65 pt-2 mt-3 flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-400 font-bold">
              <span>Rendimento Líquido</span>
              <div className="flex gap-2">
                <span className="text-emerald-600">▲ R$ {totalIncome.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                <span className="text-rose-600">▼ R$ {totalExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
