import React, { useState } from 'react';
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
  LayoutDashboard
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
}

export const RedeAdolescentesSection: React.FC<RedeAdolescentesSectionProps> = ({ data, onUpdateData }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'ciclos', label: 'Ciclos', icon: BookOpen },
    { id: 'especiais', label: 'Sábados Especiais', icon: Sparkles },
    { id: 'participantes', label: 'Participantes (Meta 10)', icon: Users },
    { id: 'equipe', label: 'Equipe', icon: UserCheck },
    { id: 'financeiro', label: 'Orçamento', icon: DollarSign },
    { id: 'camisas', label: 'Camisas', icon: Shirt },
    { id: 'alimentacao', label: 'Alimentação', icon: Pizza },
    { id: 'passeio', label: 'Passeio', icon: Compass },
    { id: 'materiais', label: 'Materiais', icon: Package },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
    { id: 'anotacoes', label: 'Anotações', icon: FileText },
    { id: 'jornada', label: 'Jornada & Identidade', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {activeSubTab !== 'dashboard' && (
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Início</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Views */}
      <div className="min-h-[500px]">
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
    </div>
  );
};
