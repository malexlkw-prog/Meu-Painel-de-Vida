import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  Trash2, 
  Plus, 
  Star, 
  Edit3, 
  PlayCircle, 
  CheckCircle, 
  Bookmark, 
  Search,
  Filter,
  X,
  MessageSquare,
  Upload
} from 'lucide-react';
import { MediaItem } from '../types';

interface MediaSectionProps {
  media: MediaItem[];
  onAdd: (item: Omit<MediaItem, 'id'>) => void;
  onUpdate: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  defaultType?: 'movie' | 'series' | 'anime';
}

export default function MediaSection({ media, onAdd, onUpdate, onDelete, defaultType }: MediaSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'movie' | 'series' | 'anime'>('movie');
  const [status, setStatus] = useState<'watching' | 'completed' | 'backlog'>('watching');
  const [progress, setProgress] = useState('');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [franchise, setFranchise] = useState('');
  const [platform, setPlatform] = useState('');

  // Seasons and Episodes tracking State
  const [seasonsCount, setSeasonsCount] = useState<number>(0);
  const [formSeasons, setFormSeasons] = useState<{ seasonNumber: number; episodesCount: number }[]>([]);
  const [expandedEpisodesId, setExpandedEpisodesId] = useState<string | null>(null);
  const [activeSeasonTab, setActiveSeasonTab] = useState<{ [itemId: string]: number }>({});

  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series' | 'anime'>(defaultType || 'all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'watching' | 'completed' | 'backlog'>('all');

  React.useEffect(() => {
    if (defaultType) {
      setFilterType(defaultType);
    }
  }, [defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const isSeriesOrAnime = type === 'series' || type === 'anime';

    if (editingItem) {
      onUpdate({
        ...editingItem,
        title: title.trim(),
        type,
        status,
        progress: progress.trim() || 'Não iniciado',
        rating,
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || undefined,
        genre: genre.trim() || undefined,
        franchise: franchise.trim() || undefined,
        platform: platform.trim() || undefined,
        seasons: isSeriesOrAnime && seasonsCount > 0 ? formSeasons : undefined,
        watchedEpisodes: editingItem.watchedEpisodes || []
      });
      setEditingItem(null);
    } else {
      onAdd({
        title: title.trim(),
        type,
        status,
        progress: progress.trim() || 'Não iniciado',
        rating,
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || undefined,
        genre: genre.trim() || undefined,
        franchise: franchise.trim() || undefined,
        platform: platform.trim() || undefined,
        seasons: isSeriesOrAnime && seasonsCount > 0 ? formSeasons : undefined,
        watchedEpisodes: []
      });
    }

    // Reset Form
    setTitle('');
    setType('movie');
    setStatus('watching');
    setProgress('');
    setRating(5);
    setNotes('');
    setImageUrl('');
    setGenre('');
    setFranchise('');
    setPlatform('');
    setSeasonsCount(0);
    setFormSeasons([]);
    setShowForm(false);
  };

  const startEdit = (item: MediaItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setType(item.type);
    setStatus(item.status);
    setProgress(item.progress);
    setRating(item.rating);
    setNotes(item.notes);
    setImageUrl(item.imageUrl || '');
    setGenre(item.genre || '');
    setFranchise(item.franchise || '');
    setPlatform(item.platform || '');
    setSeasonsCount(item.seasons ? item.seasons.length : 0);
    setFormSeasons(item.seasons || []);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTitle('');
    setType('movie');
    setStatus('watching');
    setProgress('');
    setRating(5);
    setNotes('');
    setImageUrl('');
    setGenre('');
    setFranchise('');
    setPlatform('');
    setSeasonsCount(0);
    setFormSeasons([]);
    setShowForm(false);
  };

  const handleToggleEpisode = (item: MediaItem, seasonNum: number, epNum: number) => {
    const epKey = `S${seasonNum}E${epNum}`;
    const watched = item.watchedEpisodes ? [...item.watchedEpisodes] : [];
    let newWatched: string[];
    if (watched.includes(epKey)) {
      newWatched = watched.filter(k => k !== epKey);
    } else {
      newWatched = [...watched, epKey];
    }
    
    // Total episodes count
    const totalEps = item.seasons?.reduce((acc, s) => acc + s.episodesCount, 0) || 0;
    const watchedCount = newWatched.length;
    
    // Construct dynamic progress string
    let newProgress = item.progress;
    if (item.seasons && item.seasons.length > 0) {
      newProgress = `Temp. ${seasonNum} Ep. ${epNum} (${watchedCount}/${totalEps} assistidos)`;
    }
    
    onUpdate({
      ...item,
      watchedEpisodes: newWatched,
      progress: newProgress,
      status: watchedCount === totalEps && totalEps > 0 ? 'completed' : item.status
    });
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.genre && item.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.franchise && item.franchise.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.platform && item.platform.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tv className="text-emerald-500" /> Cinema, Séries & Animes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Armazene sua videoteca de entretenimento pessoal. Favorite seus títulos, avalie com estrelas e anote suas resenhas críticas.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) cancelEdit(); }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Fechar Form' : 'Adicionar Título'}
        </button>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 md:p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                {editingItem ? '✏️ Editar Registro de Mídia' : '🎬 Adicionar Nova Mídia'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Título da Obra</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Interstellar, Shingeki no Kyojin"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Tipo de Mídia</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="movie">🎥 Filme</option>
                    <option value="series">📺 Série de TV</option>
                    <option value="anime">🐉 Anime Japonês</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Status Assistindo</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="watching">📺 Assistindo Agora</option>
                    <option value="completed">✅ Finalizado / Concluído</option>
                    <option value="backlog">📌 Quero Assistir (Lista)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Progresso (Temp / Capítulos)</label>
                  <input
                    type="text"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    placeholder="Ex: T2 Ep 5 ou Filme Completo"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Sua Nota / Avaliação ({rating} estrelas)</label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Star 
                          size={22} 
                          fill={star <= rating ? 'currentColor' : 'none'} 
                          className={star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Temporadas e Episódios Config */}
              {(type === 'series' || type === 'anime') && (
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">⚙️ Configuração de Temporadas e Episódios</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Quantas Temporadas?</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={seasonsCount || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setSeasonsCount(val);
                          const updated = [...formSeasons];
                          if (val > updated.length) {
                            for (let i = updated.length; i < val; i++) {
                              updated.push({ seasonNumber: i + 1, episodesCount: 12 });
                            }
                          } else if (val < updated.length) {
                            updated.splice(val);
                          }
                          setFormSeasons(updated);
                        }}
                        placeholder="Ex: 3"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  {formSeasons.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                      {formSeasons.map((fs, idx) => (
                        <div key={fs.seasonNumber} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-850 shadow-2xs">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Temp. {fs.seasonNumber} eps</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={fs.episodesCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 12;
                              const updated = [...formSeasons];
                              updated[idx] = { ...fs, episodesCount: val };
                              setFormSeasons(updated);
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-1.5 text-xs text-center font-bold focus:outline-none dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Novos Campos: Gênero, Universo e Plataforma */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Gênero</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="">Selecione o Gênero</option>
                    <option value="Ação">💥 Ação</option>
                    <option value="Aventura">🧭 Aventura</option>
                    <option value="Comédia">🎭 Comédia</option>
                    <option value="Drama">😢 Drama</option>
                    <option value="Ficção Científica">🚀 Ficção Científica (Sci-Fi)</option>
                    <option value="Suspense">🕵️‍♂️ Suspense</option>
                    <option value="Terror">👻 Terror / Horror</option>
                    <option value="Romance">💖 Romance</option>
                    <option value="Documentário">📹 Documentário</option>
                    <option value="Animação">🎨 Animação</option>
                    <option value="Fantasia">🔮 Fantasia</option>
                    <option value="Musical">🎵 Musical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Universo / Franquia</label>
                  <select
                    value={franchise}
                    onChange={(e) => setFranchise(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="">Nenhum / Outro</option>
                    <option value="Marvel">🦸‍♂️ Marvel Studios</option>
                    <option value="DC Comics">🦇 DC Comics / DCU</option>
                    <option value="Disney">🏰 Disney Classics</option>
                    <option value="Pixar">🧸 Pixar Animation</option>
                    <option value="Star Wars">🌌 Star Wars</option>
                    <option value="Harry Potter">⚡ Wizarding World (Harry Potter)</option>
                    <option value="Animes Clássicos">🍜 Shonen / Seinen Anime</option>
                    <option value="Studio Ghibli">🌳 Studio Ghibli</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Plataforma / Onde Assistir</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="">Selecione a Plataforma</option>
                    <option value="Netflix">🟥 Netflix</option>
                    <option value="Prime Video">🟦 Prime Video</option>
                    <option value="Disney+">🔷 Disney+</option>
                    <option value="HBO Max">🟣 HBO Max</option>
                    <option value="YouTube">🔴 YouTube</option>
                    <option value="Apple TV+">🍎 Apple TV+</option>
                    <option value="Crunchyroll">🟠 Crunchyroll</option>
                    <option value="Cinema">🍿 Cinema</option>
                    <option value="Torrent/Outros">🏴‍☠️ Torrent / Download</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase font-sans">Notas Pessoais & Observações críticas</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Minhas conclusões, fatos prediletos..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs focus:outline-none dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase font-sans">Imagem de Capa</label>
                  <div className="flex items-center gap-3 font-sans">
                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer text-xs font-semibold transition-all">
                      <Upload size={14} className="text-emerald-500" />
                      <span>Carregar Capa</span>
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
                                setImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {imageUrl && (
                      <div className="relative group">
                        <img src={imageUrl} alt="Capa" className="h-10 w-10 object-cover rounded border border-slate-200 dark:border-slate-800" />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3.5">
                {editingItem && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-all active:scale-95"
                >
                  {editingItem ? 'Salvar Edição' : 'Cadastrar Obra'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Searching & Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 rounded-xl">
        <div className="relative col-span-1 sm:col-span-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar títulos..."
            className="w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 focus:border-emerald-500 rounded-lg p-2 pl-9 text-sm focus:outline-none dark:text-white"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
          >
            <option value="all">Tipos de Mídia (Todos)</option>
            <option value="movie">🎥 Apenas Filmes</option>
            <option value="series">📺 Apenas Séries</option>
            <option value="anime">🐉 Apenas Animes</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
          >
            <option value="all">Status (Todos)</option>
            <option value="watching">📺 Assistindo Atualmente</option>
            <option value="completed">✅ Concluídos</option>
            <option value="backlog">📌 Quero Assistir (Fila)</option>
          </select>
        </div>
      </div>

      {/* Visual Cards View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-emerald-500/45 dark:hover:border-emerald-800/45 transition-all group shadow-2xs"
            >
              {/* Top row: Horizontal row with Image + metadata */}
              <div className="flex gap-4">
                {/* Vertical Cover Poster Section */}
                <div className="relative shrink-0 w-24 sm:w-28 h-36 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950/20 select-none">
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=60'} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=60';
                    }}
                  />
                  
                  {/* Instant cover change overlay click */}
                  <label
                    className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer text-center p-2"
                  >
                    <Edit3 size={13} className="mb-1" />
                    Mudar Capa
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
                              onUpdate({ ...item, imageUrl: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Media Card Details info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          item.type === 'anime' 
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' 
                            : item.type === 'series' 
                              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {item.type === 'movie' ? 'Filme' : item.type === 'series' ? 'Série' : 'Anime'}
                        </span>

                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                          item.status === 'watching'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 animate-pulse'
                            : item.status === 'completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {item.status === 'watching' ? '📺 Assistindo' : item.status === 'completed' ? '✅ Finalizado' : '📌 Fila'}
                        </span>
                      </div>

                      {/* Actions buttons */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Editar registro"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Badges para Gênero, Universo e Plataforma */}
                    {(item.genre || item.franchise || item.platform) && (
                      <div className="flex flex-wrap gap-1">
                        {item.genre && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                            🏷️ {item.genre}
                          </span>
                        )}
                        {item.franchise && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/10">
                            ✨ {item.franchise}
                          </span>
                        )}
                        {item.platform && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold border border-sky-500/10">
                            📺 {item.platform}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-[11px] bg-slate-50 dark:bg-slate-950/55 p-1.5 border border-slate-100 dark:border-slate-800/80 rounded-lg text-slate-750 dark:text-slate-350 font-medium flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <PlayCircle size={12} className="text-emerald-500 shrink-0" /> 
                        <span className="text-slate-400 font-normal shrink-0">Progresso:</span> 
                        <span className="font-mono truncate dark:text-slate-200">{item.progress}</span>
                      </div>
                      
                      {/* Interactive Episódios Link */}
                      {item.seasons && item.seasons.length > 0 && (
                        <button
                          onClick={() => setExpandedEpisodesId(expandedEpisodesId === item.id ? null : item.id)}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0 hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          {expandedEpisodesId === item.id ? 'Fechar' : 'Episódios'} ({item.watchedEpisodes?.length || 0} ✓)
                        </button>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/40 dark:bg-slate-950/20 p-1.5 rounded-lg border border-dashed border-slate-100 dark:border-slate-800 break-words flex items-start gap-1 max-h-[48px] overflow-y-auto">
                        <MessageSquare size={10} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{item.notes}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2 mt-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Avaliação</span>
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          fill={i < item.rating ? 'currentColor' : 'none'} 
                          className={i < item.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Collapsible episodes selection grid */}
              {item.seasons && item.seasons.length > 0 && expandedEpisodesId === item.id && (
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-1 space-y-3 text-left">
                  {/* Seasons Tabs */}
                  {item.seasons.length > 1 && (
                    <div className="flex flex-wrap gap-1 border-b border-slate-100 dark:border-slate-800/40 pb-2">
                      {item.seasons.map((s) => {
                        const sNum = s.seasonNumber;
                        const currentActive = activeSeasonTab[item.id] || 1;
                        return (
                          <button
                            key={sNum}
                            onClick={() => setActiveSeasonTab({ ...activeSeasonTab, [item.id]: sNum })}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase transition-all ${
                              currentActive === sNum
                                ? 'bg-emerald-500 text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-950 text-slate-550 dark:text-slate-400 hover:bg-slate-200 cursor-pointer'
                            }`}
                          >
                            T{sNum}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Episodes Grid */}
                  {(() => {
                    const activeSNum = activeSeasonTab[item.id] || 1;
                    const activeSeason = item.seasons.find(s => s.seasonNumber === activeSNum) || item.seasons[0];
                    if (!activeSeason) return null;
                    
                    return (
                      <div className="space-y-1.5">
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                          Temporada {activeSNum} • {activeSeason.episodesCount} Episódios
                        </div>
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-850">
                          {Array.from({ length: activeSeason.episodesCount }).map((_, idx) => {
                            const epNum = idx + 1;
                            const epKey = `S${activeSNum}E${epNum}`;
                            const isWatched = item.watchedEpisodes?.includes(epKey);
                            return (
                              <button
                                key={epKey}
                                onClick={() => handleToggleEpisode(item, activeSNum, epNum)}
                                className={`h-8 rounded-md text-xs font-black transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                                  isWatched
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow-2xs'
                                    : 'bg-white hover:bg-slate-100 text-slate-650 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-350 border border-slate-200 dark:border-slate-800'
                                }`}
                                title={isWatched ? "Assistido (Verde)" : "Não assistido (Branco)"}
                              >
                                {epNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMedia.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <Tv size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Nenhum filme, série ou anime encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
