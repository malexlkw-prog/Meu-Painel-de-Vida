import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Search,
  Lock,
  Tag
} from 'lucide-react';
import { ArchivedMonthData } from '../types';

interface MonthDataViewerModalProps {
  archive: ArchivedMonthData | null;
  onClose: () => void;
  onDownloadPdf: (archive: ArchivedMonthData) => void;
}

export default function MonthDataViewerModal({
  archive,
  onClose,
  onDownloadPdf
}: MonthDataViewerModalProps) {
  if (!archive) return null;

  const [activeTab, setActiveTab] = useState<'finance' | 'tasks'>('finance');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const categoryLabels: Record<string, string> = {
    personal: 'Pessoal',
    work: 'Trabalho',
    stationery: 'Papelaria'
  };

  // Filter finance items
  const filteredFinance = (archive.finance || []).filter(f => 
    (f.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoryLabels[f.category] || f.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter tasks
  const filteredTasks = (archive.tasks || []).filter(t =>
    (t.text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#111726] rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-5 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Arquivo Histórico
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Finalizado em {archive.finalizedAtDate}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {archive.monthName} {archive.year}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownloadPdf(archive)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download size={13} />
              <span>Baixar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Read-only banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <Lock size={13} className="text-indigo-500 shrink-0" />
          <span>
            <strong>Modo de Consulta:</strong> Estes registros pertencem ao fechamento de {archive.monthName} de {archive.year} e não afetam os dados ativos no seu painel.
          </span>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Receitas</span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
              {formatCurrency(archive.summary.totalIncome)}
            </span>
          </div>

          <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Despesas</span>
            <span className="text-sm font-black text-rose-700 dark:text-rose-300">
              {formatCurrency(archive.summary.totalExpense)}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            archive.summary.balance >= 0 
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
              : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Saldo Mensal</span>
            <span className="text-sm font-black">
              {formatCurrency(archive.summary.balance)}
            </span>
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Tarefas Concluídas</span>
            <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">
              {archive.summary.completedTasks} / {archive.summary.totalTasks}
              {archive.summary.totalTasks > 0 && (
                <span className="text-[11px] font-bold opacity-75 ml-1">
                  ({Math.round((archive.summary.completedTasks / archive.summary.totalTasks) * 100)}%)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-850 pb-3 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'finance'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <DollarSign size={13} />
              <span>Controle Financeiro ({archive.finance.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckSquare size={13} />
              <span>Minhas Tarefas ({archive.tasks.length})</span>
            </button>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
          {activeTab === 'finance' ? (
            filteredFinance.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                      <th className="p-3">Data</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredFinance.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {f.date ? f.date.split('-').reverse().join('/') : '-'}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            f.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {f.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            {f.type === 'income' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {f.description}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                            {categoryLabels[f.category] || f.category || 'Geral'}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-black font-mono ${
                          f.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {f.type === 'income' ? '+' : '-'} {formatCurrency(f.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Nenhuma transação financeira encontrada neste arquivo.
              </div>
            )
          ) : (
            filteredTasks.length > 0 ? (
              <div className="space-y-2">
                {filteredTasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      t.completed
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-slate-600 dark:text-slate-300'
                        : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                        t.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-700'
                      }`}>
                        {t.completed && <CheckCircle2 size={13} />}
                      </div>
                      <span className={`font-semibold ${t.completed ? 'line-through opacity-75' : ''}`}>
                        {t.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.type === 'today'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {t.type === 'today' ? 'Hoje' : 'Pendente'}
                      </span>
                      {t.createdAt && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {t.createdAt.split('-').reverse().join('/')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Nenhuma tarefa encontrada neste arquivo.
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
