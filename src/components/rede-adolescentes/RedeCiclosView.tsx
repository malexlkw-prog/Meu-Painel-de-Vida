import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ListOrdered, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Layers
} from 'lucide-react';
import { RedeAdolescentesData, RedeCycle, MeetingStructureStep, CycleWeek } from '../../types/redeAdolescentes';

interface RedeCiclosViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeCiclosView: React.FC<RedeCiclosViewProps> = ({ data, onUpdateData }) => {
  const [expandedCycle, setExpandedCycle] = useState<string>('ciclo-1');
  const [editingStructureModal, setEditingStructureModal] = useState(false);
  const [structureSteps, setStructureSteps] = useState<MeetingStructureStep[]>(data.meetingStructure);
  const [editingWeek, setEditingWeek] = useState<{ cycleId: string; week: CycleWeek } | null>(null);

  const handleSaveStructure = () => {
    onUpdateData({
      ...data,
      meetingStructure: structureSteps
    });
    setEditingStructureModal(false);
  };

  const handleAddStructureStep = () => {
    const newStep: MeetingStructureStep = {
      id: `step-${Date.now()}`,
      order: structureSteps.length + 1,
      title: 'Nova Etapa',
      description: 'Descrição da etapa do encontro.'
    };
    setStructureSteps([...structureSteps, newStep]);
  };

  const handleRemoveStructureStep = (id: string) => {
    setStructureSteps(structureSteps.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleSaveEditedWeek = () => {
    if (!editingWeek) return;
    const updatedCycles = data.cycles.map(c => {
      if (c.id !== editingWeek.cycleId) return c;
      return {
        ...c,
        weeks: c.weeks.map(w => w.id === editingWeek.week.id ? editingWeek.week : w)
      };
    });
    onUpdateData({
      ...data,
      cycles: updatedCycles
    });
    setEditingWeek(null);
  };

  return (
    <div className="space-y-8 text-left animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={22} />
            <span>Ciclos de Estudo Bíblico 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            5 ciclos temáticos estruturados para aprofundamento bíblico contínuo durante o ano de 2027.
          </p>
        </div>

        <button
          onClick={() => {
            setStructureSteps(data.meetingStructure);
            setEditingStructureModal(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ListOrdered size={15} className="text-indigo-500" />
          <span>Estrutura Normal do Encontro ({data.meetingStructure.length} passos)</span>
        </button>
      </div>

      {/* Normal Meeting Structure Banner */}
      <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Modelo Padrão dos Sábados Normais
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 italic">
            * Sábados especiais possuem programação própria
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {data.meetingStructure.map((step) => (
            <div 
              key={step.id} 
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-1 backdrop-blur-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {step.order}
                </span>
                <span className="text-xs font-bold text-white truncate">{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cycles List Accordion */}
      <div className="space-y-4">
        {data.cycles.map((cycle) => {
          const isExpanded = expandedCycle === cycle.id;
          return (
            <div 
              key={cycle.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'bg-white dark:bg-slate-900 border-indigo-500/50 shadow-md' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Cycle Card Header */}
              <div 
                onClick={() => setExpandedCycle(isExpanded ? '' : cycle.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-start md:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-sm shrink-0">
                    #{cycle.number}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {cycle.name}
                      </h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {cycle.duration}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                      <Calendar size={12} className="text-blue-500" />
                      <span>{cycle.period}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <span className="text-xs text-slate-400 font-medium">
                    {cycle.weeks.length} encontros
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Cycle Details */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-5">
                  {/* Objective */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Objetivo Pedagógico & Espiritual
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {cycle.objective}
                    </p>
                  </div>

                  {/* Weeks Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Programação Semanal do Ciclo</span>
                      <span className="text-[11px] text-slate-400 font-normal">Clique no lápis para editar</span>
                    </div>

                    <div className="space-y-2">
                      {cycle.weeks.map((week, idx) => (
                        <div 
                          key={week.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="shrink-0 w-20 px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-slate-700 dark:text-slate-300">
                              {week.date}
                            </span>

                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {week.theme}
                              </span>
                              {week.readings && (
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                  📖 {week.readings}
                                </div>
                              )}
                              {week.description && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {week.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingWeek({ cycleId: cycle.id, week: { ...week } })}
                            className="shrink-0 self-end sm:self-center p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Editar encontro"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Edit Normal Structure */}
      {editingStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ListOrdered size={18} className="text-indigo-500" />
                <span>Editar Estrutura Normal dos Encontros</span>
              </h3>
              <button
                onClick={() => setEditingStructureModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize o roteiro padrão dos sábados normais de encontro da Rede de Adolescentes.
            </p>

            <div className="space-y-3">
              {structureSteps.map((step, idx) => (
                <div key={step.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-indigo-500">Etapa #{idx + 1}</span>
                    <button
                      onClick={() => handleRemoveStructureStep(step.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer text-xs"
                      title="Excluir etapa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStructureSteps(structureSteps.map(s => s.id === step.id ? { ...s, title: val } : s));
                    }}
                    placeholder="Título da etapa"
                    className="w-full text-xs font-bold p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStructureSteps(structureSteps.map(s => s.id === step.id ? { ...s, description: val } : s));
                    }}
                    placeholder="Descrição da etapa"
                    className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  />
                </div>
              ))}

              <button
                onClick={handleAddStructureStep}
                className="w-full py-2.5 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Adicionar Nova Etapa
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditingStructureModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveStructure}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
              >
                Salvar Estrutura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Week Details */}
      {editingWeek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Editar Encontro ({editingWeek.week.date})
              </h3>
              <button
                onClick={() => setEditingWeek(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tema</label>
                <input
                  type="text"
                  value={editingWeek.week.theme}
                  onChange={(e) => setEditingWeek({ ...editingWeek, week: { ...editingWeek.week, theme: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Leituras Bíblicas (se houver)</label>
                <input
                  type="text"
                  value={editingWeek.week.readings || ''}
                  onChange={(e) => setEditingWeek({ ...editingWeek, week: { ...editingWeek.week, readings: e.target.value } })}
                  placeholder="Ex: Mateus 1-4"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Descrição / Planejamento</label>
                <textarea
                  rows={3}
                  value={editingWeek.week.description || ''}
                  onChange={(e) => setEditingWeek({ ...editingWeek, week: { ...editingWeek.week, description: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditingWeek(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditedWeek}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
