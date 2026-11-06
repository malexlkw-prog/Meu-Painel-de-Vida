import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { RoutineActivity } from '../../types';
import { timeToMinutes, minutesToTime } from '../../utils/routineUtils';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: RoutineActivity | null;
  onSave: (activity: Omit<RoutineActivity, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
}

const WEEKDAYS = [
  { id: 0, label: 'Dom', fullName: 'Domingo' },
  { id: 1, label: 'Seg', fullName: 'Segunda-feira' },
  { id: 2, label: 'Ter', fullName: 'Terça-feira' },
  { id: 3, label: 'Qua', fullName: 'Quarta-feira' },
  { id: 4, label: 'Qui', fullName: 'Quinta-feira' },
  { id: 5, label: 'Sex', fullName: 'Sexta-feira' },
  { id: 6, label: 'Sáb', fullName: 'Sábado' }
];

const CATEGORIES: { id: 'personal' | 'spiritual' | 'study' | 'work' | 'health' | 'leisure'; label: string; color: string }[] = [
  { id: 'personal', label: 'Pessoal', color: 'slate' },
  { id: 'spiritual', label: 'Espiritual', color: 'amber' },
  { id: 'study', label: 'Estudo', color: 'indigo' },
  { id: 'work', label: 'Trabalho', color: 'blue' },
  { id: 'health', label: 'Saúde / Exercício', color: 'emerald' },
  { id: 'leisure', label: 'Lazer / Descanso', color: 'pink' }
];

export default function ActivityModal({
  isOpen,
  onClose,
  activityToEdit,
  onSave,
  onDelete
}: ActivityModalProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:45');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [category, setCategory] = useState<'personal' | 'spiritual' | 'study' | 'work' | 'health' | 'leisure'>('study');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (activityToEdit) {
      setName(activityToEdit.name || '');
      setStartTime(activityToEdit.startTime || '08:00');
      setEndTime(activityToEdit.endTime || '08:45');
      setDurationMinutes(activityToEdit.durationMinutes || 45);
      setDaysOfWeek(activityToEdit.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
      setCategory(activityToEdit.category || 'study');
      setActive(activityToEdit.active !== false);
    } else {
      setName('');
      setStartTime('08:00');
      setEndTime('08:45');
      setDurationMinutes(45);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
      setCategory('study');
      setActive(true);
    }
  }, [activityToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-update duration when times change
  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    const startM = timeToMinutes(val);
    const endM = timeToMinutes(endTime);
    let diff = endM - startM;
    if (diff <= 0) diff += 1440;
    setDurationMinutes(diff);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTime(val);
    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(val);
    let diff = endM - startM;
    if (diff <= 0) diff += 1440;
    setDurationMinutes(diff);
  };

  const handleDurationChange = (minutes: number) => {
    const validMin = Math.max(5, minutes);
    setDurationMinutes(validMin);
    const startM = timeToMinutes(startTime);
    const calculatedEnd = minutesToTime(startM + validMin);
    setEndTime(calculatedEnd);
  };

  const toggleDay = (dayId: number) => {
    if (daysOfWeek.includes(dayId)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter(d => d !== dayId));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, dayId].sort());
    }
  };

  const selectAllDays = () => setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
  const selectWeekdays = () => setDaysOfWeek([1, 2, 3, 4, 5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: activityToEdit ? activityToEdit.id : undefined,
      name: name.trim(),
      startTime,
      endTime,
      durationMinutes,
      daysOfWeek,
      category,
      order: activityToEdit?.order || 99,
      active
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 font-mono flex items-center gap-1.5">
                <Clock size={14} /> Cronograma Diário
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activityToEdit ? 'Editar Atividade' : 'Nova Atividade da Rotina'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nome da Atividade:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Devocional matinal, Academia, Leitura bíblica..."
                className="w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Horários e Duração */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Início:
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full p-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Término:
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full p-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Duração (min):
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value, 10) || 15)}
                  className="w-full p-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Categoria:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      category === cat.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dias da semana */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-500" />
                  Dias da Semana:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllDays}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Todos os dias
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={selectWeekdays}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Seg–Sex
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((w) => {
                  const isSelected = daysOfWeek.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleDay(w.id)}
                      className={`p-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      title={w.fullName}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status ativo */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Atividade Ativa na Rotina
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Desative para pausar temporariamente sem apagar
                </span>
              </div>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              {activityToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Deseja excluir "${activityToEdit.name}" da rotina diária?`)) {
                      onDelete(activityToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Excluir</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Salvar Atividade</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
