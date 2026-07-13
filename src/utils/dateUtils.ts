import { PainelData, Reminder } from '../types';

export function parseDateStringToCurrentYear(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Clean string
  const clean = dateStr.trim();
  
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const parts = clean.split('-');
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const d = new Date();
    d.setMonth(month, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Try DD/MM/YYYY or DD/MM
  const slashes = clean.split('/');
  if (slashes.length >= 2) {
    const day = parseInt(slashes[0]);
    const month = parseInt(slashes[1]) - 1;
    if (!isNaN(day) && !isNaN(month)) {
      const d = new Date();
      d.setMonth(month, day);
      d.setHours(0, 0, 0, 0);
      return d;
    }
  }

  // Try text month e.g. "15 de Maio" or "15 de maio"
  const monthsPt = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const lower = clean.toLowerCase();
  for (let i = 0; i < monthsPt.length; i++) {
    if (lower.includes(monthsPt[i])) {
      const matches = lower.match(/\d+/);
      if (matches) {
        const day = parseInt(matches[0]);
        const d = new Date();
        d.setMonth(i, day);
        d.setHours(0, 0, 0, 0);
        return d;
      }
    }
  }

  return null;
}

export function getDaysUntil(dateStr: string): { days: number; targetDate: Date | null } {
  const target = parseDateStringToCurrentYear(dateStr);
  if (!target) return { days: 999, targetDate: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If target date has already passed this year, look at next year's date
  const targetThisYear = new Date(target);
  targetThisYear.setFullYear(today.getFullYear());
  
  if (targetThisYear < today) {
    targetThisYear.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = targetThisYear.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { days: diffDays, targetDate: targetThisYear };
}

export function getGiftReminders(data: PainelData): Reminder[] {
  const reminders: Reminder[] = [];
  const qc = data.queroComprar;
  if (!qc) return reminders;

  const people = qc.people || [];
  const items = qc.items || [];

  // 1. Process Special Dates of People
  people.forEach(p => {
    const dates = p.specialDates || [];
    // Fallback to legacy birthday field if specialDates is empty
    const allDates = dates.length > 0 ? dates : (p.birthday ? [{
      id: 'legacy_bday',
      label: 'Aniversário',
      date: p.birthday,
      type: 'birthday' as const
    }] : []);

    allDates.forEach(d => {
      const { days } = getDaysUntil(d.date);
      if (days === 0) {
        reminders.push({
          id: `gift_event_today_${p.id}_${d.id}`,
          text: `🎉 Hoje é o ${d.label} de ${p.name}!`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days === 30) {
        reminders.push({
          id: `gift_event_30_${p.id}_${d.id}`,
          text: `🎂 Falta 30 dias para o ${d.label.toLowerCase()} de ${p.name}.`,
          priority: 'medium',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days <= 7 && days > 0) {
        reminders.push({
          id: `gift_event_warn_${days}_${p.id}_${d.id}`,
          text: `⏳ Falta ${days} ${days === 1 ? 'dia' : 'dias'} para o ${d.label.toLowerCase()} de ${p.name}.`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      }
    });
  });

  // 2. Process Gifts/Items
  items.forEach(item => {
    // Only check gifts that have a date and are not already completed/delivered
    if (item.category === 'gifts' && item.giftDate && item.giftStatus !== 'delivered' && item.status !== 'bought') {
      const { days } = getDaysUntil(item.giftDate);
      const personName = people.find(p => p.id === item.giftPersonId)?.name || 'alguém especial';
      
      if (days === 30) {
        reminders.push({
          id: `gift_item_30_${item.id}`,
          text: `🎁 Falta 30 dias para comprar o presente "${item.name}" para ${personName}.`,
          priority: 'medium',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days === 15) {
        reminders.push({
          id: `gift_item_15_${item.id}`,
          text: `🛍️ Falta 15 dias para comprar o presente "${item.name}" para ${personName}.`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days === 7) {
        reminders.push({
          id: `gift_item_7_${item.id}`,
          text: `🚚 Falta 7 dias para entregar o presente "${item.name}" para ${personName}.`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days <= 3 && days > 0) {
        reminders.push({
          id: `gift_item_warn_${days}_${item.id}`,
          text: `🚨 Falta apenas ${days} ${days === 1 ? 'dia' : 'dias'} para o presente "${item.name}" de ${personName}!`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      } else if (days === 0) {
        reminders.push({
          id: `gift_item_today_${item.id}`,
          text: `🎁 Hoje é o dia de entregar o presente "${item.name}" para ${personName}!`,
          priority: 'high',
          completed: false,
          createdAt: new Date().toISOString(),
          category: 'gifts'
        });
      }
    }
  });

  return reminders;
}
