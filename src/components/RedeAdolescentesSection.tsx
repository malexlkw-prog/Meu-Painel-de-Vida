import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Users, 
  UserCheck, 
  DollarSign, 
  Shirt, 
  Pizza, 
  Compass, 
  Package, 
  CheckSquare, 
  FileText, 
  Award,
  ChevronLeft,
  LayoutDashboard,
  ArrowLeft,
  Search,
  ExternalLink,
  Clock,
  Heart,
  X,
  Plus
} from 'lucide-react';
import { RedeAdolescentesData } from '../types/redeAdolescentes';
import { RedeDashboardView } from './rede-adolescentes/RedeDashboardView';
import { RedeCronogramaView } from './rede-adolescentes/RedeCronogramaView';
import { RedeCiclosView } from './rede-adolescentes/RedeCiclosView';
import { RedeEventosEspeciaisView } from './rede-adolescentes/RedeEventosEspeciaisView';
import { RedeParticipantesView } from './rede-adolescentes/RedeParticipantesView';
import { RedeEquipeView } from './rede-adolescentes/RedeEquipeView';
import { RedeFinanceiroView } from './rede-adolescentes/RedeFinanceiroView';
import { RedeCamisasView } from './rede-adolescentes/RedeCamisasView';
import { RedeAlimentacaoView } from './rede-adolescentes/RedeAlimentacaoView';
import { RedePasseiosView } from './rede-adolescentes/RedePasseiosView';
import { RedeMateriaisView } from './rede-adolescentes/RedeMateriaisView';
import { RedeTarefasView } from './rede-adolescentes/RedeTarefasView';
import { RedeAnotacoesView } from './rede-adolescentes/RedeAnotacoesView';
import { RedeJornadaView } from './rede-adolescentes/RedeJornadaView';

interface RedeAdolescentesSectionProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
  onClose?: () => void;
  isStandaloneSite?: boolean;
}

