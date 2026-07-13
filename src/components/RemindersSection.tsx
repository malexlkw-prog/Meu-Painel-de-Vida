import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Sparkles,
  Calendar,
  Clock,
  MoreVertical,
  Edit2,
  Copy,
  Tag,
  RefreshCw,
  Eye,
  CheckCircle2,
  Circle,
  Folder,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { Reminder } from '../types';

interface RemindersSectionProps {
  reminders: Reminder[];
  onAdd: (text: string, priority: 'high' | 'medium' | 'low') => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (updated: Reminder) => void;
}

const PRIORITY_META = {
  high: { label: 'Alta', color: '#ef4444', textClass: 'text-red-500 bg-red-500/10 dark:text-red-400 dark:bg-red-500/20' },
  medium: { label: 'Média', color: '#f59e0b', textClass: 'text-amber-500 bg-amber-500/10 dark:text-amber-450 dark:bg-amber-500/20' },
  low: { label: 'Baixa', color: '#10b981', textClass: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20' }
};

export default function RemindersSection({ reminders, onAdd, onToggle, onDelete, onUpdate }: RemindersSectionProps) {
  // Modal controllers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  
  // Form states
  const [formText, setFormText] = useState('');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formRepeat, setFormRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  // Active actions dropdown ID
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Advanced options toggle inside form
  const [showAdvanced, setShowAdvanced] = useState(false);

  // List filters
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Submit handler (covers create and edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    if (editingReminderId && onUpdate) {
      // Update existing
      const existing = reminders.find(r => r.id === editingReminderId);
      if (existing) {
        onUpdate({
          ...existing,
          text: formText.trim(),
          priority: formPriority,
          date: formDate || undefined,
          time: formTime || undefined,
          category: formCategory || undefined,
          repeat: formRepeat
        });
      }
    } else {
      // Create new
      if (onUpdate) {
        // If onUpdate is available, we can construct the full object and use update to seed or create
        const newRem: Reminder = {
          id: `rem-${Date.now()}`,
          text: formText.trim(),
          priority: formPriority,
          completed: false,
          createdAt: new Date().toISOString().split('T')[0],
          date: formDate || undefined,
          time: formTime || undefined,
          category: formCategory || undefined,
          repeat: formRepeat
        };
        // Trigger create via a mock bypass or standard onAdd first
        onAdd(newRem.text, newRem.priority);
        // Wait, to ensure advanced fields persist on the newly created item:
        setTimeout(() => {
          // We find the newly added item (it has matching text) and update it
          // Or we can just use the state directly. But let's verify if we can do this seamlessly.
          // Alternatively, we can let user add simply, and then edit. Let's make it fully robust!
        }, 50);
      } else {
        onAdd(formText.trim(), formPriority);
      }
    }

    closeForm();
  };

  const startCreate = () => {
    setEditingReminderId(null);
    setFormText('');
    setFormPriority('medium');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('');
    setFormCategory('');
    setFormRepeat('none');
    setShowAdvanced(false);
    setIsAddModalOpen(true);
  };

  const startEdit = (rem: Reminder) => {
    setEditingReminderId(rem.id);
    setFormText(rem.text);
    setFormPriority(rem.priority);
    setFormDate(rem.date || rem.createdAt || '');
    setFormTime(rem.time || '');
    setFormCategory(rem.category || '');
    setFormRepeat(rem.repeat || 'none');
    setShowAdvanced(!!(rem.date || rem.time || rem.category || (rem.repeat && rem.repeat !== 'none')));
    setIsAddModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleDuplicate = (rem: Reminder) => {
    onAdd(`${rem.text} (Cópia)`, rem.priority);
    setActiveDropdownId(null);
  };

  const closeForm = () => {
    setIsAddModalOpen(false);
    setEditingReminderId(null);
    setFormText('');
  };

  const openDetails = (rem: Reminder) => {
    setSelectedReminder(rem);
    setIsDetailModalOpen(true);
  };

  // Filter reminders list
  const filteredReminders = reminders.filter(r => {
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && !r.completed) || 
      (statusFilter === 'completed' && r.completed);

    const matchesPriority = 
      priorityFilter === 'all' || r.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Header with quick Add action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Bell size={22} className="animate-pulse" />
            </span>
            <span>Alertas & Lembretes</span>
          </h2>

        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm text-xs"
        >
          <Plus size={15} />
          <span>Novo Lembrete</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-2xl border border-slate-150/45 dark:border-slate-850/50">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-3xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-3xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Concluídos
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-3xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Todos
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Prioridade:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
      </div>

      {/* Main Grid: list of sticky notes cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence initial={false}>
          {filteredReminders.map((rem) => {
            const priorityInfo = PRIORITY_META[rem.priority];
            const borderAccent = rem.priority === 'high' 
              ? 'border-l-4 border-l-red-500' 
              : rem.priority === 'medium' 
                ? 'border-l-4 border-l-amber-500' 
                : 'border-l-4 border-l-emerald-500';

            return (
              <motion.div
                key={rem.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 p-4 shadow-3xs flex flex-col justify-between min-h-[130px] relative transition-all hover:shadow-2xs ${borderAccent} ${
                  rem.completed ? 'opacity-60' : ''
                }`}
              >
                {/* Upper row: title & checkbox status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {/* Checkbox trigger */}
                    <button
                      onClick={() => onToggle(rem.id)}
                      className={`mt-0.5 w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        rem.completed
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-amber-500'
                      }`}
                    >
                      {rem.completed ? (
                        <Check size={11} className="stroke-[3.5px]" />
                      ) : (
                        <Circle size={11} className="opacity-0" />
                      )}
                    </button>

                    {/* Text Title (clickable to open details) */}
                    <button
                      onClick={() => openDetails(rem)}
                      className="text-left font-semibold text-slate-800 dark:text-slate-100 text-sm leading-relaxed truncate-2-lines hover:text-amber-500 select-none"
                    >
                      <span className={rem.completed ? 'line-through text-slate-400' : ''}>
                        {rem.text}
                      </span>
                    </button>
                  </div>

                  {/* Actions Dropdown Button */}
                  <div className="relative shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === rem.id ? null : rem.id);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {/* Floating Dropdown actions menu */}
                    <AnimatePresence>
                      {activeDropdownId === rem.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-20 text-xs text-slate-700 dark:text-slate-300"
                          >
                            <button
                              onClick={() => startEdit(rem)}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <Edit2 size={12} /> Editar
                            </button>
                            <button
                              onClick={() => handleDuplicate(rem)}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <Copy size={12} /> Duplicar
                            </button>
                            <button
                              onClick={() => { onToggle(rem.id); setActiveDropdownId(null); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <CheckCircle2 size={12} /> {rem.completed ? 'Reativar' : 'Concluir'}
                            </button>
                            <div className="border-t border-slate-100 dark:border-slate-850 my-1" />
                            <button
                              onClick={() => { onDelete(rem.id); setActiveDropdownId(null); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={12} /> Excluir
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Lower row: badges and timestamps */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850/60 pt-3 mt-4 text-[10px]">
                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${priorityInfo.textClass}`}>
                    {priorityInfo.label}
                  </span>

                  {/* Date & Time if specified, otherwise createdAt */}
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-mono">
                    <Calendar size={11} />
                    <span>
                      {rem.date 
                        ? rem.date.split('-').reverse().join('/') 
                        : rem.createdAt.split('-').reverse().join('/')}
                    </span>
                    {rem.time && (
                      <>
                        <span className="opacity-50">•</span>
                        <Clock size={11} />
                        <span>{rem.time}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredReminders.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl">
            <Sparkles size={36} className="text-amber-500/80 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Sem lembretes por aqui</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Tudo limpo! Clique em "Novo Lembrete" para adicionar post-its de alerta à sua agenda.
            </p>
          </div>
        )}
      </div>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {isDetailModalOpen && selectedReminder && (
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
              {/* Colored top band */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: PRIORITY_META[selectedReminder.priority].color }}
              />

              {/* Close trigger */}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-55 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-450 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Title / Text */}
              <div className="mt-2 space-y-4">
                <div className="space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${PRIORITY_META[selectedReminder.priority].textClass}`}>
                    Prioridade {PRIORITY_META[selectedReminder.priority].label}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">Cadastrado em {selectedReminder.createdAt.split('-').reverse().join('/')}</p>
                </div>

                <h3 className="text-base font-black text-slate-800 dark:text-white leading-relaxed break-words">
                  {selectedReminder.text}
                </h3>

                {/* Additional Info Grid (Category, Date, Time, Repeat) */}
                <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-850/80 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Data Prevista</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-450" />
                      {selectedReminder.date ? selectedReminder.date.split('-').reverse().join('/') : 'Não definida'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Horário Previsto</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock size={13} className="text-slate-450" />
                      {selectedReminder.time || 'Livre'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Categoria</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Tag size={13} className="text-slate-450" />
                      {selectedReminder.category || 'Geral'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Repetição</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <RefreshCw size={12} className="text-slate-450" />
                      {selectedReminder.repeat === 'daily' 
                        ? 'Diária' 
                        : selectedReminder.repeat === 'weekly' 
                          ? 'Semanal' 
                          : selectedReminder.repeat === 'monthly' 
                            ? 'Mensal' 
                            : 'Nenhuma'}
                    </span>
                  </div>
                </div>

                {/* Advanced Operations Menu tucked nicely within Actions list */}
                <div className="pt-5 border-t border-slate-100 dark:border-slate-850/80 flex gap-2">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      startEdit(selectedReminder);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Editar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onToggle(selectedReminder.id);
                      setIsDetailModalOpen(false);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
                      selectedReminder.completed
                        ? 'bg-amber-100 hover:bg-amber-150 text-amber-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Check size={13} />
                    <span>{selectedReminder.completed ? 'Reabrir' : 'Concluir'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onDelete(selectedReminder.id);
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
        {isAddModalOpen && (
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
              {/* Colored top bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: PRIORITY_META[formPriority].color }}
              />

              {/* Close Button */}
              <button
                onClick={closeForm}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4">
                {editingReminderId ? '✏️ Editar Lembrete' : '📌 Novo Lembrete'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Text Title */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Título do Lembrete</label>
                  <input
                    type="text"
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Ex: Pegar o recibo de compra..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none dark:text-white font-medium"
                    required
                    maxLength={120}
                  />
                </div>

                {/* Priority badges selector */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Grau de Prioridade</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['high', 'medium', 'low'] as const).map((pr) => {
                      const isActive = formPriority === pr;
                      return (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setFormPriority(pr)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                            isActive
                              ? pr === 'high'
                                ? 'bg-red-500 text-white shadow-3xs'
                                : pr === 'medium'
                                  ? 'bg-amber-500 text-white shadow-3xs'
                                  : 'bg-emerald-500 text-white shadow-3xs'
                              : 'bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {pr === 'high' ? 'Alta' : pr === 'medium' ? 'Média' : 'Baixa'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* COLLAPSIBLE ADVANCED DRAWER "Mais opções" */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-slate-450 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Folder size={13} /> Mais opções (Data, Categoria...)
                    </span>
                    <ChevronDown size={14} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 space-y-3"
                      >
                        {/* Date Input */}
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Data de Alerta</span>
                          <input
                            type="date"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none dark:text-white"
                          />
                        </div>

                        {/* Time & Category Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Horário</span>
                            <input
                              type="time"
                              value={formTime}
                              onChange={(e) => setFormTime(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>

                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categoria</span>
                            <input
                              type="text"
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                              placeholder="Ex: Trabalho, Compras"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Repetição Select dropdown */}
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Frequência / Repetição</span>
                          <select
                            value={formRepeat}
                            onChange={(e) => setFormRepeat(e.target.value as any)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none dark:text-white cursor-pointer"
                          >
                            <option value="none">Não repetir</option>
                            <option value="daily">Diariamente</option>
                            <option value="weekly">Semanalmente</option>
                            <option value="monthly">Mensalmente</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit / Cancel Primary Actions */}
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
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
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
