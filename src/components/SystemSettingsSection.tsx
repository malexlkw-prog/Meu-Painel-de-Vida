import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Download, 
  Upload as UploadIcon, 
  Trash2, 
  CheckCircle, 
  FileJson, 
  RefreshCw,
  Info,
  ShieldCheck,
  User,
  Palette,
  Bell,
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
  LayoutGrid
} from 'lucide-react';
import { PainelData } from '../types';

interface SystemSettingsSectionProps {
  data: PainelData;
  onImport: (newData: PainelData) => void;
  onResetToDefaults: () => void;
  onClearAll: () => void;
  userName?: string;
  setUserName?: (name: string) => void;
  profilePicUrl?: string;
  setProfilePicUrl?: (url: string) => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  onLockApp?: () => void;
  onSignOut?: () => void;
  onRestartOnboarding?: () => void;
  currentUserEmail?: string;
  onRestartTutorial?: () => void;
}

export default function SystemSettingsSection({
  data,
  onImport,
  onResetToDefaults,
  onClearAll,
  userName = '',
  setUserName,
  profilePicUrl = '',
  setProfilePicUrl,
  darkMode = false,
  setDarkMode,
  onLockApp,
  onSignOut,
  onRestartOnboarding,
  currentUserEmail = '',
  onRestartTutorial
}: SystemSettingsSectionProps) {
  // Navigation internal tab state (instead of duplication)
  const [activeTab, setActiveTab] = useState<'profile' | 'tabs' | 'theme' | 'preferences' | 'security' | 'backup'>('profile');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile local state
  const [name, setName] = useState(() => localStorage.getItem('meu_painel_de_vida_username') || userName || 'Usuário');
  const [nickname, setNickname] = useState(() => localStorage.getItem('lifehub_nickname') || '');
  const [statusPhrase, setStatusPhrase] = useState(() => localStorage.getItem('lifehub_status_phrase') || 'Sempre focado nos objetivos ✨');
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem('lifehub_avatar_color') || '#6366f1');

  // Appearance & Theme local state
  const [systemAccentColor, setSystemAccentColor] = useState(() => localStorage.getItem('lifehub_accent_color') || 'indigo');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('lifehub_font_size') || 'normal');
  const [compactSidebar, setCompactSidebar] = useState(() => localStorage.getItem('lifehub_compact_sidebar') === 'true');
  const [enableAnimations, setEnableAnimations] = useState(() => localStorage.getItem('lifehub_animations') !== 'false');

  // Preferences local state
  const [notifsEnabled, setNotifsEnabled] = useState(() => localStorage.getItem('lifehub_pref_notifs') !== 'false');
  const [soundsEnabled, setSoundsEnabled] = useState(() => localStorage.getItem('lifehub_pref_sounds') !== 'false');
  const [autoReminders, setAutoReminders] = useState(() => localStorage.getItem('lifehub_pref_reminders') !== 'false');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('lifehub_pref_date_format') || 'DD/MM/YYYY');
  const [appLanguage, setAppLanguage] = useState(() => localStorage.getItem('lifehub_pref_lang') || 'pt');
  const [timezoneSec, setTimezoneSec] = useState(() => localStorage.getItem('lifehub_pref_timezone') || 'GMT-3');

  // Security & PIN local state
  const [pinCode, setPinCode] = useState(() => localStorage.getItem('lifehub_pin') || localStorage.getItem('meu_painel_de_vida_pin') || '');
  const [securityQuestion, setSecurityQuestion] = useState(() => localStorage.getItem('lifehub_sec_question') || 'Qual o nome do seu primeiro animal?');
  const [securityAnswer, setSecurityAnswer] = useState(() => localStorage.getItem('lifehub_sec_answer') || '');

  // Default sidebar tabs structure
  const defaultTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Home', color: 'text-indigo-500', hidden: false, pinned: false, order: 0 },
    { id: 'sete', label: 'Sete IA', icon: 'Sparkles', color: 'text-amber-500 font-extrabold animate-pulse', hidden: false, pinned: false, order: 1 },
    { id: 'organization', label: 'Organização', icon: 'Calendar', color: 'text-cyan-500', hidden: false, pinned: false, order: 2 },
    { id: 'finance', label: 'Vida Financeira', icon: 'DollarSign', color: 'text-emerald-500', hidden: false, pinned: false, order: 3 },
    { id: 'quero_comprar', label: '👕 Quero Comprar', icon: 'ShoppingBag', color: 'text-pink-500 font-extrabold', hidden: false, pinned: false, order: 4 },
    { id: 'studies', label: 'Estudos', icon: 'GraduationCap', color: 'text-violet-500', hidden: false, pinned: false, order: 5 },
    { id: 'gym', label: 'Treino', icon: 'Dumbbell', color: 'text-rose-500', hidden: false, pinned: false, order: 5.5 },
    { id: 'bible', label: 'Igreja', icon: 'Book', color: 'text-amber-500', hidden: false, pinned: false, order: 6 },
    { id: 'catalogs', label: 'Catálogos', icon: 'Folder', color: 'text-indigo-500 font-extrabold', hidden: false, pinned: false, order: 6.5 },
    { id: 'entertainment', label: 'Entretenimento', icon: 'Film', color: 'text-pink-500', hidden: false, pinned: false, order: 7 },
    { id: 'system', label: 'Sistema', icon: 'Settings', color: 'text-slate-500', hidden: false, pinned: false, order: 8 }
  ];

  const [tabsList, setTabsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('lifehub_tabs_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validIds = new Set(defaultTabs.map(t => t.id));
          const filtered = parsed.filter((p: any) => validIds.has(p.id));
          const parsedIds = new Set(filtered.map((p: any) => p.id));
          const missing = defaultTabs.filter(d => !parsedIds.has(d.id));
          return [...filtered, ...missing].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      } catch (e) {}
    }
    return defaultTabs;
  });

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4500);
  };

  // Sync state prop updates
  useEffect(() => {
    if (userName) setName(userName);
  }, [userName]);

  // Profiles updates
  const handleSaveProfile = () => {
    localStorage.setItem('meu_painel_de_vida_username', name);
    localStorage.setItem('lifehub_nickname', nickname);
    localStorage.setItem('lifehub_status_phrase', statusPhrase);
    localStorage.setItem('lifehub_avatar_color', avatarColor);
    if (setUserName) setUserName(name);
    window.dispatchEvent(new Event('lifehub_profile_update'));
    triggerSuccess('Perfil salvo com sucesso!');
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          localStorage.setItem('meu_painel_de_vida_profile_pic', reader.result);
          if (setProfilePicUrl) setProfilePicUrl(reader.result);
          window.dispatchEvent(new Event('lifehub_profile_update'));
          triggerSuccess('Foto de perfil atualizada!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePic = () => {
    localStorage.removeItem('meu_painel_de_vida_profile_pic');
    if (setProfilePicUrl) setProfilePicUrl('');
    window.dispatchEvent(new Event('lifehub_profile_update'));
    triggerSuccess('Foto de perfil removida!');
  };

  // Tab Menu customized updates
  const saveTabs = (newList: any[]) => {
    const ordered = newList.map((t, idx) => ({ ...t, order: idx }));
    setTabsList(ordered);
    localStorage.setItem('lifehub_tabs_config', JSON.stringify(ordered));
    window.dispatchEvent(new Event('lifehub_sidebar_reorder'));
  };

  const moveTab = (index: number, direction: 'up' | 'down') => {
    const newList = [...tabsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newList.length) {
      const temp = newList[index];
      newList[index] = newList[targetIndex];
      newList[targetIndex] = temp;
      saveTabs(newList);
      triggerSuccess('Ordem de abas atualizada!');
    }
  };

  const toggleTabHide = (id: string) => {
    const newList = tabsList.map(t => t.id === id ? { ...t, hidden: !t.hidden } : t);
    saveTabs(newList);
    triggerSuccess('Visibilidade de aba atualizada!');
  };

  const toggleTabPin = (id: string) => {
    const newList = tabsList.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t);
    saveTabs(newList);
    triggerSuccess('Status de fixação atualizado!');
  };

  const handleRenameTab = (id: string, newLabel: string) => {
    const newList = tabsList.map(t => t.id === id ? { ...t, label: newLabel } : t);
    saveTabs(newList);
  };

  const handleResetTabs = () => {
    saveTabs(defaultTabs);
    triggerSuccess('Abas de navegação restauradas!');
  };

  // Theme Visual changes
  const changeAccentColor = (color: string) => {
    setSystemAccentColor(color);
    localStorage.setItem('lifehub_accent_color', color);
    document.documentElement.setAttribute('data-accent-color', color);
    window.dispatchEvent(new Event('lifehub_appearance_update'));
    triggerSuccess('Cor de destaque atualizada!');
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem('lifehub_font_size', size);
    const bodyClass = document.body.classList;
    bodyClass.remove('text-xs', 'text-sm', 'text-base', 'text-lg');
    if (size === 'small') bodyClass.add('text-xs');
    else if (size === 'large') bodyClass.add('text-base');
    else bodyClass.add('text-sm');
    window.dispatchEvent(new Event('lifehub_appearance_update'));
    triggerSuccess('Tamanho de fonte atualizado!');
  };

  const toggleCompactSidebar = () => {
    const next = !compactSidebar;
    setCompactSidebar(next);
    localStorage.setItem('lifehub_compact_sidebar', next.toString());
    window.dispatchEvent(new Event('lifehub_sidebar_toggle'));
    triggerSuccess(next ? 'Menu lateral compactado!' : 'Menu lateral padrão!');
  };

  const toggleAnimations = () => {
    const next = !enableAnimations;
    setEnableAnimations(next);
    localStorage.setItem('lifehub_animations', next.toString());
    triggerSuccess(next ? 'Transições habilitadas!' : 'Transições simplificadas!');
  };

  // Preferences toggles
  const handlePrefChange = (key: string, value: string | boolean) => {
    localStorage.setItem(key, value.toString());
    triggerSuccess('Configuração atualizada com sucesso!');
  };

  // PIN security
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode && (pinCode.length !== 4 || isNaN(Number(pinCode)))) {
      triggerError('O PIN deve conter exatamente 4 números!');
      return;
    }
    localStorage.setItem('lifehub_pin', pinCode);
    localStorage.setItem('meu_painel_de_vida_pin', pinCode);
    localStorage.setItem('lifehub_sec_question', securityQuestion);
    localStorage.setItem('lifehub_sec_answer', securityAnswer);
    triggerSuccess('Segurança salva com sucesso!');
  };

  // Backup JSON actions
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `meu_painel_de_vida_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerSuccess('Backup JSON exportado com sucesso!');
    } catch (e) {
      triggerError('Erro ao exportar backup.');
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (e) => {
      try {
        const fileContent = e.target?.result;
        if (typeof fileContent !== 'string') throw new Error('Formato incompatível');
        const parsedContent = JSON.parse(fileContent);

        if (
          !parsedContent.shoppingList || 
          !parsedContent.tasks || 
          !parsedContent.schedule || 
          !parsedContent.studies || 
          !parsedContent.media || 
          !parsedContent.music || 
          !parsedContent.bible || 
          !parsedContent.reminders || 
          !parsedContent.finance
        ) {
          throw new Error('Arquivo de backup inválido.');
        }

        onImport(parsedContent);
        triggerSuccess('Backup importado com sucesso!');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        triggerError(`Falha na importação: ${err?.message || 'JSON inválido'}`);
      }
    };
    fileReader.readAsText(files[0]);
  };

  return (
    <div className="space-y-6 w-full text-slate-800 dark:text-slate-100 font-sans">
      {/* Dynamic Sub-tab navigation specifically inside system page with proper contrast styling */}
      <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold uppercase select-none w-full border border-slate-200/50 dark:border-slate-700/80">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'profile' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <User size={14} /> <span>👤 Perfil</span>
        </button>
        <button 
          onClick={() => setActiveTab('tabs')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tabs' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Star size={14} /> <span>🎨 Menu & Abas</span>
        </button>
        <button 
          onClick={() => setActiveTab('theme')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'theme' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Palette size={14} /> <span>🌓 Aparência</span>
        </button>
        <button 
          onClick={() => setActiveTab('preferences')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'preferences' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bell size={14} /> <span>⚙️ Preferências</span>
        </button>
        <button 
          onClick={() => setActiveTab('security')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'security' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Lock size={14} /> <span>🔒 Segurança</span>
        </button>
        <button 
          onClick={() => setActiveTab('backup')} 
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'backup' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ShieldCheck size={14} /> <span>💾 Backup & Dados</span>
        </button>
      </div>

      {/* Success / Error alerts */}
      <AnimatePresence mode="wait">
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-350 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-350 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <Info size={15} className="text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-6 max-w-2xl mx-auto shadow-sm">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                👤 Editar Perfil de Usuário
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Personalize as credenciais exibidas na interface do Hub e configure sua identidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Apelido (Opcional)</label>
                  <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Apelido curto"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Frase de Status / Vibe</label>
                  <input 
                    type="text" 
                    value={statusPhrase} 
                    onChange={(e) => setStatusPhrase(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Seu status ou foco"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Foto de Perfil</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-550 shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      {profilePicUrl ? (
                        <img src={profilePicUrl} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-black" style={{ color: avatarColor }}>{name[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all active:scale-95 shadow-xs inline-block text-center">
                          Carregar Foto
                          <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                        </label>
                        {profilePicUrl && (
                          <button 
                            onClick={handleRemoveProfilePic}
                            className="border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 font-bold px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Cor do Avatar (Fallback)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#64748b'].map((hex) => (
                      <button 
                        key={hex}
                        onClick={() => setAvatarColor(hex)}
                        className="w-7 h-7 rounded-full border-2 transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
                        style={{ 
                          backgroundColor: hex,
                          borderColor: avatarColor === hex ? '#000000' : 'transparent'
                        }}
                      >
                        {avatarColor === hex && <Check size={11} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-2xl text-xs shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Salvar Informações do Perfil
              </button>
            </div>

            {/* Seção Adicional de Conta & Sessão */}
            {(onSignOut || onRestartOnboarding) && (
              <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800 text-left space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">🛡️ Conta & Sessão de Usuário</h4>
                  <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                    Gerencie sua sessão ativa e o seu painel pessoal. Seus dados estão salvos de forma 100% segura na nuvem.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {onRestartOnboarding && (
                    <button
                      onClick={onRestartOnboarding}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-stone-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center active:scale-95"
                    >
                      🐑 Reiniciar Assistente da Sete
                    </button>
                  )}
                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="flex-1 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-450 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-rose-100 dark:border-rose-950 cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      Sair da Minha Conta
                    </button>
                  )}
                </div>

                {currentUserEmail && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center select-none pt-1">
                    Conectado como <span className="font-semibold text-slate-500 dark:text-slate-400">{currentUserEmail}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIDEBAR MENU CUSTOMIZATION (The hiding/show tabs!) */}
        {activeTab === 'tabs' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-5 max-w-2xl mx-auto shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Star size={16} className="text-amber-500 fill-amber-500" /> Abas de Menu Personalizadas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Ordene, renomeie, oculte ou fixe as abas do menu de navegação do seu painel lateral.
                </p>
              </div>
              <button 
                onClick={handleResetTabs}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold"
              >
                <RotateCcw size={12} /> Padrão
              </button>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {tabsList.map((item, index) => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                    item.hidden ? 'opacity-40 bg-slate-100/50 dark:bg-slate-950/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.pinned ? 'bg-indigo-600' : 'bg-transparent border border-slate-300 dark:border-slate-600'}`} />
                    <span className={`${item.color} font-black shrink-0`}>●</span>
                    <input 
                      type="text" 
                      value={item.label} 
                      onChange={(e) => handleRenameTab(item.id, e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-550 focus:outline-none py-0.5 px-1 font-bold text-slate-800 dark:text-white flex-1 text-xs outline-none"
                      placeholder="Nome da Aba"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Pin/Unpin Toggle */}
                    <button 
                      onClick={() => toggleTabPin(item.id)}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        item.pinned 
                          ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={item.pinned ? 'Desafixar do topo' : 'Fixar no topo'}
                    >
                      <Star size={13} fill={item.pinned ? 'currentColor' : 'none'} />
                    </button>

                    {/* Hide/Show Toggle */}
                    <button 
                      onClick={() => toggleTabHide(item.id)}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        item.hidden 
                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={item.hidden ? 'Exibir aba' : 'Ocultar aba'}
                    >
                      {item.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>

                    {/* Reorder Up/Down */}
                    <button 
                      onClick={() => moveTab(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button 
                      onClick={() => moveTab(index, 'down')}
                      disabled={index === tabsList.length - 1}
                      className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: THEME & VISUAL (Aparência) */}
        {activeTab === 'theme' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-6 max-w-2xl mx-auto shadow-sm text-left">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                🌓 Aparência, Cores & Visual
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize a identidade visual, modos de luz e fontes do seu sistema de controle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Dark/Light Theme Switch */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tema Base</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        if (setDarkMode) setDarkMode(false);
                        localStorage.setItem('meu_painel_de_vida_dark', 'false');
                        window.dispatchEvent(new Event('lifehub_appearance_update'));
                        triggerSuccess('Modo claro ativado!');
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        !darkMode 
                          ? 'border-indigo-600 bg-indigo-50/20 text-indigo-750' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      <Sun size={14} className="text-amber-500" /> Modo Claro
                    </button>
                    <button 
                      onClick={() => {
                        if (setDarkMode) setDarkMode(true);
                        localStorage.setItem('meu_painel_de_vida_dark', 'true');
                        window.dispatchEvent(new Event('lifehub_appearance_update'));
                        triggerSuccess('Modo escuro ativado!');
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        darkMode 
                          ? 'border-indigo-550 bg-indigo-950/20 text-indigo-350' 
                          : 'border-slate-200 hover:bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Moon size={14} className="text-violet-400" /> Modo Escuro
                    </button>
                  </div>
                </div>

                {/* Accent Color picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cor de Destaque (Accent)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'indigo', name: 'Índigo', bg: 'bg-indigo-600' },
                      { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-600' },
                      { id: 'rose', name: 'Rosa Copa', bg: 'bg-rose-500' },
                      { id: 'amber', name: 'Dourado', bg: 'bg-amber-500' },
                      { id: 'sky', name: 'Céu Azul', bg: 'bg-sky-500' },
                      { id: 'violet', name: 'Violeta', bg: 'bg-violet-600' },
                      { id: 'orange', name: 'Laranja', bg: 'bg-orange-500' },
                      { id: 'rose_red', name: 'Vermelho', bg: 'bg-red-600' }
                    ].map((col) => (
                      <button 
                        key={col.id}
                        onClick={() => changeAccentColor(col.id)}
                        className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 hover:scale-105 transition-all text-center cursor-pointer ${
                          systemAccentColor === col.id 
                            ? 'border-indigo-650 bg-indigo-50/10 dark:border-indigo-550' 
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${col.bg} block shrink-0`} />
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans tracking-tight truncate max-w-[55px]">{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Font size */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tamanho do Texto (Fonte)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'small', label: 'Compacta', size: 'text-xs' },
                      { id: 'normal', label: 'Padrão', size: 'text-sm' },
                      { id: 'large', label: 'Ampliada', size: 'text-base' }
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => changeFontSize(item.id)}
                        className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center cursor-pointer ${
                          fontSize === item.id 
                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 dark:text-indigo-400' 
                            : 'border-slate-150 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        <span className={`${item.size} font-black font-sans uppercase`}>Aa</span>
                        <span className="text-[9px] tracking-wider mt-0.5 opacity-80">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold block">Menu Lateral Super Compacto</span>
                    <span className="text-[10px] text-slate-400 leading-3 block mt-0.5">Oculta textos, mantendo apenas ícones na lateral</span>
                  </div>
                  <button 
                    onClick={toggleCompactSidebar}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      compactSidebar ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ${
                      compactSidebar ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Animations switch */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold block">Ativar Transições Médias</span>
                    <span className="text-[10px] text-slate-400 leading-3 block mt-0.5">Ativa transições suaves e efeitos de layout</span>
                  </div>
                  <button 
                    onClick={toggleAnimations}
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
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-6 max-w-2xl mx-auto shadow-sm text-left">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                ⚙️ Preferências Gerais de Sistema
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ajuste os parâmetros de relógios, idiomas, sons e alertas do painel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/20">
                  <div>
                    <span className="font-bold block">Notificações Inteligentes</span>
                    <span className="text-[10px] text-slate-400 leading-3 block mt-0.5">Receba avisos visuais no rodapé da aplicação</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifsEnabled}
                    onChange={(e) => {
                      setNotifsEnabled(e.target.checked);
                      handlePrefChange('lifehub_pref_notifs', e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/20">
                  <div>
                    <span className="font-bold block">Efeitos de Som (Vibe)</span>
                    <span className="text-[10px] text-slate-400 leading-3 block mt-0.5">Gera cliques discretos ao pressionar botões</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={soundsEnabled}
                    onChange={(e) => {
                      setSoundsEnabled(e.target.checked);
                      handlePrefChange('lifehub_pref_sounds', e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/20">
                  <div>
                    <span className="font-bold block">Sincronização de Alertas</span>
                    <span className="text-[10px] text-slate-400 leading-3 block mt-0.5">Recarrega e sincroniza lembretes todas as manhãs</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoReminders}
                    onChange={(e) => {
                      setAutoReminders(e.target.checked);
                      handlePrefChange('lifehub_pref_reminders', e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Formato de Data</label>
                  <select 
                    value={dateFormat}
                    onChange={(e) => {
                      setDateFormat(e.target.value);
                      handlePrefChange('lifehub_pref_date_format', e.target.value);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  >
                    <option value="DD/MM/YYYY">Dia/Mês/Ano (DD/MM/AAAA)</option>
                    <option value="YYYY-MM-DD">Padrão Internacional (AAAA-MM-DD)</option>
                    <option value="MM/DD/YYYY">Estilo Americano (MM/DD/AAAA)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Idioma Local</label>
                  <select 
                    value={appLanguage}
                    onChange={(e) => {
                      setAppLanguage(e.target.value);
                      handlePrefChange('lifehub_pref_lang', e.target.value);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  >
                    <option value="pt">Português (Brasil • Padrão)</option>
                    <option value="en">English (US)</option>
                    <option value="es">Español (América Latina)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fuso Horário</label>
                  <select 
                    value={timezoneSec}
                    onChange={(e) => {
                      setTimezoneSec(e.target.value);
                      handlePrefChange('lifehub_pref_timezone', e.target.value);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  >
                    <option value="GMT-3">Brasília Time (BRT • GMT-3)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="GMT-5">Eastern Standard Time (EST • GMT-5)</option>
                    <option value="GMT+1">Paris / Berlim (CET • GMT+1)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção Tutorial Sete */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
                  🐑 Tutorial de Primeiro Acesso
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gostaria de ver o carneirinho Sete apresentar todos os módulos e abas do aplicativo novamente?
                </p>
              </div>
              <button
                type="button"
                onClick={onRestartTutorial}
                className="w-full md:w-auto px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all border border-indigo-100/80 dark:border-indigo-900/50 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>📖 Refazer Tutorial</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PIN & SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-5 max-w-xl mx-auto shadow-sm text-left">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                🔒 Controle de PIN & Bloqueio Local
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure segurança contra olhares curiosos salvando um PIN pessoal e pergunta de segurança.
              </p>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">PIN de Bloqueio (4 Números)</label>
                <input 
                  type="password" 
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 text-center text-lg font-black tracking-widest rounded-2xl outline-none text-slate-800 dark:text-white focus:border-indigo-500"
                  placeholder="Ex: 1234"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Pergunta de Resgate</label>
                  <input 
                    type="text" 
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 dark:text-white"
                    placeholder="Pergunta de segurança"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Resposta de Segurança</label>
                  <input 
                    type="text" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 dark:text-white"
                    placeholder="Sua resposta"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Salvar Parâmetros de Segurança
                </button>
              </div>
            </form>

            {onLockApp && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-150 dark:border-slate-800 flex justify-between items-center mt-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block">Bloquear Painel de Vida</span>
                  <span className="text-[10px] text-slate-400">Forçar retorno imediato para a tela de bloqueio local</span>
                </div>
                <button 
                  onClick={onLockApp}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer active:scale-95"
                >
                  Bloquear Agora
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: BACKUP & DATA RESET */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backup Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm text-left">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileJson size={16} className="text-indigo-500" /> Exportação de Backup (.JSON)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Para garantir a segurança de todos os seus registros diários, finanças, compras ou reflexões, baixe a cópia compactada local em formato JSON.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Download size={14} /> Exportar Backup (.JSON)
                  </button>
                </div>
              </div>

              {/* Import JSON Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm text-left">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <UploadIcon size={16} className="text-emerald-500" /> Importar Backup
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Selecione um arquivo JSON de segurança exportado anteriormente para restaurar todas as tabelas locais. Esta ação sobrescreve os dados atuais.
                </p>

                <div className="pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportFile}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    <UploadIcon size={14} /> Upload de Backup (.JSON)
                  </button>
                </div>
              </div>

              {/* Storage diagnostics */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm text-left">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Diagnóstico de Armazenamento
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                    <span>Mecanismo do Banco:</span>
                    <span className="font-bold text-emerald-500">Local Cache (localStorage)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
                    <span>Espaço Ocupado Estimado:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                      {Math.round(JSON.stringify(data).length / 1024)} KB / 5120 KB
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-slate-600 dark:text-slate-400">
                    <span>Offline:</span>
                    <span className="font-bold text-emerald-500">100% Ativo Offline</span>
                  </div>
                </div>
              </div>

              {/* Destructive recovery panel */}
              <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/50 rounded-2xl p-5 md:p-6 space-y-4 text-left">
                <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-rose-100 dark:border-rose-900 pb-2">
                  <Trash2 size={16} /> Zona de Limpeza de Emergência
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Use os comandos abaixo se as tabelas locais ficarem lentas, vazias, ou se quiser limpar os testes.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if(confirm('Tem certeza que deseja restaurar os exemplos padrão? Todo progresso não exportado em JSON será perdido.')) {
                        onResetToDefaults();
                        triggerSuccess('Dados restaurados para o padrão de fábrica!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 border border-rose-200 dark:border-rose-800 hover:bg-rose-100/40 text-rose-700 dark:text-rose-450 font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} /> Restaurar Exemplos
                  </button>
                  <button
                    onClick={() => {
                      if(confirm('ATENÇÃO: Deseja apagar ABSOLUTAMENTE tudo e começar o Hub do zero?')) {
                        onClearAll();
                        triggerSuccess('Banco de dados completamente limpo!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Trash2 size={13} /> Limpar Tudo (Do zero)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
