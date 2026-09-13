import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Film, 
  Trophy, 
  Moon, 
  Compass, 
  Users2, 
  Gift, 
  Edit3, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  User,
  Heart,
  MessageSquare
} from 'lucide-react';
import { RedeAdolescentesData, SpecialEvent } from '../../types/redeAdolescentes';

interface RedeEventosEspeciaisViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeEventosEspeciaisView: React.FC<RedeEventosEspeciaisViewProps> = ({ data, onUpdateData }) => {
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent>(data.specialEvents[0] || null);
  const [editingModal, setEditingModal] = useState(false);
  const [formEvent, setFormEvent] = useState<SpecialEvent | null>(null);

  const getEventIcon = (id: string) => {
    if (id.includes('cinema')) return Film;
    if (id.includes('gincana-1')) return Trophy;
    if (id.includes('noite')) return Moon;
    if (id.includes('passeio')) return Compass;
    if (id.includes('adolescentes-acao')) return Users2;
    return Gift;
  };

  const handleOpenEdit = (evt: SpecialEvent) => {
    setFormEvent(JSON.parse(JSON.stringify(evt)));
    setEditingModal(true);
  };

  const handleOpenNew = () => {
    const newEvt: SpecialEvent = {
      id: `evt-custom-${Date.now()}`,
      name: 'Novo Sábado Especial',
      date: '2027',
      description: 'Descrição do evento especial planejado.',
      plannedActivities: ['Atividade 1', 'Momento de Lanche', 'Comunhão e Oração'],
      responsible: 'Equipe da Rede',
      budget: 0
    };
    setFormEvent(newEvt);
    setEditingModal(true);
  };

  const handleSaveEvent = () => {
    if (!formEvent) return;
    const exists = data.specialEvents.some(e => e.id === formEvent.id);
    let updatedList = [];
    if (exists) {
      updatedList = data.specialEvents.map(e => e.id === formEvent.id ? formEvent : e);
    } else {
      updatedList = [...data.specialEvents, formEvent];
    }
    onUpdateData({
      ...data,
      specialEvents: updatedList
    });
    setSelectedEvent(formEvent);
    setEditingModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento especial?')) {
      const updated = data.specialEvents.filter(e => e.id !== id);
      onUpdateData({ ...data, specialEvents: updated });
      if (selectedEvent?.id === id) {
        setSelectedEvent(updated[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" size={22} />
            <span>Sábados Especiais & Grandes Momentos 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Eventos pontuais planejados para quebrar a rotina, gerar comunhão intensa e fortalecer a fé dos adolescentes.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Novo Evento Especial</span>
        </button>
      </div>

      {/* Main Events Grid / Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.specialEvents.map(evt => {
          const Icon = getEventIcon(evt.id);
          const isSelected = selectedEvent?.id === evt.id;
          return (
            <button
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-amber-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-amber-500'}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {evt.date}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold line-clamp-2 leading-tight">
                  {evt.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Event Details Panel */}
      {selectedEvent && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  📅 {selectedEvent.date}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Responsável: <strong className="text-slate-700 dark:text-slate-200">{selectedEvent.responsible || 'Equipe'}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                {selectedEvent.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(selectedEvent)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs transition-all cursor-pointer"
              >
                <Edit3 size={14} /> Editar Evento
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                title="Excluir evento"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Grid of Planned Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Planned Activities */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" /> Programação & Atividades Planejadas
              </h4>
              <div className="space-y-2">
                {selectedEvent.plannedActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <span className="w-4 h-4 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Specific Focus Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={15} className="text-amber-500" /> Destaque & Logística do Evento
              </h4>

              {selectedEvent.id.includes('cinema') && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Sugestões de filmes bíblicos e edificantes para debater:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Quarto de Guerra', 'Milagres do Paraíso', 'A Prova de Fogo', 'Deus Não Está Morto'].map(m => (
                      <span key={m} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                        🎬 {m}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Inclui: Filme, Pipoca, Lanches, Interação e Comunhão.
                  </p>
                </div>
              )}

              {selectedEvent.id.includes('gincana-1') && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Grandes provas bíblicas baseadas na leitura de <strong>Mateus 1 a 28</strong>:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Passa ou Repassa com sino ou buzina</li>
                    <li>Torta na Cara com perguntas bíblicas</li>
                    <li>Perguntas rápidas de reflexo e memória</li>
                    <li>Desafios cooperativos e pontuação por equipe</li>
                  </ul>
                </div>
              )}

              {selectedEvent.id.includes('noite') && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <span className="font-bold block">Roda de conversa temática:</span>
                    “Como está sendo meu ano na Rede de Adolescentes?”
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Espaço para compartilhar experiências, dificuldades, o que mais gostaram e sugestões para os próximos meses.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Logística: Colchões, barracas, alimentação e oração de madrugada.
                  </p>
                </div>
              )}

              {selectedEvent.id.includes('passeio') && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Opções de lazer planejadas:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Rio', 'Piscina', 'Chácara', 'Parque de Lazer'].map(op => (
                      <span key={op} className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                        🌊 {op}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Cálculo automático de custos disponível na aba <strong>Passeio</strong>.
                  </p>
                </div>
              )}

              {selectedEvent.id.includes('adolescentes-acao') && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <span className="font-bold block">Base Bíblica: Marcos 16:15</span>
                    “Ide por todo o mundo e pregai o evangelho a toda criatura.”
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Personagens sugeridos para sorteio das equipes:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Jonas', 'Daniel', 'Davi', 'Moisés', 'Ester', 'José', 'Pedro', 'Jesus'].map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.id.includes('gincana-2') && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Grande encerramento com revisão de todo o ano de 2027:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Conteúdos: Mateus, Antigo Testamento, Provérbios e pregações</li>
                    <li>Passa ou Repassa, Torta na Cara e provas finais</li>
                    <li>Confraternização final com lanche festivo e retrospectiva de fotos</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {editingModal && formEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Editar Sábado Especial
              </h3>
              <button
                onClick={() => setEditingModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome do Evento</label>
                  <input
                    type="text"
                    value={formEvent.name}
                    onChange={(e) => setFormEvent({ ...formEvent, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Data (em 2027)</label>
                  <input
                    type="text"
                    value={formEvent.date}
                    onChange={(e) => setFormEvent({ ...formEvent, date: e.target.value })}
                    placeholder="Ex: 03/04/2027"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formEvent.description}
                  onChange={(e) => setFormEvent({ ...formEvent, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsável Principal</label>
                <input
                  type="text"
                  value={formEvent.responsible || ''}
                  onChange={(e) => setFormEvent({ ...formEvent, responsible: e.target.value })}
                  placeholder="Ex: Eu, Líderes, Pais"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Atividades Planejadas (uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={formEvent.plannedActivities.join('\n')}
                  onChange={(e) => setFormEvent({
                    ...formEvent,
                    plannedActivities: e.target.value.split('\n').filter(a => a.trim() !== '')
                  })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditingModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-sm"
              >
                Salvar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
