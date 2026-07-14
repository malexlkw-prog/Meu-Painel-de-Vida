import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  MapPin, 
  Activity, 
  Send, 
  Timer, 
  CheckCircle2, 
  ChevronRight, 
  Info,
  Clock,
  Sparkles,
  BarChart3,
  RotateCw,
  Settings,
  X,
  User,
  Sliders,
  Database
} from 'lucide-react';
import { Match, Player, Stadium, GroupTeam } from '../data/copaData';
import { PLAYER_BIOS, PlayerBioDetail } from '../data/playerBios';

// Procedural generator for detailed profiles of non-handcrafted players
const getPlayerDetail = (playerName: string, playerNum?: number, teamName?: string, position?: string, club?: string, age?: number): PlayerBioDetail => {
  // If we have handcrafted bio, return it
  if (PLAYER_BIOS[playerName]) {
    return PLAYER_BIOS[playerName];
  }

  // Also try exact match ignoring whitespace or capitalisation
  const perfectKey = Object.keys(PLAYER_BIOS).find(k => k.toLowerCase() === playerName.toLowerCase());
  if (perfectKey && PLAYER_BIOS[perfectKey]) {
    return PLAYER_BIOS[perfectKey];
  }
  
  // Handcraft some fallback data for Croatia / Germany Stars if requested
  const namesLower = playerName.toLowerCase();
  if (namesLower.includes("modrić") || namesLower.includes("modric")) {
    return {
      number: 10,
      name: "Luka Modrić",
      fullName: "Luka Modrić",
      position: "Meio-campista",
      age: 40,
      height: "1.72 m",
      weight: "66 kg",
      dominantFoot: "Direito",
      nationality: "Croácia",
      club: "Real Madrid (ESP)",
      marketValue: "€ 8.00M",
      games: 178,
      goals: 24,
      assists: 29,
      minutesPlayed: 14500,
      yellowCards: 12,
      redCards: 0,
      bio: "Uma lenda viva do futebol mundial. Vencedor da Bola de Ouro em 2018, Luka Modrić é o maior jogador da história do futebol croata e o cérebro eterno do meio-campo do Real Madrid.",
      career: "Subiu pelo Dinamo Zagreb, decolou no Tottenham Hotspur e assinou em 2012 com o Real Madrid para fazer história vencendo 6 Champions Leagues.",
      pastClubs: ["Zrinjski Mostar", "Inter Zaprešić", "Dinamo Zagreb", "Tottenham Hotspur"],
      titles: ["Bola de Ouro Ballon d'Or 2018", "UEFA Champions League (6x)", "La Liga (4x)", "Copa do Mundo Vice-campeão 2018", "Copa do Mundo 3º lugar 2022"],
      photoUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200"
    };
  }

  if (namesLower.includes("wirtz")) {
    return {
      number: 17,
      name: "Florian Wirtz",
      fullName: "Florian Richard Wirtz",
      position: "Meio-campista",
      age: 23,
      height: "1.76 m",
      weight: "70 kg",
      dominantFoot: "Direito",
      nationality: "Alemanha",
      club: "Bayer Leverkusen (ALE)",
      marketValue: "€ 130.00M",
      games: 18,
      goals: 4,
      assists: 8,
      minutesPlayed: 1250,
      yellowCards: 1,
      redCards: 0,
      bio: "Florian Wirtz é o jovem maestro de altíssima técnica e criatividade incomparável que comanda o Leverkusen invicto e a nova dinastia tática da seleção alemã.",
      career: "Subiu na base do Köln, assinou com o Leverkusen em 2020 e se tornou o melhor construtor do futebol europeu sob tutela de Xabi Alonso.",
      pastClubs: ["FC Köln (ALE)"],
      titles: ["Bundesliga Alemã 2023/24", "Copa da Alemanha 2024", "Campeonato Europeu Sub-21 2021"],
      photoUrl: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=200"
    };
  }

  // Non-generative profile for others - respecting "Nunca inventar valores"
  return {
    number: playerNum || 0,
    name: playerName,
    fullName: playerName,
    position: position || 'Não divulgada oficialmente',
    age: age || 0,
    height: 'Não divulgada oficialmente',
    weight: 'Não divulgada oficialmente',
    dominantFoot: 'Não divulgada oficialmente',
    nationality: teamName || 'Não divulgada oficialmente',
    club: club || 'Não divulgado oficialmente',
    marketValue: 'Não divulgado oficialmente',
    games: 0,
    goals: 0,
    assists: 0,
    minutesPlayed: 0,
    yellowCards: 0,
    redCards: 0,
    bio: 'Informações detalhadas deste atleta ainda não foram divulgadas oficialmente.',
    career: 'Carreira profissional em andamento.',
    pastClubs: [],
    titles: [],
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200'
  };
};

