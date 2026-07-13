export interface Player {
  number: number;
  name: string;
  position: 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campista' | 'Atacante';
  age: number;
  club: string;
  games: number;
  goals: number;
  assists: number;
  avatar: string;
}

export interface MatchGoal {
  player: string;
  minute: string;
  team: 'home' | 'away';
}

export interface Match {
  id: string;
  group?: string;
  stage: 'Grupos' | 'Oitavas' | 'Quartas' | 'Semifinais' | 'Final' | '3º Lugar';
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  stadium: string;
  city: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  timeElapsed?: string;
  goals?: MatchGoal[];
  possession?: [number, number]; // [home, away]
  shots?: [number, number];
  fouls?: [number, number];
  yellowCards?: [number, number];
  redCards?: [number, number];
  lineups?: {
    home: string[];
    away: string[];
  };
}

export interface Stadium {
  name: string;
  city: string;
  capacity: string;
  matchesScheduled: string[];
}

export interface GroupTeam {
  pos: number;
  team: string;
  flag: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export const BRASIL_SQUAD: Player[] = [
  // Goleiros
  { number: 1, name: 'Alisson Becker', position: 'Goleiro', age: 33, club: 'Liverpool (ING)', games: 2, goals: 0, assists: 0, avatar: 'AB' },
  { number: 12, name: 'Bento', position: 'Goleiro', age: 27, club: 'Al-Nassr (ARA)', games: 0, goals: 0, assists: 0, avatar: 'BE' },
  { number: 23, name: 'Ederson M.', position: 'Goleiro', age: 32, club: 'Manchester City (ING)', games: 0, goals: 0, assists: 0, avatar: 'ED' },
  
  // Defensores
  { number: 3, name: 'Éder Militão', position: 'Zagueiro', age: 28, club: 'Real Madrid (ESP)', games: 2, goals: 0, assists: 0, avatar: 'EM' },
  { number: 4, name: 'Marquinhos', position: 'Zagueiro', age: 32, club: 'PSG (FRA)', games: 2, goals: 0, assists: 0, avatar: 'MQ' },
  { number: 14, name: 'Gabriel Magalhães', position: 'Zagueiro', age: 28, club: 'Arsenal (ING)', games: 2, goals: 0, assists: 0, avatar: 'GM' },
  { number: 25, name: 'Murillo', position: 'Zagueiro', age: 23, club: 'Nottingham Forest (ING)', games: 0, goals: 0, assists: 0, avatar: 'ML' },
  { number: 2, name: 'Danilo (C)', position: 'Lateral', age: 34, club: 'Juventus (ITA)', games: 2, goals: 0, assists: 0, avatar: 'DN' },
  { number: 13, name: 'Yan Couto', position: 'Lateral', age: 24, club: 'Borussia Dortmund (ALE)', games: 1, goals: 0, assists: 0, avatar: 'YC' },
  { number: 6, name: 'Guilherme Arana', position: 'Lateral', age: 29, club: 'Atlético Mineiro (BRA)', games: 2, goals: 0, assists: 1, avatar: 'GA' },
  { number: 16, name: 'Abner Vinícius', position: 'Lateral', age: 26, club: 'Lyon (FRA)', games: 0, goals: 0, assists: 0, avatar: 'AV' },

  // Meias
  { number: 5, name: 'Bruno Guimarães', position: 'Meio-campista', age: 28, club: 'Newcastle (ING)', games: 2, goals: 0, assists: 1, avatar: 'BG' },
  { number: 8, name: 'Lucas Paquetá', position: 'Meio-campista', age: 28, club: 'West Ham (ING)', games: 2, goals: 1, assists: 0, avatar: 'LP' },
  { number: 15, name: 'João Gomes', position: 'Meio-campista', age: 25, club: 'Wolverhampton (ING)', games: 2, goals: 0, assists: 0, avatar: 'JG' },
  { number: 18, name: 'Andreas Pereira', position: 'Meio-campista', age: 30, club: 'Fulham (ING)', games: 1, goals: 0, assists: 0, avatar: 'AP' },
  { number: 20, name: 'Gerson', position: 'Meio-campista', age: 29, club: 'Flamengo (BRA)', games: 1, goals: 0, assists: 0, avatar: 'GE' },
  { number: 22, name: 'André', position: 'Meio-campista', age: 24, club: 'Wolverhampton (ING)', games: 0, goals: 0, assists: 0, avatar: 'AN' },

  // Atacantes
  { number: 7, name: 'Vinicius Júnior', position: 'Atacante', age: 25, club: 'Real Madrid (ESP)', games: 2, goals: 2, assists: 1, avatar: 'VJ' },
  { number: 10, name: 'Rodrygo Goes', position: 'Atacante', age: 25, club: 'Real Madrid (ESP)', games: 2, goals: 1, assists: 2, avatar: 'RD' },
  { number: 11, name: 'Raphinha', position: 'Atacante', age: 29, club: 'Barcelona (ESP)', games: 2, goals: 1, assists: 0, avatar: 'RF' },
  { number: 9, name: 'Endrick', position: 'Atacante', age: 19, club: 'Real Madrid (ESP)', games: 2, goals: 1, assists: 0, avatar: 'ED' },
  { number: 17, name: 'Savinho', position: 'Atacante', age: 22, club: 'Manchester City (ING)', games: 1, goals: 0, assists: 1, avatar: 'SV' },
  { number: 19, name: 'Luiz Henrique', position: 'Atacante', age: 25, club: 'Botafogo (BRA)', games: 1, goals: 0, assists: 0, avatar: 'LH' },
  { number: 21, name: 'Estêvão', position: 'Atacante', age: 19, club: 'Palmeiras (BRA)', games: 1, goals: 0, assists: 0, avatar: 'ET' }
];

export const WORLD_CUP_STADIUMS: Stadium[] = [
  { name: 'MetLife Stadium', city: 'Nova York / Nova Jersey', capacity: '82.500', matchesScheduled: ['Fase de Grupos', 'Oitavas de Final', 'Semifinal', 'Finalíssima (19/07/2026)'] },
  { name: 'SoFi Stadium', city: 'Los Angeles', capacity: '70.240', matchesScheduled: ['Fase de Grupos (Jogo de Abertura dos EUA)', 'Oitavas de Final', 'Quartas de Final'] },
  { name: 'Estádio Azteca', city: 'Cidade do México', capacity: '87.520', matchesScheduled: ['Jogo de Abertura Oficial (11/06/2026)', 'Oitavas de Final'] },
  { name: 'AT&T Stadium', city: 'Dallas', capacity: '80.000', matchesScheduled: ['Fase de Grupos', 'Oitavas de Final', 'Quartas de Final', 'Semifinal'] },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', capacity: '71.000', matchesScheduled: ['Fase de Grupos', 'Oitavas de Final', 'Semifinal'] },
  { name: 'BC Place', city: 'Vancouver', capacity: '54.500', matchesScheduled: ['Fase de Grupos (Jogo de Abertura do Canadá)', 'Oitavas de Final'] }
];

export const DEFAULT_GROUPS: Record<string, GroupTeam[]> = {
  'Grupo A': [
    { pos: 1, team: 'Estados Unidos', flag: '🇺🇸', p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 2, gd: 2, pts: 4 },
    { pos: 2, team: 'Áustria', flag: '🇦🇹', p: 2, w: 1, d: 0, l: 1, gf: 3, ga: 3, gd: 0, pts: 3 },
    { pos: 3, team: 'Equador', flag: '🇪🇨', p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, gd: 0, pts: 3 },
    { pos: 4, team: 'Camarões', flag: '🇨🇲', p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 3, gd: -2, pts: 1 }
  ],
  'Grupo B': [
    { pos: 1, team: 'Argentina', flag: '🇦🇷', p: 2, w: 2, d: 0, l: 0, gf: 5, ga: 1, gd: 4, pts: 6 },
    { pos: 2, team: 'Uruguai', flag: '🇺🇾', p: 2, w: 1, d: 1, l: 0, gf: 3, ga: 1, gd: 2, pts: 4 },
    { pos: 3, team: 'Suécia', flag: '🇸🇪', p: 2, w: 0, d: 1, l: 1, gf: 2, ga: 4, gd: -2, pts: 1 },
    { pos: 4, team: 'Egito', flag: '🇪🇬', p: 2, w: 0, d: 0, l: 2, gf: 0, ga: 4, gd: -4, pts: 0 }
  ],
  'Grupo C': [
    { pos: 1, team: 'França', flag: '🇫🇷', p: 2, w: 2, d: 0, l: 0, gf: 6, ga: 0, gd: 6, pts: 6 },
    { pos: 2, team: 'Japão', flag: '🇯🇵', p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 3, gd: -1, pts: 3 },
    { pos: 3, team: 'Marrocos', flag: '🇲🇦', p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 3, gd: -2, pts: 1 },
    { pos: 4, team: 'Polônia', flag: '🇵🇱', p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 4, gd: -3, pts: 1 }
  ],
  'Grupo D (Brasil)': [
    { pos: 1, team: 'Brasil', flag: '🇧🇷', p: 2, w: 2, d: 0, l: 0, gf: 5, ga: 1, gd: 4, pts: 6 },
    { pos: 2, team: 'Colômbia', flag: '🇨🇴', p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 2, gd: 2, pts: 4 },
    { pos: 3, team: 'Croácia', flag: '🇭🇷', p: 2, w: 0, d: 1, l: 1, gf: 2, ga: 4, gd: -2, pts: 1 },
    { pos: 4, team: 'Angola', flag: '🇦🇴', p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 5, gd: -4, pts: 0 }
  ]
};

export const DEFAULT_MATCHES: Match[] = [
  // Live matches (simulation)
  {
    id: 'm-live-1',
    stage: 'Grupos',
    group: 'Grupo B',
    home: 'Alemanha',
    homeFlag: '🇩🇪',
    away: 'Uruguai',
    awayFlag: '🇺🇾',
    homeScore: 2,
    awayScore: 1,
    date: '2026-06-19',
    time: '18:15',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    status: 'LIVE',
    timeElapsed: "74'",
    goals: [
      { player: 'Florian Wirtz', minute: "22'", team: 'home' },
      { player: 'Darwin Núñez', minute: "41'", team: 'away' },
      { player: 'Kai Havertz', minute: "59'", team: 'home' }
    ],
    possession: [56, 44],
    shots: [15, 8],
    fouls: [11, 14],
    yellowCards: [1, 3],
    redCards: [0, 0],
    lineups: {
      home: ['Ter Stegen', 'Kimmich', 'Tah', 'Rüdiger', 'Mittelstädt', 'Andrich', 'Kroos', 'Musiala', 'Gündogan', 'Wirtz', 'Havertz'],
      away: ['Rochet', 'Nández', 'Araújo', 'Giménez', 'Olivera', 'Valverde', 'Ugarte', 'De la Cruz', 'Pellistri', 'Núñez', 'Araújo']
    }
  },
  // Upcoming matches today
  {
    id: 'm-today-1',
    stage: 'Grupos',
    group: 'Grupo C',
    home: 'França',
    homeFlag: '🇫🇷',
    away: 'Japão',
    awayFlag: '🇯🇵',
    date: '2026-06-19',
    time: '21:00',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    status: 'SCHEDULED'
  },
  // Saved Brazil matches
  {
    id: 'm-bra-1',
    stage: 'Grupos',
    group: 'Grupo D (Brasil)',
    home: 'Brasil',
    homeFlag: '🇧🇷',
    away: 'Angola',
    awayFlag: '🇦🇴',
    homeScore: 3,
    awayScore: 1,
    date: '2026-06-14',
    time: '18:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    status: 'FINISHED',
    goals: [
      { player: 'Vinicius Júnior', minute: "12'", team: 'home' },
      { player: 'Rodrygo Goes', minute: "44'", team: 'home' },
      { player: 'Dala', minute: "55'", team: 'away' },
      { player: 'Endrick', minute: "88'", team: 'home' }
    ],
    possession: [65, 35],
    shots: [21, 5],
    fouls: [9, 15],
    yellowCards: [1, 4],
    redCards: [0, 0],
    lineups: {
      home: ['Alisson', 'Danilo', 'Militão', 'Marquinhos', 'Arana', 'Bruno Guimarães', 'João Gomes', 'Paquetá', 'Raphinha', 'Rodrygo', 'Vinicius Jr'],
      away: ['Neblú', 'Afuse', 'Gaspar', 'Bastos', 'To Carneiro', 'Show', 'Fredy', 'Estrela', 'Gelson', 'Dala', 'Mabululu']
    }
  },
  {
    id: 'm-bra-2',
    stage: 'Grupos',
    group: 'Grupo D (Brasil)',
    home: 'Colômbia',
    homeFlag: '🇨🇴',
    away: 'Brasil',
    awayFlag: '🇧🇷',
    homeScore: 0,
    awayScore: 2,
    date: '2026-06-18',
    time: '20:30',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    status: 'FINISHED',
    goals: [
      { player: 'Vinicius Júnior', minute: "34'", team: 'away' },
      { player: 'Raphinha', minute: "71'", team: 'away' }
    ],
    possession: [48, 52],
    shots: [11, 14],
    fouls: [16, 12],
    yellowCards: [3, 2],
    redCards: [0, 0],
    lineups: {
      home: ['Vargas', 'Muñoz', 'Cuesta', 'Lucumí', 'Mojica', 'Lerma', 'Ríos', 'Arias', 'James Rodríguez', 'Luis Díaz', 'Borré'],
      away: ['Alisson', 'Danilo', 'Militão', 'Marquinhos', 'Arana', 'Bruno Guimarães', 'João Gomes', 'Paquetá', 'Raphinha', 'Rodrygo', 'Vinicius Jr']
    }
  },
  {
    id: 'm-bra-3',
    stage: 'Grupos',
    group: 'Grupo D (Brasil)',
    home: 'Brasil',
    homeFlag: '🇧🇷',
    away: 'Croácia',
    awayFlag: '🇭🇷',
    date: '2026-06-23',
    time: '16:00',
    stadium: 'MetLife Stadium',
    city: 'Nova York / Nova Jersey',
    status: 'SCHEDULED'
  },
  // Upcoming matches tomorrow
  {
    id: 'm-tom-1',
    stage: 'Grupos',
    group: 'Grupo A',
    home: 'Estados Unidos',
    homeFlag: '🇺🇸',
    away: 'Equador',
    awayFlag: '🇪🇨',
    date: '2026-06-20',
    time: '17:00',
    stadium: 'BC Place',
    city: 'Vancouver',
    status: 'SCHEDULED'
  }
];
