import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Calendar, 
  Flame, 
  Target, 
  Scale, 
  Camera, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  LineChart, 
  Clock, 
  TrendingUp, 
  Award,
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarDays,
  Upload,
  X
} from 'lucide-react';
import { 
  PainelData, 
  GymState, 
  WorkoutDay, 
  Exercise, 
  ExerciseHistoryLog, 
  WorkoutGoal, 
  BodyMeasurement, 
  EvolutionPhoto, 
  GymCalendarDay 
} from '../types';
import { 
  ResponsiveContainer, 
  LineChart as RechartLine, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

interface GymSectionProps {
  gymData?: GymState;
  onUpdateGym: (updater: (prev: GymState) => GymState) => void;
  forcedSubTab?: 'routine' | 'evolution' | 'goals' | 'measurements' | 'photos' | 'calendar';
}

export default function GymSection({ gymData, onUpdateGym, forcedSubTab }: GymSectionProps) {
  // Ensure default gym structure in case it's missing (failsafe)
  const defaultGym: GymState = {
    workouts: [
      { id: 'Segunda', dayName: 'Segunda-feira', workoutName: 'Treino A - Peito e Tríceps', exercises: [] },
      { id: 'Terca', dayName: 'Terça-feira', workoutName: 'Treino B - Costas e Bíceps', exercises: [] },
      { id: 'Quarta', dayName: 'Quarta-feira', workoutName: 'Descanso Ativo', exercises: [] },
      { id: 'Quinta', dayName: 'Quinta-feira', workoutName: 'Treino C - Pernas', exercises: [] },
      { id: 'Sexta', dayName: 'Sexta-feira', workoutName: 'Treino D - Ombros', exercises: [] },
      { id: 'Sabado', dayName: 'Sábado', workoutName: 'Aeróbico', exercises: [] },
      { id: 'Domingo', dayName: 'Domingo', workoutName: 'Descanso Pleno', exercises: [] }
    ],
    goals: [],
    measurements: [],
    photos: [],
    calendar: {},
    hoursTrainedTotal: 0
  };

  const gym: GymState = {
    workouts: gymData?.workouts || defaultGym.workouts,
    goals: gymData?.goals || defaultGym.goals,
    measurements: gymData?.measurements || defaultGym.measurements,
    photos: gymData?.photos || defaultGym.photos,
    calendar: gymData?.calendar || defaultGym.calendar,
    hoursTrainedTotal: gymData?.hoursTrainedTotal ?? defaultGym.hoursTrainedTotal
  };

  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'evolution' | 'goals' | 'measurements' | 'photos' | 'calendar'>('routine');

  React.useEffect(() => {
    if (forcedSubTab) {
      setActiveSubTab(forcedSubTab);
    }
  }, [forcedSubTab]);

  // Daily Routine Active Day
  const [selectedDayId, setSelectedDayId] = useState<string>('Segunda');

  // Exercise Management Modal State
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    muscleGroup: 'Peito',
    sets: 3,
    reps: '12',
    weight: 10,
    restTime: '1m',
    notes: ''
  });

  // Edit Workout Name Inline
  const [isEditingWorkoutName, setIsEditingWorkoutName] = useState(false);
  const [tempWorkoutName, setTempWorkoutName] = useState('');

  // Evolution of load select exercise view
  const [selectedExecIdForChart, setSelectedExecIdForChart] = useState<string>('');

  // Measurements Modal State
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [measurementForm, setMeasurementForm] = useState({
    weight: 70,
    height: 1.75,
    peito: 0,
    braçoEsquerdo: 0,
    braçoDireito: 0,
    cintura: 0,
    abdômen: 0,
    quadril: 0,
    coxaEsquerda: 0,
    coxaDireita: 0,
    panturrilhaEsquerda: 0,
    panturrilhaDireita: 0
  });

  // Goal Modal State
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  // Photos Add State
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    imageUrl: '',
    notes: ''
  });

  // Workout Calendar Navigation / Month State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date());
  const [showCalendarDayConfig, setShowCalendarDayConfig] = useState<string | null>(null); // YYYY-MM-DD
  const [calendarForm, setCalendarForm] = useState({
    trained: false,
    workoutPlanned: 'Treino A'
  });

  // Total Gym Hours Edit State
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [tempHours, setTempHours] = useState(10);

  // Quick preset photos
  const PRESET_WORKOUT_PHOTOS = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=450&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=450&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=450&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=450&auto=format&fit=crop'
  ];

  // Helper stats computed state
  const totalExercisesRegistered = gym.workouts.reduce((acc, current) => acc + (current.exercises?.length || 0), 0);
  
  // Muscle Group most trained computation
  const muscleGroupCounts: { [key: string]: number } = {};
  gym.workouts.forEach(w => {
    (w.exercises || []).forEach(e => {
        muscleGroupCounts[e.muscleGroup] = (muscleGroupCounts[e.muscleGroup] || 0) + 1;
    });
  });
  let topMuscleGroup = "Treino Completo";
  let maxCount = 0;
  Object.keys(muscleGroupCounts).forEach(g => {
    if (muscleGroupCounts[g] > maxCount) {
        maxCount = muscleGroupCounts[g];
        topMuscleGroup = g;
    }
  });

  // Max weight lifted per exercise
  const maxLift = gym.workouts.flatMap(w => w.exercises || []).reduce((max, curr) => {
    const historicalMax = curr.history?.reduce((m, h) => h.weight > m ? h.weight : m, 0) || 0;
    const currentMax = Math.max(curr.weight, historicalMax);
    return currentMax > max.weight ? { name: curr.name, weight: currentMax } : max;
  }, { name: "Nenhum", weight: 0 });

  // Consecutive Days training calculated from calendar key elements
  const computeConsecutiveStreak = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayRecord = gym.calendar[dateStr];
        if (dayRecord && dayRecord.trained) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // Check if user has yesterday trained, or allow today not trained yet
            if (checkDate.getTime() === today.getTime()) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }
    return currentStreak;
  };

  const streak = computeConsecutiveStreak();
  const totalTrainedDayCount = Object.values(gym.calendar).filter(c => c.trained).length;

  const handleEditWorkoutName = (dayId: string) => {
    const target = gym.workouts.find(w => w.id === dayId);
    if (target) {
        setTempWorkoutName(target.workoutName || '');
        setIsEditingWorkoutName(true);
    }
  };

  const saveWorkoutName = (dayId: string) => {
    onUpdateGym(prev => {
        const updated = { ...prev };
        updated.workouts = updated.workouts.map(w => {
            if (w.id === dayId) {
                return { ...w, workoutName: tempWorkoutName };
            }
            return w;
        });
        return updated;
    });
    setIsEditingWorkoutName(false);
  };

  const handleOpenAddExercise = () => {
    setEditingExercise(null);
    setExerciseForm({
        name: '',
        muscleGroup: 'Peito',
        sets: 4,
        reps: '10',
        weight: 20,
        restTime: '1m',
        notes: ''
    });
    setExerciseModalOpen(true);
  };

  const handleOpenEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        restTime: exercise.restTime || '1m',
        notes: exercise.notes || ''
    });
    setExerciseModalOpen(true);
  };

  const saveExerciseForm = () => {
    if (!exerciseForm.name.trim()) return alert("Adicione o nome do exercício fofura!");

    onUpdateGym(prev => {
        const updated = { ...prev };
        updated.workouts = updated.workouts.map(w => {
            if (w.id === selectedDayId) {
                const exercises = w.exercises || [];
                if (editingExercise) {
                    // Update
                    return {
                        ...w,
                        exercises: exercises.map(ex => {
                            if (ex.id === editingExercise.id) {
                                // Keep history logs intact, but append new entry log if weight or volume changed
                                const updatedHistory = ex.history || [];
                                const todayStr = new Date().toISOString().split('T')[0];
                                const hasUpdatedWeight = ex.weight !== exerciseForm.weight;
                                
                                let newHistory = [...updatedHistory];
                                if (hasUpdatedWeight) {
                                    newHistory.push({
                                        id: `hist-${Date.now()}`,
                                        date: todayStr,
                                        weight: exerciseForm.weight,
                                        sets: exerciseForm.sets,
                                        reps: exerciseForm.reps
                                    });
                                }

                                return {
                                    ...ex,
                                    name: exerciseForm.name,
                                    muscleGroup: exerciseForm.muscleGroup,
                                    sets: Number(exerciseForm.sets),
                                    reps: exerciseForm.reps,
                                    weight: Number(exerciseForm.weight),
                                    restTime: exerciseForm.restTime,
                                    notes: exerciseForm.notes,
                                    history: newHistory
                                };
                            }
                            return ex;
                        })
                    };
                } else {
                    // Insert new
                    const todayStr = new Date().toISOString().split('T')[0];
                    const newEx: Exercise = {
                        id: `ex-${Date.now()}`,
                        name: exerciseForm.name,
                        muscleGroup: exerciseForm.muscleGroup,
                        sets: Number(exerciseForm.sets),
                        reps: exerciseForm.reps,
                        weight: Number(exerciseForm.weight),
                        restTime: exerciseForm.restTime,
                        notes: exerciseForm.notes,
                        history: [
                            {
                                id: `hist-${Date.now()}`,
                                date: todayStr,
                                weight: Number(exerciseForm.weight),
                                sets: Number(exerciseForm.sets),
                                reps: exerciseForm.reps
                            }
                        ]
                    };
                    return { ...w, exercises: [...exercises, newEx] };
                }
            }
            return w;
        });
        return updated;
    });

    setExerciseModalOpen(false);
  };

  const handleDeleteExercise = (dayId: string, exId: string) => {
    if (window.confirm("Deseja mesmo banir esse exercício da sua rotina?")) {
        onUpdateGym(prev => {
            const updated = { ...prev };
            updated.workouts = updated.workouts.map(w => {
                if (w.id === dayId) {
                    return {
                        ...w,
                        exercises: (w.exercises || []).filter(ex => ex.id !== exId)
                    };
                }
                return w;
            });
            return updated;
        });
    }
  };

  // Add load evolution log
  const handleAddDirectLoadLog = (exId: string, dayId: string) => {
    const pWeight = prompt("Peso atual utilizado (kg):");
    if (!pWeight || isNaN(Number(pWeight))) return;

    onUpdateGym(prev => {
        const u = { ...prev };
        u.workouts = u.workouts.map(w => {
            if (w.id === dayId) {
                return {
                    ...w,
                    exercises: w.exercises.map(ex => {
                        if (ex.id === exId) {
                            const newHist: ExerciseHistoryLog = {
                                id: `hist-${Date.now()}`,
                                date: new Date().toISOString().split('T')[0],
                                weight: Number(pWeight),
                                sets: ex.sets,
                                reps: ex.reps
                            };
                            return {
                                ...ex,
                                weight: Number(pWeight),
                                history: [...(ex.history || []), newHist]
                            };
                        }
                        return ex;
                    })
                };
            }
            return w;
        });
        return u;
    });
  };

  // Goals
  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newG: WorkoutGoal = {
        id: `goal-${Date.now()}`,
        title: newGoalTitle,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
    };
    onUpdateGym(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newG]
    }));
    setNewGoalTitle('');
    setGoalModalOpen(false);
  };

  const toggleGoal = (id: string) => {
    onUpdateGym(prev => ({
        ...prev,
        goals: (prev.goals || []).map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    }));
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGym(prev => ({
        ...prev,
        goals: (prev.goals || []).filter(g => g.id !== id)
    }));
  };

  // Measurements
  const handleAddMeasurement = () => {
    const imcValue = Number(measurementForm.weight) / ((Number(measurementForm.height) * Number(measurementForm.height)));
    const newMeas: BodyMeasurement = {
        id: `meas-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        weight: Number(measurementForm.weight),
        height: Number(measurementForm.height),
        imc: parseFloat(imcValue.toFixed(2)),
        peito: Number(measurementForm.peito) || undefined,
        braçoEsquerdo: Number(measurementForm.braçoEsquerdo) || undefined,
        braçoDireito: Number(measurementForm.braçoDireito) || undefined,
        cintura: Number(measurementForm.cintura) || undefined,
        abdômen: Number(measurementForm.abdômen) || undefined,
        quadril: Number(measurementForm.quadril) || undefined,
        coxaEsquerda: Number(measurementForm.coxaEsquerda) || undefined,
        coxaDireita: Number(measurementForm.coxaDireita) || undefined,
        panturrilhaEsquerda: Number(measurementForm.panturrilhaEsquerda) || undefined,
        panturrilhaDireita: Number(measurementForm.panturrilhaDireita) || undefined
    };

    onUpdateGym(prev => ({
        ...prev,
        measurements: [...(prev.measurements || []), newMeas]
    }));
    setMeasurementModalOpen(false);
  };

  const handleDeleteMeasurement = (id: string) => {
    if (window.confirm("Deseja apagar esse registro de medidas?")) {
        onUpdateGym(prev => ({
            ...prev,
            measurements: (prev.measurements || []).filter(m => m.id !== id)
        }));
    }
  };

  // Photos
  const handleAddPhoto = () => {
    if (!photoForm.imageUrl) return alert("Adicione um link de foto fofura!");
    const newPhoto: EvolutionPhoto = {
        id: `photo-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        imageUrl: photoForm.imageUrl,
        notes: photoForm.notes
    };
    onUpdateGym(prev => ({
        ...prev,
        photos: [...(prev.photos || []), newPhoto]
    }));
    setPhotoForm({ imageUrl: '', notes: '' });
    setPhotoModalOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm("Excluir essa foto de progresso físico?")) {
        onUpdateGym(prev => ({
            ...prev,
            photos: (prev.photos || []).filter(p => p.id !== id)
        }));
    }
  };

  // Monthly Calendar logic
  const handleCalendarDayClick = (dateStr: string) => {
    const existing = gym.calendar[dateStr] || { date: dateStr, trained: false, workoutPlanned: 'Treino A' };
    setCalendarForm({
        trained: existing.trained,
        workoutPlanned: existing.workoutPlanned || 'Treino A'
    });
    setShowCalendarDayConfig(dateStr);
  };

  const saveCalendarDay = () => {
    if (!showCalendarDayConfig) return;
    onUpdateGym(prev => {
        const calendar = { ...prev.calendar };
        calendar[showCalendarDayConfig] = {
            date: showCalendarDayConfig,
            trained: calendarForm.trained,
            workoutPlanned: calendarForm.workoutPlanned
        };
        return { ...prev, calendar };
    });
    setShowCalendarDayConfig(null);
  };

  // Edit hours total
  const handleSaveHours = () => {
    onUpdateGym(prev => ({
        ...prev,
        hoursTrainedTotal: Number(tempHours)
    }));
    setIsEditingHours(false);
  };

  // Generate date calculations
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday
  };

  const daysInMonth = getDaysInMonth(currentCalendarDate);
  const firstDayIndex = getFirstDayOfMonth(currentCalendarDate);

  const prevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const ALL_DAYS_WEEK = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];

  // All registered exercises flat list
  const allExercisesFlat = gym.workouts.flatMap(w => (w.exercises || []).map(ex => ({ ...ex, dayId: w.id, dayName: w.dayName })));

  return (
    <div className="space-y-6">
      
      {/* 1. Header Bento & Realtime Gym Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        
        {/* Tab Header Main */}
        <div className="col-span-2 md:col-span-4 lg:col-span-2 bg-gradient-to-tr from-indigo-500 to-indigo-600 dark:from-indigo-900/40 dark:to-indigo-950/40 border border-indigo-100/10 p-5 rounded-3xl flex flex-col justify-between text-white shadow-sm">
          <div>
            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-3">
              <Dumbbell size={22} className="animate-spin-slow text-amber-300" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Espaço Academia</h1>
            <p className="text-xs text-indigo-150 leading-relaxed mt-1 dark:text-indigo-200">
              Evolução e musculação de Marcos. Monitore treinos, forças elevadas, medidas e metas físicas.
            </p>
          </div>
          <div className="mt-4 flex gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-black bg-white/20 dark:bg-white/15 px-2 py-0.5 rounded-md text-amber-300 animate-pulse tracking-widest">
              FORÇA & FOCO 💪
            </span>
          </div>
        </div>

        {/* Stat: Streak Flame */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl flex flex-col justify-between shadow-3xs hover-scale">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">Combustão</span>
            <span className="p-2 bg-orange-500/15 text-orange-600 dark:text-orange-400 rounded-xl">
              <Flame size={15} className={streak > 0 ? "animate-bounce" : ""} />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{streak}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">dias</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-tight">Treinando consecutivos</p>
          </div>
        </div>

        {/* Stat: Total Workouts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl flex flex-col justify-between shadow-3xs hover-scale">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">Total Treinos</span>
            <span className="p-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Check size={15} />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{totalTrainedDayCount}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">sessões</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-tight">Marcados no calendário</p>
          </div>
        </div>

        {/* Stat: Muscle Group Most Checked */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl flex flex-col justify-between shadow-3xs hover-scale">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">Mais Cobrado</span>
            <span className="p-2 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Dumbbell size={15} />
            </span>
          </div>
          <div>
            <div className="mt-3">
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 line-clamp-1 leading-snug">{topMuscleGroup}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-tight">Enfocado com mais fichas</p>
          </div>
        </div>

        {/* Stat: Max Lift Weight */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl flex flex-col justify-between shadow-3xs hover-scale">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">Força Bruta Max</span>
            <span className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
              <Award size={15} />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-0.5 mt-3">
              <span className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 shrink mr-1">{maxLift.name}</span>
              <span className="text-xs font-black text-amber-500 dark:text-amber-400 shrink-0">{maxLift.weight}kg</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-tight">Carga máxima anotada</p>
          </div>
        </div>

        {/* Stat: Total Training Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl flex flex-col justify-between shadow-3xs hover-scale col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">Carga de Horas</span>
            <span className="p-2 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl cursor-pointer" onClick={() => { setTempHours(gym.hoursTrainedTotal || 0); setIsEditingHours(true); }}>
              <Clock size={15} />
            </span>
          </div>
          <div>
            {isEditingHours ? (
              <div className="flex items-center gap-1.5 mt-3">
                <input 
                  type="number"
                  value={tempHours}
                  onChange={(e) => setTempHours(Number(e.target.value))}
                  className="w-16 bg-slate-50 dark:bg-slate-950 p-1 border rounded text-xs dark:text-white"
                />
                <button onClick={handleSaveHours} className="p-1 px-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded">OK</button>
              </div>
            ) : (
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{gym.hoursTrainedTotal || 0}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">horas</span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-tight">Soma de treinos na vida</p>
          </div>
        </div>

      </div>

      {/* 2. Sub-tab Controller */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 border-b border-slate-200/60 dark:border-slate-900 scrollbar-none">
        {[
          { id: 'routine', label: '📅 Treinos Semanais', icon: Dumbbell },
          { id: 'calendar', label: '🗓️ Calendário Mensal', icon: CalendarDays },
          { id: 'evolution', label: '📈 Evolução de Força', icon: LineChart },
          { id: 'goals', label: '🎯 Objetivos / Metas', icon: Target },
          { id: 'measurements', label: '📏 Antropometria & Peso', icon: Scale },
          { id: 'photos', label: '📸 Fotos Evolução', icon: Camera }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as any);
                // Pre-select first exercise for chart if needed
                if (sub.id === 'evolution' && allExercisesFlat.length > 0 && !selectedExecIdForChart) {
                  setSelectedExecIdForChart(allExercisesFlat[0].id);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-950 dark:bg-white dark:text-slate-950 dark:border-white shadow-3xs' 
                  : 'bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-850 dark:hover:bg-slate-950/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Render Sub-tab Content Area */}
      <div className="bg-white/40 dark:bg-slate-900/10 min-h-[400px]">
        
        {/* SUBTAB 1: ROTEIRO SEMANAL DE TREINOS */}
        {activeSubTab === 'routine' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Days sidebar picker */}
            <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {gym.workouts.map((day) => {
                const isSelected = day.id === selectedDayId;
                const exercisesCount = day.exercises?.length || 0;
                
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      setSelectedDayId(day.id);
                      setIsEditingWorkoutName(false);
                    }}
                    className={`nav-btn-vertical text-left p-4.5 rounded-2.5xl flex flex-row lg:flex-col justify-between items-center lg:items-start gap-4 cursor-pointer transition-all border shrink-0 lg:shrink w-[150px] lg:w-full ${
                      isSelected 
                        ? 'bg-indigo-50 dark:bg-indigo-950/25 border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-100 shadow-3xs font-extrabold' 
                        : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-850 text-slate-600 dark:text-slate-450 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">{day.dayName}</span>
                      <span className="text-xs font-black truncate max-w-[120px] block mt-1">{day.workoutName || 'Descanso'}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                      exercisesCount > 0 ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                    }`}>
                      {exercisesCount} {exercisesCount === 1 ? 'exercício' : 'exercícios'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected day content area */}
            <div className="lg:col-span-9 space-y-5">
              {gym.workouts.filter(w => w.id === selectedDayId).map((day) => {
                const exercises = day.exercises || [];
                return (
                  <div key={day.id} className="space-y-4">
                    
                    {/* Routine label box */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-3xl gap-3 shadow-3xs">
                      <div className="flex-1 w-full">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Ficha de Rotina</span>
                        
                        {isEditingWorkoutName ? (
                          <div className="flex items-center gap-2 mt-1 w-full max-w-md">
                            <input
                              type="text"
                              value={tempWorkoutName}
                              onChange={(e) => setTempWorkoutName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-xl text-xs md:text-sm font-semibold dark:text-white"
                              placeholder="Nome do treino, ex: Treino A - Costas"
                            />
                            <button
                              onClick={() => saveWorkoutName(day.id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
                            >
                              Salvar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 mt-1">
                            <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                              {day.workoutName || 'Descanso ou Alongamento'}
                            </h2>
                            <button
                              onClick={() => handleEditWorkoutName(day.id)}
                              className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Editar nome da rotina"
                            >
                              <Edit3 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleOpenAddExercise}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-2xl w-full sm:w-auto justify-center shadow-sm cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Adicionar Exercício</span>
                      </button>
                    </div>

                    {/* Exercises Grid of the today routine */}
                    {exercises.length === 0 ? (
                      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200/60 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-3xs">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                          <Dumbbell size={20} />
                        </div>
                        <div>
                          <h3 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-slate-200">Nenhum exercício pautado para {day.dayName}</h3>
                          <p className="text-[10px] md:text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Marque como descanso pleno ou adicione os exercícios de musculação para manter seu físico e suas séries em dia!
                          </p>
                        </div>
                        <button
                          onClick={handleOpenAddExercise}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-350 hover:text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus size={12} /> Começar Ficha
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exercises.map((ex) => (
                          <div 
                            key={ex.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl relative flex flex-col justify-between hover-scale shadow-3xs"
                          >
                            <div>
                              {/* Exercise Tag */}
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 text-[9px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider">
                                  {ex.muscleGroup}
                                </span>
                                
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => handleAddDirectLoadLog(ex.id, day.id)}
                                    className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                    title="Registar nova Carga/Peso"
                                  >
                                    <TrendingUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditExercise(ex)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                    title="Editar Exercício"
                                  >
                                    <Edit3 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExercise(day.id, ex.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                    title="Deletar Exercício"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>

                              <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white leading-snug mb-3">
                                {ex.name}
                              </h3>

                              {/* Specifications Grid */}
                              <div className="grid grid-cols-3 gap-2 py-2 pr-4 border-t border-slate-100 dark:border-slate-850 text-[11px]">
                                <div>
                                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[9px] uppercase tracking-wider">Sets</span>
                                  <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{ex.sets} séries</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[9px] uppercase tracking-wider">Reps</span>
                                  <p className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{ex.reps}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[9px] uppercase tracking-wider">Peso</span>
                                  <p className="font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{ex.weight} kg</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-semibold gap-1.5">
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <Clock size={11} className="text-indigo-500 shrink-0" />
                                Descanso: {ex.restTime || "45s"}
                              </span>
                              {ex.notes && (
                                <span className="italic truncate max-w-[120px] ml-auto block" title={ex.notes}>
                                  Obs: {ex.notes}
                                </span>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* SUBTAB 2: CALENDÁRIO MENSAL INTEGRADO */}
        {activeSubTab === 'calendar' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-3xl m-0.5 shadow-3xs space-y-6">
            
            {/* Calendar header with months selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={18} />
                <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {currentCalendarDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevMonth}
                  className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekdays names */}
            <div className="grid grid-cols-7 gap-1 text-center font-black text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Weekdays grid numbers mapping */}
            <div className="grid grid-cols-7 gap-2.5">
              {/* Empty placeholder cells before month starts */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 bg-slate-50/20 dark:bg-slate-950/5 border border-transparent rounded-2xl" />
              ))}

              {/* Month dates */}
              {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                const dayNumber = dayIdx + 1;
                const formattedMonth = String(currentCalendarDate.getMonth() + 1).padStart(2, '0');
                const formattedDay = String(dayNumber).padStart(2, '0');
                const dateStr = `${currentCalendarDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
                
                // Read from gym calendar state
                const currentRecord = gym.calendar[dateStr];
                const trained = currentRecord?.trained || false;
                const planValue = currentRecord?.workoutPlanned || '';

                return (
                  <button
                    key={`day-${dayNumber}`}
                    onClick={() => handleCalendarDayClick(dateStr)}
                    className={`h-16 p-2 border rounded-2xl flex flex-col justify-between items-start text-left cursor-pointer transition-all hover:scale-103 relative ${
                      trained
                        ? 'bg-emerald-500/10 border-emerald-500/45 dark:bg-emerald-900/10 text-emerald-950 dark:text-emerald-100'
                        : planValue && planValue !== 'Descanso'
                        ? 'bg-amber-500/10 border-amber-500/40 dark:bg-amber-950/10 text-amber-900 dark:text-slate-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850/60 text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {/* Day number */}
                    <span className="text-[11px] font-extrabold">{dayNumber}</span>
                    
                    {/* Cute micro tag display depending on record state */}
                    {trained ? (
                      <span className="text-[8px] bg-emerald-500 text-white font-extrabold uppercase px-1 py-0.5 rounded flex items-center gap-0.5 leading-none shrink-0">
                        <Check size={8} /> TREINEI
                      </span>
                    ) : planValue ? (
                      <span className="text-[8.5px] truncate max-w-full font-bold uppercase text-amber-600 block leading-none saturate-120">
                        {planValue}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Tip */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-[10px] text-slate-400 flex items-center gap-2 font-semibold">
              <Info size={14} className="text-indigo-500 shrink-0" />
              <span>Dica: Clique em qualquer dia no calendário para registrar retrospectivamente se você treinou naquele dia ou planejar os treinos das próximas datas!</span>
            </div>

          </div>
        )}

        {/* SUBTAB 3: EVOLUÇÃO DE CARGA CHART */}
        {activeSubTab === 'evolution' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-3xl m-0.5 shadow-3xs space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Análise Gráfica de Força (Evolução de Cargas)</h2>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Selecione o exercício nos seus dias de semana para acompanhar o gráfico histórico de kg utilizados.</p>
              </div>

              {/* Selector */}
              {allExercisesFlat.length > 0 && (
                <select
                  value={selectedExecIdForChart}
                  onChange={(e) => setSelectedExecIdForChart(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:text-white outline-none cursor-pointer max-w-xs"
                >
                  {allExercisesFlat.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.dayName} • {ex.weight}kg)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Build chart if history logs exist */}
            {(() => {
              const selectedExObj = allExercisesFlat.find(x => x.id === selectedExecIdForChart);
              const hasHistory = selectedExObj && selectedExObj.history && selectedExObj.history.length > 1;

              if (hasHistory && selectedExObj) {
                // Ensure chart formatted data
                const chartData = (selectedExObj.history || []).map((h) => ({
                  date: h.date,
                  Weight: h.weight,
                  Volume: h.sets * Number(h.reps.split('-')[0] || h.reps || 10)
                }));

                return (
                  <div className="space-y-4">
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartLine data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" unit="kg" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '11px' }}
                            labelStyle={{ fontWeight: 'black', marginBottom: '4px' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Weight" 
                            stroke="#6366f1" 
                            strokeWidth={3} 
                            activeDot={{ r: 7 }} 
                            name="Carga (kg)"
                          />
                        </RechartLine>
                      </ResponsiveContainer>
                    </div>

                    {/* Historical logs detail */}
                    <div className="border-t border-slate-150 dark:border-slate-850 pt-4">
                      <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2.5">Histórico Analógico de Cargas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {selectedExObj.history?.map((h) => (
                          <div key={h.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex justify-between items-center text-[11px] font-semibold">
                            <div>
                              <span className="text-slate-400 block text-[9px]">{h.date}</span>
                              <span className="text-slate-800 dark:text-slate-200 mt-0.5 inline-block">{h.sets}x{h.reps}</span>
                            </div>
                            <span className="font-black text-xs text-indigo-600 dark:text-indigo-400">{h.weight} kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="p-14 text-center bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200/50 dark:border-slate-850 rounded-3xl space-y-2 max-w-lg mx-auto">
                    <TrendingUp className="mx-auto text-indigo-400 mb-2" size={24} />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">Poucos dados históricos cadastrados</h3>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                      Para renderizar o gráfico linear de evolução de carga fofura, registre pelo menos 2 cargas em datas diferentes para o exercício selecionado utilizando o indicador de subida (ícone 📈) de carga dentro da aba de treinos!
                    </p>
                  </div>
                );
              }
            })()}

          </div>
        )}

        {/* SUBTAB 4: OBJETIVOS FISICOS */}
        {activeSubTab === 'goals' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-3xl m-0.5 shadow-3xs space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Metas Corporais & Desempenho</h2>
                <p className="text-[10px] md:text-xs text-slate-400">Defina alvos claros para perda de gordura, ganhos de força e hipertrofia.</p>
              </div>

              <button
                onClick={() => setGoalModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-2xl w-full sm:w-auto justify-center cursor-pointer shadow-sm"
              >
                <Plus size={13} />
                <span>Nova Meta Física</span>
              </button>
            </div>

            {/* Metas check list */}
            {gym.goals?.length === 0 ? (
              <div className="text-center p-12 bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto space-y-2">
                <Target className="mx-auto text-indigo-400" size={22} />
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-350">Nenhuma meta física estabelecida</h3>
                <p className="text-[10px] text-slate-400">Pressione no botão acima para planejar seu peso ideal, metas de carga e porcentagem de gordura corporal!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {gym.goals.map((g) => (
                  <div 
                    key={g.id}
                    className={`p-4 rounded-2.5xl border flex items-center justify-between gap-3 transition-colors ${
                      g.completed 
                        ? 'bg-emerald-500/5 border-emerald-500/25 text-slate-400' 
                        : 'bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleGoal(g.id)}
                        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                          g.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {g.completed && <Check size={12} />}
                      </button>
                      <span className={`text-xs font-black select-none ${g.completed ? 'line-through opacity-65' : 'text-slate-800 dark:text-slate-100'}`}>
                        {g.title}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* SUBTAB 5: ANTROPOMETRIA E MEDIDAS CORPORAIS */}
        {activeSubTab === 'measurements' && (
          <div className="space-y-6">
            
            {/* Action Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-3xl shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Anotações Antropométricas & Bioimpedância</h2>
                <p className="text-[10px] md:text-xs text-slate-400">Registre regularmente seu peso atual, altura e centímetros para que a IA e os gráficos calculem o progresso corporal.</p>
              </div>

              <button
                onClick={() => setMeasurementModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-2xl w-full sm:w-auto justify-center cursor-pointer shadow-sm"
              >
                <Plus size={13} />
                <span>Nova Medição</span>
              </button>
            </div>

            {/* Build Weight/IMC Charts if records exist */}
            {gym.measurements?.length > 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Weight line evolution */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4 rounded-3xl shadow-3xs">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2.5">Evolução do Peso Corporal (kg)</h3>
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gym.measurements}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} domain={['dataMin - 3', 'dataMax + 3']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="weight" stroke="#10b981" fill="#10b981" fillOpacity={0.06} strokeWidth={2} name="Peso (kg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* IMC area line */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4 rounded-3xl shadow-3xs">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider mb-2.5">Curva do IMC Calculado</h3>
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gym.measurements}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="imc" stroke="#6366f1" fill="#6366f1" fillOpacity={0.06} strokeWidth={2} name="IMC Corporal" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            ) : null}

            {/* List and CRUD table of prior measurements in grid cards */}
            {gym.measurements?.length === 0 ? (
              <div className="text-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm mx-auto space-y-2 shadow-3xs">
                <Scale className="mx-auto text-slate-400" size={24} />
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-350">Sem medições cadastradas</h3>
                <p className="text-[10px] text-slate-400">Pressione no botão acima para adicionar a fita métrica!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gym.measurements.map((m) => (
                  <div 
                    key={m.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4.5 rounded-3xl shadow-3xs relative flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Data de Medição</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{m.date}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteMeasurement(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer"
                        title="Deletar este boletim"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 dark:border-slate-850 py-3 text-[11px] mb-3 font-semibold text-slate-700 dark:text-slate-350">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">Peso</span>
                        <span className="text-xs font-black dark:text-white">{m.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold">Altura</span>
                        <span className="text-xs font-black dark:text-white">{m.height} m</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-indigo-400 block font-bold">IMC</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{m.imc}</span>
                      </div>
                    </div>

                    {/* Centimeters sub grid */}
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-[10px] text-slate-500 font-semibold">
                      {m.peito && <div>Peito: <b className="text-slate-800 dark:text-slate-200">{m.peito}cm</b></div>}
                      {m.braçoEsquerdo && <div>B. Esq: <b className="text-slate-800 dark:text-slate-200">{m.braçoEsquerdo}cm</b></div>}
                      {m.braçoDireito && <div>B. Dir: <b className="text-slate-800 dark:text-slate-200">{m.braçoDireito}cm</b></div>}
                      {m.cintura && <div>Cintura: <b className="text-slate-800 dark:text-slate-200">{m.cintura}cm</b></div>}
                      {m.abdômen && <div>Abdômen: <b className="text-slate-800 dark:text-slate-200">{m.abdômen}cm</b></div>}
                      {m.quadril && <div>Quadril: <b className="text-slate-800 dark:text-slate-200">{m.quadril}cm</b></div>}
                      {m.coxaEsquerda && <div>Coxa Esq: <b className="text-slate-800 dark:text-slate-200">{m.coxaEsquerda}cm</b></div>}
                      {m.coxaDireita && <div>Coxa Dir: <b className="text-slate-800 dark:text-slate-200">{m.coxaDireita}cm</b></div>}
                      {m.panturrilhaEsquerda && <div>Pant. Esq: <b className="text-slate-800 dark:text-slate-200">{m.panturrilhaEsquerda}cm</b></div>}
                      {m.panturrilhaDireita && <div>Pant. Dir: <b className="text-slate-800 dark:text-slate-200">{m.panturrilhaDireita}cm</b></div>}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* SUBTAB 6: FOTOS DE EVOLUÇÃO FÍSICA */}
        {activeSubTab === 'photos' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-3xl shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Galeria Visual de Transformação</h2>
                <p className="text-[10px] md:text-xs text-slate-400">Adicione URLs de fotos e logs de datas para que você monitore visualmente sua queima de gordura e hipertrofia.</p>
              </div>

              <button
                onClick={() => setPhotoModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-2xl w-full sm:w-auto justify-center cursor-pointer shadow-sm"
              >
                <Plus size={13} />
                <span>Registrar Foto</span>
              </button>
            </div>

            {/* Photos display grid */}
            {gym.photos?.length === 0 ? (
              <div className="text-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm mx-auto space-y-2 shadow-3xs">
                <Camera className="mx-auto text-slate-400" size={24} />
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-350">Sem imagens na galeria</h3>
                <p className="text-[10px] text-slate-400">Pressione no botão acima para adicionar sua primeira foto!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gym.photos.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-3 rounded-3xl shadow-3xs flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img 
                        src={p.imageUrl} 
                        alt="Evolução" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as any).src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop";
                        }}
                      />
                      
                      <button
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition-all"
                        title="Deletar foto"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="mt-2.5 px-1 pb-1">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 block">{p.date}</span>
                      {p.notes && <p className="text-[10px] text-slate-400 mt-0.5 italic font-medium leading-relaxed truncate">{p.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* 4. MODALS (Ported inline for 100% component containment) */}
      <AnimatePresence>
        
        {/* MODAL 1: EXERCISE CREATION/EDIT */}
        {exerciseModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl space-y-4"
            >
              <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Dumbbell size={16} className="text-indigo-500" />
                {editingExercise ? 'Editar Exercício da Ficha' : 'Adicionar Novo Exercício'}
              </h2>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Nome do Exercício</label>
                  <input
                    type="text"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold dark:text-white"
                    placeholder="Ex: Supino Inclinado com Halteres"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Grupo Muscular</label>
                    <select
                      value={exerciseForm.muscleGroup}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, muscleGroup: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white outline-none cursor-pointer"
                    >
                      {['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Pescoço', 'Cardiorespiratório'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Carga Atual (kg)</label>
                    <input
                      type="number"
                      value={exerciseForm.weight}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, weight: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Séries (Sets)</label>
                    <input
                      type="number"
                      value={exerciseForm.sets}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, sets: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Repetições</label>
                    <input
                      type="text"
                      value={exerciseForm.reps}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                      placeholder="Ex: 10-12 ou Falha"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Descanso</label>
                    <input
                      type="text"
                      value={exerciseForm.restTime}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                      placeholder="Ex: 1m ou 45s"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Observações / Instruções</label>
                  <textarea
                    value={exerciseForm.notes}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs dark:text-white h-16 resize-none"
                    placeholder="Instruções de cadência ou pegada..."
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setExerciseModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveExerciseForm}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 2: NEW WATERMARK GOAL */}
        {goalModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl space-y-4"
            >
              <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Estipular Meta de Desempenho</h2>
              
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Descrição do Objetivo</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold dark:text-white"
                  placeholder="Ex: Aumentar supino reto de 60kg para 80kg"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 3: ADD ANTHROPOMETRY REC */}
        {measurementModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl my-8 space-y-4"
            >
              <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Scale size={16} className="text-emerald-500" />
                Registrar Novas Medidas de fita métrica
              </h2>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurementForm.weight}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, weight: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Altura (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={measurementForm.height}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, height: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Tórax / Peito (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.peito || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, peito: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Cintura (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.cintura || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, cintura: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Braço Esquerdo (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.braçoEsquerdo || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, braçoEsquerdo: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Braço Direito (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.braçoDireito || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, braçoDireito: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Abdômen (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.abdômen || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, abdômen: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Quadril (cm)</label>
                  <input
                    type="number"
                    value={measurementForm.quadril || ''}
                    onChange={(e) => setMeasurementForm({ ...measurementForm, quadril: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMeasurementModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddMeasurement}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Salvar boletim
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 4: ADD PHOTO EVOLUTION WITH RAPID SELECTION PRESETS */}
        {photoModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl space-y-4"
            >
              <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Camera size={16} className="text-indigo-500" />
                Carregar Foto de Evolução
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Carregar Foto</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer text-xs font-bold transition-all shadow-3xs">
                      <Upload size={14} />
                      <span>Selecionar Arquivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setPhotoForm({ ...photoForm, imageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {photoForm.imageUrl && (
                      <div className="relative group">
                        <img src={photoForm.imageUrl} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setPhotoForm({ ...photoForm, imageUrl: '' })}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 block mb-1.5">Ou escolha uma sugestão ilustrativa rápida:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_WORKOUT_PHOTOS.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setPhotoForm({ ...photoForm, imageUrl: p })}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          photoForm.imageUrl === p ? 'border-indigo-600 scale-95' : 'border-transparent'
                        }`}
                      >
                        <img src={p} className="w-full h-full object-cover" alt="preset" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Observações da Foto</label>
                  <input
                    type="text"
                    value={photoForm.notes}
                    onChange={(e) => setPhotoForm({ ...photoForm, notes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs dark:text-white"
                    placeholder="Ex: Treino pós costas, pump insano"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="flex-1 py-15 rounded-xl border border-slate-250 dark:border-slate-800 text-xs text-slate-500 font-bold"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="flex-1 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Carregar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 5: CHOOSE CALENDAR DAY STATE RETROSPECTIVELY */}
        {showCalendarDayConfig && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div>
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white">Boletim de Treino do Dia</h2>
                <p className="text-[10px] text-slate-400 uppercase font-black mt-0.5">{showCalendarDayConfig}</p>
              </div>

              <div className="space-y-4">
                
                {/* Trained Switch checkbox custom toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Frequentei a academia hoje?</span>
                  
                  <button
                    type="button"
                    onClick={() => setCalendarForm({ ...calendarForm, trained: !calendarForm.trained })}
                    className={`w-12 h-6 px-0.5 rounded-full flex items-center transition-all cursor-pointer ${
                      calendarForm.trained ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
                    }`}
                  >
                    <motion.span layout className="w-5 h-5 bg-white rounded-full shadow-inner block" />
                  </button>
                </div>

                {/* Workout Plan Input */}
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Rotina de Treino Planejada</label>
                  <input
                    type="text"
                    value={calendarForm.workoutPlanned}
                    onChange={(e) => setCalendarForm({ ...calendarForm, workoutPlanned: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold dark:text-white"
                    placeholder="Ex: Treino A"
                  />
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCalendarDayConfig(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={saveCalendarDay}
                  className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold cursor-pointer animate-pulse"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
