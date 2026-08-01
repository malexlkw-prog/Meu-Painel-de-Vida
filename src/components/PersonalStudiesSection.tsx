import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Edit2,
  Award, 
  X, 
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

// TYPES FOR ESTUDOS
export interface StudyTopic {
  id: string;
  title: string;
  status: 'concluido' | 'em_andamento' | 'nao_iniciado';
}

export interface StudyModule {
  id: string;
  title: string;
  description?: string;
  topics: StudyTopic[];
}

export interface StudyPlan {
  id: string;
  name: string; // ex: Português, Matemática ENEM, Programação
  category?: string;
  modules: StudyModule[];
}

// TYPES FOR CURSOS
export interface Course {
  id: string;
  name: string;
  description?: string;
  platform: string; // ex: Udemy, YouTube, Alura
  instructor?: string;
  status: 'concluido' | 'em_andamento' | 'pausado';
  hasCertificate?: boolean;
  certificateNotes?: string;
  modules?: any[];
}

// TYPES FOR IDIOMAS
export interface LanguageModule {
  id: string;
  title: string;
  topics: StudyTopic[];
}

export interface LanguageItem {
  id: string;
  name: string;
  flag: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  skills: {
    vocabulary: number; // 0 - 100
    grammar: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  modules: LanguageModule[];
}

// INITIAL SEED DATA FOR ESTUDOS
const INITIAL_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'portugues',
    name: 'Língua Portuguesa & Gramática',
    category: 'Estudos Pessoais',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1 — Fundamentos da Língua',
        description: 'Conceitos básicos de comunicação e linguagem',
        topics: [
          { id: 't1', title: 'Língua e Linguagem', status: 'concluido' },
          { id: 't2', title: 'Linguagem Verbal e Não Verbal', status: 'concluido' },
          { id: 't3', title: 'Comunicação e Interlocução', status: 'concluido' },
          { id: 't4', title: 'Funções da Linguagem', status: 'concluido' }
        ]
      },
      {
        id: 'm2',
        title: 'Módulo 2 — Fonética e Fonologia',
        description: 'Sons da fala e acentuação',
        topics: [
          { id: 't5', title: 'Fonemas e Letras', status: 'concluido' },
          { id: 't6', title: 'Encontros Vocálicos (Ditongo, Hiato)', status: 'em_andamento' },
          { id: 't7', title: 'Encontros Consonantais e Dígrafos', status: 'nao_iniciado' },
          { id: 't8', title: 'Regras de Acentuação Gráfica', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'm3',
        title: 'Módulo 3 — Ortografia',
        description: 'Uso correto das letras e reforma ortográfica',
        topics: [
          { id: 't9', title: 'Uso de S ou Z', status: 'concluido' },
          { id: 't10', title: 'Uso de X ou CH', status: 'concluido' },
          { id: 't11', title: 'Uso do Hífen (Novo Acordo)', status: 'em_andamento' },
          { id: 't12', title: 'Reforma Ortográfica Atualizada', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'm4',
        title: 'Módulo 4 — Morfologia',
        description: 'Classes de palavras e verbos',
        topics: [
          { id: 't13', title: 'Substantivos e Adjetivos', status: 'em_andamento' },
          { id: 't14', title: 'Pronomes Pessoais e Possessivos', status: 'nao_iniciado' },
          { id: 't15', title: 'Tempos e Modos Verbais', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'matematica_enem',
    name: 'Matemática e Suas Tecnologias',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'mm1',
        title: 'Módulo 1 — Matemática Básica & Porcentagem',
        description: 'Operações fundamentais e regra de três',
        topics: [
          { id: 'mt1', title: 'Razão e Proporção', status: 'concluido' },
          { id: 'mt2', title: 'Regra de Três Simples e Composta', status: 'concluido' },
          { id: 'mt3', title: 'Porcentagem e Juros Simples', status: 'concluido' }
        ]
      },
      {
        id: 'mm2',
        title: 'Módulo 2 — Funções e Álgebra',
        description: 'Estudo das funções afins e quadráticas',
        topics: [
          { id: 'mt4', title: 'Função Afim (1º Grau)', status: 'concluido' },
          { id: 'mt5', title: 'Função Quadrática (2º Grau)', status: 'em_andamento' },
          { id: 'mt6', title: 'Função Exponencial', status: 'nao_iniciado' }
        ]
      }
    ]
  }
];

// INITIAL SEED DATA FOR CURSOS
const INITIAL_COURSES: Course[] = [
  {
    id: 'mkt_digital',
    name: 'Marketing Digital de Alta Performance',
    description: 'Estratégias avançadas de atração e conversão',
    platform: 'Udemy',
    instructor: 'Pedro Sobral',
    status: 'em_andamento',
    hasCertificate: false,
    certificateNotes: 'Certificado emitido após a avaliação final'
  },
  {
    id: 'dev_fullstack',
    name: 'Desenvolvimento Web Fullstack React & Node',
    description: 'Aplicações modernas com TypeScript e Tailwind',
    platform: 'Rocketseat',
    instructor: 'Diego Fernandes',
    status: 'concluido',
    hasCertificate: true,
    certificateNotes: 'Certificado de Conclusão de 120 horas emitido em 2026'
  },
  {
    id: 'design_ui_ux',
    name: 'UI/UX Design e Prototipagem no Figma',
    description: 'Design de interfaces modernas e sistemas de design',
    platform: 'Coursera',
    instructor: 'Google UX Design Team',
    status: 'concluido',
    hasCertificate: true,
    certificateNotes: 'Certificado Profissional de UX Design'
  }
];

// INITIAL SEED DATA FOR IDIOMAS
const INITIAL_LANGUAGES: LanguageItem[] = [
  {
    id: 'ingles',
    name: 'Inglês',
    flag: '🇺🇸',
    level: 'A2',
    skills: {
      vocabulary: 65,
      grammar: 50,
      listening: 70,
      speaking: 45,
      writing: 55
    },
    modules: [
      {
        id: 'lm1',
        title: 'Módulo 1 — Básico (A1 - A2)',
        topics: [
          { id: 'lt1', title: 'Verb To Be & Personal Pronouns', status: 'concluido' },
          { id: 'lt2', title: 'Simple Present & Daily Routines', status: 'concluido' },
          { id: 'lt3', title: 'Present Continuous & Actions Now', status: 'em_andamento' },
          { id: 'lt4', title: 'Past Simple & Regular Verbs', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'lm2',
        title: 'Módulo 2 — Intermediário (B1)',
        topics: [
          { id: 'lt5', title: 'Present Perfect vs Past Simple', status: 'nao_iniciado' },
          { id: 'lt6', title: 'Modal Verbs (Can, Could, Should)', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'espanhol',
    name: 'Espanhol',
    flag: '🇪🇸',
    level: 'A1',
    skills: {
      vocabulary: 40,
      grammar: 35,
      listening: 50,
      speaking: 30,
      writing: 35
    },
    modules: [
      {
        id: 'lm3',
        title: 'Módulo 1 — Primeros Pasos',
        topics: [
          { id: 'lt8', title: 'Saludos y Presentaciones', status: 'concluido' },
          { id: 'lt9', title: 'Presente de Indicativo', status: 'em_andamento' },
          { id: 'lt10', title: 'Vocabulario Esencial', status: 'nao_iniciado' }
        ]
      }
    ]
  }
];

export interface PersonalStudiesSectionProps {
  onBackToDashboard?: () => void;
  initialSubTab?: 'menu' | 'estudos' | 'cursos' | 'idiomas';
}

export default function PersonalStudiesSection({ onBackToDashboard, initialSubTab = 'menu' }: PersonalStudiesSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'estudos' | 'cursos' | 'idiomas'>(initialSubTab);

  // 1. ESTUDOS STATE
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_plans_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDY_PLANS;
  });

  // Selected Study Plan Modal (stored by ID for single source of truth)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  // Selected Module Inside Plan
  const [selectedModuleIdInPlan, setSelectedModuleIdInPlan] = useState<string | null>(null);

  // 2. CURSOS STATE
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_courses_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  // Selected Course Modal for Editing
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // New Course state
  const [isAddingCourseModal, setIsAddingCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePlatform, setNewCoursePlatform] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseStatus, setNewCourseStatus] = useState<'concluido' | 'em_andamento' | 'pausado'>('em_andamento');
  const [newCourseHasCertificate, setNewCourseHasCertificate] = useState(false);
  const [newCourseCertificateNotes, setNewCourseCertificateNotes] = useState('');

  // Edit Course state
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseName, setEditCourseName] = useState('');
  const [editCoursePlatform, setEditCoursePlatform] = useState('');
  const [editCourseInstructor, setEditCourseInstructor] = useState('');
  const [editCourseStatus, setEditCourseStatus] = useState<'concluido' | 'em_andamento' | 'pausado'>('em_andamento');
  const [editCourseHasCertificate, setEditCourseHasCertificate] = useState(false);
  const [editCourseCertificateNotes, setEditCourseCertificateNotes] = useState('');

  // 3. IDIOMAS STATE
  const [languages, setLanguages] = useState<LanguageItem[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_languages_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LANGUAGES;
  });

  // Selected Language Modal
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);

  // Dynamic state derivations - always 100% synchronized with main state
  const selectedPlanModal = plans.find(p => p.id === selectedPlanId) || null;
  const selectedModuleInPlan = selectedPlanModal?.modules.find(m => m.id === selectedModuleIdInPlan) || null;
  const selectedCourseModal = courses.find(c => c.id === selectedCourseId) || null;
  const selectedLanguageModal = languages.find(l => l.id === selectedLanguageId) || null;

  // Modals for Adding New Items
  const [isAddingPlanModal, setIsAddingPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('Estudos Pessoais');

  const [isAddingLanguageModal, setIsAddingLanguageModal] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🌐');
  const [newLangLevel, setNewLangLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');

  // Inline edit states inside detail modals
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanCategory, setEditPlanCategory] = useState('');

  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [editLangName, setEditLangName] = useState('');
  const [editLangFlag, setEditLangFlag] = useState('');
  const [editLangLevel, setEditLangLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');

  // Inline form states inside detail modals
  const [isAddingPlanModule, setIsAddingPlanModule] = useState(false);
  const [newPlanModuleTitle, setNewPlanModuleTitle] = useState('');

  const [isAddingPlanTopic, setIsAddingPlanTopic] = useState(false);
  const [newPlanTopicTitle, setNewPlanTopicTitle] = useState('');

  const [isAddingCourseModule, setIsAddingCourseModule] = useState(false);
  const [newCourseModuleTitle, setNewCourseModuleTitle] = useState('');

  const [addingLessonForModId, setAddingLessonForModId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const [isAddingLangModule, setIsAddingLangModule] = useState(false);
  const [newLangModuleTitle, setNewLangModuleTitle] = useState('');

  const [addingTopicForLangModId, setAddingTopicForLangModId] = useState<string | null>(null);
  const [newLangTopicTitle, setNewLangTopicTitle] = useState('');

  // Confirm delete states
  const [confirmDeletePlanId, setConfirmDeletePlanId] = useState<string | null>(null);
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null);
  const [confirmDeleteLangId, setConfirmDeleteLangId] = useState<string | null>(null);

  // ACTION HANDLERS
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;
    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      name: newPlanName.trim(),
      category: newPlanCategory.trim() || 'Estudos Pessoais',
      modules: []
    };
    setPlans(prev => [...prev, newPlan]);
    setNewPlanName('');
    setIsAddingPlanModal(false);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    if (selectedPlanId === id) setSelectedPlanId(null);
    if (selectedModuleIdInPlan) setSelectedModuleIdInPlan(null);
    setConfirmDeletePlanId(null);
  };

  const handleSaveEditedPlan = () => {
    if (!selectedPlanModal || !editPlanName.trim()) return;
    const name = editPlanName.trim();
    const cat = editPlanCategory.trim() || 'Estudos Pessoais';
    setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? { ...p, name, category: cat } : p));
    setIsEditingPlan(false);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    const newC: Course = {
      id: Date.now().toString(),
      name: newCourseName.trim(),
      platform: newCoursePlatform.trim() || 'Plataforma Online',
      instructor: newCourseInstructor.trim() || undefined,
      status: newCourseStatus,
      hasCertificate: newCourseHasCertificate,
      certificateNotes: newCourseCertificateNotes.trim() || undefined
    };
    setCourses(prev => [newC, ...prev]);
    setNewCourseName('');
    setNewCoursePlatform('');
    setNewCourseInstructor('');
    setNewCourseStatus('em_andamento');
    setNewCourseHasCertificate(false);
    setNewCourseCertificateNotes('');
    setIsAddingCourseModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    if (selectedCourseId === id) setSelectedCourseId(null);
    setConfirmDeleteCourseId(null);
  };

  const handleSaveEditedCourse = () => {
    if (!selectedCourseModal || !editCourseName.trim()) return;
    const name = editCourseName.trim();
    const plat = editCoursePlatform.trim() || 'Plataforma Online';
    const inst = editCourseInstructor.trim() || undefined;
    const notes = editCourseCertificateNotes.trim() || undefined;

    setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? { 
      ...c, 
      name, 
      platform: plat, 
      instructor: inst,
      status: editCourseStatus,
      hasCertificate: editCourseHasCertificate,
      certificateNotes: notes
    } : c));
    setIsEditingCourse(false);
    setSelectedCourseId(null);
  };

  const handleToggleCourseStatus = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextMap: Record<string, 'concluido' | 'em_andamento' | 'pausado'> = {
        'em_andamento': 'concluido',
        'concluido': 'pausado',
        'pausado': 'em_andamento'
      };
      return { ...c, status: nextMap[c.status] || 'em_andamento' };
    }));
  };

  const handleToggleCourseCertificate = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, hasCertificate: !c.hasCertificate };
    }));
  };

  const handleCreateLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const newL: LanguageItem = {
      id: Date.now().toString(),
      name: newLangName.trim(),
      flag: newLangFlag.trim() || '🌐',
      level: newLangLevel,
      skills: { vocabulary: 20, grammar: 20, listening: 20, speaking: 10, writing: 15 },
      modules: []
    };
    setLanguages(prev => [...prev, newL]);
    setNewLangName('');
    setNewLangFlag('🌐');
    setIsAddingLanguageModal(false);
  };

  const handleDeleteLanguage = (id: string) => {
    setLanguages(prev => prev.filter(l => l.id !== id));
    if (selectedLanguageId === id) setSelectedLanguageId(null);
    setConfirmDeleteLangId(null);
  };

  const handleSaveEditedLanguage = () => {
    if (!selectedLanguageModal || !editLangName.trim()) return;
    const name = editLangName.trim();
    const flag = editLangFlag.trim() || '🌐';
    setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? { ...l, name, flag, level: editLangLevel } : l));
    setIsEditingLanguage(false);
  };

  // Save changes to localStorage for F5 persistence
  useEffect(() => {
    localStorage.setItem('lifehub_studies_plans_v2', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('lifehub_studies_courses_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lifehub_studies_languages_v2', JSON.stringify(languages));
  }, [languages]);

  // PROGRESS CALCULATIONS
  const getModuleProgress = (module: StudyModule): number => {
    if (!module.topics || module.topics.length === 0) return 0;
    const completed = module.topics.filter(t => t.status === 'concluido').length;
    return Math.round((completed / module.topics.length) * 100);
  };

  const getPlanProgress = (plan: StudyPlan): number => {
    let totalTopics = 0;
    let completedTopics = 0;
    plan.modules.forEach(m => {
      m.topics.forEach(t => {
        totalTopics++;
        if (t.status === 'concluido') completedTopics++;
      });
    });
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const getOverallStudiesProgress = (): number => {
    let totalTopics = 0;
    let completedTopics = 0;
    plans.forEach(plan => {
      plan.modules.forEach(m => {
        m.topics.forEach(t => {
          totalTopics++;
          if (t.status === 'concluido') completedTopics++;
        });
      });
    });
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const getCourseProgress = (course: Course): number => {
    let totalLessons = 0;
    let completedLessons = 0;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.status === 'concluido') completedLessons++;
      });
    });
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getLanguageProgress = (lang: LanguageItem): number => {
    let totalTopics = 0;
    let completedTopics = 0;
    lang.modules.forEach(m => {
      m.topics.forEach(t => {
        totalTopics++;
        if (t.status === 'concluido') completedTopics++;
      });
    });
    if (totalTopics === 0) {
      // average of skills
      const vals = Object.values(lang.skills);
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    return Math.round((completedTopics / totalTopics) * 100);
  };

  // Status toggle handler for topics: ⚪ -> 🟡 -> 🟢 -> ⚪
  const toggleTopicStatus = (planId: string, moduleId: string, topicId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        modules: p.modules.map(m => {
          if (m.id !== moduleId) return m;
          return {
            ...m,
            topics: m.topics.map(t => {
              if (t.id !== topicId) return t;
              const nextStatus: Record<string, 'concluido' | 'em_andamento' | 'nao_iniciado'> = {
                'nao_iniciado': 'em_andamento',
                'em_andamento': 'concluido',
                'concluido': 'nao_iniciado'
              };
              return { ...t, status: nextStatus[t.status] || 'nao_iniciado' };
            })
          };
        })
      };
    }));
  };

  const handleAddPlan = () => {
    const name = prompt('Nome do Plano / Matéria de Estudo:');
    if (!name || !name.trim()) return;

    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      name: name.trim(),
      category: 'Estudos Pessoais',
      modules: [
        {
          id: Date.now().toString() + '_m1',
          title: 'Módulo 1 — Introdução',
          description: 'Módulo inicial',
          topics: [
            { id: Date.now().toString() + '_t1', title: 'Primeiro Assunto', status: 'nao_iniciado' }
          ]
        }
      ]
    };

    setPlans(prev => [...prev, newPlan]);
  };

  return (
    <div className="space-y-6">
      
      {/* ==================================================================== */}
      {/* 1º NÍVEL: MENU PRINCIPAL DE ESTUDOS (APENAS SUB-ABAS DISPONÍVEIS) */}
      {/* ==================================================================== */}
      {activeSubTab === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl">
                <GraduationCap size={26} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Estudos & Aprendizado</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Selecione uma das opções abaixo para gerenciar seu aprendizado:</p>
              </div>
            </div>

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/60 dark:border-indigo-800/60 rounded-2xl transition-colors flex items-center gap-2 text-xs font-black shadow-2xs self-start md:self-auto cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar ao Dashboard</span>
              </button>
            )}
          </div>

          {/* SUB-TABS NAVIGATION GRID WITH DISTINCT COLOR THEMES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* SUB-ABA 1: ESTUDOS (INDIGO / VIOLET THEME) */}
            <div
              onClick={() => setActiveSubTab('estudos')}
              className="bg-gradient-to-br from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-6 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Estudos
                    </h2>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                      {plans.length} {plans.length === 1 ? 'plano' : 'planos'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Planos de estudo estruturados em matérias, módulos e tópicos de aprendizado.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Acessar Estudos</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* SUB-ABA 2: CURSOS (EMERALD / GREEN THEME) */}
            <div
              onClick={() => setActiveSubTab('cursos')}
              className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-3xl p-6 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Cursos
                    </h2>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                      {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Acompanhamento de cursos online, plataformas, instrutores e progresso das aulas.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Acessar Cursos</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* SUB-ABA 3: IDIOMAS (SKY / CYAN THEME) */}
            <div
              onClick={() => setActiveSubTab('idiomas')}
              className="bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-sky-950/20 border border-sky-200/80 dark:border-sky-900/50 hover:border-sky-500 dark:hover:border-sky-400 rounded-3xl p-6 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      Idiomas
                    </h2>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200/60 dark:border-sky-800/60">
                      {languages.length} {languages.length === 1 ? 'idioma' : 'idiomas'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Acompanhamento de idiomas, níveis, vocabulário e progresso por habilidades.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-sky-100 dark:border-sky-900/40 text-xs font-bold text-sky-600 dark:text-sky-400">
                <span>Acessar Idiomas</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2º NÍVEL: PÁGINAS INDIVIDUALIZADAS COM BOTÃO DE VOLTAR */}
      {/* ==================================================================== */}

      {/* 1. SUB-ABA: ESTUDOS (COR: INDIGO / VIOLET) */}
      {activeSubTab === 'estudos' && (
        <div className="space-y-6">
          {/* HEADER DA PÁGINA COM OPÇÃO DE VOLTAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/50 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                  title="Voltar ao Dashboard Principal"
                >
                  <ArrowLeft size={15} />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                onClick={() => setActiveSubTab('menu')}
                className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/60 dark:border-indigo-800/60 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                title="Voltar ao Menu Principal de Estudos"
              >
                <ArrowLeft size={15} />
                <span>Menu de Estudos</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <button onClick={() => setActiveSubTab('menu')} className="hover:text-indigo-600 transition-colors">
                    Estudos
                  </button>
                  <span>/</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Planos de Estudo</span>
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                  Planos de Estudo
                </h1>
              </div>
            </div>

            <button
              onClick={() => setIsAddingPlanModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <Plus size={16} /> Novo Plano
            </button>
          </div>
          
          {/* OVERALL PROGRESS BANNER */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 block">Progresso Geral</span>
              <h2 className="text-lg font-black">Planos de Estudo</h2>
            </div>
            <div className="bg-white/15 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-2xl font-black">{getOverallStudiesProgress()}%</span>
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Concluído</span>
            </div>
          </div>

          {/* SUMMARY CARDS OF STUDY PLANS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plans.map(plan => {
              const prog = getPlanProgress(plan);

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {plan.name}
                      </h3>
                      <span className="text-xs text-slate-400">{plan.modules.length} módulos</span>
                    </div>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{prog}%</span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 group-hover:text-indigo-500 font-bold">
                    <span>Ver Módulos</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 2. SUB-ABA: CURSOS (COR: EMERALD / GREEN) */}
      {activeSubTab === 'cursos' && (
        <div className="space-y-6">
          {/* HEADER DA PÁGINA DE CURSOS COM OPÇÃO DE VOLTAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                  title="Voltar ao Dashboard Principal"
                >
                  <ArrowLeft size={15} />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                onClick={() => setActiveSubTab('menu')}
                className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                title="Voltar ao Menu Principal de Estudos"
              >
                <ArrowLeft size={15} />
                <span>Menu de Estudos</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <button onClick={() => setActiveSubTab('menu')} className="hover:text-emerald-600 transition-colors">
                    Estudos
                  </button>
                  <span>/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Cursos Online</span>
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Award size={20} className="text-emerald-600 dark:text-emerald-400" />
                  Cursos Online
                </h1>
              </div>
            </div>

            <button
              onClick={() => setIsAddingCourseModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <Plus size={16} /> Adicionar Curso
            </button>
          </div>

          {/* LISTA ORGANIZADA DE CURSOS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Meus Cursos</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clique nos botões de status e certificado para alternar rapidamente</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Award size={36} className="mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold">Nenhum curso cadastrado ainda.</p>
                <p className="text-[11px]">Clique em "Adicionar Curso" para começar a sua lista.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map(course => {
                  return (
                    <div
                      key={course.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-3 rounded-2xl transition-colors"
                    >
                      {/* COURSE MAIN INFO */}
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-lg text-[10px] font-extrabold border border-emerald-200/50 dark:border-emerald-800/50">
                            {course.platform}
                          </span>
                          {course.instructor && (
                            <span className="text-[11px] font-medium text-slate-400">
                              • Prof. {course.instructor}
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">
                          {course.name}
                        </h3>
                        {course.certificateNotes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            💬 {course.certificateNotes}
                          </p>
                        )}
                      </div>

                      {/* STATUS & CERTIFICATE CONTROLS */}
                      <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                        {/* STATUS TOGGLE */}
                        <button
                          onClick={() => handleToggleCourseStatus(course.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                            course.status === 'concluido'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                              : course.status === 'pausado'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800'
                          }`}
                          title="Clique para alternar o status do curso"
                        >
                          {course.status === 'concluido' ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Concluído</span>
                            </>
                          ) : course.status === 'pausado' ? (
                            <>
                              <AlertCircle size={14} />
                              <span>Pausado</span>
                            </>
                          ) : (
                            <>
                              <Circle size={14} />
                              <span>Em Andamento</span>
                            </>
                          )}
                        </button>

                        {/* CERTIFICATE TOGGLE */}
                        <button
                          onClick={() => handleToggleCourseCertificate(course.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                            course.hasCertificate
                              ? 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-300/60 dark:border-violet-800'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700'
                          }`}
                          title="Clique para alternar a emissão do certificado"
                        >
                          <Award size={14} className={course.hasCertificate ? 'text-violet-600 dark:text-violet-300' : 'text-slate-400'} />
                          <span>{course.hasCertificate ? 'Certificado Emitido' : 'Sem Certificado'}</span>
                        </button>

                        {/* EDIT & DELETE ACTIONS */}
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setEditCourseName(course.name);
                              setEditCoursePlatform(course.platform);
                              setEditCourseInstructor(course.instructor || '');
                              setEditCourseStatus(course.status);
                              setEditCourseHasCertificate(!!course.hasCertificate);
                              setEditCourseCertificateNotes(course.certificateNotes || '');
                              setIsEditingCourse(true);
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Editar Curso"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Excluir Curso"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SUB-ABA: IDIOMAS (COR: SKY / CYAN) */}
      {activeSubTab === 'idiomas' && (
        <div className="space-y-6">
          {/* HEADER DA PÁGINA DE IDIOMAS COM OPÇÃO DE VOLTAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-sky-900/50 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                  title="Voltar ao Dashboard Principal"
                >
                  <ArrowLeft size={15} />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                onClick={() => setActiveSubTab('menu')}
                className="px-3.5 py-2 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200/60 dark:border-sky-800/60 rounded-2xl transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer"
                title="Voltar ao Menu Principal de Estudos"
              >
                <ArrowLeft size={15} />
                <span>Menu de Estudos</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <button onClick={() => setActiveSubTab('menu')} className="hover:text-sky-600 transition-colors">
                    Estudos
                  </button>
                  <span>/</span>
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold">Idiomas & Habilidades</span>
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Globe size={20} className="text-sky-600 dark:text-sky-400" />
                  Idiomas & Habilidades
                </h1>
              </div>
            </div>

            <button
              onClick={() => setIsAddingLanguageModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <Plus size={16} /> Adicionar Idioma
            </button>
          </div>

          {/* SUMMARY CARDS OF LANGUAGES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map(lang => {
              const prog = getLanguageProgress(lang);

              return (
                <div
                  key={lang.id}
                  onClick={() => setSelectedLanguageId(lang.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {lang.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-bold">Nível {lang.level}</span>
                      </div>
                    </div>
                    <span className="text-base font-black text-sky-600 dark:text-sky-400">{prog}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-sky-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 group-hover:text-sky-500 font-bold">
                    <span>Ver Habilidades e Módulos</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: NOVO PLANO DE ESTUDO */}
      {/* ==================================================================== */}
      {isAddingPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreatePlan} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Novo Plano de Estudo</h3>
              <button type="button" onClick={() => setIsAddingPlanModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nome do Plano / Matéria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Engenharia de Software"
                  value={newPlanName}
                  onChange={e => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Faculdade, Carreira, Concurso"
                  value={newPlanCategory}
                  onChange={e => setNewPlanCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddingPlanModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-violet-700"
              >
                Criar Plano
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADICIONAR CURSO */}
      {/* ==================================================================== */}
      {isAddingCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateCourse} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Adicionar Novo Curso</h3>
              <button type="button" onClick={() => setIsAddingCourseModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nome do Curso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: React & TypeScript Masterclass"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Plataforma / Instituição</label>
                <input
                  type="text"
                  placeholder="Ex: Udemy, YouTube, Alura, Coursera"
                  value={newCoursePlatform}
                  onChange={e => setNewCoursePlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Instrutor / Professor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Silva"
                  value={newCourseInstructor}
                  onChange={e => setNewCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Status de Conclusão</label>
                <select
                  value={newCourseStatus}
                  onChange={e => setNewCourseStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newCourseHasCertificate}
                    onChange={e => setNewCourseHasCertificate(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Award size={14} className="text-violet-500" />
                    Foi emitido certificado de conclusão?
                  </span>
                </label>

                {newCourseHasCertificate && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Detalhes / Link do Certificado</label>
                    <input
                      type="text"
                      placeholder="Ex: Certificado de 60 horas ou URL"
                      value={newCourseCertificateNotes}
                      onChange={e => setNewCourseCertificateNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCourseModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                Adicionar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADICIONAR IDIOMA */}
      {/* ==================================================================== */}
      {isAddingLanguageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateLanguage} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Adicionar Idioma</h3>
              <button type="button" onClick={() => setIsAddingLanguageModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nome do Idioma</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Francês"
                  value={newLangName}
                  onChange={e => setNewLangName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bandeira / Emoji</label>
                <input
                  type="text"
                  placeholder="Ex: 🇫🇷"
                  value={newLangFlag}
                  onChange={e => setNewLangFlag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nível CEFR Inicial</label>
                <select
                  value={newLangLevel}
                  onChange={e => setNewLangLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                >
                  <option value="A1">A1 — Iniciante</option>
                  <option value="A2">A2 — Básico</option>
                  <option value="B1">B1 — Intermediário</option>
                  <option value="B2">B2 — Independente</option>
                  <option value="C1">C1 — Avançado</option>
                  <option value="C2">C2 — Domínio Pleno</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddingLanguageModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-violet-700"
              >
                Adicionar Idioma
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL / LEVEL 2: DETALHES DO PLANO DE ESTUDO (MÓDULOS REQ 11) */}
      {/* ==================================================================== */}
      {selectedPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            {/* HEADER WITH EDIT TOGGLE */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              {isEditingPlan ? (
                <div className="w-full space-y-2 pr-4">
                  <input
                    type="text"
                    value={editPlanName}
                    onChange={e => setEditPlanName(e.target.value)}
                    placeholder="Nome do Plano"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={editPlanCategory}
                    onChange={e => setEditPlanCategory(e.target.value)}
                    placeholder="Categoria"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSaveEditedPlan} className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg">Salvar</button>
                    <button type="button" onClick={() => setIsEditingPlan(false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest">{selectedPlanModal.category || 'Estudos'}</span>
                    <button
                      onClick={() => {
                        setEditPlanName(selectedPlanModal.name);
                        setEditPlanCategory(selectedPlanModal.category || '');
                        setIsEditingPlan(true);
                      }}
                      className="p-1 text-slate-400 hover:text-violet-600"
                      title="Editar Plano"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedPlanModal.name}</h3>
                </div>
              )}
              <button onClick={() => { setSelectedPlanId(null); setIsEditingPlan(false); setConfirmDeletePlanId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* LIST OF MODULES INSIDE PLAN */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Módulos do Plano</h4>
                {!isAddingPlanModule && (
                  <button
                    onClick={() => setIsAddingPlanModule(true)}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Módulo
                  </button>
                )}
              </div>

              {isAddingPlanModule && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do módulo..."
                    value={newPlanModuleTitle}
                    onChange={e => setNewPlanModuleTitle(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingPlanModule(false); setNewPlanModuleTitle(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newPlanModuleTitle.trim()) {
                          const newM: StudyModule = { id: Date.now().toString(), title: newPlanModuleTitle.trim(), topics: [] };
                          setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? { ...p, modules: [...p.modules, newM] } : p));
                          setNewPlanModuleTitle('');
                          setIsAddingPlanModule(false);
                        }
                      }}
                      className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedPlanModal.modules.map(mod => {
                  const modProg = getModuleProgress(mod);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => setSelectedModuleIdInPlan(mod.id)}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-violet-400 cursor-pointer space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{mod.title}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-violet-600">{modProg}%</span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? { ...p, modules: p.modules.filter(m => m.id !== mod.id) } : p));
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Excluir Módulo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{mod.topics.length} assuntos • Clique para ver assuntos</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONFIRM DELETE INLINE OR DELETE BUTTON */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {confirmDeletePlanId === selectedPlanModal.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-bold">Excluir plano?</span>
                  <button
                    onClick={() => handleDeletePlan(selectedPlanModal.id)}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Sim, excluir
                  </button>
                  <button
                    onClick={() => setConfirmDeletePlanId(null)}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeletePlanId(selectedPlanModal.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold"
                >
                  <Trash2 size={14} /> Excluir Plano
                </button>
              )}
              <button
                onClick={() => { setSelectedPlanId(null); setIsEditingPlan(false); setConfirmDeletePlanId(null); }}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL / LEVEL 3: DETALHES DO MÓDULO (ASSUNTOS REQ 11 & 12) */}
      {/* ==================================================================== */}
      {selectedModuleInPlan && selectedPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest">{selectedPlanModal.name}</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedModuleInPlan.title}</h3>
              </div>
              <button onClick={() => { setSelectedModuleIdInPlan(null); setIsAddingPlanTopic(false); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* ASSUNTOS LIST WITH TRIPLE STATUS REQ 12 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Assuntos do Módulo</h4>
                {!isAddingPlanTopic && (
                  <button
                    onClick={() => setIsAddingPlanTopic(true)}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Assunto
                  </button>
                )}
              </div>

              {isAddingPlanTopic && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do assunto..."
                    value={newPlanTopicTitle}
                    onChange={e => setNewPlanTopicTitle(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingPlanTopic(false); setNewPlanTopicTitle(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newPlanTopicTitle.trim()) {
                          const newT: StudyTopic = { id: Date.now().toString(), title: newPlanTopicTitle.trim(), status: 'nao_iniciado' };
                          setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? {
                            ...p,
                            modules: p.modules.map(m => m.id === selectedModuleInPlan.id ? { ...m, topics: [...m.topics, newT] } : m)
                          } : p));
                          setNewPlanTopicTitle('');
                          setIsAddingPlanTopic(false);
                        }
                      }}
                      className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {selectedModuleInPlan.topics.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopicStatus(selectedPlanModal.id, selectedModuleInPlan.id, topic.id)}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-800 cursor-pointer select-none text-xs hover:border-violet-300"
                  >
                    <span className={`font-bold ${topic.status === 'concluido' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {topic.title}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
                        {topic.status === 'concluido' && '🟢 CONCLUÍDO'}
                        {topic.status === 'em_andamento' && '🟡 EM ANDAMENTO'}
                        {topic.status === 'nao_iniciado' && '⚪ NÃO INICIADO'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? {
                            ...p,
                            modules: p.modules.map(m => m.id === selectedModuleInPlan.id ? { ...m, topics: m.topics.filter(t => t.id !== topic.id) } : m)
                          } : p));
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Excluir Assunto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setSelectedModuleIdInPlan(null); setIsAddingPlanTopic(false); }}
              className="w-full py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Voltar para Módulos
            </button>
          </div>
        </div>
      )}
      {selectedCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Editar Curso</h3>
              <button onClick={() => { setSelectedCourseId(null); setIsEditingCourse(false); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nome do Curso *</label>
                <input
                  type="text"
                  required
                  value={editCourseName}
                  onChange={e => setEditCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Plataforma / Instituição</label>
                <input
                  type="text"
                  value={editCoursePlatform}
                  onChange={e => setEditCoursePlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Instrutor / Professor</label>
                <input
                  type="text"
                  value={editCourseInstructor}
                  onChange={e => setEditCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Status de Conclusão</label>
                <select
                  value={editCourseStatus}
                  onChange={e => setEditCourseStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editCourseHasCertificate}
                    onChange={e => setEditCourseHasCertificate(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Award size={14} className="text-violet-500" />
                    Certificado de conclusão emitido?
                  </span>
                </label>

                {editCourseHasCertificate && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Detalhes / Link do Certificado</label>
                    <input
                      type="text"
                      placeholder="Ex: Certificado de 60 horas ou URL"
                      value={editCourseCertificateNotes}
                      onChange={e => setEditCourseCertificateNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleDeleteCourse(selectedCourseModal.id)}
                className="px-3 py-2 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
              >
                Excluir Curso
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCourseId(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedCourse}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL / LEVEL 2: DETALHES DO IDIOMA (REQ 14) */}
      {/* ==================================================================== */}
      {selectedLanguageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            {/* HEADER WITH EDIT TOGGLE */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              {isEditingLanguage ? (
                <div className="w-full space-y-2 pr-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editLangFlag}
                      onChange={e => setEditLangFlag(e.target.value)}
                      placeholder="Bandeira"
                      className="w-16 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none text-center"
                    />
                    <input
                      type="text"
                      value={editLangName}
                      onChange={e => setEditLangName(e.target.value)}
                      placeholder="Nome do Idioma"
                      className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <select
                    value={editLangLevel}
                    onChange={e => setEditLangLevel(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="A1">A1 — Iniciante</option>
                    <option value="A2">A2 — Básico</option>
                    <option value="B1">B1 — Intermediário</option>
                    <option value="B2">B2 — Independente</option>
                    <option value="C1">C1 — Avançado</option>
                    <option value="C2">C2 — Domínio Pleno</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSaveEditedLanguage} className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg">Salvar</button>
                    <button type="button" onClick={() => setIsEditingLanguage(false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedLanguageModal.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedLanguageModal.name}</h3>
                      <button
                        onClick={() => {
                          setEditLangName(selectedLanguageModal.name);
                          setEditLangFlag(selectedLanguageModal.flag);
                          setEditLangLevel(selectedLanguageModal.level);
                          setIsEditingLanguage(true);
                        }}
                        className="p-1 text-slate-400 hover:text-violet-600"
                        title="Editar Idioma"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-bold">Nível CEFR: {selectedLanguageModal.level}</span>
                  </div>
                </div>
              )}
              <button onClick={() => { setSelectedLanguageId(null); setIsEditingLanguage(false); setConfirmDeleteLangId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* SKILLS METERS */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Habilidades</h4>
              {[
                { key: 'vocabulary' as const, label: 'Vocabulário', val: selectedLanguageModal.skills.vocabulary },
                { key: 'grammar' as const, label: 'Gramática', val: selectedLanguageModal.skills.grammar },
                { key: 'listening' as const, label: 'Listening', val: selectedLanguageModal.skills.listening },
                { key: 'speaking' as const, label: 'Speaking', val: selectedLanguageModal.skills.speaking },
                { key: 'writing' as const, label: 'Writing', val: selectedLanguageModal.skills.writing },
              ].map(sk => (
                <div key={sk.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">{sk.label}</span>
                    <span className="text-violet-600 font-black">{sk.val}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sk.val}
                    onChange={e => {
                      const newV = parseInt(e.target.value);
                      setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? { ...l, skills: { ...l.skills, [sk.key]: newV } } : l));
                    }}
                    className="w-full h-1.5 accent-violet-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* LANGUAGE MODULES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Módulos do Idioma</h4>
                {!isAddingLangModule && (
                  <button
                    onClick={() => setIsAddingLangModule(true)}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Módulo
                  </button>
                )}
              </div>

              {isAddingLangModule && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do módulo..."
                    value={newLangModuleTitle}
                    onChange={e => setNewLangModuleTitle(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingLangModule(false); setNewLangModuleTitle(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newLangModuleTitle.trim()) {
                          const newM = { id: Date.now().toString(), title: newLangModuleTitle.trim(), topics: [] };
                          setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? { ...l, modules: [...l.modules, newM] } : l));
                          setNewLangModuleTitle('');
                          setIsAddingLangModule(false);
                        }
                      }}
                      className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {selectedLanguageModal.modules.map(mod => (
                  <div key={mod.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200">
                      <span>{mod.title}</span>
                      <div className="flex items-center gap-2">
                        {addingTopicForLangModId !== mod.id && (
                          <button
                            onClick={() => { setAddingTopicForLangModId(mod.id); setNewLangTopicTitle(''); }}
                            className="text-[11px] text-violet-600 hover:underline"
                          >
                            + Tópico
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? { ...l, modules: l.modules.filter(m => m.id !== mod.id) } : l));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Excluir Módulo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {addingTopicForLangModId === mod.id && (
                      <div className="p-2.5 bg-violet-100/50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                        <input
                          type="text"
                          placeholder="Nome do tópico..."
                          value={newLangTopicTitle}
                          onChange={e => setNewLangTopicTitle(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => { setAddingTopicForLangModId(null); setNewLangTopicTitle(''); }}
                            className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (newLangTopicTitle.trim()) {
                                const newT: StudyTopic = { id: Date.now().toString(), title: newLangTopicTitle.trim(), status: 'nao_iniciado' };
                                setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? {
                                  ...l,
                                  modules: l.modules.map(m => m.id === mod.id ? { ...m, topics: [...m.topics, newT] } : m)
                                } : l));
                                setNewLangTopicTitle('');
                                setAddingTopicForLangModId(null);
                              }
                            }}
                            className="px-2.5 py-1 bg-violet-600 text-white font-bold text-[11px] rounded-lg shadow-xs"
                          >
                            Adicionar Tópico
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      {mod.topics.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            const nextSt: Record<string, 'concluido' | 'em_andamento' | 'nao_iniciado'> = {
                              'nao_iniciado': 'em_andamento',
                              'em_andamento': 'concluido',
                              'concluido': 'nao_iniciado'
                            };
                            const newSt = nextSt[t.status];

                            setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? {
                              ...l,
                              modules: l.modules.map(m => m.id === mod.id ? {
                                ...m,
                                topics: m.topics.map(tp => tp.id === t.id ? { ...tp, status: newSt } : tp)
                              } : m)
                            } : l));
                          }}
                          className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg text-xs cursor-pointer select-none"
                        >
                          <span className={t.status === 'concluido' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                            {t.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold">
                              {t.status === 'concluido' && '🟢 CONCLUÍDO'}
                              {t.status === 'em_andamento' && '🟡 EM ANDAMENTO'}
                              {t.status === 'nao_iniciado' && '⚪ NÃO INICIADO'}
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? {
                                  ...l,
                                  modules: l.modules.map(m => m.id === mod.id ? { ...m, topics: m.topics.filter(tp => tp.id !== t.id) } : m)
                                } : l));
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Excluir Tópico"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONFIRM DELETE INLINE OR DELETE BUTTON */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {confirmDeleteLangId === selectedLanguageModal.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-bold">Excluir idioma?</span>
                  <button
                    onClick={() => handleDeleteLanguage(selectedLanguageModal.id)}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Sim, excluir
                  </button>
                  <button
                    onClick={() => setConfirmDeleteLangId(null)}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteLangId(selectedLanguageModal.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold"
                >
                  <Trash2 size={14} /> Excluir Idioma
                </button>
              )}
              <button
                onClick={() => { setSelectedLanguageId(null); setIsEditingLanguage(false); setConfirmDeleteLangId(null); }}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
