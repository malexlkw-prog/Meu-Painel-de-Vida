import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  BookOpen, 
  Bookmark, 
  MapPin, 
  Clock, 
  User, 
  Flame, 
  Star, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Search, 
  Sparkles, 
  BookMarked,
  Heart,
  Users,
  TrendingUp,
  FileText,
  BookmarkPlus,
  Compass,
  Filter,
  X
} from 'lucide-react';
import { 
  ChurchState, 
  ChurchEvent, 
  ChurchCommitment, 
  ChurchSpiritualGoal, 
  ChurchStudy, 
  ChurchSermon, 
  ChurchPrayerRequest, 
  ChurchMinistry 
} from '../types';

interface ChurchSectionProps {
  churchData?: ChurchState;
  onUpdateChurch: (updated: ChurchState) => void;
}

const DEFAULT_CHURCH_STATE: ChurchState = {
  events: [
    {
      id: "ch-ev-1",
      title: "Culto de Celebração de Domingo",
      date: "2026-06-21",
      time: "19:00",
      location: "Templo Principal",
      ministry: "Louvor e Pregação",
      description: "Culto principal de adoração, comunhão e pregação da Palavra espontânea.",
      priority: "high",
      status: "confirmed"
    },
    {
      id: "ch-ev-2",
      title: "Ensaio Geral do Louvor",
      date: "2026-06-20",
      time: "15:00",
      location: "Auditório B",
      ministry: "Louvor",
      description: "Preparação de solos e cânticos para o grande culto de Domingo à noite.",
      priority: "medium",
      status: "confirmed"
    }
  ],
  commitments: [
    { id: "ch-cm-1", text: "Preparar mensagem para Escola Bíblica Dominical", completed: false, createdAt: "2026-06-19" },
    { id: "ch-cm-2", text: "Ensaiar louvores novos no violão", completed: true, createdAt: "2026-06-18" },
    { id: "ch-cm-3", text: "Comprar pão e suco para o café da comunhão", completed: false, createdAt: "2026-06-19" }
  ],
  goals: [
    { id: "ch-gl-1", title: "Orar pelo menos 20min todos os dias", targetCount: 30, currentCount: 18, completed: false, createdAt: "2026-06-01", unit: "dias" },
    { id: "ch-gl-2", title: "Ler a Bíblia diariamente", targetCount: 30, currentCount: 22, completed: false, createdAt: "2026-06-01", unit: "dias" },
    { id: "ch-gl-3", title: "Participar de todos os cultos do mês", targetCount: 8, currentCount: 6, completed: false, createdAt: "2026-06-01", unit: "cultos" },
    { id: "ch-gl-4", title: "Jejuar 1 vez por semana", targetCount: 4, currentCount: 4, completed: true, createdAt: "2026-06-01", unit: "vezes" }
  ],
  studies: [
    {
      id: "ch-st-1",
      title: "O Sermão do Monte e a Justiça Prática",
      category: "Estudos Teológicos",
      date: "2026-06-15",
      verses: "Mateus 5:1-12",
      notes: "Análise profunda sobre as bem-aventuranças. Elas não são exigências legais, mas sim o Fruto do Espírito na vida de quem já faz parte do Reino.",
      reflections: "Como posso ser compassivo, misericordioso e promotor da paz diariamente na papelaria e nos estudos?",
      lessons: "A verdadeira justiça cristã excede em muito as aparências farisaicas."
    }
  ],
  sermons: [
    {
      id: "ch-sr-1",
      title: "Firmeza em Meio aos Ventos",
      preacher: "Pastor Roberto",
      date: "2026-06-14",
      theme: "Fé e Obediência prática",
      verses: "Lucas 6:46-49",
      summary: "A tempestade bate na vida de quem ouve e pratica, e também na vida de quem apenas ouve. O que determina a queda ou permanência é a profundidade do alicerce (obediência).",
      lessons: "Ouvir a Palavra sem mudarmos nossas ações é pura ilusão.",
      application: "Identificar as áreas financeiras e profissionais e submete-las a princípios divinos de generosidade."
    }
  ],
  prayers: [
    { id: "ch-pr-1", request: "Restauração física da saúde da avó de Maria", person: "Maria Souza", date: "2026-06-18", status: "praying", notes: "Orar no culto das quartas-feiras." },
    { id: "ch-pr-2", request: "Direção profissional para nova carreira de Marcos", person: "Marcos", date: "2026-06-12", status: "answered", notes: "Agradecer no culto de domingo, Deus abriu as portas!" }
  ],
  ministries: [
    {
      id: "ch-mn-1",
      name: "Louvor",
      role: "Instrumentista (Violão/Guitarra)",
      scale: "Escala dia 21/06",
      responsibilities: "Tocar nos cultos do domingo à noite e acompanhar a equipe titular nos ensaios integrados.",
      nextActivities: "Praticar as 4 canções que o líder enviou no grupo oficial."
    }
  ],
  bibleReadingStreak: 12,
  cultsAttendedCount: 14
};