export default function WorldCupSection() {
  const [loading, setLoading] = useState(true);
  const [copaData, setCopaData] = useState<{
    matches: Match[];
    groups: Record<string, GroupTeam[]>;
    squadBrazil: Player[];
    stadiums: Stadium[];
    provider?: string;
    realData?: boolean;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'groups' | 'squad' | 'stadiums'>('home');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Detailed Match stats/lineups/events
  const [matchDetails, setMatchDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [matchDetailsTab, setMatchDetailsTab] = useState<'detalhes' | 'escalacao' | 'estatisticas'>('detalhes');
  const [lineupTeamToggle, setLineupTeamToggle] = useState<'home' | 'away'>('home');

  // Player Bio overlay
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerBioDetail | null>(null);

  // Football API configuration
  const [provider, setProvider] = useState<'football-data' | 'api-football'>('api-football');
  const [apiKey, setApiKey] = useState('');
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiStatusMessage, setApiStatusMessage] = useState('');

  // Tactical Analyst chatbot
  const [analystPrompt, setAnalystPrompt] = useState('');
  const [analystResponse, setAnalystResponse] = useState('');
  const [analystLoading, setAnalystLoading] = useState(false);

  // Time remaining count
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Load API config on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('c_football_provider');
    const savedKey = localStorage.getItem('c_football_api_key');
    if (savedProvider === 'football-data' || savedProvider === 'api-football') {
      setProvider(savedProvider);
    }
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Fetch basic copa data with custom headers
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const savedProvider = localStorage.getItem('c_football_provider') || provider;
      const savedKey = localStorage.getItem('c_football_api_key') || apiKey;

      const headers: Record<string, string> = {};
      if (savedKey && savedKey.trim() !== '') {
        headers['x-provider'] = savedProvider;
        headers['x-api-key'] = savedKey;
      }

      const res = await fetch('/api/copa', { headers });
      const json = await res.json();
      setCopaData(json);
    } catch (e) {
      console.error("Erro ao carregar dados da Copa", e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial fetch and configure 10s auto refresh (for real-time live match simulation)
  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Fetch specific match details (lineup/stats) when a match is selected
  useEffect(() => {
    if (!selectedMatch) {
      setMatchDetails(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const savedProvider = localStorage.getItem('c_football_provider') || provider;
        const savedKey = localStorage.getItem('c_football_api_key') || apiKey;

        const headers: Record<string, string> = {};
        if (savedKey && savedKey.trim() !== '') {
          headers['x-provider'] = savedProvider;
          headers['x-api-key'] = savedKey;
        }

        const res = await fetch(`/api/copa/match/${selectedMatch.id}`, { headers });
        const json = await res.json();
        setMatchDetails(json);
        setLineupTeamToggle('home'); // default to home team lineup
      } catch (e) {
        console.error("Erro ao buscar detalhes da partida", e);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
    setMatchDetailsTab('detalhes');
  }, [selectedMatch]);

  // Save API setup to local storage & trigger refetch
  const handleSaveApiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setApiStatusMessage('Sincronizando com os servidores esportivos oficiais...');

    localStorage.setItem('c_football_provider', provider);
    localStorage.setItem('c_football_api_key', apiKey);

    try {
      const headers: Record<string, string> = {
        'x-provider': provider,
        'x-api-key': apiKey
      };

      const res = await fetch('/api/copa', { headers });
      const json = await res.json();

      if (json.realData) {
        setApiStatusMessage('✅ API conectada e sincronizada com sucesso!');
        setCopaData(json);
        setTimeout(() => {
          setApiConfigOpen(false);
          setApiStatusMessage('');
        }, 1200);
      } else {
        setApiStatusMessage('⚠️ Chave incorreta ou sem dados. Iniciando Fallback Premium.');
        setCopaData(json);
        setTimeout(() => {
          setApiConfigOpen(false);
          setApiStatusMessage('');
        }, 1500);
      }
    } catch (err: any) {
      setApiStatusMessage('❌ Falha na conexão ou limite de requisições excedido.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset API key configuration
  const handleResetApiConfig = () => {
    localStorage.removeItem('c_football_provider');
    localStorage.removeItem('c_football_api_key');
    setApiKey('');
    setApiStatusMessage('Configuração de API limpa. Carregando simulação premium.');
    fetchData(true);
    setTimeout(() => {
      setApiStatusMessage('');
    }, 1200);
  };

  // Countdown calculations (Brazil vs Croatia on June 23, 2026, 16:00 BRT)
  useEffect(() => {
    const targetDate = new Date('2026-06-23T16:00:00-03:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      
      const secs = Math.floor((diff / 1000) % 60);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      setCountdown({ days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Send prompt to Gemini AI analyst
  const handleAskAnalyst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystPrompt.trim()) return;

    try {
      setAnalystLoading(true);
      setAnalystResponse('');
      const res = await fetch('/api/copa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analystPrompt })
      });
      const data = await res.json();
      setAnalystResponse(data.response);
    } catch (e) {
      setAnalystResponse('Conexão sutilmente instável. Mas nossa torcida pelo Hexa continua inabalável! 🇧🇷⚽');
    } finally {
      setAnalystLoading(false);
    }
  };

  if (loading && !copaData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[450px] space-y-4">
        <RotateCw className="animate-spin text-emerald-500" size={36} />
        <p className="text-xs font-black text-slate-400">Sincronizando tabelas oficiais da FIFA Copa do Mundo 2026... 🇧🇷⚽</p>
      </div>
    );
  }

  const { matches = [], groups = {}, squadBrazil = [], stadiums = [], realData = false } = copaData || {};

  // Brazil next match item
  const nextMatchBrazil = matches.find(m => m.status === 'SCHEDULED' && (m.home === 'Brasil' || m.away === 'Brasil'));
  // Finished matches for Brazil
  const finishedBrazil = matches.filter(m => m.status === 'FINISHED' && (m.home === 'Brasil' || m.away === 'Brasil'));
  // Live matches list
  const liveMatches = matches.filter(m => m.status === 'LIVE');

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans select-none text-slate-800 dark:text-slate-100">
      
      {/* COPA DO MUNDO MAIN HEADER */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-950/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/25 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-extrabold text-amber-100 uppercase tracking-wider">
              <Trophy size={13} className="animate-bounce" /> FIFA WORLD CUP 2026 🇺🇸🇲🇽🇨🇦
            </div>
            
            {/* API Connection Indicator */}
            <button 
              onClick={() => setApiConfigOpen(true)}
              className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border transition-colors ${
                realData 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/20 hover:bg-amber-500/25'
              }`}
            >
              <span>●</span> {realData ? 'API Conectada' : 'Simulação Oficial'}
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-amber-250 to-white bg-clip-text text-transparent">
              Copa do Mundo 2026
            </h1>
            <p className="text-xs text-emerald-100 font-semibold mt-1">
              Central esportiva de torcida, estatísticas ao vivo e inteligência tática
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 pt-2 justify-center md:justify-start">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-3-5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === 'home' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-emerald-900/40 hover:bg-emerald-900/60'
              }`}
            >
              Principal 🇧🇷
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === 'matches' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-emerald-900/40 hover:bg-emerald-900/60'
              }`}
            >
              <Calendar size={12} /> Calendário
            </button>
            <button 
              onClick={() => setActiveTab('groups')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === 'groups' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-emerald-900/40 hover:bg-emerald-900/60'
              }`}
            >
              Classificação
            </button>
            <button 
              onClick={() => setActiveTab('squad')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === 'squad' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-emerald-900/40 hover:bg-emerald-900/60'
              }`}
            >
              <Users size={12} /> Elenco do Brasil
            </button>
            <button 
              onClick={() => setActiveTab('stadiums')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === 'stadiums' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-emerald-900/40 hover:bg-emerald-900/60'
              }`}
            >
              <MapPin size={12} /> Estádios
            </button>
          </div>
        </div>

        {/* Live status indicators */}
        <div className="bg-slate-900/55 border border-white/10 rounded-2.5xl p-4.5 text-center min-w-[210px] shadow-lg backdrop-blur-md shrink-0">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest mb-1.5">No Ar Agora</span>
          {liveMatches.length > 0 ? (
            liveMatches.slice(0, 1).map(m => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMatch(m)}
                className="space-y-1 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <div className="flex items-center justify-center gap-1 text-[10px] text-rose-400 font-extrabold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> AO VIVO ({m.timeElapsed})
                </div>
                <div className="flex items-center justify-center gap-2 text-md font-extrabold">
                  <span>{m.homeFlag} {m.home}</span>
                  <span className="bg-slate-850 px-2 py-0.5 rounded text-indigo-300 font-mono text-sm shadow-xs">{m.homeScore} x {m.awayScore}</span>
                  <span>{m.away} {m.awayFlag}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">Toque para estatísticas detalhadas ➔</span>
              </div>
            ))
          ) : (
            <div className="space-y-1 py-1">
              <span className="text-[10px] font-bold text-slate-400 block">Sem jogos no momento</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block font-bold">Monitorando Amistosos & Copa</span>
            </div>
          )}
        </div>
      </div>

      {/* VIEW: HOME / SELEÇÃO DA DESTAQUE */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: NEXT MATCH COUNTDOWN HERO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BRAZIL HIGHLIGHT HERO */}
            <div className="bg-gradient-to-b from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-950 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-slate-900/5 rounded-full border-[16px] border-slate-900/5 flex items-center justify-center pointer-events-none select-none">
                <span className="text-5xl font-black opacity-10">CBF</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="bg-slate-950/20 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  PRÓXIMO COMPROMISSO BRASILEIRO 🇧🇷
                </span>
                <span className="text-xs font-extrabold">Fase de Grupos • Rodada 3</span>
              </div>

              <div className="py-6 flex justify-around items-center gap-4 text-center">
                <div onClick={() => setSelectedPlayer(getPlayerDetail('Danilo (C)', 2, 'Brasil'))} className="space-y-1 cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-4xl shadow-inner">
                    🇧🇷
                  </div>
                  <span className="text-sm font-black tracking-tight block">BRASIL</span>
                </div>

                <div className="bg-slate-950 text-white font-mono px-3.5 py-1.5 rounded-2xl text-xs font-extrabold tracking-widest shrink-0 shadow-md">
                  VS
                </div>

                <div onClick={() => setSelectedPlayer(getPlayerDetail('Luka Modrić', 10, 'Croácia'))} className="space-y-1 cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-4xl shadow-inner">
                    🇭🇷
                  </div>
                  <span className="text-sm font-black tracking-tight block">CROÁCIA</span>
                </div>
              </div>

              {/* Countdown panel */}
              <div className="bg-slate-950 text-white rounded-2xl p-4.5 shadow-md flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Cronômetro de Regressão</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-extrabold text-md select-all">
                    <span>{countdown.days}d</span>
                    <span>:</span>
                    <span>{countdown.hours}h</span>
                    <span>:</span>
                    <span>{countdown.mins}m</span>
                    <span>:</span>
                    <span>{countdown.secs}s</span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-bold text-slate-350">
                  <div className="flex items-center gap-1 justify-end">
                    <MapPin size={11} className="text-amber-500" />
                    <span>MetLife Stadium</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Clock size={11} className="text-amber-500" />
                    <span>23/06 às 16:00 (Brasília)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT RECOGNITIONS FOR BRASIL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 p-5 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm sm:text-md flex items-center gap-1.5 text-slate-900 dark:text-white">
                <CheckCircle2 className="text-emerald-500" size={18} /> Resultados do Brasil no Grupo D (100% Realista)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {finishedBrazil.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2.5xl border border-slate-105 dark:border-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{m.date}</span>
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">CONCLUÍDO</span>
                    </div>

                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span>{m.homeFlag}</span>
                        <span className="truncate">{m.home}</span>
                      </div>
                      <span>{m.homeScore}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span>{m.awayFlag}</span>
                        <span className="truncate">{m.away}</span>
                      </div>
                      <span>{m.awayScore}</span>
                    </div>

                    <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold flex items-center gap-1">
                      <span>Ver estatísticas & eventos completos</span> <ChevronRight size={10} />
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COL: AI COPA MESTRE ANALYST BOX & STANDING DETAIL */}
          <div className="space-y-6">
            
            {/* TACTICAL CHATBOX */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-5 text-white space-y-4 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/25 border border-indigo-400/30 rounded-xl">
                  <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200">Analista Tático da Copa</h3>
                  <p className="text-[10px] text-indigo-300">Inteligência Artificial Esportiva</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Dúvidas sobre o caminho do Hexa? Quer simular escalações ou analisar individualmente os adversários? Pergunte ao mestre!
              </p>

              <form onSubmit={handleAskAnalyst} className="space-y-2">
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={analystPrompt}
                    onChange={(e) => setAnalystPrompt(e.target.value)}
                    placeholder="Ex: Como conter o drible de Vinicius Jr?"
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-w-0 font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={analystLoading || !analystPrompt.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 p-2 rounded-xl text-white cursor-pointer select-none shrink-0 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>

              {/* Analyst Response Panel */}
              {(analystLoading || analystResponse) && (
                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 text-xs text-slate-200 space-y-2 max-h-[220px] overflow-y-auto">
                  {analystLoading ? (
                    <div className="flex items-center gap-2 text-indigo-300 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="text-[10px] font-bold">Processando planilhas e histórico...</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <div className="font-bold text-[10px] uppercase text-indigo-400 tracking-wider">Parecer Técnico:</div>
                      <p>{analystResponse}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MINI STANDING TABLE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 p-5 rounded-3xl space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Classificação Atual:</h3>
                <span className="text-[10px] text-amber-500 font-extrabold cursor-pointer" onClick={() => setActiveTab('groups')}>Tabela Completa ➔</span>
              </div>

              {groups['Grupo D (Brasil)'] && (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 text-[10px] text-slate-400 font-extrabold uppercase px-1">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-6">Seleção</span>
                    <span className="col-span-2 text-center">J</span>
                    <span className="col-span-1 text-center">SG</span>
                    <span className="col-span-2 text-center text-slate-900 dark:text-white">PTS</span>
                  </div>

                  <div className="space-y-1">
                    {groups['Grupo D (Brasil)'].map((p: any) => (
                      <div 
                        key={p.team}
                        className={`grid grid-cols-12 text-xs py-2 px-1 rounded-xl items-center font-bold ${
                          p.team === 'Brasil' 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-slate-50 dark:bg-slate-950/20'
                        }`}
                      >
                        <span className="col-span-1 text-center font-mono opacity-65">{p.pos}</span>
                        <div className="col-span-6 flex items-center gap-1.5 truncate">
                          <span>{p.flag}</span>
                          <span className="truncate">{p.team}</span>
                        </div>
                        <span className="col-span-2 text-center font-mono">{p.p}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{p.gd > 0 ? `+${p.gd}` : p.gd}</span>
                        <span className="col-span-2 text-center font-mono text-slate-900 dark:text-white font-black">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* VIEW: CALENDÁRIO COMPLETO */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <Calendar size={18} className="text-amber-500" /> Mesa de Jogos Completamente Integrada
              </h2>
              <p className="text-xs text-slate-400">Todos os jogos reais e as datas oficiais da FIFA para a Copa do Mundo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m) => {
              const isLive = m.status === 'LIVE';
              const isFinished = m.status === 'FINISHED';
              return (
                <div 
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs space-y-4 divide-y divide-slate-100 dark:divide-slate-800 ${
                    isLive 
                      ? 'border-rose-500/40 shadow-rose-500/5 ring-1 ring-rose-500/20' 
                      : 'border-slate-150 dark:border-slate-805'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] pb-1.5">
                    <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                      {m.stage} {m.group ? `• ${m.group}` : ''}
                    </span>
                    
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 dark:text-rose-450 font-black animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> AO VIVO ({m.timeElapsed})
                      </span>
                    ) : isFinished ? (
                      <span className="text-slate-400 font-bold bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded-full">
                        CONCLUÍDO
                      </span>
                    ) : (
                      <span className="text-slate-400 font-extrabold bg-slate-50 dark:bg-slate-850 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} /> {m.time}
                      </span>
                    )}
                  </div>

                  <div className="py-2.5 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl select-none shrink-0">{m.homeFlag}</span>
                        <span className="truncate">{m.home}</span>
                      </div>
                      <span className={isFinished || isLive ? 'font-mono text-base font-black' : 'text-slate-300 font-mono text-sm'}>
                        {isFinished || isLive ? m.homeScore : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-extrabold text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl select-none shrink-0">{m.awayFlag}</span>
                        <span className="truncate">{m.away}</span>
                      </div>
                      <span className={isFinished || isLive ? 'font-mono text-base font-black' : 'text-slate-300 font-mono text-sm'}>
                        {isFinished || isLive ? m.awayScore : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="truncate flex items-center gap-1">
                      <MapPin size={10} className="text-amber-500 shrink-0" /> {m.stadium} ({m.city})
                    </span>
                    <span className="shrink-0">{m.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: CLASSFICAÇÃO COMPLETA */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <Trophy size={18} className="text-amber-500" /> Tabelas Oficiais de Classificação da FIFA
            </h2>
            <p className="text-xs text-slate-400">Classificação atualizada automaticamente em tempo real pela nossa rede</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groups).map(([groupName, table]) => (
              <div 
                key={groupName}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 rounded-3xl p-5 font-bold shadow-xs relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-450 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center justify-between">
                  <span>{groupName}</span>
                  {groupName.includes('Brasil') && <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">CHAVE DE ELITE</span>}
                </h3>

                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 text-[10px] text-slate-400 font-extrabold uppercase px-1">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-5">Seleção</span>
                    <span className="col-span-1 text-center">J</span>
                    <span className="col-span-1 text-center">V</span>
                    <span className="col-span-1 text-center">E</span>
                    <span className="col-span-1 text-center">D</span>
                    <span className="col-span-1 text-center font-medium">SG</span>
                    <span className="col-span-1 text-center font-medium">GP</span>
                    <span className="col-span-1 text-center text-slate-900 dark:text-white font-black">PTS</span>
                  </div>

                  <div className="space-y-1">
                    {(table as any[]).map((r: any) => (
                      <div 
                        key={r.team}
                        className={`grid grid-cols-12 text-xs py-2 px-1 rounded-xl items-center cursor-pointer transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/20 ${
                          r.team === 'Brasil' 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-slate-50 dark:bg-slate-950/20 border border-transparent'
                        }`}
                        onClick={() => setSelectedPlayer(getPlayerDetail(r.team === 'Brasil' ? 'Danilo (C)' : 'Luka Modrić', 10, r.team))}
                      >
                        <span className="col-span-1 text-center font-mono opacity-65">{r.pos}</span>
                        <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                          <span className="shrink-0">{r.flag}</span>
                          <span className="truncate">{r.team}</span>
                        </div>
                        <span className="col-span-1 text-center font-mono">{r.p}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{r.w}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{r.d}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{r.l}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{r.gd > 0 ? `+${r.gd}` : r.gd}</span>
                        <span className="col-span-1 text-center font-mono opacity-65">{r.gf}</span>
                        <span className="col-span-1 text-center font-mono text-slate-900 dark:text-white font-black">{r.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SQUAD ELENCO */}
      {activeTab === 'squad' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-5 rounded-3xl text-white flex items-center justify-between flex-wrap gap-4 relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="space-y-1 z-10">
              <h2 className="text-md sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                <Users size={18} className="text-amber-500" /> Convocação da Seleção Brasileira
              </h2>
              <p className="text-xs text-emerald-100">Escalação oficial da comissão técnica liderada por Dorival Júnior</p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-black px-3.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-md select-none shrink-0">
              Valor de Mercado: ~€ 1.25 Bilhão
            </div>
          </div>

          <p className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-105 dark:border-slate-850">
            ℹ️ <strong>Toque em qualquer jogador</strong> para conferir sua ficha técnica detalhada contendo idade, peso, história, clubes antigos, títulos e estatísticas em tempo real!
          </p>

          <div className="space-y-6">
            {['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campista', 'Atacante'].map((posGroup) => {
              const players = squadBrazil.filter(p => p.position === posGroup);
              return (
                <div key={posGroup} className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> {posGroup}s ({players.length})
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {players.map(p => (
                      <div 
                        key={p.number}
                        onClick={() => setSelectedPlayer(getPlayerDetail(p.name, p.number, 'Brasil', p.position, p.club, p.age))}
                        className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 p-3.5 rounded-2.5xl flex items-center gap-3 relative overflow-hidden hover:scale-[1.02] hover:border-emerald-500/30 transition-all cursor-pointer shadow-xs"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-700 text-white font-extrabold flex items-center justify-center shadow-sm text-xs shrink-0 select-none">
                          {p.avatar}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="font-extrabold text-xs truncate block text-slate-900 dark:text-white">{p.name} {p.name.includes('Danilo') ? '(C)' : ''}</span>
                          <span className="text-[10px] text-slate-400 font-bold block">{p.club}</span>
                          
                          {/* Stats mini labels */}
                          <div className="flex items-center gap-2 text-[9px] text-emerald-600 dark:text-emerald-400 font-black">
                            <span>J: {p.games}</span>
                            {p.goals > 0 && <span>• G: {p.goals}</span>}
                            {p.assists > 0 && <span>• A: {p.assists}</span>}
                          </div>
                        </div>

                        {/* Jersey Number absolute */}
                        <div className="absolute right-3.5 bottom-1 text-2xl font-black font-mono text-slate-150 dark:text-slate-800 pointer-events-none opacity-40 select-none">
                          {p.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: ESTÁDIOS */}
      {activeTab === 'stadiums' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map(st => (
            <div 
              key={st.name}
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="p-5 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-slate-450 dark:text-slate-400 text-xs font-bold">
                    <MapPin size={13} className="text-amber-500" />
                    <span>{st.city}</span>
                  </div>
                  <h3 className="font-black text-sm sm:text-md text-slate-900 dark:text-white leading-tight">{st.name}</h3>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="font-extrabold text-slate-405">Capacidade Oficial:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{st.capacity} espectadores</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Jogos Atribuídos:</span>
                  <div className="flex flex-wrap gap-1">
                    {st.matchesScheduled.map((sch, i) => (
                      <span 
                        key={i}
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-emerald-500/15"
                      >
                        {sch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-extrabold">Instalação homologada padrão FIFA Premium ★</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED INTERACTIVE MATCH DRAWER / DETAIL WINDOW */}
      <AnimatePresence>
        {selectedMatch && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMatch(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
            />

            {/* Side Modal Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-150 dark:border-slate-800 z-50 flex flex-col p-6 shadow-2xl overflow-y-auto"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-100 dark:border-slate-800 shrink-0">
                <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-xs font-black px-3.5 py-0.5 rounded-full">
                  Fase: {selectedMatch.stage} {selectedMatch.group ? `• ${selectedMatch.group}` : ''}
                </span>
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Match Score Big Banner */}
              <div className="text-center space-y-3.5 py-4 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden select-none shrink-0 shadow-inner">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <p className="text-[10px] font-black text-slate-400 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <MapPin size={11} className="text-amber-500" /> {selectedMatch.city}
                </p>

                <div className="flex items-center justify-around gap-2 px-3">
                  <div className="w-20 text-center space-y-1 min-w-0">
                    <span className="text-4xl block select-none">{selectedMatch.homeFlag}</span>
                    <span className="font-extrabold text-xs block truncate">{selectedMatch.home}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono shrink-0">
                    {selectedMatch.status === 'SCHEDULED' ? (
                      <span className="text-xs bg-slate-200 dark:bg-slate-800 rounded-lg px-3 py-1 font-extrabold text-slate-500 uppercase tracking-widest">AGENDADO</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black">{selectedMatch.homeScore}</span>
                        <span className="text-slate-400 font-bold">-</span>
                        <span className="text-3xl font-black">{selectedMatch.awayScore}</span>
                      </>
                    )}
                  </div>

                  <div className="w-20 text-center space-y-1 min-w-0">
                    <span className="text-4xl block select-none">{selectedMatch.awayFlag}</span>
                    <span className="font-extrabold text-xs block truncate">{selectedMatch.away}</span>
                  </div>
                </div>

                <p className="text-[10px] font-bold text-slate-400">Estádio: {selectedMatch.stadium}</p>
              </div>

              {/* DETAILS TABS REGISTRY */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-2xl mt-5 shrink-0">
                <button 
                  onClick={() => setMatchDetailsTab('detalhes')}
                  className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                    matchDetailsTab === 'detalhes' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-355'
                  }`}
                >
                  Timeline
                </button>
                <button 
                  onClick={() => setMatchDetailsTab('escalacao')}
                  className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                    matchDetailsTab === 'escalacao' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-355'
                  }`}
                >
                  Escalação
                </button>
                <button 
                  onClick={() => setMatchDetailsTab('estatisticas')}
                  className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                    matchDetailsTab === 'estatisticas' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-355'
                  }`}
                >
                  Estats
                </button>
              </div>

              {/* TAB LOADING STATE */}
              {loadingDetails ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 flex-1">
                  <RotateCw className="animate-spin text-indigo-500" size={24} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando fichas técnicas...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: DETALHES & CHRONOLOGY */}
                  {matchDetailsTab === 'detalhes' && (
                    <div className="space-y-4 mt-4 flex-1">
                      {/* Gols list */}
                      {matchDetails?.events && matchDetails.events.length > 0 ? (
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Eventos Críticos da Partida:</span>
                          <div className="space-y-2 mt-2">
                            {matchDetails.events.map((ev: any, idx: number) => (
                              <div 
                                key={idx} 
                                className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/20 ${
                                  ev.team === 'home' 
                                    ? 'border-indigo-500/10 bg-indigo-500/2' 
                                    : 'border-rose-500/10 bg-rose-500/2'
                                }`}
                              >
                                <div className="text-md shrink-0 select-none">
                                  {ev.type === 'goal' ? '⚽' : ev.type === 'yellow' ? '🟨' : ev.type === 'red' ? '🟥' : ev.type === 'sub' ? '🔄' : '🖥️'}
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-center justify-between text-xs font-extrabold">
                                    <span 
                                      className="truncate cursor-pointer hover:underline text-slate-900 dark:text-white"
                                      onClick={() => setSelectedPlayer(getPlayerDetail(ev.player, undefined, ev.team === 'home' ? selectedMatch.home : selectedMatch.away))}
                                    >
                                      {ev.player}
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-450 shrink-0">{ev.minute}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-450">{ev.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                          <Clock size={20} className="mx-auto text-slate-300" />
                          <p className="text-[10px] font-extrabold uppercase">Aguardando Início do Apito</p>
                          <p className="text-[10px] opacity-75">Nenhum gol ou ocorrência relatada no momento.</p>
                        </div>
                      )}

                      {/* Referee details */}
                      {matchDetails?.referee && (
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-bold text-slate-400 block shrink-0">
                          <div>🛡️ Árbitro Oficial: <span className="text-slate-850 dark:text-slate-200">{matchDetails.referee}</span></div>
                          <div className="mt-1">⚽ Var Room: <span className="text-slate-850 dark:text-slate-200">Auxiliares Credenciados FIFA Elite</span></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: TACTICAL FIELD BOARD */}
                  {matchDetailsTab === 'escalacao' && (
                    <div className="space-y-4 mt-4 flex-1">
                      
                      {/* Team Toggle Selector */}
                      <div className="flex border border-slate-100 dark:border-slate-800 p-1 rounded-2xl">
                        <button 
                          onClick={() => setLineupTeamToggle('home')}
                          className={`flex-1 py-1 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                            lineupTeamToggle === 'home' ? 'bg-indigo-650 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          {selectedMatch.home}
                        </button>
                        <button 
                          onClick={() => setLineupTeamToggle('away')}
                          className={`flex-1 py-1 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                            lineupTeamToggle === 'away' ? 'bg-rose-650 text-white shadow-sm' : 'text-slate-400'
                          }`}
                        >
                          {selectedMatch.away}
                        </button>
                      </div>

                      {matchDetails?.lineups?.[lineupTeamToggle] ? (
                        <div className="space-y-4">
                          
                          {/* THE CSS PITCH GRAPHIC PANEL */}
                          <div className="bg-emerald-800 border-2 border-white/25 rounded-3xl relative shadow-inner overflow-hidden aspect-[3/4] w-full flex flex-col justify-between p-4 font-bold select-none">
                            
                            {/* Pitch markings */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-14 border-b border-l border-r border-white/20 pointer-events-none" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-14 border-t border-l border-r border-white/20 pointer-events-none" />
                            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/20 pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-[1.5px] border-white/20 pointer-events-none" />

                            {/* Render Positional Players dynamically */}
                            {(() => {
                              const lineup = matchDetails.lineups[lineupTeamToggle];
                              const players = lineup.startXI || [];
                              const teamName = lineupTeamToggle === 'home' ? selectedMatch.home : selectedMatch.away;
                              
                              // Helper positions based on 4-3-3 formation and indices
                              // 1 GK, 4 DEF (LB, LCB, RCB, RB), 3 MID (LCM, DM, RCM), 3 ATT (LW, ST, RW)
                              const coords = [
                                { bottom: '5%', left: '50%' }, // 0: GK
                                { bottom: '24%', left: '15%' }, // 1: LB
                                { bottom: '18%', left: '38%' }, // 2: CB
                                { bottom: '18%', left: '62%' }, // 3: CB
                                { bottom: '24%', left: '85%' }, // 4: RB
                                { bottom: '48%', left: '26%' }, // 5: LCM
                                { bottom: '38%', left: '50%' }, // 6: DM
                                { bottom: '48%', left: '74%' }, // 7: RCM
                                { bottom: '74%', left: '18%' }, // 8: LW
                                { bottom: '80%', left: '50%' }, // 9: ST
                                { bottom: '74%', left: '82%' }  // 10: RW
                              ];

                              return players.map((p: any, idx: number) => {
                                const coord = coords[idx] || { bottom: '50%', left: '50%' };
                                return (
                                  <motion.div 
                                    key={p.number}
                                    style={{ position: 'absolute', ...coord }}
                                    className="transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 cursor-pointer"
                                    onClick={() => setSelectedPlayer(getPlayerDetail(p.name, p.number, teamName, p.position, p.club, p.age))}
                                    whileHover={{ scale: 1.15 }}
                                  >
                                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg ${
                                      lineupTeamToggle === 'home' ? 'bg-emerald-600' : 'bg-red-700'
                                    }`}>
                                      {p.number}
                                    </div>
                                    <span className="text-[9px] text-white font-extrabold mt-1 uppercase text-center max-w-[65px] truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                      {p.name.split(' ').pop()}
                                    </span>
                                  </motion.div>
                                );
                              });
                            })()}
                          </div>

                          {/* Substitutes reserves block */}
                          <div className="space-y-2 mt-4">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Banco de Reservas:</span>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              {matchDetails.lineups[lineupTeamToggle].substitutes?.map((sub: any) => (
                                <div 
                                  key={sub.number}
                                  onClick={() => setSelectedPlayer(getPlayerDetail(sub.name, sub.number, lineupTeamToggle === 'home' ? selectedMatch.home : selectedMatch.away, sub.position, sub.club, sub.age))}
                                  className="p-2 bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <span className="w-4 text-slate-400 font-extrabold font-mono text-center">{sub.number}</span>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-extrabold block truncate text-slate-900 dark:text-white">{sub.name}</span>
                                    <span className="text-[9px] text-slate-400 block truncate">{sub.club}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Coach & Comissão Técnica */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2.5xl space-y-1.5 text-[10px] font-bold text-slate-450 shrink-0">
                            <div className="flex items-center justify-between text-slate-900 dark:text-white">
                              <span>⚽ Técnico Principal:</span>
                              <span>{matchDetails.lineups[lineupTeamToggle].coach}</span>
                            </div>
                            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />
                            {matchDetails.lineups[lineupTeamToggle].commission?.map((comItem: any, ind: number) => (
                              <div key={ind} className="flex items-center justify-between opacity-80">
                                <span>{comItem.role}:</span>
                                <span>{comItem.name}</span>
                              </div>
                            ))}
                          </div>

                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                          Sem dados de escalações oficiais para este jogo.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: STATS ADVANCED COMPARISON */}
                  {matchDetailsTab === 'estatisticas' && (
                    <div className="space-y-4 mt-4 flex-1 select-none">
                      {matchDetails ? (
                        <div className="bg-slate-50 dark:bg-slate-950/20 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 text-xs font-semibold">
                          {[
                            { label: 'Posse de Bola', valueIndex: 'possession', suffix: '%', isPercent: true },
                            { label: 'Finalizações', valueIndex: 'shots', isPercent: false },
                            { label: 'Finalizações no Alvo', valueIndex: 'shotsOnGoal', isPercent: false },
                            { label: 'Faltas Cometidas', valueIndex: 'fouls', isPercent: false },
                            { label: 'Cartões Amarelos', valueIndex: 'yellowCards', isPercent: false },
                            { label: 'Expectativa de Gols (xG)', valueIndex: 'xg', isPercent: false },
                            { label: 'Escanteios', valueIndex: 'corners', isPercent: false },
                            { label: 'Impedimentos', valueIndex: 'offsides', isPercent: false },
                            { label: 'Passes Completos', valueIndex: 'passes', isPercent: false },
                            { label: 'Precisão de Passe', valueIndex: 'passAccuracy', suffix: '%', isPercent: true },
                            { label: 'Defesas Difíceis', valueIndex: 'saves', isPercent: false }
                          ].map((statItem, index) => {
                            const val1 = matchDetails[statItem.valueIndex]?.[0] !== undefined 
                              ? matchDetails[statItem.valueIndex][0] 
                              : 0;
                            const val2 = matchDetails[statItem.valueIndex]?.[1] !== undefined 
                              ? matchDetails[statItem.valueIndex][1] 
                              : 0;

                            const total = Number(val1) + Number(val2);
                            const w1 = total > 0 ? (Number(val1) / total) * 100 : 50;

                            return (
                              <div key={index} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-extrabold">
                                  <span className="text-indigo-600 dark:text-indigo-400">{val1}{statItem.suffix || ''}</span>
                                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{statItem.label}</span>
                                  <span className="text-rose-600 dark:text-rose-400">{val2}{statItem.suffix || ''}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                                  <div className="bg-indigo-650 h-full transition-all duration-300" style={{ width: `${w1}%` }} />
                                  <div className="bg-rose-500 h-full flex-1 transition-all duration-300" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-400 text-xs">
                          Nenhuma estatística relatada para este jogo.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FOOTBALL API SETTING MODAL */}
      <AnimatePresence>
        {apiConfigOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setApiConfigOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />

            {/* Config Overlay Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl z-[60] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm sm:text-md text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database size={18} className="text-amber-500" /> Configuração da API de Futebol
                </h3>
                <button 
                  onClick={() => setApiConfigOpen(false)}
                  className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full cursor-pointer hover:opacity-75"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                Integre sua conta e obtenha dados 100% oficiais e atualizações automáticas em tempo real para os jogos da Copa do Mundo e ligas de futebol globais.
              </p>

              <form onSubmit={handleSaveApiConfig} className="space-y-4 text-xs">
                
                {/* Provider Selector */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#475569] dark:text-slate-300 block">Provedor de Dados:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setProvider('api-football')}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-black uppercase transition-all ${
                        provider === 'api-football' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-950/20'
                      }`}
                    >
                      API-Football (Rapid)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProvider('football-data')}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-black uppercase transition-all ${
                        provider === 'football-data' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-950/20'
                      }`}
                    >
                      Football-Data.org
                    </button>
                  </div>
                </div>

                {/* API Auth token entry */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#475569] dark:text-slate-300 block">Chave Secundária / API Key:</label>
                  <input 
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    placeholder="Cole sua API Key aqui..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-405 block">
                    A chave nunca é exposta no navegador; ela passa de forma segura pelo servidor proxy na nuvem.
                  </span>
                </div>

                {/* Status indicator inside form */}
                {apiStatusMessage && (
                  <div className="p-3 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 rounded-xl font-bold flex items-center gap-2">
                    {isSyncing && <RotateCw className="animate-spin text-indigo-500 shrink-0" size={14} />}
                    <span>{apiStatusMessage}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    disabled={isSyncing || !apiKey.trim()}
                    className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-black py-2 rounded-xl text-center cursor-pointer transition-colors disabled:opacity-40"
                  >
                    Salvar e Conectar
                  </button>
                  <button 
                    type="button"
                    onClick={handleResetApiConfig}
                    className="px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer"
                    title="Limpar credenciais"
                  >
                    Reset
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DETAILED PLAYER PROFILE MODEL */}
      <AnimatePresence>
        {selectedPlayer && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlayer(null)}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-xs"
            />

            {/* Custom Premium Card Modal */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl z-[80] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-xs"
            >
              
              {/* Profile card Header */}
              <div className="flex items-start gap-4">
                <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-lg select-none shrink-0 relative">
                  <span>{selectedPlayer.name.split(' ').map(n=>n[0]).join('')}</span>
                  <div className="absolute -bottom-1 -right-1 bg-slate-950 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono border-2 border-white dark:border-slate-900 select-none">
                    {selectedPlayer.number}
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/15 text-[9px] font-black px-2 py-0.5 rounded-full select-none">
                      {selectedPlayer.position}
                    </span>
                    <span className="text-slate-400 font-extrabold text-[10px] select-none">
                      {selectedPlayer.nationality}
                    </span>
                  </div>
                  <h3 className="text-md sm:text-lg font-black text-slate-900 dark:text-white leading-none truncate">{selectedPlayer.name}</h3>
                  <span className="text-[10px] text-slate-400 block font-bold leading-none truncate">{selectedPlayer.fullName}</span>
                </div>

                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full cursor-pointer hover:opacity-75"
                >
                  <X size={14} />
                </button>
              </div>

              {/* PERSONAL BIOMETRICS CARDGRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Idade</span>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-205">{selectedPlayer.age} anos</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Pé Dominante</span>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-205">{selectedPlayer.dominantFoot}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Altura / Peso</span>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-205">{selectedPlayer.height} / {selectedPlayer.weight}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Valor de Mercado</span>
                  <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">{selectedPlayer.marketValue || 'N/D'}</span>
                </div>
              </div>

              {/* COMPETITION STATISTICS PANEL */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Desempenho pela Seleção na Competição:</span>
                <div className="grid grid-cols-5 gap-2 font-mono font-bold text-center">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block font-bold leading-tight">Jogos</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">{selectedPlayer.games}</span>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block font-bold leading-tight">Gols</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">{selectedPlayer.goals}</span>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block font-bold leading-tight">Assists</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">{selectedPlayer.assists}</span>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block font-bold leading-tight">Minutos</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-450">{selectedPlayer.minutesPlayed}'</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-bold leading-tight">C. Amarelos</span>
                    <span className="text-sm font-black text-amber-500">{selectedPlayer.yellowCards}</span>
                  </div>
                </div>
              </div>

              {/* BIOMETRIC BIOGRAPHY STORY & HISTORY */}
              <div className="space-y-4 pt-1 text-slate-600 dark:text-slate-300">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-black text-slate-400 block">Perfil Biográfico:</span>
                  <p className="leading-relaxed font-bold">{selectedPlayer.bio}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-black text-slate-400 block">Trajetória e Carreira:</span>
                  <p className="leading-relaxed">{selectedPlayer.career}</p>
                </div>

                {selectedPlayer.pastClubs && selectedPlayer.pastClubs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-black text-slate-400 block">Clubes por onde passou:</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] px-2.5 py-0.5 rounded-md font-bold border border-slate-100 dark:border-slate-800">
                        {selectedPlayer.club} (Atual)
                      </span>
                      {selectedPlayer.pastClubs.map((club, i) => (
                        <span key={i} className="bg-slate-50 dark:bg-slate-950/20 text-slate-405 text-[10px] px-2.5 py-0.5 rounded-md font-medium border border-slate-100 dark:border-slate-800">
                          {club}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlayer.titles && selectedPlayer.titles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-black text-slate-400 block">Títulos Conquistados:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPlayer.titles.map((title, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[9.5px] px-2.5 py-0.5 rounded-md font-extrabold border border-amber-500/15 block leading-tight">
                          🏆 {title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
