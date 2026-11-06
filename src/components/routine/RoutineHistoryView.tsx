import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Check, 
  FileText,
  Filter,
  Undo2
} from 'lucide-react';
import { RoutineDayLog, RoutineActivity } from '../../types';
import { formatDateToISO, getPortugueseDateFormatted, getPortugueseWeekday, isActivityPastDue } from '../../utils/routineUtils';

interface RoutineHistoryViewProps {
  history: RoutineDayLog[];
  onToggleCompleteOnHistory: (dateStr: string, activityId: string) => void;
  onOpenJustifyModal: (dateStr: string, activity: any) => void;
}

export default function RoutineHistoryView({
  history,
  onToggleCompleteOnHistory,
  onOpenJustifyModal
}: RoutineHistoryViewProps) {
  const todayStr = formatDateToISO(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Map of date string -> RoutineDayLog
  const logsMap = new Map<string, RoutineDayLog>();
  history.forEach(h => logsMap.set(h.date, h));

  const activeLog = logsMap.get(selectedDate);

  // Quick navigation: Previous and Next Day
  const handleShiftDate = (days: number) => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + days);
    setSelectedDate(formatDateToISO(d));
  };

  // Convert selectedDate to Date object for nice display
  const [sy, sm, sd] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(sy, sm - 1, sd);

  return (
    <div className="space-y-6">
      {/* Date Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous / Next buttons & Current Date label */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => handleShiftDate(-1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Dia anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 font-mono block">
              {getPortugueseWeekday(selectedDateObj)} {selectedDate === todayStr ? '(Hoje)' : ''}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {getPortugueseDateFormatted(selectedDateObj)}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleShiftDate(1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Próximo dia"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Date Input & Today shortcut */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono cursor-pointer"
          />
          {selectedDate !== todayStr && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Ir para Hoje
            </button>
          )}
        </div>
      </div>

      {/* Daily Snapshot Content */}
      {!activeLog ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <Calendar size={32} className="mx-auto text-slate-400" />
          <h4 className="text-base font-bold text-slate-800 dark:text-white">
            Nenhum registro para {selectedDate.split('-').reverse().join('/')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Este dia ainda não foi iniciado ou não possuía atividades programadas na data.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Day Summary Card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                  Registro Permanente do Dia
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Desempenho: {activeLog.completionPercent}%
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {activeLog.isDayComplete ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Dia 100% Completo! 🔥
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                    {activeLog.totalCompleted} de {activeLog.totalScheduled} concluídas
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeLog.isDayComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${activeLog.completionPercent}%` }}
              />
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-3 text-center pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Programadas</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{activeLog.totalScheduled}</span>
              </div>
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Concluídas</span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{activeLog.totalCompleted}</span>
              </div>
              <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl border border-rose-500/20">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase">Não Realizadas</span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-300">{activeLog.totalFailed}</span>
              </div>
            </div>
          </div>

          {/* Activities List of that Day */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Atividades Registradas no Dia:
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {activeLog.activities.map((act) => {
                const isCompleted = act.status === 'completed';
                const isFailed = act.status === 'failed';
                const isPastDue = isActivityPastDue(activeLog.date, act, new Date());

                return (
                  <div
                    key={act.activityId}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-white dark:bg-slate-900 border-emerald-500/30'
                        : isFailed
                        ? 'bg-white dark:bg-slate-900 border-rose-500/30'
                        : isPastDue
                        ? 'bg-amber-50/30 dark:bg-amber-950/15 border-amber-500/40'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                            {act.startTime} {act.endTime ? `– ${act.endTime}` : ''}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {act.name}
                          </span>
                        </div>

                        {/* Badges and timestamp */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                              ✓ Concluída {act.completedAt ? `às ${act.completedAt}` : ''}
                            </span>
                          )}

                          {isFailed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
                              ✕ Não realizada {act.failedAt ? `(registrado às ${act.failedAt})` : ''}
                            </span>
                          )}

                          {!isCompleted && !isFailed && isPastDue && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-mono flex items-center gap-1">
                              <Clock size={11} /> Horário expirado
                            </span>
                          )}

                          {!isCompleted && !isFailed && !isPastDue && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                              Pendente
                            </span>
                          )}
                        </div>

                        {/* Justification note */}
                        {isFailed && act.justification && (
                          <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2">
                            <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Motivo registrado: </span>
                              <span>{act.justification}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status & Justification Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isCompleted ? (
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                            <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                            <span>Concluída ✓</span>
                          </span>
                        ) : isPastDue ? (
                          /* Horário expirado no histórico: NÃO pode mais marcar como feito, apenas justificar */
                          <button
                            type="button"
                            onClick={() => onOpenJustifyModal(activeLog.date, act)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                            title="Horário expirado. Registre ou altere a justificativa."
                          >
                            <AlertCircle size={13} />
                            <span>{isFailed ? 'Editar justificativa' : 'Dar justificativa'}</span>
                          </button>
                        ) : (
                          /* Horário ainda vigente */
                          <>
                            <button
                              type="button"
                              onClick={() => onToggleCompleteOnHistory(activeLog.date, act.activityId)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                              title="Marcar como feito"
                            >
                              <Check size={13} />
                              <span>Marcar feito</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenJustifyModal(activeLog.date, act)}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Corrigir ou editar justificativa"
                            >
                              Justificar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
