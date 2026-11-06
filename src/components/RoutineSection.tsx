import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Plus, 
  BarChart3, 
  Sliders, 
  History, 
  Sparkles, 
  ArrowLeft,
  AlertCircle,
  PlayCircle,
  ListTodo
} from 'lucide-react';
import { 
  RoutineState, 
  RoutineActivity, 
  RoutineDayLog, 
  RoutineDayActivityExecution,
  RoutineSettings 
} from '../types';
import { 
  formatDateToISO, 
  getPortugueseWeekday, 
  getPortugueseDateFormatted, 
  getOrCreateDayLog, 
  recalculateLogMetrics,
  calculateRoutineStreak,
  getCurrentAndNextActivity,
  timeToMinutes,
  triggerBrowserNotification,
  isActivityPastDue
} from '../utils/routineUtils';
import RoutineTimelineView from './routine/RoutineTimelineView';
import RoutineStatsView from './routine/RoutineStatsView';
import RoutineHistoryView from './routine/RoutineHistoryView';
import RoutineSettingsView from './routine/RoutineSettingsView';
import JustificationModal, { RoutineReasonCategory } from './routine/JustificationModal';
import ActivityModal from './routine/ActivityModal';

import { EnemScheduleDayConfig } from '../types';

interface RoutineSectionProps {
  routineState: RoutineState;
  onUpdateRoutine: (updated: RoutineState) => void;
  onBackToDashboard?: () => void;
  onNavigateToStudies?: (subjectName?: string) => void;
}

