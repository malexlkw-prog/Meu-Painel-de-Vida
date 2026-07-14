import { PainelData } from '../types';

export const EMPTY_DATA: PainelData = {
  shoppingList: [],
  tasks: [],
  schedule: [],
  studies: [],
  schoolSubjects: [],
  media: [],
  music: {
    tracks: [],
    artists: [],
    currentVibe: '',
    vibePhase: ''
  },
  bible: {
    currentBook: 'Gênesis',
    plan: 'sequential',
    bookProgress: {},
    reflections: [],
    history: []
  },
  reminders: [],
  finance: [],
  calendarMarkedDays: [],
  notes: [],
  creativityProjects: [],
  gym: {
    workouts: [],
    goals: [],
    measurements: [],
    photos: [],
    calendar: {},
    hoursTrainedTotal: 0
  },
  church: {
    events: [],
    commitments: [],
    goals: [],
    studies: [],
    sermons: [],
    prayers: [],
    ministries: [],
    ideas: [],
    bibleReadingStreak: 0,
    cultsAttendedCount: 0
  },
  youtube: {
    saved: [],
    history: [],
    subscriptions: []
  },
  queroComprar: {
    items: [],
    people: []
  },
  catalogs: {
    songs: [],
    songCategories: [],
    repertoires: [],
    customCatalogs: [],
    customItems: []
  }
};

