import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Flame,
  Check,
  Undo2,
  HelpCircle,
  PlayCircle,
  Lock,
  BookOpen,
  Calendar,
  ExternalLink,
  Tag
} from 'lucide-react';
import { 
  RoutineDayActivityExecution, 
  RoutineDayLog, 
  RoutineActivity,
  EnemScheduleDayConfig
} from '../../types';
import { getActivityTimeStatus, isActivityPastDue } from '../../utils/routineUtils';
import { 
  getSubjectMeta, 
  SATURDAY_FREE_STUDY_MODES, 
  DEFAULT_ENEM_SCHEDULE 
} from '../../data/enemScheduleData';
import EnemScheduleModal from './EnemScheduleModal';

interface RoutineTimelineViewProps {
  dayLog: RoutineDayLog;
  allRoutineActivities: RoutineActivity[];
  currentTime: Date;
  enemSchedule?: Record<number, EnemScheduleDayConfig>;
  onToggleComplete: (activityId: string) => void;
  onOpenJustifyModal: (activity: RoutineDayActivityExecution) => void;
  onOpenEditActivity?: (activityId: string) => void;
  onUpdateEnemSchedule?: (updated: Record<number, EnemScheduleDayConfig>) => void;
  onNavigateToStudies?: (subjectName?: string) => void;
  onSelectStudyMode?: (activityId: string, mode: string) => void;
}