export const RedeAdolescentesSection: React.FC<RedeAdolescentesSectionProps> = ({ 
  data, 
  onUpdateData, 
  onClose,
  isStandaloneSite = true 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Quick stats calculation
  const reachedCount = data.participants.filter(p => p.status === 'alcancado' || p.status === 'integrado').length;
  const pendingTasksCount = data.tasks.filter(t => t.status !== 'Concluído').length;

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, badge: null },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar, badge: '35' },
    { id: 'ciclos', label: 'Ciclos', icon: BookOpen, badge: '5' },
    { id: 'especiais', label: 'Sábados Especiais', icon: Sparkles, badge: '6' },
    { id: 'participantes', label: 'Participantes (Meta 10)', icon: Users, badge: `${reachedCount}/${data.reachGoal || 10}` },
    { id: 'equipe', label: 'Equipe & Líderes', icon: UserCheck, badge: `${data.team?.length || 0}` },
    { id: 'financeiro', label: 'Orçamento', icon: DollarSign, badge: null },
    { id: 'camisas', label: 'Camisas 2027', icon: Shirt, badge: null },
    { id: 'alimentacao', label: 'Alimentação', icon: Pizza, badge: `${data.meals?.length || 0}` },
    { id: 'passeio', label: 'Passeio & Retiro', icon: Compass, badge: null },
    { id: 'materiais', label: 'Materiais', icon: Package, badge: null },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null },
    { id: 'anotacoes', label: 'Anotações', icon: FileText, badge: `${data.notes?.length || 0}` },
    { id: 'jornada', label: 'Jornada & Identidade', icon: Award, badge: null }
  ];

  // Quick search results across participants, meetings, tasks, notes
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{ type: string; title: string; subtitle: string; tabId: string }> = [];

    // Search participants
    data.participants.forEach(p => {
      if (p.name.toLowerCase().includes(q) || (p.notes && p.notes.toLowerCase().includes(q))) {
        results.push({
          type: 'Participante',
          title: p.name,
          subtitle: `Status: ${p.status} • Idade: ${p.age || 'N/I'}`,
          tabId: 'participantes'
        });
      }
    });

    // Search cycles & meetings
    data.cycles.forEach(c => {
      c.weeks.forEach(w => {
        if (w.theme.toLowerCase().includes(q) || (w.description && w.description.toLowerCase().includes(q))) {
          results.push({
            type: 'Encontro',
            title: `${w.date}: ${w.theme}`,
            subtitle: `${c.name}`,
            tabId: 'cronograma'
          });
        }
      });
    });

    // Search tasks
    data.tasks.forEach(t => {
      if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) {
        results.push({
          type: 'Tarefa',
          title: t.title,
          subtitle: `Prioridade: ${t.priority} • Status: ${t.status}`,
          tabId: 'tarefas'
        });
      }
    });

    // Search special events
    data.specialEvents.forEach(e => {
      if (e.name.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q))) {
        results.push({
          type: 'Evento Especial',
          title: `${e.date}: ${e.name}`,
          subtitle: e.description,
          tabId: 'especiais'
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, data]);

  const currentTabName = navItems.find(item => item.id === activeSubTab)?.label || 'Visão Geral';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ========================================================================= */}
      {/* DEDICATED SITE HEADER (PORTAL DA REDE DE ADOLESCENTES) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-indigo-950/60 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3.5">
              <div 
                onClick={() => setActiveSubTab('dashboard')} 
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Ir para o Início da Rede de Adolescentes"
              >
                <Users size={24} className="stroke-[2.5]" />
              </div>
              <div className="cursor-pointer" onClick={() => setActiveSubTab('dashboard')}>
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white">
                  REDE DE ADOLESCENTES
                </h1>
              </div>
            </div>

            {/* Center: Verse Banner */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200/90 max-w-md">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span className="truncate italic">
                “Arraigados e edificados nele, firmados na fé” — Cl 2:6-7
              </span>
            </div>

            {/* Right: Quick Actions & Return to Dashboard Button */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Quick Search Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer"
                  title="Pesquisar no site da Rede"
                >
                  <Search size={15} className="text-indigo-400" />
                  <span className="hidden sm:inline">Pesquisar...</span>
                </button>

                {/* Dropdown Search Modal */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-indigo-900/60 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
                      <Search size={16} className="text-indigo-400 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar participantes, datas, tarefas..."
                        className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                        autoFocus
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {searchQuery.trim() && (
                      <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <div className="text-center py-4 text-xs text-slate-500">
                            Nenhum resultado encontrado para &quot;{searchQuery}&quot;
                          </div>
                        ) : (
                          searchResults.map((res, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveSubTab(res.tabId);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors flex flex-col group cursor-pointer"
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                <span>{res.type}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Acessar →</span>
                              </div>
                              <span className="text-xs font-semibold text-white group-hover:text-indigo-300">
                                {res.title}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate">
                                {res.subtitle}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Return to Main Dashboard Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
                  title="Voltar ao Painel Geral (LifeHub)"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Voltar ao Meu Painel</span>
                  <span className="sm:hidden">Voltar</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SITE NAVIGATION BAR (TABS) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/60 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-white' : 'text-indigo-400'} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-indigo-950/60 text-white border border-indigo-400/40' 
                          : 'bg-slate-800 text-indigo-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN SITE CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <button 
              onClick={() => setActiveSubTab('dashboard')}
              className="hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Rede de Adolescentes
            </button>
            <span>/</span>
            <span className="text-white font-bold">{currentTabName}</span>
          </div>
        </div>

        {/* Dynamic Views */}
        <div className="transition-all duration-200">
          {activeSubTab === 'dashboard' && (
            <RedeDashboardView data={data} onNavigate={(tabId) => setActiveSubTab(tabId)} />
          )}

          {activeSubTab === 'cronograma' && (
            <RedeCronogramaView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'ciclos' && (
            <RedeCiclosView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'especiais' && (
            <RedeEventosEspeciaisView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'participantes' && (
            <RedeParticipantesView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'equipe' && (
            <RedeEquipeView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'financeiro' && (
            <RedeFinanceiroView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'camisas' && (
            <RedeCamisasView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'alimentacao' && (
            <RedeAlimentacaoView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'passeio' && (
            <RedePasseiosView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'materiais' && (
            <RedeMateriaisView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'tarefas' && (
            <RedeTarefasView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'anotacoes' && (
            <RedeAnotacoesView data={data} onUpdateData={onUpdateData} />
          )}

          {activeSubTab === 'jornada' && (
            <RedeJornadaView data={data} />
          )}
        </div>
      </main>
    </div>
  );
};