export default function RoutineSection({
  routineState,
  onUpdateRoutine,
  onBackToDashboard,
  onNavigateToStudies
}: RoutineSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'stats' | 'history' | 'settings'>('timeline');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal States
  const [justifyingActivity, setJustifyingActivity] = useState<{ dateStr: string; activity: RoutineDayActivityExecution } | null>(null);
  const [editingActivity, setEditingActivity] = useState<RoutineActivity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Set of already notified activity keys today: "YYYY-MM-DD:activityId"
  const notifiedKeysRef = useRef<Set<string>>(new Set());

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = formatDateToISO(currentTime);

  // Ensure today's log exists without rewriting previous history
  const { log: todayLog, isNew, updatedRoutine } = getOrCreateDayLog(todayStr, routineState);

  // If a new day log was generated on this first render of the day, update routine state
  useEffect(() => {
    if (isNew) {
      onUpdateRoutine(updatedRoutine);
    }
  }, [isNew]);

  // Recalculate dynamic streak
  const streakInfo = calculateRoutineStreak(routineState.history || [], routineState.settings?.activeRoutineDays);

  // Get current and next activity for header
  const { current: currentAct, next: nextAct } = getCurrentAndNextActivity(todayLog.activities || [], currentTime);

  // Notification Engine runner
  useEffect(() => {
    if (!routineState.settings?.notificationsEnabled) return;

    const checkNotifications = () => {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const leadTime = routineState.settings?.leadTimeMinutes || 0;

      const activities = todayLog.activities || [];
      for (const act of activities) {
        if (act.status === 'completed' || act.status === 'failed') continue;

        const startMin = timeToMinutes(act.startTime);
        const notifyMin = startMin - leadTime;
        const key = `${todayStr}:${act.activityId}`;

        if (currentMin >= notifyMin && currentMin <= startMin + 2) {
          if (!notifiedKeysRef.current.has(key)) {
            notifiedKeysRef.current.add(key);

            let title = `⏰ Hora da sua rotina: ${act.name}`;
            if (act.studySubject) {
              title = `⏰ Hora de estudar ${act.studySubject}!`;
            }

            const body = act.studySubject
              ? `Seu bloco de estudo do ENEM (${act.studySubject}) está programado para agora (${act.startTime}).`
              : (leadTime > 0
                ? `Sua atividade está programada para começar em ${leadTime} minutos (${act.startTime}).`
                : `Sua atividade está programada para agora (${act.startTime}).`);

            triggerBrowserNotification(title, body, key);
          }
        }
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 15000);
    return () => clearInterval(interval);
  }, [todayLog, routineState.settings, todayStr]);

  // Handler: Toggle complete for today's activity
  const handleToggleComplete = (activityId: string) => {
    const targetDate = todayStr;
    const existingLog = routineState.history.find(h => h.date === targetDate) || todayLog;
    const targetAct = existingLog.activities.find(a => a.activityId === activityId);

    if (targetAct) {
      const isPastDue = isActivityPastDue(targetDate, targetAct, currentTime);
      // Se o horário já passou: não permite marcar como concluída, exige justificativa
      if (isPastDue && targetAct.status !== 'completed') {
        setJustifyingActivity({ dateStr: targetDate, activity: targetAct });
        return;
      }
      // Se já passou do horário e estava concluída, não permite desmarcar/mexer
      if (isPastDue && targetAct.status === 'completed') {
        return;
      }
    }

    const updatedActivities = existingLog.activities.map(act => {
      if (act.activityId === activityId) {
        const willBeCompleted = act.status !== 'completed';
        const nowTimeStr = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return {
          ...act,
          status: (willBeCompleted ? 'completed' : 'pending') as any,
          completedAt: willBeCompleted ? nowTimeStr : undefined,
          failedAt: undefined,
          justification: undefined
        };
      }
      return act;
    });

    const updatedLog = recalculateLogMetrics({
      ...existingLog,
      activities: updatedActivities
    });

    const newHistory = routineState.history.some(h => h.date === targetDate)
      ? routineState.history.map(h => h.date === targetDate ? updatedLog : h)
      : [updatedLog, ...routineState.history];

    const newStreak = calculateRoutineStreak(newHistory, routineState.settings?.activeRoutineDays);

    onUpdateRoutine({
      ...routineState,
      history: newHistory,
      streak: {
        currentStreak: newStreak.currentStreak,
        bestStreak: newStreak.bestStreak,
        lastCompletedDate: newStreak.lastCompletedDate
      }
    });
  };

  // Handler: Toggle complete on arbitrary historical date
  const handleToggleCompleteOnHistory = (dateStr: string, activityId: string) => {
    const existingLog = routineState.history.find(h => h.date === dateStr);
    if (!existingLog) return;
    const targetAct = existingLog.activities.find(a => a.activityId === activityId);

    if (targetAct) {
      const isPastDue = isActivityPastDue(dateStr, targetAct, currentTime);
      // Se o horário já encerrou, não permite marcar feito retroativamente
      if (isPastDue && targetAct.status !== 'completed') {
        setJustifyingActivity({ dateStr, activity: targetAct });
        return;
      }
      if (isPastDue && targetAct.status === 'completed') {
        return;
      }
    }

    const updatedActivities = existingLog.activities.map(act => {
      if (act.activityId === activityId) {
        const willBeCompleted = act.status !== 'completed';
        return {
          ...act,
          status: (willBeCompleted ? 'completed' : 'pending') as any,
          completedAt: willBeCompleted ? act.startTime : undefined,
          failedAt: undefined,
          justification: undefined
        };
      }
      return act;
    });

    const updatedLog = recalculateLogMetrics({
      ...existingLog,
      activities: updatedActivities
    });

    const newHistory = routineState.history.map(h => h.date === dateStr ? updatedLog : h);
    const newStreak = calculateRoutineStreak(newHistory, routineState.settings?.activeRoutineDays);

    onUpdateRoutine({
      ...routineState,
      history: newHistory,
      streak: {
        currentStreak: newStreak.currentStreak,
        bestStreak: newStreak.bestStreak,
        lastCompletedDate: newStreak.lastCompletedDate
      }
    });
  };

  // Handler: Save Justification
  const handleSaveJustification = (
    activityId: string,
    reasonCategory: RoutineReasonCategory,
    justification: string
  ) => {
    if (!justifyingActivity) return;
    const { dateStr } = justifyingActivity;

    const existingLog = routineState.history.find(h => h.date === dateStr) || todayLog;
    const nowTimeStr = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const updatedActivities: RoutineDayActivityExecution[] = existingLog.activities.map((act): RoutineDayActivityExecution => {
      if (act.activityId === activityId) {
        if (reasonCategory === 'feito') {
          return {
            ...act,
            status: 'completed',
            completedAt: nowTimeStr,
            failedAt: undefined,
            reasonCategory: 'feito',
            justification
          };
        }
        return {
          ...act,
          status: 'failed',
          failedAt: nowTimeStr,
          completedAt: undefined,
          reasonCategory,
          justification
        };
      }
      return act;
    });

    const updatedLog = recalculateLogMetrics({
      ...existingLog,
      activities: updatedActivities
    });

    const newHistory = routineState.history.some(h => h.date === dateStr)
      ? routineState.history.map(h => h.date === dateStr ? updatedLog : h)
      : [updatedLog, ...routineState.history];

    const newStreak = calculateRoutineStreak(newHistory, routineState.settings?.activeRoutineDays);

    onUpdateRoutine({
      ...routineState,
      history: newHistory,
      streak: {
        currentStreak: newStreak.currentStreak,
        bestStreak: newStreak.bestStreak,
        lastCompletedDate: newStreak.lastCompletedDate
      }
    });
  };

  // Handler: Reset Status (desfazer não realizado)
  const handleResetStatus = (activityId: string) => {
    if (!justifyingActivity) return;
    const { dateStr } = justifyingActivity;

    const existingLog = routineState.history.find(h => h.date === dateStr) || todayLog;

    const updatedActivities = existingLog.activities.map(act => {
      if (act.activityId === activityId) {
        return {
          ...act,
          status: 'pending' as any,
          failedAt: undefined,
          completedAt: undefined,
          reasonCategory: undefined,
          justification: undefined
        };
      }
      return act;
    });

    const updatedLog = recalculateLogMetrics({
      ...existingLog,
      activities: updatedActivities
    });

    const newHistory = routineState.history.map(h => h.date === dateStr ? updatedLog : h);

    onUpdateRoutine({
      ...routineState,
      history: newHistory
    });
  };

  // Handler: Save / Update Activity template
  const handleSaveActivity = (data: Omit<RoutineActivity, 'id'> & { id?: string }) => {
    if (data.id) {
      // Edit existing activity
      const updatedList = routineState.activities.map(a => {
        if (a.id === data.id) {
          return { ...a, ...data } as RoutineActivity;
        }
        return a;
      });
      onUpdateRoutine({
        ...routineState,
        activities: updatedList
      });
    } else {
      // Add new activity
      const newId = `routine-act-${Date.now()}`;
      const newActivity: RoutineActivity = {
        ...data,
        id: newId,
        order: routineState.activities.length + 1
      };
      onUpdateRoutine({
        ...routineState,
        activities: [...routineState.activities, newActivity]
      });
    }
  };

  // Handler: Delete activity
  const handleDeleteActivity = (id: string) => {
    const updatedList = routineState.activities.filter(a => a.id !== id);
    onUpdateRoutine({
      ...routineState,
      activities: updatedList
    });
  };

  // Handler: Reorder activity
  const handleReorderActivity = (index: number, direction: 'up' | 'down') => {
    const newItems = [...routineState.activities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // re-assign order numbers
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });

    onUpdateRoutine({
      ...routineState,
      activities: newItems
    });
  };

  // Handler: Select study mode for Saturday free study
  const handleSelectStudyMode = (activityId: string, mode: string) => {
    const existingLog = routineState.history.find(h => h.date === todayStr) || todayLog;
    const updatedActivities = existingLog.activities.map(act => {
      if (act.activityId === activityId) {
        return {
          ...act,
          studyMode: mode,
          name: `Estudo ENEM — Estudo livre (${mode})`
        };
      }
      return act;
    });

    const updatedLog = {
      ...existingLog,
      activities: updatedActivities,
      updatedAt: new Date().toISOString()
    };

    const newHistory = routineState.history.some(h => h.date === todayStr)
      ? routineState.history.map(h => h.date === todayStr ? updatedLog : h)
      : [updatedLog, ...routineState.history];

    onUpdateRoutine({
      ...routineState,
      history: newHistory
    });
  };

  // Handler: Update ENEM weekly schedule configuration
  const handleUpdateEnemSchedule = (updatedSchedule: Record<number, EnemScheduleDayConfig>) => {
    onUpdateRoutine({
      ...routineState,
      enemSchedule: updatedSchedule
    });
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto text-left">
      
      {/* 1. TOP HEADER & METRICS HERO */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-glass-card p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Title, Date & Summary */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              {onBackToDashboard && (
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="p-2 apple-glass-button rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer mr-1"
                  title="Voltar ao Dashboard"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="inline-flex items-center gap-2 rounded-full apple-glass-pill px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Clock size={13} />
                <span className="uppercase tracking-widest text-[9px] font-mono font-bold">Meu Painel de Vida</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Minha Rotina Diária
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {getPortugueseWeekday(currentTime)}, <strong className="text-slate-700 dark:text-slate-200">{getPortugueseDateFormatted(currentTime)}</strong>
              </p>
            </div>

            {/* Next / Current Activity summary banner */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentAct ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold backdrop-blur-md">
                  <PlayCircle size={14} className="text-indigo-600 animate-pulse" />
                  <span>Agora: <strong>{currentAct.name}</strong> ({currentAct.startTime}–{currentAct.endTime || '...' })</span>
                </div>
              ) : nextAct ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl apple-glass-subtle text-slate-700 dark:text-slate-300 text-xs font-bold">
                  <Clock size={14} className="text-slate-400" />
                  <span>Próxima: <strong>{nextAct.name}</strong> às {nextAct.startTime}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold backdrop-blur-md">
                  <CheckCircle2 size={14} />
                  <span>Todas as atividades do dia foram concluídas!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Metrics Cards (Streak, Progress, Completed count) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Streak Card */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col justify-between min-w-[130px] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 font-mono">
                  Ofensiva
                </span>
                <span className="text-lg">🔥</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tabular-nums">
                  {streakInfo.currentStreak}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">
                  Recorde: {streakInfo.bestStreak}d 🏆
                </span>
              </div>
            </div>

            {/* Progress % Card */}
            <div className="p-4 apple-glass-subtle flex flex-col justify-between min-w-[130px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono">
                  Progresso
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Hoje</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tabular-nums">
                  {todayLog.completionPercent}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block truncate">
                  {todayLog.totalCompleted} de {todayLog.totalScheduled} feitas
                </span>
              </div>
            </div>

            {/* Status / Complete badge */}
            <div className="col-span-2 sm:col-span-1 p-4 apple-glass-subtle flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                Status do Dia
              </span>
              <div className="mt-2">
                {todayLog.isDayComplete ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} /> 100% Completo!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                    {todayLog.totalScheduled - todayLog.totalCompleted} restantes
                  </span>
                )}
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
                  {streakInfo.motivationalMessage}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Progresso da rotina de hoje</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">{todayLog.completionPercent}% concluído</span>
          </div>
          <div className="w-full bg-slate-200/60 dark:bg-white/10 h-2.5 rounded-full overflow-hidden backdrop-blur-xs">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayLog.completionPercent}%` }}
              transition={{ duration: 0.6 }}
              className={`h-full rounded-full ${
                todayLog.isDayComplete
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-650'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* 2. SUB-TABS NAVIGATION (Minha Rotina, Estatísticas, Histórico, Configurações) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 apple-glass-pill p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock size={14} />
            <span>Minha Rotina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span>Estatísticas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History size={14} />
            <span>Histórico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders size={15} />
            <span>Configurações</span>
          </button>
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={() => {
            setEditingActivity(null);
            setIsActivityModalOpen(true);
          }}
          className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>Nova Atividade</span>
        </button>
      </div>

      {/* 3. ACTIVE SUBTAB CONTENT */}
      <div>
        {activeSubTab === 'timeline' && (
          <RoutineTimelineView
            dayLog={todayLog}
            allRoutineActivities={routineState.activities}
            currentTime={currentTime}
            enemSchedule={routineState.enemSchedule}
            onToggleComplete={handleToggleComplete}
            onOpenJustifyModal={(act) => setJustifyingActivity({ dateStr: todayStr, activity: act })}
            onOpenEditActivity={(id) => {
              const act = routineState.activities.find(a => a.id === id);
              if (act) {
                setEditingActivity(act);
                setIsActivityModalOpen(true);
              }
            }}
            onUpdateEnemSchedule={handleUpdateEnemSchedule}
            onNavigateToStudies={onNavigateToStudies}
            onSelectStudyMode={handleSelectStudyMode}
          />
        )}

        {activeSubTab === 'stats' && (
          <RoutineStatsView
            history={routineState.history || []}
            streak={streakInfo}
          />
        )}

        {activeSubTab === 'history' && (
          <RoutineHistoryView
            history={routineState.history || []}
            onToggleCompleteOnHistory={handleToggleCompleteOnHistory}
            onOpenJustifyModal={(dateStr, act) => setJustifyingActivity({ dateStr, activity: act })}
          />
        )}

        {activeSubTab === 'settings' && (
          <RoutineSettingsView
            settings={routineState.settings || { notificationsEnabled: false, leadTimeMinutes: 5, dailyGoalPercent: 100, activeRoutineDays: [0, 1, 2, 3, 4, 5, 6], soundEnabled: true }}
            activities={routineState.activities || []}
            onUpdateSettings={(newSettings) => onUpdateRoutine({ ...routineState, settings: newSettings })}
            onOpenAddActivity={() => {
              setEditingActivity(null);
              setIsActivityModalOpen(true);
            }}
            onOpenEditActivity={(act) => {
              setEditingActivity(act);
              setIsActivityModalOpen(true);
            }}
            onDeleteActivity={handleDeleteActivity}
            onReorderActivity={handleReorderActivity}
          />
        )}
      </div>

      {/* 4. MODALS */}
      <JustificationModal
        isOpen={Boolean(justifyingActivity)}
        onClose={() => setJustifyingActivity(null)}
        activity={justifyingActivity?.activity || null}
        onConfirm={handleSaveJustification}
        onResetStatus={handleResetStatus}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        }}
        activityToEdit={editingActivity}
        onSave={handleSaveActivity}
        onDelete={editingActivity ? handleDeleteActivity : undefined}
      />

    </div>
  );
}
