import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music, BookOpen, Film, Tv, Sparkles, Book, Gamepad2, Folder,
  Search, Plus, Heart, Calendar, Link as LinkIcon, Trash2, Edit3,
  MoreVertical, Check, X, Upload, Star, ArrowLeft, Download, Eye,
  Play, List, FileText, ChevronRight, Settings, ExternalLink
} from 'lucide-react';
import {
  CatalogsState, CustomCatalog, CustomCatalogItem,
  ChurchSong, SongRepertoire, CatalogFieldDefinition
} from '../types';

// Preset icons mapping
const ICON_MAP: { [key: string]: React.ComponentType<any> } = {
  Music, BookOpen, Film, Tv, Sparkles, Book, Gamepad2, Folder
};

interface CatalogsSectionProps {
  catalogsState?: CatalogsState;
  onUpdateCatalogs: (updater: (prev: CatalogsState) => CatalogsState) => void;
}

// Default initial state
export const DEFAULT_CATALOGS_STATE: CatalogsState = {
  songs: [
    {
      id: '1',
      name: 'Porque Ele Vive',
      artist: 'Harpa Cristã',
      composer: 'Gloria Gaither / William J. Gaither',
      key: 'G',
      capo: 'Sem Capo',
      youtubeUrl: 'https://www.youtube.com/watch?v=123',
      notes: 'Hino clássico para o culto de Ceia e ressurreição.',
      categories: ['Ceia', 'Gratidão', 'Cruz', 'Cristo'],
      isFavorite: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'A Casa É Sua',
      artist: 'Casa Worship',
      composer: 'Arnaldo Lafaete',
      key: 'G',
      capo: 'Sem Capo',
      youtubeUrl: 'https://www.youtube.com/watch?v=456',
      notes: 'Ministração espontânea forte no avivamento.',
      categories: ['Adoração', 'Avivamento', 'Espírito Santo'],
      isFavorite: false,
      createdAt: new Date().toISOString()
    }
  ],
  songCategories: [
    'Adoração', 'Louvor', 'Ceia', 'Gratidão', 'Avivamento',
    'Espírito Santo', 'Cruz', 'Cristo', 'Evangelismo',
    'Oração', 'Comunhão', 'Missões', 'Abertura', 'Encerramento',
    'Natal', 'Páscoa'
  ],
  repertoires: [
    {
      id: 'r1',
      name: 'Culto de Domingo Noite',
      songIds: ['2', '1'],
      createdAt: new Date().toISOString()
    }
  ],
  customCatalogs: [
    {
      id: 'bible_studies',
      name: 'Estudos Bíblicos',
      icon: 'BookOpen',
      fields: [
        { id: 'passage', name: 'Versículo Chave', type: 'text', isRequired: true },
        { id: 'theme', name: 'Tema Principal', type: 'text' },
        { id: 'author', name: 'Autor/Pregador', type: 'text' }
      ],
      categories: ['Teologia', 'Devocional', 'Escola Dominical']
    },
    {
      id: 'books',
      name: 'Livros',
      icon: 'Book',
      fields: [
        { id: 'author', name: 'Autor', type: 'text', isRequired: true },
        { id: 'progress', name: 'Progresso', type: 'select', options: ['Quero Ler', 'Lendo', 'Lido'] },
        { id: 'rating', name: 'Avaliação', type: 'rating' }
      ],
      categories: ['Teologia', 'Ficção', 'Produtividade', 'Biografia']
    },
    {
      id: 'movies',
      name: 'Filmes',
      icon: 'Film',
      fields: [
        { id: 'director', name: 'Diretor', type: 'text' },
        { id: 'rating', name: 'Avaliação', type: 'rating' },
        { id: 'platform', name: 'Onde Assistir', type: 'text' }
      ],
      categories: ['Ação', 'Drama', 'Ficção Científica', 'Cristão']
    }
  ],
  customItems: [
    {
      id: 'item1',
      catalogId: 'books',
      name: 'Cristianismo Puro e Simples',
      categories: ['Teologia'],
      isFavorite: true,
      fieldValues: {
        author: 'C.S. Lewis',
        progress: 'Lido',
        rating: 5
      },
      notes: 'Um dos melhores livros sobre a essência da fé cristã.',
      createdAt: new Date().toISOString()
    }
  ]
};

