import { 
  RoutineActivity, 
  RoutineDayActivityExecution, 
  RoutineDayLog, 
  RoutineState, 
  RoutineStreak 
} from '../types';
import { getEnemSubjectForDay } from '../data/enemScheduleData';

/**
 * Retorna a data no formato ISO YYYY-MM-DD local
 */
export const formatDateToISO = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converte string "HH:MM" em minutos desde o início do dia para comparação
 */
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
};

/**
 * Formata minutos em string HH:MM
 */
export const minutesToTime = (totalMinutes: number): string => {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Retorna o nome do dia da semana em português
 */
export const getPortugueseWeekday = (date: Date = new Date()): string => {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  return days[date.getDay()];
};

/**
 * Retorna a data por extenso formatada
 */
export const getPortugueseDateFormatted = (date: Date = new Date()): string => {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Recalcula métricas de um dia de registro
 */
export const recalculateLogMetrics = (log: RoutineDayLog): RoutineDayLog => {
  const totalScheduled = log.activities.length;
  const totalCompleted = log.activities.filter(a => a.status === 'completed').length;
  const totalFailed = log.activities.filter(a => a.status === 'failed').length;
  const completionPercent = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;
  const isDayComplete = totalScheduled > 0 && totalCompleted === totalScheduled;

  return {
    ...log,
    totalScheduled,
    totalCompleted,
    totalFailed,
    completionPercent,
    isDayComplete,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Obtém ou cria o log diário da rotina sem sobrescrever histórico prévio
 */
export const getOrCreateDayLog = (
  dateStr: string,
  routine: RoutineState
): { log: RoutineDayLog; isNew: boolean; updatedRoutine: RoutineState } => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const dayOfWeek = targetDate.getDay();

  const existingIndex = routine.history.findIndex(h => h.date === dateStr);
  if (existingIndex >= 0) {
    const existing = routine.history[existingIndex];
    // Atualização não destrutiva para adicionar matéria do ENEM caso ainda não esteja preenchida
    let modified = false;
    const patchedActivities = existing.activities.map(act => {
      let block = act.studyBlock;
      if (!block) {
        if (act.startTime === '15:15') block = 1;
        else if (act.startTime === '21:30') block = 2;
      }
      if (block) {
        const subject = getEnemSubjectForDay(dayOfWeek, block, routine.enemSchedule);
        if (!act.studySubject || !act.studyBlock) {
          modified = true;
          return {
            ...act,
            studyBlock: block,
            studySubject: act.studySubject || subject,
            name: act.name.includes('(') ? act.name : `Estudo ENEM — ${subject}`
          };
        }
      }
      return act;
    });

    if (modified) {
      const updatedLog = { ...existing, activities: patchedActivities };
      const updatedHistory = [...routine.history];
      updatedHistory[existingIndex] = updatedLog;
      return {
        log: updatedLog,
        isNew: false,
        updatedRoutine: { ...routine, history: updatedHistory }
      };
    }

    return {
      log: existing,
      isNew: false,
      updatedRoutine: routine
    };
  }

  // Filtra atividades programadas para este dia da semana
  const scheduledActivities = (routine.activities || [])
    .filter(a => a.active && a.daysOfWeek.includes(dayOfWeek))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime) || a.order - b.order);

  const initialExecutions: RoutineDayActivityExecution[] = scheduledActivities.map(a => {
    let name = a.name;
    let studySubject: string | undefined = undefined;
    let studyBlock: 1 | 2 | undefined = a.studyBlock;

    if (!studyBlock) {
      if (a.startTime === '15:15') studyBlock = 1;
      else if (a.startTime === '21:30') studyBlock = 2;
    }

    if (studyBlock) {
      studySubject = getEnemSubjectForDay(dayOfWeek, studyBlock, routine.enemSchedule);
      if (studySubject) {
        name = `Estudo ENEM — ${studySubject}`;
      }
    }

    return {
      activityId: a.id,
      name,
      startTime: a.startTime,
      endTime: a.endTime,
      durationMinutes: a.durationMinutes,
      status: 'pending',
      studyBlock,
      studySubject
    };
  });

  const newLog: RoutineDayLog = {
    id: dateStr,
    date: dateStr,
    activities: initialExecutions,
    totalScheduled: initialExecutions.length,
    totalCompleted: 0,
    totalFailed: 0,
    completionPercent: 0,
    isDayComplete: false,
    updatedAt: new Date().toISOString()
  };

  const updatedRoutine: RoutineState = {
    ...routine,
    history: [newLog, ...routine.history]
  };

  return {
    log: newLog,
    isNew: true,
    updatedRoutine
  };
};

/**
 * Determina o status temporal de uma atividade: 'past' | 'current' | 'upcoming'
 */
export const getActivityTimeStatus = (
  startTime: string,
  endTime?: string,
  now: Date = new Date(),
  durationMinutes?: number
): 'past' | 'current' | 'upcoming' => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(startTime);
  const defaultDuration = durationMinutes && durationMinutes > 0 ? durationMinutes : 45;
  const endMin = endTime ? timeToMinutes(endTime) : startMin + defaultDuration;

  if (currentMinutes < startMin) {
    return 'upcoming';
  }

  // Se o horário de término passa da meia-noite (ex: 23:00 - 06:00)
  if (endMin < startMin) {
    if (currentMinutes >= startMin || currentMinutes < endMin) {
      return 'current';
    }
  } else {
    if (currentMinutes >= startMin && currentMinutes < endMin) {
      return 'current';
    }
  }

  return 'past';
};

