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
  Sparkles
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
export interface CourseLesson {
  id: string;
  title: string;
  status: 'concluido' | 'em_andamento' | 'nao_iniciado';
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  platform: string; // ex: Udemy, YouTube, Alura
  instructor?: string;
  status: 'em_andamento' | 'concluido' | 'pausado';
  modules: CourseModule[];
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
    modules: [
      {
        id: 'cm1',
        title: 'Módulo 1 — Fundamentos do Marketing',
        lessons: [
          { id: 'cl1', title: 'Introdução ao Marketing Digital', status: 'concluido' },
          { id: 'cl2', title: 'Definição de Público-alvo', status: 'concluido' },
          { id: 'cl3', title: 'Criação de Persona', status: 'em_andamento' },
          { id: 'cl4', title: 'Estratégia de Posicionamento', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'cm2',
        title: 'Módulo 2 — Copywriting e Oferta',
        lessons: [
          { id: 'cl5', title: 'Gatilhos Mentais Principais', status: 'nao_iniciado' },
          { id: 'cl6', title: 'Estruturação de Oferta Irresistível', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'dev_fullstack',
    name: 'Desenvolvimento Web Fullstack React & Node',
    description: 'Aplicações modernas com TypeScript e Tailwind',
    platform: 'Rocketseat',
    instructor: 'Diego Fernandes',
    status: 'em_andamento',
    modules: [
      {
        id: 'cm3',
        title: 'Módulo 1 — Fundamentos de React & Componentes',
        lessons: [
          { id: 'cl8', title: 'JSX e Componentização', status: 'concluido' },
          { id: 'cl9', title: 'Gerenciamento de Estado (useState)', status: 'concluido' },
          { id: 'cl10', title: 'Efeitos Colaterais (useEffect)', status: 'concluido' }
        ]
      }
    ]
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

export default function PersonalStudiesSection() {
  const [activeSubTab, setActiveSubTab] = useState<'estudos' | 'cursos' | 'idiomas'>('estudos');

  // 1. ESTUDOS STATE
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_plans_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDY_PLANS;
  });

  // Selected Study Plan Modal
  const [selectedPlanModal, setSelectedPlanModal] = useState<StudyPlan | null>(null);
  // Selected Module Inside Plan
  const [selectedModuleInPlan, setSelectedModuleInPlan] = useState<StudyModule | null>(null);

  // 2. CURSOS STATE
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_courses_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  // Selected Course Modal
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);
  const [selectedCourseModule, setSelectedCourseModule] = useState<CourseModule | null>(null);

  // 3. IDIOMAS STATE
  const [languages, setLanguages] = useState<LanguageItem[]>(() => {
    const saved = localStorage.getItem('lifehub_studies_languages_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LANGUAGES;
  });

  // Selected Language Modal
  const [selectedLanguageModal, setSelectedLanguageModal] = useState<LanguageItem | null>(null);

  // Modals for Adding New Items
  const [isAddingPlanModal, setIsAddingPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('Estudos Pessoais');

  const [isAddingCourseModal, setIsAddingCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePlatform, setNewCoursePlatform] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');

  const [isAddingLanguageModal, setIsAddingLanguageModal] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🌐');
  const [newLangLevel, setNewLangLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');

  // Inline edit states inside detail modals
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanCategory, setEditPlanCategory] = useState('');

  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseName, setEditCourseName] = useState('');
  const [editCoursePlatform, setEditCoursePlatform] = useState('');
  const [editCourseInstructor, setEditCourseInstructor] = useState('');

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
    if (selectedPlanModal?.id === id) setSelectedPlanModal(null);
    if (selectedModuleInPlan) setSelectedModuleInPlan(null);
    setConfirmDeletePlanId(null);
  };

  const handleSaveEditedPlan = () => {
    if (!selectedPlanModal || !editPlanName.trim()) return;
    const name = editPlanName.trim();
    const cat = editPlanCategory.trim() || 'Estudos Pessoais';
    setPlans(prev => prev.map(p => p.id === selectedPlanModal.id ? { ...p, name, category: cat } : p));
    setSelectedPlanModal(prev => prev ? { ...prev, name, category: cat } : null);
    setIsEditingPlan(false);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    const newC: Course = {
      id: Date.now().toString(),
      name: newCourseName.trim(),
      platform: newCoursePlatform.trim() || 'Plataforma Online',
      instructor: newCourseInstructor.trim(),
      status: 'em_andamento',
      modules: []
    };
    setCourses(prev => [...prev, newC]);
    setNewCourseName('');
    setNewCoursePlatform('');
    setNewCourseInstructor('');
    setIsAddingCourseModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    if (selectedCourseModal?.id === id) setSelectedCourseModal(null);
    setConfirmDeleteCourseId(null);
  };

  const handleSaveEditedCourse = () => {
    if (!selectedCourseModal || !editCourseName.trim()) return;
    const name = editCourseName.trim();
    const plat = editCoursePlatform.trim() || 'Online';
    const inst = editCourseInstructor.trim();
    setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? { ...c, name, platform: plat, instructor: inst } : c));
    setSelectedCourseModal(prev => prev ? { ...prev, name, platform: plat, instructor: inst } : null);
    setIsEditingCourse(false);
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
    if (selectedLanguageModal?.id === id) setSelectedLanguageModal(null);
    setConfirmDeleteLangId(null);
  };

  const handleSaveEditedLanguage = () => {
    if (!selectedLanguageModal || !editLangName.trim()) return;
    const name = editLangName.trim();
    const flag = editLangFlag.trim() || '🌐';
    setLanguages(prev => prev.map(l => l.id === selectedLanguageModal.id ? { ...l, name, flag, level: editLangLevel } : l));
    setSelectedLanguageModal(prev => prev ? { ...prev, name, flag, level: editLangLevel } : null);
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

    // Update modal references if active
    if (selectedPlanModal && selectedPlanModal.id === planId) {
      setSelectedPlanModal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id !== moduleId) return m;
            return {
              ...m,
              topics: m.topics.map(t => t.id === topicId ? { ...t, status: (t.status === 'nao_iniciado' ? 'em_andamento' : t.status === 'em_andamento' ? 'concluido' : 'nao_iniciado') } : t)
            };
          })
        };
      });
    }

    if (selectedModuleInPlan && selectedModuleInPlan.id === moduleId) {
      setSelectedModuleInPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          topics: prev.topics.map(t => t.id === topicId ? { ...t, status: (t.status === 'nao_iniciado' ? 'em_andamento' : t.status === 'em_andamento' ? 'concluido' : 'nao_iniciado') } : t)
        };
      });
    }
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
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Estudos</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Planos de estudo em módulos, cursos online e idiomas</p>
          </div>
        </div>

        {/* SUB-TABS (EXACTLY THREE: Estudos, Cursos, Idiomas) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('estudos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'estudos'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Estudos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cursos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'cursos'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award size={14} />
            <span>Cursos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('idiomas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeSubTab === 'idiomas'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe size={14} />
            <span>Idiomas</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. SUB-ABA: ESTUDOS (RESUMIDA NA TELA INICIAL REQ 10 & 11) */}
      {/* ==================================================================== */}
      {activeSubTab === 'estudos' && (
        <div className="space-y-6">
          
          {/* OVERALL PROGRESS BANNER */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200 block">Progresso Geral</span>
              <h2 className="text-lg font-black">Estudos Pessoais</h2>
            </div>
            <div className="bg-white/15 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-2xl font-black">{getOverallStudiesProgress()}%</span>
              <span className="text-[10px] text-violet-200 block uppercase font-bold">Concluído</span>
            </div>
          </div>

          {/* CONTROL BAR */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Planos de Estudo</h2>
            <button
              onClick={() => setIsAddingPlanModal(true)}
              className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Novo Plano
            </button>
          </div>

          {/* LEVEL 1: SUMMARY CARDS OF STUDY PLANS (ONLY SHOW PROGRESS, NO MODULES OPEN REQ 10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plans.map(plan => {
              const prog = getPlanProgress(plan);

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanModal(plan)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-violet-400 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-violet-600 transition-colors">
                        {plan.name}
                      </h3>
                      <span className="text-xs text-slate-400">{plan.modules.length} módulos</span>
                    </div>
                    <span className="text-base font-black text-violet-600 dark:text-violet-400">{prog}%</span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-violet-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 group-hover:text-violet-500 font-bold">
                    <span>Ver Módulos</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SUB-ABA: CURSOS (RESUMIDA NA TELA INICIAL REQ 13) */}
      {/* ==================================================================== */}
      {activeSubTab === 'cursos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Cursos Cadastrados</h2>
            <button
              onClick={() => setIsAddingCourseModal(true)}
              className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Adicionar Curso
            </button>
          </div>

          {/* LEVEL 1: SUMMARY CARDS OF COURSES (REQ 13) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map(course => {
              const prog = getCourseProgress(course);

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseModal(course)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-violet-400 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 rounded-full text-[10px] font-bold">
                        {course.platform}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1 group-hover:text-violet-600 transition-colors">
                        {course.name}
                      </h3>
                    </div>
                    <span className="text-base font-black text-violet-600 dark:text-violet-400">{prog}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-violet-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 group-hover:text-violet-500 font-bold">
                    <span>{course.modules.length} Módulos</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. SUB-ABA: IDIOMAS (RESUMIDA NA TELA INICIAL REQ 14) */}
      {/* ==================================================================== */}
      {activeSubTab === 'idiomas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Idiomas</h2>
            <button
              onClick={() => setIsAddingLanguageModal(true)}
              className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Adicionar Idioma
            </button>
          </div>

          {/* LEVEL 1: SUMMARY CARDS OF LANGUAGES (REQ 14) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map(lang => {
              const prog = getLanguageProgress(lang);

              return (
                <div
                  key={lang.id}
                  onClick={() => setSelectedLanguageModal(lang)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 hover:border-violet-400 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-violet-600 transition-colors">
                          {lang.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-bold">Nível {lang.level}</span>
                      </div>
                    </div>
                    <span className="text-base font-black text-violet-600 dark:text-violet-400">{prog}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-violet-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 group-hover:text-violet-500 font-bold">
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
                <label className="text-xs font-bold text-slate-500 block mb-1">Nome do Curso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: React Avançado"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Plataforma</label>
                <input
                  type="text"
                  placeholder="Ex: Udemy, YouTube, Alura"
                  value={newCoursePlatform}
                  onChange={e => setNewCoursePlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Instrutor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Silva"
                  value={newCourseInstructor}
                  onChange={e => setNewCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-violet-500"
                />
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
                className="px-5 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-violet-700"
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
              <button onClick={() => { setSelectedPlanModal(null); setIsEditingPlan(false); setConfirmDeletePlanId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
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
                          setSelectedPlanModal(prev => prev ? { ...prev, modules: [...prev.modules, newM] } : null);
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
                      onClick={() => setSelectedModuleInPlan(mod)}
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
                              setSelectedPlanModal(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== mod.id) } : null);
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
                onClick={() => { setSelectedPlanModal(null); setIsEditingPlan(false); setConfirmDeletePlanId(null); }}
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
              <button onClick={() => { setSelectedModuleInPlan(null); setIsAddingPlanTopic(false); }} className="p-1 text-slate-400 hover:text-slate-600">
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
                          setSelectedModuleInPlan(prev => prev ? { ...prev, topics: [...prev.topics, newT] } : null);
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
                          setSelectedModuleInPlan(prev => prev ? { ...prev, topics: prev.topics.filter(t => t.id !== topic.id) } : null);
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
              onClick={() => { setSelectedModuleInPlan(null); setIsAddingPlanTopic(false); }}
              className="w-full py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Voltar para Módulos
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL / LEVEL 2: DETALHES DO CURSO (REQ 13) */}
      {/* ==================================================================== */}
      {selectedCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            {/* HEADER WITH EDIT TOGGLE */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              {isEditingCourse ? (
                <div className="w-full space-y-2 pr-4">
                  <input
                    type="text"
                    value={editCourseName}
                    onChange={e => setEditCourseName(e.target.value)}
                    placeholder="Nome do Curso"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={editCoursePlatform}
                    onChange={e => setEditCoursePlatform(e.target.value)}
                    placeholder="Plataforma"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={editCourseInstructor}
                    onChange={e => setEditCourseInstructor(e.target.value)}
                    placeholder="Instrutor"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSaveEditedCourse} className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg">Salvar</button>
                    <button type="button" onClick={() => setIsEditingCourse(false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest">{selectedCourseModal.platform}</span>
                    <button
                      onClick={() => {
                        setEditCourseName(selectedCourseModal.name);
                        setEditCoursePlatform(selectedCourseModal.platform);
                        setEditCourseInstructor(selectedCourseModal.instructor || '');
                        setIsEditingCourse(true);
                      }}
                      className="p-1 text-slate-400 hover:text-violet-600"
                      title="Editar Curso"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedCourseModal.name}</h3>
                  {selectedCourseModal.instructor && <p className="text-xs text-slate-400">Prof. {selectedCourseModal.instructor}</p>}
                </div>
              )}
              <button onClick={() => { setSelectedCourseModal(null); setIsEditingCourse(false); setConfirmDeleteCourseId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* COURSE MODULES & LESSONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Módulos do Curso</h4>
                {!isAddingCourseModule && (
                  <button
                    onClick={() => setIsAddingCourseModule(true)}
                    className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Módulo
                  </button>
                )}
              </div>

              {isAddingCourseModule && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do módulo..."
                    value={newCourseModuleTitle}
                    onChange={e => setNewCourseModuleTitle(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingCourseModule(false); setNewCourseModuleTitle(''); }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newCourseModuleTitle.trim()) {
                          const newM: CourseModule = { id: Date.now().toString(), title: newCourseModuleTitle.trim(), lessons: [] };
                          setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? { ...c, modules: [...c.modules, newM] } : c));
                          setSelectedCourseModal(prev => prev ? { ...prev, modules: [...prev.modules, newM] } : null);
                          setNewCourseModuleTitle('');
                          setIsAddingCourseModule(false);
                        }
                      }}
                      className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {selectedCourseModal.modules.map(mod => (
                <div key={mod.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{mod.title}</h5>
                    <div className="flex items-center gap-2">
                      {addingLessonForModId !== mod.id && (
                        <button
                          onClick={() => { setAddingLessonForModId(mod.id); setNewLessonTitle(''); }}
                          className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} /> Aula
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? { ...c, modules: c.modules.filter(m => m.id !== mod.id) } : c));
                          setSelectedCourseModal(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== mod.id) } : null);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Excluir Módulo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {addingLessonForModId === mod.id && (
                    <div className="p-2.5 bg-violet-100/50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl space-y-2">
                      <input
                        type="text"
                        placeholder="Nome da aula..."
                        value={newLessonTitle}
                        onChange={e => setNewLessonTitle(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => { setAddingLessonForModId(null); setNewLessonTitle(''); }}
                          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (newLessonTitle.trim()) {
                              const newL: CourseLesson = { id: Date.now().toString(), title: newLessonTitle.trim(), status: 'nao_iniciado' };
                              setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? {
                                ...c,
                                modules: c.modules.map(m => m.id === mod.id ? { ...m, lessons: [...m.lessons, newL] } : m)
                              } : c));
                              setSelectedCourseModal(prev => prev ? {
                                ...prev,
                                modules: prev.modules.map(m => m.id === mod.id ? { ...m, lessons: [...m.lessons, newL] } : m)
                              } : null);
                              setNewLessonTitle('');
                              setAddingLessonForModId(null);
                            }
                          }}
                          className="px-2.5 py-1 bg-violet-600 text-white font-bold text-[11px] rounded-lg shadow-xs"
                        >
                          Adicionar Aula
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          const nextSt: Record<string, 'concluido' | 'em_andamento' | 'nao_iniciado'> = {
                            'nao_iniciado': 'em_andamento',
                            'em_andamento': 'concluido',
                            'concluido': 'nao_iniciado'
                          };
                          const newStatus = nextSt[lesson.status];

                          setCourses(prev => prev.map(c => {
                            if (c.id !== selectedCourseModal.id) return c;
                            return {
                              ...c,
                              modules: c.modules.map(m => m.id === mod.id ? {
                                ...m,
                                lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, status: newStatus } : l)
                              } : m)
                            };
                          }));

                          setSelectedCourseModal(prev => prev ? {
                            ...prev,
                            modules: prev.modules.map(m => m.id === mod.id ? {
                              ...m,
                              lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, status: newStatus } : l)
                            } : m)
                          } : null);
                        }}
                        className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs cursor-pointer select-none"
                      >
                        <span className={`font-semibold ${lesson.status === 'concluido' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {lesson.title}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            {lesson.status === 'concluido' && '✓ Concluído'}
                            {lesson.status === 'em_andamento' && '🟡 Em Andamento'}
                            {lesson.status === 'nao_iniciado' && '○ Pendente'}
                          </span>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setCourses(prev => prev.map(c => c.id === selectedCourseModal.id ? {
                                ...c,
                                modules: c.modules.map(m => m.id === mod.id ? { ...m, lessons: m.lessons.filter(l => l.id !== lesson.id) } : m)
                              } : c));
                              setSelectedCourseModal(prev => prev ? {
                                ...prev,
                                modules: prev.modules.map(m => m.id === mod.id ? { ...m, lessons: m.lessons.filter(l => l.id !== lesson.id) } : m)
                              } : null);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Excluir Aula"
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

            {/* CONFIRM DELETE INLINE OR DELETE BUTTON */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {confirmDeleteCourseId === selectedCourseModal.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-bold">Excluir curso?</span>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourseModal.id)}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Sim, excluir
                  </button>
                  <button
                    onClick={() => setConfirmDeleteCourseId(null)}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteCourseId(selectedCourseModal.id)}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold"
                >
                  <Trash2 size={14} /> Excluir Curso
                </button>
              )}
              <button
                onClick={() => { setSelectedCourseModal(null); setIsEditingCourse(false); setConfirmDeleteCourseId(null); }}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Fechar Detalhes
              </button>
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
              <button onClick={() => { setSelectedLanguageModal(null); setIsEditingLanguage(false); setConfirmDeleteLangId(null); }} className="p-1 text-slate-400 hover:text-slate-600">
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
                      setSelectedLanguageModal(prev => prev ? { ...prev, skills: { ...prev.skills, [sk.key]: newV } } : null);
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
                          setSelectedLanguageModal(prev => prev ? { ...prev, modules: [...prev.modules, newM] } : null);
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
                            setSelectedLanguageModal(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== mod.id) } : null);
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
                                setSelectedLanguageModal(prev => prev ? {
                                  ...prev,
                                  modules: prev.modules.map(m => m.id === mod.id ? { ...m, topics: [...m.topics, newT] } : m)
                                } : null);
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
                            setSelectedLanguageModal(prev => prev ? {
                              ...prev,
                              modules: prev.modules.map(m => m.id === mod.id ? {
                                ...m,
                                topics: m.topics.map(tp => tp.id === t.id ? { ...tp, status: newSt } : tp)
                              } : m)
                            } : null);
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
                                setSelectedLanguageModal(prev => prev ? {
                                  ...prev,
                                  modules: prev.modules.map(m => m.id === mod.id ? { ...m, topics: m.topics.filter(tp => tp.id !== t.id) } : m)
                                } : null);
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
                onClick={() => { setSelectedLanguageModal(null); setIsEditingLanguage(false); setConfirmDeleteLangId(null); }}
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