export default function ChurchSection({ churchData, onUpdateChurch }: ChurchSectionProps) {
  
  // State initialization with defaults
  const state = churchData || DEFAULT_CHURCH_STATE;
  
  // Safe state getters
  const events = state.events || [];
  const commitments = state.commitments || [];
  const goals = state.goals || [];
  const studies = state.studies || [];
  const sermons = state.sermons || [];
  const prayers = state.prayers || [];
  const ministries = state.ministries || [];
  const bibleReadingStreak = state.bibleReadingStreak ?? 12;
  const cultsAttendedCount = state.cultsAttendedCount ?? 14;

  // Active church subtab switcher
  const [subTab, setSubTab] = useState<'planning' | 'commitments' | 'studies' | 'sermons' | 'prayers' | 'ministries' | 'dashboard'>('dashboard');

  // Interactive Form Dialog Open states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCommitmentForm, setShowCommitmentForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [showSermonForm, setShowSermonForm] = useState(false);
  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [showMinistryForm, setShowMinistryForm] = useState(false);

  // Form Field temporary states
  // Event Form
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    location: '',
    ministry: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'planning' as 'planning' | 'confirmed' | 'completed' | 'cancelled'
  });

  // Commitment Form
  const [newCm, setNewCm] = useState({ text: '' });

  // Spiritual Goal Form
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetCount: 30,
    currentCount: 0,
    unit: 'dias'
  });

  // Studies Form
  const [newStudy, setNewStudy] = useState({
    title: '',
    category: 'Geral',
    date: new Date().toISOString().split('T')[0],
    verses: '',
    notes: '',
    reflections: '',
    lessons: ''
  });

  // Sermon Form
  const [newSermon, setNewSermon] = useState({
    title: '',
    preacher: '',
    date: new Date().toISOString().split('T')[0],
    theme: '',
    verses: '',
    summary: '',
    lessons: '',
    application: ''
  });

  // Prayer Request Form
  const [newPrayer, setNewPrayer] = useState({
    request: '',
    person: '',
    notes: ''
  });

  // Ministry Form
  const [newMinistry, setNewMinistry] = useState({
    name: 'Louvor',
    role: '',
    scale: '',
    responsibilities: '',
    nextActivities: ''
  });

  // Search filter inside study library
  const [studyFilter, setStudyFilter] = useState('');
  const [studyCategory, setStudyCategory] = useState('All');

  // Safe mutation wrapper
  const updateChurchState = (mutation: Partial<ChurchState>) => {
    onUpdateChurch({
      ...state,
      ...mutation
    });
  };

  // Mutators
  // Events
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const item: ChurchEvent = {
      ...newEvent,
      id: `ch-ev-${Date.now()}`
    };
    updateChurchState({ events: [item, ...events] });
    setShowEventForm(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      location: '',
      ministry: '',
      description: '',
      priority: 'medium',
      status: 'planning'
    });
  };

  const deleteEvent = (id: string) => {
    updateChurchState({ events: events.filter(e => e.id !== id) });
  };

  const setEventStatus = (id: string, status: 'planning' | 'confirmed' | 'completed' | 'cancelled') => {
    updateChurchState({
      events: events.map(e => e.id === id ? { ...e, status } : e)
    });
  };

  // Commitments Checklist
  const addCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCm.text.trim()) return;
    const item: ChurchCommitment = {
      id: `ch-cm-${Date.now()}`,
      text: newCm.text.trim(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    updateChurchState({ commitments: [...commitments, item] });
    setShowCommitmentForm(false);
    setNewCm({ text: '' });
  };

  const toggleCommitment = (id: string) => {
    updateChurchState({
      commitments: commitments.map(c => c.id === id ? { ...c, completed: !c.completed } : c)
    });
  };

  const deleteCommitment = (id: string) => {
    updateChurchState({ commitments: commitments.filter(c => c.id !== id) });
  };

  // Spiritual Goals
  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    const item: ChurchSpiritualGoal = {
      id: `ch-gl-${Date.now()}`,
      title: newGoal.title.trim(),
      targetCount: Math.max(1, newGoal.targetCount),
      currentCount: Math.max(0, newGoal.currentCount),
      completed: newGoal.currentCount >= newGoal.targetCount,
      createdAt: new Date().toISOString().split('T')[0],
      unit: newGoal.unit
    };
    updateChurchState({ goals: [...goals, item] });
    setShowGoalForm(false);
    setNewGoal({ title: '', targetCount: 30, currentCount: 0, unit: 'dias' });
  };

  const incrementGoalProgress = (id: string) => {
    updateChurchState({
      goals: goals.map(g => {
        if (g.id === id) {
          const nextCount = Math.min(g.targetCount, g.currentCount + 1);
          return {
            ...g,
            currentCount: nextCount,
            completed: nextCount >= g.targetCount
          };
        }
        return g;
      })
    });
  };

  const deleteGoal = (id: string) => {
    updateChurchState({ goals: goals.filter(g => g.id !== id) });
  };

  // Bible Studies
  const addStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudy.title.trim()) return;
    const item: ChurchStudy = {
      ...newStudy,
      id: `ch-st-${Date.now()}`
    };
    updateChurchState({ studies: [item, ...studies] });
    setShowStudyForm(false);
    setNewStudy({
      title: '',
      category: 'Geral',
      date: new Date().toISOString().split('T')[0],
      verses: '',
      notes: '',
      reflections: '',
      lessons: ''
    });
  };

  const deleteStudy = (id: string) => {
    updateChurchState({ studies: studies.filter(s => s.id !== id) });
  };

  // Preachings / Sermons
  const addSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSermon.title.trim()) return;
    const item: ChurchSermon = {
      ...newSermon,
      id: `ch-sr-${Date.now()}`
    };
    updateChurchState({ sermons: [item, ...sermons] });
    setShowSermonForm(false);
    setNewSermon({
      title: '',
      preacher: '',
      date: new Date().toISOString().split('T')[0],
      theme: '',
      verses: '',
      summary: '',
      lessons: '',
      application: ''
    });
  };

  const deleteSermon = (id: string) => {
    updateChurchState({ sermons: sermons.filter(s => s.id !== id) });
  };

  // Prayer Requests
  const addPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.request.trim()) return;
    const item: ChurchPrayerRequest = {
      id: `ch-pr-${Date.now()}`,
      request: newPrayer.request.trim(),
      person: newPrayer.person.trim() || 'Precioso',
      date: new Date().toISOString().split('T')[0],
      status: 'praying',
      notes: newPrayer.notes.trim()
    };
    updateChurchState({ prayers: [item, ...prayers] });
    setShowPrayerForm(false);
    setNewPrayer({ request: '', person: '', notes: '' });
  };

  const setPrayerStatus = (id: string, status: 'praying' | 'answered' | 'archived') => {
    updateChurchState({
      prayers: prayers.map(p => p.id === id ? { ...p, status } : p)
    });
  };

  const deletePrayer = (id: string) => {
    updateChurchState({ prayers: prayers.filter(p => p.id !== id) });
  };

  // Ministries participation
  const addMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinistry.role.trim()) return;
    const item: ChurchMinistry = {
      ...newMinistry,
      id: `ch-mn-${Date.now()}`
    };
    updateChurchState({ ministries: [...ministries, item] });
    setShowMinistryForm(false);
    setNewMinistry({
      name: 'Louvor',
      role: '',
      scale: '',
      responsibilities: '',
      nextActivities: ''
    });
  };

  const deleteMinistry = (id: string) => {
    updateChurchState({ ministries: ministries.filter(m => m.id !== id) });
  };

  // Calculations for stats
  const activePrayersCount = prayers.filter(p => p.status === 'praying').length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const completedStudiesCount = studies.length;
  const activeSermonRegistries = sermons.length;

  const totalGoalsProgressPercentage = goals.length > 0
    ? Math.round((goals.reduce((acc, curr) => acc + (curr.currentCount / curr.targetCount), 0) / goals.length) * 100)
    : 0;

  // Filter studies library
  const categoriesList = ['All', ...Array.from(new Set(studies.map(s => s.category)))];
  const filteredStudies = studies.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(studyFilter.toLowerCase()) || 
                          s.verses.toLowerCase().includes(studyFilter.toLowerCase()) || 
                          s.category.toLowerCase().includes(studyFilter.toLowerCase());
    const matchesCategory = studyCategory === 'All' || s.category === studyCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* CHURCH TITLE HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-655 to-yellow-500 rounded-3xl p-5 md:p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-amber-400/20">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛪</span>
            <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md leading-none">
              Vida Eclesiástica
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-tight">
            Igreja & Espiritualidade
          </h1>
          <p className="text-xs text-amber-50/90 font-medium max-w-2xl">
            Acompanhe suas escalas de louvor, registre pregações, gerencie compromissos dos ministérios, organize sua biblioteca de estudos bíblicos, metas espirituais e pedidos de oração integrados.
          </p>
        </div>

        {/* Counter Stats Badge Row */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 bg-white/10 dark:bg-slate-900/40 rounded-2xl flex items-center gap-3 border border-white/10">
            <Flame className="text-yellow-200 animate-pulse" size={24} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-amber-100">Streak Bíblico</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black">{bibleReadingStreak}</span>
                <span className="text-[10px] text-amber-100 font-bold">dias</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white/10 dark:bg-slate-900/40 rounded-2xl flex items-center gap-3 border border-white/10">
            <Compass className="text-yellow-100" size={24} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-amber-100">Cultos do Mês</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black">{cultsAttendedCount}</span>
                <span className="text-[10px] text-amber-100 font-bold">presenças</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHURCH NAVIGATION TABS */}
      <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-200/50 dark:border-slate-850/50">
        <button
          onClick={() => setSubTab('dashboard')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'dashboard'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📅 Resumo Mensal
        </button>
        <button
          onClick={() => setSubTab('planning')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'planning'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          🗓️ Eventos & Cultos
        </button>
        <button
          onClick={() => setSubTab('commitments')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'commitments'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          ✅ Compromissos & Metas
        </button>
        <button
          onClick={() => setSubTab('studies')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'studies'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📖 Biblioteca de Estudos
        </button>
        <button
          onClick={() => setSubTab('sermons')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'sermons'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          ✍️ Pregações Ouvidas
        </button>
        <button
          onClick={() => setSubTab('prayers')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'prayers'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          🙏 Pedidos de Oração ({activePrayersCount})
        </button>
        <button
          onClick={() => setSubTab('ministries')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all select-none cursor-pointer shrink-0 ${
            subTab === 'ministries'
              ? 'bg-amber-500 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          ❤️ Meus Ministérios ({ministries.length})
        </button>
      </div>

      {/* DISPATCH SUBTAB VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 0: INTERACTIVE CENTRAL CHURCH DASHBOARD */}
        {subTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick stats overview banner */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400/90 select-none">Orando por</span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-amber-550">{activePrayersCount}</span>
                  <span className="text-[10px] text-slate-415 block font-bold">pedidos ativos</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400/90 select-none">Estudos salvos</span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-violet-500">{completedStudiesCount}</span>
                  <span className="text-[10px] text-slate-415 block font-bold">concluídos</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400/90 select-none">Pregações</span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-indigo-505">{activeSermonRegistries}</span>
                  <span className="text-[10px] text-slate-415 block font-bold">esboços gravados</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400/90 select-none">Metas unidas</span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-emerald-500">{completedGoalsCount}</span>
                  <span className="text-[10px] text-slate-415 block font-bold">concluídas</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between col-span-2">
                <span className="text-[10px] font-black uppercase text-slate-400/90 select-none">Progresso Meta Geral</span>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-amber-600 font-extrabold">{totalGoalsProgressPercentage}%</span>
                    <span className="text-slate-400">{completedGoalsCount}/{goals.length} Metas</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${totalGoalsProgressPercentage}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-list preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Upcoming Event reminders */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4.5 rounded-3xl space-y-3.5 shadow-3xs">
                <div className="flex justify-between items-center select-none">
                  <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                    📅 Próximos Compromissos & Escalas
                  </h3>
                  <button onClick={() => setSubTab('planning')} className="text-[10px] font-black text-amber-500 hover:underline">
                    Ver todos
                  </button>
                </div>
                
                <div className="space-y-3">
                  {events.slice(0, 3).map(ev => {
                    const isHigh = ev.priority === 'high';
                    return (
                      <div key={ev.id} className="p-3 bg-amber-50/20 dark:bg-slate-950/40 border border-amber-100/30 dark:border-slate-850 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate">{ev.title}</span>
                          <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-full leading-none shrink-0 ${
                            isHigh ? 'bg-rose-500/15 text-rose-500' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {ev.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-450 font-semibold select-none">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={11} className="text-amber-500" /> {ev.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-indigo-400" /> {ev.time}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                          {ev.location} • {ev.ministry || 'Igreja'}
                        </p>
                      </div>
                    );
                  })}
                  {events.length === 0 && (
                    <p className="text-xs italic text-slate-450 py-2">Nenhum evento registrado</p>
                  )}
                </div>
              </div>

              {/* High priority espiritual goals checklist */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4.5 rounded-3xl space-y-3.5 shadow-3xs">
                <div className="flex justify-between items-center select-none">
                  <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                    🎯 Metas & Leitura Espiritual
                  </h3>
                  <button onClick={() => setSubTab('commitments')} className="text-[10px] font-black text-amber-500 hover:underline">
                    Expandir
                  </button>
                </div>
                
                <div className="space-y-4">
                  {goals.slice(0, 3).map(gl => {
                    const perc = Math.round((gl.currentCount / gl.targetCount) * 100);
                    return (
                      <div key={gl.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold gap-2">
                          <span className="text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                            🌟 {gl.title}
                          </span>
                          <button
                            onClick={() => incrementGoalProgress(gl.id)}
                            className="bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 text-amber-600 p-1 py-0.5 rounded-lg border border-amber-300/40 text-[9px] font-black cursor-pointer active:scale-95"
                          >
                            +1
                          </button>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold leading-none select-none">
                          <span>{gl.currentCount} / {gl.targetCount} {gl.unit}</span>
                          <span>{perc}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-350" style={{ width: `${perc}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {goals.length === 0 && (
                    <p className="text-xs italic text-slate-455 py-2">Nenhuma meta espiritual declarada</p>
                  )}
                </div>
              </div>

              {/* Active Church commitments */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4.5 rounded-3xl space-y-3.5 shadow-3xs">
                <div className="flex justify-between items-center select-none">
                  <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                    ✅ Checklist Igreja
                  </h3>
                  <button onClick={() => setSubTab('commitments')} className="text-[10px] font-black text-amber-500 hover:underline">
                    Gerenciar
                  </button>
                </div>
                
                <div className="space-y-2.5">
                  {commitments.slice(0, 4).map(cm => (
                    <div 
                      key={cm.id}
                      onClick={() => toggleCommitment(cm.id)}
                      className="flex items-center gap-2.5 p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-850/55 rounded-xl cursor-pointer"
                    >
                      <div className={`w-4 h-4 border rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        cm.completed 
                          ? 'bg-amber-500 border-amber-500 text-white' 
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                      }`}>
                        {cm.completed && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs font-semibold truncate flex-1 leading-normal ${
                        cm.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-750 dark:text-slate-300'
                      }`}>
                        {cm.text}
                      </span>
                    </div>
                  ))}
                  {commitments.length === 0 && (
                    <p className="text-xs italic text-slate-455 py-2">Sem afazeres no checklist</p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 1: MONTHLY CALENDAR & SERVICES/EVENTS PLANNER */}
        {subTab === 'planning' && (
          <motion.div
            key="planning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Programação de Cultos & Eventos
                </h2>
                <p className="text-xs text-slate-400">Marque ensaios, vigílias, reuniões de congressos e eventos específicos.</p>
              </div>
              <button
                onClick={() => setShowEventForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer transition-transform"
              >
                <Plus size={14} /> Registrar Evento
              </button>
            </div>

            {/* Event cards list Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => {
                const isHigh = ev.priority === 'high';
                
                return (
                  <div key={ev.id} className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2.5xl flex flex-col justify-between relative shadow-3xs">
                    
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[9px] uppercase font-black tracking-widest text-amber-600">
                          {ev.ministry || "Igreja Geral"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full ${
                            isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {ev.priority}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white leading-snug">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 lines-clamp-2">
                        {ev.description}
                      </p>
                    </div>

                    {/* Middle details info row */}
                    <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3 space-y-2 text-[10px] font-semibold text-slate-450">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={12} className="text-amber-500" />
                        <span>Dia: {ev.date} às {ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-indigo-400" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    {/* Bottom controller handles */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 select-none">
                        <span className="text-[10px] font-black uppercase text-slate-400 mr-1.5">Status:</span>
                        <select
                          value={ev.status}
                          onChange={(e) => setEventStatus(ev.id, e.target.value as any)}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-black rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          <option value="planning">Planejado</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => deleteEvent(ev.id)}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                        title="Remover evento"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                );
              })}
              
              {events.length === 0 && (
                <div className="col-span-full text-center py-10 bg-white dark:bg-slate-900 rounded-2.5xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-xl">📅</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Nenhum evento registrado ainda. Toque em Registrar Evento acima.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 2: CHECKLISTS & PERSONAL SPIRITUAL GOALS */}
        {subTab === 'commitments' && (
          <motion.div
            key="commitments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            
            {/* Checklist items list card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-5 rounded-3xl space-y-4 shadow-3xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                    📋 Checklist de Serviços da Igreja
                  </h3>
                  <p className="text-[11px] text-slate-400">Compromissos pequenos e tarefas individuais eclesiásticas.</p>
                </div>
                <button
                  onClick={() => setShowCommitmentForm(true)}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 cursor-pointer transition-all"
                >
                  <Plus size={12} /> Adicionar
                </button>
              </div>

              <div className="divider h-px bg-slate-100 dark:bg-slate-850" />

              <div className="space-y-1">
                {commitments.map((cm) => (
                  <div
                    key={cm.id}
                    className="flex items-center justify-between gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-950/40 rounded-2xl group transition-colors"
                  >
                    <div 
                      onClick={() => toggleCommitment(cm.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className={`w-4.5 h-4.5 border rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        cm.completed 
                          ? 'bg-amber-500 border-amber-500 text-white' 
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                      }`}>
                        {cm.completed && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs font-semibold leading-relaxed truncate ${
                        cm.completed 
                          ? 'line-through text-slate-400 dark:text-slate-500 font-medium' 
                          : 'text-slate-750 dark:text-slate-200'
                      }`}>
                        {cm.text}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => deleteCommitment(cm.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all cursor-pointer"
                      title="Apagar compromisso"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {commitments.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-6">Nenhum afazer cadastrado</p>
                )}
              </div>
            </div>

            {/* Spiritual Goals target card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-5 rounded-3xl space-y-4 shadow-3xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                    🎯 Objetivos Espirituais
                  </h3>
                  <p className="text-[11px] text-slate-400">Metas pessoais de oração, jejum e leitura bíblica.</p>
                </div>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 cursor-pointer transition-all"
                >
                  <Plus size={12} /> Nova Meta
                </button>
              </div>

              <div className="divider h-px bg-slate-100 dark:bg-slate-850" />

              <div className="space-y-4.5">
                {goals.map((gl) => {
                  const perc = Math.round((gl.currentCount / gl.targetCount) * 100);
                  const isDone = gl.completed;
                  
                  return (
                    <div key={gl.id} className="p-3 border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/40 rounded-2.5xl space-y-2 relative group">
                      
                      <div className="flex gap-2 justify-between items-start">
                        <div>
                          <p className={`text-xs font-extrabold flex items-center gap-1.5 ${
                            isDone ? 'text-amber-600 line-through' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            ✨ {gl.title}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 leading-none">
                            Cadastrado em {gl.createdAt}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={() => incrementGoalProgress(gl.id)}
                            disabled={isDone}
                            className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-955/20 text-amber-700 border border-amber-300/40 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                          >
                            +1 {gl.unit}
                          </button>
                          <button
                            onClick={() => deleteGoal(gl.id)}
                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-955/10 text-slate-400 hover:text-rose-505 rounded-lg cursor-pointer"
                            title="Apagar objetivo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-extrabold select-none leading-none">
                          <span>{gl.currentCount} / {gl.targetCount} {gl.unit}</span>
                          <span>{perc}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-amber-500' : 'bg-amber-400'}`} style={{ width: `${perc}%` }} />
                        </div>
                      </div>

                    </div>
                  );
                })}
                {goals.length === 0 && (
                  <p className="text-xs text-slate-404 italic text-center py-6">Nenhuma meta declarada</p>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 3: BIBLE STUDY LIBRARY */}
        {subTab === 'studies' && (
          <motion.div
            key="studies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  📖 Biblioteca de Estudos Bíblicos
                </h2>
                <p className="text-xs text-slate-400">Catalogação de lições aprendidas, temas lidos e anotações teológicas.</p>
              </div>
              <button
                onClick={() => setShowStudyForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer transition-transform"
              >
                <Plus size={14} /> Fichamento de Estudo
              </button>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-3.5 rounded-2xl">
              <div className="relative flex-1 w-full flex items-center">
                <Search size={14} className="absolute left-3 text-slate-415" />
                <input
                  type="text"
                  placeholder="Pesquisar estudos teológicos ou versículos..."
                  value={studyFilter}
                  onChange={(e) => setStudyFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-semibold text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter size={13} className="text-slate-400 hidden sm:block" />
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStudyCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer uppercase tracking-wider transition-all border ${
                      studyCategory === cat
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat === 'All' ? 'Ver Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Studies library cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
              {filteredStudies.map((st) => (
                <div key={st.id} className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-5 rounded-3.5xl space-y-4 shadow-3xs relative group/study">
                  
                  {/* Top bar info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] uppercase font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md leading-none">
                        {st.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-950 dark:text-white leading-snug">
                        {st.title}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => deleteStudy(st.id)}
                      className="opacity-0 group-hover/study:opacity-100 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-955/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remover fichamento"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Body textual notes */}
                  <div className="space-y-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-100 dark:border-slate-850 text-[11px] leading-relaxed select-text">
                      <p className="font-extrabold text-amber-700 dark:text-amber-400 mb-0.5">Versículos Chave:</p>
                      <p className="font-bold text-slate-650 dark:text-slate-300 italic">{st.verses || 'Nenhum verso informado'}</p>
                    </div>

                    <div className="space-y-2 select-text font-medium text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-black text-slate-950 dark:text-white select-none">Anotações:</span>
                        <p className="mt-0.5">{st.notes}</p>
                      </div>
                      
                      {st.reflections && (
                        <div>
                          <span className="font-black text-slate-955 dark:text-white select-none">Reflexões Pessoais:</span>
                          <p className="mt-0.5 italic">{st.reflections}</p>
                        </div>
                      )}

                      {st.lessons && (
                        <div>
                          <span className="font-black text-slate-955 dark:text-white select-none">Lições Aprendidas:</span>
                          <p className="mt-0.5 text-amber-700 dark:text-amber-400">{st.lessons}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 flex items-center justify-between text-[9px] font-bold text-slate-400/90 select-none">
                    <span>Espiritualidade Ativa</span>
                    <span>Registrado em {st.date}</span>
                  </div>

                </div>
              ))}
              
              {filteredStudies.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-xl">📚</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Nenhum estudo arquivado encontrado na consulta.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 4: SERMON LOGGER */}
        {subTab === 'sermons' && (
          <motion.div
            key="sermons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  ✍️ Registro de Pregações & Sermões
                </h2>
                <p className="text-xs text-slate-400">Anote os cultos dominicais, conferências e mensagens dos pastores convidados.</p>
              </div>
              <button
                onClick={() => setShowSermonForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer transition-transform"
              >
                <Plus size={14} /> Gravar Esboço
              </button>
            </div>

            {/* Sermons grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sermons.map((sr) => (
                <div key={sr.id} className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4.5 rounded-3xl space-y-4.5 shadow-3xs relative group/sermon flex flex-col justify-between">
                  
                  {/* Top details */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-semibold text-amber-600 block">
                          Tema: {sr.theme || "Vida Cristã"}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <User size={10} /> 
                          <span className="font-extrabold text-slate-500">{sr.preacher}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteSermon(sr.id)}
                        className="opacity-0 group-hover/sermon:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-955/10 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer transition-all"
                        title="Apagar pregação"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <h3 className="text-xs md:text-sm font-black text-slate-905 dark:text-white leading-snug">
                      {sr.title}
                    </h3>
                    
                    {/* Texts block */}
                    <div className="mt-3.5 space-y-2.5 select-text text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-rose-500 bg-rose-50/50 dark:bg-rose-955/15 px-2 py-0.5 rounded text-[10px] inline-block">
                        📖 {sr.verses}
                      </p>
                      
                      <div>
                        <span className="font-black text-slate-950 dark:text-white select-none block">Resumo da Mensagem:</span>
                        <p>{sr.summary}</p>
                      </div>

                      {sr.lessons && (
                        <div>
                          <span className="font-black text-slate-950 dark:text-white select-none block text-[11px]">Lições Principais:</span>
                          <p className="text-slate-500 dark:text-slate-450 italic">{sr.lessons}</p>
                        </div>
                      )}

                      {sr.application && (
                        <div className="p-2.5 bg-amber-50/30 dark:bg-amber-955/5 rounded-xl border border-amber-100/30">
                          <span className="font-black text-amber-700 dark:text-amber-400 select-none block text-[11px]">Aplicação Prática:</span>
                          <p className="text-slate-700 dark:text-slate-300 font-bold mt-0.5">{sr.application}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 text-[9px] text-slate-400 font-bold text-right select-none flex justify-between items-center">
                    <span>Culto gravado</span>
                    <span>{sr.date}</span>
                  </div>

                </div>
              ))}
              {sermons.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-xl">✍️</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Ainda não há esboços de sermões registrados.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 5: PRAYER REQUESTS CHECKLIST */}
        {subTab === 'prayers' && (
          <motion.div
            key="prayers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  🙏 Meus Pedidos de Oração
                </h2>
                <p className="text-xs text-slate-400">Gerencie causas urgentes, saúde de familiares, metas e agradecimentos por bênçãos.</p>
              </div>
              <button
                onClick={() => setShowPrayerForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer transition-transform"
              >
                <Plus size={14} /> Novo Pedido
              </button>
            </div>

            {/* Prayers grid check */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {prayers.map((pr) => {
                const isPraying = pr.status === 'praying';
                const isAnswered = pr.status === 'answered';
                
                return (
                  <div key={pr.id} className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-2.5xl flex flex-col justify-between relative shadow-3xs group/prayer">
                    
                    <div>
                      {/* Status header badge */}
                      <div className="flex items-center justify-between gap-2.5 mb-2.5 select-none">
                        <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-md ${
                          isPraying ? 'bg-amber-500/10 text-amber-650' : isAnswered ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          ● {pr.status === 'praying' ? 'Em Oração' : pr.status === 'answered' ? 'Respondido ✓' : 'Arquivado'}
                        </span>
                        
                        <button
                          onClick={() => deletePrayer(pr.id)}
                          className="opacity-0 group-hover/prayer:opacity-100 p-1 hover:bg-rose-50 dark:hover:bg-rose-955/15 text-slate-400 hover:text-rose-500 rounded-lg transition-opacity cursor-pointer"
                          title="Apagar pedido"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <p className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed select-text">
                        "{pr.request}"
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Pessoa: <span className="font-extrabold text-slate-705 dark:text-slate-300">{pr.person}</span>
                      </p>

                      {pr.notes && (
                        <p className="text-[11px] leading-normal italic text-slate-450 dark:text-slate-400 mt-2 bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded-xl">
                          Observações: {pr.notes}
                        </p>
                      )}
                    </div>

                    {/* Footer toggler */}
                    <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold">Cadastrado em {pr.date}</span>
                      
                      <div className="flex items-center gap-1 select-none">
                        <button
                          onClick={() => setPrayerStatus(pr.id, 'praying')}
                          className={`p-1 px-1.5 rounded text-[9px] font-black cursor-pointer uppercase ${
                            isPraying ? 'bg-amber-500 text-white' : 'hover:bg-slate-100 text-slate-400'
                          }`}
                        >
                          Orar
                        </button>
                        <button
                          onClick={() => setPrayerStatus(pr.id, 'answered')}
                          className={`p-1 px-1.5 rounded text-[9px] font-black cursor-pointer uppercase ${
                            isAnswered ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 text-slate-450'
                          }`}
                        >
                          Bênção ✓
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
              {prayers.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-xl">🙏</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Nenhum clamor oracional ativo no momento.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 6: MINISTRIES SCALE COORDINATION */}
        {subTab === 'ministries' && (
          <motion.div
            key="ministries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  ❤️ Minha Participação em Ministérios
                </h2>
                <p className="text-xs text-slate-400">Coordenador interno para lideranças, recepção, louvor, mídia de transmissão ou infantil.</p>
              </div>
              <button
                onClick={() => setShowMinistryForm(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 cursor-pointer transition-transform"
              >
                <Plus size={14} /> Registrar Escala
              </button>
            </div>

            {/* Ministry lists blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
              {ministries.map((mn) => (
                <div key={mn.id} className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-5 rounded-3.5xl space-y-4 shadow-3xs relative group/ministry">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-black tracking-widest bg-amber-50 dark:bg-amber-950 text-amber-650 px-2.5 py-0.5 rounded-lg leading-none">
                        Departamental: {mn.name}
                      </span>
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">
                        Função: {mn.role}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => deleteMinistry(mn.id)}
                      className="opacity-0 group-hover/ministry:opacity-100 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-955/15 text-slate-400 hover:text-rose-500 rounded-lg transition-all cursor-pointer shrink-0"
                      title="Deletar este envolvimento"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="divider h-px bg-slate-100 dark:bg-slate-850" />

                  <div className="space-y-3.5 select-text text-slate-600 dark:text-slate-350 text-xs">
                    <div className="flex gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white select-none shrink-0 w-28">Próxima Escala:</span>
                      <span className="text-rose-550 font-bold">{mn.scale || 'Nenhuma escala anunciada'}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-black text-slate-950 dark:text-white select-none">Responsabilidades Fixas:</span>
                      <p className="leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl">{mn.responsibilities}</p>
                    </div>

                    {mn.nextActivities && (
                      <div className="space-y-1">
                        <span className="font-black text-amber-700 dark:text-amber-400 select-none">Próximas Atividades Urgentes:</span>
                        <p className="leading-relaxed border border-amber-200/20 dark:border-slate-800 p-2.5 rounded-xl font-semibold bg-amber-50/10">{mn.nextActivities}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 text-[10px] text-slate-400 font-bold">
                    <span>Central de Ministério Ativo</span>
                  </div>

                </div>
              ))}
              {ministries.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-xl">❤️</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Nenhum ministério cadastrado para acompanhamento de escalas.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FORM DIALOG POPUPS */}
      
      {/* 1. Event Registration Modal */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowEventForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white mb-4">
              📅 Registrar Compromisso da Igreja
            </h3>
            
            <form onSubmit={addEvent} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium select-text">
              <div className="space-y-1">
                <label className="font-bold select-none block">Título do Compromisso:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Culto de Jovens, Santa Ceia"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500 rounded-xl px-3.5 py-2.5 font-semibold text-slate-850 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Data:</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3.5 py-2 font-semibold text-slate-850 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Horário:</label>
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3.5 py-2 font-semibold text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Local:</label>
                  <input
                    type="text"
                    placeholder="Ex: Templo Principal"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Ministério Responsável:</label>
                  <input
                    type="text"
                    placeholder="Ex: Louvor / Família"
                    value={newEvent.ministry}
                    onChange={(e) => setNewEvent({ ...newEvent, ministry: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Prioridade:</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white cursor-pointer"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Status Inicial:</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white cursor-pointer"
                  >
                    <option value="planning">Planejado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Breve descrição:</label>
                <textarea
                  placeholder="Informações extras ou propósitos específicos"
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl transition-all select-none cursor-pointer text-xs"
              >
                Gravar Compromisso
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Commitment Checklist Registration Modal */}
      {showCommitmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowCommitmentForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white mb-4">
              ✅ Adicionar Item ao Checklist da Igreja
            </h3>
            
            <form onSubmit={addCommitment} className="space-y-3.5 select-text text-slate-700 dark:text-slate-300 font-medium">
              <div className="space-y-1">
                <label className="font-bold select-none block text-xs">O que precisa ser feito?</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Preparar slides da pregação"
                  value={newCm.text}
                  onChange={(e) => setNewCm({ text: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-505 rounded-xl px-3.5 py-2.5 font-semibold text-slate-850 dark:text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Adicionar ao Checklist
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Goal Registration Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowGoalForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white mb-4">
              🎯 Estabelecer Objetivo Espiritual
            </h3>
            
            <form onSubmit={addGoal} className="space-y-3.5 select-text text-slate-700 dark:text-slate-300 font-medium">
              <div className="space-y-1">
                <label className="font-bold select-none block text-xs">Título do Objetivo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ler a Bíblia diariamente"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-550 rounded-xl px-3.5 py-2 font-semibold text-slate-850 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block text-xs">Meta total:</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newEvent.title === '' ? 30 : newGoal.targetCount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block text-xs">Unidade:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: dias, cultos, vezes"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none rounded-xl px-3 py-2 font-semibold text-slate-850 dark:text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Cadastrar Objetivo
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 4. Bible Study Logger Modal */}
      {showStudyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-lg w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowStudyForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-sm font-black text-slate-950 dark:text-white mb-3 flex items-center gap-1.5">
              📖 Fichar Estudo Bíblico ou Teológico
            </h3>
            
            <form onSubmit={addStudy} className="space-y-3 px-1 select-text text-xs text-slate-700 dark:text-slate-305 font-medium overflow-y-auto max-h-[75vh] scrollbar-thin">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Tema estudado:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Escatologia Bíblica"
                    value={newStudy.title}
                    onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Categoria:</label>
                  <input
                    type="text"
                    placeholder="Ex: Escatologia, Hermenêutica"
                    value={newStudy.category}
                    onChange={(e) => setNewStudy({ ...newStudy, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Data do estudo:</label>
                  <input
                    type="date"
                    required
                    value={newStudy.date}
                    onChange={(e) => setNewStudy({ ...newStudy, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Versículos anotados:</label>
                  <input
                    type="text"
                    placeholder="Ex: Daniel 9:24-27, Mateus 24"
                    value={newStudy.verses}
                    onChange={(e) => setNewStudy({ ...newStudy, verses: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold text-slate-805 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Anotações principais:</label>
                <textarea
                  required
                  placeholder="Escreva pontos cruciais do estudo, definições em Grego/Hebraico ou ideias gerais"
                  rows={2}
                  value={newStudy.notes}
                  onChange={(e) => setNewStudy({ ...newStudy, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Reflexões pessoais (Como se aplica à minha comunhão?):</label>
                <textarea
                  placeholder="Suas conclusões morais e edificantes"
                  rows={2}
                  value={newStudy.reflections}
                  onChange={(e) => setNewStudy({ ...newStudy, reflections: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Lições práticas aprendidas:</label>
                <textarea
                  placeholder="Escreva em poucas palavras uma lição real para levar para a vida cristã cotidiana"
                  rows={2}
                  value={newStudy.lessons}
                  onChange={(e) => setNewStudy({ ...newStudy, lessons: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Arquivar na Biblioteca
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Sermon Logger Modal */}
      {showSermonForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-lg w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowSermonForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-sm font-black text-slate-955 dark:text-white mb-3">
              ✍️ Gravar Registros de Sermão / Pregação
            </h3>
            
            <form onSubmit={addSermon} className="space-y-3 px-1 select-text text-xs text-slate-705 dark:text-slate-300 font-medium overflow-y-auto max-h-[75vh] scrollbar-thin">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Título da Pregação:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: A Rocha Firme"
                    value={newSermon.title}
                    onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Pregante / Pastor:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pastor Roberto"
                    value={newSermon.preacher}
                    onChange={(e) => setNewSermon({ ...newSermon, preacher: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Tema Geral:</label>
                  <input
                    type="text"
                    placeholder="Ex: Fé, Família, Obediência"
                    value={newSermon.theme}
                    onChange={(e) => setNewSermon({ ...newSermon, theme: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Data:</label>
                  <input
                    type="date"
                    required
                    value={newSermon.date}
                    onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-820 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Versículos Principais de Referência:</label>
                <input
                  type="text"
                  placeholder="Ex: Lucas 6:46-49, Romanos 12"
                  value={newSermon.verses}
                  onChange={(e) => setNewSermon({ ...newSermon, verses: e.target.value })}
                  className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 font-semibold text-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Resumo dos pontos tratados:</label>
                <textarea
                  required
                  placeholder="Anote o andamento da mensagem..."
                  rows={2}
                  value={newSermon.summary}
                  onChange={(e) => setNewSermon({ ...newSermon, summary: e.target.value })}
                  className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Lições Aprendidas:</label>
                  <textarea
                    placeholder="Ensinamento moral ou teológico específico"
                    rows={2}
                    value={newSermon.lessons}
                    onChange={(e) => setNewSermon({ ...newSermon, lessons: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-xs resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Aplicação Prática em Minha Vida:</label>
                  <textarea
                    placeholder="Quais mudanças reais eu devo fazer?"
                    rows={2}
                    value={newSermon.application}
                    onChange={(e) => setNewSermon({ ...newSermon, application: e.target.value })}
                    className="w-full bg-slate-20/55 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-xs resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Registrar Esboço
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 6. Prayer Request Modal */}
      {showPrayerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowPrayerForm(false)} className="absolute right-4 top-4 text-slate-450 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white mb-4">
              🙏 Cadastrar Pedido de Clamor
            </h3>
            
            <form onSubmit={addPrayer} className="space-y-3.5 select-text text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="space-y-1">
                <label className="font-bold select-none block text-xs">Pedido de Oração:</label>
                <textarea
                  required
                  placeholder="Ex: Clamar pela cirurgia do tio, conversão de colegas"
                  rows={2}
                  value={newPrayer.request}
                  onChange={(e) => setNewPrayer({ ...newPrayer, request: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block text-xs">Para quem? (Pessoa ou causa):</label>
                <input
                  type="text"
                  placeholder="Ex: Tio João"
                  value={newPrayer.person}
                  onChange={(e) => setNewPrayer({ ...newPrayer, person: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block text-xs">Observações / Detalhes:</label>
                <input
                  type="text"
                  placeholder="Ex: Cirurgia marcada para dia 25"
                  value={newPrayer.notes}
                  onChange={(e) => setNewPrayer({ ...newPrayer, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Clamar em Comunidade
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 7. Ministry Addition modal */}
      {showMinistryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl relative select-none"
          >
            <button onClick={() => setShowMinistryForm(false)} className="absolute right-4 top-4 text-slate-450 cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-sm font-black text-slate-950 dark:text-white mb-4">
              ❤️ Acompanhar Envolvimento em Ministério
            </h3>
            
            <form onSubmit={addMinistry} className="space-y-3.5 select-text text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold select-none block">Nome do Departamento:</label>
                  <select
                    value={newMinistry.name}
                    onChange={(e) => setNewMinistry({ ...newMinistry, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="Louvor">Louvor / Adoração</option>
                    <option value="Mídia">Mídia / Som / Vídeo</option>
                    <option value="Recepção">Recepção / Boas-Vindas</option>
                    <option value="Infantil">Infantil / Escola Bíblica</option>
                    <option value="Evangelismo">Evangelismo / Missões</option>
                    <option value="Sonoplastia">Sonoplastia / Luz</option>
                    <option value="Outro">Outro Departamento</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold select-none block">Sua Função / Cargo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Guitarrista Principal"
                    value={newMinistry.role}
                    onChange={(e) => setNewMinistry({ ...newMinistry, role: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Sua Próxima Escala (Data/Horário):</label>
                <input
                  type="text"
                  placeholder="Ex: Escala Domingo noite dia 21/06"
                  value={newMinistry.scale}
                  onChange={(e) => setNewMinistry({ ...newMinistry, scale: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Responsabilidades gerais no setor:</label>
                <textarea
                  placeholder="Ex: Ensaiar aos sábados, arrumar cabos de violão antes do culto."
                  rows={2}
                  value={newMinistry.responsibilities}
                  onChange={(e) => setNewMinistry({ ...newMinistry, responsibilities: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold select-none block">Próximas Atividades / Pendências urgentes:</label>
                <textarea
                  placeholder="Ex: Decorar a cifra de melodia da música nova"
                  rows={2}
                  value={newMinistry.nextActivities}
                  onChange={(e) => setNewMinistry({ ...newMinistry, nextActivities: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-3 py-2 font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Cadastrar Atividade
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
