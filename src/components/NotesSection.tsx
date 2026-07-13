import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Search, 
  ChevronLeft, 
  Sparkles,
  Check,
  Pin,
  Star,
  Folder,
  FolderPlus,
  Tag,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link2,
  History,
  Paperclip,
  X,
  PlusCircle,
  Eye,
  FileDown
} from 'lucide-react';
import { NoteEntry } from '../types';

interface NotesSectionProps {
  notes: NoteEntry[];
  onAddNote: (note: Omit<NoteEntry, 'id' | 'createdAt'>) => void;
  onUpdateNote: (note: NoteEntry) => void;
  onDeleteNote: (id: string) => void;
  onCloseNotes?: () => void;
}

const NOTE_COLORS = [
  { id: 'yellow', name: 'Amarelo Quente', bg: 'bg-amber-50/90 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300' },
  { id: 'purple', name: 'Lilás Suave', bg: 'bg-violet-50/90 dark:bg-violet-950/20 border-violet-200/60 dark:border-violet-900/40 text-violet-900 dark:text-violet-355' },
  { id: 'emerald', name: 'Verde Chá', bg: 'bg-emerald-50/90 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-300' },
  { id: 'blue', name: 'Azul Gelado', bg: 'bg-blue-50/90 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-300' },
  { id: 'rose', name: 'Rosa Pastel', bg: 'bg-rose-50/90 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-300' },
  { id: 'slate', name: 'Papel Pleno', bg: 'bg-white/95 dark:bg-slate-900/90 border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-200' }
];

const DEFAULT_FOLDERS = ['Notas Pessoais', 'Trabalho', 'Estudos', 'Papelaria Artesanal', 'Ideias Criativas'];

