import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Youtube, 
  Play, 
  Pause, 
  Clock, 
  Heart, 
  Trash2, 
  ExternalLink, 
  Share2, 
  Copy, 
  FolderHeart, 
  History, 
  Tv, 
  User, 
  SlidersHorizontal,
  Plus,
  Settings2,
  Check,
  Info,
  Sliders,
  Sparkles,
  Award,
  Video,
  ListVideo,
  X
} from 'lucide-react';
import { YouTubeState, SavedVideo, WatchHistoryItem, SubscriptionChannel } from '../types';

interface YouTubeSectionProps {
  youtubeData?: YouTubeState;
  onUpdateStates: (updated: YouTubeState) => void;
}

// Fallback high-quality curated sample videos if user has no YouTube API Key
const CURATED_DEFAULT_VIDEOS = [
  {
    videoId: "m7M_jOQpPh0",
    title: "O que é desenvolvimento Web Full-Stack em 2026?",
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Tech Central",
    channelId: "UC_tech",
    publishedAt: "2026-03-12",
    duration: "12:15",
    viewCount: "142K",
    category: "programming"
  },
  {
    videoId: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Rick Astley",
    channelId: "UC_rick",
    publishedAt: "2009-10-25",
    duration: "3:32",
    viewCount: "1.4B",
    category: "music"
  },
  {
    videoId: "fA62Uo_PZhs",
    title: "Foco nos Treinos - Categoria Hipertrofia Absoluta",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Shape Club",
    channelId: "UC_shape",
    publishedAt: "2026-05-18",
    duration: "08:40",
    viewCount: "58K",
    category: "gym"
  },
  {
    videoId: "9H_Abe5eMyg",
    title: "Sermão do Monte - Pregações Históricas e Análise Hermenêutica",
    thumbnail: "https://images.unsplash.com/photo-1438211331416-0ee898666490?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Teologia Aplicada",
    channelId: "UC_bible",
    publishedAt: "2026-02-09",
    duration: "45:00",
    viewCount: "112K",
    category: "church"
  },
  {
    videoId: "5qap5aO4i9A",
    title: "Lofi Hip Hop Radio - Beats to Study/Relax to ☕",
    thumbnail: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Lofi Girl",
    channelId: "UC_lofi",
    publishedAt: "2026-06-10",
    duration: "Live",
    viewCount: "235M",
    category: "music"
  },
  {
    videoId: "t_k_B0T_XG0",
    title: "Dicas de Organização Pessoal e Planejamento Semanal",
    thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60",
    channelTitle: "Mente Focada",
    channelId: "UC_focus",
    publishedAt: "2026-01-20",
    duration: "15:45",
    viewCount: "350K",
    category: "studies"
  }
];

