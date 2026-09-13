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
  Download,
  Tag,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Zap,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Minus
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

export type ConnectionLineStyle = 'neon-pink' | 'neon-cyan' | 'neon-amber' | 'aurora-curve' | 'bezier-glow' | 'solid-laser' | 'dashed-glow';

export type TagShape = 'pill' | 'badge' | 'sharp' | 'ticket' | 'bubble' | 'flag';
export type TagBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'glow';

export const TAG_SHAPES: { id: TagShape; label: string; icon: string; shapeClass: string }[] = [
  { id: 'pill', label: 'Pílula', icon: '💊', shapeClass: 'rounded-full' },
  { id: 'badge', label: 'Suave', icon: '🏷️', shapeClass: 'rounded-xl' },
  { id: 'sharp', label: 'Reto', icon: '⬛', shapeClass: 'rounded-none' },
  { id: 'ticket', label: 'Ticket', icon: '🎟️', shapeClass: 'rounded-md border-x-4' },
  { id: 'bubble', label: 'Orgânica', icon: '💬', shapeClass: 'rounded-tl-2xl rounded-br-2xl rounded-tr-xs rounded-bl-xs' },
  { id: 'flag', label: 'Bandeira', icon: '🚩', shapeClass: 'rounded-l-2xl rounded-r-none border-r-4' }
];

export const TAG_BORDER_STYLES: { id: TagBorderStyle; label: string; icon: string; borderClass: string }[] = [
  { id: 'solid', label: 'Sólida', icon: '━', borderClass: 'border-solid border' },
  { id: 'dashed', label: 'Tracejada', icon: '╌', borderClass: 'border-dashed border-2' },
  { id: 'dotted', label: 'Pontilhada', icon: '⋯', borderClass: 'border-dotted border-2' },
  { id: 'double', label: 'Dupla', icon: '═', borderClass: 'border-double border-[3px]' },
  { id: 'glow', label: 'Glow Neon', icon: '✨', borderClass: 'border-solid border-2 ring-2 ring-white/60' }
];

const LINE_STYLES: { id: ConnectionLineStyle; label: string; icon: string; desc: string }[] = [
  { id: 'neon-pink', label: '🌟 Neon Rosa Vibrante', icon: '🌸', desc: 'Brilho tubular neon magenta com núcleo radiante' },
  { id: 'neon-cyan', label: '⚡ Laser Ciano Futurista', icon: '💎', desc: 'Raio laser azul-ciano de alta luminosidade' },
  { id: 'neon-amber', label: '✨ Neon Dourado Solar', icon: '⚡', desc: 'Linha quente neon âmbar brilhante' },
  { id: 'aurora-curve', label: '〰️ Curva Fluida Neon', icon: '🌀', desc: 'Conexão curva suave com gradiente aurora' },
  { id: 'bezier-glow', label: '🌈 Gradiente Aurora', icon: '✨', desc: 'Gradiente multicolorido rosa, roxo e ciano' },
  { id: 'solid-laser', label: '➖ Sólida Minimalista', icon: '➖', desc: 'Linha limpa e contínua de alta precisão' },
  { id: 'dashed-glow', label: '⋯ Pontilhada Neon', icon: '⋯', desc: 'Pontilhado moderno com aura sutil' }
];

