import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  BookMarked, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  User, 
  MapPin, 
  Award, 
  AlertCircle, 
  Scale, 
  FileText, 
  Clipboard, 
  CheckCircle2, 
  HelpCircle, 
  Book,
  CalendarDays,
  FileCheck2,
  CalendarCheck2,
  ChevronDown
} from 'lucide-react';
import { StudySubject, SchoolSubject, StudyHistory } from '../types';

// Types for our overhauled local storage schema
export interface SchoolGradeSubject {
  id: string;
  name: string;
  grade: string; // "8.5" or ""
  faltas: number;
  peso: number;
}

export interface SchoolNotesData {
  [semester: string]: SchoolGradeSubject[];
}

export interface TimetableSlot {
  subject: string;
  teacher: string;
  time: string;
  room?: string;
}

export interface TimetableDay {
  [slot: string]: TimetableSlot;
}

export interface TimetableData {
  [day: string]: TimetableDay;
}

export interface DisciplineLog {
  professor: string;
  conteudos: string;
  trabalhos: string;
  atividades: string;
  provas: string;
  observacoes: string;
}

export interface DisciplineLogMap {
  [subjectName: string]: DisciplineLog;
}

export interface PersonalContent {
  id: string;
  name: string;
  status: 'Não iniciado' | 'Em andamento' | 'Concluído';
  date: string; // YYYY-MM-DD
  notes: string;
  progress: number; // 0 to 100
}

export interface PersonalStudySubject {
  id: string;
  name: string;
  contents: PersonalContent[];
}

// Local Storage Keys
const LOCAL_STORAGE_KEY_NOTES = 'estudos_escola_notas_v1';
const LOCAL_STORAGE_KEY_TIMETABLE = 'estudos_escola_horarios_v1';
const LOCAL_STORAGE_KEY_DISCIPLINES = 'estudos_disciplinas_v1';
const LOCAL_STORAGE_KEY_PERSONAL = 'estudos_pessoais_v1';

// Preset lists and initial data
const DEFAULT_SCHOOL_SUBJECTS = [
  'Matemática',
  'Português',
  'História',
  'Geografia',
  'Biologia',
  'Química',
  'Física',
  'Inglês'
];

const WEEKDAYS = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];

const TIMETABLE_SLOTS = [
  '1ª Aula',
  '2ª Aula',
  '3ª Aula',
  '🍽 Recreio',
  '4ª Aula',
  '5ª Aula',
  '6ª Aula'
];

const INITIAL_NOTES: SchoolNotesData = {
  '1º Semestre': [
    { id: '1s-mat', name: 'Matemática', grade: '8.5', faltas: 2, peso: 2.0 },
    { id: '1s-port', name: 'Português', grade: '7.8', faltas: 4, peso: 2.0 },
    { id: '1s-hist', name: 'História', grade: '9.0', faltas: 0, peso: 1.0 },
    { id: '1s-geo', name: 'Geografia', grade: '8.2', faltas: 1, peso: 1.0 },
    { id: '1s-bio', name: 'Biologia', grade: '6.5', faltas: 3, peso: 1.5 },
    { id: '1s-quim', name: 'Química', grade: '7.0', faltas: 2, peso: 1.5 },
    { id: '1s-fis', name: 'Física', grade: '8.0', faltas: 1, peso: 1.5 },
    { id: '1s-ing', name: 'Inglês', grade: '9.5', faltas: 0, peso: 1.0 }
  ],
  '2º Semestre': [
    { id: '2s-mat', name: 'Matemática', grade: '7.8', faltas: 1, peso: 2.0 },
    { id: '2s-port', name: 'Português', grade: '8.2', faltas: 2, peso: 2.0 },
    { id: '2s-hist', name: 'História', grade: '8.5', faltas: 1, peso: 1.0 },
    { id: '2s-geo', name: 'Geografia', grade: '7.9', faltas: 3, peso: 1.0 },
    { id: '2s-bio', name: 'Biologia', grade: '7.2', faltas: 0, peso: 1.5 },
    { id: '2s-quim', name: 'Química', grade: '6.8', faltas: 4, peso: 1.5 },
    { id: '2s-fis', name: 'Física', grade: '7.5', faltas: 2, peso: 1.5 },
    { id: '2s-ing', name: 'Inglês', grade: '9.0', faltas: 1, peso: 1.0 }
  ],
  '3º Semestre': DEFAULT_SCHOOL_SUBJECTS.map((name, i) => ({
    id: `3s-${i}`, name, grade: '', faltas: 0, peso: 1.0
  })),
  '4º Semestre': DEFAULT_SCHOOL_SUBJECTS.map((name, i) => ({
    id: `4s-${i}`, name, grade: '', faltas: 0, peso: 1.0
  }))
};

const INITIAL_TIMETABLE: TimetableData = {
  'Segunda-feira': {
    '1ª Aula': { subject: 'Matemática', teacher: 'Prof. Silva', time: '07:00 - 07:50', room: 'Sala 12' },
    '2ª Aula': { subject: 'Matemática', teacher: 'Prof. Silva', time: '07:50 - 08:40', room: 'Sala 12' },
    '3ª Aula': { subject: 'Português', teacher: 'Prof. Cláudia', time: '08:40 - 09:30', room: 'Sala 15' },
    '4ª Aula': { subject: 'História', teacher: 'Prof. Roberto', time: '09:50 - 10:40', room: 'Sala 10' },
    '5ª Aula': { subject: 'Geografia', teacher: 'Prof. Fernando', time: '10:40 - 11:30', room: 'Sala 10' },
    '6ª Aula': { subject: 'Inglês', teacher: 'Prof. Aline', time: '11:30 - 12:20', room: 'Lab 1' }
  },
  'Terça-feira': {
    '1ª Aula': { subject: 'Física', teacher: 'Prof. Marcos', time: '07:00 - 07:50', room: 'Lab Física' },
    '2ª Aula': { subject: 'Física', teacher: 'Prof. Marcos', time: '07:50 - 08:40', room: 'Lab Física' },
    '3ª Aula': { subject: 'Química', teacher: 'Prof. Sandra', time: '08:40 - 09:30', room: 'Lab Química' },
    '4ª Aula': { subject: 'Biologia', teacher: 'Prof. Renato', time: '09:50 - 10:40', room: 'Sala 14' },
    '5ª Aula': { subject: 'Português', teacher: 'Prof. Cláudia', time: '10:40 - 11:30', room: 'Sala 15' },
    '6ª Aula': { subject: 'Português', teacher: 'Prof. Cláudia', time: '11:30 - 12:20', room: 'Sala 15' }
  },
  'Quarta-feira': {
    '1ª Aula': { subject: 'História', teacher: 'Prof. Roberto', time: '07:00 - 07:50', room: 'Sala 10' },
    '2ª Aula': { subject: 'Geografia', teacher: 'Prof. Fernando', time: '07:50 - 08:40', room: 'Sala 10' },
    '3ª Aula': { subject: 'Matemática', teacher: 'Prof. Silva', time: '08:40 - 09:30', room: 'Sala 12' },
    '4ª Aula': { subject: 'Biologia', teacher: 'Prof. Renato', time: '09:50 - 10:40', room: 'Sala 14' },
    '5ª Aula': { subject: 'Biologia', teacher: 'Prof. Renato', time: '10:40 - 11:30', room: 'Sala 14' },
    '6ª Aula': { subject: 'Educação Física', teacher: 'Prof. Carlos', time: '11:30 - 12:20', room: 'Quadra' }
  },
  'Quinta-feira': {
    '1ª Aula': { subject: 'Química', teacher: 'Prof. Sandra', time: '07:00 - 07:50', room: 'Lab Química' },
    '2ª Aula': { subject: 'Química', teacher: 'Prof. Sandra', time: '07:50 - 08:40', room: 'Lab Química' },
    '3ª Aula': { subject: 'Física', teacher: 'Prof. Marcos', time: '08:40 - 09:30', room: 'Lab Física' },
    '4ª Aula': { subject: 'Português', teacher: 'Prof. Cláudia', time: '09:50 - 10:40', room: 'Sala 15' },
    '5ª Aula': { subject: 'História', teacher: 'Prof. Roberto', time: '10:40 - 11:30', room: 'Sala 10' },
    '6ª Aula': { subject: 'Filosofia', teacher: 'Prof. André', time: '11:30 - 12:20', room: 'Sala 8' }
  },
  'Sexta-feira': {
    '1ª Aula': { subject: 'Inglês', teacher: 'Prof. Aline', time: '07:00 - 07:50', room: 'Lab 1' },
    '2ª Aula': { subject: 'Artes', teacher: 'Prof. Juliana', time: '07:50 - 08:40', room: 'Sala Artes' },
    '3ª Aula': { subject: 'Sociologia', teacher: 'Prof. André', time: '08:40 - 09:30', room: 'Sala 8' },
    '4ª Aula': { subject: 'Matemática', teacher: 'Prof. Silva', time: '09:50 - 10:40', room: 'Sala 12' },
    '5ª Aula': { subject: 'Matemática', teacher: 'Prof. Silva', time: '10:40 - 11:30', room: 'Sala 12' },
    '6ª Aula': { subject: 'Projeto de Vida', teacher: 'Prof. Carla', time: '11:30 - 12:20', room: 'Auditório' }
  }
};

