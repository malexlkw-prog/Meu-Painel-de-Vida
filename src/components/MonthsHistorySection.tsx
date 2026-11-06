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
  HelpCircle,
  Zap,
  CheckCircle2,
  Play
} from 'lucide-react';
import { PainelData, ArchivedMonthData } from '../types';
import MonthFinalizeConfirmModal from './MonthFinalizeConfirmModal';
import MonthFinalizeAnimation from './MonthFinalizeAnimation';
import MonthDataViewerModal from './MonthDataViewerModal';
import { generateMonthPdf } from '../utils/monthPdfGenerator';
import { 
  checkShouldAutoFinalize, 
  getNextScheduledFinalizeDate, 
  buildArchivedMonthData, 
  PORTUGUESE_MONTHS 
} from '../utils/autoMonthFinalizer';

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
  const [testSuccessNotice, setTestSuccessNotice] = useState<string | null>(null);

  const archivedMonths: ArchivedMonthData[] = data.archivedMonths || [];

  const now = new Date();
  const autoStatus = checkShouldAutoFinalize(now, archivedMonths);
  const nextScheduledDate = getNextScheduledFinalizeDate(now);
  const nextFormatted = `${String(nextScheduledDate.getDate()).padStart(2, '0')}/${String(nextScheduledDate.getMonth() + 1).padStart(2, '0')}/${nextScheduledDate.getFullYear()} às 06:00`;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleConfirmFinalize = (monthName: string, year: number) => {
    setShowConfirmModal(false);

    const monthIndex = PORTUGUESE_MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    const validMonthIndex = monthIndex >= 0 ? monthIndex : now.getMonth();

    const newArchive = buildArchivedMonthData(
      monthName,
      year,
      validMonthIndex,
      data.finance || [],
      data.tasks || [],
      false
    );

    // Trigger animation
    setAnimatingMonth({ monthName, year });

    // Execute state update
    onFinalizeMonth(newArchive);
  };

  // Permite testar/simular o fechamento automático do mês atual/anterior imediatamente
  const handleSimulateAutoFinalize = () => {
    const currentMonthIndex = now.getMonth();
    const currentMonthName = PORTUGUESE_MONTHS[currentMonthIndex];
    const currentYear = now.getFullYear();

    const targetMonthName = currentMonthName;
    const targetYear = currentYear;

    const newArchive = buildArchivedMonthData(
      targetMonthName,
      targetYear,
      currentMonthIndex,
      data.finance || [],
      data.tasks || [],
      true
    );

    // Mark as auto-finalized
    const localKey = `lifehub_auto_finalized_${targetYear}_${currentMonthIndex}`;
    localStorage.setItem(localKey, 'true');

    // Trigger animation
    setAnimatingMonth({ monthName: targetMonthName, year: targetYear });

    // Execute state update
    onFinalizeMonth(newArchive);

    const nextMonthName = PORTUGUESE_MONTHS[(currentMonthIndex + 1) % 12];
    setTestSuccessNotice(`Fechamento automático executado com sucesso! Mês de ${targetMonthName}/${targetYear} arquivado e o painel iniciou ${nextMonthName}.`);
    setTimeout(() => setTestSuccessNotice(null), 6000);
  };

  const handleDownloadPdf = (archive: ArchivedMonthData) => {
    generateMonthPdf(archive, userName);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Test Success Feedback Notice */}
      {testSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>{testSuccessNotice}</span>
          </div>
          <button 
            onClick={() => setTestSuccessNotice(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. TOP PROMINENT CARD: ATUALIZAÇÃO E FECHAMENTO AUTOMÁTICO DE MÊS */}
      <div className="bg-gradient-to-br from-indigo-900/30 via-slate-900/50 to-slate-950 dark:from-indigo-950/50 dark:via-slate-900 dark:to-[#0f1423] border border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-indigo-400">
          <Moon size={200} />
        </div>

        <div className="max-w-3xl space-y-5 relative z-10">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Zap size={13} className="text-emerald-400" />
              <span>Fechamento Automático de Mês: ATIVADO</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold">
              <Clock size={12} className="text-indigo-400" />
              <span>Rotina diária às 06:00 do 1º dia</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Atualização Automática Mensal</span>
              <span className="text-amber-400">🌙</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Você <strong>não precisa mais lembrar de atualizar ou fechar o mês manualmente</strong>! Toda vez que terminar o mês, exatamente às <strong>06:00 da manhã do dia 1º</strong>, o sistema finaliza e arquiva automaticamente suas <strong>Finanças</strong> e suas <strong>Tarefas</strong> em seu histórico permanente, e já inicia o novo mês zerado e pronto para uso.
            </p>
          </div>

          {/* Schedule Status Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Próxima Execução Automática Programada
              </div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <Calendar size={15} className="text-indigo-400" />
                <span>{nextFormatted}</span>
                <span className="text-indigo-300 font-semibold text-xs">
                  (Finalização de Outubro e entrada em Novembro)
                </span>
              </div>
            </div>

            <div className="text-slate-400 text-[11px] sm:text-right">
              Mês ativo atual: <strong className="text-white font-black">{autoStatus.activeMonthName} {autoStatus.activeYear}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateAutoFinalize}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-5 py-3 rounded-2xl transition-all text-xs cursor-pointer shadow-md shadow-emerald-600/25 active:scale-95 group"
              title="Testar o fechamento automático agora"
            >
              <Zap size={15} className="text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Testar Fechamento Automático Agora</span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-4 py-3 rounded-2xl transition-all text-xs cursor-pointer border border-slate-700 active:scale-95"
            >
              <Moon size={15} className="text-amber-400" />
              <span>Finalizar Manualmente</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ÁREA: MESES ANTERIORES ARQUIVADOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Archive size={18} className="text-indigo-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Meses Anteriores Arquivados
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
                Ao término de cada mês (às 06:00 do dia 1º), os cartões dos meses anteriores aparecerão aqui automaticamente com acesso completo aos dados arquivados e geração de relatórios em PDF.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedMonths.map(archive => {
              const isAuto = (archive.finalizedAt || '').includes('Automático');
              return (
                <div
                  key={archive.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  {/* Card Top */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                            Fechamento Mensal
                          </span>
                          {isAuto && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ⚡ Automático às 06:00
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                          {archive.monthName} {archive.year}
                        </h4>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0">
                        <Clock size={11} />
                        <span>{archive.finalizedAtDate}</span>
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

                  {/* Card Actions */}
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
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      <MonthFinalizeConfirmModal
        data={data}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmFinalize}
      />

      <AnimatePresence>
        {animatingMonth && (
          <MonthFinalizeAnimation
            monthName={animatingMonth.monthName}
            year={animatingMonth.year}
            onComplete={() => setAnimatingMonth(null)}
          />
        )}
      </AnimatePresence>

      <MonthDataViewerModal
        archive={viewingArchive}
        onClose={() => setViewingArchive(null)}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
