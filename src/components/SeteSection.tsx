import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  User, 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Settings, 
  ChevronLeft, 
  Menu, 
  Copy, 
  Info,
  AlertTriangle,
  Star,
  LogOut,
  Sliders,
  MoreVertical,
  Download,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { PainelData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface ChatThread {
  id: string;
  title: string;
  createdAt: string; // ISO date string
  messages: Message[];
  isStarred?: boolean;
}

interface SeteSectionProps {
  data: PainelData;
  onApplyActions?: (actions: any[]) => void;
  onCloseSete?: () => void;
  siteData?: any;
  getLatestSiteData?: () => Promise<any>;
}

const WELCOME_TEXT = `Béee! Prontinho, fofura! Limpei essa conversa todinha de novo no meu rebanho! 🐑✨ Estou novinho em folha para te ouvir. O que vamos planejar juntinhos agora? Béee! 🌾

Como assistente inteligente do seu Painel de Vida, eu tenho acesso a todos os seus dados e módulos para te ajudar a manter o rebanho organizado:

*   **🛒 Lista de Compras**: Posso adicionar itens, recomendar receitas e revisar gastos.
*   **📚 Módulos e Estudos**: Monitoro suas notas escolares, matérias e prazos.
*   **📅 Calendário da Igreja**: Agendo cultos, reuniões, ensaios de louvor e muito mais.
*   **💪 Treino & Saúde**: Acompanho seus exercícios na academia.
*   **💰 Controle Financeiro**: Registro receitas, despesas e saldo atual do Marcos.

Para começar, me envie uma mensagem ou escolha um dos balões rápidos abaixo!`;

const QUICK_PROMPTS = [
  { label: '⛪ Planejar eventos da igreja', prompt: 'Ajude-me a organizar o calendário de reuniões e cultos da igreja para este mês.' },
  { label: '💰 Revisar finanças do Marcos', prompt: 'Quais foram minhas últimas despesas e qual o saldo financeiro?' },
  { label: '📚 Criar plano de estudos', prompt: 'Monte um cronograma semanal de estudos equilibrado para as minhas matérias.' },
  { label: '🛒 Receitas saudáveis', prompt: 'Com base na minha lista de compras ou receitas fofas, sugira uma refeição prática.' }
];

// Custom response parser/renderer for Markdown elements, code blocks, tables, lists
function SeteResponseRenderer({ text }: { text: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderFormattedText = (raw: string) => {
    // Process lines for code blocks, tables, lists, headers
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let currentCodeBlock: string[] = [];
    let isInsideCode = false;
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block Boundaries
      if (trimmed.startsWith('```')) {
        if (isInsideCode) {
          // Close block
          const blockContent = currentCodeBlock.join('\n');
          const blockIdx = i;
          elements.push(
            <div key={`code-${blockIdx}`} className="my-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden font-mono text-xs text-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider select-none border-b border-slate-850">
                <span>{codeLanguage || 'código'}</span>
                <button
                  onClick={() => handleCopyCode(blockContent, blockIdx)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedIndex === blockIdx ? (
                    <>
                      <Check size={11} className="text-emerald-500" />
                      <span className="text-emerald-500 font-bold lowercase">copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span className="lowercase">copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto whitespace-pre font-mono leading-relaxed select-text">
                <code>{blockContent}</code>
              </pre>
            </div>
          );
          currentCodeBlock = [];
          isInsideCode = false;
        } else {
          // Open block
          isInsideCode = true;
          codeLanguage = trimmed.substring(3).trim();
        }
        continue;
      }

      if (isInsideCode) {
        currentCodeBlock.push(line);
        continue;
      }

      // Parse Tables
      if (trimmed.startsWith('|') && i < lines.length - 1 && lines[i + 1].trim().includes('|') && lines[i + 1].trim().includes('-')) {
        // Collect all table lines
        const tableLines: string[] = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }
        i = j - 1; // skip forward

        try {
          const headers = tableLines[0].split('|').map(s => s.trim()).filter(Boolean);
          const rows = tableLines.slice(2).map(r => r.split('|').map(s => s.trim()).filter(Boolean)).filter(r => r.length > 0);

          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-800 rounded-xl max-w-full shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/80 font-bold text-slate-700 dark:text-slate-200">
                  <tr>
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-4 py-2.5 font-extrabold uppercase tracking-wide text-[10px] text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-transparent text-slate-600 dark:text-slate-350 font-medium">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5 whitespace-pre-wrap select-text">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        } catch (e) {
          // Table parsing failed, fallback
        }
      }

      // Headers formats
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-xs font-black text-slate-800 dark:text-slate-200 mt-4 mb-1.5 tracking-wider uppercase border-l-2 border-indigo-500 pl-2">
            {trimmed.substring(4)}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-sm font-black text-slate-900 dark:text-white mt-5 mb-2 border-b border-slate-100 dark:border-slate-850 pb-1">
            {trimmed.substring(3)}
          </h2>
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-base font-black text-slate-900 dark:text-white mt-6 mb-3">
            {trimmed.substring(2)}
          </h1>
        );
        continue;
      }

      // Bullet Points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-slate-700 dark:text-slate-350 text-xs sm:text-[13px] py-1.5 leading-relaxed font-semibold">
            {renderInlineMarkdown(trimmed.substring(2))}
          </li>
        );
        continue;
      }

      // Numbered Lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <li key={`num-${i}`} className="ml-5 list-decimal text-slate-700 dark:text-slate-350 text-xs sm:text-[13px] py-1.5 leading-relaxed font-semibold">
            {renderInlineMarkdown(numMatch[2])}
          </li>
        );
        continue;
      }

      // Empty lines
      if (!trimmed) {
        elements.push(<div key={`spacer-${i}`} className="h-2.5 select-none" />);
        continue;
      }

      // Standard text line
      elements.push(
        <p key={`p-${i}`} className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 py-1 font-semibold select-text">
          {renderInlineMarkdown(line)}
        </p>
      );
    }

    return <div className="space-y-0.5">{elements}</div>;
  };

  const renderInlineMarkdown = (textStr: string) => {
    let parts: React.ReactNode[] = [textStr];

    const boldRegex = /\*\*(.*?)\*\*/g;
    if (textStr.includes('**')) {
      const boldParts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(textStr)) !== null) {
        if (match.index > lastIndex) {
          boldParts.push(textStr.substring(lastIndex, match.index));
        }
        boldParts.push(
          <strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < textStr.length) {
        boldParts.push(textStr.substring(lastIndex));
      }
      parts = boldParts;
    }

    const codeRegex = /`(.*?)`/g;
    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;
      if (!part.includes('`')) return part;

      const codeParts: React.ReactNode[] = [];
      let lastIdx = 0;
      let match;
      while ((match = codeRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          codeParts.push(part.substring(lastIdx, match.index));
        }
        codeParts.push(
          <code key={match.index} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-bold select-text">
            {match[1]}
          </code>
        );
        lastIdx = codeRegex.lastIndex;
      }
      if (lastIdx < part.length) {
        codeParts.push(part.substring(lastIdx));
      }

      return <span key={pIdx}>{codeParts}</span>;
    });
  };

  return <div className="space-y-1">{renderFormattedText(text)}</div>;
}

