import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  FileText, 
  User, 
  Award, 
  ChevronRight, 
  X,
  CheckSquare,
  Sparkles
} from 'lucide-react';

// TYPES
export interface SchoolSubject {
  id: string;
  name: string;
  teacher: string;
  color?: string;
  bimestres: {
    [key: number]: { // 1, 2, 3, 4
      nota: number | null;
      faltas: number;
    };
  };
}

export interface ScheduleSlot {
  id: string;
  day: 'seg' | 'ter' | 'qua' | 'qui' | 'sex';
  period: 1 | 2 | 3 | 4 | 5 | 6; // 1-3 before break, 4-6 after break
  subjectName: string;
  room?: string;
  teacher?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  date: string;
  topic: string;
  status: 'agendada' | 'estudar' | 'concluida';
  notes?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  status: 'pendente' | 'em_andamento' | 'entregue';
  notes?: string;
}

export interface DisciplineTopic {
  id: string;
  subjectId: string;
  title: string;
  status: 'concluido' | 'em_andamento' | 'nao_iniciado';
}

export interface DisciplineNote {
  id: string;
  subjectId: string;
  content: string;
  updatedAt: string;
}

const DEFAULT_SUBJECTS: SchoolSubject[] = [
  {
    id: 'matematica',
    name: 'Matemática',
    teacher: 'Prof. Carlos Silva',
    color: 'bg-blue-500',
    bimestres: {
      1: { nota: 8.5, faltas: 1 },
      2: { nota: 7.8, faltas: 2 },
      3: { nota: 9.0, faltas: 0 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    teacher: 'Profª. Maria Oliveira',
    color: 'bg-emerald-500',
    bimestres: {
      1: { nota: 9.0, faltas: 0 },
      2: { nota: 8.5, faltas: 1 },
      3: { nota: 8.8, faltas: 0 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'historia',
    name: 'História',
    teacher: 'Prof. Roberto Santos',
    color: 'bg-amber-500',
    bimestres: {
      1: { nota: 7.5, faltas: 2 },
      2: { nota: 8.0, faltas: 1 },
      3: { nota: 7.0, faltas: 1 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'geografia',
    name: 'Geografia',
    teacher: 'Profª. Ana Costa',
    color: 'bg-purple-500',
    bimestres: {
      1: { nota: 8.2, faltas: 1 },
      2: { nota: 8.5, faltas: 0 },
      3: { nota: 9.1, faltas: 0 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'fisica',
    name: 'Física',
    teacher: 'Prof. Fernando Lima',
    color: 'bg-rose-500',
    bimestres: {
      1: { nota: 6.5, faltas: 3 },
      2: { nota: 7.2, faltas: 2 },
      3: { nota: 7.0, faltas: 1 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'quimica',
    name: 'Química',
    teacher: 'Profª. Juliana Paes',
    color: 'bg-cyan-500',
    bimestres: {
      1: { nota: 7.0, faltas: 2 },
      2: { nota: 6.8, faltas: 1 },
      3: { nota: 8.0, faltas: 0 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'biologia',
    name: 'Biologia',
    teacher: 'Prof. Marcos Rocha',
    color: 'bg-teal-500',
    bimestres: {
      1: { nota: 9.2, faltas: 0 },
      2: { nota: 9.5, faltas: 0 },
      3: { nota: 9.0, faltas: 1 },
      4: { nota: null, faltas: 0 }
    }
  },
  {
    id: 'ingles',
    name: 'Inglês',
    teacher: 'Profª. Sarah Smith',
    color: 'bg-indigo-500',
    bimestres: {
      1: { nota: 9.5, faltas: 0 },
      2: { nota: 9.8, faltas: 0 },
      3: { nota: 10.0, faltas: 0 },
      4: { nota: null, faltas: 0 }
    }
  }
];

const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  { id: '1', day: 'seg', period: 1, subjectName: 'Matemática' },
  { id: '2', day: 'seg', period: 2, subjectName: 'Matemática' },
  { id: '3', day: 'seg', period: 3, subjectName: 'Física' },
  { id: '4', day: 'seg', period: 4, subjectName: 'História' },
  { id: '5', day: 'seg', period: 5, subjectName: 'Língua Portuguesa' },
  { id: '6', day: 'seg', period: 6, subjectName: 'Língua Portuguesa' },

  { id: '7', day: 'ter', period: 1, subjectName: 'Química' },
  { id: '8', day: 'ter', period: 2, subjectName: 'Biologia' },
  { id: '9', day: 'ter', period: 3, subjectName: 'Geografia' },
  { id: '10', day: 'ter', period: 4, subjectName: 'Matemática' },
  { id: '11', day: 'ter', period: 5, subjectName: 'Inglês' },
  { id: '12', day: 'ter', period: 6, subjectName: 'Inglês' },

  { id: '13', day: 'qua', period: 1, subjectName: 'Língua Portuguesa' },
  { id: '14', day: 'qua', period: 2, subjectName: 'Língua Portuguesa' },
  { id: '15', day: 'qua', period: 3, subjectName: 'História' },
  { id: '16', day: 'qua', period: 4, subjectName: 'Física' },
  { id: '17', day: 'qua', period: 5, subjectName: 'Matemática' },
  { id: '18', day: 'qua', period: 6, subjectName: 'Geografia' },

  { id: '19', day: 'qui', period: 1, subjectName: 'Biologia' },
  { id: '20', day: 'qui', period: 2, subjectName: 'Química' },
  { id: '21', day: 'qui', period: 3, subjectName: 'Matemática' },
  { id: '22', day: 'qui', period: 4, subjectName: 'História' },
  { id: '23', day: 'qui', period: 5, subjectName: 'Geografia' },
  { id: '24', day: 'qui', period: 6, subjectName: 'Inglês' },

  { id: '25', day: 'sex', period: 1, subjectName: 'Física' },
  { id: '26', day: 'sex', period: 2, subjectName: 'Química' },
  { id: '27', day: 'sex', period: 3, subjectName: 'Língua Portuguesa' },
  { id: '28', day: 'sex', period: 4, subjectName: 'Biologia' },
  { id: '29', day: 'sex', period: 5, subjectName: 'Matemática' },
  { id: '30', day: 'sex', period: 6, subjectName: 'História' },
];

const DEFAULT_EXAMS: Exam[] = [
  { id: 'e1', subjectId: 'matematica', date: '2026-08-15', topic: 'Funções Quadráticas & Exponenciais', status: 'agendada', notes: 'Revisar exercícios da página 45 a 60.' },
  { id: 'e2', subjectId: 'portugues', date: '2026-08-18', topic: 'Sintaxe e Regência Verbal', status: 'estudar', notes: 'Morfologia e concordância nominal.' },
  { id: 'e3', subjectId: 'fisica', date: '2026-08-22', topic: 'Leis de Newton e Cinemática', status: 'agendada', notes: 'Fórmulas de aceleração constante.' }
];

const DEFAULT_TOPICS: DisciplineTopic[] = [
  { id: 't1', subjectId: 'matematica', title: 'Equações de 2º Grau', status: 'concluido' },
  { id: 't2', subjectId: 'matematica', title: 'Função Afim (1º Grau)', status: 'concluido' },
  { id: 't3', subjectId: 'matematica', title: 'Função Quadrática (Parábolas)', status: 'em_andamento' },
  { id: 't4', subjectId: 'matematica', title: 'Função Exponencial & Logaritmos', status: 'nao_iniciado' },
  { id: 't5', subjectId: 'portugues', title: 'Análise Sintática Completa', status: 'concluido' },
  { id: 't6', subjectId: 'portugues', title: 'Regência e Crase', status: 'em_andamento' },
  { id: 't7', subjectId: 'portugues', title: 'Literatura: Romantismo', status: 'nao_iniciado' }
];

export default function SchoolSection() {
  const [activeSubTab, setActiveSubTab] = useState<'escola' | 'disciplinas'>('escola');
  
  // STATE WITH LOCAL STORAGE PERSISTENCE
  const [subjects, setSubjects] = useState<SchoolSubject[]>(() => {
    const saved = localStorage.getItem('lifehub_school_subjects_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SUBJECTS;
  });

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    const saved = localStorage.getItem('lifehub_school_schedule_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SCHEDULE;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('lifehub_school_exams_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_EXAMS;
  });

  const [topics, setTopics] = useState<DisciplineTopic[]>(() => {
    const saved = localStorage.getItem('lifehub_school_topics_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_TOPICS;
  });

  const [notes, setNotes] = useState<DisciplineNote[]>(() => {
    const saved = localStorage.getItem('lifehub_school_notes_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'n1', subjectId: 'matematica', content: 'Focar na fórmula de Báskara para a prova de agosto.', updatedAt: '2026-07-28' }
    ];
  });

  // MODALS & DETAIL SELECTION STATE
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SchoolSubject | null>(null);
  const [selectedBimestreTab, setSelectedBimestreTab] = useState<number>(1);

  const [selectedDisciplineModal, setSelectedDisciplineModal] = useState<SchoolSubject | null>(null);
  
  // Edit schedule slot modal state
  const [editingSlot, setEditingSlot] = useState<{ day: 'seg' | 'ter' | 'qua' | 'qui' | 'sex'; period: 1 | 2 | 3 | 4 | 5 | 6; currentSubject: string } | null>(null);
  const [slotSelectedSubject, setSlotSelectedSubject] = useState<string>('');
  const [slotCustomSubject, setSlotCustomSubject] = useState<string>('');

  // Add subject modal state
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectTeacher, setNewSubjectTeacher] = useState('');

  // Edit subject modal state
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectTeacher, setEditSubjectTeacher] = useState('');

  // Confirm delete subject state
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState<string | null>(null);

  // Inline forms for Discipline detail modal
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const [isAddingExam, setIsAddingExam] = useState(false);
  const [newExamTopic, setNewExamTopic] = useState('');
  const [newExamDate, setNewExamDate] = useState(new Date().toISOString().split('T')[0]);

  // Save changes to localStorage on state updates
  useEffect(() => {
    localStorage.setItem('lifehub_school_subjects_v2', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('lifehub_school_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('lifehub_school_exams_v2', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('lifehub_school_topics_v2', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('lifehub_school_notes_v2', JSON.stringify(notes));
  }, [notes]);

  // CALCULATION HELPERS
  const calculateAverage = (subject: SchoolSubject): { media: string; situacao: string; statusBg: string } => {
    let sum = 0;
    let count = 0;
    let totalFaltas = 0;

    [1, 2, 3, 4].forEach(b => {
      const bData = subject.bimestres[b];
      if (bData) {
        if (bData.nota !== null && !isNaN(bData.nota)) {
          sum += bData.nota;
          count++;
        }
        totalFaltas += (bData.faltas || 0);
      }
    });

    if (count === 0) {
      return { media: '-', situacao: 'Cursando', statusBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }

    const avg = sum / count;
    const mediaStr = avg.toFixed(1);

    if (totalFaltas >= 25) {
      return { media: mediaStr, situacao: 'Reprovado Faltas', statusBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' };
    }
    if (avg >= 6.0) {
      return { media: mediaStr, situacao: 'Aprovado', statusBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
    }
    return { media: mediaStr, situacao: 'Em Recuperação', statusBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
  };

  const getOverallAverage = (): string => {
    let totalSum = 0;
    let totalCount = 0;
    subjects.forEach(s => {
      [1, 2, 3, 4].forEach(b => {
        const nota = s.bimestres[b]?.nota;
        if (nota !== null && !isNaN(nota)) {
          totalSum += nota;
          totalCount++;
        }
      });
    });
    if (totalCount === 0) return '-';
    return (totalSum / totalCount).toFixed(1);
  };

  const getSubjectTotalFaltas = (subject: SchoolSubject): number => {
    return [1, 2, 3, 4].reduce((acc, b) => acc + (subject.bimestres[b]?.faltas || 0), 0);
  };

  // SUBJECT HANDLERS
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const id = newSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newSub: SchoolSubject = {
      id,
      name: newSubjectName.trim(),
      teacher: newSubjectTeacher.trim() || 'Professor não especificado',
      bimestres: {
        1: { nota: null, faltas: 0 },
        2: { nota: null, faltas: 0 },
        3: { nota: null, faltas: 0 },
        4: { nota: null, faltas: 0 }
      }
    };

    setSubjects(prev => [...prev, newSub]);
    setNewSubjectName('');
    setNewSubjectTeacher('');
    setIsAddingSubject(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (selectedSubjectModal?.id === id) setSelectedSubjectModal(null);
    if (selectedDisciplineModal?.id === id) setSelectedDisciplineModal(null);
    setConfirmDeleteSubjectId(null);
  };

  const handleUpdateSubjectDetails = (id: string, name: string, teacher: string) => {
    if (!name.trim()) return;
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: name.trim(), teacher: teacher.trim() || 'Professor não especificado' } : s));
    if (selectedSubjectModal?.id === id) {
      setSelectedSubjectModal(prev => prev ? { ...prev, name: name.trim(), teacher: teacher.trim() || 'Professor não especificado' } : null);
    }
    if (selectedDisciplineModal?.id === id) {
      setSelectedDisciplineModal(prev => prev ? { ...prev, name: name.trim(), teacher: teacher.trim() || 'Professor não especificado' } : null);
    }
    setIsEditingSubject(false);
  };

  const handleUpdateGradeAndAbsences = (subjectId: string, bimestre: number, nota: number | null, faltas: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        bimestres: {
          ...s.bimestres,
          [bimestre]: {
            nota: nota === null ? null : Math.min(10, Math.max(0, parseFloat(nota.toFixed(1)))),
            faltas: Math.max(0, faltas)
          }
        }
      };
    }));

    // Update active modal reference if open
    setSelectedSubjectModal(prev => {
      if (!prev || prev.id !== subjectId) return prev;
      return {
        ...prev,
        bimestres: {
          ...prev.bimestres,
          [bimestre]: {
            nota: nota === null ? null : Math.min(10, Math.max(0, parseFloat(nota.toFixed(1)))),
            faltas: Math.max(0, faltas)
          }
        }
      };
    });
  };

  // SCHEDULE SLOT HANDLER (REQS 6 & 7: Editar grade de horários simples)
  const handleOpenEditSlot = (day: 'seg' | 'ter' | 'qua' | 'qui' | 'sex', period: 1 | 2 | 3 | 4 | 5 | 6) => {
    const slot = schedule.find(s => s.day === day && s.period === period);
    const currSub = slot?.subjectName || '';
    setEditingSlot({ day, period, currentSubject: currSub });
    setSlotSelectedSubject(currSub);
    setSlotCustomSubject('');
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;
    const finalSubjectName = (slotCustomSubject.trim() || slotSelectedSubject).trim();

    setSchedule(prev => {
      const existingIndex = prev.findIndex(s => s.day === editingSlot.day && s.period === editingSlot.period);
      if (finalSubjectName === '') {
        // Clear slot
        return prev.filter(s => !(s.day === editingSlot.day && s.period === editingSlot.period));
      }
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], subjectName: finalSubjectName };
        return updated;
      }
      return [...prev, { id: Date.now().toString(), day: editingSlot.day, period: editingSlot.period, subjectName: finalSubjectName }];
    });

    setEditingSlot(null);
  };

  const getSlotSubject = (day: 'seg' | 'ter' | 'qua' | 'qui' | 'sex', period: 1 | 2 | 3 | 4 | 5 | 6) => {
    return schedule.find(s => s.day === day && s.period === period)?.subjectName || '';
  };

  const DAYS_MAP: { id: 'seg' | 'ter' | 'qua' | 'qui' | 'sex'; label: string }[] = [
    { id: 'seg', label: 'SEGUNDA' },
    { id: 'ter', label: 'TERÇA' },
    { id: 'qua', label: 'QUARTA' },
    { id: 'qui', label: 'QUINTA' },
    { id: 'sex', label: 'SEXTA' }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION & SUB-TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Escola</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Matérias, bimestres, notas e grade semanal</p>
          </div>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('escola')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'escola'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Escola</span>
          </button>

          <button
            onClick={() => setActiveSubTab('disciplinas')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'disciplinas'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Disciplinas</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. SUB-ABA: ESCOLA (VISÃO RESUMIDA DA ESCOLA, MATÉRIAS E HORÁRIOS) */}
      {/* ==================================================================== */}
      {activeSubTab === 'escola' && (
        <div className="space-y-6">
          
          {/* TOP SUMMARY CARDS (CLEAN & HIGH HIERARCHY - REQ 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">📚 Escola</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{subjects.length} <span className="text-xs font-normal text-slate-500">matérias</span></span>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-xl">Média: {getOverallAverage()}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">📅 Próximas Provas</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{exams.filter(e => e.status !== 'concluida').length} <span className="text-xs font-normal text-slate-500">provas</span></span>
                <span className="text-[11px] text-slate-400">Agendadas</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">🕐 Grade de Horários</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Grade Semanal</span>
              </div>
              <a href="#grade-horarios" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                Consultar →
              </a>
            </div>
          </div>

          {/* MATÉRIAS GRID (CARDS SIMPLES REQ 4) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Matérias do Ano Letivo</h2>
              <button
                onClick={() => setIsAddingSubject(true)}
                className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus size={16} /> Nova Matéria
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map(subject => {
                const { media, situacao, statusBg } = calculateAverage(subject);

                return (
                  <div
                    key={subject.id}
                    onClick={() => { setSelectedSubjectModal(subject); setSelectedBimestreTab(1); }}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subject.teacher}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                        {situacao}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-400 font-medium">Média Geral:</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">{media}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRADE DE HORÁRIOS (SIMPLE WEEKLY GRID REQ 6 & 7) */}
          <div id="grade-horarios" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Grade de Horários</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clique em qualquer horário para alterar a matéria</p>
              </div>
            </div>

            {/* HORIZONTAL SCROLLABLE SCHEDULE TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold">
                  <tr>
                    <th className="p-3 w-20 text-center border-r border-slate-200/60 dark:border-slate-800">AULA</th>
                    {DAYS_MAP.map(day => (
                      <th key={day.id} className="p-3 text-center border-r border-slate-200/60 dark:border-slate-800 last:border-r-0 min-w-[110px]">
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[1, 2, 3].map(period => (
                    <tr key={`p-${period}`}>
                      <td className="p-3 text-center font-bold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200/60 dark:border-slate-800">
                        {period}º Aula
                      </td>
                      {DAYS_MAP.map(day => {
                        const subName = getSlotSubject(day.id, period as any);
                        return (
                          <td
                            key={`${day.id}-${period}`}
                            onClick={() => handleOpenEditSlot(day.id, period as any)}
                            className="p-3 text-center border-r border-slate-200/60 dark:border-slate-800 last:border-r-0 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer font-extrabold text-slate-800 dark:text-slate-200 select-none"
                          >
                            {subName ? (
                              <span className="px-2 py-1 bg-sky-100/70 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded-lg block truncate">
                                {subName}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-normal hover:text-sky-500 text-[11px]">+ definir</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* INTERVALO */}
                  <tr className="bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-center">
                    <td colSpan={6} className="p-2 text-[11px] tracking-wider uppercase">
                      ☕ INTERVALO / RECREIO
                    </td>
                  </tr>

                  {[4, 5, 6].map(period => (
                    <tr key={`p-${period}`}>
                      <td className="p-3 text-center font-bold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200/60 dark:border-slate-800">
                        {period}º Aula
                      </td>
                      {DAYS_MAP.map(day => {
                        const subName = getSlotSubject(day.id, period as any);
                        return (
                          <td
                            key={`${day.id}-${period}`}
                            onClick={() => handleOpenEditSlot(day.id, period as any)}
                            className="p-3 text-center border-r border-slate-200/60 dark:border-slate-800 last:border-r-0 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer font-extrabold text-slate-800 dark:text-slate-200 select-none"
                          >
                            {subName ? (
                              <span className="px-2 py-1 bg-sky-100/70 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded-lg block truncate">
                                {subName}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-normal hover:text-sky-500 text-[11px]">+ definir</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SUB-ABA: DISCIPLINAS (CARDS DAS DISCIPLINAS E DETALHES REQ 8) */}
      {/* ==================================================================== */}
      {activeSubTab === 'disciplinas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Disciplinas</h2>
            <span className="text-xs text-slate-500">Clique em uma disciplina para ver tópicos, provas e anotações</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map(subject => {
              const subTopics = topics.filter(t => t.subjectId === subject.id);
              const subExams = exams.filter(e => e.subjectId === subject.id && e.status !== 'concluida');

              return (
                <div
                  key={subject.id}
                  onClick={() => setSelectedDisciplineModal(subject)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-sky-400 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-sky-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{subject.teacher}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>{subTopics.length} conteúdos</span>
                    {subExams.length > 0 ? (
                      <span className="text-amber-600 font-bold">{subExams.length} prova próxima</span>
                    ) : (
                      <span className="text-slate-400">Sem provas</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: DETALHES DA MATÉRIA / BIMESTRES (ESCOLA REQ 5) */}
      {/* ==================================================================== */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            
            {/* HEADER WITH EDIT TOGGLE */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              {isEditingSubject ? (
                <div className="w-full space-y-2 pr-4">
                  <input
                    type="text"
                    value={editSubjectName}
                    onChange={e => setEditSubjectName(e.target.value)}
                    placeholder="Nome da Matéria"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={editSubjectTeacher}
                    onChange={e => setEditSubjectTeacher(e.target.value)}
                    placeholder="Professor"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateSubjectDetails(selectedSubjectModal.id, editSubjectName, editSubjectTeacher)}
                      className="px-3 py-1 bg-sky-600 text-white font-bold text-xs rounded-lg"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingSubject(false)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedSubjectModal.name}</h3>
                    <button
                      onClick={() => {
                        setEditSubjectName(selectedSubjectModal.name);
                        setEditSubjectTeacher(selectedSubjectModal.teacher);
                        setIsEditingSubject(true);
                      }}
                      className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                      title="Editar Matéria"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedSubjectModal.teacher}</p>
                </div>
              )}
              <button onClick={() => { setSelectedSubjectModal(null); setIsEditingSubject(false); setConfirmDeleteSubjectId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* OVERALL SUMMARY IN MODAL */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">MÉDIA GERAL</span>
                <span className="text-xl font-black text-sky-600 dark:text-sky-400">{calculateAverage(selectedSubjectModal).media}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">TOTAL DE FALTAS</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">{getSubjectTotalFaltas(selectedSubjectModal)}</span>
              </div>
            </div>

            {/* BIMESTRES TAB SELECTOR */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {[1, 2, 3, 4].map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBimestreTab(b)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                      selectedBimestreTab === b
                        ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {b}º BIM
                  </button>
                ))}
              </div>

              {/* ACTIVE BIMESTRE FORM */}
              {(() => {
                const bData = selectedSubjectModal.bimestres[selectedBimestreTab] || { nota: null, faltas: 0 };

                return (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Lançamentos do {selectedBimestreTab}º Bimestre
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      {/* NOTA INPUT */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Nota (0 - 10)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="Ex: 8.5"
                          value={bData.nota !== null ? bData.nota : ''}
                          onChange={e => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            handleUpdateGradeAndAbsences(selectedSubjectModal.id, selectedBimestreTab, val, bData.faltas);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* FALTAS INPUT */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Faltas</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={bData.faltas || 0}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            handleUpdateGradeAndAbsences(selectedSubjectModal.id, selectedBimestreTab, bData.nota, val);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* CONFIRM DELETE INLINE OR DELETE BUTTON */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {confirmDeleteSubjectId === selectedSubjectModal.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-bold">Excluir matéria?</span>
                  <button
                    onClick={() => handleDeleteSubject(selectedSubjectModal.id)}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Sim, excluir
                  </button>
                  <button
                    onClick={() => setConfirmDeleteSubjectId(null)}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteSubjectId(selectedSubjectModal.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold"
                >
                  <Trash2 size={14} /> Excluir Matéria
                </button>
              )}
              <button
                onClick={() => { setSelectedSubjectModal(null); setIsEditingSubject(false); setConfirmDeleteSubjectId(null); }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Salvar & Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: DETALHES DA DISCIPLINA (DISCIPLINAS SUB-ABA REQ 8) */}
      {/* ==================================================================== */}
      {selectedDisciplineModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedDisciplineModal.name}</h3>
                <p className="text-xs text-slate-500">{selectedDisciplineModal.teacher}</p>
              </div>
              <button onClick={() => { setSelectedDisciplineModal(null); setIsAddingTopic(false); setIsAddingExam(false); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* CONTEÚDOS (TÓPICOS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Conteúdos da Disciplina</h4>
                {!isAddingTopic && (
                  <button
                    onClick={() => setIsAddingTopic(true)}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Conteúdo
                  </button>
                )}
              </div>

              {isAddingTopic && (
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do conteúdo/tópico..."
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingTopic(false); setNewTopicTitle(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newTopicTitle.trim()) {
                          setTopics(prev => [...prev, { id: Date.now().toString(), subjectId: selectedDisciplineModal.id, title: newTopicTitle.trim(), status: 'nao_iniciado' }]);
                          setNewTopicTitle('');
                          setIsAddingTopic(false);
                        }
                      }}
                      className="px-3 py-1 bg-sky-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {topics.filter(t => t.subjectId === selectedDisciplineModal.id).map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => {
                      const nextSt: Record<string, 'concluido' | 'em_andamento' | 'nao_iniciado'> = {
                        'nao_iniciado': 'em_andamento',
                        'em_andamento': 'concluido',
                        'concluido': 'nao_iniciado'
                      };
                      setTopics(prev => prev.map(t => t.id === topic.id ? { ...t, status: nextSt[t.status] } : t));
                    }}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className={`font-bold ${topic.status === 'concluido' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {topic.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold">
                        {topic.status === 'concluido' && '🟢 CONCLUÍDO'}
                        {topic.status === 'em_andamento' && '🟡 EM ANDAMENTO'}
                        {topic.status === 'nao_iniciado' && '⚪ NÃO INICIADO'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setTopics(prev => prev.filter(t => t.id !== topic.id));
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Excluir Conteúdo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRÓXIMAS PROVAS */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Próximas Provas</h4>
                {!isAddingExam && (
                  <button
                    onClick={() => setIsAddingExam(true)}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Agendar Prova
                  </button>
                )}
              </div>

              {isAddingExam && (
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Assunto da prova..."
                    value={newExamTopic}
                    onChange={e => setNewExamTopic(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="date"
                    value={newExamDate}
                    onChange={e => setNewExamDate(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingExam(false); setNewExamTopic(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newExamTopic.trim() && newExamDate) {
                          setExams(prev => [...prev, { id: Date.now().toString(), subjectId: selectedDisciplineModal.id, topic: newExamTopic.trim(), date: newExamDate, status: 'agendada' }]);
                          setNewExamTopic('');
                          setIsAddingExam(false);
                        }
                      }}
                      className="px-3 py-1 bg-sky-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {exams.filter(e => e.subjectId === selectedDisciplineModal.id).map(exam => (
                  <div key={exam.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-800 dark:text-slate-200 font-bold block">{exam.topic}</span>
                      <span className="text-sky-600 font-medium">{exam.date}</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setExams(prev => prev.filter(ex => ex.id !== exam.id));
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Excluir Prova"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setSelectedDisciplineModal(null); setIsAddingTopic(false); setIsAddingExam(false); }}
              className="w-full py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: EDIÇÃO DE SLOT DE HORÁRIO (SINGLE SOURCE OF TRUTH REQ 6) */}
      {/* ==================================================================== */}
      {editingSlot && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Alterar Horário
              </h3>
              <button onClick={() => setEditingSlot(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {DAYS_MAP.find(d => d.id === editingSlot.day)?.label} — {editingSlot.period}º Horário
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Selecione a Matéria</label>
                <select
                  value={slotSelectedSubject}
                  onChange={e => {
                    setSlotSelectedSubject(e.target.value);
                    setSlotCustomSubject('');
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="">-- Nenhuma / Horário Vago --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Ou digite outro nome:</label>
                <input
                  type="text"
                  placeholder="Ex: Ed. Física, Filosofia..."
                  value={slotCustomSubject}
                  onChange={e => setSlotCustomSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSlotSelectedSubject('');
                  setSlotCustomSubject('');
                  handleSaveSlot();
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Limpar
              </button>
              <button
                onClick={handleSaveSlot}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ADICIONAR NOVA MATÉRIA */}
      {/* ==================================================================== */}
      {isAddingSubject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubject} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white text-base">Nova Matéria</h3>
              <button type="button" onClick={() => setIsAddingSubject(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Nome da Matéria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Filosofia, Sociologia"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Nome do Professor</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. André"
                  value={newSubjectTeacher}
                  onChange={e => setNewSubjectTeacher(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSubject(false)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Criar Matéria
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