export default function RoutineTimelineView({
  dayLog,
  allRoutineActivities,
  currentTime,
  enemSchedule = DEFAULT_ENEM_SCHEDULE,
  onToggleComplete,
  onOpenJustifyModal,
  onOpenEditActivity,
  onUpdateEnemSchedule,
  onNavigateToStudies,
  onSelectStudyMode
}: RoutineTimelineViewProps) {
  const [isEnemModalOpen, setIsEnemModalOpen] = useState(false);
  const activities = dayLog.activities || [];

  if (activities.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Clock size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Nenhuma atividade programada para este dia
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Edite sua rotina nas Configurações para definir quais dias da semana possuem atividades.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ENEM Schedule Interactive Top Banner */}
      <div className="p-4 sm:p-4.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-950/30 dark:to-purple-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
            <BookOpen size={20} />
          </div>
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Cronograma de Estudos do ENEM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                2 blocos diários
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bloco 1 (15:15–16:15) &bull; Bloco 2 (21:30–22:30) &bull; Matérias semanais integradas aos Estudos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => setIsEnemModalOpen(true)}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 rounded-2xl text-xs font-bold transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
          >
            <Calendar size={13} />
            <span>Ver Grade Semanal</span>
          </button>

          {onNavigateToStudies && (
            <button
              type="button"
              onClick={() => onNavigateToStudies()}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Aba Estudos</span>
              <span className="sm:hidden">Estudos</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.map((act, index) => {
          const isPastDue = isActivityPastDue(dayLog.date, act, currentTime);
          const timeStatus = getActivityTimeStatus(act.startTime, act.endTime, currentTime, act.durationMinutes);
          const isCompleted = act.status === 'completed';
          const isFailed = act.status === 'failed';
          const isCurrent = timeStatus === 'current' && !isCompleted && !isFailed;

          const isStudyBlock = !!act.studyBlock || act.startTime === '15:15' || act.startTime === '21:30';
          const studyMeta = act.studySubject ? getSubjectMeta(act.studySubject) : null;
          const isFreeStudy = act.studySubject === 'Estudo livre' || act.name.toLowerCase().includes('estudo livre');

          // Status Badge styling
          let statusBadge = (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Pendente
            </span>
          );

          if (isCompleted) {
            statusBadge = (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
                <Check size={11} /> Concluída {act.completedAt ? `às ${act.completedAt}` : ''}
              </span>
            );
          } else if (isFailed) {
            statusBadge = (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono flex items-center gap-1">
                <AlertCircle size={11} /> Não realizada (Justificada)
              </span>
            );
          } else if (isCurrent) {
            statusBadge = (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-mono flex items-center gap-1 shadow-xs animate-pulse">
                <PlayCircle size={11} /> Em andamento agora
              </span>
            );
          } else if (isPastDue) {
            statusBadge = (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-mono flex items-center gap-1">
                <Clock size={11} /> Horário expirado
              </span>
            );
          }

          return (
            <motion.div
              key={act.activityId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative group"
            >
              {/* Timeline Bullet Node */}
              <div 
                className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 -translate-x-1/2 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                    : isFailed
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 animate-pulse'
                    : isPastDue
                    ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                    : isStudyBlock
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-400 dark:border-indigo-600 text-indigo-500'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check size={13} strokeWidth={3} />
                ) : isFailed ? (
                  <span className="text-xs font-bold leading-none">✕</span>
                ) : isPastDue ? (
                  <Clock size={12} strokeWidth={2.5} />
                ) : isStudyBlock ? (
                  <BookOpen size={11} />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-slate-400'}`} />
                )}
              </div>

              {/* Activity Card */}
              <div
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 backdrop-blur-xl ${
                  isCompleted
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/25 border-emerald-500/25 hover:border-emerald-500/40 shadow-xs'
                    : isFailed
                    ? 'bg-rose-500/10 dark:bg-rose-950/25 border-rose-500/25 hover:border-rose-500/40'
                    : isCurrent
                    ? 'apple-glass-card border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                    : isPastDue
                    ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 shadow-xs'
                    : isStudyBlock
                    ? 'bg-indigo-500/5 dark:bg-indigo-950/20 border-indigo-300/40 dark:border-indigo-700/30 hover:border-indigo-400/60 shadow-xs'
                    : 'apple-glass-card shadow-xs hover:border-white/90 dark:hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Time and Title */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                        <Clock size={12} className="text-indigo-500" />
                        {act.startTime} {act.endTime ? `– ${act.endTime}` : ''}
                      </span>

                      {act.durationMinutes && (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                          {act.durationMinutes} min
                        </span>
                      )}

                      {/* Study Subject Badge */}
                      {act.studySubject && studyMeta && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider font-mono ${studyMeta.textClass} ${studyMeta.bgClass} ${studyMeta.borderClass}`}>
                          <span>📚</span>
                          <span>{act.studySubject}</span>
                          {act.studyBlock && (
                            <span className="opacity-75">• Bloco {act.studyBlock}</span>
                          )}
                        </span>
                      )}

                      {statusBadge}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <h4 
                        onClick={() => {
                          if (!isPastDue) {
                            onOpenEditActivity?.(act.activityId);
                          }
                        }}
                        className={`text-base font-bold tracking-tight transition-colors ${
                          !isPastDue ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400' : ''
                        } ${
                          isCompleted
                            ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85'
                            : isFailed
                            ? 'text-rose-900 dark:text-rose-200'
                            : isPastDue
                            ? 'text-amber-950 dark:text-amber-200'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {act.name}
                      </h4>

                      {/* Link to Studies for study activities */}
                      {isStudyBlock && onNavigateToStudies && (
                        <button
                          type="button"
                          onClick={() => onNavigateToStudies(act.studySubject)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 shadow-3xs"
                          title="Acessar currículo e matérias na aba Estudos"
                        >
                          <BookOpen size={12} />
                          <span>Acessar Estudos</span>
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>

                    {/* Saturday Free Study Modal Selector */}
                    {isFreeStudy && (
                      <div className="pt-1.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <Tag size={12} className="text-violet-500" />
                          <span>Escolha o foco do estudo livre de hoje:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {SATURDAY_FREE_STUDY_MODES.map((mode) => {
                            const isSelected = act.studyMode === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                disabled={isPastDue && isCompleted}
                                onClick={() => onSelectStudyMode?.(act.activityId, mode)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs ${
                                  isSelected
                                    ? 'bg-violet-600 text-white shadow-xs scale-102 ring-2 ring-violet-500/20'
                                    : 'bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {isSelected ? `✓ ${mode}` : mode}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Notice if past due and not yet justified */}
                    {isPastDue && !isCompleted && !isFailed && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                        <AlertCircle size={13} className="shrink-0 text-amber-500" />
                        <span>O horário desta atividade já encerrou. Só é possível registrar uma justificativa.</span>
                      </p>
                    )}

                    {/* Isolation reminder for study activity */}
                    {isStudyBlock && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        * A conclusão deste bloco é registrada na Rotina e não altera o progresso de tópicos dos Estudos.
                      </p>
                    )}

                    {/* Justification note if failed */}
                    {isFailed && act.justification && (
                      <div className="p-2.5 bg-rose-100/60 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                        <div className="min-w-0">
                          <span className="font-bold">Motivo registrado: </span>
                          <span>{act.justification}</span>
                        </div>
                      </div>
                    )}

                    {/* Justification note if marked completed via Feito */}
                    {isCompleted && act.reasonCategory === 'feito' && (
                      <div className="p-2.5 bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                        <div className="min-w-0">
                          <span className="font-bold">Confirmado como Feito: </span>
                          <span>{act.justification || 'Concluído no horário, registrado retroativamente.'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Caso 1: Já está concluída */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5">
                        <span className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Concluída ✓</span>
                        </span>
                        {/* Se o horário ainda não passou, permite desfazer; se passou, fica permanentemente gravada */}
                        {!isPastDue ? (
                          <button
                            type="button"
                            onClick={() => onToggleComplete(act.activityId)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Desmarcar e voltar para pendente"
                          >
                            <Undo2 size={15} />
                          </button>
                        ) : act.reasonCategory === 'feito' ? (
                          <button
                            type="button"
                            onClick={() => onOpenJustifyModal(act)}
                            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-xs font-semibold"
                            title="Ver ou editar justificativa de Feito"
                          >
                            Editar
                          </button>
                        ) : null}
                      </div>
                    ) : isPastDue ? (
                      /* Caso 2: HORÁRIO JÁ PASSOU e não concluiu -> NÃO pode marcar feito, SÓ PODE JUSTIFICAR */
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenJustifyModal(act)}
                          className="px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs bg-amber-500 hover:bg-amber-600 text-white"
                          title="Horário expirado. Registre a justificativa da atividade."
                        >
                          <AlertCircle size={14} />
                          <span>{isFailed ? 'Editar justificativa' : 'Dar justificativa'}</span>
                        </button>
                      </div>
                    ) : (
                      /* Caso 3: Horário atual ou futuro -> pode marcar como feito ou justificar antecipadamente */
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleComplete(act.activityId)}
                          className="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/20"
                          title="Marcar atividade como feita"
                        >
                          <CheckCircle2 size={15} />
                          <span>Marcar como feito</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenJustifyModal(act)}
                          className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isFailed
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Registrar imprevisto ou motivo de não realização"
                        >
                          <AlertCircle size={14} className={isFailed ? 'text-rose-500' : 'text-slate-400'} />
                          <span className="hidden sm:inline">{isFailed ? 'Editar motivo' : 'Não consegui fazer'}</span>
                          <span className="sm:hidden">{isFailed ? 'Motivo' : 'Não fiz'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for viewing & customizing ENEM Weekly Schedule */}
      <EnemScheduleModal
        isOpen={isEnemModalOpen}
        onClose={() => setIsEnemModalOpen(false)}
        enemSchedule={enemSchedule}
        onUpdateSchedule={(updated) => onUpdateEnemSchedule?.(updated)}
        onNavigateToStudies={onNavigateToStudies}
      />
    </div>
  );
}
