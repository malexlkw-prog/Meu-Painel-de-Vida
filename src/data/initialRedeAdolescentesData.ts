import { RedeAdolescentesData } from '../types/redeAdolescentes';

export const INITIAL_REDE_ADOLESCENTES_DATA: RedeAdolescentesData = {
  identity: {
    name: 'Rede de Adolescentes',
    year: 2027,
    theme: 'Crescendo em Cristo e vivendo a Palavra',
    themeVerseRef: 'Colossenses 2:6-7',
    themeVerseText: 'Portanto, assim como vocês receberam Cristo Jesus, o Senhor, continuem a viver nele, enraizados e edificados nele, firmados na fé, como foram ensinados, transbordando de gratidão.',
    periodStart: '06/02/2027',
    periodEnd: '04/12/2027',
    purpose: 'Alcançar, acolher e acompanhar adolescentes, especialmente aqueles que se afastaram da igreja ou que ainda não possuem uma caminhada cristã.',
    pillars: [
      'Conhecer a Cristo',
      'Criar vínculos e amizades',
      'Aprender a Bíblia',
      'Desenvolver uma vida de oração',
      'Conversar sobre questões da adolescência à luz da Palavra',
      'Crescer espiritualmente',
      'Descobrir seu propósito',
      'Aprender a compartilhar sua fé',
      'Convidar e alcançar outros adolescentes'
    ]
  },
  reachGoal: 10,
  meetingStructure: [
    {
      id: 'step-1',
      order: 1,
      title: 'Chegada e acolhimento',
      description: 'Recepção calorosa dos adolescentes, integração e boas-vindas.'
    },
    {
      id: 'step-2',
      order: 2,
      title: 'Oração',
      description: 'Momento inicial consagrando o encontro e abrindo os corações a Deus.'
    },
    {
      id: 'step-3',
      order: 3,
      title: 'Pequena palavra',
      description: 'Introdução curta e objetiva relacionada ao tema bíblico do dia.'
    },
    {
      id: 'step-4',
      order: 4,
      title: 'Interatividade',
      description: 'Quebra-gelo dinâmico, perguntas práticas, conversas em roda e atividades reflexivas.'
    },
    {
      id: 'step-5',
      order: 5,
      title: 'Brincadeira',
      description: 'Momento divertido, descontraído e cooperativo em equipe.'
    },
    {
      id: 'step-6',
      order: 6,
      title: 'Lanche',
      description: 'Momento de comunhão, conversas leves e fortalecimento dos relacionamentos.'
    }
  ],
  cycles: [
    {
      id: 'ciclo-1',
      number: 1,
      name: 'Primeiros Passos',
      period: '06/02/2027 → 27/03/2027',
      duration: '8 semanas',
      objective: 'Apresentar aos adolescentes os fundamentos da caminhada cristã e conversar sobre questões que começam a fazer parte da vida durante a adolescência.',
      weeks: [
        {
          id: 'w1-1',
          date: '06/02/2027',
          theme: 'Boas-vindas e Acolhimento (Abertura)',
          description: 'Primeiro encontro voltado para acolher os adolescentes. Pequena palavra sobre mostrar que Jesus os ama, deseja que eles estejam ali e quer caminhar com eles. Estrutura: Oração → palavra → quebra-gelo → brincadeira → lanche.',
          completed: false
        },
        { id: 'w1-2', date: '13/02/2027', theme: 'Identidade', description: 'Quem eu sou em Cristo e o valor que Deus me dá.', completed: false },
        { id: 'w1-3', date: '20/02/2027', theme: 'Trindade', description: 'Compreendendo Deus Pai, Filho e Espírito Santo de forma acessível.', completed: false },
        { id: 'w1-4', date: '27/02/2027', theme: 'Relacionamento e Influência', description: 'Amizades, escolhas, pressão do meio e como influenciar para o bem.', completed: false },
        { id: 'w1-5', date: '06/03/2027', theme: 'Pecado', description: 'O que nos afasta de Deus e a graça restauradora da cruz.', completed: false },
        { id: 'w1-6', date: '13/03/2027', theme: 'Fé', description: 'Confiar em Deus no dia a dia e dar passos corajosos.', completed: false },
        { id: 'w1-7', date: '20/03/2027', theme: 'Maturidade', description: 'Crescer emocionalmente e espiritualmente, assumindo responsabilidades.', completed: false },
        { id: 'w1-8', date: '27/03/2027', theme: 'Propósito', description: 'Deus sonhou com você: descobrindo dons e chamado.', completed: false }
      ]
    },
    {
      id: 'ciclo-2',
      number: 2,
      name: 'Mateus',
      period: '10/04/2027 → 22/05/2027',
      duration: '7 semanas',
      objective: 'Fazer os adolescentes entrarem em contato direto com a Bíblia e desenvolver o hábito de: Orar + Ler + Interagir. Leitura de 4 capítulos por semana, com flexibilidade de dias.',
      weeks: [
        { id: 'w2-1', date: '10/04/2027', theme: 'Mateus 1–4', readings: 'Mateus 1 a 4', description: 'Genealogia, nascimento, batismo e tentação de Jesus.', completed: false },
        { id: 'w2-2', date: '17/04/2027', theme: 'Mateus 5–8', readings: 'Mateus 5 a 8', description: 'Sermão do Monte e primeiros milagres de compaixão.', completed: false },
        { id: 'w2-3', date: '24/04/2027', theme: 'Mateus 9–12', readings: 'Mateus 9 a 12', description: 'O chamado dos discípulos e o poder do Reino.', completed: false },
        { id: 'w2-4', date: '01/05/2027', theme: 'Mateus 13–16', readings: 'Mateus 13 a 16', description: 'Parábolas do Reino e a confissão de Pedro.', completed: false },
        { id: 'w2-5', date: '08/05/2027', theme: 'Mateus 17–20', readings: 'Mateus 17 a 20', description: 'Transfiguração, perdão e serviço humilde.', completed: false },
        { id: 'w2-6', date: '15/05/2027', theme: 'Mateus 21–24', readings: 'Mateus 21 a 24', description: 'Entrada em Jerusalém e ensinamentos finais.', completed: false },
        { id: 'w2-7', date: '22/05/2027', theme: 'Mateus 25–28', readings: 'Mateus 25 a 28', description: 'Crucificação, ressurreição e a Grande Comissão. Conclusão da leitura de todo o Evangelho de Mateus!', completed: false }
      ]
    },
    {
      id: 'ciclo-3',
      number: 3,
      name: 'Antigo Testamento',
      period: '05/06/2027 → 28/08/2027',
      duration: '9 semanas (com intervalo de férias em julho)',
      objective: 'Aumentar e revisar o conhecimento dos adolescentes sobre o Antigo Testamento, criando uma base para compreender a história bíblica desde a criação até a preparação para Jesus.',
      weeks: [
        { id: 'w3-1', date: '05/06/2027', theme: 'Criação e Queda', description: 'Gênesis 1-3: O bom projeto de Deus e a entrada do pecado.', completed: false },
        { id: 'w3-2', date: '12/06/2027', theme: 'Dilúvio e Torre de Babel', description: 'Noé, a aliança do arco-íris e a dispersão dos povos.', completed: false },
        { id: 'w3-3', date: '19/06/2027', theme: 'Patriarcas', description: 'Abraão, Isaque, Jacó e José: promessas que atravessam gerações.', completed: false },
        { id: 'w3-4', date: '26/06/2027', theme: 'Êxodo, Lei e Peregrinação', description: 'Moisés, libertação do Egito, Tabernáculo e deserto.', completed: false },
        { id: 'w3-5', date: '03/07/2027', theme: 'Josué, Juízes e Rute', description: 'Conquista de Canaã, ciclos de libertadores e lealdade de Rute.', completed: false },
        { id: 'w3-ferias', date: '10/07 a 31/07', theme: 'Férias de Julho', description: 'Intervalo de descanso e recarregar energias.', completed: false },
        { id: 'w3-6', date: '07/08/2027', theme: 'Reino Unido — Samuel, Saul, Davi e Salomão', description: 'Retorno das férias: O início da monarquia e o templo.', completed: false },
        { id: 'w3-7', date: '14/08/2027', theme: 'Reino Dividido', description: 'Israel e Judá: reis, profetas (Elias, Eliseu) e advertências.', completed: false },
        { id: 'w3-8', date: '21/08/2027', theme: 'Exílio e Retorno', description: 'Babilônia, fidelidade de Daniel, reconstrução com Esdras e Neemias.', completed: false },
        { id: 'w3-9', date: '28/08/2027', theme: 'Profecias e Preparação de Jesus', description: 'Promessas messiânicas e 400 anos de silêncio preparando o Salvador.', completed: false }
      ]
    },
    {
      id: 'ciclo-4',
      number: 4,
      name: 'Provérbios',
      period: '11/09/2027 → 30/10/2027',
      duration: '8 semanas',
      objective: 'Continuar desenvolvendo o hábito de leitura bíblica e trabalhar os ensinamentos práticos de sabedoria de Provérbios.',
      weeks: [
        { id: 'w4-1', date: '11/09/2027', theme: 'Provérbios 1–4', readings: 'Provérbios 1 a 4', description: 'O temor do Senhor como princípio da sabedoria.', completed: false },
        { id: 'w4-2', date: '18/09/2027', theme: 'Provérbios 5–8', readings: 'Provérbios 5 a 8', description: 'Cuidado com armadilhas morais e o valor incomparável da sabedoria.', completed: false },
        { id: 'w4-3', date: '25/09/2027', theme: 'Provérbios 9–12', readings: 'Provérbios 9 a 12', description: 'O banquete da sabedoria versus insensatez.', completed: false },
        { id: 'w4-4', date: '02/10/2027', theme: 'Provérbios 13–16', readings: 'Provérbios 13 a 16', description: 'Palavras, integridade no trabalho e domínio próprio.', completed: false },
        { id: 'w4-5', date: '09/10/2027', theme: 'Provérbios 17–20', readings: 'Provérbios 17 a 20', description: 'Amizade verdadeira, paz em família e discernimento.', completed: false },
        { id: 'w4-6', date: '16/10/2027', theme: 'Provérbios 21–24', readings: 'Provérbios 21 a 24', description: 'Justiça, generosidade com o necessitado e foco.', completed: false },
        { id: 'w4-7', date: '23/10/2027', theme: 'Provérbios 25–28', readings: 'Provérbios 25 a 28', description: 'Humildade, paciência e honestidade.', completed: false },
        { id: 'w4-8', date: '30/10/2027', theme: 'Provérbios 29–31 + Encerramento', readings: 'Provérbios 29 a 31', description: 'Liderança justa, louvor da virtude e conclusão do livro de sabedoria.', completed: false }
      ]
    },
    {
      id: 'ciclo-5',
      number: 5,
      name: 'Reta Final',
      period: '13/11/2027 → 20/11/2027',
      duration: '2 semanas',
      objective: 'Preparação do coração, firmeza de convicções e mobilização para ação evangelística.',
      weeks: [
        {
          id: 'w5-1',
          date: '13/11/2027',
          theme: 'Não se Distraia',
          description: 'Permanecer focado em Cristo diante das distrações, influências e coisas que podem afastar o adolescente da caminhada com Deus.',
          completed: false
        },
        {
          id: 'w5-2',
          date: '20/11/2027',
          theme: 'Seja Forte e Corajoso',
          description: 'Coragem, fé, posicionamento e confiança em Deus. Neste sábado acontece o sorteio oficial das equipes e dos personagens bíblicos para o Adolescentes em Ação.',
          completed: false
        }
      ]
    }
  ],
  specialEvents: [
    {
      id: 'evt-cinema',
      name: 'Cinema na Igreja',
      date: '03/04/2027',
      description: 'Sábado especial após o ciclo Primeiros Passos, com filme edificante, pipoca, lanches, muita interação e acolhimento fraterno.',
      plannedActivities: [
        'Filme com mensagem bíblica ou reflexiva',
        'Distribuição de pipoca fresca e bebidas',
        'Lanches compartilhados',
        'Momento de quebra-gelo e bate-papo sobre a mensagem do filme',
        'Tempo de comunhão e oração final'
      ],
      responsible: 'Equipe da Rede',
      budget: 0,
      details: {
        movieSuggestions: ['Quarto de Guerra', 'Milagres do Paraíso', 'A Prova de Fogo', 'Deus Não Está Morto']
      }
    },
    {
      id: 'evt-gincana-1',
      name: '1ª Gincana (Revisão de Mateus)',
      date: '29/05/2027',
      description: 'Revisão dinâmica e divertida de todo o Evangelho de Mateus lido durante o 2º Ciclo.',
      plannedActivities: [
        'Passa ou Repassa',
        'Torta na Cara',
        'Perguntas bíblicas sobre Mateus',
        'Perguntas rápidas de reflexo',
        'Desafios de cooperação em equipes',
        'Tabela de pontuação e premiação'
      ],
      responsible: 'Líderes e Apoio',
      budget: 0
    },
    {
      id: 'evt-noite-com-deus',
      name: 'Noite com Deus (Vigília / Pijama na Igreja)',
      date: '04/09/2027',
      description: 'Uma espécie de festa do pijama na igreja, com foco especial em comunhão profunda, adoração e vida espiritual.',
      plannedActivities: [
        'Brincadeiras noturnas e quebra-gelo',
        'Lanche especial e confraternização',
        'Momento de louvor e adoração acústica',
        'Palavra focada em intimidade com Deus',
        'Oração individual e pelos amigos',
        'Roda de conversa: “Como está sendo meu ano na Rede de Adolescentes?”'
      ],
      responsible: 'Eu, Pais e Líderes',
      budget: 0,
      details: {
        conversationTopic: 'Como está sendo meu ano na Rede de Adolescentes?',
        sleepLogistics: 'Colchões e barracas no templo/salão de eventos'
      }
    },
    {
      id: 'evt-passeio',
      name: 'Passeio da Rede',
      date: '06/11/2027',
      description: 'Dia inteiro de lazer, diversão, comunhão e fortalecimento dos vínculos de amizade entre os adolescentes e a equipe.',
      plannedActivities: [
        'Transporte em van/ônibus ou comboio',
        'Almoço comunitário ou piquenique',
        'Brincadeiras ao ar livre e jogos aquáticos',
        'Palavra de gratidão ao pôr do sol'
      ],
      responsible: 'Coordenação e Pais',
      budget: 0,
      details: {
        destinationsOptions: ['Rio', 'Piscina', 'Chácara', 'Outro local de lazer']
      }
    },
    {
      id: 'evt-adolescentes-acao',
      name: 'Adolescentes em Ação',
      date: '27/11/2027',
      description: 'Os próprios adolescentes compartilharão a Palavra em equipes. Baseado em Marcos 16:15: “Ide por todo o mundo e pregai o evangelho a toda criatura.”',
      plannedActivities: [
        'Divisão dos adolescentes em grupos',
        'Sorteio de personagens bíblicos (Jonas, Daniel, Davi, Moisés, Ester, José, Pedro, Jesus)',
        'Tempo de preparação e estudo em grupo',
        'Apresentação de mensagem curta por cada equipe',
        'Desenvolvimento de comunicação, evangelismo e coragem'
      ],
      responsible: 'Adolescentes e Mentores',
      budget: 0,
      details: {
        bibleVerse: 'Marcos 16:15',
        characters: ['Jonas', 'Daniel', 'Davi', 'Moisés', 'Ester', 'José', 'Pedro', 'Jesus']
      }
    },
    {
      id: 'evt-gincana-2',
      name: '2ª Gincana + Confraternização Final',
      date: '04/12/2027',
      description: 'Grande encerramento do ano de 2027, com super revisão geral de tudo vivido, gincana animada e banquete de celebração.',
      plannedActivities: [
        'Passa ou Repassa geral do ano',
        'Torta na Cara',
        'Perguntas bíblicas sobre Mateus, Antigo Testamento e Provérbios',
        'Perguntas rápidas sobre pregações do ano',
        'Provas cooperativas finais',
        'Confraternização festiva com lanche especial',
        'Mural de fotos e retrospectiva',
        'Momento de gratidão a Deus por 2027'
      ],
      responsible: 'Toda a Equipe',
      budget: 0
    }
  ],
  team: [
    {
      id: 'team-1',
      name: 'Eu',
      role: 'Coordenação Geral',
      responsibility: 'Planejamento estratégico, visão geral do projeto, condução dos encontros e alinhamento com a igreja.',
      contact: '',
      notes: 'Responsável principal pelo projeto 2027'
    },
    {
      id: 'team-2',
      name: 'Meu pai',
      role: 'Apoio e Liderança',
      responsibility: 'Suporte espiritual, cobertura pastoral/familiar e apoio logístico nos eventos especiais.',
      contact: '',
      notes: ''
    },
    {
      id: 'team-3',
      name: 'Minha mãe',
      role: 'Apoio e Acolhimento',
      responsibility: 'Acolhimento dos adolescentes, coordenação dos lanches, comunhão e cuidado interpessoal.',
      contact: '',
      notes: ''
    },
    {
      id: 'team-4',
      name: 'Líderes',
      role: 'Liderança de Encontros',
      responsibility: 'Mentoria dos adolescentes, auxílio na ministração das palavras, oração e condução de pequenos grupos.',
      contact: '',
      notes: 'Liderança ativa nos sábados'
    },
    {
      id: 'team-5',
      name: 'Lucas',
      role: 'Equipe de Apoio',
      responsibility: 'Interatividade, recepção dinâmica dos adolescentes, mediação de brincadeiras e quebra-gelo.',
      contact: '',
      notes: ''
    },
    {
      id: 'team-6',
      name: 'Guilherme',
      role: 'Equipe de Apoio',
      responsibility: 'Organização geral, apoio logístico, controle de materiais, som e multimídia.',
      contact: '',
      notes: ''
    }
  ],
  participants: [], // Inicia vazio (0 adolescentes fictícios)
  finance: [],
  shirts: {
    model: 'Camiseta Algodão / Dry Confort',
    color: 'A definir (Preta / Marrom Terra / Off-white)',
    printDescription: 'Logo Rede de Adolescentes 2027 + Versículo Colossenses 2:6-7',
    supplier: '',
    estimatedQuantity: 25,
    unitCost: 0,
    shippingCost: 0,
    additionalCosts: 0,
    orderDeadline: '15/01/2027',
    priceCategories: [
      { id: 'cat-1', categoryName: 'Adolescente', quantity: 0, pricePerPerson: 0 },
      { id: 'cat-2', categoryName: 'Líder', quantity: 0, pricePerPerson: 0 },
      { id: 'cat-3', categoryName: 'Convidado', quantity: 0, pricePerPerson: 0 },
      { id: 'cat-4', categoryName: 'Igreja / Subsídio', quantity: 0, pricePerPerson: 0 }
    ],
    notes: 'Definir valores com orçamento do fornecedor'
  },
  meals: [
    {
      id: 'meal-1',
      event: 'Boas-vindas (06/02/2027)',
      item: 'Lanche especial de abertura',
      quantity: 1,
      unit: 'kit',
      estimatedUnitPrice: 0,
      totalCost: 0,
      category: 'Lanches',
      responsible: 'Minha mãe'
    },
    {
      id: 'meal-2',
      event: 'Cinema na Igreja (03/04/2027)',
      item: 'Pipoca doce e salgada + Refrigerante/Suco',
      quantity: 1,
      unit: 'kit',
      estimatedUnitPrice: 0,
      totalCost: 0,
      category: 'Pipoca',
      responsible: 'Equipe'
    },
    {
      id: 'meal-3',
      event: 'Noite com Deus (04/09/2027)',
      item: 'Pizza / Cachorro-quente + Café da manhã',
      quantity: 1,
      unit: 'kit',
      estimatedUnitPrice: 0,
      totalCost: 0,
      category: 'Refeições',
      responsible: 'Equipe'
    },
    {
      id: 'meal-4',
      event: 'Confraternização Final (04/12/2027)',
      item: 'Lanche festivo de encerramento',
      quantity: 1,
      unit: 'kit',
      estimatedUnitPrice: 0,
      totalCost: 0,
      category: 'Salgados',
      responsible: 'Equipe'
    }
  ],
  trip: {
    destination: 'A definir (Chácara / Balneário / Parque)',
    date: '06/11/2027',
    destinationOptions: ['Rio', 'Piscina', 'Chácara', 'Outro local de lazer'],
    estimatedPeople: 20,
    ticketPerPerson: 0,
    transportTotalCost: 0,
    foodTotalCost: 0,
    otherCosts: 0,
    plannedFeePerPerson: 0,
    notes: 'Fazer cotação de chácara e transporte com antecedência'
  },
  materials: [
    {
      id: 'mat-1',
      name: 'Crachás e fitas de identificação para acolhimento',
      quantity: 30,
      category: 'Recepção',
      eventRelated: 'Abertura (06/02)',
      estimatedPrice: 0,
      purchased: false,
      notes: ''
    },
    {
      id: 'mat-2',
      name: 'Pratos de papelão e chantilly (Torta na Cara)',
      quantity: 20,
      category: 'Gincana',
      eventRelated: '1ª Gincana (29/05)',
      estimatedPrice: 0,
      purchased: false,
      notes: ''
    },
    {
      id: 'mat-3',
      name: 'Sino ou campainha de resposta rápida',
      quantity: 2,
      category: 'Gincana',
      eventRelated: 'Gincanas',
      estimatedPrice: 0,
      purchased: false,
      notes: ''
    },
    {
      id: 'mat-4',
      name: 'Cadernos de anotações e canetas para leitura bíblica',
      quantity: 25,
      category: 'Estudo',
      eventRelated: 'Ciclo Mateus',
      estimatedPrice: 0,
      purchased: false,
      notes: ''
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Definir arte e estampa oficial da camisa 2027',
      description: 'Desenvolver layout com o tema "Crescendo em Cristo e vivendo a Palavra" e versículo Colossenses 2:6-7.',
      deadline: '10/01/2027',
      priority: 'Alta',
      responsible: 'Eu',
      eventRelated: 'Camisas',
      status: 'A fazer'
    },
    {
      id: 'task-2',
      title: 'Cotar orçamentos de confecção de camisas com fornecedores',
      description: 'Pesquisar pelo menos 3 confecções de tecido confortável.',
      deadline: '15/01/2027',
      priority: 'Alta',
      responsible: 'Eu',
      eventRelated: 'Camisas',
      status: 'A fazer'
    },
    {
      id: 'task-3',
      title: 'Planejar dinâmicas de acolhimento do primeiro encontro (06/02)',
      description: 'Preparar quebra-gelo descontraído para que nenhum adolescente se sinta tímido.',
      deadline: '28/01/2027',
      priority: 'Alta',
      responsible: 'Lucas e Líderes',
      eventRelated: 'Abertura',
      status: 'A fazer'
    },
    {
      id: 'task-4',
      title: 'Elaborar banco de perguntas e respostas para a 1ª Gincana de Mateus',
      description: 'Perguntas com múltiplos níveis de dificuldade cobrindo Mateus 1 a 28.',
      deadline: '15/05/2027',
      priority: 'Média',
      responsible: 'Líderes',
      eventRelated: '1ª Gincana',
      status: 'A fazer'
    },
    {
      id: 'task-5',
      title: 'Pesquisar chácaras e locais de lazer para o Passeio da Rede',
      description: 'Visitar locais com piscina ou campo e conferir segurança para os adolescentes.',
      deadline: '15/09/2027',
      priority: 'Média',
      responsible: 'Meu pai e Eu',
      eventRelated: 'Passeio',
      status: 'A fazer'
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Visão espiritual: O adolescente como participante ativo',
      category: 'Ideia',
      content: 'A proposta central é que o adolescente não seja apenas um ouvinte passivo, mas alguém que participe, crie vínculos, cresça espiritualmente e se sinta capacitado para orar por seus colegas de escola e família.',
      createdAt: '13/09/2026',
      tags: ['Visão', 'Discipulado']
    },
    {
      id: 'note-2',
      title: 'Estratégia de Acolhimento dos Afastados',
      category: 'Sugestão',
      content: 'Para adolescentes que deixaram de vir à igreja, nunca fazer cobranças ou perguntas invasivas na chegada. Focar em abraço, interesse genuíno por suas vidas, ambiente alegre e amizades sem julgamentos.',
      createdAt: '13/09/2026',
      tags: ['Acolhimento', 'Pastoreio']
    }
  ]
};