const INITIAL_DISCIPLINES: DisciplineLogMap = {
  'Matemática': {
    professor: 'Prof. Silva',
    conteudos: '- Estudo de Funções do 1º e 2º grau\n- Introdução à Geometria Espacial\n- Matrizes e Determinantes',
    trabalhos: '- Resolução da lista de exercícios de Matrizes (Entregar até 15/07)\n- Maquete de sólidos geométricos',
    atividades: '- Exercícios do livro didático (pág. 45 a 48)\n- Desafios semanais de lógica matemática',
    provas: '- Prova Trimestral de Funções (Agendada para 20/07)\n- Simulado de Geometria',
    observacoes: 'Focar na revisão de equações quadráticas antes da prova. O professor costuma cobrar bastante interpretação de gráficos cartesianos.'
  },
  'Português': {
    professor: 'Prof. Cláudia',
    conteudos: '- Sintaxe do período composto por coordenação e subordinação\n- Literatura: Barroco e Arcadismo\n- Técnicas de argumentação para redação',
    trabalhos: '- Resenha crítica sobre "Marília de Dirceu"\n- Apresentação em grupo sobre poemas satíricos de Gregório de Matos',
    atividades: '- Análise sintática de textos do ENEM\n- Produção semanal de redação dissertativa-argumentativa',
    provas: '- Teste de Gramática (22/07)\n- Avaliação de Literatura Colonial',
    observacoes: 'Importante revisar os nexos coordenativos e subordinativos para a redação nota 1000.'
  },
  'História': {
    professor: 'Prof. Roberto',
    conteudos: '- Expansão Marítima Portuguesa\n- Brasil Colonial: Ciclo do Açúcar e Capitanias\n- Revolução Francesa e os ideais Iluministas',
    trabalhos: '- Seminário em grupo sobre as revoltas nativistas (Revolta de Beckman, Guerra dos Emboabas)',
    atividades: '- Resumos dos capítulos 4 e 5 do livro didático\n- Resolução de questões discursivas de vestibulares anteriores',
    provas: '- Prova de História Geral (18/07)\n- Teste surpresa de Brasil Colonial',
    observacoes: 'Prestar atenção nos conceitos de mercantilismo e absolutismo monárquico.'
  },
  'Física': {
    professor: 'Prof. Marcos',
    conteudos: '- Introdução à Mecânica Clássica\n- Cinemática Escalar (MRU e MRUV)\n- Vetores e Operações Vetoriais',
    trabalhos: '- Relatório do experimento no laboratório de Física sobre queda livre',
    atividades: '- Lista de 20 exercícios sobre equações do movimento\n- Atividades na plataforma online da escola',
    provas: '- Prova Escrita (15/07)\n- Trabalho prático avaliativo',
    observacoes: 'Dominar as fórmulas do movimento uniformemente variado e sua interpretação gráfica.'
  }
};

const INITIAL_PERSONAL_STUDIES: PersonalStudySubject[] = [
  {
    id: 'p-mat',
    name: 'Matemática',
    contents: [
      { id: 'pc-1', name: 'Função Afim', status: 'Em andamento', date: '2026-07-10', notes: 'Estudar taxa de variação, gráficos e equações lineares.', progress: 65 },
      { id: 'pc-2', name: 'Função Quadrática', status: 'Não iniciado', date: '2026-07-18', notes: 'Focar na fórmula de Bhaskara, coordenadas do vértice e concavidade.', progress: 0 },
      { id: 'pc-3', name: 'Geometria', status: 'Em andamento', date: '2026-07-25', notes: 'Revisão de áreas planas, volumes de prismas e pirâmides.', progress: 30 },
      { id: 'pc-4', name: 'Trigonometria', status: 'Não iniciado', date: '2026-08-01', notes: 'Teorema de Pitágoras, razões trigonométricas e ciclo trigonométrico.', progress: 0 }
    ]
  },
  {
    id: 'p-port',
    name: 'Português',
    contents: [
      { id: 'pc-5', name: 'Interpretação de Texto', status: 'Concluído', date: '2026-07-02', notes: 'Domínio sobre funções da linguagem e tipologias textuais.', progress: 100 },
      { id: 'pc-6', name: 'Redação ENEM', status: 'Em andamento', date: '2026-07-08', notes: 'Praticar a introdução, tese e proposta de intervenção social.', progress: 75 }
    ]
  },
  {
    id: 'p-hist',
    name: 'História',
    contents: [
      { id: 'pc-7', name: 'Brasil Colônia', status: 'Em andamento', date: '2026-07-05', notes: 'Estudar capitanias hereditárias, ciclo do açúcar e invasões holandesas.', progress: 50 },
      { id: 'pc-8', name: 'Era Vargas', status: 'Não iniciado', date: '2026-07-22', notes: 'Estudar Constituição de 1934, Estado Novo e CLT.', progress: 0 }
    ]
  },
  {
    id: 'p-quim',
    name: 'Química',
    contents: [
      { id: 'pc-9', name: 'Estequiometria', status: 'Em andamento', date: '2026-07-14', notes: 'Cálculos químicos, reagente limitante, excesso e grau de pureza.', progress: 40 }
    ]
  }
];