export const INITIAL_DATA: PainelData = {
  shoppingList: [
    {
      id: 'shop-1',
      name: 'Camisa do Real Madrid 24/25',
      estimatedPrice: 350.00,
      category: 'clothing',
      subCategory: 'soccer_shirts',
      bought: false,
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60',
      size: 'G'
    },
    {
      id: 'shop-2',
      name: 'Camisa Básica Preta Algodão',
      estimatedPrice: 89.90,
      category: 'clothing',
      subCategory: 'regular_shirts',
      bought: false,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=60',
      size: 'M'
    },
    {
      id: 'shop-3',
      name: 'Calça Cargo Sarja Preta',
      estimatedPrice: 179.90,
      category: 'clothing',
      subCategory: 'pants',
      bought: true,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=60',
      size: '42'
    },
    {
      id: 'shop-4',
      name: 'Impressora Epson EcoTank L3250',
      estimatedPrice: 1150.00,
      category: 'stationery',
      subCategory: 'printer',
      bought: false
    },
    {
      id: 'shop-5',
      name: 'Kit de Tintas Epson 544 (Preto+Color)',
      estimatedPrice: 220.00,
      category: 'stationery',
      subCategory: 'ink',
      bought: true
    },
    {
      id: 'shop-6',
      name: 'Papel Sulfite A4 Report 500fls',
      estimatedPrice: 28.50,
      category: 'stationery',
      subCategory: 'paper',
      bought: false
    }
  ],
  tasks: [
    {
      id: 'task-1',
      text: 'Finalizar fechamento de vendas diárias da papelaria',
      completed: false,
      type: 'today',
      createdAt: '2026-06-18'
    },
    {
      id: 'task-2',
      text: 'Revisar conteúdo de Álgebra Linear para prova',
      completed: false,
      type: 'today',
      createdAt: '2026-06-18'
    },
    {
      id: 'task-3',
      text: 'Preparar post de ofertas da semana para o Instagram da loja',
      completed: true,
      type: 'today',
      createdAt: '2026-06-18'
    },
    {
      id: 'task-4',
      text: 'Organizar estoque de tintas e papéis fotográficos',
      completed: false,
      type: 'pending',
      createdAt: '2026-06-17'
    },
    {
      id: 'task-5',
      text: 'Fazer o planejamento financeiro do próximo mês',
      completed: false,
      type: 'pending',
      createdAt: '2026-06-16'
    }
  ],
  schedule: [
    { id: 'sch-1', time: '07:00', activity: 'Acordar e leitura da Bíblia', completed: true },
    { id: 'sch-2', time: '08:00', activity: 'Estudar matérias acadêmicas (Foco total)', completed: true },
    { id: 'sch-3', time: '11:30', activity: 'Almoço e descanso rápido', completed: true },
    { id: 'sch-4', time: '13:00', activity: 'Revisar novos pedidos e produtos da papelaria', completed: false },
    { id: 'sch-5', time: '14:00', activity: 'Trabalho na loja / Papelaria (Atendimento e vendas)', completed: false },
    { id: 'sch-6', time: '19:00', activity: 'Treino acadêmico / Exercício físico', completed: false },
    { id: 'sch-7', time: '21:00', activity: 'Entretenimento (Filme, Série ou Anime do dia)', completed: false },
    { id: 'sch-8', time: '23:00', activity: 'Meditação e dormir', completed: false }
  ],
  studies: [
    {
      id: 'study-1',
      name: 'Matemática Aplicada',
      grade: '8.8',
      contentsStudied: 'Matrizes, determinantes, sistemas lineares e matriz inversa.',
      progress: 75,
      history: [
        { id: 'h-11', date: '2026-06-15', duration: '2h 00m', note: 'Estudei eliminação gaussiana e fiz 10 exercícios.' },
        { id: 'h-12', date: '2026-06-12', duration: '1h 30m', note: 'Introdução a Determinantes e Regra de Cramer.' }
      ],
      topicsCurrent: ['Sistemas Lineares e Regra de Cramer', 'Estudo de Matrizes Multidimensionais'],
      topicsAlreadyStudied: ['Operações Básicas com Matrizes', 'Determinantes de ordem 2 e 3'],
      topicsStudyLater: ['Matriz Inversa e Teorema de Laplace', 'Cálculo de Autovalores e Autovetores']
    },
    {
      id: 'study-2',
      name: 'Sistemas Distribuídos',
      grade: '9.2',
      contentsStudied: 'Arquiteturas de rede, RPC, Web Sockets e consistência de dados.',
      progress: 60,
      history: [
        { id: 'h-21', date: '2026-06-16', duration: '1h 45m', note: 'Implementei um mini-chat com sockets para fixar o assunto.' }
      ],
      topicsCurrent: ['WebSockets e Eventos de Tempo Real', 'RPC com gRPC e Protocol Buffers'],
      topicsAlreadyStudied: ['Arquiteturas de Sistemas Cliente-Servidor', 'Sistemas de Arquivos Distribuídos (DFS)'],
      topicsStudyLater: ['Consenso Distribuído (Algoritmo Raft)', 'Replicação e Tolerância a Falhas']
    },
    {
      id: 'study-3',
      name: 'Gestão de Pequenos Negócios',
      grade: '10.0',
      contentsStudied: 'Fluxo de caixa, precificação de produtos e marketing digital local.',
      progress: 90,
      history: [
        { id: 'h-31', date: '2026-06-14', duration: '3h 00m', note: 'Criei o planejamento de margem de lucro para os novos serviços de encadernação.' }
      ],
      topicsCurrent: ['Precificação de Produtos de Papelaria', 'Estratégias de Marketing Digital Local'],
      topicsAlreadyStudied: ['Análise de Ponto de Equilíbrio (Break-even)', 'Gestão de Estoque PEPS e UEPS'],
      topicsStudyLater: ['Planejamento Tributário para Microempresas', 'Análise de Viabilidade Econômica (VPL)']
    }
  ],
  media: [
    {
      id: 'med-1',
      title: 'Attack on Titan (Shingeki no Kyojin)',
      type: 'anime',
      status: 'watching',
      progress: 'T4: Parte 3 EP 2',
      rating: 5,
      notes: 'Animação fantástica e enredo complexo. Estou amando a última temporada.',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: 'med-2',
      title: 'Breaking Bad',
      type: 'series',
      status: 'completed',
      progress: 'Temporada 5 (Completo)',
      rating: 5,
      notes: 'Uma obra-prima absoluta da televisão. Desenvolvimento de personagens genial.',
      imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: 'med-3',
      title: 'Duna: Parte Dois',
      type: 'movie',
      status: 'completed',
      progress: 'Filme Completo',
      rating: 5,
      notes: 'Visualmente deslumbrante e trilha sonora épica de Hans Zimmer!',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: 'med-4',
      title: 'Kimetsu no Yaiba (Demon Slayer) - Arco do Treinamento',
      type: 'anime',
      status: 'backlog',
      progress: 'Não iniciado',
      rating: 4,
      notes: 'Assistir logo após terminar Shingeki.',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60'
    }
  ],
  music: {
    tracks: [
      { id: 'track-1', title: 'Starboy', artist: 'The Weeknd', notes: 'Música perfeita para foco e energia no começo do dia.', imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=60' },
      { id: 'track-2', title: 'Blinding Lights', artist: 'The Weeknd', notes: 'Vibe retro synthwave clássica.', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60' },
      { id: 'track-3', title: 'Sweater Weather', artist: 'The Neighbourhood', notes: 'Fase atual de tempo mais frio.', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=60' }
    ],
    artists: [
      { id: 'art-1', name: 'The Weeknd', genre: 'R&B / Synthpop', notes: 'Melhor artista para vibes noturnas e foco diário.', imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=60' },
      { id: 'art-2', name: 'Alok', genre: 'Electronic', notes: 'Música eletrônica animada para trabalhar na papelaria.', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=60' }
    ],
    currentVibe: 'Foco produtivo com toques de synthwave melódico e alternativo',
    vibePhase: 'Fase de expansão da papelaria e estudos intensos de inverno'
  },
  bible: {
    currentBook: 'Gênesis',
    plan: 'sequential',
    bookProgress: {
      'Gênesis': 35, // cap 35 of 50
      'Êxodo': 10,
      'Mateus': 28 // Completed Gênesis 35 and some Mateus
    },
    reflections: [
      {
        id: 'ref-1',
        date: '2026-06-18',
        passage: 'Gênesis 12:1-3',
        reflection: 'A chamada de Abraão nos mostra sobre dar passos de fé mesmo quando não conhecemos o destino completo. É inspirador para novos começos.'
      },
      {
        id: 'ref-2',
        date: '2026-06-15',
        passage: 'Gênesis 28:15',
        reflection: '\"Eis que estou contigo, e te guardarei por onde quer que fores...\" Uma linda promessa de constante providência e companhia divina.'
      }
    ],
    history: [
      { id: 'bh-1', date: '2026-06-18', book: 'Gênesis', chaptersRead: 'Cap. 33 a 35' },
      { id: 'bh-2', date: '2026-06-16', book: 'Gênesis', chaptersRead: 'Cap. 30 a 32' },
      { id: 'bh-3', date: '2026-06-13', book: 'Mateus', chaptersRead: 'Cap. 1 a 5' }
    ]
  },
  reminders: [
    { id: 'rem-1', text: 'Enviar comprovante de pagamento do fornecedor de papel', priority: 'high', completed: false, createdAt: '2026-06-18' },
    { id: 'rem-2', text: 'Comprar pilhas recarregáveis para o mouse do caixa', priority: 'medium', completed: false, createdAt: '2026-06-18' },
    { id: 'rem-3', text: 'Beber água regularmente (Meta: 3L por dia)', priority: 'low', completed: false, createdAt: '2026-06-18' }
  ],
  finance: [
    { id: 'fin-1', type: 'income', description: 'Venda de Papelaria (Envelopes + Impressões)', amount: 154.50, category: 'stationery', date: '2026-06-18' },
    { id: 'fin-2', type: 'income', description: 'Venda de Caderno Personalizado Tilibra', amount: 48.00, category: 'stationery', date: '2026-06-18' },
    { id: 'fin-3', type: 'income', description: 'Freelance Design de Logotipo', amount: 450.00, category: 'personal', date: '2026-06-17' },
    { id: 'fin-4', type: 'expense', description: 'Fornecedor de Bobina Térmica (Papelaria)', amount: 180.00, category: 'stationery', date: '2026-06-17' },
    { id: 'fin-5', type: 'expense', description: 'Lanche na padaria da esquina', amount: 25.50, category: 'personal', date: '2026-06-18' },
    { id: 'fin-6', type: 'income', description: 'Venda de Tintas para Caneta Hidrográfica', amount: 85.00, category: 'stationery', date: '2026-06-16' },
    { id: 'fin-7', type: 'expense', description: 'Conta de Energia (Loja / Papelaria)', amount: 320.00, category: 'work', date: '2026-06-15' },
    { id: 'fin-8', type: 'income', description: 'Venda de Impressora Antiga Usada', amount: 350.00, category: 'personal', date: '2026-06-15' }
  ],
  schoolSubjects: [
    { id: 'school-1', name: 'Português Instrumental', grade: '9.0', scheduleDay: 'Segunda-feira', scheduleTime: '08:00 - 09:40' },
    { id: 'school-2', name: 'História Geral', grade: '8.5', scheduleDay: 'Segunda-feira', scheduleTime: '10:00 - 11:40' },
    { id: 'school-3', name: 'Física Clássica', grade: '7.8', scheduleDay: 'Terça-feira', scheduleTime: '08:00 - 09:40' },
    { id: 'school-4', name: 'Geografia Humana', grade: '9.2', scheduleDay: 'Quarta-feira', scheduleTime: '08:00 - 09:40' },
    { id: 'school-5', name: 'Química Orgânica', grade: '8.0', scheduleDay: 'Quinta-feira', scheduleTime: '10:00 - 11:40' },
    { id: 'school-6', name: 'Algoritmos e Estruturas de Dados', grade: '9.5', scheduleDay: 'Sexta-feira', scheduleTime: '08:00 - 10:40' }
  ],
  calendarMarkedDays: [
    { date: '2026-06-18', color: '#8b5cf6', text: 'Planejamento Inicial da Loja & Aula de Português' },
    { date: '2026-06-25', color: '#ef4444', text: 'Prova de Foco / Entrega de Trabalho' }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Anotações da Papelaria',
      content: 'Verificar se o fornecedor de bobina térmica oferece desconto para pedidos acima de 20 unidades. Lembrar de emitir nota paulista para todos os clientes do balcão.',
      createdAt: '2026-06-18T10:00:00Z',
      color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-350 border-amber-200'
    },
    {
      id: 'note-2',
      title: 'Dicas de Álgebra Linear',
      content: 'Estudar bastante as propriedades de determinantes e produto vetorial. A regra de Cramer cai bastante na segunda parte da prova dividida.',
      createdAt: '2026-06-17T14:30:00Z',
      color: 'bg-violet-50 dark:bg-violet-950/20 text-violet-900 dark:text-violet-350 border-violet-200'
    }
  ],
  creativityProjects: [
    {
      id: 'proj-1',
      title: 'Canal de Papelaria Criativa',
      description: 'Criar vídeos curtos (Reels/TikTok) demonstrando a confecção de cadernos artesanais personalizados.',
      status: 'planning',
      createdAt: '2026-06-18',
      notes: 'Pesquisar músicas em alta que combinem com ritmo de corte rápido.',
      category: 'Vídeo'
    },
    {
      id: 'proj-2',
      title: 'Redesign do Logotipo da Loja',
      description: 'Refatorar a identidade visual para passar um ar moderno de escritório com traços minimalistas.',
      status: 'in_progress',
      createdAt: '2026-06-16',
      notes: 'Escolher paleta de cores neutras e elegantes (violeta escuro, grafite, gelo).',
      category: 'Design'
    }
  ],
  gym: {
    workouts: [
      {
        id: 'Segunda',
        dayName: 'Segunda-feira',
        workoutName: 'Treino A - Peito, Ombro e Tríceps',
        exercises: [
          {
            id: 'ex-1',
            name: 'Supino Reto com Barra',
            muscleGroup: 'Peito',
            sets: 4,
            reps: '10-12',
            weight: 60,
            restTime: '1m 30s',
            notes: 'Focar na cadência lenta na descida.',
            history: [
              { id: 'h-e1-1', date: '2026-06-01', weight: 50, sets: 4, reps: '12' },
              { id: 'h-e1-2', date: '2026-06-08', weight: 55, sets: 4, reps: '10' },
              { id: 'h-e1-3', date: '2026-06-15', weight: 60, sets: 4, reps: '12' }
            ]
          },
          {
            id: 'ex-2',
            name: 'Desenvolvimento Militar com Halteres',
            muscleGroup: 'Ombros',
            sets: 4,
            reps: '10',
            weight: 18,
            restTime: '1m',
            notes: 'Manter a postura ereta e abdômen contraído.',
            history: [
              { id: 'h-e2-1', date: '2026-06-01', weight: 14, sets: 4, reps: '12' },
              { id: 'h-e2-2', date: '2026-06-08', weight: 16, sets: 4, reps: '10' },
              { id: 'h-e2-3', date: '2026-06-15', weight: 18, sets: 4, reps: '10' }
            ]
          }
        ]
      },
      {
        id: 'Terca',
        dayName: 'Terça-feira',
        workoutName: 'Treino B - Costas, Tríceps Sura e Bíceps',
        exercises: [
          {
            id: 'ex-3',
            name: 'Puxada Alta (Pulldown)',
            muscleGroup: 'Costas',
            sets: 4,
            reps: '12',
            weight: 55,
            restTime: '1m',
            notes: 'Evitar inclinar demais o tronco para trás.',
            history: [
              { id: 'h-e3-1', date: '2026-06-02', weight: 45, sets: 4, reps: '12' },
              { id: 'h-e3-2', date: '2026-06-09', weight: 50, sets: 4, reps: '12' }
            ]
          },
          {
            id: 'ex-4',
            name: 'Rosca Direta com Barra W',
            muscleGroup: 'Braços',
            sets: 3,
            reps: '10',
            weight: 24,
            restTime: '1m',
            notes: 'Tensionar o bíceps no pico da contração.',
            history: [
              { id: 'h-e4-1', date: '2026-06-02', weight: 20, sets: 3, reps: '12' },
              { id: 'h-e4-2', date: '2026-06-09', weight: 24, sets: 3, reps: '10' }
            ]
          }
        ]
      },
      {
        id: 'Quarta',
        dayName: 'Quarta-feira',
        workoutName: 'Descanso Ativo',
        exercises: []
      },
      {
        id: 'Quinta',
        dayName: 'Quinta-feira',
        workoutName: 'Treino C - Quadríceps e Posteriores',
        exercises: [
          {
            id: 'ex-5',
            name: 'Agachamento Livre com Barra',
            muscleGroup: 'Pernas',
            sets: 4,
            reps: '8-10',
            weight: 70,
            restTime: '2m',
            notes: 'Descer até passar de 90 graus de joelho.',
            history: [
              { id: 'h-e5-1', date: '2026-06-04', weight: 60, sets: 4, reps: '10' },
              { id: 'h-e5-2', date: '2026-06-11', weight: 70, sets: 4, reps: '10' }
            ]
          }
        ]
      },
      {
        id: 'Sexta',
        dayName: 'Sexta-feira',
        workoutName: 'Treino D - Ombros Completos e Cardio',
        exercises: []
      },
      {
        id: 'Sabado',
        dayName: 'Sábado',
        workoutName: 'Treino E - Alongamento e Abdominais',
        exercises: []
      },
      {
        id: 'Domingo',
        dayName: 'Domingo',
        workoutName: 'Descanso Pleno',
        exercises: []
      }
    ],
    goals: [
      { id: 'g-1', title: 'Atingir peso corporal de 78kg com definição', completed: false, createdAt: '2026-06-10' },
      { id: 'g-2', title: 'Ganhar massa muscular no peitoral e ombros', completed: false, createdAt: '2026-06-15' },
      { id: 'g-3', title: 'Chegar nos 80kg no Supino Reto (1 rep max)', completed: false, createdAt: '2026-06-01' }
    ],
    measurements: [
      {
        id: 'm-1',
        date: '2026-05-01',
        weight: 72,
        height: 1.80,
        imc: 22.2,
        peito: 94,
        braçoEsquerdo: 32,
        braçoDireito: 32.2,
        cintura: 78,
        abdômen: 81,
        quadril: 94,
        coxaEsquerda: 52,
        coxaDireita: 52.5,
        panturrilhaEsquerda: 34,
        panturrilhaDireita: 34.2
      },
      {
        id: 'm-2',
        date: '2026-06-01',
        weight: 74,
        height: 1.80,
        imc: 22.8,
        peito: 96,
        braçoEsquerdo: 33,
        braçoDireito: 33.1,
        cintura: 79,
        abdômen: 82,
        quadril: 95,
        coxaEsquerda: 53.5,
        coxaDireita: 54,
        panturrilhaEsquerda: 35,
        panturrilhaDireita: 35
      }
    ],
    photos: [
      { id: 'p-1', date: '2026-05-01', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60', notes: 'Primeiro dia de fotos' },
      { id: 'p-2', date: '2026-06-01', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60', notes: 'Final do primeiro mês de foco' }
    ],
    calendar: {
      '2026-06-15': { date: '2026-06-15', trained: true, workoutPlanned: 'Treino A' },
      '2026-06-16': { date: '2026-06-16', trained: true, workoutPlanned: 'Treino B' },
      '2026-06-17': { date: '2026-06-17', trained: false, workoutPlanned: 'Descanso' },
      '2026-06-18': { date: '2026-06-18', trained: true, workoutPlanned: 'Treino C' }
    },
    hoursTrainedTotal: 24
  },
  church: {
    events: [
      {
        id: 'evt-1',
        title: 'Culto de Celebração de Domingo',
        date: '2026-06-21',
        time: '19:00',
        location: 'Templo Principal',
        ministry: 'Ministério de Louvor',
        description: 'Culto dominical geral de louvor e comunhão.',
        priority: 'high',
        status: 'confirmed'
      },
      {
        id: 'evt-2',
        title: 'Escola Bíblica Dominical',
        date: '2026-06-21',
        time: '09:00',
        location: 'Sala Temática 3',
        ministry: 'Educação Cristã',
        description: 'Curso teológico contínuo sobre as Cartas de João.',
        priority: 'medium',
        status: 'confirmed'
      },
      {
        id: 'evt-3',
        title: 'Ensaio Geral do Ministério de Música',
        date: '2026-06-20',
        time: '16:30',
        location: 'Auditório Anexo',
        ministry: 'Ministério de Louvor',
        description: 'Repasse das harmonias e novos cânticos do mês.',
        priority: 'medium',
        status: 'planning'
      }
    ],
    commitments: [
      { id: 'chc-1', text: 'Preparar notas do estudo hermenêutico de terça', completed: true, createdAt: '2026-06-18' },
      { id: 'chc-2', text: 'Passar as cifras das músicas do louvor no teclado', completed: false, createdAt: '2026-06-18' },
      { id: 'chc-3', text: 'Conferir os folhetos informativos para o evangelismo', completed: false, createdAt: '2026-06-18' }
    ],
    goals: [
      { id: 'chg-1', title: 'Orar todos os dias por no mínimo 20 minutos', targetCount: 30, currentCount: 18, completed: false, createdAt: '2026-06-18', unit: 'dias' },
      { id: 'chg-2', title: 'Ler a Bíblia diariamente (foco em leituras cronológicas)', targetCount: 30, currentCount: 22, completed: false, createdAt: '2026-06-18', unit: 'dias' },
      { id: 'chg-3', title: 'Participar de todos os cultos de Celebração do mês', targetCount: 4, currentCount: 3, completed: false, createdAt: '2026-06-18', unit: 'cultos' }
    ],
    studies: [
      {
        id: 'study-ch1',
        title: 'Introdução à Hermenêutica Reformada',
        date: '2026-06-16',
        verses: '2 Timóteo 2:15, 2 Pedro 1:20-21',
        notes: 'Análise do método gramático-histórico de exegese.',
        reflections: 'O texto bíblico possui um único sentido original determinado pelo autor inspirado.',
        lessons: 'Cuidado ao isolar versículos sem captar o contexto literário amplo.',
        category: 'Hermeneutica'
      }
    ],
    sermons: [
      {
        id: 'serm-1',
        title: 'O Deus que Tudo Governa',
        preacher: 'Pr. Marcos Santos',
        date: '2026-06-14',
        theme: 'Soberania e Consolação',
        verses: 'Isaías 46:9-10, Romanos 8:28',
        summary: 'Deus orquestra todos os eventos para a Sua Glória e o nosso benefício eterno.',
        lessons: 'Descansar plenamente na soberania de Deus diante de provações temporárias.',
        application: 'Interromper reclamações e substituí-las por orações de inteira gratidão.'
      }
    ],
    prayers: [
      { id: 'pr-1', request: 'Saúde e restauração da respiração da Vó Francisca', person: 'Família Santos', date: '2026-06-15', status: 'praying', notes: 'Melhora gradual após início do novo suporte.' },
      { id: 'pr-2', request: 'Abertura de novas portas de trabalho na área de TI', person: 'Irmão Thiago', date: '2026-06-10', status: 'answered', notes: 'Thiago foi contratado como Dev Júnior!' }
    ],
    ministries: [
      {
        id: 'min-1',
        name: 'Louvor (Equipe de Instrumentos)',
        role: 'Tecladista / Ministrador de Música',
        scale: 'Escala quinzenal nos cultos de domingo e ensaios aos sábados',
        responsibilities: 'Praticar o repertório, afinar o sintetizador de voz e auxiliar na condução das canções.',
        nextActivities: 'Comprar novos cabos de áudio; testar o pedal de sustain.'
      }
    ]
  },
  youtube: {
    saved: [
      {
        id: 'saved-c1',
        videoId: 'm7M_jOQpPh0',
        title: 'O que é desenvolvimento Web Full-Stack em 2026?',
        thumbnail: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=60',
        channelTitle: 'Tech Central',
        channelId: 'UC_tech',
        publishedAt: '2026-03-12',
        category: 'programming',
        savedAt: '2026-06-18'
      },
      {
        id: 'saved-c2',
        videoId: '9H_Abe5eMyg',
        title: 'Sermão do Monte - Pregações Históricas e Análise Hermenêutica',
        thumbnail: 'https://images.unsplash.com/photo-1438211331416-0ee898666490?w=600&auto=format&fit=crop&q=60',
        channelTitle: 'Teologia Aplicada',
        channelId: 'UC_bible',
        publishedAt: '2026-02-09',
        category: 'church',
        savedAt: '2026-06-17'
      }
    ],
    history: [
      {
        id: 'hist-s1',
        videoId: '5qap5aO4i9A',
        title: 'Lofi Hip Hop Radio - Beats to Study/Relax to ☕',
        thumbnail: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&auto=format&fit=crop&q=60',
        channelTitle: 'Lofi Girl',
        watchedAt: '19/06/2026 15:30:12'
      }
    ],
    subscriptions: [
      {
        id: 'sub-s1',
        channelId: 'UC_bible',
        title: 'Teologia Aplicada',
        thumbnail: 'https://images.unsplash.com/photo-1438211331416-0ee898666490?w=150',
        subscriberCount: '112K'
      },
      {
        id: 'sub-s2',
        channelId: 'UC_tech',
        title: 'Tech Central',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150',
        subscriberCount: '450K'
      }
    ]
  },
  queroComprar: {
    items: [
      {
        id: 'wc-1',
        name: 'Camisa Polo Minimalista Algodão',
        description: 'Camisa polo com caimento slim em algodão Pima premium.',
        price: 189.90,
        store: 'Zara',
        link: 'https://zara.com',
        dateAdded: '2026-07-01',
        priority: 'high',
        desireLevel: 4,
        size: 'M',
        color: 'Azul Marinho',
        notes: 'Fica ótima com calça bege alfaiataria.',
        status: 'want',
        category: 'clothes',
        subCategory: 'Camisas',
        imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
        isFavorite: true
      },
      {
        id: 'wc-2',
        name: 'Camisa do Flamengo Oficial 2026',
        description: 'Camisa oficial do manto sagrado modelo torcedor.',
        price: 349.90,
        store: 'Adidas Store',
        link: 'https://adidas.com.br',
        dateAdded: '2026-07-05',
        priority: 'medium',
        desireLevel: 5,
        size: 'G',
        color: 'Rubro-Negro',
        notes: 'Comprar com patch da Libertadores se possível.',
        status: 'buying',
        category: 'clothes',
        subCategory: 'Camisas de Time',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
        isFavorite: false
      },
      {
        id: 'wc-3',
        name: 'Tênis Nike Air Max Pulse',
        description: 'Tênis com amortecimento responsivo perfeito para uso diário e visual casual chic.',
        price: 899.90,
        store: 'Nike Brasil',
        link: 'https://nike.com.br',
        dateAdded: '2026-06-15',
        priority: 'high',
        desireLevel: 5,
        size: '41',
        color: 'Branco com detalhes Cinza',
        status: 'want',
        category: 'shoes',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        isFavorite: true
      },
      {
        id: 'wc-4',
        name: 'Smartwatch Apple Watch Ultra 2',
        description: 'Smartwatch robusto de titânio para treinos intensos e esportes de aventura.',
        price: 6499.00,
        store: 'Apple Store',
        link: 'https://apple.com/br',
        dateAdded: '2026-06-20',
        priority: 'low',
        desireLevel: 3,
        color: 'Laranja / Titânio Natural',
        notes: 'Aguardar Black Friday para ver se tem desconto.',
        status: 'want',
        category: 'accessories',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        isFavorite: false
      },
      {
        id: 'wc-5',
        name: 'Perfume Bleu de Chanel EDP 100ml',
        description: 'Fragrância amadeirada aromática atemporal para ocasiões sofisticadas.',
        price: 1100.00,
        store: 'Sephora',
        link: 'https://sephora.com.br',
        dateAdded: '2026-07-03',
        priority: 'medium',
        desireLevel: 5,
        notes: 'Excelente fixação e projeção marcante.',
        status: 'bought',
        category: 'personal',
        personalType: 'Perfumes',
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
        isFavorite: true
      },
      {
        id: 'wc-6',
        name: 'Impressora 3D Creality Ender 3 V3',
        description: 'Impressora de alta velocidade CoreXZ estável com ótimo volume de impressão.',
        price: 2499.00,
        store: 'Mercado Livre',
        link: 'https://mercadolivre.com.br',
        dateAdded: '2026-06-25',
        priority: 'medium',
        desireLevel: 4,
        notes: 'Para prototipagem de maquetes e peças robóticas do escritório.',
        status: 'want',
        category: 'professional',
        professionalType: 'Impressoras',
        imageUrl: 'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?w=600&auto=format&fit=crop&q=80',
        isFavorite: false
      },
      {
        id: 'wc-7',
        name: 'Mini Drone DJI Neo 4K',
        description: 'Drone ultraleve com decolagem na palma da mão e vídeos em 4K.',
        price: 1999.00,
        store: 'Flypro',
        link: 'https://flypro.com.br',
        dateAdded: '2026-07-02',
        priority: 'medium',
        desireLevel: 4,
        status: 'buying',
        category: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80',
        isFavorite: false
      },
      {
        id: 'wc-8',
        name: 'Jogo do João - Lego Star Wars Skywalker Saga',
        description: 'Jogo completo com todos os episódios em formato Lego para diversão em família.',
        price: 149.90,
        store: 'PlayStation Store',
        link: 'https://playstation.com',
        dateAdded: '2026-07-06',
        priority: 'high',
        desireLevel: 5,
        notes: 'Presente de aniversário do João de 12 anos.',
        status: 'want',
        category: 'gifts',
        giftPersonId: 'gp-1',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
        isFavorite: false
      },
      {
        id: 'wc-9',
        name: 'Orquídea Phalaenopsis Branca Premium',
        description: 'Orquídea florida exuberante montada em vaso de cerâmica elegante.',
        price: 120.00,
        store: 'Floricultura local',
        dateAdded: '2026-07-07',
        priority: 'high',
        desireLevel: 5,
        notes: 'Dar no almoço especial de aniversário.',
        status: 'bought',
        category: 'gifts',
        giftPersonId: 'gp-2',
        imageUrl: 'https://images.unsplash.com/photo-1453906971074-df566530c0f3?w=600&auto=format&fit=crop&q=80',
        isFavorite: true
      }
    ],
    people: [
      {
        id: 'gp-1',
        name: 'João',
        age: 12,
        birthday: '20/10',
        imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&auto=format&fit=crop&q=80',
        relationship: 'Irmão',
        notes: 'Gosta de Lego, Star Wars, Minecraft e jogos do PS5.'
      },
      {
        id: 'gp-2',
        name: 'Mamãe',
        age: 52,
        birthday: '15/05',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        relationship: 'Mãe',
        notes: 'Adora plantas, perfumes florais suaves, cafés especiais e livros de poesia.'
      },
      {
        id: 'gp-3',
        name: 'Maria',
        age: 28,
        birthday: '03/02',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
        relationship: 'Amiga',
        notes: 'Pratica musculação e ioga. Ama canecas de café estilizadas e organizadores.'
      }
    ]
  },
  catalogs: {
    songs: [],
    songCategories: [],
    repertoires: [],
    customCatalogs: [],
    customItems: []
  }
};

// Simple list of Biblical Books and total chapters
export const BIBLE_BOOKS = [
  // Antigo Testamento
  { name: 'Gênesis', chapters: 50 },
  { name: 'Êxodo', chapters: 40 },
  { name: 'Levítico', chapters: 27 },
  { name: 'Números', chapters: 36 },
  { name: 'Deuteronômio', chapters: 34 },
  { name: 'Josué', chapters: 24 },
  { name: 'Juízes', chapters: 21 },
  { name: 'Rute', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Reis', chapters: 22 },
  { name: '2 Reis', chapters: 25 },
  { name: '1 Crônicas', chapters: 29 },
  { name: '2 Crônicas', chapters: 36 },
  { name: 'Esdras', chapters: 10 },
  { name: 'Neemias', chapters: 13 },
  { name: 'Ester', chapters: 10 },
  { name: 'Jó', chapters: 42 },
  { name: 'Salmos', chapters: 150 },
  { name: 'Provérbios', chapters: 31 },
  { name: 'Eclesiastes', chapters: 12 },
  { name: 'Cânticos', chapters: 8 },
  { name: 'Isaías', chapters: 66 },
  { name: 'Jeremias', chapters: 52 },
  { name: 'Lamentações', chapters: 5 },
  { name: 'Ezequiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Oseias', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amós', chapters: 9 },
  { name: 'Obadias', chapters: 1 },
  { name: 'Jonas', chapters: 4 },
  { name: 'Miqueias', chapters: 7 },
  { name: 'Naum', chapters: 3 },
  { name: 'Habacuque', chapters: 3 },
  { name: 'Sofonias', chapters: 3 },
  { name: 'Ageu', chapters: 2 },
  { name: 'Zacarias', chapters: 14 },
  { name: 'Malaquias', chapters: 4 },
  // Novo Testamento
  { name: 'Mateus', chapters: 28 },
  { name: 'Marcos', chapters: 16 },
  { name: 'Lucas', chapters: 24 },
  { name: 'João', chapters: 21 },
  { name: 'Atos', chapters: 28 },
  { name: 'Romanos', chapters: 16 },
  { name: '1 Coríntios', chapters: 16 },
  { name: '2 Coríntios', chapters: 13 },
  { name: 'Gálatas', chapters: 6 },
  { name: 'Efésios', chapters: 6 },
  { name: 'Filipenses', chapters: 4 },
  { name: 'Colossenses', chapters: 4 },
  { name: '1 Tessalonicenses', chapters: 5 },
  { name: '2 Tessalonicenses', chapters: 3 },
  { name: '1 Timóteo', chapters: 6 },
  { name: '2 Timóteo', chapters: 4 },
  { name: 'Tito', chapters: 3 },
  { name: 'Filemom', chapters: 1 },
  { name: 'Hebreus', chapters: 13 },
  { name: 'Tiago', chapters: 5 },
  { name: '1 Pedro', chapters: 5 },
  { name: '2 Pedro', chapters: 3 },
  { name: '1 João', chapters: 5 },
  { name: '2 João', chapters: 1 },
  { name: '3 João', chapters: 1 },
  { name: 'Judas', chapters: 1 },
  { name: 'Apocalipse', chapters: 22 }
];
