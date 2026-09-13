import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { RedeAdolescentesData, RedePlanningTask, TaskPriority, TaskStatus } from '../../types/redeAdolescentes';

interface RedeTarefasViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeTarefasView: React.FC<RedeTarefasViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | TaskStatus>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RedePlanningTask | null>(null);

  const pendingCount = data.tasks.filter(t => t.status !== 'Concluído').length;
  const completedCount = data.tasks.filter(t => t.status === 'Concluído').length;

  const filteredTasks = useMemo(() => {
    return data.tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.responsible && task.responsible.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'todos' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'todos' || task.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [data.tasks, searchTerm, statusFilter, priorityFilter]);

  const handleToggleStatus = (id: string) => {
    const updated = data.tasks.map(t => {
      if (t.id !== id) return t;
      let nextStatus: TaskStatus = 'Concluído';
      if (t.status === 'Concluído') nextStatus = 'A fazer';
      else if (t.status === 'A fazer') nextStatus = 'Em andamento';
      else if (t.status === 'Em andamento') nextStatus = 'Concluído';
      return { ...t, status: nextStatus };
    });
    onUpdateData({ ...data, tasks: updated });
  };

  const handleOpenAdd = () => {
    const newTask: RedePlanningTask = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      deadline: '2026 / 2027',
      priority: 'Média',
      responsible: 'Eu',
      eventRelated: 'Geral',
      status: 'A fazer',
      checklist: []
    };
    setEditingTask(newTask);
    setModalOpen(true);
  };

  const handleOpenEdit = (t: RedePlanningTask) => {
    setEditingTask({ ...t });
    setModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask || !editingTask.title.trim()) return;

    const exists = data.tasks.some(t => t.id === editingTask.id);
    let updated = [];
    if (exists) {
      updated = data.tasks.map(t => t.id === editingTask.id ? editingTask : t);
    } else {
      updated = [editingTask, ...data.tasks];
    }

    onUpdateData({ ...data, tasks: updated });
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Deseja excluir esta tarefa de planejamento?')) {
      onUpdateData({
        ...data,
        tasks: data.tasks.filter(t => t.id !== id)
      });
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'Alta':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Alta</span>;
      case 'Média':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Média</span>;
      case 'Baixa':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Baixa</span>;
    }
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="text-violet-500" size={22} />
            <span>Tarefas de Planejamento da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão de pendências e preparativos exclusivos para o lançamento e execução do projeto.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total de Tarefas</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.tasks.length}
          </div>
          <div className="text-[11px] text-violet-500 font-semibold">Todas planejadas para 2026/2027</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Pendentes</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">A fazer ou em andamento</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Concluídas</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Etapas finalizadas</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tarefas..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          {(['todos', 'A fazer', 'Em andamento', 'Concluído'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'todos' ? 'Todas' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isDone = task.status === 'Concluído';
          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-500/40 shadow-xs'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <button
                  onClick={() => handleToggleStatus(task.id)}
                  className="mt-0.5 sm:mt-0 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
                  title="Clique para avançar o status"
                >
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/20" />
                  ) : task.status === 'Em andamento' ? (
                    <Clock size={22} className="text-amber-500" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </span>
                    {getPriorityBadge(task.priority)}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5 font-mono">
                    {task.deadline && <span>📅 Prazo: {task.deadline}</span>}
                    {task.responsible && <span>👤 Responsável: {task.responsible}</span>}
                    {task.eventRelated && <span>🎯 Evento: {task.eventRelated}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Editar tarefa"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  title="Excluir tarefa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            Nenhuma tarefa encontrada.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingTask.title ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Título da Tarefa *</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Ex: Cotação das camisetas, Montar questionário da gincana..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Detalhes ou critérios de conclusão..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="A fazer">A fazer</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Prioridade</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Prazo</label>
                  <input
                    type="text"
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                    placeholder="Ex: Janeiro/2027"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editingTask.responsible}
                    onChange={(e) => setEditingTask({ ...editingTask, responsible: e.target.value })}
                    placeholder="Ex: Eu, Pais, Líderes"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Evento Relacionado</label>
                  <input
                    type="text"
                    value={editingTask.eventRelated || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, eventRelated: e.target.value })}
                    placeholder="Ex: Geral, 1ª Gincana, Camisas"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTask}
                disabled={!editingTask.title.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
