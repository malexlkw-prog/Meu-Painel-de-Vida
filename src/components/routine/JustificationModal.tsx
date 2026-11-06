import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Clock, CheckCircle2, MessageSquare, Check, Sparkles } from 'lucide-react';
import { RoutineDayActivityExecution } from '../../types';

export type RoutineReasonCategory = 'feito' | 'cansado' | 'imprevisto' | 'ocupado' | 'nao_acordou' | 'outro';

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: RoutineDayActivityExecution | null;
  onConfirm: (activityId: string, reasonCategory: RoutineReasonCategory, justification: string) => void;
  onResetStatus?: (activityId: string) => void;
}

const REASONS: { 
  id: RoutineReasonCategory; 
  label: string; 
  icon: string; 
  description: string;
  isSuccess?: boolean;
}[] = [
  { 
    id: 'feito', 
    label: 'Feito (esqueci de apertar concluir)', 
    icon: '✅', 
    description: 'Realizei a atividade, mas esqueci de marcar a tempo. Conta na ofensiva e conclui!',
    isSuccess: true 
  },
  { 
    id: 'cansado', 
    label: 'Estava muito cansado', 
    icon: '😴', 
    description: 'Não tive energia ou disposição suficiente.' 
  },
  { 
    id: 'imprevisto', 
    label: 'Tive um imprevisto urgente', 
    icon: '⚡', 
    description: 'Compromisso inesperado ou emergência.' 
  },
  { 
    id: 'ocupado', 
    label: 'Estava ocupado / sem tempo', 
    icon: '⏳', 
    description: 'Outras prioridades ocuparam esse horário.' 
  },
  { 
    id: 'nao_acordou', 
    label: 'Não consegui acordar / atrasou', 
    icon: '⏰', 
    description: 'Acordei mais tarde ou perdi o horário.' 
  },
  { 
    id: 'outro', 
    label: 'Outro motivo particular', 
    icon: '📝', 
    description: 'Escreva detalhes abaixo.' 
  }
];

export default function JustificationModal({
  isOpen,
  onClose,
  activity,
  onConfirm,
  onResetStatus
}: JustificationModalProps) {
  const [selectedReason, setSelectedReason] = useState<RoutineReasonCategory>('feito');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (activity && isOpen) {
      if (activity.reasonCategory) {
        setSelectedReason(activity.reasonCategory as RoutineReasonCategory);
      } else {
        setSelectedReason('feito');
      }
      setNotes(activity.justification || '');
    }
  }, [activity, isOpen]);

  if (!isOpen || !activity) return null;

  const isFeito = selectedReason === 'feito';

  const handleSave = () => {
    const defaultText = isFeito 
      ? 'Feito (concluído no horário, registrado retroativamente)'
      : (REASONS.find(r => r.id === selectedReason)?.label || 'Não realizada');
    const text = notes.trim() || defaultText;
    onConfirm(activity.activityId, selectedReason, text);
    onClose();
  };

  const isAlreadyFailed = activity.status === 'failed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="apple-glass-card p-6 w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] space-y-5 text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className={`text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                isFeito ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
              }`}>
                {isFeito ? (
                  <>
                    <Sparkles size={14} className="text-emerald-500" />
                    <span>Conclusão Tardia • Salva como Concluída!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} />
                    <span>Registro de Imprevisto • Atividade Não Realizada</span>
                  </>
                )}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isFeito ? 'Concluiu e esqueceu de marcar?' : 'Justificar atividade'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFeito 
                  ? 'Escolha "Feito" para marcar a atividade como concluída e manter sua ofensiva.'
                  : 'A atividade permanecerá gravada no histórico com seu motivo de não realização.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Activity Info Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isFeito
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-850'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                isFeito 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              }`}>
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activity.name}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {activity.startTime} {activity.endTime ? `às ${activity.endTime}` : ''}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              isFeito 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
              {isFeito ? 'Marcar Feito' : (isAlreadyFailed ? 'Justificada' : 'Pendente')}
            </span>
          </div>

          {/* Reason Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selecione a situação:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-1">
              {REASONS.map((r) => {
                const isSelected = selectedReason === r.id;
                const isOptionSuccess = r.isSuccess;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`flex items-start justify-between p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? (isOptionSuccess
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-xs')
                        : (isOptionSuccess
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700')
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg leading-none mt-0.5">{r.icon}</span>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">
                          {r.label}
                        </span>
                        <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block mt-0.5">
                          {r.description}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={18} className={isOptionSuccess ? 'text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' : 'text-rose-500 shrink-0 mt-0.5'} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Justification Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-slate-400" />
              Observações adicionais (opcional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isFeito 
                ? 'Ex: Concluí tudo no horário normal, mas só pude abrir o aplicativo agora para marcar...'
                : 'Ex: Tive que atender um chamado urgente no trabalho, retorno amanhã normal...'}
              rows={2}
              className="w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {isAlreadyFailed && onResetStatus ? (
              <button
                type="button"
                onClick={() => {
                  onResetStatus(activity.activityId);
                  onClose();
                }}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
              >
                Desfazer e voltar a pendente
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
                type="button"
                onClick={handleSave}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isFeito
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                }`}
              >
                {isFeito ? <Check size={15} strokeWidth={2.5} /> : <CheckCircle2 size={14} />}
                <span>{isFeito ? 'Confirmar como Feito ✓' : 'Salvar Justificativa'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