export default function NotesSection({ notes, onAddNote, onUpdateNote, onDeleteNote, onCloseNotes }: NotesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('Todas');
  const [customFolders, setCustomFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem('notes_custom_folders');
    return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
  });
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Rich-text editor reference
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Track notes count to auto-select newly added notes
  const [prevNotesCount, setPrevNotesCount] = useState(notes.length);

  // Active selected note
  const activeNote = notes.find(n => n.id === activeNoteId);

  // Sync folders to localstorage
  useEffect(() => {
    localStorage.setItem('notes_custom_folders', JSON.stringify(customFolders));
  }, [customFolders]);

  // Auto-select newly created note
  useEffect(() => {
    if (notes.length > prevNotesCount) {
      const sorted = [...notes].sort((a, b) => {
        const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dB - dA;
      });
      if (sorted.length > 0) {
        setActiveNoteId(sorted[0].id);
        setShowMobileEditor(true);
      }
    }
    setPrevNotesCount(notes.length);
  }, [notes, prevNotesCount]);

  // Sync selected note html content to editor element without cursor jumping
  useEffect(() => {
    if (editorRef.current && activeNote) {
      // Set editor innerHTML ONLY if it's different from the note content
      // to avoid resetting the cursor position on keystroke
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content || '';
      }
    }
  }, [activeNoteId]); // Only trigger when we switch notes!

  // Formatting helpers
  const applyCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleEditorInput = () => {
    if (editorRef.current && activeNote) {
      const updatedHtml = editorRef.current.innerHTML;
      
      // Smart throttle snapshot capture for history
      let updatedHistory = [...(activeNote.history || [])];
      const now = new Date();
      const lastSnapshot = updatedHistory[0];
      
      // Save snapshot every 30 seconds if changed
      if (!lastSnapshot || (now.getTime() - new Date(lastSnapshot.timestamp).getTime() > 30000)) {
        updatedHistory = [
          { timestamp: now.toISOString(), content: activeNote.content, title: activeNote.title },
          ...updatedHistory.slice(0, 19) // Keep last 20 snapshots
        ];
      }

      onUpdateNote({
        ...activeNote,
        content: updatedHtml,
        history: updatedHistory,
        lastEditedAt: now.toISOString()
      });
    }
  };

  const handleTitleChange = (val: string) => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        title: val,
        lastEditedAt: new Date().toISOString()
      });
    }
  };

  const handleColorChange = (colorBg: string) => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        color: colorBg,
        lastEditedAt: new Date().toISOString()
      });
    }
  };

  const handleTogglePin = () => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        pinned: !activeNote.pinned,
        lastEditedAt: new Date().toISOString()
      });
    }
  };

  const handleToggleFavorite = () => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        favorite: !activeNote.favorite,
        lastEditedAt: new Date().toISOString()
      });
    }
  };

  const handleFolderChange = (folder: string) => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        folder,
        lastEditedAt: new Date().toISOString()
      });
    }
  };

  // Add custom folder
  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    if (!customFolders.includes(newFolderName.trim())) {
      setCustomFolders([...customFolders, newFolderName.trim()]);
    }
    setNewFolderName('');
    setShowFolderForm(false);
  };

  // Delete custom folder
  const handleDeleteFolder = (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Deseja excluir a pasta "${folderName}"? As notas nela contidas serão movidas para "Notas Pessoais".`)) {
      setCustomFolders(customFolders.filter(f => f !== folderName));
      // Re-assign folder for notes in the deleted folder
      notes.forEach(note => {
        if (note.folder === folderName) {
          onUpdateNote({ ...note, folder: 'Notas Pessoais' });
        }
      });
      if (selectedFolder === folderName) {
        setSelectedFolder('Todas');
      }
    }
  };

  // Add tag to active note
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNote || !newTagInput.trim()) return;
    const currentTags = activeNote.tags || [];
    const formattedTag = newTagInput.trim().toLowerCase().replace('#', '');
    if (!currentTags.includes(formattedTag)) {
      onUpdateNote({
        ...activeNote,
        tags: [...currentTags, formattedTag],
        lastEditedAt: new Date().toISOString()
      });
    }
    setNewTagInput('');
  };

  // Remove tag from active note
  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeNote) return;
    const currentTags = activeNote.tags || [];
    onUpdateNote({
      ...activeNote,
      tags: currentTags.filter(t => t !== tagToRemove),
      lastEditedAt: new Date().toISOString()
    });
  };

  // Create new blank note
  const handleAddNewNote = () => {
    onAddNote({
      title: 'Nota Sem Título',
      content: '<div>Comece a digitar aqui...</div>',
      color: NOTE_COLORS[0].bg,
      pinned: false,
      favorite: false,
      folder: selectedFolder !== 'Todas' && selectedFolder !== 'Fixadas' && selectedFolder !== 'Favoritas' ? selectedFolder : 'Notas Pessoais',
      tags: [],
      history: []
    });
  };

  // Delete active note
  const handleDeleteActiveNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Deseja excluir esta nota de forma permanente?')) {
      onDeleteNote(id);
      if (activeNoteId === id) {
        setActiveNoteId(null);
        setShowMobileEditor(false);
      }
    }
  };

  // Add attachment to active note
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNote || !attachmentName.trim() || !attachmentUrl.trim()) return;
    const currentAttachments = activeNote.attachments || [];
    onUpdateNote({
      ...activeNote,
      attachments: [...currentAttachments, { name: attachmentName.trim(), url: attachmentUrl.trim() }],
      lastEditedAt: new Date().toISOString()
    });
    setAttachmentName('');
    setAttachmentUrl('');
    setShowAttachmentModal(false);
  };

  // Handle local image file upload as base64 inline image in document
  const handleInlineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          applyCommand('insertImage', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove attachment from active note
  const handleRemoveAttachment = (idx: number) => {
    if (!activeNote) return;
    const currentAttachments = activeNote.attachments || [];
    onUpdateNote({
      ...activeNote,
      attachments: currentAttachments.filter((_, i) => i !== idx),
      lastEditedAt: new Date().toISOString()
    });
  };

  // Restore history snapshot
  const handleRestoreSnapshot = (snapshot: { content: string; title: string }) => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        title: snapshot.title,
        content: snapshot.content,
        lastEditedAt: new Date().toISOString()
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = snapshot.content;
      }
      setShowHistoryPanel(false);
    }
  };

  // Get first 2 lines summary (HTML elements stripped)
  const getNoteSummary = (content: string) => {
    if (!content) return 'Sem conteúdo adicional';
    const cleanText = content.replace(/<[^>]*>/g, ' ');
    if (!cleanText.trim()) return 'Sem conteúdo adicional';
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const summary = lines.slice(0, 2).join(' • ');
    if (summary.length > 65) {
      return summary.substring(0, 62) + '...';
    }
    return summary;
  };

  // Filter & Sort notes
  const getFilteredNotes = () => {
    let list = [...notes];
    
    // Search filter (Fuzzy title, content, tag, folder)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.folder && n.folder.toLowerCase().includes(q)) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Folder category filter
    if (selectedFolder === 'Fixadas') {
      list = list.filter(n => n.pinned);
    } else if (selectedFolder === 'Favoritas') {
      list = list.filter(n => n.favorite);
    } else if (selectedFolder !== 'Todas') {
      list = list.filter(n => n.folder === selectedFolder);
    }

    // Sort: pinned first, then by last modified or created date
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const tA = a.lastEditedAt ? new Date(a.lastEditedAt).getTime() : new Date(a.createdAt).getTime();
      const tB = b.lastEditedAt ? new Date(b.lastEditedAt).getTime() : new Date(b.createdAt).getTime();
      return tB - tA;
    });
  };

  const filteredNotes = getFilteredNotes();
  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const regularNotes = filteredNotes.filter(n => !n.pinned);

  const getActiveNoteColorDetails = () => {
    if (!activeNote || !activeNote.color) return NOTE_COLORS[5]; // Default slate
    const col = NOTE_COLORS.find(c => c.bg === activeNote.color);
    return col || NOTE_COLORS[5];
  };

  return (
    <div className="h-screen w-screen bg-[#070b19] flex flex-col overflow-hidden relative select-none text-slate-100 font-sans">
      
      {/* Floating Animated Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* 1. TOP NAVBAR HEADER */}
      <header className="h-14 border-b border-white/10 bg-white/5 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 z-20 relative select-none">
        <div className="flex items-center gap-3">
          {onCloseNotes && (
            <button
              onClick={onCloseNotes}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-indigo-305 dark:text-indigo-200 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <span>← Voltar para Organização</span>
            </button>
          )}
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2 select-none">
            <div className="p-1.5 bg-amber-500/10 rounded-xl text-amber-400">
              <FileText size={18} />
            </div>
            <span className="font-display font-extrabold text-sm tracking-tight text-white">Apple Notes • Notas Pessoais</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs hidden md:block select-text">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar em títulos, pastas, tags..."
              className="w-64 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl p-1.5 pl-9 text-xs focus:outline-none text-white font-medium"
            />
          </div>
          <button
            onClick={handleAddNewNote}
            className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-black uppercase tracking-wider"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nova Nota</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* LEFT FOLDER NAVIGATION SIDEBAR */}
        <aside className="w-64 border-r border-white/10 bg-slate-950/40 backdrop-blur-3xl h-full flex flex-col shrink-0 overflow-y-auto hidden lg:flex p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pastas de Organização</span>
              <button 
                onClick={() => setShowFolderForm(!showFolderForm)}
                className="text-slate-400 hover:text-amber-550 transition-colors"
                title="Criar Pasta"
              >
                <FolderPlus size={16} />
              </button>
            </div>

            {showFolderForm && (
              <form onSubmit={handleAddFolder} className="p-2 bg-white/5 border border-white/10 rounded-xl flex gap-1 animate-fadeIn">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nome da pasta..."
                  className="bg-transparent text-[11px] text-white placeholder-slate-500 focus:outline-none w-full font-semibold"
                  autoFocus
                />
                <button type="submit" className="text-amber-500 hover:text-amber-400 font-bold text-xs shrink-0">Criar</button>
              </form>
            )}

            <div className="space-y-0.5">
              {/* Predefined Folders */}
              {[
                { name: 'Todas', icon: FileText, color: 'text-amber-500' },
                { name: 'Fixadas', icon: Pin, color: 'text-rose-500' },
                { name: 'Favoritas', icon: Star, color: 'text-amber-400' }
              ].map(f => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFolder(f.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                    selectedFolder === f.name 
                      ? 'bg-white/10 text-white' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <f.icon size={14} className={f.color} />
                    <span>{f.name}</span>
                  </div>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-mono text-slate-400">
                    {f.name === 'Todas' ? notes.length : f.name === 'Fixadas' ? notes.filter(n => n.pinned).length : f.name === 'Favoritas' ? notes.filter(n => n.favorite).length : 0}
                  </span>
                </button>
              ))}

              <div className="h-px bg-white/5 my-2" />

              {/* Custom Folders */}
              {customFolders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all group ${
                    selectedFolder === folder 
                      ? 'bg-white/10 text-white' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder size={14} className="text-amber-500 shrink-0" />
                    <span className="truncate">{folder}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-mono text-slate-400">
                      {notes.filter(n => n.folder === folder).length}
                    </span>
                    {!DEFAULT_FOLDERS.includes(folder) && (
                      <button
                        onClick={(e) => handleDeleteFolder(folder, e)}
                        className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Deletar Pasta"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE NOTES LIST DIRECTORY */}
        <aside className={`
          ${showMobileEditor ? 'hidden' : 'flex'} 
          md:flex flex-col w-full md:w-80 border-r border-white/10 bg-slate-950/20 h-full shrink-0 overflow-hidden relative
        `}>
          {/* List subheader */}
          <div className="p-4 border-b border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5 font-display select-none">
                <Folder size={14} className="text-amber-500 animate-pulse" />
                <span>{selectedFolder}</span>
              </span>
              <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono">
                {filteredNotes.length} Notas
              </span>
            </div>
            
            {/* Mobile search bar */}
            <div className="relative md:hidden select-text">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar em todas as notas..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-1.5 pl-9 text-xs focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Directory Notes List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {/* PINNED SECTION */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-0.5 pb-2">
                <div className="p-3 px-4 text-[9px] font-black tracking-widest text-slate-400 uppercase select-none flex items-center gap-1">
                  <Pin size={10} className="text-rose-500" /> FIXADAS
                </div>
                {pinnedNotes.map((note) => {
                  const isSelected = note.id === activeNoteId;
                  const noteColor = NOTE_COLORS.find(c => c.bg === note.color) || NOTE_COLORS[5];
                  const dateStr = note.createdAt 
                    ? new Date(note.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    : 'Hoje';

                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setShowMobileEditor(true);
                      }}
                      className={`p-4 transition-all duration-250 cursor-pointer text-left relative group flex items-start gap-3 select-none ${
                        isSelected 
                          ? 'bg-amber-500/10 border-l-4 border-amber-500' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 border border-white/20 shadow-3xs ${noteColor.bg}`} />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-extrabold text-white truncate text-xs">
                            {note.title || 'Nota Sem Título'}
                          </h4>
                          <span className="text-[9px] font-mono font-bold text-slate-500 shrink-0">
                            {dateStr}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                          {getNoteSummary(note.content)}
                        </p>
                        {/* Tags list inline */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {note.tags.map(t => (
                              <span key={t} className="text-[8px] bg-white/5 border border-white/10 text-slate-300 px-1 rounded-md">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleDeleteActiveNote(note.id, e)}
                        className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 p-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 rounded-lg transition-opacity shadow-3xs cursor-pointer"
                        title="Excluir Nota"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* REGULAR NOTES SECTION */}
            <div className="space-y-0.5">
              {pinnedNotes.length > 0 && regularNotes.length > 0 && (
                <div className="p-3 px-4 text-[9px] font-black tracking-widest text-slate-400 uppercase select-none border-t border-white/5">
                  ANOTAÇÕES
                </div>
              )}
              {regularNotes.map((note) => {
                const isSelected = note.id === activeNoteId;
                const noteColor = NOTE_COLORS.find(c => c.bg === note.color) || NOTE_COLORS[5];
                const dateStr = note.createdAt 
                  ? new Date(note.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                  : 'Hoje';

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setShowMobileEditor(true);
                    }}
                    className={`p-4 transition-all duration-250 cursor-pointer text-left relative group flex items-start gap-3 select-none ${
                      isSelected 
                        ? 'bg-amber-500/10 border-l-4 border-amber-500' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 border border-white/20 shadow-3xs ${noteColor.bg}`} />
                    <div className="flex-1 min-w-0 space-y-1 text-left">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-extrabold text-white truncate text-xs">
                          {note.title || 'Nota Sem Título'}
                        </h4>
                        <span className="text-[9px] font-mono font-bold text-slate-500 shrink-0">
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {getNoteSummary(note.content)}
                      </p>
                      {/* Tags list inline */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {note.tags.map(t => (
                            <span key={t} className="text-[8px] bg-white/5 border border-white/10 text-slate-300 px-1 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleDeleteActiveNote(note.id, e)}
                      className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 p-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 rounded-lg transition-opacity shadow-3xs cursor-pointer"
                      title="Excluir Nota"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredNotes.length === 0 && (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-48 space-y-2">
                <FileText size={24} className="text-slate-600 animate-bounce" />
                <p className="text-xs font-bold">Nenhuma nota nesta pasta</p>
                <button
                  onClick={handleAddNewNote}
                  className="text-[10px] font-black uppercase text-amber-400 hover:underline"
                >
                  Criar nota rápida +
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANE: Interactive Apple Notes Editor Sheet */}
        <section className={`
          ${showMobileEditor ? 'flex' : 'hidden'} 
          md:flex flex-1 flex-col h-full bg-slate-900/10 overflow-hidden relative select-text
        `}>
          <AnimatePresence mode="wait">
            {activeNote ? (
              <motion.div
                key={activeNoteId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                
                {/* STICKY STYLED RICH FORMATTING TOOLBAR */}
                <div className="h-14 border-b border-white/10 bg-slate-950/45 backdrop-blur-md px-4 flex items-center justify-between shrink-0 select-none overflow-x-auto gap-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowMobileEditor(false)}
                      className="p-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-slate-300 md:hidden flex items-center gap-1 text-xs font-black cursor-pointer shadow-3xs"
                    >
                      <ChevronLeft size={14} />
                      <span>Notas</span>
                    </button>

                    {/* Pin Action */}
                    <button
                      onClick={handleTogglePin}
                      className={`p-2 rounded-xl border transition-all ${
                        activeNote.pinned 
                          ? 'bg-rose-500/20 border-rose-505 text-rose-400' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={activeNote.pinned ? 'Desafixar nota' : 'Fixar nota no topo'}
                    >
                      <Pin size={14} className={activeNote.pinned ? 'fill-rose-400' : ''} />
                    </button>

                    {/* Favorite Action */}
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-xl border transition-all ${
                        activeNote.favorite 
                          ? 'bg-amber-500/20 border-amber-505 text-amber-400' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={activeNote.favorite ? 'Desmarcar favorita' : 'Marcar como Favorita'}
                    >
                      <Star size={14} className={activeNote.favorite ? 'fill-amber-400' : ''} />
                    </button>

                    {/* Move to Folder Select Dropdown */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                      <Folder size={12} className="text-amber-500" />
                      <select
                        value={activeNote.folder || 'Notas Pessoais'}
                        onChange={(e) => handleFolderChange(e.target.value)}
                        className="bg-transparent text-[11px] font-extrabold text-white focus:outline-none cursor-pointer"
                      >
                        {customFolders.map(folder => (
                          <option key={folder} value={folder} className="bg-slate-900 text-white font-bold">{folder}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* WYSIWYG COMMAND BAR BUTTONS */}
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                    <button onClick={() => applyCommand('bold')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" title="Negrito"><Bold size={13} /></button>
                    <button onClick={() => applyCommand('italic')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" title="Itálico"><Italic size={13} /></button>
                    <button onClick={() => applyCommand('underline')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" title="Sublinhado"><Underline size={13} /></button>
                    
                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button onClick={() => applyCommand('formatBlock', '<h1>')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer font-bold text-xs" title="Título Principal">H1</button>
                    <button onClick={() => applyCommand('formatBlock', '<h2>')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer font-bold text-xs" title="Subtítulo">H2</button>
                    <button onClick={() => applyCommand('formatBlock', '<p>')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer font-bold text-xs" title="Texto Normal">P</button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button onClick={() => applyCommand('insertUnorderedList')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" title="Lista Marcadores"><List size={13} /></button>
                    <button onClick={() => applyCommand('insertOrderedList')} className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" title="Lista Numerada"><ListOrdered size={13} /></button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    {/* Inline Image Upload Trigger */}
                    <label className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer flex items-center justify-center">
                      <ImageIcon size={13} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleInlineImageUpload}
                      />
                    </label>

                    {/* Link Insertion Trigger */}
                    <button 
                      onClick={() => {
                        const url = window.prompt('Insira o link URL para inserir:');
                        if (url) applyCommand('createLink', url);
                      }} 
                      className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer" 
                      title="Inserir Link"
                    >
                      <Link2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Change logs snapshot history */}
                    <button
                      onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                      className={`p-2 rounded-xl border transition-all ${
                        showHistoryPanel ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title="Histórico de snapshot da nota"
                    >
                      <History size={14} />
                    </button>

                    {/* Attachments Trigger */}
                    <button
                      onClick={() => setShowAttachmentModal(true)}
                      className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl cursor-pointer"
                      title="Anexos desta nota"
                    >
                      <Paperclip size={14} />
                    </button>

                    <div className="w-px h-5 bg-white/10" />

                    {/* Note Trash Action */}
                    <button
                      onClick={() => handleDeleteActiveNote(activeNote.id)}
                      className="p-2 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/25 text-rose-400 rounded-xl cursor-pointer"
                      title="Excluir Nota"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* THE RICH SHEET CONTAINER */}
                <div className={`flex-1 p-6 md:p-10 flex flex-col overflow-y-auto ${getActiveNoteColorDetails().bg}`}>
                  <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col space-y-6">
                    
                    {/* Title input */}
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Sem Título"
                      className="w-full bg-transparent text-2xl md:text-3xl font-black font-sans tracking-tight focus:outline-none placeholder-slate-400 text-slate-900 dark:text-white border-b border-transparent focus:border-slate-300/20 pb-3 font-display select-text text-left"
                    />

                    {/* Date / Folder indicator */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-b border-slate-300/10 pb-2 select-none">
                      <span>Última edição: {activeNote.lastEditedAt ? new Date(activeNote.lastEditedAt).toLocaleString('pt-BR') : new Date(activeNote.createdAt).toLocaleString('pt-BR')}</span>
                      <span>•</span>
                      <span className="bg-slate-200/50 dark:bg-white/5 px-2 py-0.5 rounded-full font-sans font-bold">Pasta: {activeNote.folder || 'Notas Pessoais'}</span>
                    </div>

                    {/* Inline ContentEditable Sheet Editor */}
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      className="w-full flex-1 text-xs md:text-sm leading-relaxed focus:outline-none placeholder-slate-400 text-slate-800 dark:text-slate-200 font-sans min-h-[350px] outline-none text-left select-text"
                      style={{ minHeight: '400px' }}
                      placeholder="Comece a escrever sua nota com suporte a rico-estilo aqui... (Salvo automaticamente)"
                    />

                    {/* Tags Pills container */}
                    <div className="border-t border-slate-300/15 pt-4 select-none text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Etiquetas / Tags:</span>
                        
                        {activeNote.tags?.map(t => (
                          <span key={t} className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-extrabold animate-fadeIn">
                            #{t}
                            <button onClick={() => handleRemoveTag(t)} className="text-amber-500 hover:text-white font-bold">&times;</button>
                          </span>
                        ))}

                        <form onSubmit={handleAddTag} className="inline-flex gap-1">
                          <input
                            type="text"
                            placeholder="Adicionar #"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-md text-[9px] px-1.5 py-0.5 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-amber-500"
                          />
                        </form>
                      </div>
                    </div>

                    {/* Attachments Bar */}
                    {activeNote.attachments && activeNote.attachments.length > 0 && (
                      <div className="border-t border-slate-300/15 pt-4 text-left select-none animate-fadeIn">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-2.5">
                          <Paperclip size={12} className="text-indigo-400" /> Anexos e Referências ({activeNote.attachments.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeNote.attachments.map((att, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileDown size={14} className="text-amber-400 shrink-0" />
                                <span className="text-[11px] font-extrabold text-white truncate">{att.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a 
                                  href={att.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] font-black uppercase text-indigo-400 hover:underline flex items-center gap-0.5"
                                >
                                  <Eye size={12} /> Abrir
                                </a>
                                <button 
                                  onClick={() => handleRemoveAttachment(idx)} 
                                  className="text-slate-500 hover:text-rose-500 text-xs"
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Editor Background Selector palette */}
                    <div className="flex items-center justify-between border-t border-slate-300/15 pt-4 select-none">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Textura do Papel</span>
                      <div className="flex items-center gap-2 bg-slate-950/40 p-1 rounded-full border border-white/10">
                        {NOTE_COLORS.map((col) => {
                          const isSelected = activeNote.color === col.bg;
                          return (
                            <button
                              key={col.id}
                              onClick={() => handleColorChange(col.bg)}
                              className={`w-6 h-6 rounded-full cursor-pointer relative transition-transform hover:scale-115 active:scale-90 border shadow-3xs border-white/10 ${col.bg}`}
                              title={`Papel ${col.name}`}
                            >
                              {isSelected && (
                                <Check size={11} className="absolute inset-0 m-auto text-slate-900 dark:text-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 select-none">
                <div className="p-5 bg-white/5 border border-white/10 text-slate-400 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 animate-pulse" />
                  <FileText size={44} className="text-amber-500 relative z-10 animate-bounce" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="font-extrabold text-white text-sm tracking-tight font-display">Selecione ou Crie uma Anotação</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Clique em qualquer uma das anotações existentes no menu lateral esquerdo ou crie uma nova nota de escrita instantânea e comece seu diário pessoal offline.
                  </p>
                </div>
                
                <button
                  onClick={handleAddNewNote}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Criar Nova Nota +
                </button>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* SIDE CHANGE LOG SNAPSHOTS HISTORY PANEL */}
        <AnimatePresence>
          {showHistoryPanel && activeNote && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-slate-950/95 backdrop-blur-3xl border-l border-white/10 p-6 z-30 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <History size={14} className="text-indigo-400" /> Histórico de Snapshots
                </span>
                <button onClick={() => setShowHistoryPanel(false)} className="text-slate-400 hover:text-white">&times;</button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {activeNote.history && activeNote.history.length > 0 ? (
                  activeNote.history.map((snapshot, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/5 border border-white/10 hover:bg-white/10 p-3.5 rounded-xl text-left select-none cursor-pointer transition-colors space-y-1"
                      onClick={() => handleRestoreSnapshot(snapshot)}
                    >
                      <span className="text-[9px] font-mono font-black text-indigo-400">{new Date(snapshot.timestamp).toLocaleString('pt-BR')}</span>
                      <h5 className="text-[11px] font-extrabold text-white truncate">{snapshot.title || 'Sem Título'}</h5>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {snapshot.content ? snapshot.content.replace(/<[^>]*>/g, ' ').substring(0, 80) : 'Sem conteúdo'}
                      </p>
                      <div className="text-[9px] font-bold text-amber-500 uppercase tracking-wider pt-1.5 flex items-center gap-0.5">
                        Restaurar esta versão &larr;
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 p-8 space-y-2">
                    <History size={20} className="mx-auto text-slate-600" />
                    <p className="text-[11px] font-bold leading-normal">Nenhum snapshot salvo ainda.<br/>O sistema salva rascunhos em tempo real conforme você escreve.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ATTACHMENT REGISTER MODAL */}
        <AnimatePresence>
          {showAttachmentModal && activeNote && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Paperclip size={14} className="text-indigo-400" /> Adicionar Anexo à Nota
                  </h4>
                  <button onClick={() => setShowAttachmentModal(false)} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <form onSubmit={handleAddAttachment} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nome do Anexo</label>
                    <input
                      type="text"
                      placeholder="Ex: Foto de Referência, Link de Vendas..."
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none text-white font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">URL do Anexo</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none text-white font-mono"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentModal(false)}
                      className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      Adicionar Anexo
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