interface StudiesSectionProps {
  studies: StudySubject[];
  schoolSubjects: SchoolSubject[];
  onAddSubject: (subject: Omit<StudySubject, 'id' | 'history'>) => void;
  onUpdateSubject: (subject: StudySubject) => void;
  onDeleteSubject: (id: string) => void;
  onAddHistory: (subjectId: string, history: Omit<StudyHistory, 'id'>) => void;
  onDeleteHistory: (subjectId: string, historyId: string) => void;
  onAddSchoolSubject: (subject: Omit<SchoolSubject, 'id'>) => void;
  onUpdateSchoolSubject: (subject: SchoolSubject) => void;
  onDeleteSchoolSubject: (id: string) => void;
  forcedSubTab?: 'school' | 'studies';
}

export function getInitialSchoolSubjects(): SchoolSubject[] {
  const list: SchoolSubject[] = [];

  // Populate schoolNotes (INITIAL_NOTES)
  Object.keys(INITIAL_NOTES).forEach(semester => {
    INITIAL_NOTES[semester].forEach(subj => {
      list.push({
        id: subj.id,
        name: subj.name,
        grade: subj.grade,
        scheduleDay: 'Segunda-feira',
        scheduleTime: '',
        semester,
        faltas: subj.faltas,
        peso: subj.peso,
        type: 'grade'
      });
    });
  });

  // Populate timetable (INITIAL_TIMETABLE)
  Object.keys(INITIAL_TIMETABLE).forEach(day => {
    const slots = INITIAL_TIMETABLE[day];
    Object.keys(slots).forEach(slot => {
      const entry = slots[slot];
      list.push({
        id: `tt-${day}-${slot}`,
        name: entry.subject,
        scheduleDay: day as any,
        scheduleTime: entry.time,
        teacher: entry.teacher,
        room: entry.room,
        slot,
        type: 'timetable'
      });
    });
  });

  // Populate discipline logs (INITIAL_DISCIPLINES)
  Object.keys(INITIAL_DISCIPLINES).forEach(subjectName => {
    const log = INITIAL_DISCIPLINES[subjectName];
    list.push({
      id: `disc-${subjectName}`,
      name: subjectName,
      scheduleDay: 'Segunda-feira',
      scheduleTime: '',
      professor: log.professor,
      conteudos: log.conteudos,
      trabalhos: log.trabalhos,
      atividades: log.atividades,
      provas: log.provas,
      observacoes: log.observacoes,
      type: 'discipline'
    });
  });

  return list;
}

export function getInitialStudies(): StudySubject[] {
  return INITIAL_PERSONAL_STUDIES.map(s => ({
    id: s.id,
    name: s.name,
    grade: '',
    contentsStudied: '',
    progress: 0,
    history: [],
    contents: s.contents
  }));
}

