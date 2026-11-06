import { PainelData, ArchivedMonthData, FinanceTransaction, Task } from '../types';

export const PORTUGUESE_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export interface AutoFinalizeStatus {
  shouldFinalize: boolean;
  targetMonthName: string;
  targetYear: number;
  targetMonthIndex: number;
  activeMonthName: string;
  activeYear: number;
  nextScheduledDate: Date;
  nextScheduledDateFormatted: string;
}

/**
 * Retorna a próxima data e hora em que o fechamento automático deve ocorrer.
 * Regra: Sempre no dia 1 de cada mês às 06:00:00 da manhã.
 */
export function getNextScheduledFinalizeDate(now: Date = new Date()): Date {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const hours = now.getHours();

  // Se hoje for dia 1 e ainda for antes das 06:00, o fechamento é hoje às 06:00
  if (day === 1 && hours < 6) {
    return new Date(year, month, 1, 6, 0, 0);
  }

  // Caso contrário, é no dia 1 do próximo mês às 06:00
  return new Date(year, month + 1, 1, 6, 0, 0);
}

/**
 * Verifica se o mês anterior deve ser finalizado automaticamente.
 * Regra do usuário: "toda vez q terminar o mes aí automaticamente finaliza.
 * Por ex, hoje é o último dia de outubro, aí amanhã às 6 horas já finaliza e entra para novembro."
 */
export function checkShouldAutoFinalize(
  now: Date = new Date(),
  archivedMonths: ArchivedMonthData[] = []
): AutoFinalizeStatus {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const currentHours = now.getHours();

  const nextScheduled = getNextScheduledFinalizeDate(now);
  const nextFormatted = `${String(nextScheduled.getDate()).padStart(2, '0')}/${String(nextScheduled.getMonth() + 1).padStart(2, '0')}/${nextScheduled.getFullYear()} às 06:00`;

  // Mês anterior (que encerrou ao virar o mês)
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthName = PORTUGUESE_MONTHS[prevMonthIndex];

  // Mês atual ativo
  const activeMonthName = PORTUGUESE_MONTHS[currentMonth];

  // Controle de ciclo salvo
  const cycleKey = 'lifehub_active_cycle_month';
  const savedCycle = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    ? localStorage.getItem(cycleKey)
    : null;

  const currentCycleStr = `${currentYear}-${currentMonth}`;

  // Se for dia 1 antes das 06:00, o mês anterior ainda está ativo (período de tolerância até às 06:00)
  if (currentDay === 1 && currentHours < 6) {
    return {
      shouldFinalize: false,
      targetMonthName: prevMonthName,
      targetYear: prevYear,
      targetMonthIndex: prevMonthIndex,
      activeMonthName: prevMonthName,
      activeYear: prevYear,
      nextScheduledDate: nextScheduled,
      nextScheduledDateFormatted: nextFormatted
    };
  }

  // Se o ciclo já é o mês atual (por exemplo, já estamos dentro de Outubro e não virou para Novembro ainda):
  // O mês atual ainda está em andamento! Só finaliza quando chegar o dia 1 às 06:00 do mês seguinte.
  if (savedCycle === currentCycleStr) {
    return {
      shouldFinalize: false,
      targetMonthName: activeMonthName,
      targetYear: currentYear,
      targetMonthIndex: currentMonth,
      activeMonthName,
      activeYear: currentYear,
      nextScheduledDate: nextScheduled,
      nextScheduledDateFormatted: nextFormatted
    };
  }

  // Se savedCycle ainda não foi configurado (primeiro acesso)
  if (!savedCycle) {
    // Se hoje NÃO é o dia 1 virando às 06:00 (por exemplo, hoje é 31 de Outubro):
    // Inicializa o ciclo como o mês atual e aguarda a virada amanhã às 06:00.
    if (currentDay !== 1) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(cycleKey, currentCycleStr);
      }
      return {
        shouldFinalize: false,
        targetMonthName: activeMonthName,
        targetYear: currentYear,
        targetMonthIndex: currentMonth,
        activeMonthName,
        activeYear: currentYear,
        nextScheduledDate: nextScheduled,
        nextScheduledDateFormatted: nextFormatted
      };
    }
  }

  // Se chegamos aqui, o mês anterior já encerrou (chegou dia 1 às 06:00 ou posterior)
  // Verifica se o mês anterior já foi arquivado (seja manual ou automaticamente)
  const alreadyArchived = (archivedMonths || []).some(
    archive => archive.year === prevYear && (
      archive.monthIndex === prevMonthIndex ||
      archive.monthName.toLowerCase() === prevMonthName.toLowerCase()
    )
  );

  const localKey = `lifehub_auto_finalized_${prevYear}_${prevMonthIndex}`;
  const alreadySavedInLocalStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    ? localStorage.getItem(localKey) === 'true'
    : false;

  const shouldFinalize = !alreadyArchived && !alreadySavedInLocalStorage;

  return {
    shouldFinalize,
    targetMonthName: prevMonthName,
    targetYear: prevYear,
    targetMonthIndex: prevMonthIndex,
    activeMonthName,
    activeYear: currentYear,
    nextScheduledDate: nextScheduled,
    nextScheduledDateFormatted: nextFormatted
  };
}

/**
 * Cria o objeto ArchivedMonthData com os dados do mês finalizado
 */
export function buildArchivedMonthData(
  monthName: string,
  year: number,
  monthIndex: number,
  finance: FinanceTransaction[],
  tasks: Task[],
  isAuto = true
): ArchivedMonthData {
  const finList = finance || [];
  const taskList = tasks || [];

  const totalIncome = finList
    .filter(f => f.type === 'income')
    .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

  const totalExpense = finList
    .filter(f => f.type === 'expense')
    .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  const totalTasks = taskList.length;
  const completedTasks = taskList.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const now = new Date();
  const finalizedAtDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const finalizedAtTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const finalizedAt = `${finalizedAtDate} às ${finalizedAtTime}${isAuto ? ' (Automático às 06:00)' : ''}`;

  return {
    id: `${year}-${monthName.toLowerCase()}-${Date.now()}`,
    monthName,
    year,
    monthIndex,
    finalizedAt,
    finalizedAtDate,
    finance: [...finList],
    tasks: [...taskList],
    summary: {
      totalIncome,
      totalExpense,
      balance,
      totalTasks,
      completedTasks,
      pendingTasks
    }
  };
}
