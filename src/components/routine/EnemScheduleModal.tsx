import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Clock, 
  Sparkles, 
  Edit3, 
  Check, 
  RotateCcw,
  ExternalLink,
  Info
} from 'lucide-react';
import { EnemScheduleDayConfig } from '../../types';
import { 
  DEFAULT_ENEM_SCHEDULE, 
  SUBJECT_METADATA, 
  SATURDAY_FREE_STUDY_MODES,
  getSubjectMeta 
} from '../../data/enemScheduleData';

interface EnemScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  enemSchedule: Record<number, EnemScheduleDayConfig>;
  onUpdateSchedule: (updated: Record<number, EnemScheduleDayConfig>) => void;
  onNavigateToStudies?: (subjectName?: string) => void;
}

const DAYS_LIST = [
  { day: 1, label: 'Segunda-feira' },
  { day: 2, label: 'Terça-feira' },
  { day: 3, label: 'Quarta-feira' },
  { day: 4, label: 'Quinta-feira' },
  { day: 5, label: 'Sexta-feira' },
  { day: 6, label: 'Sábado' }
];

const AVAILABLE_SUBJECTS = [
  'Matemática',
  'Português',
  'Biologia',
  'Química',
  'História',
  'Geografia',
  'Física',
  'Filosofia e Sociologia',
  'Redação',
  'Estudo livre'
];

export default function EnemScheduleModal({
  isOpen,
  onClose,
  enemSchedule,
  onUpdateSchedule,
  onNavigateToStudies
}: EnemScheduleModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState<Record<number, EnemScheduleDayConfig>>(() => enemSchedule || DEFAULT_ENEM_SCHEDULE);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSchedule(draftSchedule);
    setIsEditing(false);
  };

  const handleResetDefault = () => {
    setDraftSchedule(DEFAULT_ENEM_SCHEDULE);
  };

  const handleChangeSubject = (day: number, block: 'block1Subject' | 'block2Subject', value: string) => {
    setDraftSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [block]: value
      }
    }));
  };

  const activeSchedule = isEditing ? draftSchedule : (enemSchedule || DEFAULT_ENEM_SCHEDULE);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-violet-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Cronograma de Estudos do ENEM</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    2027
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribuição semanal dos blocos diários de estudo sincronizados à rotina
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info Banner */}
          <div className="px-5 sm:px-6 py-3 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2">
              <Info size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>
                <strong>Isolamento seguro:</strong> Alterações afetam apenas os próximos dias e novos registros, sem apagar o histórico passado.
              </span>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setDraftSchedule(enemSchedule || DEFAULT_ENEM_SCHEDULE);
                  setIsEditing(true);
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-3xs"
              >
                <Edit3 size={13} />
                <span>Personalizar Grade</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Padrão</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check size={13} />
                  <span>Salvar Grade</span>
                </button>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-3.5 sm:px-4 font-bold">Dia da Semana</th>
                    <th className="p-3.5 sm:px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      Bloco 1 • 15:15 – 16:15
                    </th>
                    <th className="p-3.5 sm:px-4 font-bold text-violet-600 dark:text-violet-400">
                      Bloco 2 • 21:30 – 22:30
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {DAYS_LIST.map(({ day, label }) => {
                    const dayConfig = activeSchedule[day] || DEFAULT_ENEM_SCHEDULE[day];
                    const meta1 = getSubjectMeta(dayConfig.block1Subject);
                    const meta2 = getSubjectMeta(dayConfig.block2Subject);

                    return (
                      <tr 
                        key={day}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors"
                      >
                        <td className="p-3.5 sm:px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {label}
                        </td>

                        {/* Bloco 1 */}
                        <td className="p-3.5 sm:px-4">
                          {isEditing ? (
                            <select
                              value={dayConfig.block1Subject}
                              onChange={(e) => handleChangeSubject(day, 'block1Subject', e.target.value)}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                              {AVAILABLE_SUBJECTS.map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${meta1.textClass} ${meta1.bgClass} ${meta1.borderClass}`}>
                                <span>📚</span>
                                <span>{dayConfig.block1Subject}</span>
                              </span>
                              {onNavigateToStudies && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onNavigateToStudies(dayConfig.block1Subject);
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-lg transition-colors cursor-pointer"
                                  title={`Ver currículo de ${dayConfig.block1Subject} nos Estudos`}
                                >
                                  <ExternalLink size={13} />
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Bloco 2 */}
                        <td className="p-3.5 sm:px-4">
                          {isEditing ? (
                            <select
                              value={dayConfig.block2Subject}
                              onChange={(e) => handleChangeSubject(day, 'block2Subject', e.target.value)}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                              {AVAILABLE_SUBJECTS.map(subj => (
                                <option key={subj} value={subj}>{subj}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${meta2.textClass} ${meta2.bgClass} ${meta2.borderClass}`}>
                                  <span>📖</span>
                                  <span>{dayConfig.block2Subject}</span>
                                </span>
                                {onNavigateToStudies && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onNavigateToStudies(dayConfig.block2Subject);
                                    }}
                                    className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 p-1 rounded-lg transition-colors cursor-pointer"
                                    title={`Ver currículo de ${dayConfig.block2Subject} nos Estudos`}
                                  >
                                    <ExternalLink size={13} />
                                  </button>
                                )}
                              </div>
                              {day === 6 && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-1">
                                  Opções: Revisão, Exercícios, Redação, Simulados, Atrasados
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Saturday free study modalities card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <Sparkles size={14} className="text-amber-500" />
                <span>Sábado à noite • Modalidades do Estudo Livre</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                No sábado das 21:30 às 22:30, a aba Rotina permite selecionar com 1 clique a modalidade desejada para o bloco:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SATURDAY_FREE_STUDY_MODES.map((mode) => (
                  <span
                    key={mode}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 font-bold text-[11px] text-amber-800 dark:text-amber-300 shadow-3xs"
                  >
                    ✓ {mode}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Rotina & Estudos integrados
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
