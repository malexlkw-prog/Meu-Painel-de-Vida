import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Star, 
  Search, 
  Info, 
  FolderPlus, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Download, 
  Share2, 
  Folder, 
  Calendar, 
  Tag as TagIcon, 
  MapPin, 
  Maximize2, 
  Plus, 
  SlidersHorizontal,
  RefreshCw,
  ArchiveRestore,
  HardDrive,
  Grid
} from 'lucide-react';
import { GalleryPhoto } from '../types';
import { 
  getAllPhotos, 
  savePhoto, 
  deletePhotoPermanently, 
  getAlbums, 
  saveAlbum, 
  deleteAlbum,
  GalleryAlbum
} from '../utils/galleryDB';

const PREDEFINED_ALBUMS = [
  'Fotos Pessoais',
  'Família',
  'Amigos',
  'Viagens',
  'Academia',
  'Igreja',
  'Papelaria',
  'Eventos',
  'Memórias',
  'Outros'
];

export default function GallerySection() {
  // DB and Photos States
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  // Active View States
  const [selectedAlbum, setSelectedAlbum] = useState<string>('Todos'); // 'Todos', 'Favoritos', 'Lixeira', or specific album name
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title' | 'album'>('recent');
  
  // Custom album name state
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  // Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Quick Tag filter
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Lightbox / Detail view state
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState(1); // 1, 1.5, 2
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaEditState, setMetaEditState] = useState<{
    title: string;
    description: string;
    album: string;
    date: string;
    location: string;
    newTagText: string;
    tags: string[];
  }>({
    title: '',
    description: '',
    album: 'Fotos Pessoais',
    date: '',
    location: '',
    newTagText: '',
    tags: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos and albums on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const allPhotos = await getAllPhotos();
      setPhotos(allPhotos);

      const dbAlbums = await getAlbums();
      // Ensure predefined albums exist in list
      const mergedAlbums: GalleryAlbum[] = [...dbAlbums];
      PREDEFINED_ALBUMS.forEach(name => {
        if (!mergedAlbums.some(a => a.name.toLowerCase() === name.toLowerCase())) {
          mergedAlbums.push({ id: `pre-${name.toLowerCase()}`, name, isCustom: false });
        }
      });
      setAlbums(mergedAlbums);
    } catch (err) {
      console.error('Error opening gallery DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort photos array based on view constraints
  const getFilteredPhotos = () => {
    let result = [...photos];

    // Filter out based on selected folder / album
    if (selectedAlbum === 'Lixeira') {
      result = result.filter(p => p.deletedAt !== null);
    } else {
      // Hide deleted photos for other views
      result = result.filter(p => p.deletedAt === null);

      if (selectedAlbum === 'Favoritos') {
        result = result.filter(p => p.isFavorite);
      } else if (selectedAlbum !== 'Todos') {
        result = result.filter(p => p.album.toLowerCase() === selectedAlbum.toLowerCase());
      }
    }

    // Filter by tag if selected
    if (selectedTag) {
      result = result.filter(p => p.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query) ||
        p.album.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'album') {
        return a.album.localeCompare(b.album);
      }
      return 0;
    });

    return result;
  };

  const filteredPhotos = getFilteredPhotos();

  // Create customized album
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return;
    const albumName = newAlbumName.trim();
    if (albums.some(a => a.name.toLowerCase() === albumName.toLowerCase())) {
      alert('Já existe um álbum com este nome!');
      return;
    }

    const newAlbum: GalleryAlbum = {
      id: `custom-${Date.now()}`,
      name: albumName,
      isCustom: true
    };

    await saveAlbum(newAlbum);
    setAlbums(prev => [...prev, newAlbum]);
    setNewAlbumName('');
    setIsCreatingAlbum(false);
    setSelectedAlbum(albumName);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (e.target.files ? Array.from(e.target.files) : []) as File[];
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  // Convert files to base64, size calculation, and save
  const processFiles = async (files: File[]) => {
    setUploadProgress(0);
    setUploadError(null);
    let count = 0;

    for (const file of files) {
      try {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
          // Attempt simple extension check for HEIC
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext !== 'heic' && ext !== 'heif') {
            continue;
          }
        }

        const base64 = await readFileAsBase64(file);
        
        const defaultAlbumName = selectedAlbum !== 'Todos' && selectedAlbum !== 'Favoritos' && selectedAlbum !== 'Lixeira' 
          ? selectedAlbum 
          : 'Fotos Pessoais';

        const newPhoto: GalleryPhoto = {
          id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
          description: '',
          album: defaultAlbumName,
          date: new Date().toISOString().substring(0, 10), // Local short ISO YYYY-MM-DD
          isFavorite: false,
          base64Data: base64,
          size: file.size,
          fileName: file.name,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          tags: []
        };

        await savePhoto(newPhoto);
        setPhotos(prev => [newPhoto, ...prev]);

        count++;
        setUploadProgress(Math.round((count / files.length) * 100));
      } catch (err) {
        console.error('Erro ao ler arquivo:', err);
        setUploadError('Ocorreu um erro ao carregar algumas fotos.');
      }
    }

    setTimeout(() => {
      setUploadProgress(null);
    }, 1500);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Favorite handler
  const handleToggleFavorite = async (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photo, isFavorite: !photo.isFavorite };
    await savePhoto(updated);
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p));
  };

  // Move to trash
  const handleMoveToTrash = async (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photo, deletedAt: new Date().toISOString() };
    await savePhoto(updated);
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p));
    
    // Close lightbox if it was deleted
    if (activePhotoIndex !== null && filteredPhotos[activePhotoIndex]?.id === photo.id) {
      setActivePhotoIndex(null);
    }
  };

  // Restore from trash
  const handleRestoreFromTrash = async (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photo, deletedAt: null };
    await savePhoto(updated);
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p));
  };

  // Permanent Delete
  const handlePermanentDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta foto definitivamente? Esta ação não pode ser desfeita.')) {
      await deletePhotoPermanently(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      if (activePhotoIndex !== null && filteredPhotos[activePhotoIndex]?.id === id) {
        setActivePhotoIndex(null);
      }
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setRotation(0);
    setZoom(1);
    setIsEditingMeta(false);
    
    const photo = filteredPhotos[index];
    if (photo) {
      setMetaEditState({
        title: photo.title || '',
        description: photo.description || '',
        album: photo.album,
        date: photo.date,
        location: photo.location || '',
        newTagText: '',
        tags: photo.tags || []
      });
    }
  };

  // Save changes to metadata
  const handleSaveMetadata = async () => {
    if (activePhotoIndex === null) return;
    const photo = filteredPhotos[activePhotoIndex];
    if (!photo) return;

    const updated: GalleryPhoto = {
      ...photo,
      title: metaEditState.title,
      description: metaEditState.description,
      album: metaEditState.album,
      date: metaEditState.date,
      location: metaEditState.location,
      tags: metaEditState.tags
    };

    await savePhoto(updated);
    setPhotos(prev => prev.map(p => p.id === photo.id ? updated : p));
    setIsEditingMeta(false);
  };

  // Tags adder
  const handleAddTag = () => {
    const text = metaEditState.newTagText.trim().replace('#', '');
    if (text && !metaEditState.tags.includes(text)) {
      setMetaEditState(prev => ({
        ...prev,
        tags: [...prev.tags, text],
        newTagText: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetaEditState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  // Download image helper
  const handleDownloadImage = (photo: GalleryPhoto) => {
    const link = document.createElement('a');
    link.href = photo.base64Data;
    link.download = `${photo.title || 'foto'}_painel_de_vida.${photo.fileName.split('.').pop() || 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share Image mock / Web Share
  const handleShareImage = async (photo: GalleryPhoto) => {
    if (navigator.share) {
      try {
        // Prepare base64 blob to share
        const res = await fetch(photo.base64Data);
        const blob = await res.blob();
        const file = new File([blob], photo.fileName, { type: blob.type });
        await navigator.share({
          files: [file],
          title: photo.title,
          text: photo.description
        });
      } catch (err) {
        console.error('Error sharing file:', err);
      }
    } else {
      navigator.clipboard.writeText(photo.base64Data.substring(0, 50) + '... (Imagedata)');
      alert('Link da foto persistente no banco de dados copiado para a área de transferência!');
    }
  };

  // Stats calculation
  const totalPhotos = photos.filter(p => !p.deletedAt).length;
  const totalAlbums = albums.length;
  const favoritePhotosCount = photos.filter(p => p.isFavorite && !p.deletedAt).length;
  const trashPhotos = photos.filter(p => p.deletedAt).length;
  
  // Calculate total spaces (rough calculation of string length key in megabytes)
  const totalSpaceChars = photos.reduce((acc, p) => acc + (p.base64Data ? p.base64Data.length : 0), 0);
  const spaceUsedMB = (totalSpaceChars * 0.75 / (1024 * 1024)).toFixed(1); // Approximate base64 string bytes size to dec decimal

  // Quick list of all tags for filtering
  const allTagsSet = new Set<string>();
  photos.filter(p => !p.deletedAt).forEach(p => p.tags?.forEach(t => allTagsSet.add(t)));
  const allTags = Array.from(allTagsSet);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-850">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="text-indigo-650 dark:text-indigo-400" size={24} />
            <h1 className="text-lg md:text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Galeria Pessoal
            </h1>
          </div>
          <p className="text-xs text-slate-450">
            Armazene e organize momentos especiais, fotos pessoais e memórias em segurança via IndexedDB.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom Album Creation */}
          {isCreatingAlbum ? (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
              <input
                type="text"
                placeholder="Nome do Álbum..."
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAlbum()}
                className="bg-transparent text-xs px-2.s outline-none w-32 dark:text-white"
                autoFocus
              />
              <button 
                onClick={handleCreateAlbum}
                className="bg-indigo-650 text-white rounded-lg p-1.5 hover:bg-indigo-700 font-bold text-[10px]"
              >
                Criar
              </button>
              <button 
                onClick={() => setIsCreatingAlbum(false)}
                className="text-slate-400 hover:text-rose-500 p-1.5"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingAlbum(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              <FolderPlus size={14} />
              <span>Novo Álbum</span>
            </button>
          )}

          {/* Upload Button Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            <Upload size={14} />
            <span>Adicionar Fotos</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* 2. STATS OVERVIEW WIDGET */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
            <ImageIcon className="text-indigo-600 dark:text-indigo-400" size={15} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Fotos</span>
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{totalPhotos}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
            <Folder className="text-teal-600 dark:text-teal-400" size={15} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Álbuns</span>
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{totalAlbums}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
            <Star className="text-amber-500 hover:fill-amber-500 fill-amber-500" size={14} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Favoritas</span>
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{favoritePhotosCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center shrink-0">
            <HardDrive className="text-orange-500" size={15} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Espaço Total</span>
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{spaceUsedMB} MB</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 col-span-2 md:col-span-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <Trash2 className="text-rose-600 dark:text-rose-450" size={15} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lixeira</span>
            <span className="text-sm font-black text-slate-800 dark:text-white leading-none">{trashPhotos}</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROL BAR: SEARCH, SORTS & ALBUMS LIST */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        
        {/* Album Selector Tabs scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none shrink-0 w-full lg:w-auto">
          <button
            onClick={() => { setSelectedAlbum('Todos'); setSelectedTag(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedAlbum === 'Todos' && !selectedTag
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todos os Momentos
          </button>

          <button
            onClick={() => { setSelectedAlbum('Favoritos'); setSelectedTag(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedAlbum === 'Favoritos' && !selectedTag
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star size={12} className="fill-current" />
            <span>Favoritas</span>
          </button>

          {/* Predefined & Custom Albums Render map */}
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => { setSelectedAlbum(album.name); setSelectedTag(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedAlbum.toLowerCase() === album.name.toLowerCase() && !selectedTag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {album.name}
            </button>
          ))}

          {/* Recycle Bin Tab */}
          <button
            onClick={() => { setSelectedAlbum('Lixeira'); setSelectedTag(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ml-2 ${
              selectedAlbum === 'Lixeira'
                ? 'bg-rose-500 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Trash2 size={12} />
            <span>Lixeira ({trashPhotos})</span>
          </button>
        </div>

        {/* Search & Order Inputs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:ml-auto w-full lg:w-auto">
          {/* SearchInput */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Buscar por nome, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs py-2 pl-8.5 pr-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          {/* Sort selection dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2">
            <SlidersHorizontal size={13} className="text-slate-455 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs py-2 pr-2.5 outline-none font-semibold text-slate-600 dark:text-slate-350 cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="oldest">Mais Antigas</option>
              <option value="title">Nome (A-Z)</option>
              <option value="album">Álbum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags Chips Bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6 bg-slate-100/50 dark:bg-slate-900/30 p-2 rounded-xl">
          <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1 mr-1.5 select-none">
            <TagIcon size={11} /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
              !selectedTag 
                ? 'bg-slate-250 text-slate-800 dark:bg-slate-800 dark:text-white' 
                : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            Todas
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                tag === selectedTag
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-350 border border-indigo-200'
                  : 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 4. DRAG AND DROP UPLOD AREA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-5 mb-6 text-center transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
            : 'border-slate-200 dark:border-slate-800/80 bg-slate-100/10'
        }`}
      >
        <ImageIcon className="mx-auto text-slate-400 dark:text-slate-500 mb-2" size={30} />
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Arrastar e soltar fotos aqui</h4>
        <p className="text-[10px] text-slate-450 mt-1">
          Ou <span className="text-indigo-600 font-extrabold underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>selecione arquivos</span> no computador ou celular.
        </p>
        <p className="text-[9px] text-slate-400 mt-0.5">Suporta JPG, PNG, WEBP, HEIC</p>

        {uploadProgress !== null && (
          <div className="max-w-xs mx-auto mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-650 mb-1">
              <span>Carregando fotos...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
              <div 
                className="bg-indigo-505 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%`, backgroundColor: '#4f46e5' }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-rose-500 font-bold mt-2">{uploadError}</p>
        )}
      </div>

      {/* 5. PHOTOS RENDERING GRID */}
      {loading ? (
        <div className="p-20 text-center">
          <RefreshCw className="animate-spin text-indigo-650 mx-auto mb-3" size={36} />
          <p className="text-xs text-slate-550">Buscando álbum de fotos...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 rounded-2xl p-16 text-center">
          <ImageIcon className="mx-auto text-slate-350 dark:text-slate-600 mb-3" size={40} />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Nenhuma foto encontrada neste álbum</h3>
          <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">
            Organize fotos arrastando-as ou clique no botão de importar para carregar momentos especiais juntinhos do Marcos!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layoutId={`photo-card-${photo.id}`}
              onClick={() => openLightbox(index)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer group hover:scale-[1.01] transition-all duration-250 relative flex flex-col"
            >
              {/* Image box */}
              <div className="aspect-square bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                <img 
                  src={photo.base64Data} 
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />

                {/* Stars flag on upper left */}
                {photo.isFavorite && (
                  <div className="absolute top-2.5 left-2.5 bg-amber-500/90 hover:scale-110 p-1.5 rounded-full text-white backdrop-blur-xs z-10">
                    <Star size={11} className="fill-current" />
                  </div>
                )}

                {/* Album type bubble flag card */}
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[8px] uppercase tracking-wider font-extrabold text-white px-2 py-0.5 rounded-md">
                  {photo.album}
                </span>

                {/* Hover Quick actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-200">
                  {photo.deletedAt ? (
                    <>
                      <button
                        onClick={(e) => handleRestoreFromTrash(photo, e)}
                        className="p-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full transition-all hover:scale-110"
                        title="Restaurar Foto"
                      >
                        <ArchiveRestore size={14} />
                      </button>
                      <button
                        onClick={(e) => handlePermanentDelete(photo.id, e)}
                        className="p-2 bg-rose-650 hover:bg-rose-700 text-white rounded-full transition-all hover:scale-110"
                        title="Excluir Definitivamente"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleToggleFavorite(photo, e)}
                        className={`p-1.5 rounded-full transition-all hover:scale-110 backdrop-blur-md ${
                          photo.isFavorite 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-white/80 hover:bg-white text-slate-800'
                        }`}
                        title={photo.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                      >
                        <Star size={13} className={photo.isFavorite ? "fill-current" : ""} />
                      </button>
                      <button
                        onClick={(e) => handleMoveToTrash(photo, e)}
                        className="p-1.5 bg-white/80 hover:bg-rose-500 hover:text-white rounded-full transition-all hover:scale-110 backdrop-blur-md text-slate-850"
                        title="Mover para Lixeira"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Informative info footer */}
              <div className="p-2.5">
                <span className="font-extrabold text-[11px] block truncate text-slate-900 dark:text-white">
                  {photo.title || 'Sem título'}
                </span>
                <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5 select-none">
                  <Calendar size={10} />
                  {photo.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 6. LIGHTBOX CAROUSEL OVERLAY */}
      <AnimatePresence>
        {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col md:flex-row select-none">
            
            {/* Left Image View Area (75% on Desktop) */}
            <div className="flex-1 flex flex-col relative h-[65vh] md:h-screen justify-center items-center overflow-hidden p-4">
              
              {/* Back / Close button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white cursor-pointer z-10 active:scale-95"
              >
                <ArrowLeft size={16} />
              </button>

              {/* Floating controls overlay */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2.5 z-10 border border-white/5">
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Girar Imagem"
                >
                  <RotateCw size={15} />
                </button>
                
                <button
                  onClick={() => setZoom(prev => prev === 2 ? 1 : prev === 1.5 ? 2 : 1.5)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Ajustar Zoom"
                >
                  <Maximize2 size={14} />
                </button>

                <button
                  onClick={() => handleDownloadImage(filteredPhotos[activePhotoIndex])}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Baixar Foto"
                >
                  <Download size={14} />
                </button>

                <button
                  onClick={() => handleShareImage(filteredPhotos[activePhotoIndex])}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Compartilhar"
                >
                  <Share2 size={14} />
                </button>

                <div className="h-4 w-[1px] bg-white/10" />

                {filteredPhotos[activePhotoIndex].deletedAt ? (
                  <>
                    <button
                      onClick={(e) => { handleRestoreFromTrash(filteredPhotos[activePhotoIndex], e); setActivePhotoIndex(null); }}
                      className="p-1.5 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors cursor-pointer text-[10px] font-extrabold flex items-center gap-1"
                      title="Restaurar de volta ao painel"
                    >
                      <ArchiveRestore size={14} /> Restaurar
                    </button>
                    <button
                      onClick={(e) => { handlePermanentDelete(filteredPhotos[activePhotoIndex].id, e); }}
                      className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-[10px] font-extrabold flex items-center gap-1"
                      title="Excluir Definitivamente"
                    >
                      <Trash2 size={14} /> Apagar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => handleMoveToTrash(filteredPhotos[activePhotoIndex], e)}
                    className="p-1.5 text-rose-500 hover:text-rose-450 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer"
                    title="Mover para Lixeira"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Main Image Layer */}
              <div 
                className="max-w-full max-h-[85%] flex items-center justify-center transition-all duration-300"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                }}
              >
                <img
                  src={filteredPhotos[activePhotoIndex].base64Data}
                  alt={filteredPhotos[activePhotoIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain pointer-events-none rounded-xl shadow-2xl"
                />
              </div>

              {/* Slider Arrows */}
              {activePhotoIndex > 0 && (
                <button
                  onClick={() => openLightbox(activePhotoIndex - 1)}
                  className="absolute left-4 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer transition-colors hover:scale-105 active:scale-95"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              {activePhotoIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={() => openLightbox(activePhotoIndex + 1)}
                  className="absolute right-4 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer transition-colors hover:scale-105 active:scale-95"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Right Information detail Sidebar (25% on Desktop) */}
            <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 p-5 shrink-0 flex flex-col h-[35vh] md:h-screen text-slate-100 overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Info size={13} /> Detalhes Gerais
                </span>
                {!filteredPhotos[activePhotoIndex].deletedAt && (
                  <button
                    onClick={() => setIsEditingMeta(!isEditingMeta)}
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-bold"
                  >
                    {isEditingMeta ? 'Cancelar' : 'Editar'}
                  </button>
                )}
              </div>

              {isEditingMeta ? (
                // EDIT METADATA MODE
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Título da Foto</label>
                    <input
                      type="text"
                      value={metaEditState.title}
                      onChange={(e) => setMetaEditState(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Descrição</label>
                    <textarea
                      value={metaEditState.description}
                      onChange={(e) => setMetaEditState(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Álbum</label>
                      <select
                        value={metaEditState.album}
                        onChange={(e) => setMetaEditState(prev => ({ ...prev, album: e.target.value }))}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        {albums.map(a => (
                          <option key={a.id} value={a.name}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Data</label>
                      <input
                        type="date"
                        value={metaEditState.date}
                        onChange={(e) => setMetaEditState(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Localização</label>
                    <input
                      type="text"
                      value={metaEditState.location}
                      onChange={(e) => setMetaEditState(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Ex: Praia de Copacabana"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Tags (Palavras-chave)</label>
                    <div className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        value={metaEditState.newTagText}
                        onChange={(e) => setMetaEditState(prev => ({ ...prev, newTagText: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none text-xs"
                        placeholder="Adicionar tag (ex: viagens)"
                      />
                      <button
                        onClick={handleAddTag}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {metaEditState.tags.map(t => (
                        <span 
                          key={t} 
                          onClick={() => handleRemoveTag(t)}
                          className="bg-slate-950 hover:bg-rose-950/40 hover:text-rose-450 border border-white/10 text-slate-300 font-bold px-2 py-0.5 rounded-lg cursor-pointer flex items-center gap-1 text-[10px]"
                        >
                          #{t} <span className="opacity-60 text-[8px]">×</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveMetadata}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-bold transition-colors shadow-sm text-xs mt-4"
                  >
                    Salvar Alterações
                  </button>
                </div>
              ) : (
                // READ-ONLY METADATA DISPLAY
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-black text-white select-text">
                      {filteredPhotos[activePhotoIndex].title || 'Sem título'}
                    </h2>
                    {filteredPhotos[activePhotoIndex].description ? (
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed select-text whitespace-pre-wrap">
                        {filteredPhotos[activePhotoIndex].description}
                      </p>
                    ) : (
                      <p className="text-xs italic text-slate-550 mt-1.5">Nenhuma descrição fornecida.</p>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 leading-none">
                      <Folder size={13} className="text-indigo-400" />
                      <span>Álbum: <span className="text-white font-bold">{filteredPhotos[activePhotoIndex].album}</span></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 leading-none">
                      <Calendar size={13} className="text-teal-400" />
                      <span>Data: <span className="text-white font-bold">{filteredPhotos[activePhotoIndex].date}</span></span>
                    </div>

                    {filteredPhotos[activePhotoIndex].location && (
                      <div className="flex items-center gap-2 text-slate-400 leading-none select-text">
                        <MapPin size={13} className="text-rose-400" />
                        <span>Tag de Local: <span className="text-white font-bold">{filteredPhotos[activePhotoIndex].location}</span></span>
                      </div>
                    )}
                  </div>

                  {filteredPhotos[activePhotoIndex].tags && filteredPhotos[activePhotoIndex].tags.length > 0 && (
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-[9px] uppercase font-black text-slate-500 block mb-2 select-none">Tags</span>
                      <div className="flex flex-wrap gap-1 select-text">
                        {filteredPhotos[activePhotoIndex].tags.map(t => (
                          <span key={t} className="bg-slate-950 border border-white/5 text-slate-350 font-semibold px-2 py-0.5 rounded-lg text-[10px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info Metadata logs */}
                  <div className="pt-3 border-t border-white/5 space-y-1.5 text-[9px] text-slate-500 select-none">
                    <div>Ref ID: {filteredPhotos[activePhotoIndex].id}</div>
                    <div>Tamanho: {(filteredPhotos[activePhotoIndex].size / 1024).toFixed(1)} KB</div>
                    <div>Arquivo: {filteredPhotos[activePhotoIndex].fileName}</div>
                    {filteredPhotos[activePhotoIndex].deletedAt && (
                      <div className="text-rose-400 font-extrabold flex items-center gap-1">
                        ⚠️ Foto na lixeira. Será apagada automaticamente.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close detail side panel */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="w-full mt-auto bg-slate-950 border border-white/5 hover:bg-slate-850 text-white rounded-xl py-2 font-bold text-xs select-none cursor-pointer"
              >
                Voltar à Grade
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