/**
 * Verifica se uma atividade já passou do seu horário programado.
 * Retorna true se:
 * 1. A data fornecida for anterior a hoje (data passada no histórico).
 * 2. Na data de hoje, o horário atual já ultrapassou o término da atividade.
 * Atividades que já passaram não podem ser marcadas como concluídas retroativamente,
 * permitindo apenas o registro de justificativa.
 */
export const isActivityPastDue = (
  dateStr: string,
  activity: { startTime: string; endTime?: string; durationMinutes?: number },
  now: Date = new Date()
): boolean => {
  const todayStr = formatDateToISO(now);
  if (dateStr < todayStr) {
    return true;
  }
  if (dateStr > todayStr) {
    return false;
  }

  return getActivityTimeStatus(activity.startTime, activity.endTime, now, activity.durationMinutes) === 'past';
};

/**
 * Encontra a atividade atual e a próxima atividade do dia
 */
export const getCurrentAndNextActivity = (
  activities: RoutineDayActivityExecution[],
  now: Date = new Date()
): {
  current: RoutineDayActivityExecution | null;
  next: RoutineDayActivityExecution | null;
} => {
  if (!activities || activities.length === 0) {
    return { current: null, next: null };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let current: RoutineDayActivityExecution | null = null;
  let next: RoutineDayActivityExecution | null = null;

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    const sMin = timeToMinutes(act.startTime);
    const eMin = act.endTime ? timeToMinutes(act.endTime) : sMin + 30;

    const isCurrent = (eMin < sMin)
      ? (currentMinutes >= sMin || currentMinutes < eMin)
      : (currentMinutes >= sMin && currentMinutes < eMin);

    if (isCurrent && !current) {
      current = act;
      // Próxima é a seguinte
      next = activities[i + 1] || null;
      break;
    }

    if (currentMinutes < sMin && !next) {
      next = act;
      break;
    }
  }

  // Se não há atividade em andamento no horário exato, mas encontramos a próxima
  if (!current && next) {
    // Current permanece null, next é a próxima atividade
  } else if (!current && !next && activities.length > 0) {
    // Se o dia já acabou ou passou de tudo, próxima é a primeira do dia
    next = activities[0];
  }

  return { current, next };
};

/**
 * Calcula a sequência de ofensiva (Streak)
 * Regras:
 * - Um dia conta como completo quando 100% das atividades programadas foram concluídas.
 * - Dias no passado com atividades incompletas quebram a ofensiva.
 * - Dias passados sem atividades programadas são desconsiderados e NÃO quebram a ofensiva.
 * - Dias futuros não são considerados falhas.
 * - O dia de hoje se concluído adiciona +1; se em andamento, não interrompe ainda.
 */
