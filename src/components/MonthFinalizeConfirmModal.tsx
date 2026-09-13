import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Moon, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  CheckSquare, 
  Calendar,
  Lock
} from 'lucide-react';
import { PainelData } from '../types';

interface MonthFinalizeConfirmModalProps {
  data: PainelData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (monthName: string, year: number) => void;
}

const PORTUGUESE_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthFinalizeConfirmModal({
  data,
  isOpen,
  onClose,
  onConfirm
}: MonthFinalizeConfirmModalProps) {
  if (!isOpen) return null;

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<string>(PORTUGUESE_MONTHS[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Calculate quick stats of current data to be archived
  const totalIncome = (data.finance || [])
    .filter(f => f.type === 'income')
    .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

  const totalExpense = (data.finance || [])
    .filter(f => f.type === 'expense')
    .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  const totalTasks = (data.tasks || []).length;
  const completedTasks = (data.tasks || []).filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleConfirm = () => {
    onConfirm(selectedMonth, selectedYear);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#111726] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-5 my-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Moon size={22} className="text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Finalizar Mês
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Arquivar ciclo mensal e iniciar um novo período
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Selector */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={13} className="text-indigo-500" />
            <span>Mês Identificado para Fechamento</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {PORTUGUESE_MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value) || currentYear)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live snapshot preview */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Resumo dos dados que serão arquivados:
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Finance snapshot */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <DollarSign size={14} className="text-emerald-500" />
                <span>Controle Financeiro</span>
              </div>
              <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <div>Transações: <strong className="text-slate-700 dark:text-slate-300">{(data.finance || []).length}</strong></div>
                <div className="text-emerald-600 dark:text-emerald-400">Entradas: {formatCurrency(totalIncome)}</div>
                <div className="text-rose-600 dark:text-rose-400">Saídas: {formatCurrency(totalExpense)}</div>
                <div>Saldo: <strong className={balance >= 0 ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>{formatCurrency(balance)}</strong></div>
              </div>
            </div>

            {/* Tasks snapshot */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <CheckSquare size={14} className="text-indigo-500" />
                <span>Minhas Tarefas</span>
              </div>
              <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <div>Total de Tarefas: <strong className="text-slate-700 dark:text-slate-300">{totalTasks}</strong></div>
                <div className="text-emerald-600 dark:text-emerald-400">Concluídas: {completedTasks}</div>
                <div className="text-amber-600 dark:text-amber-400">Pendentes: {pendingTasks}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Rules Clarification */}
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-850 p-3.5 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle size={15} className="shrink-0" />
            <span>O que acontece ao confirmar:</span>
          </div>
          <ul className="space-y-1 text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
            <li>
              Os dados de <strong>{selectedMonth} {selectedYear}</strong> serão arquivados permanentemente na aba <strong>"Meses anteriores"</strong> para consulta e geração de PDF.
            </li>
            <li>
              Apenas o <strong>Controle Financeiro</strong> e <strong>Minhas Tarefas</strong> serão reiniciados vazios para começar o novo mês.
            </li>
            <li>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Todas as outras áreas (Igreja, Treino, Estudos, Quero Comprar, Notas, etc.) permanecerão 100% intactas!
              </span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            <Moon size={14} className="fill-amber-300 text-amber-300" />
            <span>Sim, finalizar mês</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