export default function StudiesSection({
  studies = [],
  schoolSubjects = [],
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddHistory,
  onDeleteHistory,
  onAddSchoolSubject,
  onUpdateSchoolSubject,
  onDeleteSchoolSubject
}: StudiesSectionProps) {
  // Main Sub-Tab Selector: Escola (school) | Disciplinas (disciplines) | Estudos (studies)
  const [activeTab, setActiveTab] = useState<'school' | 'disciplines' | 'studies'>('school');

  // Secondary sub-tab for Escola: Notas (notas) | Grade de Horários (timetable)
  const [escolaSubTab, setEscolaSubTab] = useState<'notas' | 'timetable'>('notas');

  // Derive states dynamically from props
  const schoolNotes = React.useMemo<SchoolNotesData>(() => {
    const notes: SchoolNotesData = {
      '1º Semestre': [],
      '2º Semestre': [],
      '3º Semestre': [],
      '4º Semestre': []
    };
    
    const grades = schoolSubjects.filter(s => s.type === 'grade');
    if (grades.length === 0) {
      return INITIAL_NOTES;
    }
    
    grades.forEach(s => {
      const sem = s.semester || '1º Semestre';
      if (notes[sem]) {
        notes[sem].push({
          id: s.id,
          name: s.name,
          grade: s.grade || '',
          faltas: s.faltas || 0,
          peso: s.peso || 1.0
        });
      }
    });
    return notes;
  }, [schoolSubjects]);

  const timetable = React.useMemo<TimetableData>(() => {
    const tt: TimetableData = {
      'Segunda-feira': {},
      'Terça-feira': {},
      'Quarta-feira': {},
      'Quinta-feira': {},
      'Sexta-feira': {}
    };
    
    const ttItems = schoolSubjects.filter(s => s.type === 'timetable');
    if (ttItems.length === 0) {
      return INITIAL_TIMETABLE;
    }
    
    ttItems.forEach(s => {
      const day = s.scheduleDay;
      const slot = s.slot;
      if (day && slot && tt[day]) {
        tt[day][slot] = {
          subject: s.name,
          teacher: s.teacher || '',
          time: s.scheduleTime || '',
          room: s.room || ''
        };
      }
    });
    return tt;
  }, [schoolSubjects]);

  const disciplineLogs = React.useMemo<DisciplineLogMap>(() => {
    const logs: DisciplineLogMap = {};
    const discItems = schoolSubjects.filter(s => s.type === 'discipline');
    
    // Merge with INITIAL_DISCIPLINES so fallback values exist
    Object.keys(INITIAL_DISCIPLINES).forEach(name => {
      logs[name] = INITIAL_DISCIPLINES[name];
    });
    
    discItems.forEach(s => {
      logs[s.name] = {
        professor: s.professor || '',
        conteudos: s.conteudos || '',
        trabalhos: s.trabalhos || '',
        atividades: s.atividades || '',
        provas: s.provas || '',
        observacoes: s.observacoes || ''
      };
    });
    return logs;
  }, [schoolSubjects]);

  const personalStudies = React.useMemo<PersonalStudySubject[]>(() => {
    if (studies.length === 0) {
      return INITIAL_PERSONAL_STUDIES;
    }
    return studies.map(s => ({
      id: s.id,
      name: s.name,
      contents: s.contents || []
    }));
  }, [studies]);

  // Active Selected Semester for Notas
  const [selectedSemester, setSelectedSemester] = useState<string>('1º Semestre');

  // Active Selected Day for Weekly timetable
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<string>('Segunda-feira');

  // Active Selected Discipline for Disciplines logs
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');

  // Dropdown states (id format: 'type-id' e.g. 'notes-1s-mat')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modal Configuration states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectModalData, setSubjectModalData] = useState<{
    id?: string;
    semester?: string;
    name: string;
    grade: string;
    faltas: number;
    peso: number;
  } | null>(null);

  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [timetableModalData, setTimetableModalData] = useState<{
    day: string;
    slot: string;
    subject: string;
    teacher: string;
    time: string;
    room: string;
  } | null>(null);

  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [disciplineModalData, setDisciplineModalData] = useState<{
    subjectName: string;
    professor: string;
    conteudos: string;
    trabalhos: string;
    atividades: string;
    provas: string;
    observacoes: string;
  } | null>(null);

  const [showPersonalSubjectModal, setShowPersonalSubjectModal] = useState(false);
  const [personalSubjectModalData, setPersonalSubjectModalData] = useState<{
    id?: string;
    name: string;
  } | null>(null);

  const [showPersonalContentModal, setShowPersonalContentModal] = useState(false);
  const [personalContentModalData, setPersonalContentModalData] = useState<{
    id?: string;
    subjectId: string;
    name: string;
    status: 'Não iniciado' | 'Em andamento' | 'Concluído';
    date: string;
    notes: string;
    progress: number;
  } | null>(null);

  // Close dropdowns on outside click
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique school subjects to dynamically feed the Disciplinas tab
  const getUniqueSchoolSubjects = (): string[] => {
    const subjectsSet = new Set<string>();
    Object.keys(schoolNotes).forEach(sem => {
      const subjectsList = schoolNotes[sem] || [];
      subjectsList.forEach(subj => {
        if (subj.name.trim()) {
          subjectsSet.add(subj.name.trim());
        }
      });
    });
    return Array.from(subjectsSet).sort();
  };

  const uniqueSchoolSubjects = getUniqueSchoolSubjects();

  // Keep selectedDiscipline in sync with unique school subjects list
  useEffect(() => {
    if (uniqueSchoolSubjects.length > 0) {
      if (!selectedDiscipline || !uniqueSchoolSubjects.includes(selectedDiscipline)) {
        setSelectedDiscipline(uniqueSchoolSubjects[0]);
      }
    } else {
      setSelectedDiscipline('');
    }
  }, [schoolNotes]);

  // Handle active dropdown toggles safely
  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // --- ACTIONS: SCHOOL NOTES ---
  const handleOpenAddSubject = (semester: string) => {
    setSubjectModalData({
      semester,
      name: '',
      grade: '',
      faltas: 0,
      peso: 1.0
    });
    setShowSubjectModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenEditSubject = (semester: string, subject: SchoolGradeSubject) => {
    setSubjectModalData({
      id: subject.id,
      semester,
      name: subject.name,
      grade: subject.grade,
      faltas: subject.faltas,
      peso: subject.peso
    });
    setShowSubjectModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteSubject = (semester: string, subjectId: string) => {
    const subjectToDelete = schoolSubjects.find(s => s.id === subjectId);
    if (subjectToDelete && confirm(`Tem certeza que deseja excluir a matéria "${subjectToDelete.name}" de todas as avaliações/semestres?`)) {
      const nameToDelete = subjectToDelete.name;
      schoolSubjects.forEach(s => {
        if (s.type === 'grade' && s.name.toLowerCase() === nameToDelete.toLowerCase()) {
          onDeleteSchoolSubject(s.id);
        }
      });
    }
    setOpenDropdownId(null);
  };

  const handleSaveSubjectModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectModalData) return;

    const { id, semester, name, grade, faltas, peso } = subjectModalData;
    if (!semester || !name.trim()) return;

    const semesters = ['1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre'];
    const nameTrimmed = name.trim();

    if (id) {
      const oldRecord = schoolSubjects.find(s => s.id === id);
      const oldName = oldRecord ? oldRecord.name : '';

      schoolSubjects.forEach(s => {
        if (s.type === 'grade') {
          if (s.id === id) {
            onUpdateSchoolSubject({
              ...s,
              name: nameTrimmed,
              grade,
              faltas,
              peso
            });
          } else if (oldName && s.name.toLowerCase() === oldName.toLowerCase()) {
            onUpdateSchoolSubject({
              ...s,
              name: nameTrimmed
            });
          }
        }
      });
    } else {
      semesters.forEach(sem => {
        const exists = schoolSubjects.some(
          s => s.type === 'grade' && s.semester === sem && s.name.toLowerCase() === nameTrimmed.toLowerCase()
        );
        if (!exists) {
          onAddSchoolSubject({
            name: nameTrimmed,
            grade: sem === semester ? grade : '',
            scheduleDay: 'Segunda-feira',
            scheduleTime: '',
            semester: sem,
            faltas: sem === semester ? faltas : 0,
            peso: sem === semester ? peso : 1.0,
            type: 'grade'
          } as any);
        }
      });
    }

    const discExists = schoolSubjects.some(s => s.type === 'discipline' && s.name.toLowerCase() === nameTrimmed.toLowerCase());
    if (!discExists) {
      onAddSchoolSubject({
        name: nameTrimmed,
        scheduleDay: 'Segunda-feira',
        scheduleTime: '',
        professor: '',
        conteudos: '',
        trabalhos: '',
        atividades: '',
        provas: '',
        observacoes: '',
        type: 'discipline'
      } as any);
    }

    setShowSubjectModal(false);
    setSubjectModalData(null);
  };

  // --- ACTIONS: TIMETABLE ---
  const handleOpenConfigureSlot = (day: string, slotName: string, slotData?: TimetableSlot) => {
    setTimetableModalData({
      day,
      slot: slotName,
      subject: slotData?.subject || '',
      teacher: slotData?.teacher || '',
      time: slotData?.time || (slotName === '1ª Aula' ? '07:00 - 07:50' : 
                               slotName === '2ª Aula' ? '07:50 - 08:40' : 
                               slotName === '3ª Aula' ? '08:40 - 09:30' : 
                               slotName === '4ª Aula' ? '09:50 - 10:40' : 
                               slotName === '5ª Aula' ? '10:40 - 11:30' : '11:30 - 12:20'),
      room: slotData?.room || ''
    });
    setShowTimetableModal(true);
    setOpenDropdownId(null);
  };

  const handleClearSlot = (day: string, slotName: string) => {
    if (confirm(`Limpar horário da ${slotName} de ${day}?`)) {
      const existing = schoolSubjects.find(
        s => s.type === 'timetable' && s.scheduleDay === day && s.slot === slotName
      );
      if (existing) {
        onDeleteSchoolSubject(existing.id);
      }
    }
    setOpenDropdownId(null);
  };

  const handleSaveTimetableModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timetableModalData) return;

    const { day, slot, subject, teacher, time, room } = timetableModalData;
    if (!subject.trim()) return;

    const existing = schoolSubjects.find(
      s => s.type === 'timetable' && s.scheduleDay === day && s.slot === slot
    );

    if (existing) {
      onUpdateSchoolSubject({
        ...existing,
        name: subject.trim(),
        teacher: teacher.trim(),
        scheduleTime: time.trim(),
        room: room.trim()
      });
    } else {
      onAddSchoolSubject({
        name: subject.trim(),
        scheduleDay: day as any,
        scheduleTime: time.trim(),
        teacher: teacher.trim(),
        room: room.trim(),
        slot,
        type: 'timetable'
      } as any);
    }

    setShowTimetableModal(false);
    setTimetableModalData(null);
  };

  // --- ACTIONS: DISCIPLINE DETAILS ---
  const handleOpenEditDiscipline = (subjectName: string) => {
    const log = disciplineLogs[subjectName] || {
      professor: '',
      conteudos: '',
      trabalhos: '',
      atividades: '',
      provas: '',
      observacoes: ''
    };
    setDisciplineModalData({
      subjectName,
      professor: log.professor,
      conteudos: log.conteudos,
      trabalhos: log.trabalhos,
      atividades: log.atividades,
      provas: log.provas,
      observacoes: log.observacoes
    });
    setShowDisciplineModal(true);
    setOpenDropdownId(null);
  };

  const handleClearDiscipline = (subjectName: string) => {
    if (confirm(`Excluir todos os registros salvos da disciplina "${subjectName}"?`)) {
      const existing = schoolSubjects.find(
        s => s.type === 'discipline' && s.name.toLowerCase() === subjectName.toLowerCase()
      );
      if (existing) {
        onUpdateSchoolSubject({
          ...existing,
          professor: '',
          conteudos: '',
          trabalhos: '',
          atividades: '',
          provas: '',
          observacoes: ''
        });
      }
    }
    setOpenDropdownId(null);
  };

  const handleSaveDisciplineModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disciplineModalData) return;

    const { subjectName, professor, conteudos, trabalhos, atividades, provas, observacoes } = disciplineModalData;

    const existing = schoolSubjects.find(
      s => s.type === 'discipline' && s.name.toLowerCase() === subjectName.toLowerCase()
    );

    if (existing) {
      onUpdateSchoolSubject({
        ...existing,
        professor: professor.trim(),
        conteudos,
        trabalhos,
        atividades,
        provas,
        observacoes
      });
    } else {
      onAddSchoolSubject({
        name: subjectName,
        scheduleDay: 'Segunda-feira',
        scheduleTime: '',
        professor: professor.trim(),
        conteudos,
        trabalhos,
        atividades,
        provas,
        observacoes,
        type: 'discipline'
      } as any);
    }

    setShowDisciplineModal(false);
    setDisciplineModalData(null);
  };

  // --- ACTIONS: PERSONAL STUDIES (ESTUDOS) ---
  const handleOpenAddPersonalSubject = () => {
    setPersonalSubjectModalData({
      name: ''
    });
    setShowPersonalSubjectModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenEditPersonalSubject = (subject: PersonalStudySubject) => {
    setPersonalSubjectModalData({
      id: subject.id,
      name: subject.name
    });
    setShowPersonalSubjectModal(true);
    setOpenDropdownId(null);
  };

  const handleDeletePersonalSubject = (subjectId: string, subjectName: string) => {
    if (confirm(`Excluir completamente a matéria "${subjectName}" e todos os seus tópicos de estudo pessoal?`)) {
      onDeleteSubject(subjectId);
    }
    setOpenDropdownId(null);
  };

  const handleSavePersonalSubjectModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalSubjectModalData) return;

    const { id, name } = personalSubjectModalData;
    if (!name.trim()) return;

    if (id) {
      const existing = studies.find(s => s.id === id);
      if (existing) {
        onUpdateSubject({
          ...existing,
          name: name.trim()
        });
      }
    } else {
      onAddSubject({
        name: name.trim(),
        grade: '',
        contentsStudied: '',
        progress: 0,
        contents: []
      } as any);
    }

    setShowPersonalSubjectModal(false);
    setPersonalSubjectModalData(null);
  };

  // Content Items actions (Sub-lists)
  const handleOpenAddPersonalContent = (subjectId: string) => {
    setPersonalContentModalData({
      subjectId,
      name: '',
      status: 'Não iniciado',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      progress: 0
    });
    setShowPersonalContentModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenEditPersonalContent = (subjectId: string, content: PersonalContent) => {
    setPersonalContentModalData({
      id: content.id,
      subjectId,
      name: content.name,
      status: content.status,
      date: content.date || new Date().toISOString().split('T')[0],
      notes: content.notes,
      progress: content.progress
    });
    setShowPersonalContentModal(true);
    setOpenDropdownId(null);
  };

  const handleDeletePersonalContent = (subjectId: string, contentId: string) => {
    if (confirm('Deseja realmente remover este tópico de estudo?')) {
      const subject = studies.find(s => s.id === subjectId);
      if (subject) {
        onUpdateSubject({
          ...subject,
          contents: (subject.contents || []).filter(c => c.id !== contentId)
        });
      }
    }
    setOpenDropdownId(null);
  };

  const handleSavePersonalContentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalContentModalData) return;

    const { id, subjectId, name, status, date, notes, progress } = personalContentModalData;
    if (!name.trim()) return;

    const subject = studies.find(s => s.id === subjectId);
    if (!subject) return;

    const currentContents = subject.contents || [];

    if (id) {
      // Editing
      const updatedContents = currentContents.map(c => c.id === id ? {
        ...c,
        name: name.trim(),
        status,
        date,
        notes,
        progress: status === 'Concluído' ? 100 : status === 'Não iniciado' ? 0 : progress
      } : c);
      onUpdateSubject({
        ...subject,
        contents: updatedContents
      });
    } else {
      // Adding
      const newContent: PersonalContent = {
        id: 'p-cont-' + Date.now(),
        name: name.trim(),
        status,
        date,
        notes,
        progress: status === 'Concluído' ? 100 : status === 'Não iniciado' ? 0 : progress
      };
      onUpdateSubject({
        ...subject,
        contents: [...currentContents, newContent]
      });
    }

    setShowPersonalContentModal(false);
    setPersonalContentModalData(null);
  };

  // --- STATS CALCULATORS ---
  const calculateSemesterStats = (semester: string) => {
    const list = schoolNotes[semester] || [];
    let sumGrades = 0;
    let sumWeights = 0;
    let totalFaltas = 0;
    let gradedCount = 0;

    list.forEach(s => {
      totalFaltas += s.faltas || 0;
      if (s.grade && !isNaN(parseFloat(s.grade))) {
        const parsedGrade = parseFloat(s.grade);
        sumGrades += parsedGrade;
        gradedCount++;
      }
    });

    const average = gradedCount > 0 ? (sumGrades / gradedCount).toFixed(2) : '0.00';
    return { average, totalFaltas, gradedCount };
  };

  const currentSemesterStats = calculateSemesterStats(selectedSemester);

  return (
    <div className="space-y-6">
      
      {/* 3 Main Aesthetic Navigation Buttons - Pure Minimalism */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-150 dark:border-slate-800 pb-5">
        <button
          onClick={() => setActiveTab('school')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all cursor-pointer ${
            activeTab === 'school'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800'
          }`}
        >
          <GraduationCap size={18} />
          <span>🎓 Escola</span>
        </button>

        <button
          onClick={() => setActiveTab('disciplines')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all cursor-pointer ${
            activeTab === 'disciplines'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800'
          }`}
        >
          <BookOpen size={18} />
          <span>📖 Disciplinas</span>
        </button>

        <button
          onClick={() => setActiveTab('studies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all cursor-pointer ${
            activeTab === 'studies'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800'
          }`}
        >
          <BookMarked size={18} />
          <span>📚 Estudos</span>
        </button>
      </div>

      {/* --- TAB 1: ESCOLA --- */}
      {activeTab === 'school' && (
        <div className="space-y-6">
          
          {/* Sub-Tabs: Notas vs Horários */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 p-1.5 rounded-2xl max-w-sm mx-auto">
            <button
              onClick={() => setEscolaSubTab('notas')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                escolaSubTab === 'notas'
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Notas Escolares
            </button>
            <button
              onClick={() => setEscolaSubTab('timetable')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                escolaSubTab === 'timetable'
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Grade de Horários
            </button>
          </div>

          {/* 1.1 NOTAS ESCOLARES AREA */}
          {escolaSubTab === 'notas' && (
            <div className="space-y-5">
              
              {/* Semester Pills Selector */}
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(schoolNotes).map(sem => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                      selectedSemester === sem
                        ? 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/40 dark:border-violet-900/50 dark:text-violet-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {sem}
                  </button>
                ))}
              </div>

              {/* Semester Stats Dashboard Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-center gap-1">
                    <Scale size={11} /> Média Ponderada
                  </div>
                  <div className="text-2xl font-black text-violet-600 dark:text-violet-400">
                    {currentSemesterStats.average}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Baseado em {currentSemesterStats.gradedCount} matérias com nota
                  </div>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-center gap-1">
                    <AlertCircle size={11} /> Faltas Acumuladas
                  </div>
                  <div className={`text-2xl font-black ${currentSemesterStats.totalFaltas > 10 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                    {currentSemesterStats.totalFaltas}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Soma total de faltas do semestre
                  </div>
                </div>
              </div>

              {/* Table/List of Subjects */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-150 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                        <th className="py-3 px-4">Disciplina</th>
                        <th className="py-3 px-4 text-center">Nota</th>
                        <th className="py-3 px-4 text-center">Faltas</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {schoolNotes[selectedSemester]?.length > 0 ? (
                        schoolNotes[selectedSemester].map(subj => (
                          <tr key={subj.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {subj.name}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {subj.grade ? (
                                <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-black rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/40 font-mono">
                                  {parseFloat(subj.grade).toFixed(1)}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">--</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold ${subj.faltas > 3 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {subj.faltas} f
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right relative" ref={dropdownRef}>
                              {/* Discrete ⋮ Toggle */}
                              <button
                                onClick={(e) => toggleDropdown(e, `notes-${subj.id}`)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {/* Dropdown Menu Overlay */}
                              <AnimatePresence>
                                {openDropdownId === `notes-${subj.id}` && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute right-4 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-left"
                                  >
                                    <button
                                      onClick={() => handleOpenEditSubject(selectedSemester, subj)}
                                      className="w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-850"
                                    >
                                      <Edit3 size={13} className="text-slate-400" />
                                      <span>Configurar Matéria</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubject(selectedSemester, subj.id)}
                                      className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={13} className="text-rose-400" />
                                      <span>Excluir Matéria</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                              <HelpCircle size={28} className="text-slate-300" />
                              <span className="text-xs">Nenhuma matéria para este semestre.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Minimalist Button at Bottom to Add Subject */}
                <div className="p-3 bg-slate-50/40 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-850 text-center">
                  <button
                    onClick={() => handleOpenAddSubject(selectedSemester)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Adicionar nova matéria ao {selectedSemester}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 1.2 WEEKLY TIMETABLE AREA */}
          {escolaSubTab === 'timetable' && (
            <div className="space-y-5">
              
              {/* Timetable Days Selector */}
              <div className="flex flex-wrap justify-center gap-1.5 bg-slate-100/80 dark:bg-slate-950 p-1 rounded-2xl max-w-lg mx-auto border border-slate-200/40 dark:border-slate-800/60">
                {WEEKDAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedTimetableDay(day)}
                    className={`flex-1 min-w-[70px] py-2 px-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all cursor-pointer ${
                      selectedTimetableDay === day
                        ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {day.split('-')[0]}
                  </button>
                ))}
              </div>

              {/* Vertical Timetable List */}
              <div className="max-w-xl mx-auto space-y-3">
                {TIMETABLE_SLOTS.map(slot => {
                  const daySchedule = timetable[selectedTimetableDay] || {};
                  const isRecreio = slot === '🍽 Recreio';
                  const classData = daySchedule[slot];

                  if (isRecreio) {
                    return (
                      <div 
                        key={slot}
                        className="bg-amber-50/40 dark:bg-amber-950/10 border border-dashed border-amber-200/40 dark:border-amber-900/20 p-3 rounded-2xl flex items-center justify-between gap-4 text-center"
                      >
                        <div className="w-full flex items-center justify-center gap-2 text-xs font-black text-amber-700 dark:text-amber-400">
                          <span>🍽 Recreio / Intervalo</span>
                          <span className="font-mono text-[10px] bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
                            09:30 - 09:50
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={slot}
                      className="group bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-3xs hover:border-slate-300 dark:hover:border-slate-800 transition-all"
                    >
                      {/* Slot Name & Hour info */}
                      <div className="space-y-1 shrink-0 w-24">
                        <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          {slot}
                        </div>
                        <div className="text-[10px] font-mono text-violet-500 dark:text-violet-400 font-bold flex items-center gap-1">
                          <Clock size={10} />
                          <span>{classData?.time || '--:--'}</span>
                        </div>
                      </div>

                      {/* Class Subject & Room info */}
                      <div className="flex-1 min-w-0">
                        {classData ? (
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                              {classData.subject}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-400">
                              {classData.teacher && (
                                <span className="flex items-center gap-1">
                                  <User size={10} /> {classData.teacher}
                                </span>
                              )}

                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Janela livre / Sem aula</span>
                        )}
                      </div>

                      {/* Discrete Settings button for this slot */}
                      <div className="shrink-0 relative" ref={dropdownRef}>
                        <button
                          onClick={(e) => toggleDropdown(e, `timetable-${slot}`)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>

                        <AnimatePresence>
                          {openDropdownId === `timetable-${slot}` && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-left"
                            >
                              <button
                                onClick={() => handleOpenConfigureSlot(selectedTimetableDay, slot, classData)}
                                className="w-full px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-850"
                              >
                                <Edit3 size={13} className="text-slate-400" />
                                <span>Configurar Aula</span>
                              </button>
                              {classData && (
                                <button
                                  onClick={() => handleClearSlot(selectedTimetableDay, slot)}
                                  className="w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={13} className="text-rose-400" />
                                  <span>Remover Aula</span>
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      )}

      {/* --- TAB 2: DISCIPLINAS --- */}
      {activeTab === 'disciplines' && (
        <div className="space-y-5">
          
          {uniqueSchoolSubjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Sidebar: Disciplines List */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-2 max-h-[450px] overflow-y-auto">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block px-2 pb-1 border-b border-slate-100 dark:border-slate-850">
                  Disciplinas Ativas
                </span>
                <div className="space-y-1 pt-1.5">
                  {uniqueSchoolSubjects.map(subName => (
                    <button
                      key={subName}
                      onClick={() => setSelectedDiscipline(subName)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedDiscipline === subName
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 border border-transparent'
                      }`}
                    >
                      <span className="text-[10px]">📐</span>
                      <span className="truncate">{subName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Detail Pane for selected discipline */}
              {selectedDiscipline && (
                <div className="lg:col-span-3 space-y-4">
                  
                  {/* Discipline Header Card */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-100/50 dark:border-indigo-950/20 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-lg font-black text-slate-800 dark:text-white truncate flex items-center gap-2">
                        <span>📐</span> {selectedDiscipline}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <User size={13} />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {disciplineLogs[selectedDiscipline]?.professor || 'Professor não configurado'}
                        </span>
                      </p>
                    </div>

                    {/* Header Discrete (⋮) Settings */}
                    <div className="relative shrink-0" ref={dropdownRef}>
                      <button
                        onClick={(e) => toggleDropdown(e, `discipline-header`)}
                        className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl transition-all shadow-3xs cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      <AnimatePresence>
                        {openDropdownId === `discipline-header` && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-left"
                          >
                            <button
                              onClick={() => handleOpenEditDiscipline(selectedDiscipline)}
                              className="w-full px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-850"
                            >
                              <Edit3 size={13} className="text-slate-400" />
                              <span>Editar Registro</span>
                            </button>
                            <button
                              onClick={() => handleClearDiscipline(selectedDiscipline)}
                              className="w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={13} className="text-rose-400" />
                              <span>Limpar Tudo</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 5 Core content blocks representing classroom activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Block 1: Conteúdos Estudados */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl space-y-2 shadow-3xs">
                      <h4 className="text-xs font-extrabold uppercase text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                        <BookOpen size={13} />
                        <span>Conteúdos Estudados</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {disciplineLogs[selectedDiscipline]?.conteudos || 'Nenhum conteúdo registrado ainda.'}
                      </p>
                    </div>

                    {/* Block 2: Trabalhos */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl space-y-2 shadow-3xs">
                      <h4 className="text-xs font-extrabold uppercase text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                        <Clipboard size={13} />
                        <span>Trabalhos</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {disciplineLogs[selectedDiscipline]?.trabalhos || 'Nenhum trabalho cadastrado.'}
                      </p>
                    </div>

                    {/* Block 3: Atividades */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl space-y-2 shadow-3xs">
                      <h4 className="text-xs font-extrabold uppercase text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                        <FileText size={13} />
                        <span>Atividades</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {disciplineLogs[selectedDiscipline]?.atividades || 'Nenhuma atividade registrada.'}
                      </p>
                    </div>

                    {/* Block 4: Provas */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl space-y-2 shadow-3xs">
                      <h4 className="text-xs font-extrabold uppercase text-rose-500 flex items-center gap-1.5">
                        <CalendarCheck2 size={13} />
                        <span>Provas Agendadas</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                        {disciplineLogs[selectedDiscipline]?.provas || 'Nenhuma prova agendada.'}
                      </p>
                    </div>

                    {/* Block 5: Observações (Col-span 2) */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 p-4 rounded-2xl space-y-2 shadow-3xs md:col-span-2">
                      <h4 className="text-xs font-extrabold uppercase text-amber-650 dark:text-amber-400 flex items-center gap-1.5">
                        <FileCheck2 size={13} />
                        <span>Observações & Avisos Importantes</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                        {disciplineLogs[selectedDiscipline]?.observacoes || 'Nenhuma observação cadastrada.'}
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-2xl max-w-md mx-auto">
              <HelpCircle className="text-slate-300 dark:text-slate-700 mx-auto mb-2" size={32} />
              <p className="text-xs text-slate-400">
                Para registrar ocorrências das disciplinas, primeiro cadastre matérias na aba Notas da Escola!
              </p>
            </div>
          )}

        </div>
      )}

      {/* --- TAB 3: ESTUDOS PESSOAIS --- */}
      {activeTab === 'studies' && (
        <div className="space-y-6">
          
          {/* Section top-bar - Simple '+' button */}
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddPersonalSubject}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Adicionar Matéria de Estudo</span>
            </button>
          </div>

          {/* List of study subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalStudies.length > 0 ? (
              personalStudies.map(sub => {
                // Calculate average progress for the subject
                const hasContents = sub.contents.length > 0;
                const totalProgress = hasContents 
                  ? Math.round(sub.contents.reduce((acc, curr) => acc + (curr.progress || 0), 0) / sub.contents.length)
                  : 0;

                return (
                  <div 
                    key={sub.id}
                    className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 rounded-3xl p-5 md:p-6 space-y-4 shadow-3xs flex flex-col justify-between"
                  >
                    
                    {/* Header area */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                            <Book size={16} className="text-emerald-500" />
                            <span>{sub.name}</span>
                          </h3>
                          {/* Miniature subject progress */}
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${totalProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {totalProgress}% geral
                            </span>
                          </div>
                        </div>

                        {/* Discrete Subject Header ⋮ Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={(e) => toggleDropdown(e, `personal-subj-${sub.id}`)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>

                          <AnimatePresence>
                            {openDropdownId === `personal-subj-${sub.id}` && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-left"
                              >
                                <button
                                  onClick={() => handleOpenAddPersonalContent(sub.id)}
                                  className="w-full px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-850"
                                >
                                  <Plus size={13} className="text-slate-400" />
                                  <span>Novo Tópico</span>
                                </button>
                                <button
                                  onClick={() => handleOpenEditPersonalSubject(sub)}
                                  className="w-full px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-850"
                                >
                                  <Edit3 size={13} className="text-slate-400" />
                                  <span>Renomear Matéria</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePersonalSubject(sub.id, sub.name)}
                                  className="w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={13} className="text-rose-400" />
                                  <span>Excluir Matéria</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Content rows list */}
                      <div className="space-y-3.5 pt-2 max-h-[300px] overflow-y-auto pr-0.5">
                        {sub.contents.length > 0 ? (
                          sub.contents.map(cont => (
                            <div 
                              key={cont.id}
                              className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850 p-3.5 rounded-2xl flex items-start justify-between gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                            >
                              
                              {/* Details text */}
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                    {cont.name}
                                  </h4>
                                  
                                  {/* Status Badge */}
                                  <span className={`inline-flex items-center px-2 py-0.5 text-[8.5px] font-black rounded uppercase tracking-wider ${
                                    cont.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                    cont.status === 'Em andamento' ? 'bg-amber-50 text-amber-600 dark:bg-amber-955/30 dark:text-amber-400' :
                                    'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                                  }`}>
                                    {cont.status}
                                  </span>
                                </div>

                                {cont.notes && (
                                  <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-normal line-clamp-2">
                                    {cont.notes}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-450 font-medium">
                                  {cont.date && (
                                    <span>📅 {cont.date.split('-').reverse().join('/')}</span>
                                  )}
                                  {cont.progress !== undefined && (
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                      {cont.progress}% concluído
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Discrete Content ⋮ Toggle Menu */}
                              <div className="relative shrink-0" ref={dropdownRef}>
                                <button
                                  onClick={(e) => toggleDropdown(e, `p-cont-${cont.id}`)}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded"
                                >
                                  <MoreVertical size={14} />
                                </button>

                                <AnimatePresence>
                                  {openDropdownId === `p-cont-${cont.id}` && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                      className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-left"
                                    >
                                      <button
                                        onClick={() => handleOpenEditPersonalContent(sub.id, cont)}
                                        className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-855"
                                      >
                                        <Edit3 size={12} className="text-slate-400" />
                                        <span>Editar Tópico</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeletePersonalContent(sub.id, cont.id)}
                                        className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Trash2 size={12} className="text-rose-400" />
                                        <span>Remover Tópico</span>
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-[10px] text-slate-400 italic">
                            Nenhum conteúdo cadastrado.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Add link at the card footer */}
                    <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-900">
                      <button
                        onClick={() => handleOpenAddPersonalContent(sub.id)}
                        className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        + Adicionar tópico a {sub.name}
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed rounded-3xl max-w-md mx-auto md:col-span-2">
                <HelpCircle className="text-slate-300 dark:text-slate-700 mx-auto mb-2" size={32} />
                <p className="text-xs text-slate-400">
                  Nenhuma matéria para seus estudos pessoais cadastrada. Adicione uma no botão acima!
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- AESTHETIC MODAL 1: CONFIGURE SCHOOL SUBJECT (NOTAS) --- */}
      <AnimatePresence>
        {showSubjectModal && subjectModalData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-violet-600" />
                  <span>{subjectModalData.id ? 'Editar Disciplina' : 'Adicionar Disciplina'}</span>
                </h3>
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSubjectModal} className="space-y-4 text-left">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Nome da Disciplina</label>
                  <input
                    type="text"
                    value={subjectModalData.name}
                    onChange={(e) => setSubjectModalData({ ...subjectModalData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                    placeholder="Ex: Física Quântica"
                    required
                  />
                </div>

                {/* Grade */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Nota Semestral</label>
                  <input
                    type="text"
                    value={subjectModalData.grade}
                    onChange={(e) => setSubjectModalData({ ...subjectModalData, grade: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 dark:text-white font-mono"
                    placeholder="Ex: 8.5"
                  />
                </div>

                {/* Absences (Faltas) */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Faltas Registradas</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubjectModalData({ ...subjectModalData, faltas: Math.max(0, subjectModalData.faltas - 1) })}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono font-black text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2">
                      {subjectModalData.faltas} falta(s)
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubjectModalData({ ...subjectModalData, faltas: subjectModalData.faltas + 1 })}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowSubjectModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-violet-650 hover:bg-violet-755 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-violet-500/10 cursor-pointer"
                  >
                    Salvar Mudanças
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AESTHETIC MODAL 2: CONFIGURE TIMETABLE SLOT --- */}
      <AnimatePresence>
        {showTimetableModal && timetableModalData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={16} className="text-violet-600" />
                  <span>Configurar Aula ({timetableModalData.slot})</span>
                </h3>
                <button
                  onClick={() => setShowTimetableModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveTimetableModal} className="space-y-4 text-left">
                {/* Day display badge */}
                <span className="inline-flex px-2.5 py-1 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 font-extrabold text-[10px] uppercase rounded-lg">
                  {timetableModalData.day}
                </span>

                {/* Subject name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Nome da Disciplina</label>
                  <input
                    type="text"
                    value={timetableModalData.subject}
                    onChange={(e) => setTimetableModalData({ ...timetableModalData, subject: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                    placeholder="Ex: Química Orgânica"
                    required
                  />
                </div>

                {/* Teacher name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Professor(a)</label>
                  <input
                    type="text"
                    value={timetableModalData.teacher}
                    onChange={(e) => setTimetableModalData({ ...timetableModalData, teacher: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                    placeholder="Ex: Prof. Sandra"
                  />
                </div>

                {/* Time slot */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Horário da Aula</label>
                  <input
                    type="text"
                    value={timetableModalData.time}
                    onChange={(e) => setTimetableModalData({ ...timetableModalData, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 dark:text-white font-mono"
                    placeholder="Ex: 07:00 - 07:50"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowTimetableModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-violet-650 hover:bg-violet-755 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-violet-500/10 cursor-pointer"
                  >
                    Salvar Horário
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AESTHETIC MODAL 3: CONFIGURE DISCIPLINE LOGS --- */}
      <AnimatePresence>
        {showDisciplineModal && disciplineModalData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={16} className="text-indigo-600" />
                  <span>Configurar Registro de {disciplineModalData.subjectName}</span>
                </h3>
                <button
                  onClick={() => setShowDisciplineModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDisciplineModal} className="space-y-4 text-left max-h-[480px] overflow-y-auto pr-1">
                {/* Professor */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Professor Titular</label>
                  <input
                    type="text"
                    value={disciplineModalData.professor}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, professor: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white"
                    placeholder="Ex: Prof. Cláudia"
                  />
                </div>

                {/* Conteúdos */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Conteúdos Estudados</label>
                  <textarea
                    rows={2}
                    value={disciplineModalData.conteudos}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, conteudos: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none"
                    placeholder="Liste os conteúdos que já foram passados..."
                  />
                </div>

                {/* Trabalhos */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Trabalhos</label>
                  <textarea
                    rows={2}
                    value={disciplineModalData.trabalhos}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, trabalhos: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none"
                    placeholder="Cadastre trabalhos ou pesquisas marcadas..."
                  />
                </div>

                {/* Atividades */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Atividades</label>
                  <textarea
                    rows={2}
                    value={disciplineModalData.atividades}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, atividades: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none"
                    placeholder="Exercícios de fixação, tarefas de casa..."
                  />
                </div>

                {/* Provas */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Provas</label>
                  <textarea
                    rows={2}
                    value={disciplineModalData.provas}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, provas: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none font-medium"
                    placeholder="Agendamento de testes e avaliações..."
                  />
                </div>

                {/* Observações */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Observações Gerais</label>
                  <textarea
                    rows={2}
                    value={disciplineModalData.observacoes}
                    onChange={(e) => setDisciplineModalData({ ...disciplineModalData, observacoes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none"
                    placeholder="Anotações gerais, avisos..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowDisciplineModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    Salvar Registros
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AESTHETIC MODAL 4: PERSONAL STUDY SUBJECT --- */}
      <AnimatePresence>
        {showPersonalSubjectModal && personalSubjectModalData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookMarked size={16} className="text-emerald-500" />
                  <span>{personalSubjectModalData.id ? 'Renomear Matéria' : 'Nova Matéria de Estudos'}</span>
                </h3>
                <button
                  onClick={() => setShowPersonalSubjectModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePersonalSubjectModal} className="space-y-4 text-left">
                {/* Subject Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Nome da Matéria de Estudo</label>
                  <input
                    type="text"
                    value={personalSubjectModalData.name}
                    onChange={(e) => setPersonalSubjectModalData({ ...personalSubjectModalData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white"
                    placeholder="Ex: Química Orgânica (ENEM)"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowPersonalSubjectModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-750 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    Salvar Matéria
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AESTHETIC MODAL 5: PERSONAL STUDY CONTENT TOPIC --- */}
      <AnimatePresence>
        {showPersonalContentModal && personalContentModalData && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookMarked size={16} className="text-emerald-500" />
                  <span>{personalContentModalData.id ? 'Editar Tópico de Estudo' : 'Novo Tópico de Estudo'}</span>
                </h3>
                <button
                  onClick={() => setShowPersonalContentModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePersonalContentModal} className="space-y-4 text-left">
                {/* Topic Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Nome do Tópico</label>
                  <input
                    type="text"
                    value={personalContentModalData.name}
                    onChange={(e) => setPersonalContentModalData({ ...personalContentModalData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white"
                    placeholder="Ex: Dilatação Térmica"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400">Status de Progresso</label>
                    <select
                      value={personalContentModalData.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as PersonalContent['status'];
                        setPersonalContentModalData({ 
                          ...personalContentModalData, 
                          status: nextStatus,
                          progress: nextStatus === 'Concluído' ? 100 : nextStatus === 'Não iniciado' ? 0 : personalContentModalData.progress 
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white"
                    >
                      <option value="Não iniciado">Não iniciado</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>

                  {/* Target Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400">Data de Estudo</label>
                    <input
                      type="date"
                      value={personalContentModalData.date}
                      onChange={(e) => setPersonalContentModalData({ ...personalContentModalData, date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white font-sans"
                    />
                  </div>
                </div>

                {/* Progress bar Slider */}
                {personalContentModalData.status === 'Em andamento' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-400">
                      <span>Progresso Detalhado</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">{personalContentModalData.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={personalContentModalData.progress || 50}
                        onChange={(e) => setPersonalContentModalData({ ...personalContentModalData, progress: parseInt(e.target.value) })}
                        className="flex-1 accent-emerald-600 bg-slate-150 dark:bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Notes (Observações) */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400">Observações / Plano de Estudo</label>
                  <textarea
                    rows={2}
                    value={personalContentModalData.notes}
                    onChange={(e) => setPersonalContentModalData({ ...personalContentModalData, notes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white leading-relaxed resize-none"
                    placeholder="Quais materiais ou páginas vai usar para estudar?"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowPersonalContentModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-750 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    Salvar Tópico
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
