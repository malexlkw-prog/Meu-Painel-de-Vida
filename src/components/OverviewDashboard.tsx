import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  Calendar, 
  Bell, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign,
  Flame,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { PainelData, RoutineState } from '../types';
import { getGiftReminders } from '../utils/dateUtils';
import { getNextScheduledFinalizeDate } from '../utils/autoMonthFinalizer';
import { INITIAL_ROUTINE_STATE } from '../data/initialRoutineData';
import { 
  formatDateToISO, 
  getOrCreateDayLog, 
  getCurrentAndNextActivity, 
  calculateRoutineStreak, 
  recalculateLogMetrics,
  isActivityPastDue
} from '../utils/routineUtils';

interface OverviewDashboardProps {
  data: PainelData;
  setActiveTab: (tab: string) => void;
  setActiveOrgSubTab?: (sub: any) => void;
  setActiveFinSubTab?: (sub: any) => void;
  setActiveStudiesSubTab?: (sub: any) => void;
  setActiveEntSubTab?: (sub: any) => void;
  userName: string;
  setUserName: (name: string) => void;
  onUpdateRoutine?: (updated: RoutineState) => void;
}

export default function OverviewDashboard({ 
  data, 
  setActiveTab, 
  setActiveOrgSubTab,
  setActiveFinSubTab,
  setActiveStudiesSubTab,
  setActiveEntSubTab,
  userName, 
  setUserName,
  onUpdateRoutine
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

  // 4. Routine calculations
  const effectiveRoutine: RoutineState = data.routine || INITIAL_ROUTINE_STATE;
  const todayStr = formatDateToISO(currentTime);
  const { log: todayRoutineLog } = getOrCreateDayLog(todayStr, effectiveRoutine);
  const { current: currentRoutineAct, next: nextRoutineAct } = getCurrentAndNextActivity(
    todayRoutineLog.activities || [], 
    currentTime
  );
  const routineStreak = calculateRoutineStreak(effectiveRoutine.history || [], effectiveRoutine.settings?.activeRoutineDays);

  const handleQuickMarkDone = (activityId: string) => {
    if (!onUpdateRoutine) return;
    const targetAct = todayRoutineLog.activities.find(a => a.activityId === activityId);
    if (targetAct && isActivityPastDue(todayStr, targetAct, currentTime)) {
      // Horário expirou, não permite marcar feito retroativamente. Redireciona para a rotina para justificar.
      setActiveTab('routine');
      return;
    }

    const nowTimeStr = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const updatedActivities = todayRoutineLog.activities.map(act => {
      if (act.activityId === activityId) {
        return {
          ...act,
          status: 'completed' as const,
          completedAt: nowTimeStr
        };
      }
      return act;
    });

    const updatedLog = recalculateLogMetrics({
      ...todayRoutineLog,
      activities: updatedActivities
    });

    const newHistory = effectiveRoutine.history.some(h => h.date === todayStr)
      ? effectiveRoutine.history.map(h => h.date === todayStr ? updatedLog : h)
      : [updatedLog, ...effectiveRoutine.history];

    const newStreak = calculateRoutineStreak(newHistory, effectiveRoutine.settings?.activeRoutineDays);

    onUpdateRoutine({
      ...effectiveRoutine,
      history: newHistory,
      streak: {
        currentStreak: newStreak.currentStreak,
        bestStreak: newStreak.bestStreak,
        lastCompletedDate: newStreak.lastCompletedDate
      }
    });
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto text-left">
      
      {/* 1. HERO AREA: GREETING & CLOCK */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 apple-glass-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group"
      >
        <div className="space-y-3 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full apple-glass-pill px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-indigo-300">
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
        <div className="shrink-0 self-start lg:self-auto min-w-[240px] apple-glass-subtle p-5 transition-all duration-300">
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

          {/* Indicador de Fechamento Automático de Mês */}
          {(() => {
            const nextDate = getNextScheduledFinalizeDate(currentTime);
            const nextStr = `${String(nextDate.getDate()).padStart(2, '0')}/${String(nextDate.getMonth() + 1).padStart(2, '0')} às 06:00`;
            return (
              <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Virada Auto: {nextStr}</span>
                </span>
                <button 
                  onClick={() => setActiveTab('system')}
                  className="text-[9px] font-black text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase font-mono cursor-pointer transition-colors"
                  title="Ver Fechamento e Histórico de Meses"
                >
                  Meses →
                </button>
              </div>
            );
          })()}
        </div>
      </motion.div>

      {/* 2. DYNAMIC LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN LEFT: QUICK DAILY SUMMARY (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* CARD: MINHA ROTINA */}
          <div className="apple-glass-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Minha Rotina</h3>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                      <Flame size={12} /> {routineStreak.currentStreak}d ofensiva
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {todayRoutineLog.totalCompleted} de {todayRoutineLog.totalScheduled} atividades concluídas hoje ({todayRoutineLog.completionPercent}%)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('routine')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Abrir Rotina</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200/60 dark:bg-white/10 h-2 rounded-full overflow-hidden backdrop-blur-xs">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  todayRoutineLog.isDayComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${todayRoutineLog.completionPercent}%` }}
              />
            </div>

            {/* Current Activity Box & Next Activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Atividade Atual / Principal */}
              {currentRoutineAct ? (() => {
                const isCurrentPast = isActivityPastDue(todayStr, currentRoutineAct, currentTime);
                return (
                  <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 backdrop-blur-md transition-all ${
                    isCurrentPast && currentRoutineAct.status !== 'completed'
                      ? 'bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30'
                      : 'bg-indigo-500/10 dark:bg-indigo-950/30 border border-indigo-500/25 shadow-xs'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase font-mono flex items-center gap-1 ${
                          isCurrentPast ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-700 dark:text-indigo-400'
                        }`}>
                          {isCurrentPast ? (
                            <><AlertCircle size={12} /> Horário Expirado</>
                          ) : (
                            <><PlayCircle size={12} className="animate-pulse" /> Atividade Agora</>
                          )}
                        </span>
                        <span className="text-[10px] font-bold font-mono text-slate-500">
                          {currentRoutineAct.startTime}–{currentRoutineAct.endTime || '...'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentRoutineAct.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        currentRoutineAct.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                          : isCurrentPast
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25'
                          : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25'
                      }`}>
                        {currentRoutineAct.status === 'completed'
                          ? 'Feito ✓'
                          : isCurrentPast
                          ? (currentRoutineAct.status === 'failed' ? 'Justificada' : 'Pendente')
                          : 'Em andamento'}
                      </span>

                      {currentRoutineAct.status !== 'completed' && (
                        isCurrentPast ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab('routine')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Horário expirado. Abra a rotina para dar a justificativa."
                          >
                            <AlertCircle size={13} />
                            <span>Justificar</span>
                          </button>
                        ) : (
                          onUpdateRoutine && (
                            <button
                              type="button"
                              onClick={() => handleQuickMarkDone(currentRoutineAct.activityId)}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 size={13} />
                              <span>Concluir</span>
                            </button>
                          )
                        )
                      )}
                    </div>
                  </div>
                );
              })() : nextRoutineAct ? (
                <div className="p-4 apple-glass-subtle flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                        Próxima Atividade
                      </span>
                      <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400">
                        às {nextRoutineAct.startTime}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {nextRoutineAct.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      Aguardando horário
                    </span>
                    {onUpdateRoutine && (
                      <button
                        type="button"
                        onClick={() => handleQuickMarkDone(nextRoutineAct.activityId)}
                        className="px-3 py-1.5 apple-glass-button text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        <span>Adiantar</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                  <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Rotina de hoje finalizada!</h4>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">Todas as atividades foram cumpridas.</p>
                  </div>
                </div>
              )}

              {/* A Seguir ou Mensagem Motivacional */}
              {currentRoutineAct && nextRoutineAct ? (
                <div className="p-4 apple-glass-subtle flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                      A Seguir
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {nextRoutineAct.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2">
                    <span>Inicia às {nextRoutineAct.startTime}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('routine')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Ver rotina →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 apple-glass-subtle flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                      Foco & Consistência
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      "{routineStreak.motivationalMessage}"
                    </p>
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveTab('routine')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Acessar aba Rotina →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="apple-glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                Resumo Rápido do Dia
              </h3>
              <span className="text-[10px] apple-glass-pill text-indigo-700 dark:text-indigo-300 font-black uppercase tracking-wider px-3 py-1">
                {pendingTasks.length + pendingReminders.length} itens hoje
              </span>
            </div>

            {/* Sub-section: Pending Tasks */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Tarefas Pendentes</span>
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
                      className="p-3.5 apple-glass-subtle flex items-center justify-between transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckSquare size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                          {task.text}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wide text-amber-600 dark:text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-full">
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
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Lembretes Importantes</span>
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
                      className="p-3.5 apple-glass-subtle flex items-center justify-between transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Bell size={14} className="text-amber-500 shrink-0 animate-bounce" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                          {rem.text}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
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
          <div className="apple-glass-card p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="apple-icon-circle bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl backdrop-blur-md">
                <DollarSign size={20} />
              </div>
              <button 
                onClick={() => setActiveTab('finance')}
                className="text-xs font-black text-slate-400 hover:text-indigo-500 flex items-center gap-1 uppercase font-mono tracking-wider cursor-pointer transition-colors"
              >
                Finanças <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="mt-4 space-y-1 text-left">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono">Saldo Consolidado</span>
              <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tabular-nums">
                R$ {(currentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="border-t border-slate-200/50 dark:border-white/10 pt-2.5 mt-3 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold tabular-nums">
              <span>Rendimento Líquido</span>
              <div className="flex gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">▲ R$ {(totalIncome || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                <span className="text-rose-600 dark:text-rose-400">▼ R$ {(totalExpense || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
