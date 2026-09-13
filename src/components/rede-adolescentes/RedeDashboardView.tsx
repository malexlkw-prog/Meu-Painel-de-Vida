import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Users, 
  Target, 
  DollarSign, 
  Shirt, 
  Pizza, 
  Compass, 
  Package, 
  CheckSquare, 
  FileText, 
  UserCheck, 
  Award,
  ChevronRight,
  Heart,
  Flame,
  ArrowRight,
  Clock
} from 'lucide-react';
import { RedeAdolescentesData } from '../../types/redeAdolescentes';

interface RedeDashboardViewProps {
  data: RedeAdolescentesData;
  onNavigate: (tabId: string) => void;
}

export const RedeDashboardView: React.FC<RedeDashboardViewProps> = ({ data, onNavigate }) => {
  const reachedCount = data.participants.filter(p => p.status === 'alcancado' || p.status === 'integrado').length;
  const totalParticipants = data.participants.length;
  const pendingTasksCount = data.tasks.filter(t => t.status !== 'Concluído').length;

  const totalFinanceEstimated = data.finance.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) +
    data.meals.reduce((acc, curr) => acc + (curr.totalCost || 0), 0) +
    data.materials.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);

  const navCards = [
    {
      id: 'cronograma',
      title: 'Cronograma 2027',
      subtitle: '35 encontros planejados',
      icon: Calendar,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-500',
      badge: '06/02 → 04/12'
    },
    {
      id: 'ciclos',
      title: 'Ciclos Temáticos',
      subtitle: '5 ciclos estruturados',
      icon: BookOpen,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-500',
      badge: '5 Ciclos'
    },
    {
      id: 'especiais',
      title: 'Sábados Especiais',
      subtitle: 'Cinema, Gincanas, Vigília e Ação',
      icon: Sparkles,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-500',
      badge: '6 Eventos'
    },
    {
      id: 'participantes',
      title: 'Participantes & Meta 10',
      subtitle: `${reachedCount} de ${data.reachGoal} alcançados`,
      icon: Users,
      color: 'from-rose-500/10 to-pink-500/10 border-rose-500/30 text-rose-500',
      badge: `${totalParticipants} cadastrados`
    },
    {
      id: 'equipe',
      title: 'Equipe da Rede',
      subtitle: `${data.team.length} integrantes na organização`,
      icon: UserCheck,
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30 text-purple-500',
      badge: 'Liderança'
    },
    {
      id: 'financeiro',
      title: 'Orçamento do Projeto',
      subtitle: 'Controle de custos e arrecadação',
      icon: DollarSign,
      color: 'from-teal-500/10 to-emerald-500/10 border-teal-500/30 text-teal-500',
      badge: 'Exclusivo da Rede'
    },
    {
      id: 'camisas',
      title: 'Camisas 2027',
      subtitle: 'Modelo, confecção e subsídios',
      icon: Shirt,
      color: 'from-indigo-500/10 to-cyan-500/10 border-indigo-500/30 text-indigo-500',
      badge: 'Identidade'
    },
    {
      id: 'alimentacao',
      title: 'Alimentação & Lanches',
      subtitle: `${data.meals.length} cardápios programados`,
      icon: Pizza,
      color: 'from-orange-500/10 to-amber-500/10 border-orange-500/30 text-orange-500',
      badge: 'Comunhão'
    },
    {
      id: 'passeio',
      title: 'Passeio da Rede',
      subtitle: '06/11/2027 (Chácara / Lazer)',
      icon: Compass,
      color: 'from-sky-500/10 to-blue-500/10 border-sky-500/30 text-sky-500',
      badge: 'Dia Especial'
    },
    {
      id: 'materiais',
      title: 'Materiais & Dinâmicas',
      subtitle: `${data.materials.length} itens listados`,
      icon: Package,
      color: 'from-slate-500/10 to-zinc-500/10 border-slate-500/30 text-slate-400',
      badge: 'Logística'
    },
    {
      id: 'tarefas',
      title: 'Tarefas de Planejamento',
      subtitle: `${pendingTasksCount} tarefas pendentes`,
      icon: CheckSquare,
      color: 'from-violet-500/10 to-purple-500/10 border-violet-500/30 text-violet-500',
      badge: 'Preparação'
    },
    {
      id: 'anotacoes',
      title: 'Ideias & Anotações',
      subtitle: `${data.notes.length} reflexões e decisões`,
      icon: FileText,
      color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30 text-amber-500',
      badge: 'Brainstorm'
    },
    {
      id: 'jornada',
      title: 'Jornada & Identidade',
      subtitle: 'Alcançar → Acolher → Ensinar → Enviar',
      icon: Award,
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-500',
      badge: 'Visão'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Hero Banner: Identity & Spiritual Foundation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Flame size={12} className="text-amber-400" /> Projeto 2027 • Centro de Planejamento
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                <Clock size={12} /> {data.identity.periodStart} → {data.identity.periodEnd}
              </span>
            </div>

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meta Oficial</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">10 jovens</div>
          <div className="text-[11px] text-amber-500 font-semibold mt-0.5">Alcançados para Cristo</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encontros</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">35 Sábados</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-0.5">5 Ciclos de Estudo</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Especiais</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">6 Eventos</div>
          <div className="text-[11px] text-purple-500 font-semibold mt-0.5">Cinema, Gincana, Noite</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tarefas</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{pendingTasksCount} pendentes</div>
          <div className="text-[11px] text-violet-500 font-semibold mt-0.5">De {data.tasks.length} cadastradas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Equipe</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{data.team.length} pessoas</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">Coordenação & Líderes</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1º Encontro</div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">06/02/2027</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Boas-vindas & Abertura</div>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> Módulos de Planejamento da Rede 2027
          </h2>
          <span className="text-xs text-slate-400">Clique para acessar e gerenciar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {navCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`group text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} border shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-mono">
                    {card.badge}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-indigo-500 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Acessar área</span>
                  <ArrowRight size={13} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spiritual Pillars Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Propósito & Pilares de Desenvolvimento dos Adolescentes
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          {data.identity.purpose} A proposta é que o adolescente não seja apenas alguém que recebe, mas alguém que participa, cresce espiritualmente e alcança outros colegas para Cristo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
          {data.identity.pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 font-medium"
            >
              <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{pillar}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
