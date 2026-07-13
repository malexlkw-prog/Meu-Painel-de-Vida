import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  FileText, 
  ImageIcon, 
  ListTodo, 
  Link2, 
  MousePointer, 
  Grid, 
  X, 
  Pin,
  Star,
  Check,
  Share2,
  FolderOpen,
  PlusCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Download
} from 'lucide-react';
import { CreativityProject } from '../types';

interface CreativitySectionProps {
  projects: CreativityProject[];
  onAddProject: (project: Omit<CreativityProject, 'id' | 'createdAt'>) => void;
  onUpdateProject: (project: CreativityProject) => void;
  onDeleteProject: (id: string) => void;
  onCloseCreativity?: () => void;
}

const CATEGORIES = ['Design & Marca', 'Vídeo & YouTube', 'Música & Roteiro', 'Desenho & Arte', 'Código & Software', 'Papelaria Artesanal', 'Outro'];

const STATUS_CONFIGS = {
  planning: { label: 'Planejando', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  in_progress: { label: 'Em Progresso', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' },
  completed: { label: 'Concluído', color: 'bg-slate-100 text-slate-950 border-slate-200' },
  paused: { label: 'Pausado', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
};

interface CanvasCard {
  id: string;
  type: 'text' | 'image' | 'list' | 'link';
  title: string;
  content: string; // Text content, url, or base64 image
  color: string; // Theme id
  x: number; // 0-100 position percent
  y: number; // 0-100 position percent
  checklist?: { text: string; completed: boolean }[];
}

interface CanvasConnection {
  id: string;
  fromId: string;
  toId: string;
}

const COLOR_PALETTES = [
  { id: 'yellow', border: 'border-amber-305/40 dark:border-amber-900/40', header: 'bg-amber-500/15', bg: 'bg-amber-500/5', text: 'text-amber-200', dot: 'bg-amber-400' },
  { id: 'purple', border: 'border-violet-305/40 dark:border-violet-900/40', header: 'bg-violet-500/15', bg: 'bg-violet-500/5', text: 'text-violet-200', dot: 'bg-violet-400' },
  { id: 'emerald', border: 'border-emerald-305/40 dark:border-emerald-900/40', header: 'bg-emerald-500/15', bg: 'bg-emerald-500/5', text: 'text-emerald-200', dot: 'bg-emerald-400' },
  { id: 'blue', border: 'border-blue-305/40 dark:border-blue-900/40', header: 'bg-blue-500/15', bg: 'bg-blue-500/5', text: 'text-blue-200', dot: 'bg-blue-400' },
  { id: 'rose', border: 'border-rose-305/40 dark:border-rose-900/40', header: 'bg-rose-500/15', bg: 'bg-rose-500/5', text: 'text-rose-200', dot: 'bg-rose-400' },
  { id: 'slate', border: 'border-slate-305/45 dark:border-slate-800/40', header: 'bg-white/10', bg: 'bg-white/5', text: 'text-slate-100', dot: 'bg-slate-400' }
];

export default function CreativitySection({ projects, onAddProject, onUpdateProject, onDeleteProject, onCloseCreativity }: CreativitySectionProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardCat, setNewBoardCat] = useState(CATEGORIES[5]); // Papelaria Artesanal

  // Canvas View Configuration
  const [bgPattern, setBgPattern] = useState<'dots' | 'grid' | 'glass'>('dots');
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  
  // Dragging cards physical coordinates state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; cardX: number; cardY: number }>({ x: 0, y: 0, cardX: 0, cardY: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [showAddCardPopover, setShowAddCardPopover] = useState(false);

  // Active board project
  const currentProject = projects.find(p => p.id === activeProjectId);

  // Parse canvas board data
  const getBoardData = (): { cards: CanvasCard[]; connections: CanvasConnection[] } => {
    if (!currentProject || !currentProject.notes) {
      return { cards: [], connections: [] };
    }
    try {
      const parsed = JSON.parse(currentProject.notes);
      if (parsed && Array.isArray(parsed.cards)) {
        return {
          cards: parsed.cards,
          connections: parsed.connections || []
        };
      }
    } catch (e) {
      // Legacy data fallback: convert markdown text to a starting visual note card in the center
      return {
        cards: [
          {
            id: 'legacy-intro-card',
            type: 'text',
            title: 'Anotações Importadas',
            content: currentProject.notes,
            color: 'slate',
            x: 30,
            y: 30
          }
        ],
        connections: []
      };
    }
    return { cards: [], connections: [] };
  };

  const saveBoardData = (cards: CanvasCard[], connections: CanvasConnection[]) => {
    if (!currentProject) return;
    onUpdateProject({
      ...currentProject,
      notes: JSON.stringify({ cards, connections })
    });
  };

  // Drag and Drop implementation
  const handleCardDragStart = (cardId: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't drag if interacting with fields
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.closest('.no-drag')) {
      return;
    }
    e.preventDefault();
    if (!canvasRef.current) return;

    const { cards } = getBoardData();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    setDraggingCardId(cardId);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      cardX: card.x,
      cardY: card.y
    };
  };

  const handleCardTouchStart = (cardId: string, e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.closest('.no-drag')) {
      return;
    }
    if (!canvasRef.current) return;

    const { cards } = getBoardData();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const touch = e.touches[0];
    setDraggingCardId(cardId);
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      cardX: card.x,
      cardY: card.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingCardId || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    // Convert pixel difference to percentage
    const percentDx = (dx / rect.width) * 100;
    const percentDy = (dy / rect.height) * 100;

    let newX = dragStartPos.current.cardX + percentDx;
    let newY = dragStartPos.current.cardY + percentDy;

    // Clamp coordinates within 0 to 90%
    newX = Math.max(0, Math.min(88, newX));
    newY = Math.max(0, Math.min(88, newY));

    // Optional snapping for alignment
    newX = Math.round(newX * 10) / 10;
    newY = Math.round(newY * 10) / 10;

    const { cards, connections } = getBoardData();
    const updatedCards = cards.map(c => c.id === draggingCardId ? { ...c, x: newX, y: newY } : c);
    saveBoardData(updatedCards, connections);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingCardId || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const dx = touch.clientX - dragStartPos.current.x;
    const dy = touch.clientY - dragStartPos.current.y;

    const percentDx = (dx / rect.width) * 100;
    const percentDy = (dy / rect.height) * 100;

    let newX = dragStartPos.current.cardX + percentDx;
    let newY = dragStartPos.current.cardY + percentDy;

    newX = Math.max(0, Math.min(88, newX));
    newY = Math.max(0, Math.min(88, newY));

    newX = Math.round(newX * 10) / 10;
    newY = Math.round(newY * 10) / 10;

    const { cards, connections } = getBoardData();
    const updatedCards = cards.map(c => c.id === draggingCardId ? { ...c, x: newX, y: newY } : c);
    saveBoardData(updatedCards, connections);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
  };

  // Card connect logic
  const handleCardConnectClick = (cardId: string) => {
    if (!connectionMode) return;
    if (!connectFromId) {
      setConnectFromId(cardId);
    } else {
      if (connectFromId !== cardId) {
        const { cards, connections } = getBoardData();
        const exists = connections.some(c => 
          (c.fromId === connectFromId && c.toId === cardId) || 
          (c.fromId === cardId && c.toId === connectFromId)
        );
        if (!exists) {
          const newConn: CanvasConnection = {
            id: `conn-${Date.now()}`,
            fromId: connectFromId,
            toId: cardId
          };
          saveBoardData(cards, [...connections, newConn]);
        }
      }
      setConnectFromId(null);
      setConnectionMode(false);
    }
  };

  // Board creator
  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    onAddProject({
      title: newBoardTitle.trim(),
      description: newBoardDesc.trim(),
      category: newBoardCat,
      status: 'planning',
      notes: JSON.stringify({ cards: [], connections: [] }),
      links: [],
      favorite: false,
      tags: []
    });

    setNewBoardTitle('');
    setNewBoardDesc('');
    setNewBoardCat(CATEGORIES[5]);
    setIsFormOpen(false);
  };

  // Delete Board
  const handleDeleteBoard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja excluir permanentemente este quadro de ideias criativas?')) {
      onDeleteProject(id);
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
    }
  };

  // Toggle Favorite Board
  const handleToggleFavoriteBoard = (project: CreativityProject, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProject({
      ...project,
      favorite: !project.favorite
    });
  };

  // Add Card in Canvas
  const handleAddCard = (type: CanvasCard['type']) => {
    if (!currentProject) return;
    const { cards, connections } = getBoardData();
    const offset = (cards.length * 6) % 36;
    
    const newCard: CanvasCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title: type === 'text' ? 'Nova Ideia' : type === 'image' ? 'Inspirador Visual' : type === 'list' ? 'Checklist de Ação' : 'Link de Vendas',
      content: type === 'image' ? 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80' : type === 'link' ? 'https://google.com' : '',
      color: COLOR_PALETTES[cards.length % COLOR_PALETTES.length].id,
      x: 30 + offset,
      y: 20 + offset,
      checklist: type === 'list' ? [{ text: 'Etapa inicial do protótipo', completed: false }] : undefined
    };

    saveBoardData([...cards, newCard], connections);
    setShowAddCardPopover(false);
  };

  // Card updating helper
  const handleUpdateCard = (updatedCard: CanvasCard) => {
    const { cards, connections } = getBoardData();
    const updatedCards = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
    saveBoardData(updatedCards, connections);
  };

  // Remove Card
  const handleRemoveCard = (cardId: string) => {
    const { cards, connections } = getBoardData();
    const filteredCards = cards.filter(c => c.id !== cardId);
    const filteredConnections = connections.filter(conn => conn.fromId !== cardId && conn.toId !== cardId);
    saveBoardData(filteredCards, filteredConnections);
  };

  // Clear connections line layer
  const handleClearConnections = () => {
    const { cards } = getBoardData();
    saveBoardData(cards, []);
  };

  // Download project data
  const handleExportBoard = () => {
    if (!currentProject) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getBoardData(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `painel_criatividade_${currentProject.title.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Drag-and-drop Image upload
  const handleLocalImageDrop = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const { cards } = getBoardData();
          const updated = cards.map(c => c.id === cardId ? { ...c, content: reader.result as string } : c);
          const { connections } = getBoardData();
          saveBoardData(updated, connections);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // SVG lines rendering
  const renderSVGConnections = (cards: CanvasCard[], connections: CanvasConnection[]) => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrow-creativity" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-pink-500" />
          </marker>
        </defs>
        {connections.map(conn => {
          const fromCard = cards.find(c => c.id === conn.fromId);
          const toCard = cards.find(c => c.id === conn.toId);
          if (!fromCard || !toCard) return null;

          // Approx centers based on percentage
          const x1 = `${fromCard.x + 11}%`;
          const y1 = `${fromCard.y + 10}%`;
          const x2 = `${toCard.x + 11}%`;
          const y2 = `${toCard.y + 10}%`;

          return (
            <g key={conn.id}>
              <line 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                className="stroke-pink-500/70" 
                strokeWidth="2.5" 
                strokeDasharray="6,6"
                markerEnd="url(#arrow-creativity)"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  const { cards: boardCards, connections: boardConnections } = getBoardData();

  return (
    <div className="h-screen w-screen bg-[#070b19] flex flex-col overflow-hidden relative text-slate-100 select-none">
      
      {/* 1. TOP GLOBAL MENU BAR */}
      <header className="h-14 border-b border-white/10 bg-white/5 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 z-20 relative select-none">
        <div className="flex items-center gap-3">
          {activeProjectId === null ? (
            onCloseCreativity && (
              <button
                onClick={onCloseCreativity}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-pink-300 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>← Voltar para Organização</span>
              </button>
            )
          ) : (
            <button
              onClick={() => setActiveProjectId(null)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-pink-300 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <span>← Voltar para Quadros</span>
            </button>
          )}

          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2 select-none">
            <div className="p-1.5 bg-pink-500/10 rounded-xl text-pink-400">
              <Sparkles size={18} />
            </div>
            <span className="font-display font-extrabold text-sm tracking-tight text-white">Freeform • Quadro de Criatividade</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeProjectId === null && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Novo Quadro
            </button>
          )}
          {currentProject && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBoard}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-extrabold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                title="Exportar Quadro como JSON"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Exportar JSON</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. AREA VIEWS */}
      <div className="flex-1 overflow-hidden relative z-10 flex">
        
        {/* VIEW A: BOARDS DIRECTORY IF NULL */}
        {activeProjectId === null ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto space-y-8 select-none">
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-pink-400">💡 Seus Quadros de Criatividade</h1>

            </div>

            {/* Grid listings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                let parsed = { cards: [] };
                try {
                  parsed = JSON.parse(project.notes || '{}');
                } catch(e){}
                const cardsCount = Array.isArray(parsed.cards) ? parsed.cards.length : 0;

                return (
                  <div
                    key={project.id}
                    onClick={() => setActiveProjectId(project.id)}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left relative group hover:border-pink-500/40 hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between h-48 select-none hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                        {project.category || 'Papelaria'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleToggleFavoriteBoard(project, e)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Star size={14} className={project.favorite ? 'fill-amber-400 text-amber-400' : ''} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBoard(project.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 my-3">
                      <h3 className="text-sm font-black text-white group-hover:text-pink-400 transition-colors truncate">{project.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{project.description || 'Nenhuma descrição inserida...'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-500">Criado em {project.createdAt}</span>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 font-extrabold px-2.5 py-0.5 rounded-full">
                        {cardsCount} blocos de ideias
                      </span>
                    </div>
                  </div>
                );
              })}

              {projects.length === 0 && (
                <div className="col-span-full p-12 bg-white/5 border border-white/10 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
                  <Sparkles size={36} className="text-pink-500 animate-pulse" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white">Nenhum quadro criado ainda</h3>
                    <p className="text-[11px] text-slate-400">Monte seu primeiro painel interativo para organizar ideias e referências criativas de papelaria.</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
                  >
                    Montar Quadro de Ideias +
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          /* VIEW B: ACTIVE INTERACTIVE CANVAS */
          <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
            
            {/* CANVAS GRID CONTAINER */}
            <div 
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
              onMouseLeave={handleDragEnd}
              className={`
                flex-1 w-full h-full relative overflow-hidden transition-all duration-300
                ${bgPattern === 'dots' ? 'bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] bg-[#070b19]' : ''}
                ${bgPattern === 'grid' ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:30px_30px] bg-slate-950/80' : ''}
                ${bgPattern === 'glass' ? 'bg-gradient-to-br from-[#0c0f24] to-[#04060f]' : ''}
              `}
            >
              
              {/* Dynamic visual connection lines SVG */}
              {renderSVGConnections(boardCards, boardConnections)}

              {/* Floating controls context overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 select-none pointer-events-auto">
                <div className="bg-slate-950/80 border border-white/10 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1.5">
                  <button
                    onClick={() => setBgPattern('dots')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${bgPattern === 'dots' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pontos
                  </button>
                  <button
                    onClick={() => setBgPattern('grid')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${bgPattern === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Grade
                  </button>
                  <button
                    onClick={() => setBgPattern('glass')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${bgPattern === 'glass' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Vidro Estelar
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-pink-400">{currentProject.title}</span>
                  <span className="h-3 w-px bg-white/20" />
                  <span className="text-[9px] uppercase font-bold text-slate-400">Total: {boardCards.length} cartões</span>
                </div>

                {connectionMode && (
                  <div className="bg-pink-500/20 border border-pink-505 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[10px] font-black text-pink-400 animate-pulse flex items-center gap-2">
                    <span>Modo Conectar: Clique em 2 cartões para vinculá-los</span>
                    <button onClick={() => { setConnectionMode(false); setConnectFromId(null); }} className="hover:text-white font-bold shrink-0">&times;</button>
                  </div>
                )}
              </div>

              {/* RENDER CANVAS CARDS */}
              {boardCards.map((card) => {
                const palette = COLOR_PALETTES.find(p => p.id === card.color) || COLOR_PALETTES[5];
                const isDragging = card.id === draggingCardId;

                return (
                  <div
                    key={card.id}
                    onMouseDown={(e) => handleCardDragStart(card.id, e)}
                    onTouchStart={(e) => handleCardTouchStart(card.id, e)}
                    onClick={() => handleCardConnectClick(card.id)}
                    className={`
                      absolute w-64 border rounded-2xl shadow-xl backdrop-blur-md transition-shadow flex flex-col z-10 pointer-events-auto cursor-grab active:cursor-grabbing select-none text-left
                      ${palette.border} ${palette.bg}
                      ${isDragging ? 'shadow-2xl scale-102 z-30 ring-2 ring-pink-500/50' : ''}
                      ${connectionMode ? 'hover:ring-2 hover:ring-pink-500 cursor-pointer' : ''}
                      ${connectFromId === card.id ? 'ring-2 ring-pink-500 border-pink-500' : ''}
                    `}
                    style={{ 
                      left: `${card.x}%`, 
                      top: `${card.y}%`
                    }}
                  >
                    {/* CARD HEADER DRAGGING GRIP */}
                    <div className={`p-2 px-3 border-b border-white/10 flex items-center justify-between select-none ${palette.header}`}>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${palette.dot}`} />
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateCard({ ...card, title: e.target.value })}
                          className="bg-transparent text-[11px] font-black text-white focus:outline-none w-44 placeholder-slate-400 select-text no-drag"
                          placeholder="Título do bloco"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 no-drag"
                        title="Deletar bloco"
                      >
                        <X size={11} />
                      </button>
                    </div>

                    {/* CARD BODY CONTENT */}
                    <div className="p-3 text-xs flex-1 flex flex-col gap-2 relative">
                      
                      {/* TYPE A: TEXT NOTE */}
                      {card.type === 'text' && (
                        <textarea
                          value={card.content}
                          onChange={(e) => handleUpdateCard({ ...card, content: e.target.value })}
                          placeholder="Digite suas ideias livremente aqui..."
                          className="bg-transparent border-0 text-slate-200 focus:outline-none focus:ring-0 placeholder-slate-500 leading-relaxed text-[11px] font-medium resize-none min-h-[80px] w-full select-text no-drag"
                        />
                      )}

                      {/* TYPE B: BULLET CHECKLIST */}
                      {card.type === 'list' && (
                        <div className="space-y-1.5 no-drag flex-1">
                          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                            {card.checklist?.map((task, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 select-none text-left">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={(e) => {
                                    const next = [...(card.checklist || [])];
                                    next[idx].completed = e.target.checked;
                                    handleUpdateCard({ ...card, checklist: next });
                                  }}
                                  className="rounded border-white/10 bg-slate-950 focus:ring-0 text-pink-500 w-3.5 h-3.5"
                                />
                                <input
                                  type="text"
                                  value={task.text}
                                  onChange={(e) => {
                                    const next = [...(card.checklist || [])];
                                    next[idx].text = e.target.value;
                                    handleUpdateCard({ ...card, checklist: next });
                                  }}
                                  className={`bg-transparent text-[11px] focus:outline-none flex-1 text-left ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
                                />
                                <button
                                  onClick={() => {
                                    const next = (card.checklist || []).filter((_, i) => i !== idx);
                                    handleUpdateCard({ ...card, checklist: next });
                                  }}
                                  className="text-[9px] text-slate-500 hover:text-rose-500"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => {
                              const next = [...(card.checklist || []), { text: 'Nova tarefa', completed: false }];
                              handleUpdateCard({ ...card, checklist: next });
                            }}
                            className="text-[9px] font-black uppercase text-pink-400 hover:underline flex items-center gap-0.5 mt-2"
                          >
                            <PlusCircle size={10} /> Adicionar Item
                          </button>
                        </div>
                      )}

                      {/* TYPE C: IMAGE BOARD */}
                      {card.type === 'image' && (
                        <div className="space-y-2 no-drag flex-1 flex flex-col justify-between">
                          <div className="rounded-xl overflow-hidden aspect-video relative group bg-slate-950/40 border border-white/5 flex items-center justify-center">
                            {card.content ? (
                              <img src={card.content} alt={card.title} className="w-full h-full object-cover select-none" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon size={20} className="text-slate-650" />
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition-opacity cursor-pointer">
                              Subir Imagem
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleLocalImageDrop(card.id, e)}
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={card.content.startsWith('data:') ? 'Imagem Local Base64' : card.content}
                            onChange={(e) => handleUpdateCard({ ...card, content: e.target.value })}
                            placeholder="URL da Imagem..."
                            className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-[9px] text-slate-400 focus:outline-none focus:border-pink-500 font-mono"
                          />
                        </div>
                      )}

                      {/* TYPE D: LINK REFERENCE */}
                      {card.type === 'link' && (
                        <div className="space-y-2 no-drag flex-1 flex flex-col justify-between text-left">
                          <div className="bg-slate-950/30 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
                            <Link2 size={14} className="text-pink-400 shrink-0" />
                            <a 
                              href={card.content} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] font-extrabold text-pink-300 hover:underline truncate"
                            >
                              Visitar Referência externa &rarr;
                            </a>
                          </div>
                          <input
                            type="text"
                            value={card.content}
                            onChange={(e) => handleUpdateCard({ ...card, content: e.target.value })}
                            placeholder="Inserir URL do link..."
                            className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-[9px] text-slate-400 focus:outline-none font-mono"
                          />
                        </div>
                      )}

                      {/* Card background selector palette */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2 select-none no-drag">
                        <span className="text-[8px] font-black uppercase text-slate-500">Cor</span>
                        <div className="flex gap-1">
                          {COLOR_PALETTES.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleUpdateCard({ ...card, color: p.id })}
                              className={`w-3.5 h-3.5 rounded-full border border-white/10 ${p.dot} hover:scale-115 transition-transform`}
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {boardCards.length === 0 && (
                <div className="absolute inset-0 m-auto w-64 h-32 flex flex-col items-center justify-center text-center space-y-2 select-none pointer-events-none opacity-40">
                  <MousePointer size={24} className="text-slate-500 animate-bounce" />
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Quadro de Ideias em Branco</p>
                  <p className="text-[10px] text-slate-500">Adicione cartões flutuantes abaixo e comece a arrastar e conectar ideias.</p>
                </div>
              )}

            </div>

            {/* FLOATING CREATIVE CONTROLS TOOLBAR AT BOTTOM (Milanote styled) */}
            <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-white/15 backdrop-blur-3xl px-6 py-3 rounded-2xl flex items-center gap-4 z-20 shadow-2xl shrink-0 pointer-events-auto">
              
              {/* Quick card creators list */}
              <div className="flex items-center gap-1.5 pr-3 border-r border-white/15">
                <button
                  onClick={() => handleAddCard('text')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  title="Nova Nota Adesiva"
                >
                  <FileText size={13} />
                  <span>Nota</span>
                </button>

                <button
                  onClick={() => handleAddCard('list')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  title="Novo Quadro de Tarefas"
                >
                  <ListTodo size={13} />
                  <span>Lista</span>
                </button>

                <button
                  onClick={() => handleAddCard('image')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  title="Nova Imagem Inspiradora"
                >
                  <ImageIcon size={13} />
                  <span>Imagem</span>
                </button>

                <button
                  onClick={() => handleAddCard('link')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  title="Novo Link de Referência"
                >
                  <Link2 size={13} />
                  <span>Link</span>
                </button>
              </div>

              {/* Advanced Board Tools */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setConnectionMode(!connectionMode); setConnectFromId(null); }}
                  className={`p-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                    connectionMode ? 'bg-pink-500/20 border-pink-505 text-pink-400' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Criar conexões direcionadas entre notas"
                >
                  <Sparkles size={13} />
                  <span>Conectar Ideias</span>
                </button>

                <button
                  onClick={handleClearConnections}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer"
                  title="Limpar todos os links"
                >
                  Limpar Links
                </button>
              </div>

            </footer>

          </div>
        )}

      </div>

      {/* CREATE NEW BOARD MODAL OVERLAY */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-pink-400 animate-pulse" /> Criar Novo Quadro de Criatividade
                </h4>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
              </div>

              <form onSubmit={handleCreateBoard} className="space-y-4">
                <div className="space-y-1.5 text-left select-text">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nome do Quadro / Projeto</label>
                  <input
                    type="text"
                    placeholder="Ex: Paleta da Nova Coleção, Roteiro Vídeo..."
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none text-white font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-left select-text">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Descrição Rápida</label>
                  <input
                    type="text"
                    placeholder="Sobre o que é este quadro criativo..."
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Categoria Criativa</label>
                  <select
                    value={newBoardCat}
                    onChange={(e) => setNewBoardCat(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs focus:outline-none text-white font-bold cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white font-bold">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Montar Quadro
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