interface CanvasCard {
  id: string;
  type: 'text' | 'image' | 'list' | 'link' | 'tag';
  title: string;
  content: string; // Text content, url, or base64 image
  color: string; // Theme id
  shape?: TagShape;
  borderStyle?: TagBorderStyle;
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
  { 
    id: 'yellow', 
    name: 'Amarelo',
    border: 'border-amber-400/40', 
    header: 'bg-amber-500/15', 
    bg: 'bg-amber-500/5', 
    text: 'text-amber-200', 
    dot: 'bg-amber-400',
    tagBg: 'bg-amber-500/20 hover:bg-amber-500/30',
    tagBorder: 'border-amber-400/60',
    tagText: 'text-amber-200',
    tagGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
  },
  { 
    id: 'purple', 
    name: 'Roxo',
    border: 'border-violet-400/40', 
    header: 'bg-violet-500/15', 
    bg: 'bg-violet-500/5', 
    text: 'text-violet-200', 
    dot: 'bg-violet-400',
    tagBg: 'bg-violet-500/20 hover:bg-violet-500/30',
    tagBorder: 'border-violet-400/60',
    tagText: 'text-violet-200',
    tagGlow: 'shadow-[0_0_15px_rgba(167,139,250,0.25)]'
  },
  { 
    id: 'emerald', 
    name: 'Verde',
    border: 'border-emerald-400/40', 
    header: 'bg-emerald-500/15', 
    bg: 'bg-emerald-500/5', 
    text: 'text-emerald-200', 
    dot: 'bg-emerald-400',
    tagBg: 'bg-emerald-500/20 hover:bg-emerald-500/30',
    tagBorder: 'border-emerald-400/60',
    tagText: 'text-emerald-200',
    tagGlow: 'shadow-[0_0_15px_rgba(52,211,153,0.25)]'
  },
  { 
    id: 'blue', 
    name: 'Azul',
    border: 'border-blue-400/40', 
    header: 'bg-blue-500/15', 
    bg: 'bg-blue-500/5', 
    text: 'text-blue-200', 
    dot: 'bg-blue-400',
    tagBg: 'bg-blue-500/20 hover:bg-blue-500/30',
    tagBorder: 'border-blue-400/60',
    tagText: 'text-blue-200',
    tagGlow: 'shadow-[0_0_15px_rgba(96,165,250,0.25)]'
  },
  { 
    id: 'rose', 
    name: 'Rosa',
    border: 'border-rose-400/40', 
    header: 'bg-rose-500/15', 
    bg: 'bg-rose-500/5', 
    text: 'text-rose-200', 
    dot: 'bg-rose-400',
    tagBg: 'bg-rose-500/20 hover:bg-rose-500/30',
    tagBorder: 'border-rose-400/60',
    tagText: 'text-rose-200',
    tagGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]'
  },
  { 
    id: 'orange', 
    name: 'Laranja',
    border: 'border-orange-400/40', 
    header: 'bg-orange-500/15', 
    bg: 'bg-orange-500/5', 
    text: 'text-orange-200', 
    dot: 'bg-orange-400',
    tagBg: 'bg-orange-500/20 hover:bg-orange-500/30',
    tagBorder: 'border-orange-400/60',
    tagText: 'text-orange-200',
    tagGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]'
  },
  { 
    id: 'cyan', 
    name: 'Ciano',
    border: 'border-cyan-400/40', 
    header: 'bg-cyan-500/15', 
    bg: 'bg-cyan-500/5', 
    text: 'text-cyan-200', 
    dot: 'bg-cyan-400',
    tagBg: 'bg-cyan-500/20 hover:bg-cyan-500/30',
    tagBorder: 'border-cyan-400/60',
    tagText: 'text-cyan-200',
    tagGlow: 'shadow-[0_0_15px_rgba(34,211,238,0.25)]'
  },
  { 
    id: 'fuchsia', 
    name: 'Fúcsia',
    border: 'border-fuchsia-400/40', 
    header: 'bg-fuchsia-500/15', 
    bg: 'bg-fuchsia-500/5', 
    text: 'text-fuchsia-200', 
    dot: 'bg-fuchsia-400',
    tagBg: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30',
    tagBorder: 'border-fuchsia-400/60',
    tagText: 'text-fuchsia-200',
    tagGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.25)]'
  },
  { 
    id: 'slate', 
    name: 'Cinza',
    border: 'border-slate-400/40', 
    header: 'bg-white/10', 
    bg: 'bg-white/5', 
    text: 'text-slate-100', 
    dot: 'bg-slate-400',
    tagBg: 'bg-slate-800/60 hover:bg-slate-800/80',
    tagBorder: 'border-slate-500/60',
    tagText: 'text-slate-100',
    tagGlow: 'shadow-[0_0_15px_rgba(148,163,184,0.2)]'
  }
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

  // Line Style & Toolbar Visibility State
  const [lineStyle, setLineStyle] = useState<ConnectionLineStyle>('neon-pink');
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Zoom & Infinite Pan State
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartPos = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Open Color Palette Popover for a specific Card/Tag
  const [openPaletteCardId, setOpenPaletteCardId] = useState<string | null>(null);

  // Dragging cards physical coordinates state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; cardX: number; cardY: number }>({ x: 0, y: 0, cardX: 0, cardY: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [showAddCardPopover, setShowAddCardPopover] = useState(false);

  // Zoom Controllers
  const handleZoomIn = () => setZoom(prev => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom(prev => Math.max(0.35, +(prev - 0.15).toFixed(2)));
  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

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
    e.stopPropagation();
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
    e.stopPropagation();
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

  // Canvas Pan Handlers for Infinite Canvas Navigation
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setOpenPaletteCardId(null);
    const target = e.target as HTMLElement;
    if (
      target.closest('.canvas-card-item') || 
      target.closest('.no-pan') || 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.tagName === 'BUTTON'
    ) {
      return;
    }
    setIsPanning(true);
    panStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y
    };
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    setOpenPaletteCardId(null);
    const target = e.target as HTMLElement;
    if (
      target.closest('.canvas-card-item') || 
      target.closest('.no-pan') || 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.tagName === 'BUTTON'
    ) {
      return;
    }
    if (e.touches.length === 1) {
      setIsPanning(true);
      panStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startPanX: panOffset.x,
        startPanY: panOffset.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartPos.current.x;
      const dy = e.clientY - panStartPos.current.y;
      setPanOffset({
        x: panStartPos.current.startPanX + dx,
        y: panStartPos.current.startPanY + dy
      });
      return;
    }

    if (!draggingCardId || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Scale difference by current zoom level so movement is 1:1 with cursor
    const dx = (e.clientX - dragStartPos.current.x) / zoom;
    const dy = (e.clientY - dragStartPos.current.y) / zoom;

    // Convert pixel difference to percentage
    const percentDx = (dx / rect.width) * 100;
    const percentDy = (dy / rect.height) * 100;

    let newX = dragStartPos.current.cardX + percentDx;
    let newY = dragStartPos.current.cardY + percentDy;

    // Snapping for alignment
    newX = Math.round(newX * 10) / 10;
    newY = Math.round(newY * 10) / 10;

    const { cards, connections } = getBoardData();
    const updatedCards = cards.map(c => c.id === draggingCardId ? { ...c, x: newX, y: newY } : c);
    saveBoardData(updatedCards, connections);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      const dx = e.touches[0].clientX - panStartPos.current.x;
      const dy = e.touches[0].clientY - panStartPos.current.y;
      setPanOffset({
        x: panStartPos.current.startPanX + dx,
        y: panStartPos.current.startPanY + dy
      });
      return;
    }

    if (!draggingCardId || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const dx = (touch.clientX - dragStartPos.current.x) / zoom;
    const dy = (touch.clientY - dragStartPos.current.y) / zoom;

    const percentDx = (dx / rect.width) * 100;
    const percentDy = (dy / rect.height) * 100;

    let newX = dragStartPos.current.cardX + percentDx;
    let newY = dragStartPos.current.cardY + percentDy;

    newX = Math.round(newX * 10) / 10;
    newY = Math.round(newY * 10) / 10;

    const { cards, connections } = getBoardData();
    const updatedCards = cards.map(c => c.id === draggingCardId ? { ...c, x: newX, y: newY } : c);
    saveBoardData(updatedCards, connections);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
    setIsPanning(false);
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
  const handleAddCard = (type: CanvasCard['type'], customText?: string, customColor?: string) => {
    if (!currentProject) return;
    const { cards, connections } = getBoardData();
    const offset = (cards.length * 4) % 30;
    
    const chosenColor = customColor || COLOR_PALETTES[cards.length % COLOR_PALETTES.length].id;
    const defaultTagWord = customText !== undefined ? customText : '';

    const newCard: CanvasCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      title: type === 'tag' ? defaultTagWord : (type === 'text' ? '' : type === 'image' ? 'Inspirador Visual' : type === 'list' ? 'Checklist' : 'Link de Vendas'),
      content: type === 'tag' ? defaultTagWord : (type === 'image' ? 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80' : type === 'link' ? 'https://google.com' : ''),
      color: chosenColor,
      shape: 'pill',
      borderStyle: 'solid',
      x: 35 + offset,
      y: 25 + offset,
      checklist: type === 'list' ? [{ text: '', completed: false }] : undefined
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

  // Clear all items on the board (cards, tags, connections)
  const handleClearAllBoard = () => {
    const { cards } = getBoardData();
    if (cards.length === 0) return;
    if (confirm('Tem certeza que deseja apagar todos os itens (tags, notas e conexões) deste quadro?')) {
      saveBoardData([], []);
    }
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

  // SVG lines rendering with High-Impact Neon and Customizable Styles
  const renderSVGConnections = (cards: CanvasCard[], connections: CanvasConnection[]) => {
    return (
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="neon-glow-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.9" result="blur1"/>
            <feGaussianBlur stdDeviation="0.4" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur1"/>
              <feMergeNode in="blur2"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="neon-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.9" result="blur1"/>
            <feGaussianBlur stdDeviation="0.4" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur1"/>
              <feMergeNode in="blur2"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="neon-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.9" result="blur1"/>
            <feGaussianBlur stdDeviation="0.4" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur1"/>
              <feMergeNode in="blur2"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Linear Multi-stop Aurora Gradient */}
          <linearGradient id="aurora-gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Arrow Heads */}
          <marker id="arrow-pink-neon" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
            <path d="M0,1 L8,5 L0,9 z" fill="#f43f5e" />
          </marker>

          <marker id="arrow-cyan-neon" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
            <path d="M0,1 L8,5 L0,9 z" fill="#06b6d4" />
          </marker>

          <marker id="arrow-amber-neon" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
            <path d="M0,1 L8,5 L0,9 z" fill="#f59e0b" />
          </marker>

          <marker id="arrow-aurora-neon" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
            <path d="M0,1 L8,5 L0,9 z" fill="#a855f7" />
          </marker>
        </defs>

        {connections.map(conn => {
          const fromCard = cards.find(c => c.id === conn.fromId);
          const toCard = cards.find(c => c.id === conn.toId);
          if (!fromCard || !toCard) return null;

          const isFromTag = fromCard.type === 'tag';
          const isToTag = toCard.type === 'tag';

          // Precise centers in 0-100 percentage coordinates
          const x1 = isFromTag ? fromCard.x + 3.5 : fromCard.x + 11;
          const y1 = isFromTag ? fromCard.y + 2 : fromCard.y + 10;
          const x2 = isToTag ? toCard.x + 3.5 : toCard.x + 11;
          const y2 = isToTag ? toCard.y + 2 : toCard.y + 10;

          // Bezier control points for fluid curves
          const dx = x2 - x1;
          const dy = y2 - y1;
          const cx1 = x1 + dx * 0.5;
          const cy1 = y1;
          const cx2 = x1 + dx * 0.5;
          const cy2 = y2;
          const curvePath = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

          if (lineStyle === 'aurora-curve') {
            return (
              <g key={conn.id}>
                {/* Outer Neon Glow */}
                <path 
                  d={curvePath} 
                  stroke="url(#aurora-gradient-line)" 
                  strokeWidth="0.75" 
                  filter="url(#neon-glow-pink)" 
                  fill="none" 
                  strokeLinecap="round" 
                  opacity="0.85"
                />
                {/* Inner Bright Laser Core */}
                <path 
                  d={curvePath} 
                  stroke="#ffffff" 
                  strokeWidth="0.25" 
                  fill="none" 
                  strokeLinecap="round" 
                  markerEnd="url(#arrow-aurora-neon)" 
                />
              </g>
            );
          }

          if (lineStyle === 'bezier-glow') {
            return (
              <g key={conn.id}>
                <path 
                  d={curvePath} 
                  stroke="url(#aurora-gradient-line)" 
                  strokeWidth="0.5" 
                  filter="url(#neon-glow-pink)" 
                  fill="none" 
                  strokeLinecap="round" 
                  markerEnd="url(#arrow-aurora-neon)" 
                />
              </g>
            );
          }

          if (lineStyle === 'neon-cyan') {
            return (
              <g key={conn.id}>
                {/* Outer Neon Glow */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#06b6d4" 
                  strokeWidth="0.75" 
                  filter="url(#neon-glow-cyan)" 
                  strokeLinecap="round" 
                  opacity="0.9"
                />
                {/* Bright Center Core */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#e0f2fe" 
                  strokeWidth="0.25" 
                  strokeLinecap="round" 
                  markerEnd="url(#arrow-cyan-neon)" 
                />
              </g>
            );
          }

          if (lineStyle === 'neon-amber') {
            return (
              <g key={conn.id}>
                {/* Outer Neon Glow */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#f59e0b" 
                  strokeWidth="0.75" 
                  filter="url(#neon-glow-amber)" 
                  strokeLinecap="round" 
                  opacity="0.9"
                />
                {/* Bright Center Core */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#fffbeb" 
                  strokeWidth="0.25" 
                  strokeLinecap="round" 
                  markerEnd="url(#arrow-amber-neon)" 
                />
              </g>
            );
          }

          if (lineStyle === 'solid-laser') {
            return (
              <g key={conn.id}>
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#ec4899" 
                  strokeWidth="0.45" 
                  strokeLinecap="round" 
                  markerEnd="url(#arrow-pink-neon)" 
                />
              </g>
            );
          }

          if (lineStyle === 'dashed-glow') {
            return (
              <g key={conn.id}>
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#f43f5e" 
                  strokeWidth="0.45" 
                  strokeDasharray="1.2, 0.8" 
                  filter="url(#neon-glow-pink)" 
                  markerEnd="url(#arrow-pink-neon)" 
                />
              </g>
            );
          }

          // Default: 'neon-pink'
          return (
            <g key={conn.id}>
              {/* Outer Neon Glow Tube */}
              <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="#f43f5e" 
                strokeWidth="0.75" 
                filter="url(#neon-glow-pink)" 
                strokeLinecap="round" 
                opacity="0.9"
              />
              {/* Ultra bright Center Core */}
              <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="#ffe4e6" 
                strokeWidth="0.25" 
                strokeLinecap="round" 
                markerEnd="url(#arrow-pink-neon)" 
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
              onMouseDown={handleCanvasMouseDown}
              onTouchStart={handleCanvasTouchStart}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
              onMouseLeave={handleDragEnd}
              className={`
                flex-1 w-full h-full relative overflow-hidden transition-colors duration-300 cursor-grab active:cursor-grabbing
                ${bgPattern === 'dots' ? 'bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] bg-[#070b19]' : ''}
                ${bgPattern === 'grid' ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:30px_30px] bg-slate-950/80' : ''}
                ${bgPattern === 'glass' ? 'bg-gradient-to-br from-[#0c0f24] to-[#04060f]' : ''}
              `}
            >
              
              {/* TRANSFORMABLE INFINITE ZOOM & PAN LAYER */}
              <div 
                className="w-full h-full relative origin-center transition-transform duration-75 ease-out select-none"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
                }}
              >
                {/* Dynamic visual connection lines SVG */}
                {renderSVGConnections(boardCards, boardConnections)}

                {/* RENDER CANVAS CARDS & MINIMAL TAGS */}
                {boardCards.map((card) => {
                  const palette = COLOR_PALETTES.find(p => p.id === card.color) || COLOR_PALETTES[0];
                  const isDragging = card.id === draggingCardId;

                  // SPECIAL MINIMAL VIEW FOR TAGS (Only Word + Color, No Title, No Description, No Color Dot)
                  if (card.type === 'tag') {
                    const tagText = card.title !== undefined ? card.title : (card.content !== undefined ? card.content : '');
                    const isPaletteOpen = openPaletteCardId === card.id;
                    const shapeConfig = TAG_SHAPES.find(s => s.id === card.shape) || TAG_SHAPES[0];
                    const borderConfig = TAG_BORDER_STYLES.find(b => b.id === card.borderStyle) || TAG_BORDER_STYLES[0];

                    return (
                      <div
                        key={card.id}
                        onMouseDown={(e) => handleCardDragStart(card.id, e)}
                        onTouchStart={(e) => handleCardTouchStart(card.id, e)}
                        onClick={() => handleCardConnectClick(card.id)}
                        className={`
                          absolute px-3.5 py-1.5 border shadow-lg backdrop-blur-xl transition-all duration-150 flex items-center gap-2 z-15 pointer-events-auto cursor-grab active:cursor-grabbing select-none group/tag canvas-card-item
                          ${shapeConfig.shapeClass}
                          ${borderConfig.borderClass}
                          ${palette.tagBg} ${palette.tagBorder} ${palette.tagGlow}
                          ${isDragging ? 'scale-105 z-35 ring-2 ring-pink-500 shadow-2xl' : 'hover:scale-[1.03]'}
                          ${connectionMode ? 'hover:ring-2 hover:ring-pink-400 cursor-pointer ring-1 ring-white/30 animate-pulse' : ''}
                          ${connectFromId === card.id ? 'ring-3 ring-pink-500 border-pink-400 scale-110 shadow-pink-500/50 shadow-xl' : ''}
                          ${isPaletteOpen ? 'z-40 ring-2 ring-white/70 shadow-pink-500/20' : ''}
                        `}
                        style={{ 
                          left: `${card.x}%`, 
                          top: `${card.y}%`
                        }}
                      >
                        {/* Pure Word / Tag Input - Can be completely erased without snap back */}
                        <input
                          type="text"
                          value={tagText}
                          onChange={(e) => handleUpdateCard({ ...card, title: e.target.value, content: e.target.value })}
                          placeholder="Nome da tag..."
                          className={`bg-transparent font-extrabold text-xs md:text-sm ${palette.tagText} placeholder-white/30 focus:outline-none text-left no-drag select-text tracking-wide`}
                          style={{ width: `${Math.max(65, Math.min(240, (tagText.length + 1) * 8.5))}px` }}
                        />

                        {/* Interactive Color, Shape & Border Switcher for Existing Tags */}
                        <div className="relative no-drag flex items-center shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setOpenPaletteCardId(isPaletteOpen ? null : card.id);
                            }}
                            className={`p-1 rounded-full transition-all cursor-pointer ${
                              isPaletteOpen 
                                ? 'bg-white/30 text-white scale-110 shadow-md ring-1 ring-white/40' 
                                : 'text-white/60 hover:text-white hover:bg-white/20'
                            }`}
                            title="Personalizar cor, formato e borda desta tag"
                          >
                            <Sliders size={12} />
                          </button>
                          
                          {/* Persistent Click-to-Open Customizer Popover for the Tag */}
                          {isPaletteOpen && (
                            <div 
                              onMouseDown={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 flex flex-col gap-2.5 bg-slate-950/98 border border-white/20 p-3 rounded-2xl shadow-2xl z-50 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 ring-1 ring-pink-500/50 min-w-[270px] select-none"
                            >
                              {/* Section 1: Colors */}
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                                  <span>Cor da Tag</span>
                                  <span className="text-[9px] text-pink-400 font-bold">{palette.name}</span>
                                </p>
                                <div className="flex items-center gap-1.5 justify-between">
                                  {COLOR_PALETTES.map(p => (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateCard({ ...card, color: p.id });
                                      }}
                                      className={`w-5 h-5 rounded-full ${p.dot} hover:scale-125 transition-transform cursor-pointer border border-white/20 ${
                                        card.color === p.id ? 'ring-2 ring-white scale-115 shadow-md shadow-pink-500/40' : 'opacity-70 hover:opacity-100'
                                      }`}
                                      title={p.name}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Section 2: Tag Shape / Format */}
                              <div className="border-t border-white/10 pt-2">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                                  <span>Formato da Tag</span>
                                  <span className="text-[9px] text-pink-400 font-bold">{shapeConfig.label}</span>
                                </p>
                                <div className="grid grid-cols-3 gap-1">
                                  {TAG_SHAPES.map(s => {
                                    const isActive = (card.shape || 'pill') === s.id;
                                    return (
                                      <button
                                        key={s.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateCard({ ...card, shape: s.id });
                                        }}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                          isActive 
                                            ? 'bg-pink-500/30 text-white border border-pink-500 shadow-sm' 
                                            : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                        title={s.label}
                                      >
                                        <span className="text-xs">{s.icon}</span>
                                        <span className="truncate">{s.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Section 3: Tag Border Style */}
                              <div className="border-t border-white/10 pt-2">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                                  <span>Estilo da Borda</span>
                                  <span className="text-[9px] text-pink-400 font-bold">{borderConfig.label}</span>
                                </p>
                                <div className="grid grid-cols-3 gap-1">
                                  {TAG_BORDER_STYLES.map(b => {
                                    const isActive = (card.borderStyle || 'solid') === b.id;
                                    return (
                                      <button
                                        key={b.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateCard({ ...card, borderStyle: b.id });
                                        }}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                          isActive 
                                            ? 'bg-pink-500/30 text-white border border-pink-500 shadow-sm' 
                                            : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                        title={b.label}
                                      >
                                        <span className="text-xs font-mono">{b.icon}</span>
                                        <span className="truncate">{b.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Delete Tag Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCard(card.id);
                          }}
                          className="text-white/40 hover:text-rose-400 transition-colors p-0.5 no-drag opacity-70 hover:opacity-100"
                          title="Remover Tag"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  }

                  // STANDARD FULL CARDS (Text, Checklist, Image, Link)
                  return (
                    <div
                      key={card.id}
                      onMouseDown={(e) => handleCardDragStart(card.id, e)}
                      onTouchStart={(e) => handleCardTouchStart(card.id, e)}
                      onClick={() => handleCardConnectClick(card.id)}
                      className={`
                        absolute w-64 border rounded-2xl shadow-xl backdrop-blur-md transition-shadow flex flex-col z-10 pointer-events-auto cursor-grab active:cursor-grabbing select-none text-left canvas-card-item
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
                            value={card.title ?? ''}
                            onChange={(e) => handleUpdateCard({ ...card, title: e.target.value })}
                            className="bg-transparent text-[11px] font-black text-white focus:outline-none w-44 placeholder-slate-400 select-text no-drag"
                            placeholder="Título da nota (opcional)..."
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
                            value={card.content ?? ''}
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
                                    value={task.text ?? ''}
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
                                const next = [...(card.checklist || []), { text: '', completed: false }];
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
                    <p className="text-[10px] text-slate-500">Adicione tags, palavras ou notas abaixo e comece a conectá-las.</p>
                  </div>
                )}
              </div>

              {/* FLOATING CONTROLS CONTEXT OVERLAY (Top-Left) */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5 select-none pointer-events-auto">
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

                {/* LINE STYLE SELECTOR POPOVER TRIGGER */}
                <div className="relative">
                  <button
                    onClick={() => setShowLineStyleMenu(!showLineStyleMenu)}
                    className="bg-slate-950/85 hover:bg-slate-900 border border-pink-500/30 hover:border-pink-500/60 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider text-pink-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all shadow-md"
                    title="Mudar estilo e efeito visual da linha de conexão"
                  >
                    <Zap size={13} className="text-pink-400" />
                    <span>Estilo Linha: {LINE_STYLES.find(s => s.id === lineStyle)?.label.split(' ')[1] || 'Neon'}</span>
                    <ChevronDown size={11} className={`transition-transform ${showLineStyleMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Line style dropdown menu */}
                  {showLineStyleMenu && (
                    <div className="absolute top-11 left-0 w-64 bg-slate-950/95 border border-white/20 backdrop-blur-2xl rounded-2xl p-2 z-50 shadow-2xl space-y-1">
                      <div className="px-2 py-1 border-b border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Escolha o Estilo das Ligações
                      </div>
                      {LINE_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setLineStyle(style.id);
                            setShowLineStyleMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-start gap-2.5 transition-all cursor-pointer ${
                            lineStyle === style.id ? 'bg-pink-500/20 text-white border border-pink-500/40' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="text-sm shrink-0">{style.icon}</span>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-extrabold">{style.label}</p>
                            <p className="text-[9px] text-slate-400 font-normal leading-tight">{style.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/80 border border-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-pink-400">{currentProject.title}</span>
                  <span className="h-3 w-px bg-white/20" />
                  <span className="text-[9px] uppercase font-bold text-slate-400">Total: {boardCards.length} blocos</span>
                </div>

                {connectionMode && (
                  <div className="bg-pink-500/20 border border-pink-500 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[10px] font-black text-pink-400 animate-pulse flex items-center gap-2">
                    <span>Modo Conectar: Clique em 2 tags ou notas para vinculá-las</span>
                    <button onClick={() => { setConnectionMode(false); setConnectFromId(null); }} className="hover:text-white font-bold shrink-0">&times;</button>
                  </div>
                )}
              </div>

              {/* FLOATING ZOOM & INFINITE CANVAS CONTROLS (Right Side) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 bg-slate-950/85 border border-white/15 backdrop-blur-2xl p-1.5 rounded-2xl shadow-2xl select-none pointer-events-auto">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="Aproximar Zoom (+)"
                >
                  <ZoomIn size={15} />
                </button>

                <button
                  onClick={handleZoomReset}
                  className="px-2 py-1 rounded-lg text-[9px] font-black text-pink-400 hover:bg-pink-500/20 transition-all cursor-pointer"
                  title="Resetar Zoom para 100%"
                >
                  {Math.round(zoom * 100)}%
                </button>

                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:scale-110 active:scale-95"
                  title="Distanciar Zoom (-)"
                >
                  <ZoomOut size={15} />
                </button>

                <div className="w-4 h-px bg-white/10 my-0.5" />

                <button
                  onClick={handleZoomReset}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:rotate-180 duration-300"
                  title="Centralizar e Enquadrar Quadro"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

            </div>

            {/* FLOATING CREATIVE CONTROLS TOOLBAR & MINIMIZED TOGGLE */}
            <AnimatePresence mode="wait">
              {isToolbarVisible ? (
                <motion.footer 
                  key="full-toolbar"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/92 border border-white/15 backdrop-blur-3xl px-4 sm:px-6 py-2.5 rounded-2xl flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 z-30 shadow-2xl shrink-0 pointer-events-auto max-w-[95vw]"
                >
                  {/* Quick card & tag creators list */}
                  <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-white/15">
                    <button
                      onClick={() => handleAddCard('tag')}
                      className="p-2 sm:p-2.5 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 rounded-xl text-pink-200 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-md hover:scale-[1.03] active:scale-95"
                      title="Criar nova Tag / Palavra com cor (sem necessidade de título ou descrição)"
                    >
                      <Tag size={13} className="text-pink-400" />
                      <span>+ Tag</span>
                    </button>

                    <button
                      onClick={() => handleAddCard('text')}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95"
                      title="Nova Nota Adesiva com Texto"
                    >
                      <FileText size={13} />
                      <span>Nota</span>
                    </button>

                    <button
                      onClick={() => handleAddCard('list')}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95"
                      title="Novo Quadro de Tarefas / Checklist"
                    >
                      <ListTodo size={13} />
                      <span>Lista</span>
                    </button>

                    <button
                      onClick={() => handleAddCard('image')}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer hidden md:flex active:scale-95"
                      title="Nova Imagem Inspiradora"
                    >
                      <ImageIcon size={13} />
                      <span>Imagem</span>
                    </button>

                    <button
                      onClick={() => handleAddCard('link')}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer hidden lg:flex active:scale-95"
                      title="Novo Link de Referência"
                    >
                      <Link2 size={13} />
                      <span>Link</span>
                    </button>
                  </div>

                  {/* Advanced Connection & Link Tools */}
                  <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-white/15">
                    <button
                      onClick={() => { setConnectionMode(!connectionMode); setConnectFromId(null); }}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                        connectionMode ? 'bg-pink-500/20 border-pink-500 text-pink-400 ring-2 ring-pink-500/50' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Ligar e conectar ideias, tags e notas"
                    >
                      <Sparkles size={13} />
                      <span>Conectar</span>
                    </button>

                    <button
                      onClick={() => setShowLineStyleMenu(!showLineStyleMenu)}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                        showLineStyleMenu ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Trocar Estilo da Linha (Neon, Laser, Curva, Aurora, etc.)"
                    >
                      <Zap size={13} className="text-pink-400" />
                      <span>Estilo Linha</span>
                    </button>

                    <button
                      onClick={handleClearConnections}
                      className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer"
                      title="Limpar apenas os fios e conexões"
                    >
                      Limpar Fios
                    </button>

                    <button
                      onClick={handleClearAllBoard}
                      className="p-2 sm:p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider text-rose-400 hover:text-rose-200 cursor-pointer flex items-center gap-1.5 transition-all"
                      title="Apagar todos os blocos, tags e conexões deste quadro"
                    >
                      <Trash2 size={13} />
                      <span>Apagar Tudo</span>
                    </button>
                  </div>

                  {/* Hide Toolbar Button */}
                  <button
                    onClick={() => setIsToolbarVisible(false)}
                    className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-pink-300 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.03]"
                    title="Ocultar Barra de Ferramentas"
                  >
                    <EyeOff size={13} />
                    <span className="hidden sm:inline">Ocultar</span>
                    <ChevronDown size={11} />
                  </button>
                </motion.footer>
              ) : (
                /* MINIMIZED FLOATING BUTTON TO RESTORE TOOLBAR */
                <motion.div
                  key="minimized-toolbar"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-auto"
                >
                  <button
                    onClick={() => setIsToolbarVisible(true)}
                    className="bg-slate-950/90 hover:bg-slate-900 border border-pink-500/40 hover:border-pink-500/70 backdrop-blur-2xl px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl text-[11px] font-black uppercase tracking-wider text-pink-300 hover:text-white cursor-pointer transition-all hover:scale-105 shadow-pink-500/10"
                    title="Expandir Barra de Ferramentas (Tags, Notas, Ligações)"
                  >
                    <ChevronUp size={14} className="text-pink-400 animate-bounce" />
                    <span>Mostrar Barra</span>
                    <span className="text-[9px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30 font-extrabold">
                      + Tag / Nota
                    </span>
                  </button>

                  {/* Quick one-click Tag button even while toolbar is minimized */}
                  <button
                    onClick={() => handleAddCard('tag')}
                    className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Adicionar Tag Rápida"
                  >
                    <Plus size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
