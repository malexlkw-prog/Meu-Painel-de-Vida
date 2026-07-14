import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Settings, 
  Layers, 
  Palette, 
  Sliders, 
  Bell, 
  Database, 
  Lock, 
  Camera, 
  Star, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  RotateCcw, 
  Moon, 
  Sun,
  LayoutGrid,
  ShieldCheck,
  Type,
  Maximize2,
  Minimize2,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { PainelData } from '../types';

interface CustomizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PainelData;
  onImport: (newData: PainelData) => void;
  onResetToDefaults: () => void;
  onClearAll: () => void;
  userName: string;
  setUserName: (name: string) => void;
  profilePicUrl: string;
  setProfilePicUrl: (url: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

// Available Tabs Definition
export interface TabConfig {
  id: string;
  label: string;
  icon: string; // Storing matching lucide icon names or direct identification
  color: string;
  hidden: boolean;
  pinned: boolean;
  order: number;
}

const DEFAULT_TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home', color: 'text-indigo-500', hidden: false, pinned: true, order: 0 },
  { id: 'sete', label: 'Sete (Assistente IA)', icon: 'Sparkles', color: 'text-amber-500 font-black', hidden: false, pinned: true, order: 1 },
  { id: 'gallery', label: 'Galeria Pessoal', icon: 'ImageIcon', color: 'text-sky-500 font-extrabold', hidden: false, pinned: false, order: 2 },
  { id: 'gym', label: 'Treino', icon: 'Dumbbell', color: 'text-orange-500', hidden: false, pinned: false, order: 3 },
  { id: 'shoppingList', label: 'Lista de Compras', icon: 'ShoppingBag', color: 'text-rose-500', hidden: false, pinned: false, order: 4 },
  { id: 'tasks', label: 'Tarefas do Dia', icon: 'CheckSquare', color: 'text-indigo-400', hidden: false, pinned: false, order: 5 },
  { id: 'schedule', label: 'Cronograma Diário', icon: 'Clock', color: 'text-cyan-500', hidden: false, pinned: false, order: 6 },
  { id: 'studies', label: 'Estudos', icon: 'BookOpen', color: 'text-violet-500', hidden: false, pinned: false, order: 7 },
  { id: 'calendar', label: 'Calendário', icon: 'Calendar', color: 'text-violet-500', hidden: false, pinned: false, order: 8 },
  { id: 'notes', label: 'Notas', icon: 'FileText', color: 'text-amber-500', hidden: false, pinned: false, order: 9 },
  { id: 'creativity', label: 'Criatividade', icon: 'Sparkles', color: 'text-pink-500', hidden: false, pinned: false, order: 10 },
  { id: 'media', label: 'Mídias (Filmes / Animes)', icon: 'Tv', color: 'text-emerald-500', hidden: false, pinned: false, order: 11 },
  { id: 'music', label: 'Músicas & Artistas', icon: 'Music', color: 'text-pink-500', hidden: false, pinned: false, order: 12 },
  { id: 'bible', label: 'Igreja', icon: 'Book', color: 'text-amber-500', hidden: false, pinned: false, order: 13 },
  { id: 'church', label: 'Vida na Igreja', icon: 'Church', color: 'text-rose-600', hidden: false, pinned: false, order: 14 },
  { id: 'reminders', label: 'Lembretes & Alertas', icon: 'Bell', color: 'text-amber-400', hidden: false, pinned: false, order: 15 },
  { id: 'finance', label: 'Controle Financeiro', icon: 'DollarSign', color: 'text-emerald-400', hidden: false, pinned: false, order: 16 },
  { id: 'quero_comprar', label: '👕 Quero Comprar', icon: 'ShoppingBag', color: 'text-pink-500 font-extrabold', hidden: false, pinned: false, order: 17 },
  { id: 'settings', label: 'Sistema & Segurança', icon: 'Settings', color: 'text-slate-500', hidden: false, pinned: false, order: 18 }
];

// Available Dashboard Grid Modules Config definitions
export interface DashboardCardConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

