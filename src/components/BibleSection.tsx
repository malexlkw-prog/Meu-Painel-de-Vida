import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, BookMarked, Star, FileText, BarChart3, 
  Church, Heart, Users, Calendar, Sparkles, ChevronLeft, 
  ChevronRight, Trash2, CheckCircle2, Timer, Check, Zap, 
  Share2, Plus, ArrowLeft, X, Settings, AlertTriangle, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { BibleState, ChurchState, ChurchEvent, ChurchPrayerRequest, ChurchMinistry, ChurchIdea } from '../types';
import { BIBLE_BOOKS } from '../data/initialData';

interface BibleSectionProps {
  bibleState: BibleState;
  onSetCurrentBook: (bookName: string) => void;
  onSetReadingPlan: (plan: 'sequential' | 'chronological') => void;
  onUpdateBookProgress: (bookName: string, chaptersRead: number) => void;
  onAddReflection: (passage: string, reflection: string) => void;
  onDeleteReflection: (id: string) => void;
  onAddReadingLog: (book: string, chapters: string) => void;
  churchData?: ChurchState;
  onUpdateChurch?: (updated: ChurchState) => void;
  onChooseTab?: (tabId: string) => void;
}

export default function BibleSection({
  bibleState,
  onSetCurrentBook,
  onSetReadingPlan,
  onUpdateBookProgress,
  onAddReflection,
  onDeleteReflection,
  onAddReadingLog,
  churchData,
  onUpdateChurch,
  onChooseTab
}: BibleSectionProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'bible' | 'plans' | 'saved' | 'notes' | 'stats' | 'church' | 'prayers' | 'ministries' | 'agenda' | 'settings'>('home');
  const [currentBook, setCurrentBook] = useState(bibleState?.currentBook || 'João');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [translation, setTranslation] = useState<string>('NVI');
  const [expandedBook, setExpandedBook] = useState<string | null>('João');
  const [showBooksSidebarMobile, setShowBooksSidebarMobile] = useState(false);
  const [showReaderSettings, setShowReaderSettings] = useState(false);

  // Settings
  const [readerBg, setReaderBg] = useState<'light' | 'sepia' | 'dark'>(() => (localStorage.getItem('bible_reader_bg') as any) || 'dark');
  const [fontStyle, setFontStyle] = useState<'sans' | 'serif' | 'mono'>(() => (localStorage.getItem('bible_font_style') as any) || 'serif');
  const [fontSize, setFontSize] = useState<number>(() => parseInt(localStorage.getItem('bible_font_size') || '18'));
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>(() => (localStorage.getItem('bible_line_height') as any) || 'relaxed');

  // Highlights & Favorites
  const [highlights, setHighlights] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('bible_highlights') || '{}'));
  const [savedFavorites, setSavedFavorites] = useState<{ id: string; book: string; chapter: number; verse: number; text: string; collection: string; date: string }[]>(() => 
    JSON.parse(localStorage.getItem('bible_favorites_list') || '[]')
  );
  const [collections, setCollections] = useState<string[]>(() => JSON.parse(localStorage.getItem('bible_collections') || '["Promessas", "Sabedoria", "Oração", "Esperança", "Salvação", "Força"]'));
  const [newCollectionName, setNewCollectionName] = useState('');

  // Verses
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [verseNoteText, setVerseNoteText] = useState('');

  // Streak
  const [consecutiveDays, setConsecutiveDays] = useState(() => parseInt(localStorage.getItem('bible_consecutive_days') || '5'));

  // Collapsible settings categories
  const [colSettings, setColSettings] = useState<Record<string, boolean>>({ bg: true, font: false, size: false });

  // Manual reading registration states
  const [manualBook, setManualBook] = useState('Gênesis');
  const [manualChapter, setManualChapter] = useState(1);

  // Preaching Controlled States (for Minhas Pregações)
  const [preachingPassage, setPreachingPassage] = useState('');
  const [preachingTitle, setPreachingTitle] = useState('');
  const [preachingContent, setPreachingContent] = useState('');
  const [showAddPreachingForm, setShowAddPreachingForm] = useState(false);

  // Projects (formerly Church Sede) State Variables
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('Projeto');
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Project Editing Details States
  const [editingNotes, setEditingNotes] = useState(false);
  const [projectNotesText, setProjectNotesText] = useState('');
  const [editingDate, setEditingDate] = useState(false);
  const [projectDateText, setProjectDateText] = useState('');
  const [editingImage, setEditingImage] = useState(false);
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Escalas State Variables
  const [scaleRole, setScaleRole] = useState('');
  const [scaleLocal, setScaleLocal] = useState('');
  const [scaleData, setScaleData] = useState('');
  const [showAddScaleForm, setShowAddScaleForm] = useState(false);

  // Agenda State Variables
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaLoc, setAgendaLoc] = useState('');
  const [agendaDate, setAgendaDate] = useState('');
  const [agendaTime, setAgendaTime] = useState('');
  const [showAddAgendaForm, setShowAddAgendaForm] = useState(false);

  // Fetch Verses
  const fetchVerses = async () => {
    setLoadingVerses(true);
    setHasError(false);
    try {
      const res = await fetch(`/api/bible?book=${encodeURIComponent(currentBook)}&chapter=${currentChapter}&translation=${translation}`);
      if (!res.ok) throw new Error();
      const val = await res.json();
      if (val?.verses?.length) setVerses(val.verses);
      else throw new Error();
    } catch {
      setHasError(true);
    } finally {
      setLoadingVerses(false);
    }
  };

  useEffect(() => {
    fetchVerses();
    setSelectedVerseNumber(null);
  }, [currentBook, currentChapter, translation]);

  useEffect(() => {
    localStorage.setItem('bible_reader_bg', readerBg);
    localStorage.setItem('bible_font_style', fontStyle);
    localStorage.setItem('bible_font_size', fontSize.toString());
    localStorage.setItem('bible_line_height', lineHeight);
  }, [readerBg, fontStyle, fontSize, lineHeight]);

  // Actions
  const handleToggleHighlight = (color: string) => {
    if (selectedVerseNumber === null) return;
    const key = `${currentBook}_${currentChapter}_${selectedVerseNumber}`;
    const next = { ...highlights };
    if (!color) delete next[key];
    else next[key] = color;
    setHighlights(next);
    localStorage.setItem('bible_highlights', JSON.stringify(next));
  };

  const handleAddFavorite = (colName: string) => {
    if (selectedVerseNumber === null) return;
    const txt = verses.find(v => v.number === selectedVerseNumber)?.text || '';
    const newFav = {
      id: Math.random().toString(),
      book: currentBook,
      chapter: currentChapter,
      verse: selectedVerseNumber,
      text: txt,
      collection: colName,
      date: new Date().toISOString()
    };
    if (!savedFavorites.some(f => f.book === currentBook && f.chapter === currentChapter && f.verse === selectedVerseNumber)) {
      const updated = [newFav, ...savedFavorites];
      setSavedFavorites(updated);
      localStorage.setItem('bible_favorites_list', JSON.stringify(updated));
      alert(`Salvo na coleção ${colName}! ⭐`);
    }
  };

  const handleCopyVerse = () => {
    if (selectedVerseNumber === null) return;
    const txt = verses.find(v => v.number === selectedVerseNumber)?.text || '';
    const citation = `"${txt}" - ${currentBook} ${currentChapter}:${selectedVerseNumber} (${translation})`;
    navigator.clipboard.writeText(citation);
    alert('Copiado para a área de transferência! ✨');
  };

  const handleSaveNote = () => {
    if (selectedVerseNumber === null || !verseNoteText.trim()) return;
    onAddReflection(`${currentBook} ${currentChapter}:${selectedVerseNumber}`, verseNoteText);
    setVerseNoteText('');
    alert('Aotação devocional salva! 📝');
  };

  const handleDeleteFavorite = (id: string) => {
    const updated = savedFavorites.filter(f => f.id !== id);
    setSavedFavorites(updated);
    localStorage.setItem('bible_favorites_list', JSON.stringify(updated));
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim() && !collections.includes(newCollectionName.trim())) {
      const updated = [...collections, newCollectionName.trim()];
      setCollections(updated);
      localStorage.setItem('bible_collections', JSON.stringify(updated));
      setNewCollectionName('');
    }
  };

  const handleMarkChapterCompleted = () => {
    onUpdateBookProgress(currentBook, currentChapter);
    onAddReadingLog(currentBook, `Capítulo ${currentChapter}`);
    const nextStreak = consecutiveDays + 1;
    setConsecutiveDays(nextStreak);
    localStorage.setItem('bible_consecutive_days', nextStreak.toString());
    
    const count = parseInt(localStorage.getItem('bible_completed_chapters_count') || '14') + 1;
    localStorage.setItem('bible_completed_chapters_count', count.toString());
    
    alert(`Capítulo ${currentChapter} de ${currentBook} concluído! 🔥`);
    handleNextChapter();
  };

  // Manual Progress Registration Handler
  const handleRegisterManualProgress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBookProgress(manualBook, manualChapter);
    onAddReadingLog(manualBook, `Capítulo ${manualChapter}`);
    
    // Updates local states
    const count = parseInt(localStorage.getItem('bible_completed_chapters_count') || '14') + 1;
    localStorage.setItem('bible_completed_chapters_count', count.toString());
    
    alert(`Progresso físico registrado! ${manualBook} ${manualChapter} foi marcado como lido. 📖`);
  };

  const handleSavePreaching = () => {
    if (!preachingTitle.trim() || !preachingContent.trim()) {
      alert('Por favor, preencha o título e o conteúdo da pregação.');
      return;
    }
    const passage = preachingPassage.trim() || 'Esboço Geral';
    onAddReflection(`${passage} - ${preachingTitle.trim()}`, preachingContent);
    setPreachingPassage('');
    setPreachingTitle('');
    setPreachingContent('');
    setShowAddPreachingForm(false);
    alert('Pregação salva com sucesso! 📝');
  };

  const handlePrevChapter = () => currentChapter > 1 && setCurrentChapter(currentChapter - 1);
  const handleNextChapter = () => {
    const active = BIBLE_BOOKS.find(b => b.name === currentBook);
    if (active && currentChapter < active.chapters) setCurrentChapter(currentChapter + 1);
  };

  // Dynamic calculations
  const totalChaptersRead = BIBLE_BOOKS.reduce((sum, b) => {
    const lastRead = bibleState?.bookProgress?.[b.name] || 0;
    return sum + lastRead;
  }, 0);
  const calculatedProgressPercent = Math.min(100, Math.round((totalChaptersRead / 1189) * 100));

  // Mutators for Church
  const mutateChurchState = (updater: (prev: ChurchState) => ChurchState) => {
    if (churchData && onUpdateChurch) {
      onUpdateChurch(updater(churchData));
    }
  };

  // Projects (formerly Church Ideas) handlers
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    const newProject: ChurchIdea = {
      id: Math.random().toString(),
      title: projectTitle,
      description: projectDesc,
      category: projectCategory,
      votes: 1,
      status: 'idea',
      createdAt: new Date().toISOString(),
      notes: '',
      date: '',
      imageUrl: '',
      tasks: []
    };
    mutateChurchState(prev => ({
      ...prev,
      ideas: [newProject, ...(prev.ideas || [])]
    }));
    setProjectTitle('');
    setProjectDesc('');
    setShowAddProjectForm(false);
    alert('Projeto criado com sucesso!');
  };

  const handleDeleteProject = (id: string) => {
    mutateChurchState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).filter(i => i.id !== id)
    }));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const handleUpdateProjectField = (projectId: string, updatedFields: Partial<ChurchIdea>) => {
    mutateChurchState(prev => ({
      ...prev,
      ideas: (prev.ideas || []).map(i => i.id === projectId ? { ...i, ...updatedFields } : i)
    }));
  };

  // Escalas handlers (Simplified - role, local, data)
  const handleAddScaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scaleRole.trim()) return;
    const newMin: ChurchMinistry = {
      id: Math.random().toString(),
      name: 'Escala',
      role: scaleRole,
      scale: scaleData || 'Geral',
      responsibilities: scaleLocal || 'Geral',
      nextActivities: ''
    };
    mutateChurchState(prev => ({
      ...prev,
      ministries: [newMin, ...(prev.ministries || [])]
    }));
    setScaleRole('');
    setScaleLocal('');
    setScaleData('');
    setShowAddScaleForm(false);
    alert('Escala ministerial salva!');
  };

  const handleDeleteMinistry = (id: string) => {
    mutateChurchState(prev => ({
      ...prev,
      ministries: (prev.ministries || []).filter(m => m.id !== id)
    }));
  };

  // Events / Agenda handlers (Simplified - type of event, where, date, time)
  const handleAddAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle.trim() || !agendaDate) return;
    const newEvt: ChurchEvent = {
      id: Math.random().toString(),
      title: agendaTitle,
      ministry: 'Geral',
      date: agendaDate,
      time: agendaTime || '19:30',
      location: agendaLoc || 'Templo Principal',
      description: '',
      priority: 'medium',
      status: 'confirmed'
    };
    mutateChurchState(prev => ({
      ...prev,
      events: [newEvt, ...(prev.events || [])]
    }));
    setAgendaTitle('');
    setAgendaLoc('');
    setAgendaDate('');
    setAgendaTime('');
    setShowAddAgendaForm(false);
    alert('Compromisso agendado com sucesso!');
  };

  const handleDeleteEvent = (id: string) => {
    mutateChurchState(prev => ({
      ...prev,
      events: (prev.events || []).filter(e => e.id !== id)
    }));
  };

  // Render book drawer accordion
  const renderBookItem = (b: { name: string; chapters: number }) => {
    const isExpanded = expandedBook === b.name;
    const isCurrent = currentBook === b.name;
    return (
      <div key={b.name} className="border-b border-slate-100 dark:border-slate-800/40 last:border-0 py-0.5 text-left">
        <button
          onClick={() => setExpandedBook(isExpanded ? null : b.name)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            isCurrent ? 'text-amber-600 dark:text-amber-400 font-black bg-amber-500/10' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
        >
          <span>{b.name}</span>
          <span className="text-[10px] opacity-60 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">{b.chapters} Cap</span>
        </button>
        {isExpanded && (
          <div className="p-2 pt-1.5 grid grid-cols-5 gap-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl mt-1 max-h-[160px] overflow-y-auto">
            {Array.from({ length: b.chapters }, (_, i) => {
              const num = i + 1;
              const isSel = isCurrent && currentChapter === num;
              return (
                <button
                  key={num}
                  onClick={() => { setCurrentBook(b.name); setCurrentChapter(num); }}
                  className={`h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${
                    isSel ? 'bg-amber-600 text-white shadow-xs font-black' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Aesthetic choices
  const bgClasses = {
    light: 'bg-stone-50 text-stone-900 border-stone-200',
    sepia: 'bg-amber-50/70 text-amber-950 border-amber-200/50',
    dark: 'bg-neutral-900 text-stone-100 border-neutral-800'
  };
  const fontStyleClasses = { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' };
  const lhClasses = { normal: 'leading-normal', relaxed: 'leading-relaxed', loose: 'leading-loose' };

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-slate-50 dark:bg-slate-950 relative">
      
      {/* SIDEBAR NAVIGATION */}
      {activeSubTab !== 'home' && (
        <aside className="hidden lg:flex h-full w-72 bg-slate-100/95 dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-850 shrink-0 flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/80 space-y-3 shrink-0 text-left">
            <button
              onClick={() => onChooseTab?.('dashboard')}
              className="w-full h-10 bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-extrabold tracking-wide uppercase shadow-3xs border dark:border-slate-700"
            >
              <ArrowLeft size={13} className="text-amber-500 shrink-0" />
              <span>Dashboard</span>
            </button>
            <div className="flex items-center gap-2 pl-1 select-none">
              <div>
                <h2 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-widest leading-none">Igreja</h2>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 scrollbar-thin text-left">
            <button onClick={() => setActiveSubTab('bible')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'bible' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <BookOpen size={14} /> <span>Bíblia</span>
            </button>
            <button onClick={() => setActiveSubTab('plans')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'plans' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <BookMarked size={14} /> <span>Plano de Leitura</span>
            </button>
            <button onClick={() => setActiveSubTab('notes')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'notes' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <FileText size={14} /> <span>Minhas Pregações</span>
            </button>
            <button onClick={() => setActiveSubTab('stats')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'stats' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <BarChart3 size={14} /> <span>Estatísticas</span>
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2.5 mx-2 opacity-50" />
            <button onClick={() => setActiveSubTab('church')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'church' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <Church size={14} /> <span>Projetos</span>
            </button>
            <button onClick={() => setActiveSubTab('ministries')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'ministries' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <Users size={14} /> <span>Escalas</span>
            </button>
            <button onClick={() => setActiveSubTab('agenda')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'agenda' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <Calendar size={14} /> <span>Agenda</span>
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2.5 mx-2 opacity-50" />
            <button onClick={() => setActiveSubTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'settings' ? 'bg-slate-300 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-200/55 dark:hover:bg-slate-800/40'}`}>
              <Settings size={14} /> <span>Configurações</span>
            </button>
          </div>
        </aside>
      )}

      {/* CORE DISPLAY STAGE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative min-w-0">
        
        {/* Core sub-navigation already handled beautifully in the wrapped subtab header */}

        {/* INNER ROUTER DISPATCHER */}
        {activeSubTab === 'home' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-955/20 text-center flex flex-col items-center">
            <div className="relative flex items-center justify-center border-b pb-5 dark:border-slate-800/60 w-full max-w-4xl min-h-[50px]">
              <button 
                onClick={() => onChooseTab?.('dashboard')}
                className="absolute left-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl text-[10px] font-black tracking-wide uppercase transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700 shadow-3xs cursor-pointer"
              >
                <span className="text-amber-500">&larr;</span> <span>Voltar ao início</span>
              </button>
              <h1 className="text-2xl font-black text-amber-600 dark:text-amber-400 font-display text-center">Igreja</h1>
            </div>

            {/* Launchers Grid (7 items - streamlined & elegant, no square/verbose styling) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
              
              {/* Leitor */}
              <button onClick={() => setActiveSubTab('bible')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-amber-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><BookOpen size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">{currentBook} {currentChapter}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">Bíblia</h3>
              </button>

              {/* Planos */}
              <button onClick={() => setActiveSubTab('plans')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-amber-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><BookMarked size={20} /></div>
                  <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg font-mono text-indigo-600 dark:text-indigo-400">{calculatedProgressPercent}% Lido</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">Plano de Leitura</h3>
              </button>

              {/* Devocional -> Minhas Pregações */}
              <button onClick={() => setActiveSubTab('notes')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-amber-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-teal-500/10 text-teal-600 rounded-xl"><FileText size={20} /></div>
                  <span className="text-[10px] font-black bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-lg font-mono text-teal-600 dark:text-teal-400">{bibleState?.reflections?.length || 0} Ativas</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">Minhas Pregações</h3>
              </button>

              {/* Estatísticas */}
              <button onClick={() => setActiveSubTab('stats')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-amber-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><BarChart3 size={20} /></div>
                  <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-955 px-2.5 py-1 rounded-lg font-mono text-blue-650 dark:text-blue-400">{totalChaptersRead} Capítulos</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">Estatísticas</h3>
              </button>

              {/* Projetos */}
              <button onClick={() => setActiveSubTab('church')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-rose-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><Church size={20} /></div>
                  <span className="text-[10px] font-black bg-rose-50 dark:bg-rose-955 px-2.5 py-1 rounded-lg font-mono text-rose-600 dark:text-rose-400">{(churchData?.ideas || []).length} Projetos</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors">Projetos</h3>
              </button>

              {/* Escalas */}
              <button onClick={() => setActiveSubTab('ministries')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-rose-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl"><Users size={20} /></div>
                  <span className="text-[10px] font-black bg-violet-50 dark:bg-violet-955 px-2.5 py-1 rounded-lg font-mono text-violet-650 dark:text-violet-400">{(churchData?.ministries || []).length} Escalas</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors">Escalas</h3>
              </button>

              {/* Agenda */}
              <button onClick={() => setActiveSubTab('agenda')} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-rose-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer mx-auto sm:mx-0 sm:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-fuchsia-500/10 text-fuchsia-500 rounded-xl"><Calendar size={20} /></div>
                  <span className="text-[10px] font-black bg-fuchsia-50 dark:bg-fuchsia-955 px-2.5 py-1 rounded-lg font-mono text-fuchsia-650 dark:text-fuchsia-400">{(churchData?.events || []).length} Eventos</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors">Agenda</h3>
              </button>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
            
            {/* WRAPPED MAIN CONTAINER FOR EACH SUBTAB */}
            <div className="h-14 border-b border-slate-150 dark:border-slate-850 px-4 md:px-6 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/10">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveSubTab('home')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-1 border dark:border-slate-700">
                  <ArrowLeft size={11} className="text-amber-500 font-black" />
                  <span>Voltar</span>
                </button>
                <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider font-display">
                  {activeSubTab === 'bible' && `📖 Leitor Bíblico: ${currentBook} ${currentChapter}`}
                  {activeSubTab === 'plans' && '📚 Plano de Leitura'}
                  {activeSubTab === 'saved' && '🧠 Memorização & Salvos'}
                  {activeSubTab === 'notes' && '🙏 Diário Devocional'}
                  {activeSubTab === 'stats' && '📊 Estatísticas'}
                  {activeSubTab === 'church' && '⛪ Igreja Central'}
                  {activeSubTab === 'prayers' && '🤲 Clamor & Intercessão'}
                  {activeSubTab === 'ministries' && '🎤 Escalas'}
                  {activeSubTab === 'agenda' && '📅 Agenda Litúrgica'}
                  {activeSubTab === 'settings' && '⚙️ Configurações'}
                </span>
              </div>

              {activeSubTab === 'bible' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowReaderSettings(!showReaderSettings)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors" title="Opções de Leitura">
                    <Settings size={16} />
                  </button>
                  <button onClick={handlePrevChapter} disabled={currentChapter === 1} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-30">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={handleNextChapter} disabled={currentChapter === BIBLE_BOOKS.find(b => b.name === currentBook)?.chapters} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 disabled:opacity-30">
                    <ChevronRight size={16} />
                  </button>
                  <button onClick={handleMarkChapterCompleted} className="bg-emerald-600 hover:bg-emerald-550 text-white font-extrabold text-[10px] uppercase px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-3xs font-sans">
                    <CheckCircle2 size={12} /> <span className="hidden sm:inline">Concluir</span>
                  </button>
                </div>
              )}
            </div>

            {/* MAIN CONTENT BODY ROUTER */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 text-left">
              
              {/* BIBLE LEITOR */}
              {activeSubTab === 'bible' && (
                <div className="flex flex-col md:flex-row h-full overflow-hidden relative -m-4 md:-m-6">
                  
                  {/* Left books drawer for desktop */}
                  <div className="hidden md:flex w-72 border-r border-slate-150 dark:border-slate-850 flex-col h-full overflow-hidden bg-slate-50/40 dark:bg-slate-900/5 select-none shrink-0">
                    <div className="p-3 bg-slate-100/30 dark:bg-slate-900/20 border-b dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Bíblia Sagrada</span>
                      <select value={translation} onChange={(e) => setTranslation(e.target.value)} className="bg-white dark:bg-slate-800 text-xs font-bold border dark:border-slate-700 px-2 py-1 rounded">
                        <option value="NVI">NVI</option>
                        <option value="Almeida">Almeida</option>
                      </select>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
                      <div>
                        <span className="px-2 text-[9px] font-black uppercase tracking-wider text-amber-500 font-mono block mb-1">Antigo Testamento 📜</span>
                        <div className="space-y-0.5">{BIBLE_BOOKS.slice(0, 39).map(renderBookItem)}</div>
                      </div>
                      <div>
                        <span className="px-2 text-[9px] font-black uppercase tracking-wider text-indigo-505 font-mono block mb-1">Novo Testamento 🕊️</span>
                        <div className="space-y-0.5">{BIBLE_BOOKS.slice(39).map(renderBookItem)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right reader stage */}
                  <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
                    
                    {/* Collapsible Reader Quick Settings (Kindle-style) */}
                    <AnimatePresence>
                      {showReaderSettings && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shrink-0"
                        >
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono block">Fundo Conforto</span>
                              <div className="flex gap-1.5">
                                {(['light', 'sepia', 'dark'] as const).map(bg => (
                                  <button key={bg} onClick={() => setReaderBg(bg)} className={`px-2.5 py-1.5 rounded-lg border font-bold capitalize cursor-pointer ${readerBg === bg ? 'bg-amber-600 text-white border-amber-500' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-stone-200'}`}>{bg}</button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono block">Tipografia</span>
                              <div className="flex gap-1.5">
                                {(['sans', 'serif', 'mono'] as const).map(font => (
                                  <button key={font} onClick={() => setFontStyle(font)} className={`px-2.5 py-1.5 rounded-lg border font-bold capitalize cursor-pointer ${fontStyle === font ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{font}</button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono block">Tamanho da Letra: {fontSize}px</span>
                              <div className="flex gap-1">
                                <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded font-black">-</button>
                                <button onClick={() => setFontSize(Math.min(30, fontSize + 2))} className="px-2 py-1 bg-white dark:bg-slate-800 border rounded font-black">+</button>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono block">Entrelinhamento</span>
                              <div className="flex gap-1.5">
                                {(['normal', 'relaxed', 'loose'] as const).map(lh => (
                                  <button key={lh} onClick={() => setLineHeight(lh)} className={`px-2.5 py-1.5 rounded-lg border font-bold capitalize cursor-pointer ${lineHeight === lh ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{lh}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scripture Viewer */}
                    <div className={`flex-1 overflow-y-auto p-5 md:p-8 select-text ${bgClasses[readerBg]} ${fontStyleClasses[fontStyle]} ${lhClasses[lineHeight]}`} style={{ fontSize: `${fontSize}px` }}>
                      {loadingVerses ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent animate-spin rounded-full" />
                          <span className="text-xs font-bold text-slate-400">Carregando textos sagrados...</span>
                        </div>
                      ) : hasError ? (
                        <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center space-y-3 p-4">
                          <AlertTriangle className="text-rose-500" size={28} />
                          <p className="text-xs font-bold">Não foi possível obter esse capítulo na API da Bíblia.</p>
                          <button onClick={fetchVerses} className="bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-xl">Recarregar</button>
                        </div>
                      ) : (
                        <div className="max-w-2xl mx-auto space-y-6 pb-20">
                          <div className="leading-relaxed font-semibold">
                            {verses.map(v => {
                              const isSel = selectedVerseNumber === v.number;
                              const hColor = highlights[`${currentBook}_${currentChapter}_${v.number}`];
                              let highlightStyle = '';
                              if (hColor === 'yellow') highlightStyle = 'bg-yellow-250/90 text-slate-900 border-l-2 border-yellow-500 pl-1.5 rounded-sm dark:text-slate-900';
                              else if (hColor === 'green') highlightStyle = 'bg-emerald-100 dark:bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5 rounded-sm';
                              else if (hColor === 'blue') highlightStyle = 'bg-sky-100 dark:bg-sky-950/40 border-l-2 border-sky-500 pl-1.5 rounded-sm';

                              return (
                                <span 
                                  key={v.number} 
                                  onClick={() => setSelectedVerseNumber(v.number)}
                                  className={`inline-block px-1 py-0.5 rounded-lg cursor-pointer transition-all ${isSel ? 'outline-dashed outline-2 outline-amber-500 bg-amber-500/10' : 'hover:bg-slate-200/30 dark:hover:bg-slate-800/20'} ${highlightStyle}`}
                                >
                                  <sup className="text-[10px] font-black text-amber-600 mr-1 select-none">{v.number}</sup>
                                  {v.text}{' '}
                                </span>
                              );
                            })}
                          </div>

                          {/* Options floating context dialog */}
                          {selectedVerseNumber !== null && (
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3.5 mt-6 text-xs text-left shadow-md"
                            >
                              <div className="flex justify-between items-center border-b dark:border-slate-800 pb-1.5">
                                <span className="font-extrabold text-[10px] uppercase text-amber-500 font-mono">Opções para {currentBook} {currentChapter}:{selectedVerseNumber}</span>
                                <button onClick={() => setSelectedVerseNumber(null)} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
                              </div>

                              <div className="flex flex-wrap gap-4 items-center">
                                {/* Highlighter */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">Marcar:</span>
                                  <div className="flex gap-1">
                                    <button onClick={() => handleToggleHighlight('yellow')} className="w-4.5 h-4.5 bg-yellow-300 border border-transparent rounded-full hover:scale-110 cursor-pointer" />
                                    <button onClick={() => handleToggleHighlight('green')} className="w-4.5 h-4.5 bg-emerald-400 border border-transparent rounded-full hover:scale-110 cursor-pointer" />
                                    <button onClick={() => handleToggleHighlight('blue')} className="w-4.5 h-4.5 bg-sky-450 border border-transparent rounded-full hover:scale-110 cursor-pointer" />
                                    <button onClick={() => handleToggleHighlight('')} className="w-4.5 h-4.5 bg-white border border-slate-300 text-[9px] flex items-center justify-center rounded-full hover:scale-110 text-slate-500 cursor-pointer">×</button>
                                  </div>
                                </div>

                                {/* Save Favorite */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-[9px] uppercase tracking-wider text-slate-400">Salvar:</span>
                                  {collections.map(col => (
                                    <button key={col} onClick={() => handleAddFavorite(col)} className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-black px-2 py-0.5 rounded-full text-[9px] transition-all">
                                      + {col}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Save devotional reflection */}
                              <div className="space-y-1.5 pt-1">
                                <label className="font-black text-[9px] text-slate-400 uppercase block">Escrever reflexão do diário:</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Minhas percepções e orações sobre essa verdade bíblica..." 
                                    value={verseNoteText} 
                                    onChange={(e) => setVerseNoteText(e.target.value)} 
                                    className="flex-1 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 h-9 rounded-lg font-bold outline-none text-xs dark:text-white"
                                  />
                                  <button onClick={handleSaveNote} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-3.5 h-9 rounded-lg text-xs cursor-pointer shadow-3xs flex items-center gap-1"><Plus size={11} /> Gravar</button>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="pt-1.5 border-t dark:border-slate-800 flex justify-between">
                                <button onClick={handleCopyVerse} className="flex items-center gap-1 text-[9px] font-black uppercase text-indigo-500 hover:underline">
                                  <Share2 size={11} /> <span>Copiar com Citação</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mobile float button */}
                    <button onClick={() => setShowBooksSidebarMobile(true)} className="md:hidden fixed bottom-6 right-6 p-4 bg-amber-500 text-white rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-transform active:scale-95 z-30">
                      <BookOpen size={18} />
                    </button>
                  </div>

                  {/* Backdrop overlay on mobile */}
                  {showBooksSidebarMobile && (
                    <div onClick={() => setShowBooksSidebarMobile(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs z-35 md:hidden" />
                  )}

                  {/* Mobile Drawer books list */}
                  <div className={`md:hidden fixed inset-y-0 left-0 w-72 z-40 bg-white dark:bg-slate-900 shadow-xl flex flex-col transition-transform duration-300 ${showBooksSidebarMobile ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-3 bg-slate-105 border-b dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-amber-500 font-mono">Bíblia Sagrada</span>
                      <button onClick={() => setShowBooksSidebarMobile(false)} className="p-1.5 text-slate-405"><X size={15} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      <div>
                        <span className="px-2 text-[9px] font-black uppercase tracking-wider text-amber-500 font-mono block mb-1">Antigo Testamento</span>
                        <div className="space-y-0.5">{BIBLE_BOOKS.slice(0, 39).map(renderBookItem)}</div>
                      </div>
                      <div>
                        <span className="px-2 text-[9px] font-black uppercase tracking-wider text-indigo-505 font-mono block mb-1">Novo Testamento</span>
                        <div className="space-y-0.5">{BIBLE_BOOKS.slice(39).map(renderBookItem)}</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* PLANO DE LEITURA */}
              {activeSubTab === 'plans' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Dynamic Sequential Plan */}
                    <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase font-mono">Bíblia Sequencial</span>
                        <span className="text-[9px] bg-amber-100 dark:bg-amber-955 px-2.5 py-1 rounded-full text-amber-850 dark:text-amber-300 font-extrabold uppercase">Ativo</span>
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Progressão do Velho ao Novo</span>
                          <span>{calculatedProgressPercent}% Lido</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${calculatedProgressPercent}%` }} />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-450 leading-relaxed font-bold">Lê sistematicamente do Gênesis ao Apocalipse. Seu progresso é calculado a partir dos capítulos concluídos de cada livro.</p>
                      <button onClick={() => { onSetReadingPlan('sequential'); alert('Plano Sequencial reestabelecido!'); }} className="text-[9px] w-full font-black uppercase text-slate-800 dark:text-white bg-white hover:bg-slate-50 dark:bg-slate-800 border py-2 rounded-xl transition-all shadow-3xs cursor-pointer">
                        Reestabelecer Plano
                      </button>
                    </div>

                    {/* Chronological Plan */}
                    <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase font-mono">Leitura Cronológica</span>
                        <span className="text-[9px] bg-indigo-100 dark:bg-indigo-955 px-2.5 py-1 rounded-full text-indigo-805 dark:text-indigo-300 font-extrabold uppercase">Histórico</span>
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Eventos em ordem cronológica</span>
                          <span>{Math.round(calculatedProgressPercent * 0.4)}% Lido</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round(calculatedProgressPercent * 0.4)}%` }} />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-450 leading-relaxed font-bold">Acompanha a linha histórica de registros no tempo dos eventos bíblicos.</p>
                      <button onClick={() => { onSetReadingPlan('chronological'); alert('Plano Cronológico Ativado!'); }} className="text-[9px] w-full font-black uppercase text-slate-800 dark:text-white bg-white hover:bg-slate-50 dark:bg-slate-800 border py-2 rounded-xl transition-all shadow-3xs cursor-pointer">
                        Ativar Plano Cronológico
                      </button>
                    </div>

                  </div>

                  {/* Manual Reading Registration Form */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-left">
                    <div className="border-b dark:border-slate-800 pb-2 flex items-center gap-2">
                      <CheckCircle className="text-amber-500" size={18} />
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">Atualização Manual do Progresso 📖</h4>
                        <p className="text-[10px] text-slate-400 leading-normal font-bold">Leu fisicamente fora do sistema? Registre aqui rapidamente o capítulo lido.</p>
                      </div>
                    </div>

                    <form onSubmit={handleRegisterManualProgress} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Livro da Bíblia</label>
                        <select 
                          value={manualBook} 
                          onChange={(e) => {
                            setManualBook(e.target.value);
                            setManualChapter(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 rounded-xl font-bold text-xs outline-none dark:text-white"
                        >
                          {BIBLE_BOOKS.map(b => (
                            <option key={b.name} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Capítulo Lido</label>
                        <select
                          value={manualChapter}
                          onChange={(e) => setManualChapter(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-2 rounded-xl font-bold text-xs outline-none dark:text-white"
                        >
                          {Array.from(
                            { length: BIBLE_BOOKS.find(b => b.name === manualBook)?.chapters || 1 },
                            (_, idx) => (
                              <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button 
                          type="submit" 
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black text-xs py-2.5 rounded-xl shadow-3xs cursor-pointer uppercase transition-all"
                        >
                          Registrar como Lido
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              )}

              {/* MINHAS PREGAÇÕES */}
              {activeSubTab === 'notes' && (
                <div className="space-y-6">
                  
                  {/* Title and Add Button Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-800 dark:text-white">Minhas Pregações</h3>
                    </div>
                    <button 
                      onClick={() => setShowAddPreachingForm(!showAddPreachingForm)}
                      className="bg-teal-600 hover:bg-teal-550 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all uppercase tracking-wider"
                    >
                      {showAddPreachingForm ? 'Fechar Formulário' : 'Adicionar pregação'}
                    </button>
                  </div>

                  {/* Secondary Add Preaching Form - Collapsible */}
                  {showAddPreachingForm && (
                    <div className="bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-855 dark:text-white">Adicionar pregações</h4>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-450">Passagem Bíblica</label>
                            <input 
                              type="text" 
                              placeholder="Ex: João 3:16" 
                              value={preachingPassage}
                              onChange={(e) => setPreachingPassage(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-450">Título / Tema</label>
                            <input 
                              type="text" 
                              placeholder="Ex: Confiança na Tempestade" 
                              value={preachingTitle}
                              onChange={(e) => setPreachingTitle(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-455">Esboço / Conteúdo Completo da Pregação</label>
                          <textarea 
                            rows={15}
                            placeholder="Escreva aqui o esboço da sua pregação com total conforto para textos grandes..." 
                            value={preachingContent}
                            onChange={(e) => setPreachingContent(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4 font-bold font-sans outline-none dark:text-white text-sm leading-relaxed"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button 
                            type="button"
                            onClick={() => setShowAddPreachingForm(false)}
                            className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleSavePreaching}
                            className="bg-teal-600 hover:bg-teal-550 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                          >
                            <Plus size={13} /> <span>Salvar Pregação</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preachings list - PRIMARY */}
                  <div className="space-y-3 text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Pregações Registradas ({bibleState?.reflections?.length || 0})</span>
                    
                    {bibleState?.reflections?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed">Nenhuma pregação registrada ainda. Clique em "Adicionar pregação" para começar!</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {bibleState?.reflections?.map(ref => (
                          <div key={ref.id} className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl relative space-y-3 hover:border-teal-500/25 transition-all shadow-3xs">
                            <button onClick={() => onDeleteReflection(ref.id)} className="absolute right-4 top-4 text-slate-350 hover:text-rose-500 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                            <div className="flex gap-2 items-center flex-wrap">
                              <span className="bg-teal-500/10 text-teal-700 dark:text-teal-300 font-black px-2.5 py-0.5 rounded-md text-[9px] uppercase font-mono">Passagem: {ref.passage}</span>
                              <span className="text-[9px] font-mono opacity-50 block">{new Date(ref.date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-stone-300 leading-relaxed font-bold font-sans whitespace-pre-wrap">{ref.reflection}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ESTATÍSTICAS */}
              {activeSubTab === 'stats' && (
                <div className="space-y-6">
                  
                  {/* Streak and counts row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center shadow-3xs">
                      <Timer size={18} className="text-amber-500 mx-auto" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono mt-1">Tempo Estimado</span>
                      <p className="text-base font-black text-slate-800 dark:text-white leading-none mt-1">{localStorage.getItem('bible_total_minutes') || '45'} Min</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center shadow-3xs">
                      <BookMarked size={18} className="text-amber-500 mx-auto" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono mt-1">Capítulos Lidos</span>
                      <p className="text-base font-black text-slate-800 dark:text-white leading-none mt-1">{localStorage.getItem('bible_completed_chapters_count') || '14'}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center shadow-3xs">
                      <CheckCircle2 size={18} className="text-amber-500 mx-auto" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono mt-1">Meta Anual</span>
                      <p className="text-base font-black text-slate-800 dark:text-white leading-none mt-1">{(calculatedProgressPercent)}% Completo</p>
                    </div>
                  </div>

                  {/* Graph presentation */}
                  <div className="p-5 rounded-3xl bg-slate-500/5 border text-left space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">Estudo Visual de Consistência</span>
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-around p-3">
                      
                      {/* Circle percentage tracker */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-800" fill="transparent" />
                          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-amber-500" fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - calculatedProgressPercent / 100)}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-black text-slate-800 dark:text-white">{calculatedProgressPercent}%</span>
                          <span className="text-[8px] font-mono text-slate-400 uppercase">Da Bíblia</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-stone-300">
                        <p>Total de Capítulos da Bíblia: <strong className="text-slate-800 dark:text-white">1189 Capítulos</strong></p>
                        <p>Concluídos por você: <strong className="text-amber-600">{totalChaptersRead} Capítulos</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Reading logs timeline */}
                  <div className="pt-3 space-y-2 text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">Histórico Recente de Leituras ({bibleState?.history?.length || 0})</span>
                    {bibleState?.history?.length ? (
                      <div className="space-y-1.5">
                        {bibleState.history.slice(0, 10).map((h, i) => (
                          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex justify-between text-xs font-bold leading-none items-center">
                            <span className="text-slate-800 dark:text-stone-200">Capítulo concluído: {h.book} {h.chaptersRead}</span>
                            <span className="text-[9px] opacity-60 font-mono">{new Date(h.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-6">Nenhum histórico disponível.</p>
                    )}
                  </div>

                </div>
              )}

              {/* PROJETOS */}
              {activeSubTab === 'church' && (
                <div className="space-y-6">
                  
                  {/* Header & Toggle Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-800 dark:text-white">Projetos</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setShowAddProjectForm(!showAddProjectForm);
                        if (!showAddProjectForm) {
                          // Clear inputs
                          setProjectTitle('');
                          setProjectDesc('');
                          setProjectNotesText('');
                          setProjectDateText('');
                          setProjectImageUrl('');
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all uppercase tracking-wider"
                    >
                      {showAddProjectForm ? 'Fechar Formulário' : 'Novo projeto'}
                    </button>
                  </div>

                  {/* Secondary Add Project Form - Collapsible */}
                  {showAddProjectForm && (
                    <form onSubmit={handleAddProjectSubmit} className="bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-left">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white">Criar Novo Projeto</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Título do Projeto</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Reforma da Fachada" 
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Categoria</label>
                          <select 
                            value={projectCategory}
                            onChange={(e) => setProjectCategory(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                          >
                            <option value="Reforma">Reforma / Infraestrutura</option>
                            <option value="Ministério">Ministério</option>
                            <option value="Social">Ação Social</option>
                            <option value="Evento">Evento Especial</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-450">Descrição do Objetivo</label>
                        <input 
                          type="text" 
                          placeholder="Breve descrição do projeto..." 
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-455">Data Prevista / Calendário</label>
                          <input 
                            type="date" 
                            value={projectDateText}
                            onChange={(e) => setProjectDateText(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2 font-bold outline-none dark:text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-455">Link de Imagem do Projeto (URL)</label>
                          <input 
                            type="url" 
                            placeholder="https://exemplo.com/imagem.jpg" 
                            value={projectImageUrl}
                            onChange={(e) => setProjectImageUrl(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-455">Notas e Detalhes Iniciais</label>
                        <textarea 
                          rows={3}
                          placeholder="Notas adicionais sobre o projeto..." 
                          value={projectNotesText}
                          onChange={(e) => setProjectNotesText(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-3 font-bold font-sans outline-none dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowAddProjectForm(false)}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer uppercase tracking-wider"
                        >
                          Salvar Projeto
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Primary Projects Dashboard View (List + Active Details side-by-side or stacked) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
                    
                    {/* Left/Top: Projects List (Primary) */}
                    <div className="lg:col-span-5 space-y-3">
                      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Projetos Ativos ({(churchData?.ideas || []).length})</span>
                      
                      {(churchData?.ideas || []).length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed">Nenhum projeto cadastrado. Clique em "Novo projeto" acima!</p>
                      ) : (
                        <div className="space-y-3">
                          {(churchData?.ideas || []).map((idea) => {
                            const isSelected = selectedProjectId === idea.id;
                            const totalTasks = idea.tasks?.length || 0;
                            const completedTasks = idea.tasks?.filter(t => t.completed).length || 0;
                            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                            
                            return (
                              <div 
                                key={idea.id} 
                                onClick={() => {
                                  setSelectedProjectId(idea.id);
                                  setProjectNotesText(idea.notes || '');
                                  setProjectDateText(idea.date || '');
                                  setProjectImageUrl(idea.imageUrl || '');
                                }}
                                className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl cursor-pointer transition-all hover:border-rose-500 relative space-y-2.5 shadow-3xs ${isSelected ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-150 dark:border-slate-800'}`}
                              >
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProject(idea.id);
                                  }} 
                                  className="absolute right-3.5 top-3.5 text-slate-350 hover:text-rose-500 transition-colors z-10 cursor-pointer"
                                  title="Excluir projeto"
                                >
                                  <Trash2 size={13} />
                                </button>
                                
                                <div className="flex gap-2 items-center flex-wrap">
                                  <span className="bg-rose-500/10 text-rose-700 dark:text-rose-300 font-black text-[9px] px-2 py-0.5 rounded-full font-mono uppercase">{idea.category || 'Projeto'}</span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${idea.status === 'executed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : idea.status === 'planning' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                    {idea.status === 'executed' ? 'Concluído' : idea.status === 'planning' ? 'Planejamento' : 'Ideia'}
                                  </span>
                                </div>

                                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug">{idea.title}</h4>
                                {idea.description && (
                                  <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-normal line-clamp-2">{idea.description}</p>
                                )}

                                {totalTasks > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[9px] font-mono opacity-60">
                                      <span>Checklist</span>
                                      <span>{completedTasks}/{totalTasks} ({progressPercent}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                      <div className="bg-rose-500 h-full transition-all" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                  </div>
                                )}

                                {idea.date && (
                                  <span className="text-[9px] font-mono opacity-50 block pt-1">Meta: {new Date(idea.date).toLocaleDateString()}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right/Bottom: Active Project Detail Panel (Secondary) */}
                    <div className="lg:col-span-7">
                      {(() => {
                        const activeProject = (churchData?.ideas || []).find(i => i.id === selectedProjectId);
                        if (!activeProject) {
                          return (
                            <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed rounded-3xl text-center bg-slate-500/5 min-h-[300px]">
                              <Church size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
                              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Nenhum projeto selecionado</h4>
                              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Selecione um projeto na lista lateral para visualizar notas detalhadas, imagens, cronograma e tarefas.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
                            
                            {/* Project Image Banner */}
                            {activeProject.imageUrl ? (
                              <div className="relative w-full h-44 rounded-2xl overflow-hidden group border dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                                <img 
                                  src={activeProject.imageUrl} 
                                  alt={activeProject.title} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-102"
                                  referrerPolicy="no-referrer"
                                />
                                <button 
                                  onClick={() => handleUpdateProjectField(activeProject.id, { imageUrl: '' })}
                                  className="absolute top-3 right-3 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                                  title="Remover imagem"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Galeria do Projeto</span>
                                <div className="flex gap-1.5 w-full max-w-md">
                                  <input 
                                    type="url" 
                                    placeholder="Adicionar link de imagem do projeto..." 
                                    value={projectImageUrl}
                                    onChange={(e) => setProjectImageUrl(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 flex-1 outline-none dark:text-white"
                                  />
                                  <button 
                                    onClick={() => {
                                      if (projectImageUrl.trim()) {
                                        handleUpdateProjectField(activeProject.id, { imageUrl: projectImageUrl.trim() });
                                        setProjectImageUrl('');
                                      }
                                    }}
                                    className="bg-slate-800 hover:bg-slate-750 dark:bg-slate-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
                                  >
                                    Adicionar
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Project Header Details */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <h3 className="text-base font-black text-slate-800 dark:text-white leading-snug">{activeProject.title}</h3>
                                <div className="flex gap-1.5 shrink-0">
                                  <select 
                                    value={activeProject.status} 
                                    onChange={(e) => handleUpdateProjectField(activeProject.id, { status: e.target.value as any })} 
                                    className="bg-slate-105 border dark:bg-slate-800 dark:border-slate-700 text-[10px] font-black px-2.5 py-1.5 rounded-xl outline-none text-slate-700 dark:text-white"
                                  >
                                    <option value="idea">Ideia</option>
                                    <option value="planning">Planejamento</option>
                                    <option value="executed">Concluído</option>
                                  </select>
                                </div>
                              </div>

                              {activeProject.description && (
                                <p className="text-xs text-slate-500 leading-relaxed font-bold">{activeProject.description}</p>
                              )}
                            </div>

                            {/* Date Picker Section */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl space-y-2 border">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Meta / Calendário</span>
                                {activeProject.date && (
                                  <span className="text-xs font-black text-slate-700 dark:text-stone-300">{new Date(activeProject.date).toLocaleDateString()}</span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="date" 
                                  value={projectDateText}
                                  onChange={(e) => {
                                    setProjectDateText(e.target.value);
                                    handleUpdateProjectField(activeProject.id, { date: e.target.value });
                                  }}
                                  className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs font-black rounded-xl px-3 py-1.5 outline-none dark:text-white flex-1"
                                />
                              </div>
                            </div>

                            {/* Dynamic Checklist / Tasks Section */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">Lista de Atividades / Checklist</span>
                              
                              {/* Add task form */}
                              <div className="flex gap-2 text-xs">
                                <input 
                                  type="text" 
                                  placeholder="Nova tarefa ou etapa..." 
                                  value={newSubtaskText}
                                  onChange={(e) => setNewSubtaskText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newSubtaskText.trim()) {
                                      const updatedTasks = [...(activeProject.tasks || []), { id: Math.random().toString(), text: newSubtaskText.trim(), completed: false }];
                                      handleUpdateProjectField(activeProject.id, { tasks: updatedTasks });
                                      setNewSubtaskText('');
                                    }
                                  }}
                                  className="bg-slate-55 border border-slate-200 dark:bg-slate-955/30 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 flex-1 outline-none dark:text-white"
                                />
                                <button 
                                  onClick={() => {
                                    if (newSubtaskText.trim()) {
                                      const updatedTasks = [...(activeProject.tasks || []), { id: Math.random().toString(), text: newSubtaskText.trim(), completed: false }];
                                      handleUpdateProjectField(activeProject.id, { tasks: updatedTasks });
                                      setNewSubtaskText('');
                                    }
                                  }}
                                  className="bg-slate-800 hover:bg-slate-750 text-white font-black px-4 rounded-xl cursor-pointer"
                                >
                                  Adicionar
                                </button>
                              </div>

                              {/* Task List items */}
                              <div className="space-y-2 pt-1">
                                {(!activeProject.tasks || activeProject.tasks.length === 0) ? (
                                  <p className="text-[11px] text-slate-400 italic pl-1">Nenhuma atividade agendada para este projeto.</p>
                                ) : (
                                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                                    {activeProject.tasks.map((task) => (
                                      <div key={task.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/30 border dark:border-slate-850 rounded-xl">
                                        <button 
                                          onClick={() => {
                                            const updatedTasks = activeProject.tasks?.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
                                            handleUpdateProjectField(activeProject.id, { tasks: updatedTasks });
                                          }}
                                          className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-stone-300 text-left flex-1"
                                        >
                                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${task.completed ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-350 bg-white dark:bg-slate-900'}`}>
                                            {task.completed && <Check size={11} />}
                                          </div>
                                          <span className={task.completed ? 'line-through text-slate-400 font-medium' : ''}>{task.text}</span>
                                        </button>
                                        <button 
                                          onClick={() => {
                                            const updatedTasks = activeProject.tasks?.filter(t => t.id !== task.id);
                                            handleUpdateProjectField(activeProject.id, { tasks: updatedTasks });
                                          }}
                                          className="text-slate-350 hover:text-rose-500 transition-colors ml-2"
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notes Textarea (short/long text) */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">Notas & Memorial do Projeto</span>
                              <textarea 
                                rows={6}
                                placeholder="Insira detalhes adicionais, notas de reuniões de melhorias ou anotações livres..." 
                                value={projectNotesText}
                                onChange={(e) => {
                                  setProjectNotesText(e.target.value);
                                  handleUpdateProjectField(activeProject.id, { notes: e.target.value });
                                }}
                                className="w-full bg-slate-55 border border-slate-200 dark:bg-slate-955/30 dark:border-slate-800 text-xs rounded-xl p-3 font-bold font-sans outline-none dark:text-white leading-relaxed"
                              />
                            </div>

                          </div>
                        );
                      })()}
                    </div>

                  </div>

                </div>
              )}

              {/* ESCALAS */}
              {activeSubTab === 'ministries' && (
                <div className="space-y-6">
                  
                  {/* Header & Toggle Button */}
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Escalas</h3>
                    <button 
                      onClick={() => {
                        setShowAddScaleForm(!showAddScaleForm);
                        if (!showAddScaleForm) {
                          setScaleRole('');
                          setScaleLocal('');
                          setScaleData('');
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all uppercase tracking-wider"
                    >
                      {showAddScaleForm ? 'Fechar Formulário' : 'Nova escala'}
                    </button>
                  </div>

                  {/* Secondary Collapsible Scale Registration Form */}
                  {showAddScaleForm && (
                    <form onSubmit={handleAddScaleSubmit} className="bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-left">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white">Registrar Nova Escala</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Sua Função</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Pianista / Sonoplasta" 
                            value={scaleRole}
                            onChange={(e) => setScaleRole(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Local</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Templo Central / Sala de Ensaios" 
                            value={scaleLocal}
                            onChange={(e) => setScaleLocal(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Data</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Domingo, 19:30" 
                            value={scaleData}
                            onChange={(e) => setScaleData(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowAddScaleForm(false)}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer uppercase tracking-wider"
                        >
                          Salvar na Escala
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Primary Scales List Rendering */}
                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">Escalas Cadastradas ({(churchData?.ministries || []).length})</span>
                    
                    {(churchData?.ministries || []).length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(churchData.ministries || []).map((min) => (
                          <div key={min.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2.5 relative shadow-3xs hover:border-rose-500 transition-all">
                            <button 
                              onClick={() => handleDeleteMinistry(min.id)} 
                              className="absolute right-3.5 top-3.5 text-slate-350 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Excluir escala"
                            >
                              <Trash2 size={13} />
                            </button>
                            
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 font-black uppercase tracking-wider">Função</span>
                              <p className="text-xs font-black text-slate-800 dark:text-white leading-snug">{min.role}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t dark:border-slate-850">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-mono opacity-50 block">Local</span>
                                <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300">{min.responsibilities || 'Geral'}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-mono opacity-50 block">Data</span>
                                <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300">{min.scale || 'Geral'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed">Sem escalações ativas cadastradas.</p>
                    )}
                  </div>

                </div>
              )}

              {/* AGENDA */}
              {activeSubTab === 'agenda' && (
                <div className="space-y-6">
                  
                  {/* Header & Toggle Button */}
                  <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Agenda</h3>
                    <button 
                      onClick={() => {
                        setShowAddAgendaForm(!showAddAgendaForm);
                        if (!showAddAgendaForm) {
                          setAgendaTitle('');
                          setAgendaLoc('');
                          setAgendaDate('');
                          setAgendaTime('');
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all uppercase tracking-wider"
                    >
                      {showAddAgendaForm ? 'Fechar Formulário' : 'Novo compromisso'}
                    </button>
                  </div>

                  {/* Secondary Collapsible Agenda Event Registration Form */}
                  {showAddAgendaForm && (
                    <form onSubmit={handleAddAgendaSubmit} className="bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-left">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white">Registrar Novo Compromisso</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Tipo de Evento</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Culto Sede / Ensaio de Jovens" 
                            value={agendaTitle}
                            onChange={(e) => setAgendaTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Onde</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Templo Central / Sala 3" 
                            value={agendaLoc}
                            onChange={(e) => setAgendaLoc(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Data</label>
                          <input 
                            type="date" 
                            value={agendaDate}
                            onChange={(e) => setAgendaDate(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-450">Horário</label>
                          <input 
                            type="time" 
                            value={agendaTime}
                            onChange={(e) => setAgendaTime(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-3 py-2 font-bold outline-none dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowAddAgendaForm(false)}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="bg-rose-600 hover:bg-rose-555 text-white text-xs font-black px-5 py-2 rounded-xl shadow-xs cursor-pointer uppercase tracking-wider"
                        >
                          Salvar na Agenda
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Primary Agenda Schedules List */}
                  <div className="space-y-3.5 text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider block">Compromissos Agendados ({(churchData?.events || []).length})</span>
                    
                    {(churchData?.events || []).length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(churchData.events || []).map((evt) => (
                          <div key={evt.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-3.5 relative shadow-3xs hover:border-rose-500 transition-all">
                            <button 
                              onClick={() => handleDeleteEvent(evt.id)} 
                              className="absolute right-3.5 top-3.5 text-slate-350 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Excluir compromisso"
                            >
                              <Trash2 size={13} />
                            </button>
                            
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 font-black uppercase tracking-wider">Tipo de Evento</span>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white leading-snug">{evt.title}</h4>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-2 border-t dark:border-slate-850 text-[10px]">
                              <div className="col-span-2 space-y-0.5">
                                <span className="text-[9px] font-mono opacity-50 block">Onde</span>
                                <span className="font-bold text-slate-650 dark:text-slate-300 block truncate">{evt.location}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-mono opacity-50 block">Quando</span>
                                <span className="font-bold text-slate-650 dark:text-slate-300 block truncate">
                                  {evt.date ? new Date(evt.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'numeric'}) : ''} às {evt.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed">Sem compromissos agendados na agenda.</p>
                    )}
                  </div>

                </div>
              )}

              {/* CONFIGURAÇÕES (Collapsible grouped categories) */}
              {activeSubTab === 'settings' && (
                <div className="w-full space-y-4 max-w-2xl mx-auto text-left">
                  
                  {/* Section A: Background/Fundo */}
                  <div className="border rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                    <button 
                      onClick={() => setColSettings({ ...colSettings, bg: !colSettings.bg })}
                      className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-900 font-black text-xs uppercase tracking-wide cursor-pointer"
                    >
                      <span>1. Cores de Fundo do Leitor</span>
                      {colSettings.bg ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {colSettings.bg && (
                      <div className="p-4 grid grid-cols-3 gap-2 border-t">
                        <button onClick={() => setReaderBg('light')} className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${readerBg === 'light' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white hover:bg-slate-50'}`}>Claro</button>
                        <button onClick={() => setReaderBg('sepia')} className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${readerBg === 'sepia' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-950'}`}>Sépia</button>
                        <button onClick={() => setReaderBg('dark')} className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${readerBg === 'dark' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-white'}`}>Escuro</button>
                      </div>
                    )}
                  </div>

                  {/* Section B: Typography/Caligrafia */}
                  <div className="border rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                    <button 
                      onClick={() => setColSettings({ ...colSettings, font: !colSettings.font })}
                      className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-900 font-black text-xs uppercase tracking-wide cursor-pointer"
                    >
                      <span>2. Estilos de Fontes</span>
                      {colSettings.font ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {colSettings.font && (
                      <div className="p-4 grid grid-cols-3 gap-2 border-t">
                        <button onClick={() => setFontStyle('sans')} className={`py-2 px-3 rounded-xl text-xs font-black border font-sans ${fontStyle === 'sans' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Inter (Sans)</button>
                        <button onClick={() => setFontStyle('serif')} className={`py-2 px-3 rounded-xl text-xs font-black border font-serif ${fontStyle === 'serif' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Serif (Kindle)</button>
                        <button onClick={() => setFontStyle('mono')} className={`py-2 px-3 rounded-xl text-xs font-black border font-mono ${fontStyle === 'mono' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Mono (Code)</button>
                      </div>
                    )}
                  </div>

                  {/* Section C: Font Size & Spacing */}
                  <div className="border rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                    <button 
                      onClick={() => setColSettings({ ...colSettings, size: !colSettings.size })}
                      className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-900 font-black text-xs uppercase tracking-wide cursor-pointer"
                    >
                      <span>3. Tamanho da Letra e Entrelinhamento</span>
                      {colSettings.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {colSettings.size && (
                      <div className="p-4 space-y-4 border-t text-xs">
                        <div className="space-y-1.5">
                          <span className="font-extrabold text-[10px] text-slate-400 block uppercase font-mono">Tamanho da Letra: {fontSize}px</span>
                          <div className="flex gap-1.5 items-center">
                            <button onClick={() => setFontSize(Math.max(12, fontSize - 1))} className="w-9 h-9 border rounded-xl flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-slate-705">-</button>
                            <input type="range" min="12" max="30" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="flex-1 accent-amber-600 cursor-pointer" />
                            <button onClick={() => setFontSize(Math.min(30, fontSize + 1))} className="w-9 h-9 border rounded-xl flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-slate-705">+</button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="font-extrabold text-[10px] text-slate-400 block uppercase font-mono text-left">Espaçamento das linhas</span>
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setLineHeight('normal')} className={`py-2 px-3 border rounded-xl font-bold ${lineHeight === 'normal' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Padrão</button>
                            <button onClick={() => setLineHeight('relaxed')} className={`py-2 px-3 border rounded-xl font-bold ${lineHeight === 'relaxed' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Relaxado</button>
                            <button onClick={() => setLineHeight('loose')} className={`py-2 px-3 border rounded-xl font-bold ${lineHeight === 'loose' ? 'bg-amber-600 text-white' : 'bg-white'}`}>Expandido</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