export const calculateRoutineStreak = (
  history: RoutineDayLog[],
  activeDays: number[] = [0, 1, 2, 3, 4, 5, 6]
): RoutineStreak & { motivationalMessage: string } => {
  if (!history || history.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      motivationalMessage: 'Comece sua jornada de foco e disciplina hoje!'
    };
  }

  const todayStr = formatDateToISO(new Date());
  const map = new Map<string, RoutineDayLog>();
  history.forEach(h => map.set(h.date, h));

  // Ordena datas únicas
  const allDates = Array.from(map.keys()).sort();

  // Calcula melhor sequência histórica
  let bestStreak = 0;
  let tempStreak = 0;

  for (const dateStr of allDates) {
    const log = map.get(dateStr);
    if (!log || log.totalScheduled === 0) continue;

    if (log.isDayComplete) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calcula sequência atual retroativamente a partir de hoje / ontem
  let currentStreak = 0;
  const todayLog = map.get(todayStr);

  const checkDate = new Date();
  if (todayLog && todayLog.isDayComplete) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Hoje ainda não terminou, começa verificando de ontem para trás
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Percorre até 365 dias para trás
  for (let i = 0; i < 365; i++) {
    const dateStr = formatDateToISO(checkDate);
    const log = map.get(dateStr);

    if (log) {
      if (log.totalScheduled === 0) {
        // Dia sem tarefas não quebra streak, pula
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      if (log.isDayComplete) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Dia incompleto quebrou a sequência
        break;
      }
    } else {
      // Se não há log cadastrado e o dia era programado, streak interrompida
      const dayOfWeek = checkDate.getDay();
      if (activeDays.includes(dayOfWeek)) {
        break;
      } else {
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  // Mensagem motivacional
  let motivationalMessage = 'Mantenha o foco em cada passo do seu dia!';
  if (todayLog && todayLog.isDayComplete) {
    motivationalMessage = '🎉 Incrível! Você completou 100% da sua rotina hoje! Ofensiva mantida!';
  } else if (currentStreak >= 30) {
    motivationalMessage = '👑 Nível Lendário! Mais de um mês de disciplina implacável!';
  } else if (currentStreak >= 14) {
    motivationalMessage = '⚡ Duas semanas perfeitas! Seu compromisso é inspirador!';
  } else if (currentStreak >= 7) {
    motivationalMessage = '🔥 Você está pegando fogo! Uma semana inteira sem falhas!';
  } else if (currentStreak >= 3) {
    motivationalMessage = '🚀 O ritmo está incrível! Continue firme na sua sequência!';
  } else if (currentStreak === 1) {
    motivationalMessage = '👏 Primeiro dia com chave de ouro! Amanhã seguimos firmes!';
  }

  return {
    currentStreak,
    bestStreak,
    lastCompletedDate: (todayLog && todayLog.isDayComplete) ? todayStr : undefined,
    motivationalMessage
  };
};

/**
 * Toca um tom de notificação suave usando o Web Audio API
 */
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    // Ignora restrições do navegador se áudio não for permitido
  }
};

/**
 * Solicita permissão do navegador para notificações
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  return false;
};

/**
 * Dispara uma notificação do sistema do navegador se permitido
 */
export const triggerBrowserNotification = (
  title: string,
  body: string,
  tag?: string
): Notification | null => {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    playNotificationChime();
    const notif = new Notification(title, {
      body,
      tag: tag || 'routine-notification',
      icon: '/favicon.ico'
    });
    return notif;
  } catch (e) {
    console.error('Erro ao emitir notificação de rotina:', e);
    return null;
  }
};

export interface RoutineStatisticsResult {
  period: 'today' | 'week' | '7days' | 'month' | 'all';
  totalDaysRecorded: number;
  completeDaysCount: number;
  totalScheduled: number;
  totalCompleted: number;
  totalFailed: number;
  completionRate: number;
  mostCompletedActivity: { name: string; count: number } | null;
  mostMissedActivity: { name: string; count: number; topReasons: string[] } | null;
  dailyGraph: {
    date: string;
    dayLabel: string;
    scheduled: number;
    completed: number;
    failed: number;
    percent: number;
    isComplete: boolean;
  }[];
  weeklyEvolution: {
    weekLabel: string;
    completionRate: number;
    completedDays: number;
  }[];
}

/**
 * Calcula estatísticas reais e não fictícias a partir do histórico gravado
 */
