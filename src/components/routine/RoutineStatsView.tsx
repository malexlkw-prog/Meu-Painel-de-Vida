import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Percent, 
  ThumbsUp, 
  HelpCircle
} from 'lucide-react';
import { RoutineDayLog, RoutineStreak } from '../../types';
import { calculateRoutineStats } from '../../utils/routineUtils';

interface RoutineStatsViewProps {
  history: RoutineDayLog[];
  streak: RoutineStreak;
}

export default function RoutineStatsView({ history, streak }: RoutineStatsViewProps) {
  const [period, setPeriod] = useState<'today' | 'week' | '7days' | 'month' | 'all'>('7days');

  const stats = calculateRoutineStats(history, period);

  return (
    <div className="space-y-6">
      {/* Period Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-3 hidden sm:inline">
          Período de Análise:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'today', label: 'Hoje' },
            { id: 'week', label: 'Esta semana' },
            { id: '7days', label: 'Últimos 7 dias' },
            { id: 'month', label: 'Este mês' },
            { id: 'all', label: 'Histórico geral' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Indicator Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Taxa de Conclusão */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Taxa de Conclusão
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Percent size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">
              {stats.completionRate}%
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {stats.totalCompleted} de {stats.totalScheduled} atividades
            </p>
          </div>
        </div>

        {/* 2. Dias Completos (100%) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Dias 100% Completos
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">
              {stats.completeDaysCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              dias sem falhar nenhuma meta
            </p>
          </div>
        </div>

        {/* 3. Sequência Atual */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Sequência Atual
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <Flame size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{streak.currentStreak}</span>
              <span className="text-sm font-bold text-amber-500">dias 🔥</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              dias consecutivos completos
            </p>
          </div>
        </div>

        {/* 4. Melhor Sequência */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Melhor Sequência
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Trophy size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{streak.bestStreak}</span>
              <span className="text-sm font-bold text-purple-500">recorde 🏆</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              maior ofensiva histórica
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono">
              Total Concluídas
            </span>
            <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200">
              {stats.totalCompleted}
            </p>
          </div>
          <CheckCircle2 size={24} className="text-emerald-500 opacity-60" />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Total Programadas
            </span>
            <p className="text-2xl font-black text-slate-800 dark:text-white">
              {stats.totalScheduled}
            </p>
          </div>
          <Calendar size={24} className="text-indigo-500 opacity-60" />
        </div>

        <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 font-mono">
              Não Realizadas
            </span>
            <p className="text-2xl font-black text-rose-800 dark:text-rose-200">
              {stats.totalFailed}
            </p>
          </div>
          <AlertCircle size={24} className="text-rose-500 opacity-60" />
        </div>
      </div>

      {/* Daily Completion Graph */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-500" />
              Gráfico de Conclusão Diária
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Porcentagem de tarefas cumpridas em cada dia do período selecionado
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 100% Completo
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Em progresso
            </span>
          </div>
        </div>

        {stats.dailyGraph.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Nenhum registro encontrado para este período. Comece a marcar suas atividades hoje!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2 overflow-x-auto">
              {stats.dailyGraph.map((item) => {
                const heightPercent = Math.max(8, item.percent);
                const isFull = item.isComplete;
                return (
                  <div key={item.date} className="flex-1 min-w-[38px] max-w-[64px] flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.percent}%
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-full flex flex-col justify-end p-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className={`w-full rounded-lg transition-all ${
                          isFull
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-xs'
                            : item.percent >= 50
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                            : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                        }`}
                        title={`${item.dayLabel}: ${item.completed}/${item.scheduled} (${item.percent}%)`}
                      />
                    </div>
                    <span className="text-[11px] font-bold font-mono text-slate-600 dark:text-slate-400 truncate">
                      {item.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Highlights: Best vs Most Missed Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Completed Activity */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <ThumbsUp size={16} />
            <span>Atividade Mais Concluída</span>
          </div>
          {stats.mostCompletedActivity ? (
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {stats.mostCompletedActivity.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Concluída com sucesso <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.mostCompletedActivity.count} vezes</strong> no período.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Nenhuma atividade concluída ainda no período selecionado.
            </p>
          )}
        </div>

        {/* Most Missed Activity */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
            <AlertCircle size={16} />
            <span>Atividade Mais Frequentemente Não Realizada</span>
          </div>
          {stats.mostMissedActivity ? (
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {stats.mostMissedActivity.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Não realizada <strong className="text-rose-600 dark:text-rose-400 font-bold">{stats.mostMissedActivity.count} vezes</strong>.
              </p>
              {stats.mostMissedActivity.topReasons.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {stats.mostMissedActivity.topReasons.map((reason, idx) => (
                    <span key={idx} className="text-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-200/50">
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Nenhuma atividade marcada como não realizada no período. Parabéns!
            </p>
          )}
        </div>
      </div>

      {/* Weekly Evolution if available */}
      {stats.weeklyEvolution.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" />
            Evolução Semanal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stats.weeklyEvolution.map((w, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{w.weekLabel}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{w.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${w.completionRate}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {w.completedDays} dias 100% cumpridos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