export default function CatalogsSection({ catalogsState, onUpdateCatalogs }: CatalogsSectionProps) {
  const state: CatalogsState = {
    songs: catalogsState?.songs ?? DEFAULT_CATALOGS_STATE.songs ?? [],
    songCategories: catalogsState?.songCategories ?? DEFAULT_CATALOGS_STATE.songCategories ?? [],
    repertoires: catalogsState?.repertoires ?? DEFAULT_CATALOGS_STATE.repertoires ?? [],
    customCatalogs: catalogsState?.customCatalogs ?? DEFAULT_CATALOGS_STATE.customCatalogs ?? [],
    customItems: catalogsState?.customItems ?? DEFAULT_CATALOGS_STATE.customItems ?? []
  };

  // View state: 'home' | 'church_songs' | 'custom_catalog'
  const [activeView, setActiveView] = useState<'home' | 'church_songs' | 'custom_catalog'>('home');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');

  // Global search input
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Dropdown states
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<'create_catalog' | 'edit_catalog' | 'edit_categories' | 'import_export' | 'add_song' | 'add_custom_item' | 'manage_repertoire' | 'song_details' | 'custom_item_details' | null>(null);

  // Selected details targets
  const [selectedSong, setSelectedSong] = useState<ChurchSong | null>(null);
  const [selectedItem, setSelectedItem] = useState<CustomCatalogItem | null>(null);

  // Form states - Catalog structures
  const [catalogForm, setCatalogForm] = useState<{
    id: string;
    name: string;
    icon: string;
    categories: string;
    fields: CatalogFieldDefinition[];
  }>({
    id: '',
    name: '',
    icon: 'Folder',
    categories: '',
    fields: []
  });

  // Form states - Church Song
  const [songForm, setSongForm] = useState<{
    id?: string;
    name: string;
    artist: string;
    composer: string;
    key: string;
    capo: string;
    youtubeUrl: string;
    notes: string;
    categories: string[];
    style: string;
  }>({
    name: '',
    artist: '',
    composer: '',
    key: '',
    capo: '',
    youtubeUrl: '',
    notes: '',
    categories: [],
    style: 'Louvor'
  });

  // Repertoire Form States
  const [repertoireName, setRepertoireName] = useState('');
  const [selectedRepertoire, setSelectedRepertoire] = useState<SongRepertoire | null>(null);

  // Form states - Custom item
  const [customItemForm, setCustomItemForm] = useState<{
    id?: string;
    name: string;
    categories: string[];
    fieldValues: { [key: string]: any };
    notes: string;
    imageUrl?: string;
  }>({
    name: '',
    categories: [],
    fieldValues: {},
    notes: '',
    imageUrl: ''
  });

  // Dynamic filter state for church songs
  const [songFilters, setSongFilters] = useState({
    search: '',
    artist: '',
    category: '',
    key: '',
    style: '',
    onlyFavorites: false
  });

  // Dynamic filter state for custom catalogs
  const [customFilters, setCustomFilters] = useState({
    search: '',
    category: '',
    onlyFavorites: false
  });

  // Church Song Sub-Tabs
  const [songSubTab, setSongSubTab] = useState<'all' | 'favorites' | 'repertoires'>('all');

  // Load state and safely return it
  const updateState = (updater: (prev: CatalogsState) => CatalogsState) => {
    onUpdateCatalogs(updater);
  };

  // Convert File to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset categories admin
  const [editingSongCategoriesText, setEditingSongCategoriesText] = useState(state.songCategories.join(', '));

  // Dynamic fields lists
  const currentCatalog = useMemo(() => {
    return state.customCatalogs.find(c => c.id === selectedCatalogId);
  }, [state.customCatalogs, selectedCatalogId]);

  // Global Search results
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase();
    const results: Array<{
      type: 'song' | 'custom_item';
      id: string;
      title: string;
      subtitle: string;
      catalogName: string;
      catalogId: string;
      originalItem: any;
    }> = [];

    // Search in songs
    state.songs.forEach(song => {
      if (
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        (song.composer && song.composer.toLowerCase().includes(query)) ||
        song.categories.some(c => c.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'song',
          id: song.id,
          title: song.name,
          subtitle: `Música da Igreja • ${song.artist}`,
          catalogName: 'Músicas da Igreja',
          catalogId: 'church_songs',
          originalItem: song
        });
      }
    });

    // Search in custom catalogs items
    state.customItems.forEach(item => {
      const catalog = state.customCatalogs.find(c => c.id === item.catalogId);
      const catalogName = catalog ? catalog.name : 'Catálogo';
      const textValues = Object.values(item.fieldValues).map(v => String(v).toLowerCase());
      
      if (
        item.name.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query)) ||
        item.categories.some(c => c.toLowerCase().includes(query)) ||
        textValues.some(v => v.includes(query))
      ) {
        results.push({
          type: 'custom_item',
          id: item.id,
          title: item.name,
          subtitle: `${catalogName} • ${item.categories.join(', ')}`,
          catalogName: catalogName,
          catalogId: item.catalogId,
          originalItem: item
        });
      }
    });

    return results;
  }, [globalSearchQuery, state]);

  // Filters for church songs
  const filteredSongs = useMemo(() => {
    return state.songs.filter(song => {
      const matchesSearch = !songFilters.search || 
        song.name.toLowerCase().includes(songFilters.search.toLowerCase()) || 
        song.artist.toLowerCase().includes(songFilters.search.toLowerCase()) ||
        (song.composer && song.composer.toLowerCase().includes(songFilters.search.toLowerCase())) ||
        (song.style && song.style.toLowerCase().includes(songFilters.search.toLowerCase()));
      const matchesArtist = !songFilters.artist || song.artist === songFilters.artist;
      const matchesCategory = !songFilters.category || song.categories.includes(songFilters.category);
      const matchesKey = !songFilters.key || song.key === songFilters.key;
      const matchesFavorites = !songFilters.onlyFavorites || song.isFavorite;
      const matchesStyle = !songFilters.style || song.style === songFilters.style;
      
      return matchesSearch && matchesArtist && matchesCategory && matchesKey && matchesFavorites && matchesStyle;
    });
  }, [state.songs, songFilters]);

  // Unique artists for filtering
  const songArtists = useMemo(() => {
    return Array.from(new Set(state.songs.map(s => s.artist))).filter(Boolean);
  }, [state.songs]);

  // Suggested artists combining dynamic list and popular presets
  const suggestedArtists = useMemo(() => {
    const presets = [
      'Harpa Cristã',
      'Gabriela Rocha',
      'Fernandinho',
      'Morada',
      'Casa Worship',
      'Kemuel',
      'Nívea Soares',
      'Ministério Zoe',
      'Diante do Trono',
      'Aline Barros',
      'Isadora Pompeo',
      'Preto no Branco',
      'Alessandro Vilas Boas',
      'Felipe Valente'
    ];
    return Array.from(new Set([...presets, ...songArtists])).sort();
  }, [songArtists]);

  // Filters for custom catalog items
  const filteredCustomItems = useMemo(() => {
    return state.customItems.filter(item => {
      if (item.catalogId !== selectedCatalogId) return false;
      const matchesSearch = !customFilters.search || item.name.toLowerCase().includes(customFilters.search.toLowerCase()) || (item.notes && item.notes.toLowerCase().includes(customFilters.search.toLowerCase()));
      const matchesCategory = !customFilters.category || item.categories.includes(customFilters.category);
      const matchesFavorites = !customFilters.onlyFavorites || item.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [state.customItems, selectedCatalogId, customFilters]);

  // Manage Catalogs operations
  const handleSaveCatalog = () => {
    if (!catalogForm.name.trim()) return;
    const isEditing = state.customCatalogs.some(c => c.id === catalogForm.id);

    updateState(prev => {
      const catalogs = [...prev.customCatalogs];
      const categoriesArray = catalogForm.categories
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (isEditing) {
        const idx = catalogs.findIndex(c => c.id === catalogForm.id);
        catalogs[idx] = {
          ...catalogs[idx],
          name: catalogForm.name.trim(),
          icon: catalogForm.icon,
          categories: categoriesArray,
          fields: catalogForm.fields
        };
      } else {
        const newId = catalogForm.id.trim() || `catalog_${Date.now()}`;
        catalogs.push({
          id: newId,
          name: catalogForm.name.trim(),
          icon: catalogForm.icon,
          categories: categoriesArray,
          fields: catalogForm.fields
        });
      }

      return { ...prev, customCatalogs: catalogs };
    });

    setActiveModal(null);
  };

  const handleDeleteCatalog = (id: string) => {
    if (confirm('Deseja realmente excluir este catálogo e todos os seus itens?')) {
      updateState(prev => {
        return {
          ...prev,
          customCatalogs: prev.customCatalogs.filter(c => c.id !== id),
          customItems: prev.customItems.filter(item => item.catalogId !== id)
        };
      });
      if (selectedCatalogId === id) {
        setActiveView('home');
      }
    }
  };

  // Manage Church Songs operations
  const handleSaveSong = () => {
    if (!songForm.name.trim() || !songForm.artist.trim()) return;
    updateState(prev => {
      const songs = [...prev.songs];
      if (songForm.id) {
        const idx = songs.findIndex(s => s.id === songForm.id);
        songs[idx] = {
          ...songs[idx],
          name: songForm.name.trim(),
          artist: songForm.artist.trim(),
          composer: songForm.composer.trim() || undefined,
          key: songForm.key.trim() || undefined,
          capo: songForm.capo.trim() || undefined,
          youtubeUrl: songForm.youtubeUrl.trim() || undefined,
          notes: songForm.notes.trim() || undefined,
          categories: songForm.categories,
          style: songForm.style || 'Louvor'
        };
      } else {
        songs.push({
          id: `song_${Date.now()}`,
          name: songForm.name.trim(),
          artist: songForm.artist.trim(),
          composer: songForm.composer.trim() || undefined,
          key: songForm.key.trim() || undefined,
          capo: songForm.capo.trim() || undefined,
          youtubeUrl: songForm.youtubeUrl.trim() || undefined,
          notes: songForm.notes.trim() || undefined,
          categories: songForm.categories,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          style: songForm.style || 'Louvor'
        });
      }
      return { ...prev, songs };
    });
    setActiveModal(null);
  };

  const handleToggleFavoriteSong = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    updateState(prev => {
      const songs = prev.songs ?? DEFAULT_CATALOGS_STATE.songs ?? [];
      return {
        ...prev,
        songs: songs.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)
      };
    });
  };

  const handleDeleteSong = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (confirm('Tem certeza que deseja excluir esta música do catálogo?')) {
      updateState(prev => {
        const songs = prev.songs ?? DEFAULT_CATALOGS_STATE.songs ?? [];
        const repertoires = prev.repertoires ?? DEFAULT_CATALOGS_STATE.repertoires ?? [];
        return {
          ...prev,
          songs: songs.filter(s => s.id !== id),
          repertoires: repertoires.map(r => ({
            ...r,
            songIds: (r.songIds ?? []).filter(sid => sid !== id)
          }))
        };
      });
      if (selectedSong?.id === id) setSelectedSong(null);
    }
  };

  // Repertoires
  const handleSaveRepertoire = () => {
    if (!repertoireName.trim()) return;
    updateState(prev => {
      const repertoires = [...prev.repertoires];
      if (selectedRepertoire) {
        const idx = repertoires.findIndex(r => r.id === selectedRepertoire.id);
        repertoires[idx] = {
          ...repertoires[idx],
          name: repertoireName.trim()
        };
      } else {
        repertoires.push({
          id: `rep_${Date.now()}`,
          name: repertoireName.trim(),
          songIds: [],
          createdAt: new Date().toISOString()
        });
      }
      return { ...prev, repertoires };
    });
    setRepertoireName('');
    setSelectedRepertoire(null);
  };

  const handleDeleteRepertoire = (id: string) => {
    if (confirm('Excluir este repertório? (As músicas não serão apagadas do catálogo global)')) {
      updateState(prev => ({
        ...prev,
        repertoires: prev.repertoires.filter(r => r.id !== id)
      }));
      setSelectedRepertoire(null);
    }
  };

  const handleAddSongToRepertoire = (repertoireId: string, songId: string) => {
    updateState(prev => {
      return {
        ...prev,
        repertoires: prev.repertoires.map(r => {
          if (r.id === repertoireId) {
            if (r.songIds.includes(songId)) return r;
            return { ...r, songIds: [...r.songIds, songId] };
          }
          return r;
        })
      };
    });
  };

  const handleRemoveSongFromRepertoire = (repertoireId: string, songId: string) => {
    updateState(prev => {
      return {
        ...prev,
        repertoires: prev.repertoires.map(r => {
          if (r.id === repertoireId) {
            return { ...r, songIds: r.songIds.filter(id => id !== songId) };
          }
          return r;
        })
      };
    });
  };

  // Custom Items
  const handleSaveCustomItem = () => {
    if (!customItemForm.name.trim()) return;
    updateState(prev => {
      const items = [...prev.customItems];
      if (customItemForm.id) {
        const idx = items.findIndex(i => i.id === customItemForm.id);
        items[idx] = {
          ...items[idx],
          name: customItemForm.name.trim(),
          categories: customItemForm.categories,
          fieldValues: customItemForm.fieldValues,
          notes: customItemForm.notes.trim() || undefined,
          imageUrl: customItemForm.imageUrl || undefined
        };
      } else {
        items.push({
          id: `item_${Date.now()}`,
          catalogId: selectedCatalogId,
          name: customItemForm.name.trim(),
          categories: customItemForm.categories,
          fieldValues: customItemForm.fieldValues,
          isFavorite: false,
          notes: customItemForm.notes.trim() || undefined,
          imageUrl: customItemForm.imageUrl || undefined,
          createdAt: new Date().toISOString()
        });
      }
      return { ...prev, customItems: items };
    });
    setActiveModal(null);
  };

  const handleToggleFavoriteItem = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    updateState(prev => {
      const customItems = prev.customItems ?? DEFAULT_CATALOGS_STATE.customItems ?? [];
      return {
        ...prev,
        customItems: customItems.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)
      };
    });
  };

  const handleDeleteCustomItem = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (confirm('Deseja realmente excluir este item?')) {
      updateState(prev => {
        const customItems = prev.customItems ?? DEFAULT_CATALOGS_STATE.customItems ?? [];
        return {
          ...prev,
          customItems: customItems.filter(item => item.id !== id)
        };
      });
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  // Export Data JSON helper
  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meu_painel_de_vida_catalogos_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import Data JSON helper
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && (parsed.songs || parsed.customCatalogs)) {
            updateState(() => parsed);
            alert('Dados importados com sucesso!');
            setActiveModal(null);
          } else {
            alert('Formato de JSON inválido. Certifique se é um backup de Catálogos válido.');
          }
        } catch (err) {
          alert('Erro ao processar arquivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Helper categories string save
  const handleSaveSongCategories = () => {
    const cats = editingSongCategoriesText
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    
    updateState(prev => ({
      ...prev,
      songCategories: cats
    }));
    setActiveModal(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header and discrete action bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div className="text-left">
          <div className="flex items-center gap-2">
            {activeView !== 'home' && (
              <button
                onClick={() => {
                  setActiveView('home');
                  setGlobalSearchQuery('');
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all mr-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              📂 Catálogos
              {activeView === 'church_songs' && <span className="text-sm font-semibold text-violet-500 bg-violet-50 dark:bg-violet-950/45 px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-900/50">Músicas da Igreja</span>}
              {activeView === 'custom_catalog' && currentCatalog && <span className="text-sm font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/45 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">{currentCatalog.name}</span>}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Coleções organizadas, rápidas e totalmente personalizáveis.</p>
        </div>

        {/* Global actions & discrete administrative button (⋮) */}
        <div className="flex items-center gap-2 self-stretch md:self-auto relative" ref={dropdownRef}>
          {activeView === 'home' && (
            <div className="relative flex-1 md:flex-initial">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisa global..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full md:w-56 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-violet-500 dark:text-white"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          )}

          {/* Single Discrete Dropdown Action Button (⋮) */}
          <button
            onClick={() => setAdminMenuOpen(!adminMenuOpen)}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-650 dark:text-slate-300 transition-all cursor-pointer"
            title="Administração"
          >
            <MoreVertical size={16} />
          </button>

          {/* Discrete administration dropdown menu content */}
          <AnimatePresence>
            {adminMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl p-2 text-left"
              >
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-850 mb-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Gestão do Módulo</span>
                </div>
                
                <button
                  onClick={() => {
                    setCatalogForm({ id: '', name: '', icon: 'Folder', categories: '', fields: [] });
                    setActiveModal('create_catalog');
                    setAdminMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus size={14} className="text-emerald-500" />
                  <span>Criar Novo Catálogo</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSongCategoriesText(state.songCategories.join(', '));
                    setActiveModal('edit_categories');
                    setAdminMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer"
                >
                  <Settings size={14} className="text-violet-500" />
                  <span>Categorias de Músicas</span>
                </button>

                {state.customCatalogs.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-850 my-1 py-1">
                    <span className="px-2.5 py-1 block text-[9px] uppercase font-black text-slate-400 tracking-wider">Catálogos Existentes</span>
                    {state.customCatalogs.map(c => {
                      const Icon = ICON_MAP[c.icon] || Folder;
                      return (
                        <div key={c.id} className="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg">
                          <span className="truncate font-semibold text-slate-705 dark:text-slate-350 flex items-center gap-1">
                            <Icon size={12} className="text-slate-400" />
                            {c.name}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setCatalogForm({
                                  id: c.id,
                                  name: c.name,
                                  icon: c.icon,
                                  categories: c.categories.join(', '),
                                  fields: c.fields
                                });
                                setActiveModal('create_catalog');
                                setAdminMenuOpen(false);
                              }}
                              className="p-1 hover:text-indigo-500"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteCatalog(c.id);
                                setAdminMenuOpen(false);
                              }}
                              className="p-1 hover:text-rose-500"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-850 mt-1 pt-1.5">
                  <button
                    onClick={() => {
                      handleExportData();
                      setAdminMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-blue-500" />
                    <span>Exportar Backup (JSON)</span>
                  </button>
                  <label className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer">
                    <Upload size={13} className="text-amber-500" />
                    <span>Importar Backup</span>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Search Results overlay view */}
      {globalSearchQuery.trim().length > 0 && activeView === 'home' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 text-left space-y-4 shadow-sm animate-fade-in">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Search size={16} />
            Resultado da Pesquisa Global ({globalSearchResults.length})
          </h2>
          {globalSearchResults.length === 0 ? (
            <p className="text-xs text-slate-450 italic py-6 text-center">Nenhum item encontrado com o termo "{globalSearchQuery}".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {globalSearchResults.map(res => (
                <div
                  key={`${res.type}_${res.id}`}
                  onClick={() => {
                    if (res.type === 'song') {
                      setSelectedSong(res.originalItem);
                      setActiveModal('song_details');
                    } else {
                      setSelectedItem(res.originalItem);
                      setSelectedCatalogId(res.catalogId);
                      setActiveModal('custom_item_details');
                    }
                  }}
                  className="p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-850 rounded-2xl cursor-pointer transition-all flex justify-between items-center group shadow-2xs"
                >
                  <div className="text-left space-y-1">
                    <span className="text-[9px] uppercase font-black text-indigo-500 tracking-wider bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">{res.catalogName}</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors mt-1">{res.title}</h4>
                    <p className="text-xs text-slate-500">{res.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RENDER ACTIVE VIEW */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: HOME TELA INICIAL (Showing only catalog cards) */}
        {activeView === 'home' && !globalSearchQuery && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* GRID OF PREDEFINED AND CUSTOM CATALOGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Specialized Músicas da Igreja Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => {
                  setActiveView('church_songs');
                  setSongFilters({ search: '', artist: '', category: '', key: '', onlyFavorites: false });
                  setSongSubTab('all');
                }}
                className="p-6 bg-white dark:bg-slate-900 border-2 border-violet-500/20 hover:border-violet-500 dark:border-violet-950/50 dark:hover:border-violet-500 rounded-3xl text-left shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden group"
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-violet-500/[0.04] rounded-full blur-xl group-hover:scale-125 transition-transform" />
                <div className="flex justify-between items-start">
                  <div className="p-3.5 bg-violet-50 dark:bg-violet-950/40 rounded-2xl text-violet-500 group-hover:scale-110 transition-all duration-300 shadow-3xs">
                    <Music size={26} />
                  </div>
                  <span className="text-[10px] font-black font-mono bg-violet-100/50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-3xs">
                    {state.songs.length} Itens
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-850 dark:text-white group-hover:text-violet-500 transition-colors tracking-tight">Músicas da Igreja</h3>
                  <p className="text-xs text-slate-450 mt-1 line-clamp-2">Tom, capotraste, repertórios de culto, cantor e categorias.</p>
                </div>
              </motion.div>

              {/* Custom and Default Catalogs Map */}
              {state.customCatalogs.map(catalog => {
                const IconComp = ICON_MAP[catalog.icon] || Folder;
                const itemsCount = state.customItems.filter(item => item.catalogId === catalog.id).length;

                return (
                  <motion.div
                    key={catalog.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => {
                      setSelectedCatalogId(catalog.id);
                      setCustomFilters({ search: '', category: '', onlyFavorites: false });
                      setActiveView('custom_catalog');
                    }}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-3xl text-left shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden group"
                  >
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/[0.04] rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    <div className="flex justify-between items-start">
                      <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-500 group-hover:scale-110 transition-all duration-300 shadow-3xs">
                        <IconComp size={26} />
                      </div>
                      <span className="text-[10px] font-black font-mono bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200/50 dark:border-slate-800">
                        {itemsCount} Itens
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-850 dark:text-white group-hover:text-indigo-500 transition-colors tracking-tight">{catalog.name}</h3>
                      <p className="text-xs text-slate-450 mt-1 line-clamp-2">Campos customizados, categorias exclusivas e favoritos.</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Fast Card button to add new Catalog */}
              <button
                onClick={() => {
                  setCatalogForm({ id: '', name: '', icon: 'Folder', categories: '', fields: [] });
                  setActiveModal('create_catalog');
                }}
                className="p-6 bg-slate-100/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/85 border border-dashed border-slate-250 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-3xl text-center shadow-3xs transition-all cursor-pointer flex flex-col items-center justify-center gap-3.5 h-48 group"
              >
                <div className="p-3 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 group-hover:scale-110 transition-all rounded-full border dark:border-slate-850 shadow-3xs">
                  <Plus size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-indigo-500">Novo Catálogo</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Defina seus próprios campos e categorias.</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: MÚSICAS DA IGREJA DETAIL VIEW */}
        {activeView === 'church_songs' && (
          <motion.div
            key="church_songs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Sliding Sub-Tab Selector for church songs */}
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex p-1 bg-slate-100/90 dark:bg-slate-900 border dark:border-slate-850 rounded-2xl">
                <button
                  onClick={() => setSongSubTab('all')}
                  className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    songSubTab === 'all'
                      ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <List size={14} />
                  <span>Músicas</span>
                </button>
                <button
                  onClick={() => setSongSubTab('favorites')}
                  className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    songSubTab === 'favorites'
                      ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Heart size={14} className="fill-rose-500 text-rose-500" />
                  <span>Favoritas</span>
                </button>
                <button
                  onClick={() => setSongSubTab('repertoires')}
                  className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    songSubTab === 'repertoires'
                      ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  <span>Repertórios</span>
                </button>
              </div>

              <div className="flex gap-2">
                {songSubTab === 'repertoires' ? (
                  <button
                    onClick={() => {
                      setSelectedRepertoire(null);
                      setRepertoireName('');
                      setActiveModal('manage_repertoire');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-650 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                  >
                    <Plus size={14} />
                    <span>Criar Repertório</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSongForm({ name: '', artist: '', composer: '', key: '', capo: '', youtubeUrl: '', notes: '', categories: [], style: 'Louvor' });
                      setActiveModal('add_song');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-650 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                  >
                    <Plus size={14} />
                    <span>Cadastrar Música</span>
                  </button>
                )}
              </div>
            </div>

            {/* CHURCH SONGS CONTENT */}
            {songSubTab !== 'repertoires' ? (
              <div className="space-y-4 text-left">
                {/* ADVANCED MULTI-CRITERIA FILTERS BAR */}
                <div className="bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-3xl space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Filter 1: Quick text search */}
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 block mb-1">Pesquisar por Nome/Compositor/Estilo</label>
                      <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={songFilters.search}
                          onChange={(e) => setSongFilters({ ...songFilters, search: e.target.value })}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Filter 2: Artist selector */}
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 block mb-1">Cantor ou Banda</label>
                      <select
                        value={songFilters.artist}
                        onChange={(e) => setSongFilters({ ...songFilters, artist: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                      >
                        <option value="">Todos os Cantores</option>
                        {songArtists.map(artist => (
                          <option key={artist} value={artist}>{artist}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter 3: Category selector */}
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 block mb-1">Categoria/Tema</label>
                      <select
                        value={songFilters.category}
                        onChange={(e) => setSongFilters({ ...songFilters, category: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                      >
                        <option value="">Todas as Categorias</option>
                        {state.songCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter 4: Style (Estilo/Momento) */}
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 block mb-1">Estilo / Momento</label>
                      <select
                        value={songFilters.style}
                        onChange={(e) => setSongFilters({ ...songFilters, style: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                      >
                        <option value="">Todos os Estilos</option>
                        <option value="Louvor">Louvor</option>
                        <option value="Adoração">Adoração</option>
                        <option value="Celebração">Celebração</option>
                        <option value="Abertura">Abertura</option>
                        <option value="Encerramento">Encerramento</option>
                        <option value="Ceia">Santa Ceia</option>
                        <option value="Dízimo/Oferta">Dízimo / Ofertas</option>
                        <option value="Outro">Outros</option>
                      </select>
                    </div>

                    {/* Filter 5: Musical Key (Tom) */}
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 block mb-1">Tom Musical</label>
                      <select
                        value={songFilters.key}
                        onChange={(e) => setSongFilters({ ...songFilters, key: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-violet-500 dark:text-white"
                      >
                        <option value="">Qualquer Tom</option>
                        {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm'].map(keyVal => (
                          <option key={keyVal} value={keyVal}>{keyVal}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reset filters helper indicator */}
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-2 text-xs">
                    <span className="text-slate-400 text-[10px] font-semibold">Exibindo {filteredSongs.length} de {state.songs.length} músicas</span>
                    {(songFilters.search || songFilters.artist || songFilters.category || songFilters.key || songFilters.style) && (
                      <button
                        onClick={() => setSongFilters({ search: '', artist: '', category: '', key: '', style: '', onlyFavorites: false })}
                        className="text-violet-500 hover:text-violet-750 font-bold hover:underline transition-colors cursor-pointer"
                      >
                        Limpar todos os filtros
                      </button>
                    )}
                  </div>
                </div>

                {/* SONGS CARDS / LIST */}
                {filteredSongs.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl">
                    <Music className="mx-auto text-slate-350 dark:text-slate-650" size={32} />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Nenhuma música atende aos filtros</h3>
                    <p className="text-xs text-slate-400 mt-1">Experimente remover ou alterar os critérios de busca.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSongs.map(song => (
                      <div
                        key={song.id}
                        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all hover:border-violet-300 dark:hover:border-violet-950 relative group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div
                            onClick={() => {
                              setSelectedSong(song);
                              setActiveModal('song_details');
                            }}
                            className="text-left space-y-1 cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-violet-500 transition-colors">{song.name}</h4>
                              {song.style && (
                                <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                                  song.style === 'Adoração'
                                    ? 'bg-violet-50 text-violet-600 border-violet-150 dark:bg-violet-950/50 dark:text-violet-350 dark:border-violet-900/30'
                                    : song.style === 'Louvor'
                                    ? 'bg-sky-50 text-sky-600 border-sky-150 dark:bg-sky-950/50 dark:text-sky-350 dark:border-sky-900/30'
                                    : song.style === 'Celebração'
                                    ? 'bg-amber-50 text-amber-600 border-amber-150 dark:bg-amber-950/50 dark:text-amber-350 dark:border-amber-900/30'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                                }`}>
                                  {song.style}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-bold">{song.artist}</p>
                            {song.composer && <p className="text-[10px] text-slate-400">Comp: {song.composer}</p>}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleFavoriteSong(song.id)}
                              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                            >
                              <Star size={15} className={song.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'} />
                            </button>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setSongForm({
                                    id: song.id,
                                    name: song.name,
                                    artist: song.artist,
                                    composer: song.composer || '',
                                    key: song.key || '',
                                    capo: song.capo || '',
                                    youtubeUrl: song.youtubeUrl || '',
                                    notes: song.notes || '',
                                    categories: song.categories,
                                    style: song.style || 'Louvor'
                                  });
                                  setActiveModal('add_song');
                                }}
                                className="p-1 text-slate-400 hover:text-indigo-500 rounded-lg"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSong(song.id, e)}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Badges for Tom, Capo, YouTube and Categories */}
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850">
                          {song.key && (
                            <span className="text-[10px] font-black font-mono bg-violet-50 dark:bg-violet-950/45 text-violet-600 dark:text-violet-350 border border-violet-100 dark:border-violet-900/40 px-2 py-0.5 rounded-md">
                              Tom: {song.key}
                            </span>
                          )}
                          {song.capo && (
                            <span className="text-[10px] font-semibold font-mono bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-350 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-md">
                              Capo: {song.capo}
                            </span>
                          )}
                          {song.youtubeUrl && (
                            <a
                              href={song.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/45 text-rose-500 border border-rose-100 dark:border-rose-900/40 px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition-colors"
                            >
                              YouTube <ExternalLink size={10} />
                            </a>
                          )}
                          {song.categories.map(c => (
                            <span key={c} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-850">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* REPERTOIRES CONTENT */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                {/* Left side: List of Repertoires */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest px-1">Repertórios Criados</h3>
                  {state.repertoires.length === 0 ? (
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl text-center">
                      <p className="text-xs text-slate-400 italic">Nenhum repertório criado.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {state.repertoires.map(rep => {
                        const isSelected = selectedRepertoire?.id === rep.id;
                        return (
                          <div
                            key={rep.id}
                            onClick={() => {
                              setSelectedRepertoire(rep);
                              setRepertoireName(rep.name);
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                              isSelected
                                ? 'bg-violet-50 dark:bg-violet-950/45 border-violet-500 text-violet-600 dark:text-violet-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black">{rep.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold">{rep.songIds.length} músicas salvas</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRepertoire(rep);
                                  setRepertoireName(rep.name);
                                  setActiveModal('manage_repertoire');
                                }}
                                className="p-1 hover:text-indigo-500 rounded"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRepertoire(rep.id);
                                }}
                                className="p-1 hover:text-rose-500 rounded"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right side: Repertoire Details and Song Management */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl space-y-5">
                  {selectedRepertoire ? (
                    <>
                      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-850">
                        <div>
                          <h3 className="text-base font-black text-slate-800 dark:text-white">{selectedRepertoire.name}</h3>
                          <p className="text-xs text-slate-450 mt-0.5">Organize as músicas deste repertório sem duplicar dados.</p>
                        </div>
                        <span className="text-[10px] font-black font-mono bg-violet-50 dark:bg-violet-950/45 text-violet-500 px-3 py-1 rounded-full border border-violet-100 dark:border-violet-900/50">
                          {selectedRepertoire.songIds.length} Músicas
                        </span>
                      </div>

                      {/* Add songs from catalog interactive multiselect */}
                      <div className="space-y-2.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 block">Adicionar Músicas do Catálogo Global</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border dark:border-slate-850">
                          {state.songs.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">Cadastre músicas na primeira aba antes.</span>
                          ) : (
                            state.songs.map(song => {
                              const alreadyIn = selectedRepertoire.songIds.includes(song.id);
                              return (
                                <button
                                  key={song.id}
                                  onClick={() => {
                                    if (alreadyIn) {
                                      handleRemoveSongFromRepertoire(selectedRepertoire.id, song.id);
                                    } else {
                                      handleAddSongToRepertoire(selectedRepertoire.id, song.id);
                                    }
                                    // Refresh active display
                                    const updated = state.repertoires.find(r => r.id === selectedRepertoire.id);
                                    if (updated) setSelectedRepertoire(updated);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                    alreadyIn
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border-emerald-300'
                                      : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  {alreadyIn && <Check size={11} />}
                                  <span>{song.name}</span>
                                  <span className="text-slate-400 font-mono">({song.artist})</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* List of songs inside this repertoire */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 block">Ordem das Músicas no Repertório</label>
                        {selectedRepertoire.songIds.length === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-6">Este repertório ainda está vazio. Toque nas músicas acima para inseri-las.</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedRepertoire.songIds.map((songId, index) => {
                              const songObj = state.songs.find(s => s.id === songId);
                              if (!songObj) return null;
                              return (
                                <div
                                  key={songId}
                                  className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-black font-mono text-violet-500">{index + 1}</span>
                                    <div className="text-left">
                                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{songObj.name}</h5>
                                      <p className="text-[10px] text-slate-500">{songObj.artist}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {songObj.key && (
                                      <span className="text-[10px] font-black font-mono bg-violet-50 dark:bg-violet-950/30 text-violet-500 px-2 py-0.5 rounded">
                                        Tom: {songObj.key}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => {
                                        handleRemoveSongFromRepertoire(selectedRepertoire.id, songId);
                                        const updated = state.repertoires.find(r => r.id === selectedRepertoire.id);
                                        if (updated) setSelectedRepertoire(updated);
                                      }}
                                      className="p-1 hover:text-rose-500 transition-colors rounded"
                                      title="Remover do Repertório"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="mx-auto text-slate-350 dark:text-slate-650" size={32} />
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Nenhum repertório selecionado</h3>
                      <p className="text-xs text-slate-400 mt-1">Crie ou escolha um repertório à esquerda para começar a montar a sua playlist de cultos.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 3: CUSTOM DYNAMIC CATALOGS DETAIL VIEW */}
        {activeView === 'custom_catalog' && currentCatalog && (
          <motion.div
            key="custom_catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
          >
            {/* Dynamic Custom Catalog controls & filters */}
            <div className="flex justify-between items-center flex-wrap gap-4 bg-slate-50/75 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-3xl">
              <div className="flex flex-wrap gap-3 items-center flex-1">
                {/* Search query */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Buscar em ${currentCatalog.name}...`}
                    value={customFilters.search}
                    onChange={(e) => setCustomFilters({ ...customFilters, search: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-500 dark:text-white"
                  />
                </div>

                {/* Category select */}
                <select
                  value={customFilters.category}
                  onChange={(e) => setCustomFilters({ ...customFilters, category: e.target.value })}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-500 dark:text-white"
                >
                  <option value="">Todas as Categorias</option>
                  {currentCatalog.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Favorites filter toggle */}
                <button
                  onClick={() => setCustomFilters({ ...customFilters, onlyFavorites: !customFilters.onlyFavorites })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                    customFilters.onlyFavorites
                      ? 'bg-rose-50 border-rose-300 text-rose-500'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Star size={11} className={customFilters.onlyFavorites ? 'fill-rose-500' : ''} />
                  <span>Favoritos</span>
                </button>
              </div>

              {/* Add item button */}
              <button
                onClick={() => {
                  setCustomItemForm({
                    name: '',
                    categories: [],
                    fieldValues: currentCatalog.fields.reduce((acc, f) => ({ ...acc, [f.id]: f.type === 'rating' ? 0 : '' }), {}),
                    notes: '',
                    imageUrl: ''
                  });
                  setActiveModal('add_custom_item');
                }}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>Adicionar Item</span>
              </button>
            </div>

            {/* CUSTOM ITEMS GRID */}
            {filteredCustomItems.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl">
                <Folder className="mx-auto text-slate-350 dark:text-slate-650" size={32} />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-3">Nenhum item cadastrado</h3>
                <p className="text-xs text-slate-450 mt-1">Clique no botão "Adicionar Item" para iniciar sua coleção.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCustomItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-950 group relative"
                  >
                    {/* Item direct Photo Base64 display */}
                    {item.imageUrl ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-slate-950 border-b dark:border-slate-850">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-1 bg-black/40 backdrop-blur-xs p-1 rounded-full">
                          <button
                            onClick={(e) => handleToggleFavoriteItem(item.id, e)}
                            className="p-1 hover:scale-110 transition-all text-white"
                          >
                            <Star size={14} className={item.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white'} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/10 flex items-center justify-between border-b dark:border-slate-850">
                        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Sem Imagem</span>
                        <button
                          onClick={(e) => handleToggleFavoriteItem(item.id, e)}
                          className="p-1 hover:scale-110 transition-all text-slate-400"
                        >
                          <Star size={14} className={item.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                        </button>
                      </div>
                    )}

                    {/* Information detail block */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div
                        onClick={() => {
                          setSelectedItem(item);
                          setActiveModal('custom_item_details');
                        }}
                        className="space-y-3 cursor-pointer text-left"
                      >
                        <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1">{item.name}</h4>
                        
                        {/* Dynamic custom fields render on card */}
                        <div className="space-y-1.5">
                          {currentCatalog.fields.map(field => {
                            const val = item.fieldValues[field.id];
                            if (val === undefined || val === '') return null;

                            return (
                              <div key={field.id} className="text-xs flex justify-between items-center gap-2 border-b border-slate-50 dark:border-slate-850/50 pb-1">
                                <span className="text-slate-400 font-semibold">{field.name}:</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px]">
                                  {field.type === 'rating' ? (
                                    <span className="text-amber-400 flex items-center">
                                      {Array.from({ length: Number(val) }).map((_, i) => '★')}
                                    </span>
                                  ) : field.type === 'link' ? (
                                    <a href={val} target="_blank" rel="noreferrer" className="text-indigo-500 inline-flex items-center gap-0.5 hover:underline">
                                      Link <ExternalLink size={9} />
                                    </a>
                                  ) : (
                                    String(val)
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {item.notes && <p className="text-[11px] text-slate-500 line-clamp-2 italic">{item.notes}</p>}
                      </div>

                      {/* Card actions and categories */}
                      <div className="pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {item.categories.map(c => (
                            <span key={c} className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setCustomItemForm({
                                id: item.id,
                                name: item.name,
                                categories: item.categories,
                                fieldValues: item.fieldValues,
                                notes: item.notes || '',
                                imageUrl: item.imageUrl
                              });
                              setActiveModal('add_custom_item');
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-500 rounded"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustomItem(item.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALL MODAL DIALOGS RENDERED MANUALLY BELOW TO PREVENT NESTING */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* MODAL 1: CREATE OR EDIT CUSTOM CATALOG */}
              {activeModal === 'create_catalog' && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings size={18} className="text-indigo-500" />
                    {catalogForm.id ? 'Editar Estrutura do Catálogo' : 'Criar Novo Catálogo Personalizado'}
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nome do Catálogo</label>
                      <input
                        type="text"
                        value={catalogForm.name}
                        onChange={(e) => setCatalogForm({ ...catalogForm, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-semibold dark:text-white outline-none focus:border-indigo-500"
                        placeholder="Ex: Livros, Games, Animes, ferramentas..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Icon choice selector */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Ícone</label>
                        <select
                          value={catalogForm.icon}
                          onChange={(e) => setCatalogForm({ ...catalogForm, icon: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                        >
                          <option value="Folder">📂 Pasta</option>
                          <option value="BookOpen">📖 Livro Aberto</option>
                          <option value="Book">📚 Livros</option>
                          <option value="Film">🎬 Filme</option>
                          <option value="Tv">📺 Séries</option>
                          <option value="Gamepad2">🎮 Controle de Jogos</option>
                          <option value="Sparkles">🎌 Anime</option>
                          <option value="Music">🎵 Notas Musicais</option>
                        </select>
                      </div>

                      {/* Custom Categories commas */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Categorias do Catálogo</label>
                        <input
                          type="text"
                          value={catalogForm.categories}
                          onChange={(e) => setCatalogForm({ ...catalogForm, categories: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                          placeholder="Separadas por vírgula. Ex: Ação, Drama"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC FIELD DEFINITION BUILDER */}
                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase text-slate-400 block">Campos Customizados de Dados</label>
                        <button
                          type="button"
                          onClick={() => setCatalogForm({
                            ...catalogForm,
                            fields: [...catalogForm.fields, { id: `field_${Date.now()}`, name: '', type: 'text' }]
                          })}
                          className="text-[10px] font-black text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <Plus size={10} /> Adicionar Campo
                        </button>
                      </div>

                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {catalogForm.fields.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic text-center py-2">Nenhum campo personalizado definido ainda. Apenas o campo "Nome" será exibido.</p>
                        ) : (
                          catalogForm.fields.map((field, fIdx) => (
                            <div key={field.id} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border dark:border-slate-850">
                              <input
                                type="text"
                                placeholder="Nome do Campo"
                                value={field.name}
                                onChange={(e) => {
                                  const updated = [...catalogForm.fields];
                                  updated[fIdx].name = e.target.value;
                                  setCatalogForm({ ...catalogForm, fields: updated });
                                }}
                                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-bold dark:text-white"
                              />

                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const updated = [...catalogForm.fields];
                                  updated[fIdx].type = e.target.value as any;
                                  if (e.target.value === 'select') updated[fIdx].options = [];
                                  setCatalogForm({ ...catalogForm, fields: updated });
                                }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs dark:text-white"
                              >
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                                <option value="link">Link da Web</option>
                                <option value="rating">Avaliação (1-5)</option>
                                <option value="select">Dropdown (Seleção)</option>
                              </select>

                              {field.type === 'select' && (
                                <input
                                  type="text"
                                  placeholder="Opções (v,i,r,g)"
                                  value={field.options?.join(', ') || ''}
                                  onChange={(e) => {
                                    const updated = [...catalogForm.fields];
                                    updated[fIdx].options = e.target.value.split(',').map(o => o.trim());
                                    setCatalogForm({ ...catalogForm, fields: updated });
                                  }}
                                  className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-[10px] dark:text-white"
                                />
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setCatalogForm({
                                    ...catalogForm,
                                    fields: catalogForm.fields.filter((_, i) => i !== fIdx)
                                  });
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSaveCatalog} className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">Salvar Estrutura</button>
                  </div>
                </div>
              )}

              {/* MODAL 2: EDIT CHURCH SONG CATEGORIES PRESETS */}
              {activeModal === 'edit_categories' && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings size={18} className="text-violet-500" />
                    Editar Categorias de Músicas
                  </h2>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">Lista de Categorias (Separadas por Vírgula)</label>
                    <textarea
                      value={editingSongCategoriesText}
                      onChange={(e) => setEditingSongCategoriesText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs font-semibold dark:text-white outline-none focus:border-violet-500 h-32"
                      placeholder="Adoração, Louvor, Ceia, Gratidão..."
                    />
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">Altere livremente a lista acima para adicionar novas tags exclusivas de ministração e temas de culto para o seu painel.</p>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSaveSongCategories} className="px-4.5 py-2.5 bg-violet-650 hover:bg-violet-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">Salvar Alterações</button>
                  </div>
                </div>
              )}

              {/* MODAL 3: ADD OR EDIT CHURCH SONG */}
              {activeModal === 'add_song' && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Music size={18} className="text-violet-500" />
                    {songForm.id ? 'Editar Música do Catálogo' : 'Cadastrar Nova Música'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nome da Música *</label>
                      <input
                        type="text"
                        value={songForm.name}
                        onChange={(e) => setSongForm({ ...songForm, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-violet-500"
                        placeholder="Ex: Teu Santo Nome"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cantor / Banda / Ministério *</label>
                      <input
                        type="text"
                        list="artists-suggestions"
                        value={songForm.artist}
                        onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-violet-500"
                        placeholder="Ex: Gabriela Rocha"
                        required
                        autoComplete="off"
                      />
                      <datalist id="artists-suggestions">
                        {suggestedArtists.map(artist => (
                          <option key={artist} value={artist} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Compositor (Opcional)</label>
                      <input
                        type="text"
                        value={songForm.composer}
                        onChange={(e) => setSongForm({ ...songForm, composer: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                        placeholder="Ex: Felipe Valente"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Estilo / Momento *</label>
                      <select
                        value={songForm.style || 'Louvor'}
                        onChange={(e) => setSongForm({ ...songForm, style: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-violet-500"
                      >
                        <option value="Louvor">🙌 Louvor</option>
                        <option value="Adoração">🛐 Adoração</option>
                        <option value="Celebração">🎉 Celebração</option>
                        <option value="Abertura">🚪 Abertura</option>
                        <option value="Encerramento">🚪 Encerramento</option>
                        <option value="Ceia">🍞 Santa Ceia</option>
                        <option value="Dízimo/Oferta">🪙 Dízimo / Ofertas</option>
                        <option value="Outro">🎸 Outros</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Tom Principal</label>
                        <select
                          value={songForm.key}
                          onChange={(e) => setSongForm({ ...songForm, key: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-2 py-2 text-xs dark:text-white"
                        >
                          <option value="">Sem Tom</option>
                          {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm'].map(keyVal => (
                            <option key={keyVal} value={keyVal}>{keyVal}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Capotraste</label>
                        <input
                          type="text"
                          value={songForm.capo}
                          onChange={(e) => setSongForm({ ...songForm, capo: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                          placeholder="Ex: 2ª Casa"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Link do YouTube / Cifra Club</label>
                    <input
                      type="url"
                      value={songForm.youtubeUrl}
                      onChange={(e) => setSongForm({ ...songForm, youtubeUrl: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  {/* Church Song Categories Multiselect */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">Categorias da Música (Selecione uma ou mais)</label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border dark:border-slate-850">
                      {state.songCategories.map(cat => {
                        const isChecked = songForm.categories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              const nextCats = isChecked
                                ? songForm.categories.filter(c => c !== cat)
                                : [...songForm.categories, cat];
                              setSongForm({ ...songForm, categories: nextCats });
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                              isChecked
                                ? 'bg-violet-100 dark:bg-violet-950 border-violet-400 text-violet-750 dark:text-violet-350 shadow-3xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Observações da Cifra ou Execução</label>
                    <textarea
                      value={songForm.notes}
                      onChange={(e) => setSongForm({ ...songForm, notes: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white h-16"
                      placeholder="Ex: Introdução dedilhada lenta, virada forte no refrão..."
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSaveSong} className="px-4.5 py-2.5 bg-violet-650 hover:bg-violet-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">Confirmar</button>
                  </div>
                </div>
              )}

              {/* MODAL 4: MANAGE REPERTOIRE (CREATE/EDIT TITLE) */}
              {activeModal === 'manage_repertoire' && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-violet-500" />
                    {selectedRepertoire ? 'Editar Nome do Repertório' : 'Criar Novo Repertório de Culto'}
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nome do Repertório</label>
                      <input
                        type="text"
                        value={repertoireName}
                        onChange={(e) => setRepertoireName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-violet-500"
                        placeholder="Ex: Culto de Domingo Noite, Rede Teen, etc."
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                    <button onClick={() => { handleSaveRepertoire(); setActiveModal(null); }} className="px-4.5 py-2.5 bg-violet-650 hover:bg-violet-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">Salvar Repertório</button>
                  </div>
                </div>
              )}

              {/* MODAL 5: ADD OR EDIT CUSTOM CATALOG ITEM (DYNAMIC FIELDS) */}
              {activeModal === 'add_custom_item' && currentCatalog && (
                <div className="space-y-4">
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Folder size={18} className="text-indigo-500" />
                    {customItemForm.id ? 'Editar Item do Catálogo' : `Adicionar Item em ${currentCatalog.name}`}
                  </h2>

                  <div className="space-y-3">
                    {/* Primary Name of item */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nome / Título Principal *</label>
                      <input
                        type="text"
                        value={customItemForm.name}
                        onChange={(e) => setCustomItemForm({ ...customItemForm, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-indigo-500"
                        placeholder="Nome do item..."
                        required
                      />
                    </div>

                    {/* PHOTO UPLOADER (NO IMAGE URL ALLOWED) */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Carregar Foto (Dispositivo)</label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer text-xs font-bold transition-all shadow-3xs">
                          <Upload size={14} />
                          <span>Selecionar Imagem</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, (b64) => setCustomItemForm({ ...customItemForm, imageUrl: b64 }))}
                            className="hidden"
                          />
                        </label>
                        {customItemForm.imageUrl && (
                          <div className="relative group">
                            <img src={customItemForm.imageUrl} alt="Uploaded item" className="h-10 w-10 object-cover rounded-lg border border-slate-200" />
                            <button
                              type="button"
                              onClick={() => setCustomItemForm({ ...customItemForm, imageUrl: '' })}
                              className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Field Values generation */}
                    {currentCatalog.fields.map(field => {
                      const currentVal = customItemForm.fieldValues[field.id] ?? '';

                      return (
                        <div key={field.id} className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 block">{field.name}</label>
                          {field.type === 'select' ? (
                            <select
                              value={currentVal}
                              onChange={(e) => {
                                const nextVals = { ...customItemForm.fieldValues, [field.id]: e.target.value };
                                setCustomItemForm({ ...customItemForm, fieldValues: nextVals });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                            >
                              <option value="">Selecione...</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'rating' ? (
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(starNum => (
                                <button
                                  key={starNum}
                                  type="button"
                                  onClick={() => {
                                    const nextVals = { ...customItemForm.fieldValues, [field.id]: starNum };
                                    setCustomItemForm({ ...customItemForm, fieldValues: nextVals });
                                  }}
                                  className="text-xl transition-all cursor-pointer hover:scale-110"
                                >
                                  <Star size={18} className={starNum <= Number(currentVal) ? 'fill-amber-400 text-amber-400' : 'text-slate-350'} />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                              value={currentVal}
                              onChange={(e) => {
                                const nextVals = { ...customItemForm.fieldValues, [field.id]: e.target.value };
                                setCustomItemForm({ ...customItemForm, fieldValues: nextVals });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white"
                              placeholder={`Insira o valor para ${field.name}...`}
                              required={field.isRequired}
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Categories tag selectors */}
                    {currentCatalog.categories.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 block">Categorias / Gênero</label>
                        <div className="flex flex-wrap gap-1.5">
                          {currentCatalog.categories.map(cat => {
                            const isChecked = customItemForm.categories.includes(cat);
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  const nextCats = isChecked
                                    ? customItemForm.categories.filter(c => c !== cat)
                                    : [...customItemForm.categories, cat];
                                  setCustomItemForm({ ...customItemForm, categories: nextCats });
                                }}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all border cursor-pointer ${
                                  isChecked
                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-white'
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Item Notes */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Anotações e Observações</label>
                      <textarea
                        value={customItemForm.notes}
                        onChange={(e) => setCustomItemForm({ ...customItemForm, notes: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white h-16"
                        placeholder="Ex: Hobbies, resenha rápida, comentários ou links..."
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSaveCustomItem} className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">Salvar Item</button>
                  </div>
                </div>
              )}

              {/* MODAL 6: CHURCH SONG DETAILS DRAWER/POPUP */}
              {activeModal === 'song_details' && selectedSong && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-start border-b pb-3 dark:border-slate-850">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedSong.name}</h3>
                        {selectedSong.style && (
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            selectedSong.style === 'Adoração'
                              ? 'bg-violet-50 text-violet-600 border-violet-150 dark:bg-violet-950/50 dark:text-violet-350 dark:border-violet-900/30'
                              : selectedSong.style === 'Louvor'
                              ? 'bg-sky-50 text-sky-600 border-sky-150 dark:bg-sky-950/50 dark:text-sky-350 dark:border-sky-900/30'
                              : selectedSong.style === 'Celebração'
                              ? 'bg-amber-50 text-amber-600 border-amber-150 dark:bg-amber-950/50 dark:text-amber-350 dark:border-amber-900/30'
                              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                          }`}>
                            {selectedSong.style}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-extrabold">{selectedSong.artist}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFavoriteSong(selectedSong.id)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star size={20} className={selectedSong.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {selectedSong.composer && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Compositor</span>
                        {selectedSong.composer}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {selectedSong.key && (
                        <p className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border dark:border-slate-850">
                          <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Tom da Música</span>
                          <span className="text-sm font-black text-violet-500">{selectedSong.key}</span>
                        </p>
                      )}
                      {selectedSong.capo && (
                        <p className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border dark:border-slate-850">
                          <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Capotraste</span>
                          <span className="text-sm font-black text-emerald-500">{selectedSong.capo}</span>
                        </p>
                      )}
                    </div>

                    {selectedSong.youtubeUrl && (
                      <div className="p-2.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/45 flex justify-between items-center">
                        <span className="text-rose-500 font-bold flex items-center gap-1">
                          <Play size={12} className="fill-rose-500" /> YouTube / Link Externo
                        </span>
                        <a
                          href={selectedSong.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-black hover:bg-rose-600 inline-flex items-center gap-1 transition-all"
                        >
                          Assistir <ExternalLink size={9} />
                        </a>
                      </div>
                    )}

                    {selectedSong.categories.length > 0 && (
                      <div>
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block mb-1">Categorias do Culto</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedSong.categories.map(c => (
                            <span key={c} className="bg-slate-100 dark:bg-slate-950 text-slate-650 dark:text-slate-400 border px-2.5 py-0.5 rounded-full">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedSong.notes && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border dark:border-slate-850 space-y-1">
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Observações</span>
                        <p className="text-slate-750 dark:text-slate-350 leading-relaxed whitespace-pre-line font-medium italic">{selectedSong.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t dark:border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400">Cadastrado em {new Date(selectedSong.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-850 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200">Fechar</button>
                  </div>
                </div>
              )}

              {/* MODAL 7: CUSTOM CATALOG ITEM DETAILS DRAWER/POPUP */}
              {activeModal === 'custom_item_details' && selectedItem && currentCatalog && (
                <div className="space-y-4 text-left">
                  {selectedItem.imageUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border bg-slate-50 dark:bg-slate-950">
                      <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex justify-between items-start border-b pb-3 dark:border-slate-850">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedItem.name}</h3>
                      <p className="text-xs text-indigo-500 font-extrabold">{currentCatalog.name}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFavoriteItem(selectedItem.id)}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star size={20} className={selectedItem.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  </div>

                  {/* Fields lists */}
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentCatalog.fields.map(field => {
                        const val = selectedItem.fieldValues[field.id];
                        if (val === undefined || val === '') return null;

                        return (
                          <div key={field.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850">
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] block mb-1">{field.name}</span>
                            {field.type === 'rating' ? (
                              <span className="text-lg text-amber-400 flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={14} className={i < Number(val) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                                ))}
                              </span>
                            ) : field.type === 'link' ? (
                              <a href={val} target="_blank" rel="noreferrer" className="text-indigo-500 font-bold hover:underline inline-flex items-center gap-1">
                                Visitar Link <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-slate-800 dark:text-slate-200 font-bold text-sm">{String(val)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {selectedItem.categories.length > 0 && (
                      <div>
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block mb-1">Categorias</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedItem.categories.map(c => (
                            <span key={c} className="bg-slate-100 dark:bg-slate-950 text-slate-650 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.notes && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border dark:border-slate-850 space-y-1">
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block">Anotações</span>
                        <p className="text-slate-750 dark:text-slate-350 leading-relaxed whitespace-pre-line font-medium italic">{selectedItem.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t dark:border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400">Cadastrado em {new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-850 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200">Fechar</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
