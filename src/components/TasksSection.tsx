import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Calendar, 
  Inbox, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  Copy,
  Eye,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { Task } from '../types';

interface TasksSectionProps {
  tasks: Task[];
  onAdd: (text: string, type: 'today' | 'pending') => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TasksSection({ tasks, onAdd, onToggle, onDelete }: TasksSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [taskType, setTaskType] = useState<'today' | 'pending'>('today');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('today');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    onAdd(taskText.trim(), taskType);
    setTaskText('');
    setIsAddModalOpen(false);
  };

  const startCreate = () => {
    setTaskText('');
    setTaskType('today');
    setIsAddModalOpen(true);
  };

  // Filter computations
  const todayTasks = tasks.filter(t => !t.completed && t.type === 'today');
  const pendingTasks = tasks.filter(t => !t.completed && t.type === 'pending');
  const completedTasks = tasks.filter(t => t.completed);

  // Computed displayed list
  const getDisplayedTasks = () => {
    if (currentFilter === 'today') return todayTasks;
    if (currentFilter === 'pending') return pendingTasks;
    if (currentFilter === 'completed') return completedTasks;
    return tasks; // all
  };

  const displayedList = getDisplayedTasks();

  const handleDuplicate = (task: Task) => {
    onAdd(task.text, task.type);
    setActiveDropdownId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <CheckSquare size={22} />
            </span>
            <span>Minhas Tarefas</span>
          </h2>

        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm text-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-2xl border border-slate-150/45 dark:border-slate-850/50">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCurrentFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentFilter === 'today'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            <Calendar size={13} />
            <span>Hoje ({todayTasks.length})</span>
          </button>
          
          <button
            onClick={() => setCurrentFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentFilter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            <Inbox size={13} />
            <span>Pendentes ({pendingTasks.length})</span>
          </button>

          <button
            onClick={() => setCurrentFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentFilter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Concluídas ({completedTasks.length})</span>
          </button>

          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-3xs font-extrabold'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            Todas ({tasks.length})
          </button>
        </div>
      </div>

      {/* Streamlined Checklist Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-3xs">
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {displayedList.map((task) => {
              const isTodayType = task.type === 'today';

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/40 border-slate-100 dark:bg-slate-950/10 dark:border-slate-900/40 opacity-60'
                      : 'bg-white border-slate-200/50 dark:bg-slate-900 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/50 shadow-3xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Interactive check toggle circle */}
                    <button
                      onClick={() => onToggle(task.id)}
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        task.completed
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle size={12} className="stroke-[3.5px] text-white" />
                      ) : (
                        <Circle size={12} className="opacity-0" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold select-none break-words leading-relaxed ${
                        task.completed 
                          ? 'text-slate-400 line-through decoration-slate-300' 
                          : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {task.text}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center text-[9px] uppercase font-bold tracking-wider ${
                          isTodayType
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {isTodayType ? '• Fazer Hoje' : '• Backlog Pendente'}
                        </span>
                        
                        <span className="text-[9px] text-slate-400 font-mono">
                          {task.createdAt.split('-').reverse().join('/')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Discrete actions menu */}
                  <div className="relative shrink-0 ml-2">
                    <button
                      onClick={() => setActiveDropdownId(activeDropdownId === task.id ? null : task.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <MoreVertical size={14} />
                    </button>

                    <AnimatePresence>
                      {activeDropdownId === task.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-20 text-xs text-slate-700 dark:text-slate-300"
                          >
                            <button
                              onClick={() => { onToggle(task.id); setActiveDropdownId(null); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <CheckCircle2 size={12} /> {task.completed ? 'Reabrir' : 'Concluir'}
                            </button>
                            <button
                              onClick={() => handleDuplicate(task)}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium cursor-pointer"
                            >
                              <Copy size={12} /> Duplicar
                            </button>
                            <div className="border-t border-slate-100 dark:border-slate-850 my-1" />
                            <button
                              onClick={() => { onDelete(task.id); setActiveDropdownId(null); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-905 flex items-center gap-1.5 font-medium text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={12} /> Excluir
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {displayedList.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <CheckSquare size={36} className="text-indigo-500/10 dark:text-indigo-500/20 mb-2 animate-bounce" />
              <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-250">Sem tarefas nesta lista</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed text-center">
                Tudo sob controle! Clique em "Nova Tarefa" no cabeçalho para registrar suas obrigações diárias.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REFORMULATED ELEGANT ADD MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

              {/* Close Button */}
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4">
                ✏️ Cadastrar Nova Tarefa
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Task description */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">O que precisa ser feito?</label>
                  <textarea
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="Ex: Atualizar controle financeiro semanal..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white resize-none leading-relaxed font-semibold"
                    required
                  />
                </div>

                {/* When to execute selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Quando executar?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaskType('today')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        taskType === 'today'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-3xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Calendar size={13} /> Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType('pending')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        taskType === 'pending'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-3xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Inbox size={13} /> Backlog
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm text-center"
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
