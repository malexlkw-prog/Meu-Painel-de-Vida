import { RoutineActivity, RoutineState, RoutineSettings, RoutineStreak } from '../types';
import { DEFAULT_ENEM_SCHEDULE } from './enemScheduleData';

export const INITIAL_ROUTINE_ACTIVITIES: RoutineActivity[] = [
  {
    id: 'routine-act-1',
    name: 'Acordar',
    startTime: '06:00',
    endTime: '06:45',
    durationMinutes: 45,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 1,
    category: 'personal',
    icon: 'Sun',
    color: 'amber',
    active: true
  },
  {
    id: 'routine-act-2',
    name: 'Devocional',
    startTime: '06:45',
    endTime: '07:00',
    durationMinutes: 15,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 2,
    category: 'spiritual',
    icon: 'Book',
    color: 'yellow',
    active: true
  },
  {
    id: 'routine-act-3',
    name: 'Escola',
    startTime: '07:00',
    endTime: '12:30',
    durationMinutes: 330,
    daysOfWeek: [1, 2, 3, 4, 5], // Dias úteis por padrão, mas customizável
    order: 3,
    category: 'study',
    icon: 'GraduationCap',
    color: 'sky',
    active: true
  },
  {
    id: 'routine-act-4',
    name: 'Almoço',
    startTime: '12:30',
    endTime: '12:55',
    durationMinutes: 25,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 4,
    category: 'health',
    icon: 'Utensils',
    color: 'orange',
    active: true
  },
  {
    id: 'routine-act-5',
    name: 'Banho',
    startTime: '12:55',
    endTime: '13:00',
    durationMinutes: 5,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 5,
    category: 'personal',
    icon: 'Sparkles',
    color: 'cyan',
    active: true
  },
  {
    id: 'routine-act-6',
    name: 'Trabalho',
    startTime: '13:00',
    endTime: '14:45',
    durationMinutes: 105,
    daysOfWeek: [1, 2, 3, 4, 5],
    order: 6,
    category: 'work',
    icon: 'Briefcase',
    color: 'blue',
    active: true
  },
  {
    id: 'routine-act-7',
    name: 'Descanso',
    startTime: '14:45',
    endTime: '15:15',
    durationMinutes: 30,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 7,
    category: 'leisure',
    icon: 'Coffee',
    color: 'teal',
    active: true
  },
  {
    id: 'routine-act-8',
    name: 'Estudo ENEM (Bloco 1)',
    startTime: '15:15',
    endTime: '16:15',
    durationMinutes: 60,
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    order: 8,
    category: 'study',
    icon: 'BookOpen',
    color: 'indigo',
    active: true,
    studyBlock: 1
  },
  {
    id: 'routine-act-9',
    name: 'Inglês',
    startTime: '16:15',
    endTime: '17:00',
    durationMinutes: 45,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 9,
    category: 'study',
    icon: 'Languages',
    color: 'indigo',
    active: true
  },
  {
    id: 'routine-act-10',
    name: 'Exercício físico',
    startTime: '17:00',
    endTime: '18:00',
    durationMinutes: 60,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 10,
    category: 'health',
    icon: 'Dumbbell',
    color: 'emerald',
    active: true
  },
  {
    id: 'routine-act-11',
    name: 'Banho e tempo livre',
    startTime: '18:00',
    endTime: '20:30',
    durationMinutes: 150,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 11,
    category: 'leisure',
    icon: 'Smile',
    color: 'pink',
    active: true
  },
  {
    id: 'routine-act-12',
    name: 'Curso',
    startTime: '20:30',
    endTime: '21:00',
    durationMinutes: 30,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 12,
    category: 'study',
    icon: 'Laptop',
    color: 'purple',
    active: true
  },
  {
    id: 'routine-act-13',
    name: 'Projeto pessoal',
    startTime: '21:00',
    endTime: '21:30',
    durationMinutes: 30,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 13,
    category: 'work',
    icon: 'Folder',
    color: 'sky',
    active: true
  },
  {
    id: 'routine-act-14',
    name: 'Estudo ENEM (Bloco 2)',
    startTime: '21:30',
    endTime: '22:30',
    durationMinutes: 60,
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    order: 14,
    category: 'study',
    icon: 'BookOpen',
    color: 'violet',
    active: true,
    studyBlock: 2
  },
  {
    id: 'routine-act-15',
    name: 'Devocional',
    startTime: '22:30',
    endTime: '23:00',
    durationMinutes: 30,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 15,
    category: 'spiritual',
    icon: 'Heart',
    color: 'rose',
    active: true
  },
  {
    id: 'routine-act-16',
    name: 'Dormir',
    startTime: '23:00',
    endTime: '06:00',
    durationMinutes: 420,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    order: 16,
    category: 'personal',
    icon: 'Moon',
    color: 'slate',
    active: true
  }
];

export const INITIAL_ROUTINE_SETTINGS: RoutineSettings = {
  notificationsEnabled: false,
  leadTimeMinutes: 5,
  dailyGoalPercent: 100,
  activeRoutineDays: [0, 1, 2, 3, 4, 5, 6],
  soundEnabled: true
};

export const INITIAL_ROUTINE_STREAK: RoutineStreak = {
  currentStreak: 0,
  bestStreak: 0
};

export const INITIAL_ROUTINE_STATE: RoutineState = {
  activities: INITIAL_ROUTINE_ACTIVITIES,
  history: [],
  settings: INITIAL_ROUTINE_SETTINGS,
  streak: INITIAL_ROUTINE_STREAK,
  enemSchedule: DEFAULT_ENEM_SCHEDULE
};