export default function YouTubeSection({ youtubeData, onUpdateStates }: YouTubeSectionProps) {
  
  // Initialize safe state
  const state = youtubeData || { saved: [], history: [], subscriptions: [], apiKey: '' };
  const saved = state.saved || [];
  const history = state.history || [];
  const subscriptions = state.subscriptions || [];
  const apiKey = state.apiKey || '';

  // Tab switchers inside Media Controller
  // "search" | "library" | "history" | "subs" | "stats"
  const [activeTab, setActiveTab] = useState<'search' | 'library' | 'history' | 'subs' | 'stats'>('search');
  
  // Video player playing state
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [playingVideoDetails, setPlayingVideoDetails] = useState<any | null>(null);

  // Search state variables
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'playlist' | 'channel'>('all');
  const [searchResults, setSearchResults] = useState<any[]>(CURATED_DEFAULT_VIDEOS);
  const [isSearching, setIsSearching] = useState(false);

  // Library saving category
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'watch_later' | 'favorites' | 'studies' | 'music' | 'motivation' | 'church' | 'gym' | 'programming' | 'others'>('all');
  const [playlistSaveTag, setPlaylistSaveTag] = useState<'watch_later' | 'favorites' | 'studies' | 'music' | 'motivation' | 'church' | 'gym' | 'programming' | 'others'>('watch_later');
  
  // Custom url input watching
  const [directUrl, setDirectUrl] = useState('');

  // API Config state
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);

  // Compact Mini Music player state
  const [miniPlayerOpen, setMiniPlayerOpen] = useState(false);

  // Sync temp key
  useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  // MUTATORS
  const updateYouTubeState = (mutation: Partial<YouTubeState>) => {
    onUpdateStates({
      ...state,
      ...mutation
    });
  };

  // Perform search query (API lookup or client fallback search)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    if (apiKey) {
      try {
        const typeParam = filterType === 'all' ? 'video,channel,playlist' : filterType;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=${typeParam}&key=${apiKey}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro na solicitação da Google API YouTube");
        const result = await res.json();
        
        // Transform Google schema to UI schema
        const list = result.items.map((item: any) => {
          const idObj = item.id || {};
          const videoId = idObj.videoId || idObj.playlistId || idObj.channelId || `sample-${Date.now()}`;
          return {
            videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt?.split('T')[0] || '',
            viewCount: "N/A",
            duration: idObj.playlistId ? "Playlist" : idObj.channelId ? "Canal" : "Vídeo"
          };
        });
        
        setSearchResults(list);
      } catch (err) {
        console.error("Erro pesquisando no YouTube API v3: ", err);
        // Fallback search in our curated list
        const filtered = CURATED_DEFAULT_VIDEOS.filter(v => 
          v.title.toLowerCase().includes(query.toLowerCase()) || 
          v.channelTitle.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Local fallback search directly
      setTimeout(() => {
        const filtered = CURATED_DEFAULT_VIDEOS.filter(v => 
          v.title.toLowerCase().includes(query.toLowerCase()) || 
          v.channelTitle.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.length > 0 ? filtered : CURATED_DEFAULT_VIDEOS);
        setIsSearching(false);
      }, 400);
    }
  };

  // Save Video in Library List
  const saveVideoToLibrary = (video: any, category: any) => {
    // Check if already saved in identical category
    const alreadySaved = saved.find(s => s.videoId === video.videoId && s.category === category);
    if (alreadySaved) return;

    const newItem: SavedVideo = {
      id: `saved-${Date.now()}`,
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      channelId: video.channelId,
      publishedAt: video.publishedAt || '',
      category,
      savedAt: new Date().toISOString().split('T')[0]
    };

    updateYouTubeState({ saved: [newItem, ...saved] });
  };

  const removeSavedVideo = (id: string) => {
    updateYouTubeState({ saved: saved.filter(s => s.id !== id) });
  };

  // Play Video internally & record to watching history
  const handlePlayVideo = (video: any) => {
    setPlayingVideoId(video.videoId);
    setPlayingVideoDetails(video);
    setMiniPlayerOpen(false); // Close mini player since we open standard view

    // Guard against duplicate history
    const isAlreadyRecent = history.length > 0 && history[0].videoId === video.videoId;
    if (!isAlreadyRecent) {
      const historyItem: WatchHistoryItem = {
        id: `hist-${Date.now()}`,
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        watchedAt: new Date().toLocaleString()
      };
      updateYouTubeState({ history: [historyItem, ...history.slice(0, 49)] }); // hold max 50 items
    }
  };

  const clearHistory = () => {
    if (window.confirm("Limpar todo o histórico de vídeos assistidos?")) {
      updateYouTubeState({ history: [] });
    }
  };

  // Toggle Favorite Channels subscriptions
  const toggleSubscribeChannel = (channelId: string, title: string, thumbnail: string) => {
    const isSubbed = subscriptions.some(s => s.channelId === channelId);
    if (isSubbed) {
      updateYouTubeState({ subscriptions: subscriptions.filter(s => s.channelId !== channelId) });
    } else {
      const newSub: SubscriptionChannel = {
        id: `sub-${Date.now()}`,
        channelId,
        title,
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        subscriberCount: "135K"
      };
      updateYouTubeState({ subscriptions: [...subscriptions, newSub] });
    }
  };

  // Parse Direct custom YouTube link input
  const playDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;

    // Regexp to catch video ID from standard youtube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = directUrl.match(regExp);
    const vId = (match && match[2].length === 11) ? match[2] : null;

    if (vId) {
      const videoInfo = {
        videoId: vId,
        title: "Vídeo Externo Integrado",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60",
        channelTitle: "YouTube Player",
        publishedAt: new Date().toISOString().split('T')[0]
      };
      handlePlayVideo(videoInfo);
      setDirectUrl('');
    } else {
      alert("Endereço de vídeo inválido! Certifique-se de colar uma URL padrão de vídeo do YouTube.");
    }
  };

  // Save the custom entered developer API Key locally
  const saveApiKey = () => {
    updateYouTubeState({ apiKey: tempApiKey.trim() });
    setShowApiKeySetting(false);
  };

  // Filter saved videos by selected classification category
  const filteredSaved = saved.filter(s => selectedCategory === 'all' || s.category === selectedCategory);

  // Stats calculation
  const totalWatched = history.length;
  const totalSavedCount = saved.length;
  
  // top category
  const categoryCounts = saved.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  let topCategory = "Geral";
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      topCategory = cat;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* 1. BRAND HEADER BAR */}
      <div className="bg-gradient-to-r from-red-650 via-rose-600 to-red-500 rounded-3xl p-5 md:p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-red-500/10">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Youtube size={23} className="text-white fill-white select-none animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md leading-none">
              Mídia Core Hub
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none">
            Central de Mídia Integrada
          </h1>
          <p className="text-xs text-rose-50 font-medium max-w-xl">
            Incorpore seus estudos da igreja, canais prediletos de programação e playlists musicais de foco em um único lugar sem anúncios irritantes e persistindo estatísticas.
          </p>
        </div>

        {/* Configuration widget switches */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setShowApiKeySetting(!showApiKeySetting)}
            className="p-3 bg-white/10 dark:bg-slate-900/40 hover:bg-white/15 rounded-2xl border border-white/10 text-xs font-black flex items-center gap-1.5 transition-transform cursor-pointer active:scale-95"
          >
            <Settings2 size={15} />
            <span>Configurar API Key</span>
          </button>
        </div>
      </div>

      {/* API Key setting expanded bar */}
      <AnimatePresence>
        {showApiKeySetting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4.5 rounded-2xl space-y-3 shadow-3xs overflow-hidden select-none"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-650 rounded-xl shrink-0">
                <Info size={16} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-850 dark:text-white">Inserir YouTube v3 API Key</span>
                <p className="text-[11px] text-slate-400">
                  Por padrão, o painel roda de forma fofa simulada com vídeos de amostra. Para fazer requisições reais de pesquisa em todo o catálogo do YouTube, cole sua chave oficial da Google Cloud Console abaixo. Deixamos as chamadas prontas!
                </p>
              </div>
            </div>

            <div className="flex gap-2 text-xs select-text">
              <input
                type="password"
                placeholder="Ex milagrosa: AIzaSyA7..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:border-red-500 font-mono text-xs text-slate-800 dark:text-white"
              />
              <button
                onClick={saveApiKey}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer text-xs"
              >
                Gravar Chave
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERNAL VIDEO PLAYER DISPLAY IF ACTIVE */}
      <AnimatePresence>
        {playingVideoId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 bg-white dark:bg-slate-900 border border-slate-150/75 dark:border-slate-850 p-4 md:p-5 rounded-3xl shadow-xs"
          >
            <div className="lg:col-span-2 space-y-4">
              
              {/* Responsive Youtube Iframe block */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-100 dark:border-slate-800 shadow-sm relative">
                <iframe
                  id="ytplayer"
                  src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Title & metadata bar underneath */}
              <div className="space-y-2 select-text">
                <h2 className="text-sm md:text-base font-black text-slate-950 dark:text-white leading-snug">
                  {playingVideoDetails?.title || "Video Player"}
                </h2>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-slate-950 flex items-center justify-center text-red-650 font-black text-xs select-none border border-red-50">
                      YT
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 dark:text-white block">
                        {playingVideoDetails?.channelTitle || "Canal Ativo"}
                      </span>
                      <button 
                        onClick={() => toggleSubscribeChannel(
                          playingVideoDetails?.channelId || "sample-chan", 
                          playingVideoDetails?.channelTitle || "Canal", 
                          ""
                        )}
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          subscriptions.some(s => s.channelId === (playingVideoDetails?.channelId || "sample-chan"))
                            ? 'text-slate-400'
                            : 'text-red-500 hover:underline'
                        }`}
                      >
                        {subscriptions.some(s => s.channelId === (playingVideoDetails?.channelId || "sample-chan")) ? '✓ Inscrito' : '+ Seguir Canal'}
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 select-none">
                    <div className="relative group/library inline-block">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            saveVideoToLibrary(playingVideoDetails, e.target.value);
                            e.target.value = '';
                            alert("Vídeo salvo com sucesso na biblioteca selecionada!");
                          }
                        }}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] font-black cursor-pointer uppercase text-slate-500"
                        defaultValue=""
                      >
                        <option value="" disabled>Salvar na Biblioteca ↓</option>
                        <option value="watch_later">Assistir Depois ⏰</option>
                        <option value="favorites">Favoritos ❤️</option>
                        <option value="studies">Estudos 🎓</option>
                        <option value="music">Música 🎵</option>
                        <option value="motivation">Motivação 🔥</option>
                        <option value="church">Igreja ⛪</option>
                        <option value="gym">Treino 💪</option>
                        <option value="programming">Programação 💻</option>
                        <option value="others">Outros 📁</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${playingVideoId}`);
                        alert("Link do vídeo copiado para área de transferência!");
                      }}
                      className="p-1 px-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 dark:text-slate-400 font-extrabold text-[10px] rounded-xl flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <Copy size={11} /> Copiar Link
                    </button>

                    <button
                      onClick={() => {
                        setMiniPlayerOpen(true);
                        setPlayingVideoId(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-650 dark:bg-indigo-950/20 text-[10px] font-black cursor-pointer uppercase"
                      title="Ativar modo compacto music/background"
                    >
                      Minimizar 🎵
                    </button>

                    <button
                      onClick={() => {
                        setPlayingVideoId(null);
                        setPlayingVideoDetails(null);
                      }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-405 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                      title="Fechar player"
                    >
                      Fechar
                    </button>
                  </div>
                </div>

                {playingVideoDetails?.publishedAt && (
                  <p className="text-[10px] font-bold text-slate-400 mt-2 select-none">
                    Data de publicação: {playingVideoDetails.publishedAt}
                  </p>
                )}

              </div>
            </div>

            {/* Side interactive list of quick recommendations */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400/95 tracking-wider select-none block">
                Up Next / Curadoria Suplementar
              </span>
              
              <div className="space-y-2.5 max-h-[300px] lg:max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
                {CURATED_DEFAULT_VIDEOS.filter(v => v.videoId !== playingVideoId).map((v) => (
                  <div
                    key={v.videoId}
                    onClick={() => handlePlayVideo(v)}
                    className="flex gap-2.5 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-20 aspect-video rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-100 dark:border-slate-800"
                    />
                    <div className="min-w-0 flex flex-col justify-between">
                      <span className="text-[11px] font-extrabold text-slate-800 dark:text-white leading-snug line-clamp-2">
                        {v.title}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 truncate leading-none mt-1">
                        {v.channelTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING MINI MUSIC PLAYER CONTAINER */}
      <AnimatePresence>
        {miniPlayerOpen && playingVideoDetails && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-slate-800 text-white p-3 rounded-2xl w-64 md:w-72 shadow-2xl flex items-center gap-3 select-none"
          >
            <div className="w-12 aspect-video shrink-0 bg-slate-950 rounded-lg overflow-hidden relative group">
              <img src={playingVideoDetails.thumbnail} className="w-full h-full object-cover opacity-80" alt="Capa" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Sliders size={12} className="text-rose-500 animate-bounce" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-rose-405 leading-none uppercase tracking-widest">Modo Música Ativo</p>
              <h4 className="text-[11px] font-black truncate text-white mt-1 leading-normal pr-5">{playingVideoDetails.title}</h4>
              <p className="text-[9px] font-semibold text-slate-400 truncate leading-none mt-0.5">{playingVideoDetails.channelTitle}</p>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setPlayingVideoId(playingVideoDetails.videoId);
                  setMiniPlayerOpen(false);
                }}
                className="p-1.5 hover:bg-slate-850 rounded-lg text-rose-500 transition-colors cursor-pointer"
                title="Maximizar Player"
              >
                <Tv size={12} />
              </button>
              <button
                onClick={() => {
                  setMiniPlayerOpen(false);
                  setPlayingVideoId(null);
                  setPlayingVideoDetails(null);
                }}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 cursor-pointer"
                title="Desligar Música"
              >
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SUB-ABAS DE CONTROLE GERAL DO YOUTUBE */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none border-b border-slate-100 dark:border-slate-850">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'bg-red-600 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          🔍 Pesquisar Vídeos
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'library'
              ? 'bg-red-600 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📂 Biblioteca Pessoal ({saved.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-red-600 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📜 Histórico Interno ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('subs')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'subs'
              ? 'bg-red-600 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📺 Minhas Assinaturas ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-red-600 text-white shadow-3xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-910 text-slate-500 dark:text-slate-400'
          }`}
        >
          📊 Estatísticas Canal
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 2.1: PESQUISAR E DIRECT WATCH LINKS */}
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Input Search Bars rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pesquisa por Palavra Chave */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-3xl space-y-3.5 shadow-3xs">
                <span className="text-[10px] font-black uppercase text-slate-400 select-none tracking-widest block">Pesquisar Catálogo</span>
                
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="flex-1 relative flex items-center">
                    <Search size={14} className="absolute left-3 text-slate-400 select-none" />
                    <input
                      type="text"
                      placeholder="Pesquisar estudos, dev, música..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-xs py-2.5 pl-8.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Buscar
                  </button>
                </form>

                {/* Filter suggestions */}
                <div className="flex gap-2 overflow-x-auto select-none pt-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center shrink-0">Tipo:</span>
                  {(['all', 'video', 'playlist', 'channel'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border ${
                        filterType === type
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      {type === 'all' ? 'Ver Tudo' : type === 'video' ? 'Vídeos' : type === 'playlist' ? 'Playlists' : 'Canais'}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Direta watcher bar */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-3xl space-y-3.5 shadow-3xs">
                <span className="text-[10px] font-black uppercase text-slate-400 select-none tracking-widest block">Ver por Link Direto</span>
                
                <form onSubmit={playDirectUrl} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Cole qualquer link de vídeo (ex: https://youtube.com/watch?v=...)"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-red-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Assistir
                  </button>
                </form>

                <p className="text-[10px] text-slate-400 font-bold select-none italic">
                  * Útil quando você possui o link específico do vídeo e deseja assistir inline no painel sem propagandas!
                </p>
              </div>

            </div>

            {/* Results Grid List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between select-none">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400/95 block">
                  {apiKey ? "Resultados Oficiais do YouTube" : "Amostras Recomendadas do Painel"}
                </span>
                {!apiKey && (
                  <span className="text-[10px] text-amber-600 font-extrabold animate-pulse bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-lg border border-amber-200/20">
                    Modo Amostra Fofa
                  </span>
                )}
              </div>

              {isSearching ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-bold">Consultando servidores do YouTube...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.map((v, idx) => (
                    <div
                      key={v.videoId + "-" + idx}
                      className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 rounded-2xl overflow-hidden shadow-3xs flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Image Thumbnail wrapper with hover play button */}
                      <div 
                        onClick={() => handlePlayVideo(v)}
                        className="aspect-video w-full relative overflow-hidden bg-slate-100 border-b border-slate-100 dark:border-slate-800"
                      >
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <div className="p-3 bg-red-600 rounded-full text-white shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                            <Play size={16} fill="white" />
                          </div>
                        </div>

                        {v.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide text-white">
                            {v.duration}
                          </span>
                        )}
                      </div>

                      {/* Info payload */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 
                            onClick={() => handlePlayVideo(v)}
                            className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 select-text hover:text-red-550"
                          >
                            {v.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400/90 hover:underline block truncate select-text">
                            {v.channelTitle}
                          </span>
                        </div>

                        {/* Actions bar */}
                        <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">{v.viewCount ? `${v.viewCount} views` : ''}</span>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                saveVideoToLibrary(v, 'watch_later');
                                alert("Salvo em Assistir Depois!");
                              }}
                              className="p-1 px-2 border border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-400 hover:text-rose-500 rounded-lg"
                              title="Marcar Assistir Depois"
                            >
                              <Clock size={11} />
                            </button>
                            <button
                              onClick={() => {
                                saveVideoToLibrary(v, 'favorites');
                                alert("Salvo nos Favoritos!");
                              }}
                              className="p-1 px-2 border border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-400 hover:text-red-550 rounded-lg animate-pulse"
                              title="Favoritar vídeo"
                            >
                              <Heart size={11} fill="red" className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 2.2: PERSONAL LIBRARY / WATCH LATER */}
        {activeTab === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Category filter pills row */}
            <div className="flex gap-2 overflow-x-auto pb-1 select-none">
              {(['all', 'watch_later', 'favorites', 'studies', 'music', 'motivation', 'church', 'gym', 'programming', 'others'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white border-red-650'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat === 'all' ? '📚 Ver Tudo' : cat === 'watch_later' ? '⏰ Assistir Depois' : cat === 'favorites' ? '❤️ Favoritos' : cat === 'studies' ? '🎓 Estudos' : cat === 'music' ? '🎵 Música' : cat === 'motivation' ? '🔥 Motivação' : cat === 'church' ? '⛪ Igreja' : cat === 'gym' ? '💪 Treino' : cat === 'programming' ? '💻 Codar' : '📁 Outros'}
                </button>
              ))}
            </div>

            {/* Saved list cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSaved.map((sv) => (
                <div
                  key={sv.id}
                  className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 rounded-2.5xl overflow-hidden shadow-3xs flex flex-col justify-between group relative"
                >
                  {/* Category label pin */}
                  <span className="absolute top-2.5 left-2.5 z-10 text-[7px] uppercase font-black bg-indigo-650 text-white px-2 py-0.5 rounded shadow-sm opacity-90 select-none">
                    {sv.category}
                  </span>

                  <div 
                    onClick={() => handlePlayVideo(sv)}
                    className="aspect-video w-full relative overflow-hidden bg-slate-100 border-b border-slate-100 dark:border-slate-800"
                  >
                    <img
                      src={sv.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600"}
                      alt={sv.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <div className="p-2.5 bg-red-600 rounded-full text-white shadow">
                        <Play size={13} fill="white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => handlePlayVideo(sv)}
                        className="text-xs font-black text-slate-850 dark:text-white leading-normal truncate-2-lines line-clamp-2 hover:text-red-500 cursor-pointer"
                      >
                        {sv.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{sv.channelTitle}</p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 flex items-center justify-between text-[9px] font-bold">
                      <span className="text-slate-400 italic">Salvo em {sv.savedAt}</span>
                      
                      <button
                        onClick={() => removeSavedVideo(sv.id)}
                        className="p-1 px-2 border border-rose-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Remover vídeo"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              {filteredSaved.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <span className="text-xl">📁</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Nenhum vídeo guardado nesta biblioteca ainda.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 2.3: HISTORY LOGS WATCH HISTORY */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center select-none">
              <div>
                <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  📜 Histórico Interno de Vídeos
                </h3>
                <p className="text-xs text-slate-400">Lista cronológica de player executados na presente conta.</p>
              </div>
              
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 text-rose-600 font-black text-[10px] uppercase rounded-lg border border-rose-200/20 active:scale-95 cursor-pointer"
                >
                  Limpar Histórico
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 rounded-2.5xl p-4 md:p-5 shadow-3xs space-y-3.5">
              {history.map((hist) => (
                <div
                  key={hist.id}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-950/40 rounded-2xl group transition-all"
                >
                  <div 
                    onClick={() => handlePlayVideo(hist)}
                    className="flex gap-3 items-center cursor-pointer min-w-0"
                  >
                    <img
                      src={hist.thumbnail || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150"}
                      alt={hist.title}
                      className="w-16 rounded aspect-video object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate group-hover:text-red-500 leading-normal">
                        {hist.title}
                      </h4>
                      <div className="flex gap-2 text-[10px] text-slate-400/90 font-semibold select-none leading-none mt-1">
                        <span>{hist.channelTitle}</span>
                        <span>•</span>
                        <span>Assistido: {hist.watchedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateYouTubeState({ history: history.filter(h => h.id !== hist.id) });
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-slate-405 hover:text-rose-500 rounded transition-all cursor-pointer"
                    title="Excluir do histórico"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {history.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 italic">Histórico de reprodução vazio</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 2.4: FAVORITE SIGNATURE CHANNELS */}
        {activeTab === 'subs' && (
          <motion.div
            key="subs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xs md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider select-none">
                📺 Canais Inscritos / Favoritados
              </h3>
              <p className="text-xs text-slate-400">Atalhos rápidos para abas de criadores teológicos e acadêmicos.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-850 p-4 rounded-3xl text-center shadow-3xs flex flex-col justify-between items-center group relative overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={sub.thumbnail}
                      alt={sub.title}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="mt-3 select-text max-w-full">
                    <h4 className="text-xs font-black truncate text-slate-850 dark:text-white">
                      {sub.title}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold block mt-0.5">
                      {sub.subscriberCount || "10M"} seguidores
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 flex w-full justify-center select-none">
                    <button
                      onClick={() => toggleSubscribeChannel(sub.channelId, "", "")}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 text-rose-600 font-extrabold text-[9px] uppercase rounded-lg border border-rose-200/20 active:scale-95 cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>

                </div>
              ))}

              {subscriptions.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 select-none">
                  <span className="text-xl">📺</span>
                  <p className="text-xs font-semibold mt-1">Você não possui canais recomendados favoritados ainda.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW 2.5: STATS RECAP DASHBOARD */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 select-none"
          >
            <div>
              <h3 className="text-xs md:text-sm font-black text-slate-955 dark:text-white uppercase tracking-wider">
                📊 Estatísticas de Consumo de Mídia
              </h3>
              <p className="text-xs text-slate-400 shadow-3xs">Acompanhamento e monitoramento de tempo de tela e dados eclesiásticos/teológicos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2.5xl space-y-1 block">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total de Reproduções</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-red-600">{totalWatched}</span>
                  <span className="text-xs text-slate-400 font-bold">vídeos vistos</span>
                </div>
              </div>

              <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2.5xl space-y-1 block">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Biblioteca Salva</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-indigo-500">{totalSavedCount}</span>
                  <span className="text-xs text-slate-400 font-bold">salvos</span>
                </div>
              </div>

              <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2.5xl space-y-1 block">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Canal Foco</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-base font-black text-amber-600 truncate max-w-full block">
                    {subscriptions[0]?.title || "N/A"}
                  </span>
                </div>
              </div>

              <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2.5xl space-y-1 block">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Categoria Favorita</span>
                <div className="flex items-baseline gap-1 mt-1 text-sm font-black capitalize text-slate-800 dark:text-white">
                  <span>{topCategory === "favorites" ? "Favoritos ❤️" : topCategory === "music" ? "Músicas 🎵" : topCategory === "studies" ? "Estudos 🎓" : topCategory === "church" ? "Igreja ⛪" : topCategory === "gym" ? "Treinos 💪" : topCategory}</span>
                </div>
              </div>

            </div>

            {/* Motivational message */}
            <div className="p-4.5 rounded-3xl bg-red-50/50 dark:bg-red-955/10 border border-red-100/30 flex items-center gap-3.5">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">Mídia Consciente! 🌸</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                  Sua central ajuda a manter o consumo de tela estruturado. Salve apenas vídeos que agreguem real valor à sua espiritualidade (Igreja), seus treinos de academia e sua carreira acadêmica de codificação!
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
