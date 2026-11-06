import React from 'react';
import { 
  Target, 
  ChevronRight
} from 'lucide-react';
import { RedeAdolescentesData } from '../../types/redeAdolescentes';

interface RedeDashboardViewProps {
  data: RedeAdolescentesData;
  onNavigate: (tabId: string) => void;
}

export const RedeDashboardView: React.FC<RedeDashboardViewProps> = ({ data, onNavigate }) => {
  const reachedCount = data.participants.filter(p => p.status === 'alcancado' || p.status === 'integrado').length;
  const pendingTasksCount = data.tasks.filter(t => t.status !== 'Concluído').length;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Hero Banner: Identity & Spiritual Foundation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{data.identity.name}</span>
              <span className="text-amber-400 font-serif italic text-xl md:text-2xl">{data.identity.year}</span>
            </h1>

            <p className="text-base md:text-lg font-medium text-slate-300 italic">
              “{data.identity.theme}”
            </p>

            {/* Versicle Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {data.identity.themeVerseRef}
              </div>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                “{data.identity.themeVerseText}”
              </p>
            </div>
          </div>

          {/* Quick Target Reach Box */}
          <div className="shrink-0 bg-white/5 border border-white/15 backdrop-blur-md rounded-2xl p-5 lg:w-72 flex flex-col justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Meta de Alcance</span>
                <Target size={14} className="text-rose-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{reachedCount}</span>
                <span className="text-sm font-semibold text-slate-400">/ {data.reachGoal} adolescentes</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (reachedCount / data.reachGoal) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigate('participantes')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <span>Gerenciar Participantes</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div 
          onClick={() => onNavigate('participantes')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-amber-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Oficial</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">10 jovens</div>
          <div className="text-[11px] text-amber-500 font-semibold mt-0.5">Alcançados para Cristo</div>
        </div>

        <div 
          onClick={() => onNavigate('cronograma')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encontros</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">35 Sábados</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-0.5">5 Ciclos de Estudo</div>
        </div>

        <div 
          onClick={() => onNavigate('especiais')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-purple-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Especiais</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">6 Eventos</div>
          <div className="text-[11px] text-purple-500 font-semibold mt-0.5">Cinema, Gincana, Noite</div>
        </div>

        <div 
          onClick={() => onNavigate('tarefas')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-violet-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tarefas</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{pendingTasksCount} pendentes</div>
          <div className="text-[11px] text-violet-500 font-semibold mt-0.5">De {data.tasks.length} cadastradas</div>
        </div>

        <div 
          onClick={() => onNavigate('equipe')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Equipe</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{data.team.length} pessoas</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">Coordenação & Líderes</div>
        </div>

        <div 
          onClick={() => onNavigate('cronograma')} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-rose-500/50 transition-colors"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1º Encontro</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">06/02/2027</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Boas-vindas & Abertura</div>
        </div>
      </div>
    </div>
  );
};