export default function SeteSection({ data, onApplyActions, onCloseSete, siteData, getLatestSiteData }: SeteSectionProps) {
  // Threads state loaded from localStorage to protect user's data
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('lifehub_sete_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({
          ...t,
          messages: t.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
      } catch (err) {
        console.error("Falha ao reidratar fóruns de Sete:", err);
      }
    }
    
    return [{
      id: "thread-default",
      title: "Conversa com Sete ✨",
      createdAt: new Date().toISOString(),
      messages: [{
        id: 'welcome',
        role: 'assistant',
        text: "Béee! Olá Marcos fofura! 🐑 Sou o Sete, seu carneirinho inteligente. Como posso te servir hoje no seu Painel de Vida? Me dê alguma instrução!",
        timestamp: new Date()
      }]
    }];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    return localStorage.getItem('lifehub_sete_active_thread_id') || threads[0]?.id || "thread-default";
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  
  // Responsive sidebar open tracker (defaults to open on desktop, closed on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typedIndicatorText, setTypedIndicatorText] = useState('Sete está mastigando grama... 🌾');

  // Interactive popup modals
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);
  const [showRenameModalId, setShowRenameModalId] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);

  // Dropdown options (⋮) state
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Auto-rename settings state
  const [responseSpeed, setResponseSpeed] = useState<'fast' | 'normal' | 'thorough'>('normal');
  const [voiceSim, setVoiceSim] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || { id: "thread-default", title: "Conversa", messages: [] };
  const messages = activeThread.messages || [];

  // Local persistent auto save triggers
  useEffect(() => {
    localStorage.setItem('lifehub_sete_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('lifehub_sete_active_thread_id', activeThreadId);
  }, [activeThreadId]);

  useEffect(() => {
    if (threads.length > 0 && !threads.find(t => t.id === activeThreadId)) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  // Click outside listener for dropdown and sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle focus constraints and scrolling
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 50);
    }
    scrollToBottom();
  }, [activeThreadId, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

  // Bouncing custom status loader indicator
  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      'Sete está mastigando grama... 🌾',
      'Sete está acumulando lã fofinha... 🐑',
      'Sete está contando estrelinhas... ✨',
      'Sete está organizando seus registros... 🗝️',
      'Sete está integrando o rebanho... 🤝'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setTypedIndicatorText(texts[i]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Sete messaging API query pipeline
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInputMsg(''); // reset input text
      if (textInputRef.current) {
        textInputRef.current.style.height = 'auto';
      }
    }

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    
    // Auto rename new threads if title was default
    const updatedThreads = threads.map(t => {
      if (t.id === activeThread.id) {
        let newTitle = t.title;
        if (t.title === "Conversa com Sete ✨" || t.title === "Nova conversa 🐑" || t.title.startsWith("Nova conversa")) {
          newTitle = text.substring(0, 24) + (text.length > 24 ? '...' : '');
        }
        return {
          ...t,
          title: newTitle,
          messages: updatedMessages
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setIsLoading(true);

    try {
      let finalSiteData = siteData || data;
      if (getLatestSiteData) {
        try {
          finalSiteData = await getLatestSiteData();
        } catch (err) {
          console.error("Erro ao obter siteData reativo:", err);
        }
      }

      // Individual console logs for each requested module
      console.log("Estudos:", finalSiteData.estudos);
      console.log("Escola:", finalSiteData.escola);
      console.log("Treino:", finalSiteData.treino);
      console.log("Biblia:", finalSiteData.biblia);
      console.log("Galeria:", finalSiteData.galeria);
      console.log("siteData enviado para Sete:", finalSiteData);

      const response = await fetch('/api/sete/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          siteData: finalSiteData
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao obter resposta da Sete IA.');
      }

      const result = await response.json();
      const botMsg: Message = {
        id: `msg-sete-${Date.now()}`,
        role: 'assistant',
        text: result.text || '',
        timestamp: new Date()
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            messages: [...t.messages, botMsg]
          };
        }
        return t;
      }));

      if (result.actions && result.actions.length > 0 && onApplyActions) {
        onApplyActions(result.actions);
      }

    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        id: `msg-sete-err-${Date.now()}`,
        role: 'assistant',
        text: "Béee... 😢 Desculpe, fofura! Deu um nózinho na minha lã e não consegui responder agora. Pode reenviar sua mensagem para o seu carneirinho?",
        timestamp: new Date()
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            messages: [...t.messages, errMsg]
          };
        }
        return t;
      }));
    } finally {
      setIsLoading(false);
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  };

  // Threads CRUD helpers
  const createNewThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: `Nova conversa 🐑`,
      createdAt: new Date().toISOString(),
      messages: [{
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: WELCOME_TEXT,
        timestamp: new Date()
      }],
      isStarred: false
    };

    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    setSearchQuery('');
    setMoreMenuOpen(false);
  };

  const startRenameThread = (id: string, currentTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingThreadId(id);
    setEditTitleText(currentTitle);
    setMoreMenuOpen(false);
  };

  const saveThreadTitle = (id: string) => {
    if (editTitleText.trim()) {
      setThreads(threads.map(t => t.id === id ? { ...t, title: editTitleText.trim() } : t));
    }
    setEditingThreadId(null);
  };

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setThreads(threads.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t));
    setMoreMenuOpen(false);
  };

  const handleDeleteThread = (id: string) => {
    const updated = threads.filter(t => t.id !== id);
    if (updated.length === 0) {
      const defaultT: ChatThread = {
        id: "thread-default",
        title: "Conversa com Sete ✨",
        createdAt: new Date().toISOString(),
        messages: [{
          id: 'welcome',
          role: 'assistant',
          text: WELCOME_TEXT,
          timestamp: new Date()
        }],
        isStarred: false
      };
      setThreads([defaultT]);
      setActiveThreadId(defaultT.id);
    } else {
      setThreads(updated);
      if (activeThreadId === id) {
        setActiveThreadId(updated[0].id);
      }
    }
    setShowDeleteConfirmId(null);
  };

  const confirmClearActiveThread = () => {
    setThreads(threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [{
            id: `welcome-${Date.now()}`,
            role: 'assistant',
            text: "Béee! Prontinho, fofura! Limpei essa conversa todinha de novo no meu rebanho! 🐑✨ Estou novinho em folha para te ouvir. O que vamos planejar juntinhos agora? Béee! 🌾",
            timestamp: new Date()
          }]
        };
      }
      return t;
    }));
    setShowClearConfirm(false);
    setMoreMenuOpen(false);
  };

  const handleExportChat = () => {
    const headerStr = `========================================\nTRANSCRITO DE CONVERSA - SETE IA 🐑\nTema: ${activeThread.title}\nData: ${new Date(activeThread.createdAt).toLocaleDateString()}\n========================================\n\n`;
    const bodyStr = messages.map(m => {
      const roleStr = m.role === 'user' ? 'MARCOS' : 'SETE';
      const timeStr = m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `[${timeStr}] ${roleStr}:\n${m.text}\n----------------------------------------\n`;
    }).join('\n');

    const fullStr = headerStr + bodyStr;
    const blob = new Blob([fullStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sete_IA_${activeThread.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMoreMenuOpen(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMsg(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  // Filters
  const filteredThreads = threads.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (starredOnly) {
      return matchesSearch && t.isStarred;
    }
    return matchesSearch;
  });

  // Group threads chronologically
  const getCategorizedThreads = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const sevenDaysAgoStart = new Date(todayStart);
    sevenDaysAgoStart.setDate(sevenDaysAgoStart.getDate() - 7);
    
    const thirtyDaysAgoStart = new Date(todayStart);
    thirtyDaysAgoStart.setDate(thirtyDaysAgoStart.getDate() - 30);
    
    const categories: { [key: string]: { label: string; list: ChatThread[] } } = {
      today: { label: 'Hoje', list: [] },
      yesterday: { label: 'Ontem', list: [] },
      last7Days: { label: 'Últimos 7 dias', list: [] },
      last30Days: { label: 'Últimos 30 dias', list: [] },
      older: { label: 'Mais Antigas', list: [] }
    };

    filteredThreads.forEach(t => {
      const createdDate = new Date(t.createdAt);
      if (createdDate >= todayStart) {
        categories.today.list.push(t);
      } else if (createdDate >= yesterdayStart) {
        categories.yesterday.list.push(t);
      } else if (createdDate >= sevenDaysAgoStart) {
        categories.last7Days.list.push(t);
      } else if (createdDate >= thirtyDaysAgoStart) {
        categories.last30Days.list.push(t);
      } else {
        categories.older.list.push(t);
      }
    });

    return categories;
  };

  const categories = getCategorizedThreads();

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden relative select-none">
      
      {/* 1. RETRACTABLE HISTORY DRAWER (SIDEBAR) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            
            {/* Sliding Sidebar panel */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed lg:relative inset-y-0 left-0 w-[290px] sm:w-[320px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 lg:z-10 flex flex-col overflow-hidden h-full"
            >
              {/* Header inside sidebar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Histórico de Chats</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setStarredOnly(!starredOnly)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      starredOnly 
                        ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-amber-950/40 dark:border-amber-850' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 border-transparent'
                    }`}
                    title={starredOnly ? "Mostrar todas as conversas" : "Filtrar por Favoritos"}
                  >
                    <Star size={14} className={starredOnly ? "fill-amber-400" : ""} />
                  </button>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-900 dark:hover:text-white rounded-lg border border-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Search */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-850 shrink-0">
                <div className="relative flex items-center">
                  <Search size={13} className="absolute left-3 text-slate-450 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Pesquisar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200/60 dark:border-slate-800 focus:outline-none focus:border-indigo-500 select-text font-semibold text-slate-800 dark:text-white"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md">
                      <X size={12} className="text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Feed lists */}
              <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
                {Object.entries(categories).map(([key, category]) => {
                  if (category.list.length === 0) return null;
                  
                  return (
                    <div key={key} className="space-y-1">
                      <span className="px-3 text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                        {category.label}
                      </span>
                      {category.list.map(t => {
                        const isActive = t.id === activeThreadId;
                        
                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              setActiveThreadId(t.id);
                              // close sidebar on mobile
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
                              isActive 
                                ? 'bg-indigo-500/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold' 
                                : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold'
                            }`}
                          >
                            <MessageSquare size={13} className={isActive ? "text-indigo-500 shrink-0" : "text-slate-400 dark:text-slate-500 shrink-0"} />
                            
                            {editingThreadId === t.id ? (
                              <input
                                type="text"
                                value={editTitleText}
                                onChange={(e) => setEditTitleText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveThreadTitle(t.id);
                                  if (e.key === 'Escape') setEditingThreadId(null);
                                }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white dark:bg-slate-900 border border-indigo-500 px-1.5 py-0.5 rounded text-xs w-full focus:outline-none text-slate-900 dark:text-white"
                                autoFocus
                              />
                            ) : (
                              <span className="text-xs truncate flex-1 leading-tight select-text">
                                {t.title}
                              </span>
                            )}

                            {/* Actions buttons */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-auto shrink-0 transition-opacity">
                              <button
                                onClick={(e) => { e.stopPropagation(); startRenameThread(t.id, t.title, e); }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-500 hover:text-indigo-600"
                                title="Renomear"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                onClick={(e) => handleToggleStar(t.id, e)}
                                className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md ${
                                  t.isStarred ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                                }`}
                                title={t.isStarred ? "Desfavoritar" : "Favoritar"}
                              >
                                <Star size={11} className={t.isStarred ? "fill-amber-400" : ""} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirmId(t.id); }}
                                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-md text-slate-500 hover:text-rose-600"
                                title="Excluir"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {filteredThreads.length === 0 && (
                  <div className="p-8 text-center">
                    <span className="text-xs text-slate-400 italic font-medium">Nenhum chat catalogado</span>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. CHAT HERO MAIN LAYOUT (PROTAGONIST CHAT) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative min-w-0">
        
        {/* HEADER AREA - ABSOLUTELY MINIMAL */}
        <header className="h-14 border-b border-slate-100 dark:border-slate-850 px-4 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-10 select-none">
          {/* Header left - Sete brand + Online Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-wide">Sete IA</h1>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-650 dark:text-emerald-400 font-extrabold uppercase tracking-wide">Online</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block truncate max-w-[120px] sm:max-w-[200px] leading-tight">
                {activeThread.title}
              </span>
            </div>
          </div>

          {/* Header right - Nova Conversa + Mais opções (⋮) dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={createNewThread}
              className="h-9 px-3 border border-indigo-200 dark:border-indigo-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl text-indigo-650 dark:text-indigo-400 transition-all cursor-pointer text-xs font-black flex items-center gap-1 select-none active:scale-95"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Nova Conversa</span>
            </button>

            {/* Dropdown menu trigger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                  moreMenuOpen 
                    ? 'bg-slate-150 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-white' 
                    : 'border-slate-200/60 dark:border-slate-850 text-slate-555 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                title="Mais Opções"
              >
                <MoreVertical size={16} />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <button
                      onClick={() => { setSidebarOpen(true); setMoreMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Menu size={14} className="text-slate-450" />
                      <span>Histórico de Conversas</span>
                    </button>
                    <button
                      onClick={() => handleToggleStar(activeThread.id)}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Star size={14} className={activeThread.isStarred ? "text-amber-500 fill-amber-400" : "text-slate-450"} />
                      <span>{activeThread.isStarred ? 'Remover dos Favoritos' : 'Marcar como Favorito'}</span>
                    </button>
                    <button
                      onClick={() => startRenameThread(activeThread.id, activeThread.title)}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Edit3 size={14} className="text-slate-450" />
                      <span>Renomear Conversa</span>
                    </button>
                    <button
                      onClick={handleExportChat}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Download size={14} className="text-slate-450" />
                      <span>Exportar Transcrito (.txt)</span>
                    </button>
                    <button
                      onClick={() => { setShowClearConfirm(true); setMoreMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                      <span>Limpar Conversa Ativa</span>
                    </button>

                    <div className="border-t border-slate-150 dark:border-slate-800 my-1.5" />

                    <button
                      onClick={() => { setShowSettingsModal(true); setMoreMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Settings size={14} className="text-slate-450" />
                      <span>Configurações do Sete</span>
                    </button>
                    <button
                      onClick={() => { setShowHelpModal(true); setMoreMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <HelpCircle size={14} className="text-slate-450" />
                      <span>Ajuda e Exemplos</span>
                    </button>

                    {onCloseSete && (
                      <>
                        <div className="border-t border-slate-150 dark:border-slate-800 my-1.5" />
                        <button
                          onClick={onCloseSete}
                          className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 flex items-center gap-2.5 text-indigo-650 dark:text-indigo-400 font-extrabold"
                        >
                          <LogOut size={14} />
                          <span>Voltar ao Painel Geral</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MESSAGES LIST - MAX SPACE PROTAGONIST */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scroll-smooth bg-white dark:bg-slate-950 relative scrollbar-thin">
          
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              
              return (
                <motion.div
                  key={m.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar Rounded */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs select-none ${
                      isUser 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800'
                    }`}>
                      {isUser ? <User size={13} /> : '🐑'}
                    </div>

                    {/* Bubble Content Area */}
                    <div className="space-y-1">
                      <div className={`px-4.5 py-3 rounded-2xl shadow-3xs ${
                        isUser 
                          ? 'bg-indigo-600 dark:bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100/80 dark:border-slate-850/60'
                      }`}>
                        {isUser ? (
                          <p className="text-xs sm:text-[13px] leading-relaxed font-semibold whitespace-pre-wrap select-text">{m.text}</p>
                        ) : (
                          <SeteResponseRenderer text={m.text} />
                        )}
                      </div>
                      
                      {/* Timestamp display line below */}
                      <div className={`text-[9px] text-slate-450 dark:text-slate-500 select-none font-bold px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}

            {/* Quick Prompts cards if conversation has no user messages yet */}
            {messages.length <= 1 && !isLoading && (
              <div className="py-6 space-y-5">
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block uppercase">Sugestões Rápidas de Planejamento</span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">Toque em qualquer uma para testar comandos inteligentes integrados.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(qp.prompt)}
                      className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/50 dark:border-slate-800/80 hover:border-indigo-500 rounded-2xl text-left transition-all cursor-pointer font-bold active:scale-[0.99] group shadow-3xs"
                    >
                      <span className="text-xs text-slate-800 dark:text-slate-200 block truncate group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">{qp.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block truncate mt-1 leading-normal">{qp.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assistant loading typing animation indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shrink-0 select-none">
                    🐑
                  </div>
                  <div className="space-y-1">
                    <div className="px-4.5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100/80 dark:border-slate-850/60 rounded-2xl rounded-tl-none flex items-center gap-2.5 shadow-3xs">
                      {/* Bouncing Dots */}
                      <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold select-none italic leading-none">
                        {typedIndicatorText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX - FIXED AT THE BOTTOM ALWAYS VISIBLE */}
        <div className="border-t border-slate-100 dark:border-slate-850 p-4 shrink-0 bg-white dark:bg-slate-950 z-10 select-none pb-safe">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end">
              {/* Paperclip Mock / Attachment button */}
              <button
                onClick={() => {
                  setInputMsg("Ajude-me a revisar meu planejamento geral de hoje.");
                  if (textInputRef.current) textInputRef.current.focus();
                }}
                className="absolute left-2.5 bottom-2 w-8.5 h-8.5 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center text-slate-450 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Sugerir comando do rebanho"
              >
                <Paperclip size={14} />
              </button>

              <textarea
                ref={textInputRef}
                rows={1}
                value={inputMsg}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Fale com o Sete carneirinho..."
                className="w-full bg-slate-50 dark:bg-slate-900/40 text-xs sm:text-[13px] pl-13 pr-12 py-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 text-slate-800 dark:text-white resize-none font-semibold leading-relaxed max-h-40 overflow-y-auto scrollbar-none"
                disabled={isLoading}
                style={{ minHeight: '44px' }}
              />

              {/* Float send button inside textarea */}
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMsg.trim()}
                className={`absolute right-1.5 bottom-1.5 w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all ${
                  inputMsg.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:scale-103 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={13} />
              </button>
            </div>
            
            <div className="text-center mt-1.5">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold select-none leading-none block">
                O Sete é um carneirinho inteligente conectado com todas as suas metas, finanças, compras e matérias escolares.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. CONFIRMATION POPUPS AND DIALOGS */}
      <AnimatePresence>
        
        {/* A. CONFIRMAÇÃO DE LIMPEZA DE CONVERSA */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-250 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2.5 text-amber-500">
                <AlertTriangle size={20} className="stroke-[2.5px]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Limpar conversa?</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                Tem certeza que deseja apagar as mensagens desta conversa? As metas do painel, finanças e tarefas não serão alteradas.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="h-10 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClearActiveThread}
                  className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Confirmar Limpeza
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* B. CONFIRMAÇÃO DE EXCLUSÃO DE CONVERSA DO SIDEBAR */}
        {showDeleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-250 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2.5 text-rose-500">
                <Trash2 size={20} className="stroke-[2.5px]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Excluir conversa?</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                Você irá deletar este chat definitivamente do seu histórico do rebanho. Essa ação não poderá ser desfeita.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirmId(null)}
                  className="h-10 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteThread(showDeleteConfirmId)}
                  className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Excluir Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* C. MODAL DE RENOMEAR CONVERSA */}
        {editingThreadId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-250 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-500">
                <Edit3 size={18} className="stroke-[2.5px]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Renomear Conversa</h3>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Novo Título da Conversa</label>
                <input
                  type="text"
                  value={editTitleText}
                  onChange={(e) => setEditTitleText(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  placeholder="Ex: Organizar estudos..."
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingThreadId(null)}
                  className="h-10 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => saveThreadTitle(editingThreadId)}
                  className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Salvar Título
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* D. MODAL DE CONFIGURAÇÕES */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-250 dark:border-slate-800 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Settings size={18} />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Ajustes do Sete IA</h3>
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Estilo de Resposta do Sete</label>
                  <p className="text-[10px] text-slate-450 dark:text-slate-550 leading-relaxed font-bold">Por padrão, o Sete é programado para ser curto, fofo e objetivo, economizando sua leitura.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fast', 'normal', 'thorough'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setResponseSpeed(spd)}
                        className={`p-2.5 border rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer transition-all ${
                          responseSpeed === spd
                            ? 'border-indigo-600 bg-indigo-50/55 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-500 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/10'
                        }`}
                      >
                        {spd === 'fast' ? 'Super Direto' : spd === 'normal' ? 'Equilibrado' : 'Aprofundado'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black block text-slate-800 dark:text-slate-200">Simulador de Voz Fofa</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Adiciona balões com onomatopeias de carneirinho fofo nos textos.</p>
                  </div>
                  <button
                    onClick={() => setVoiceSim(!voiceSim)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${voiceSim ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform transform ${voiceSim ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Concluir Ajustes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* E. MODAL DE AJUDA */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-250 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <HelpCircle size={18} />
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Central de Ajuda - Sete IA</span>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350 leading-relaxed">
                <div className="space-y-1">
                  <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wide">Como o Sete funciona?</h4>
                  <p className="font-semibold text-slate-500 dark:text-slate-400">O Sete é integrado ao banco de dados do seu Painel de Vida. Ele consegue analisar em tempo real as tarefas pendentes, as despesas corporativas e pessoais, os eventos da igreja, o progresso da academia e as matérias de estudos cadastrados.</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wide">Exemplos de Comandos Especiais:</h4>
                  <ul className="list-disc pl-4 space-y-1 font-semibold text-slate-500 dark:text-slate-400">
                    <li><code className="text-indigo-600 dark:text-indigo-400">"Quanto gastei este mês nas minhas finanças?"</code></li>
                    <li><code className="text-indigo-600 dark:text-indigo-400">"Quais são minhas matérias com notas baixas na escola?"</code></li>
                    <li><code className="text-indigo-600 dark:text-indigo-400">"Preciso de uma receita legal para colocar na minha lista de compras."</code></li>
                    <li><code className="text-indigo-600 dark:text-indigo-400">"Quais os próximos cultos cadastrados?"</code></li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wide">Privacidade e Dados</h4>
                  <p className="font-semibold text-slate-500 dark:text-slate-400">Todas as conversas que você tem com o Sete são armazenadas com total segurança de criptografia no seu perfil no banco Firestore ou no armazenamento local do seu navegador, respeitando 100% dos seus dados.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Entendido!
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
