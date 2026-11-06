import { EnemScheduleDayConfig } from '../types';

export const DEFAULT_ENEM_SCHEDULE: Record<number, EnemScheduleDayConfig> = {
  1: { dayName: 'Segunda-feira', block1Subject: 'Matemática', block2Subject: 'Português' },
  2: { dayName: 'Terça-feira', block1Subject: 'Biologia', block2Subject: 'Química' },
  3: { dayName: 'Quarta-feira', block1Subject: 'História', block2Subject: 'Geografia' },
  4: { dayName: 'Quinta-feira', block1Subject: 'Física', block2Subject: 'Filosofia e Sociologia' },
  5: { dayName: 'Sexta-feira', block1Subject: 'Redação', block2Subject: 'Matemática' },
  6: { dayName: 'Sábado', block1Subject: 'Português', block2Subject: 'Estudo livre' },
  0: { dayName: 'Domingo', block1Subject: 'Revisão / Descanso', block2Subject: 'Planejamento da Semana' }
};

export const SATURDAY_FREE_STUDY_MODES = [
  'Revisão',
  'Exercícios',
  'Redação',
  'Simulados',
  'Conteúdos atrasados'
];

export const SUBJECT_METADATA: Record<string, { color: string; bgClass: string; textClass: string; borderClass: string; icon: string }> = {
  'Matemática': {
    color: 'emerald',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-300/60 dark:border-emerald-800',
    icon: 'Calculator'
  },
  'Português': {
    color: 'indigo',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    textClass: 'text-indigo-700 dark:text-indigo-300',
    borderClass: 'border-indigo-300/60 dark:border-indigo-800',
    icon: 'BookOpen'
  },
  'Biologia': {
    color: 'teal',
    bgClass: 'bg-teal-50 dark:bg-teal-950/40',
    textClass: 'text-teal-700 dark:text-teal-300',
    borderClass: 'border-teal-300/60 dark:border-teal-800',
    icon: 'Dna'
  },
  'Química': {
    color: 'cyan',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/40',
    textClass: 'text-cyan-700 dark:text-cyan-300',
    borderClass: 'border-cyan-300/60 dark:border-cyan-800',
    icon: 'FlaskConical'
  },
  'História': {
    color: 'amber',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    textClass: 'text-amber-700 dark:text-amber-300',
    borderClass: 'border-amber-300/60 dark:border-amber-800',
    icon: 'Landmark'
  },
  'Geografia': {
    color: 'blue',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    textClass: 'text-blue-700 dark:text-blue-300',
    borderClass: 'border-blue-300/60 dark:border-blue-800',
    icon: 'Globe'
  },
  'Física': {
    color: 'orange',
    bgClass: 'bg-orange-50 dark:bg-orange-950/40',
    textClass: 'text-orange-700 dark:text-orange-300',
    borderClass: 'border-orange-300/60 dark:border-orange-800',
    icon: 'Zap'
  },
  'Filosofia e Sociologia': {
    color: 'purple',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    textClass: 'text-purple-700 dark:text-purple-300',
    borderClass: 'border-purple-300/60 dark:border-purple-800',
    icon: 'Compass'
  },
  'Redação': {
    color: 'rose',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    textClass: 'text-rose-700 dark:text-rose-300',
    borderClass: 'border-rose-300/60 dark:border-rose-800',
    icon: 'PenTool'
  },
  'Estudo livre': {
    color: 'violet',
    bgClass: 'bg-violet-50 dark:bg-violet-950/40',
    textClass: 'text-violet-700 dark:text-violet-300',
    borderClass: 'border-violet-300/60 dark:border-violet-800',
    icon: 'Sparkles'
  }
};

/**
 * Retorna a matéria do ENEM para o bloco e dia da semana especificados
 */
export const getEnemSubjectForDay = (
  dayOfWeek: number,
  block: 1 | 2,
  customSchedule?: Record<number, EnemScheduleDayConfig>
): string => {
  const schedule = customSchedule && customSchedule[dayOfWeek] ? customSchedule[dayOfWeek] : DEFAULT_ENEM_SCHEDULE[dayOfWeek];
  if (!schedule) {
    return block === 1 ? 'Estudo ENEM (Bloco 1)' : 'Estudo ENEM (Bloco 2)';
  }
  return block === 1 ? schedule.block1Subject : schedule.block2Subject;
};

/**
 * Retorna os metadados visuais de uma matéria
 */
export const getSubjectMeta = (subjectName: string) => {
  const clean = subjectName?.trim() || '';
  if (SUBJECT_METADATA[clean]) {
    return SUBJECT_METADATA[clean];
  }
  // Fallback case-insensitive
  const foundKey = Object.keys(SUBJECT_METADATA).find(k => k.toLowerCase() === clean.toLowerCase());
  if (foundKey) {
    return SUBJECT_METADATA[foundKey];
  }
  return {
    color: 'indigo',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
    textClass: 'text-indigo-700 dark:text-indigo-300',
    borderClass: 'border-indigo-300/60 dark:border-indigo-800',
    icon: 'BookOpen'
  };
};