export const calculateRoutineStats = (
  history: RoutineDayLog[],
  period: 'today' | 'week' | '7days' | 'month' | 'all' = 'today'
): RoutineStatisticsResult => {
  const now = new Date();
  const todayStr = formatDateToISO(now);

  // Filtragem dos logs pelo período selecionado
  let filteredLogs = [...history];

  if (period === 'today') {
    filteredLogs = filteredLogs.filter(l => l.date === todayStr);
  } else if (period === '7days') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    const limitStr = formatDateToISO(sevenDaysAgo);
    filteredLogs = filteredLogs.filter(l => l.date >= limitStr && l.date <= todayStr);
  } else if (period === 'week') {
    // Início da semana atual (Segunda-feira)
    const day = now.getDay();
    const diff = (day === 0 ? 6 : day - 1); // 0 = Segunda-feira
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const mondayStr = formatDateToISO(monday);
    filteredLogs = filteredLogs.filter(l => l.date >= mondayStr && l.date <= todayStr);
  } else if (period === 'month') {
    const firstDayMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    filteredLogs = filteredLogs.filter(l => l.date >= firstDayMonth && l.date <= todayStr);
  }

  // Agregações
  let totalScheduled = 0;
  let totalCompleted = 0;
  let totalFailed = 0;
  let completeDaysCount = 0;

  const completedCountMap = new Map<string, number>();
  const failedCountMap = new Map<string, { count: number; reasons: string[] }>();

  filteredLogs.forEach(log => {
    totalScheduled += log.totalScheduled;
    totalCompleted += log.totalCompleted;
    totalFailed += log.totalFailed;
    if (log.isDayComplete) completeDaysCount++;

    log.activities.forEach(act => {
      if (act.status === 'completed') {
        completedCountMap.set(act.name, (completedCountMap.get(act.name) || 0) + 1);
      } else if (act.status === 'failed') {
        const cur = failedCountMap.get(act.name) || { count: 0, reasons: [] };
        cur.count += 1;
        if (act.justification) cur.reasons.push(act.justification);
        failedCountMap.set(act.name, cur);
      }
    });
  });

  const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  // Atividade mais concluída
  let mostCompletedActivity: { name: string; count: number } | null = null;
  completedCountMap.forEach((count, name) => {
    if (!mostCompletedActivity || count > mostCompletedActivity.count) {
      mostCompletedActivity = { name, count };
    }
  });

  // Atividade mais perdida
  let mostMissedActivity: { name: string; count: number; topReasons: string[] } | null = null;
  failedCountMap.forEach((data, name) => {
    if (!mostMissedActivity || data.count > mostMissedActivity.count) {
      mostMissedActivity = {
        name,
        count: data.count,
        topReasons: Array.from(new Set(data.reasons)).slice(0, 3)
      };
    }
  });

  // Gráfico diário ordenado por data crescente
  const dailyGraph = filteredLogs
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(log => {
      const parts = log.date.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const dayLabel = `${parts[2]}/${parts[1]}`;
      return {
        date: log.date,
        dayLabel,
        scheduled: log.totalScheduled,
        completed: log.totalCompleted,
        failed: log.totalFailed,
        percent: log.completionPercent,
        isComplete: log.isDayComplete
      };
    });

  // Evolução semanal simples
  const weeklyEvolution: { weekLabel: string; completionRate: number; completedDays: number }[] = [];
  if (period === 'all' || period === 'month') {
    // Agrupa por semanas do mês
    const weeksMap = new Map<string, { scheduled: number; completed: number; fullDays: number }>();
    filteredLogs.forEach(log => {
      const parts = log.date.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const weekNumber = Math.ceil(d.getDate() / 7);
      const key = `Semana ${weekNumber}`;
      const cur = weeksMap.get(key) || { scheduled: 0, completed: 0, fullDays: 0 };
      cur.scheduled += log.totalScheduled;
      cur.completed += log.totalCompleted;
      if (log.isDayComplete) cur.fullDays += 1;
      weeksMap.set(key, cur);
    });

    weeksMap.forEach((val, label) => {
      weeklyEvolution.push({
        weekLabel: label,
        completionRate: val.scheduled > 0 ? Math.round((val.completed / val.scheduled) * 100) : 0,
        completedDays: val.fullDays
      });
    });
  }

  return {
    period,
    totalDaysRecorded: filteredLogs.length,
    completeDaysCount,
    totalScheduled,
    totalCompleted,
    totalFailed,
    completionRate,
    mostCompletedActivity,
    mostMissedActivity,
    dailyGraph,
    weeklyEvolution
  };
};
