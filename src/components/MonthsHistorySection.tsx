import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Moon, 
  Download, 
  Eye, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Archive,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle
} from 'lucide-react';
import { PainelData, ArchivedMonthData } from '../types';
import MonthFinalizeConfirmModal from './MonthFinalizeConfirmModal';
import MonthFinalizeAnimation from './MonthFinalizeAnimation';
import MonthDataViewerModal from './MonthDataViewerModal';
import { generateMonthPdf } from '../utils/monthPdfGenerator';

interface MonthsHistorySectionProps {
  data: PainelData;
  onFinalizeMonth: (archivedMonth: ArchivedMonthData) => void;
  userName?: string;
}

export default function MonthsHistorySection({
  data,
  onFinalizeMonth,
  userName = 'Usuário'
}: MonthsHistorySectionProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [animatingMonth, setAnimatingMonth] = useState<{ monthName: string; year: number } | null>(null);
  const [viewingArchive, setViewingArchive] = useState<ArchivedMonthData | null>(null);

  const archivedMonths: ArchivedMonthData[] = data.archivedMonths || [];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleConfirmFinalize = (monthName: string, year: number) => {
    setShowConfirmModal(false);

    // Calculate summary
    const finance = [...(data.finance || [])];
    const tasks = [...(data.tasks || [])];

    const totalIncome = finance
      .filter(f => f.type === 'income')
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const totalExpense = finance
      .filter(f => f.type === 'expense')
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const balance = totalIncome - totalExpense;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const now = new Date();
    const finalizedAtDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const finalizedAt = `${finalizedAtDate} às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newArchive: ArchivedMonthData = {
      id: `${year}-${monthName.toLowerCase()}-${Date.now()}`,
      monthName,
      year,
      monthIndex: now.getMonth(),
      finalizedAt,
      finalizedAtDate,
      finance,
      tasks,
      summary: {
        totalIncome,
        totalExpense,
        balance,
        totalTasks,
        completedTasks,
        pendingTasks
      }
    };

    // Trigger animation
    setAnimatingMonth({ monthName, year });

    // Execute state update
    onFinalizeMonth(newArchive);
  };

  const handleDownloadPdf = (archive: ArchivedMonthData) => {
    generateMonthPdf(archive, userName);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP PROMINENT CARD: FINALIZAR MÊS */}
      <div className="bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-slate-900/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-[#111726] border border-indigo-500/30 rounded-3xl p-6 md:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-indigo-400">
          <Moon size={180} />
        </div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
            <Calendar size={13} />
            <span>Fechamento & Transição de Ciclo</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Finalizar Mês</span>
              <span className="text-amber-500">🌙</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Encerre o ciclo mensal atual com tranquilidade. Ao finalizar, o sistema arquiva automaticamente seu 
              <strong> Controle Financeiro</strong> e suas <strong>Minhas Tarefas</strong> em um histórico permanente, 
              zerando apenas essas duas listas para você começar o novo mês renovado. Todas as outras áreas do seu painel 
              permanecem intactas!
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-2xl transition-all text-xs cursor-pointer shadow-md shadow-indigo-600/25 active:scale-95 group"
            >
              <Moon size={16} className="text-amber-300 fill-amber-300/40 group-hover:rotate-12 transition-transform" />
              <span>Finalizar mês</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              • Acesso seguro aos dados e geração de PDF a qualquer momento
            </span>
          </div>
        </div>
      </div>

      {/* 2. ÁREA: MESES ANTERIORES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Archive size={18} className="text-indigo-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Meses anteriores
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {archivedMonths.length} {archivedMonths.length === 1 ? 'mês arquivado' : 'meses arquivados'}
            </span>
          </div>
        </div>

        {archivedMonths.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-500 mx-auto">
              <Archive size={26} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Nenhum mês arquivado ainda
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Quando você clicar no botão <strong>"Finalizar mês"</strong> ao término de cada período, os cartões dos meses anteriores aparecerão aqui com acesso rápido aos dados e download de PDF.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedMonths.map(archive => (
              <div
                key={archive.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block font-mono">
                        Fechamento Mensal
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {archive.monthName} {archive.year}
                      </h4>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      <Clock size={11} />
                      <span>Finalizado em {archive.finalizedAtDate}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Financial summary pill */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                        <DollarSign size={12} className="text-emerald-500" />
                        <span>Controle financeiro</span>
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="text-slate-500 dark:text-slate-400">
                          Saldo: <strong className={archive.summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                            {formatCurrency(archive.summary.balance)}
                          </strong>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {archive.finance.length} transações
                        </div>
                      </div>
                    </div>

                    {/* Tasks summary pill */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                        <CheckSquare size={12} className="text-indigo-500" />
                        <span>Minhas tarefas</span>
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="text-slate-500 dark:text-slate-400">
                          Concluídas: <strong className="text-indigo-600 dark:text-indigo-400">{archive.summary.completedTasks}</strong> de {archive.summary.totalTasks}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {archive.summary.totalTasks > 0 ? `${Math.round((archive.summary.completedTasks / archive.summary.totalTasks) * 100)}% de taxa` : 'Sem tarefas'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions: 2 required buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setViewingArchive(archive)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-all cursor-pointer active:scale-95"
                  >
                    <Eye size={14} className="text-indigo-500" />
                    <span>👁️ Acessar dados</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(archive)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 transition-all cursor-pointer active:scale-95"
                  >
                    <FileText size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>📄 Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <MonthFinalizeConfirmModal
        data={data}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmFinalize}
      />

      {/* Animation Modal */}
      <AnimatePresence>
        {animatingMonth && (
          <MonthFinalizeAnimation
            monthName={animatingMonth.monthName}
            year={animatingMonth.year}
            onComplete={() => setAnimatingMonth(null)}
          />
        )}
      </AnimatePresence>

      {/* Data Viewer Modal */}
      <AnimatePresence>
        {viewingArchive && (
          <MonthDataViewerModal
            archive={viewingArchive}
            onClose={() => setViewingArchive(null)}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