const DEFAULT_DASHBOARD_CARDS: DashboardCardConfig[] = [
  { id: 'finance', label: 'Módulo Financeiro (Receitas & Despesas)', visible: true, order: 0 },
  { id: 'schedule', label: 'Cronograma da Rotina (Lista horários de hoje)', visible: true, order: 1 },
  { id: 'reminders', label: 'Alertas & Lembretes Urgentes', visible: true, order: 2 }
];

export default function CustomizationDrawer({
  isOpen,
  onClose,
  data,
  onImport,
  onResetToDefaults,
  onClearAll,
  userName,
  setUserName,
  profilePicUrl,
  setProfilePicUrl,
  darkMode,
  setDarkMode
}: CustomizationDrawerProps) {
  // Navigation internal drawer state
  const [activeTabPanel, setActiveTabPanel] = useState<'profile' | 'menu' | 'dashboard' | 'appearance' | 'preferences' | 'data' | 'security'>('profile');
  
  // Profile elements
  const [nickname, setNickname] = useState(() => localStorage.getItem('lifehub_nickname') || '');
  const [statusPhrase, setStatusPhrase] = useState(() => localStorage.getItem('lifehub_status_phrase') || 'Sempre focado nos objetivos ✨');
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem('lifehub_avatar_color') || '#6366f1'); // default indigo
  
  // Menu tab items state
  const [tabsList, setTabsList] = useState<TabConfig[]>(() => {
    const saved = localStorage.getItem('lifehub_tabs_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sync any newly added default item (e.g. 'copa')
        const missing = DEFAULT_TABS.filter(dt => !parsed.some((pt: any) => pt.id === dt.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return DEFAULT_TABS;
      }
    }
    return DEFAULT_TABS;
  });

  // Dashboard configuration
  const [dashboardCards, setDashboardCards] = useState<DashboardCardConfig[]>(() => {
    const saved = localStorage.getItem('lifehub_dashboard_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const missing = DEFAULT_DASHBOARD_CARDS.filter(dt => !parsed.some((pt: any) => pt.id === dt.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return DEFAULT_DASHBOARD_CARDS;
      }
    }
    return DEFAULT_DASHBOARD_CARDS;
  });

  // Appearance elements
  const [systemAccentColor, setSystemAccentColor] = useState(() => localStorage.getItem('lifehub_accent_color') || 'indigo');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('lifehub_font_size') || 'normal'); // small, normal, large
  const [compactSidebar, setCompactSidebar] = useState(() => localStorage.getItem('lifehub_compact_sidebar') === 'true');
  const [enableAnimations, setEnableAnimations] = useState(() => localStorage.getItem('lifehub_animations') !== 'false');

  // Preferences
  const [notifsEnabled, setNotifsEnabled] = useState(() => localStorage.getItem('lifehub_pref_notifs') !== 'false');
  const [soundsEnabled, setSoundsEnabled] = useState(() => localStorage.getItem('lifehub_pref_sounds') !== 'false');
  const [autoReminders, setAutoReminders] = useState(() => localStorage.getItem('lifehub_pref_reminders') !== 'false');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('lifehub_pref_date_format') || 'DD/MM/YYYY');
  const [appLanguage, setAppLanguage] = useState(() => localStorage.getItem('lifehub_pref_lang') || 'pt');
  const [timezoneSec, setTimezoneSec] = useState(() => localStorage.getItem('lifehub_pref_timezone') || 'GMT-3');

  // Security elements
  const [pinCode, setPinCode] = useState(() => localStorage.getItem('lifehub_pin') || '2010');
  const [securityQuestion, setSecurityQuestion] = useState(() => localStorage.getItem('lifehub_sec_question') || 'Qual o nome do seu primeiro animal?');
  const [securityAnswer, setSecurityAnswer] = useState(() => localStorage.getItem('lifehub_sec_answer') || 'Pipoca');
  const [showPinInput, setShowPinInput] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto trigger alerts
  const showBanner = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('lifehub_nickname', nickname);
    // Dispatch custom event to notify App.tsx of changes
    window.dispatchEvent(new Event('lifehub_profile_update'));
  }, [nickname]);

  useEffect(() => {
    localStorage.setItem('lifehub_status_phrase', statusPhrase);
    window.dispatchEvent(new Event('lifehub_profile_update'));
  }, [statusPhrase]);

  useEffect(() => {
    localStorage.setItem('lifehub_avatar_color', avatarColor);
    window.dispatchEvent(new Event('lifehub_profile_update'));
  }, [avatarColor]);

  useEffect(() => {
    localStorage.setItem('lifehub_tabs_config', JSON.stringify(tabsList));
    window.dispatchEvent(new Event('lifehub_sidebar_reorder'));
  }, [tabsList]);

  useEffect(() => {
    localStorage.setItem('lifehub_dashboard_config', JSON.stringify(dashboardCards));
    window.dispatchEvent(new Event('lifehub_dashboard_reorder'));
  }, [dashboardCards]);

  useEffect(() => {
    localStorage.setItem('lifehub_accent_color', systemAccentColor);
    document.documentElement.setAttribute('data-accent-color', systemAccentColor);
    window.dispatchEvent(new Event('lifehub_appearance_update'));
  }, [systemAccentColor]);

  useEffect(() => {
    localStorage.setItem('lifehub_font_size', fontSize);
    const bodyClass = document.body.classList;
    bodyClass.remove('text-xs', 'text-sm', 'text-base', 'text-lg');
    if (fontSize === 'small') bodyClass.add('text-xs');
    else if (fontSize === 'large') bodyClass.add('text-base');
    else bodyClass.add('text-sm');
    window.dispatchEvent(new Event('lifehub_appearance_update'));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('lifehub_compact_sidebar', compactSidebar.toString());
    window.dispatchEvent(new Event('lifehub_sidebar_toggle'));
  }, [compactSidebar]);

  useEffect(() => {
    localStorage.setItem('lifehub_animations', enableAnimations.toString());
  }, [enableAnimations]);

  useEffect(() => {
    localStorage.setItem('lifehub_pref_notifs', notifsEnabled.toString());
    localStorage.setItem('lifehub_pref_sounds', soundsEnabled.toString());
    localStorage.setItem('lifehub_pref_reminders', autoReminders.toString());
    localStorage.setItem('lifehub_pref_date_format', dateFormat);
    localStorage.setItem('lifehub_pref_lang', appLanguage);
    localStorage.setItem('lifehub_pref_timezone', timezoneSec);
  }, [notifsEnabled, soundsEnabled, autoReminders, dateFormat, appLanguage, timezoneSec]);

  // Handle Tab Customization actions
  const moveTab = (index: number, direction: 'up' | 'down') => {
    const newList = [...tabsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newList.length) {
      const [movedItem] = newList.splice(index, 1);
      newList.splice(targetIndex, 0, movedItem);
      // Re-assign order numbers
      const updated = newList.map((item, idx) => ({ ...item, order: idx }));
      setTabsList(updated);
      showBanner('Ordem das abas sincronizada!');
    }
  };

  const toggleTabHide = (id: string) => {
    const updated = tabsList.map(t => t.id === id ? { ...t, hidden: !t.hidden } : t);
    setTabsList(updated);
    showBanner('Visibilidade da aba atualizada!');
  };

  const toggleTabPin = (id: string) => {
    const updated = tabsList.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t);
    // Sort so pinned are on top optionally or handle manually
    setTabsList(updated);
    showBanner('Pin da aba atualizado!');
  };

  const resetTabsOrder = () => {
    setTabsList(DEFAULT_TABS);
    showBanner('Ordem padrão restabelecida com sucesso!');
  };

  // Handle Dashboard order changes
  const moveDashboardCard = (index: number, direction: 'up' | 'down') => {
    const newList = [...dashboardCards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newList.length) {
      const [moved] = newList.splice(index, 1);
      newList.splice(targetIndex, 0, moved);
      const updated = newList.map((item, idx) => ({ ...item, order: idx }));
      setDashboardCards(updated);
      showBanner('Ordem dos cards do dashboard atualizada!');
    }
  };

  const toggleDashboardCardVisibility = (id: string) => {
    const updated = dashboardCards.map(c => c.id === id ? { ...c, visible: !c.visible } : c);
    setDashboardCards(updated);
    showBanner('Visibilidade do módulo atualizada!');
  };

  const handleUpdatePIN = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 4 || isNaN(Number(pinCode))) {
      alert('O PIN deve conter exatamente 4 números!');
      return;
    }
    localStorage.setItem('lifehub_pin', pinCode);
    localStorage.setItem('lifehub_sec_question', securityQuestion);
    localStorage.setItem('lifehub_sec_answer', securityAnswer);
    showBanner('PIN e pergunta de segurança salvos com sucesso!');
    setShowPinInput(false);
  };

  const handleManualLock = () => {
    sessionStorage.removeItem('lifehub_unlocked');
    window.location.reload(); // Quick clean reload lock trigger
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 z-40 backdrop-blur-xs"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-205 dark:border-slate-800 z-50 flex flex-col shadow-2xl overflow-hidden font-sans text-slate-800 dark:text-slate-150"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2">
                <Settings className="text-indigo-650 dark:text-indigo-400" size={20} />
                <div>
                  <h2 className="text-md sm:text-lg font-bold">Painel de Personalização</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Deixe o "Meu Painel de Vida" com a sua cara</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Sections Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-850 px-4 py-1.5 gap-1.5 shrink-0 scrollbar-none bg-slate-50/20 dark:bg-slate-950/10">
              <button 
                onClick={() => setActiveTabPanel('profile')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'profile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <User size={13} /> Perfil
              </button>
              <button 
                onClick={() => setActiveTabPanel('menu')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'menu' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers size={13} /> Abas Menu
              </button>
              <button 
                onClick={() => setActiveTabPanel('dashboard')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutGrid size={13} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTabPanel('appearance')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'appearance' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Palette size={13} /> Aparência
              </button>
              <button 
                onClick={() => setActiveTabPanel('preferences')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'preferences' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bell size={13} /> Preferências
              </button>
              <button 
                onClick={() => setActiveTabPanel('data')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'data' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database size={13} /> Dados
              </button>
              <button 
                onClick={() => setActiveTabPanel('security')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTabPanel === 'security' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Lock size={13} /> Segurança
              </button>
            </div>

            {/* Dynamic Panel Content Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              {/* Toast Success Notification */}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500 text-white text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Check size={16} />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              {/* SECTION: PROFILE */}
              {activeTabPanel === 'profile' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-18 h-18 rounded-full border-2 border-indigo-550 shrink-0 bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                      {profilePicUrl ? (
                        <img 
                          src={profilePicUrl} 
                          alt="Foto" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-xl font-bold" style={{ color: avatarColor }}>{userName[0]?.toUpperCase() || 'M'}</span>
                      )}
                      
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-semibold cursor-pointer transition-opacity">
                        <Camera size={14} className="mb-0.5" />
                        <span>Mudar</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setProfilePicUrl(reader.result);
                                  showBanner('Foto de perfil importada!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Seu Cartão de Perfil</h4>
                      <p className="text-xs text-slate-400">Insira um link direto para a imagem ou suba um arquivo.</p>
                      <input 
                        type="text" 
                        placeholder="Link direto da imagem URL..." 
                        value={profilePicUrl}
                        onChange={(e) => setProfilePicUrl(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                      <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Apelido (Opcional)</label>
                      <input 
                        type="text" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        placeholder="Como gostaria de ser chamado"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Frase de Status / Vibe</label>
                      <input 
                        type="text" 
                        value={statusPhrase} 
                        onChange={(e) => setStatusPhrase(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        placeholder="Frase inspiradora do dia"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cor do Avatar (Fallback)</label>
                      <div className="flex flex-wrap gap-2">
                        {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#64748b'].map((hex) => (
                          <button 
                            key={hex}
                            onClick={() => setAvatarColor(hex)}
                            className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
                            style={{ 
                              backgroundColor: hex,
                              borderColor: avatarColor === hex ? '#000' : 'transparent'
                            }}
                          >
                            {avatarColor === hex && <Check size={12} className="text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SIDEBAR TABS ORGANIZATION */}
              {activeTabPanel === 'menu' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">Ordene, oculte ou fixe as abas do menu de navegação.</p>
                    <button 
                      onClick={resetTabsOrder}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <RotateCcw size={12} /> Padrão
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
                    {tabsList.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between gap-3 text-xs ${
                          item.hidden ? 'opacity-55' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.pinned ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <span className={`${item.color} font-extrabold`}>●</span>
                          <span className="font-bold truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Pin Toggle */}
                          <button 
                            onClick={() => toggleTabPin(item.id)}
                            className={`p-1.5 rounded-lg cursor-pointer ${item.pinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title={item.pinned ? 'Remover do topo' : 'Fixar no topo'}
                          >
                            <Star size={13} fill={item.pinned ? 'currentColor' : 'none'} />
                          </button>

                          {/* Hide Toggle */}
                          <button 
                            onClick={() => toggleTabHide(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title={item.hidden ? 'Exibir aba' : 'Ocultar aba'}
                          >
                            {item.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>

                          {/* Order manipulators */}
                          <button 
                            onClick={() => moveTab(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button 
                            onClick={() => moveTab(index, 'down')}
                            disabled={index === tabsList.length - 1}
                            className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: DASHBOARD */}
              {activeTabPanel === 'dashboard' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-400">Escolha quais módulos rápidos aparecem no seu Dashboard principal e altere sua ordem.</p>

                  <div className="space-y-1.5">
                    {dashboardCards.map((card, index) => (
                      <div 
                        key={card.id}
                        className={`p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs ${
                          !card.visible ? 'opacity-50' : ''
                        }`}
                      >
                        <span className="font-bold">{card.label}</span>

                        <div className="flex items-center gap-1.5">
                          {/* Visibility */}
                          <button 
                            onClick={() => toggleDashboardCardVisibility(card.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title={card.visible ? 'Ocultar' : 'Exibir'}
                          >
                            {card.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>

                          {/* Reorder Up/Down */}
                          <button 
                            onClick={() => moveDashboardCard(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button 
                            onClick={() => moveDashboardCard(index, 'down')}
                            disabled={index === dashboardCards.length - 1}
                            className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: APPEARANCE */}
              {activeTabPanel === 'appearance' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Theme Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tema Base</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setDarkMode(false)}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          !darkMode ? 'border-indigo-650 bg-indigo-50/20 text-indigo-750' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-500'
                        }`}
                      >
                        <Sun size={15} /> Modolar Claro
                      </button>
                      <button 
                        onClick={() => setDarkMode(true)}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          darkMode ? 'border-indigo-500 bg-indigo-950/20 text-indigo-350' : 'border-slate-205 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <Moon size={15} /> Modolar Escuro
                      </button>
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cor de Destaque (Accent)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'indigo', name: 'Índigo', bg: 'bg-indigo-600' },
                        { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-600' },
                        { id: 'rose', name: 'Rosa Copa', bg: 'bg-rose-500' },
                        { id: 'amber', name: 'Dourado', bg: 'bg-amber-500' },
                        { id: 'sky', name: 'Céu Azul', bg: 'bg-sky-500' },
                        { id: 'violet', name: 'Violeta', bg: 'bg-violet-650' },
                        { id: 'orange', name: 'Laranja', bg: 'bg-orange-500' },
                        { id: 'rose_red', name: 'Vermelho CBF', bg: 'bg-red-600' }
                      ].map((col) => (
                        <button 
                          key={col.id}
                          onClick={() => setSystemAccentColor(col.id)}
                          className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all text-center cursor-pointer ${
                            systemAccentColor === col.id ? 'border-slate-900 dark:border-white' : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/10'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${col.bg} block shrink-0`} />
                          <span className="text-[9px] text-slate-500 tracking-tight">{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tamanho do Texto (Fonte)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small', label: 'Compacta', size: 'text-xs' },
                        { id: 'normal', label: 'Padrão', size: 'text-sm' },
                        { id: 'large', label: 'Ampliada', size: 'text-base' }
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setFontSize(item.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center cursor-pointer ${
                            fontSize === item.id ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-150 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                          }`}
                        >
                          <span className={`${item.size} font-bold font-display uppercase`}>Aa</span>
                          <span className="text-[9px] tracking-wider mt-0.5 opacity-80">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compact Sidebar Width */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                    <div>
                      <span className="font-bold block">Menu Lateral Super Compacto</span>
                      <span className="text-[10px] text-slate-400 leading-3">Oculta textos da barra lateral, mantendo apenas ícones</span>
                    </div>
                    <button 
                      onClick={() => setCompactSidebar(!compactSidebar)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        compactSidebar ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ${
                        compactSidebar ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Disable Animations */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                    <div>
                      <span className="font-bold block">Ativar Transições Médias</span>
                      <span className="text-[10px] text-slate-400 leading-3">Habilita animações suaves e layouts de balanço</span>
                    </div>
                    <button 
                      onClick={() => setEnableAnimations(!enableAnimations)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        enableAnimations ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ${
                        enableAnimations ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                </div>
              )}

              {/* SECTION: PREFERENCES */}
              {activeTabPanel === 'preferences' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-bold block">Notificações Inteligentes</span>
                      <span className="text-[10px] text-slate-400 leading-3">Receba avisos de gols e eventos no rodapé</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifsEnabled}
                      onChange={(e) => setNotifsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-bold block">Efeitos de Som (Vibe)</span>
                      <span className="text-[10px] text-slate-400 leading-3">Gera apitos e alertas em botões chave</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={soundsEnabled}
                      onChange={(e) => setSoundsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-bold block">Lembretes Automáticos</span>
                      <span className="text-[10px] text-slate-400 leading-3">Re-sincronizar lembretes todas as manhãs</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoReminders}
                      onChange={(e) => setAutoReminders(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Formato de Data de Preferência</label>
                    <select 
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="DD/MM/YYYY">Dia/Mês/Ano (DD/MM/AAAA)</option>
                      <option value="YYYY-MM-DD">Mundial (AAAA-MM-DD)</option>
                      <option value="MM/DD/YYYY">Americano (MM/DD/AAAA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Idioma de Interface</label>
                    <select 
                      value={appLanguage}
                      onChange={(e) => setAppLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="pt">Português (Brasil • PADRÃO)</option>
                      <option value="en">English (Estados Unidos)</option>
                      <option value="es">Español (América Latina)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fuso Horário</label>
                    <select 
                      value={timezoneSec}
                      onChange={(e) => setTimezoneSec(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="GMT-3">Brasília Time (BRT • GMT-3)</option>
                      <option value="GMT">Greenwich Mean Time (GMT)</option>
                      <option value="GMT-5">Eastern Standard Time (EST • GMT-5)</option>
                      <option value="GMT+1">Paris / Berlim (CET • GMT+1)</option>
                    </select>
                  </div>

                </div>
              )}

              {/* SECTION: DATA BACKUP/EXPORT */}
              {activeTabPanel === 'data' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900 rounded-2xl">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                      <Database size={14} /> Motor de Persistência Local
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed leading-4">
                      Todos os dados ficam guardados no cache do navegador (localStorage) para máxima velocidade e segurança offline. Importe ou grave backups JSON no seu disco.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {/* Export Card */}
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-xs block">Exportar Backup Completo</span>
                        <span className="text-[10px] text-slate-400">Gravar histórico financeiro, bíblia, notas e rotina</span>
                      </div>
                      <button 
                        onClick={() => {
                          try {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                            const downloadAnchor = document.createElement('a');
                            downloadAnchor.setAttribute("href", dataStr);
                            downloadAnchor.setAttribute("download", `meu_painel_de_vida_backup_${new Date().toISOString().split('T')[0]}.json`);
                            document.body.appendChild(downloadAnchor);
                            downloadAnchor.click();
                            downloadAnchor.remove();
                            showBanner('Backup JSON baixado!');
                          } catch (e) {
                            alert('Erro ao exportar backup');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-xl text-xs cursor-pointer shadow-xs active:scale-95 transition-all text-center"
                      >
                        <Download size={13} /> Exportar (.JSON)
                      </button>
                    </div>

                    {/* Import Card */}
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-xs block">Importar Cópia de Segurança</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Sobrescreve suas tabelas usando backup prévio</span>
                      </div>
                      <div>
                        <input 
                          type="file" 
                          id="import_file_drawer"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const fileReader = new FileReader();
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              fileReader.onload = (readerEv) => {
                                try {
                                  const content = readerEv.target?.result;
                                  if (typeof content !== 'string') throw new Error();
                                  const parsed = JSON.parse(content);
                                  onImport(parsed);
                                  showBanner('Dados importados com sucesso!');
                                } catch (e) {
                                  alert('Arquivo inválido ou corrompido.');
                                }
                              };
                              fileReader.readAsText(files[0]);
                            }
                          }}
                        />
                        <label 
                          htmlFor="import_file_drawer"
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold p-2.5 rounded-xl text-xs cursor-pointer text-center"
                        >
                          <Upload size={13} /> Subir Backup
                        </label>
                      </div>
                    </div>

                    {/* Emergency resets */}
                    <div className="p-4 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl text-xs space-y-3">
                      <span className="font-bold text-rose-800 dark:text-rose-450 block">Zona de Emergência Destrutiva</span>
                      
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => {
                            if (confirm('Deseja restaurar as abas e dados para a estrutura de amostra?')) {
                              onResetToDefaults();
                              showBanner('Estrutura original re-hidratada!');
                            }
                          }}
                          className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50/45 dark:hover:bg-rose-950/20 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Restaurar Exemplos
                        </button>

                        <button 
                          onClick={() => {
                            if (confirm('Alerta Máximo: Apagar tudo do zero de forma irreversível?')) {
                              onClearAll();
                              showBanner('Painel de vida redefinido a zero!');
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Apagar Tudo Do Zero
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SECURITY & PIN */}
              {activeTabPanel === 'security' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Lock buttons */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs block">Bloquear Painel Agora</span>
                      <span className="text-[10px] text-slate-400">Ativa a tela preta com teclado de PIN numérico</span>
                    </div>
                    <button 
                      onClick={handleManualLock}
                      className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold p-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      <Lock size={13} /> Bloquear
                    </button>
                  </div>

                  {/* PIN Configuration Form */}
                  <form onSubmit={handleUpdatePIN} className="space-y-4">
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                      <span className="font-bold text-xs block">Segurança de Desbloqueio</span>
                      
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PIN numérico de 4 dígitos</label>
                          <input 
                            type="password" 
                            maxLength={4}
                            placeholder="xxxx"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value.replace(/\D/g,''))}
                            className="bg-slate-100 dark:bg-slate-950 font-mono font-bold border border-slate-200 dark:border-slate-800 p-2 text-center rounded-xl text-md focus:border-indigo-500 focus:outline-none w-28 tracking-widest block"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pergunta de Recuperação</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Qual o ano de colação do seu pai?"
                            value={securityQuestion}
                            onChange={(e) => setSecurityQuestion(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs font-semibold rounded-xl focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resposta de Recuperação</label>
                          <input 
                            type="text" 
                            placeholder="Resposta secreta"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs font-semibold rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs rounded-xl cursor-pointer"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-center text-[10px] text-slate-400">
              <span className="font-semibold text-slate-500">LifeHub Personalizador</span> • Salva automaticamente em background
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
