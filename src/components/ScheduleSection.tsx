import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Sparkles,
  Edit2,
  Play,
  CheckCircle2,
  Circle,
  HelpCircle
} from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  onAdd: (time: string, activity: string) => void;
  onUpdate: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleSection({ schedule, onAdd, onUpdate, onDelete }: ScheduleSectionProps) {
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

  // Form inputs
  const [formTime, setFormTime] = useState('');
  const [formActivity, setFormActivity] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Sort schedule items chronologically
  const sortedSchedule = [...schedule].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTime || !formActivity.trim()) return;

    if (editingItemId) {
      // Update existing
      const existing = schedule.find(item => item.id === editingItemId);
      if (existing) {
        onUpdate({
          ...existing,
          time: formTime,
          activity: formActivity.trim()
        });
      }
    } else {
      // Add new
      onAdd(formTime, formActivity.trim());
    }

    closeForm();
  };

  const startCreate = () => {
    setEditingItemId(null);
    setFormTime('');
    setFormActivity('');
    setIsFormModalOpen(true);
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingItemId(item.id);
    setFormTime(item.time);
    setFormActivity(item.activity);
    setIsFormModalOpen(true);
    setIsDetailModalOpen(false); // Close details if open
  };

  const closeForm = () => {
    setIsFormModalOpen(false);
    setEditingItemId(null);
    setFormTime('');
    setFormActivity('');
  };

  const openDetails = (item: ScheduleItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const toggleCompleted = (item: ScheduleItem, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // Prevent opening modal when checking box
    onUpdate({
      ...item,
      completed: !item.completed
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with simple "+" trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl">
              <Clock size={22} />
            </span>
            <span>Cronograma Diário</span>
          </h2>

        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm text-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Alocar Bloco</span>
        </button>
      </div>

      {/* Routine Timeline list display - Beautiful Minimal Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-5 md:p-6 shadow-3xs">
        
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 md:ml-28 pl-5 md:pl-8 space-y-4">
          <AnimatePresence initial={false}>
            {sortedSchedule.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => openDetails(item)}
                className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-950/10 dark:border-slate-900/40 opacity-60'
                    : 'bg-white border-slate-200/50 hover:border-cyan-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-cyan-900/50 shadow-3xs hover:shadow-2xs'
                }`}
              >
                {/* Timeline node point */}
                <span className={`absolute -left-[28px] md:-left-[35px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                  item.completed
                    ? 'bg-cyan-500'
                    : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-cyan-500'
                }`} />

                {/* Left side desktop time */}
                <div className="hidden md:block absolute right-[100%] mr-8 top-1/2 -translate-y-1/2">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-850">
                    {item.time}
                  </span>
                </div>

                {/* Left side info (Mobile time & activity) */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Status checkbox toggle */}
                  <button
                    onClick={(e) => toggleCompleted(item, e)}
                    className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.completed
                        ? 'bg-cyan-600 border-cyan-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500'
                    }`}
                  >
                    {item.completed ? (
                      <Check size={11} className="stroke-[3.5px]" />
                    ) : (
                      <Circle size={11} className="opacity-0" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    {/* Mobile Only Time Badge */}
                    <div className="block md:hidden mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-850">
                        {item.time}
                      </span>
                    </div>

                    <p className={`text-sm font-semibold select-none break-words leading-relaxed ${
                      item.completed
                        ? 'text-slate-450 line-through'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {item.activity}
                    </p>
                  </div>
                </div>

                {/* Quick details hint indicator on hover */}
                <span className="text-[10px] font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline mr-2">
                  Ver detalhes
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {sortedSchedule.length === 0 && (
            <div className="text-center py-16 pl-0">
              <Clock className="text-slate-200 dark:text-slate-850 mx-auto mb-2 animate-pulse" size={36} />
              <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Nenhum bloco agendado</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Ordene seu dia! Adicione atividades sequenciais para planejar suas próximas horas com precisão.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ELEGANT DETAIL MODAL */}
      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Colored accent top band */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-500" />

              {/* Close Button */}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-450 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="mt-2 space-y-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                    ⏱️ {selectedItem.time}
                  </span>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block">Compromisso diário</p>
                </div>

                <h3 className="text-base font-black text-slate-800 dark:text-white leading-relaxed break-words">
                  {selectedItem.activity}
                </h3>

                {/* Additional info block */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850/80 text-xs text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className={selectedItem.completed ? 'text-cyan-500' : 'text-slate-300'} />
                    <span>Status: <strong>{selectedItem.completed ? 'Bloco Executado' : 'Aguardando Execução'}</strong></span>
                  </p>
                </div>

                {/* Action buttons tucked nicely */}
                <div className="pt-5 border-t border-slate-100 dark:border-slate-850/80 flex gap-2">
                  <button
                    onClick={() => startEdit(selectedItem)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Editar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onUpdate({ ...selectedItem, completed: !selectedItem.completed });
                      setIsDetailModalOpen(false);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedItem.completed
                        ? 'bg-cyan-100 hover:bg-cyan-150 text-cyan-700'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                    }`}
                  >
                    <Check size={13} />
                    <span>{selectedItem.completed ? 'Pendente' : 'Feito'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onDelete(selectedItem.id);
                      setIsDetailModalOpen(false);
                    }}
                    className="p-2.5 border border-rose-200 hover:bg-rose-50 text-rose-500 dark:border-rose-950 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REFORMULATED ELEGANT ADD/EDIT MODAL */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-500" />

              {/* Close trigger */}
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4">
                {editingItemId ? '✏️ Editar Bloco de Tempo' : '⏰ Novo Bloco de Tempo'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Horário */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Horário (HH:MM)</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none dark:text-white font-mono"
                    required
                  />
                </div>

                {/* Atividade */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Atividade / Compromisso</label>
                  <input
                    type="text"
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value)}
                    placeholder="Ex: Treino de pernas, refeição pós-treino..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none dark:text-white font-medium"
                    required
                  />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-cyan-600 dark:hover:bg-cyan-750 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
                  >
                    Salvar
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
