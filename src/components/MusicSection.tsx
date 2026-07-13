import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Trash2, 
  Plus, 
  Disc, 
  User, 
  Radio, 
  Share2, 
  AlignLeft,
  X,
  Play,
  Volume2,
  Upload
} from 'lucide-react';
import { MusicState, MusicTrack, MusicArtist } from '../types';

interface MusicSectionProps {
  music: MusicState;
  onAddTrack: (track: Omit<MusicTrack, 'id'>) => void;
  onDeleteTrack: (id: string) => void;
  onAddArtist: (artist: Omit<MusicArtist, 'id'>) => void;
  onDeleteArtist: (id: string) => void;
  onUpdateMetadata: (metadata: { currentVibe?: string; vibePhase?: string }) => void;
  onUpdateTrack: (track: MusicTrack) => void;
  onUpdateArtist: (artist: MusicArtist) => void;
}

export default function MusicSection({
  music,
  onAddTrack,
  onDeleteTrack,
  onAddArtist,
  onDeleteArtist,
  onUpdateMetadata,
  onUpdateTrack,
  onUpdateArtist
}: MusicSectionProps) {
  // Tabs for music view: tracks , artists , vibe
  const [activeSubTab, setActiveSubTab] = useState<'tracks' | 'artists' | 'vibe'>('tracks');
  const [showAddForm, setShowAddForm] = useState(false);

  // Track Form
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackNotes, setTrackNotes] = useState('');
  const [trackImageUrl, setTrackImageUrl] = useState('');

  // Artist Form
  const [artistName, setArtistName] = useState('');
  const [artistGenre, setArtistGenre] = useState('');
  const [artistNotes, setArtistNotes] = useState('');
  const [artistImageUrl, setArtistImageUrl] = useState('');

  // Vibe Settings state (for rapid inline saving)
  const [editedVibe, setEditedVibe] = useState(music.currentVibe);
  const [editedPhase, setEditedPhase] = useState(music.vibePhase);
  const [isVibeSaved, setIsVibeSaved] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim() || !trackArtist.trim()) return;

    onAddTrack({
      title: trackTitle.trim(),
      artist: trackArtist.trim(),
      notes: trackNotes.trim(),
      imageUrl: trackImageUrl.trim() || undefined
    });

    setTrackTitle('');
    setTrackArtist('');
    setTrackNotes('');
    setTrackImageUrl('');
    setShowAddForm(false);
  };

  const handleArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !artistGenre.trim()) return;

    onAddArtist({
      name: artistName.trim(),
      genre: artistGenre.trim(),
      notes: artistNotes.trim(),
      imageUrl: artistImageUrl.trim() || undefined
    });

    setArtistName('');
    setArtistGenre('');
    setArtistNotes('');
    setArtistImageUrl('');
    setShowAddForm(false);
  };

  const saveVibeMetadata = () => {
    onUpdateMetadata({
      currentVibe: editedVibe,
      vibePhase: editedPhase
    });
    setIsVibeSaved(true);
    setTimeout(() => setIsVibeSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Music className="text-pink-500" /> Vibe Musical & Playlists
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Guarde as trilhas sonoras que embalam seu momento, catalogue seus artistas preferidos e defina sua vibe pessoal atual.
        </p>
      </div>

      {/* Main Music navigation row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl w-fit">
          <button
            onClick={() => { setActiveSubTab('tracks'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'tracks'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <Disc size={14} className={activeSubTab === 'tracks' ? 'animate-spin' : ''} /> Músicas Ouvidas ({music.tracks.length})
          </button>
          
          <button
            onClick={() => { setActiveSubTab('artists'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'artists'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <User size={14} /> Artistas Favoritos ({music.artists.length})
          </button>

          <button
            onClick={() => { setActiveSubTab('vibe'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'vibe'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <Radio size={14} /> Minha Vibe Atual
          </button>
        </div>

        {activeSubTab !== 'vibe' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-sm text-xs cursor-pointer"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            {showAddForm ? 'Cancelar' : activeSubTab === 'tracks' ? 'Registrar Música' : 'Registrar Artista'}
          </button>
        )}
      </div>

      {/* Add track form */}
      <AnimatePresence>
        {showAddForm && activeSubTab === 'tracks' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleTrackSubmit} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1">Registrar Música</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">Título da Faixa</label>
                  <input
                    type="text"
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="Ex: Starboy"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">Cantor / Artista</label>
                  <input
                    type="text"
                    value={trackArtist}
                    onChange={(e) => setTrackArtist(e.target.value)}
                    placeholder="Ex: The Weeknd"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">Observações (“vibe”)</label>
                  <input
                    type="text"
                    value={trackNotes}
                    onChange={(e) => setTrackNotes(e.target.value)}
                    placeholder="Ex: Excelente para ouvir codificando"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">Imagem de Capa</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer text-xs font-semibold transition-all">
                      <Upload size={14} className="text-pink-500" />
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
                                setTrackImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {trackImageUrl && (
                      <div className="relative group">
                        <img src={trackImageUrl} alt="Capa" className="h-10 w-10 object-cover rounded border border-slate-200 dark:border-slate-800" />
                        <button
                          type="button"
                          onClick={() => setTrackImageUrl('')}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-5 py-2 rounded-lg text-xs transition-all active:scale-95">
                  Salvar Música na Lista
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Artist form */}
      <AnimatePresence>
        {showAddForm && activeSubTab === 'artists' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleArtistSubmit} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Registrar Artista Favorito</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase font-sans">Nome do Cantor/Compositor</label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Ex: Hans Zimmer"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">Gênero Principal</label>
                  <input
                    type="text"
                    value={artistGenre}
                    onChange={(e) => setArtistGenre(e.target.value)}
                    placeholder="Ex: Soundtracks / Classical"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase font-sans">Anotações da fase</label>
                  <input
                    type="text"
                    value={artistNotes}
                    onChange={(e) => setArtistNotes(e.target.value)}
                    placeholder="Ex: Melhor instrumentista da década!"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2 text-sm focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase font-sans">Foto do Artista</label>
                  <div className="flex items-center gap-3 font-sans">
                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer text-xs font-semibold transition-all">
                      <Upload size={14} className="text-pink-500" />
                      <span>Carregar Foto</span>
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
                                setArtistImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {artistImageUrl && (
                      <div className="relative group">
                        <img src={artistImageUrl} alt="Artista" className="h-10 w-10 object-cover rounded-full border border-slate-200 dark:border-slate-800" />
                        <button
                          type="button"
                          onClick={() => setArtistImageUrl('')}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-5 py-2 rounded-lg text-xs transition-all active:scale-95">
                  Salvar Artista
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Lists rendered based on SubTab */}
      <div className="space-y-4">
        
        {/* SubTab = Tracks (Songs list) */}
        {activeSubTab === 'tracks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {music.tracks.map((track) => (
              <div 
                key={track.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-pink-500/35 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Track Cover Thumbnail */}
                  <div className="relative group/cover w-12 h-12 rounded-lg overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    <img 
                      src={track.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=70'} 
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=70';
                      }}
                    />
                    <label
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center text-white text-[8px] font-bold transition-opacity cursor-pointer text-center"
                      title="Mudar capa"
                    >
                      Alterar
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
                                onUpdateTrack({ ...track, imageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {track.artist}
                    </p>
                    {track.notes && (
                      <span className="inline-block text-[10px] italic text-pink-600 dark:text-pink-400 mt-1 max-w-xs truncate">
                        “ {track.notes} ”
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button className="p-1 px-1.5 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 dark:bg-slate-950/30 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors">
                    <Play size={10} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => onDeleteTrack(track.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {music.tracks.length === 0 && (
              <p className="col-span-2 text-center text-slate-500 text-sm py-8">Você ainda não registrou músicas.</p>
            )}
          </div>
        )}

        {/* SubTab = Artists */}
        {activeSubTab === 'artists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {music.artists.map((art) => (
              <div 
                key={art.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-pink-500/35 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Round profile picture area */}
                  <div className="relative group/artist w-12 h-12 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    <img 
                      src={art.imageUrl || `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=70`} 
                      alt={art.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=70`;
                      }}
                    />
                    <label
                      className="absolute inset-0 bg-black/75 opacity-0 group-hover/artist:opacity-100 flex items-center justify-center text-white text-[8px] font-bold transition-opacity cursor-pointer text-center font-sans"
                      title="Mudar foto"
                    >
                      Alterar
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
                                onUpdateArtist({ ...art, imageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {art.name}
                    </h4>
                    <span className="inline-block text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded mt-1">
                      🎸 {art.genre}
                    </span>
                    {art.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                        {art.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  <button 
                    onClick={() => onDeleteArtist(art.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {music.artists.length === 0 && (
              <p className="col-span-2 text-center text-slate-500 text-sm py-8">Sua lista de produtores e bandas favoritas está em branco.</p>
            )}
          </div>
        )}

        {/* SubTab = Vibe Settings */}
        {activeSubTab === 'vibe' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 md:p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest pb-3 border-b flex items-center gap-1.5">
              <Volume2 className="text-pink-500" size={16} /> Ajustar Clima e Sensação de Vida (Status Vibe)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase font-sans">Citação da Vibe Musical Geral</label>
                <input
                  type="text"
                  value={editedVibe}
                  onChange={(e) => setEditedVibe(e.target.value)}
                  placeholder="Ex: Foco produtivo com toques de lofi clássico e acústico..."
                  className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white font-medium"
                />
                <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">
                  Descreva como você conceitualiza a trilha de fundo da sua vida neste trimestre.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase font-sans">Fase Atual da sua Vida (Metáfora)</label>
                <input
                  type="text"
                  value={editedPhase}
                  onChange={(e) => setEditedPhase(e.target.value)}
                  placeholder="Ex: Fase de colheita, dedicação ao trabalho e tranquilidade mental."
                  className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-lg p-2.5 text-sm focus:outline-none dark:text-white font-medium"
                />
                <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">
                  Uma âncora textual para sua mente revisar sempre que abrir o painel.
                </span>
              </div>

              <div className="flex items-center justify-between pt-4">
                {isVibeSaved && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ✔ Vibe pessoal salva com sucesso!
                  </span>
                )}
                {!isVibeSaved && <div />}
                <button
                  type="button"
                  onClick={saveVibeMetadata}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Confirmar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
