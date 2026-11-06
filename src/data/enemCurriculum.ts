import { StudySubject } from '../types';
import { PORTUGUES_ENEM_SUBJECT } from './portuguesCurriculum';

export const DEFAULT_ENEM_SUBJECTS: StudySubject[] = [
  PORTUGUES_ENEM_SUBJECT,
  {
    id: 'enem-matematica',
    name: 'Matemática',
    icon: 'Calculator',
    color: 'emerald',
    progress: 15,
    timeStudiedMinutes: 320,
    history: [],
    modules: [
      {
        id: 'mod-mat-1',
        title: 'Módulo 1 — Matemática Básica e Proporções',
        description: 'Fundamentos essenciais que representam mais de 30% da prova.',
        lessons: [
          { id: 'l-mat-1', title: 'Operações com Frações e Decimais', duration: '20 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-24' },
          { id: 'l-mat-2', title: 'Razão, Proporção e Escalas', duration: '25 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-25' },
          { id: 'l-mat-3', title: 'Regra de Três Simples e Composta', duration: '25 min', type: 'aula', status: 'Em andamento' },
          { id: 'l-mat-4', title: 'Porcentagem e Aumentos/Descontos', duration: '30 min', type: 'exercicios', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-mat-2',
        title: 'Módulo 2 — Funções e Gráficos',
        description: 'Interpretação gráfica de funções de 1º e 2º grau e logaritmos.',
        lessons: [
          { id: 'l-mat-5', title: 'Conceito de Função e Domínio', duration: '20 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-6', title: 'Função Afim (Linear) e Taxa de Variação', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-7', title: 'Função Quadrática e Coordenadas do Vértice', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-8', title: 'Função Exponencial e Logaritmo', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-mat-3',
        title: 'Módulo 3 — Geometria Plana e Espacial',
        description: 'Áreas, volumes de prismas, cilindros, cones e esferas.',
        lessons: [
          { id: 'l-mat-9', title: 'Triângulos e Teorema de Pitágoras', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-10', title: 'Áreas de Figuras Planas', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-11', title: 'Prismas e Cilindros', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-12', title: 'Cones, Pirâmides e Esferas', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-mat-4',
        title: 'Módulo 4 — Estatística e Probabilidade',
        description: 'Média, moda, mediana, desvio e cálculo de probabilidades.',
        lessons: [
          { id: 'l-mat-13', title: 'Média Aritmética, Moda e Mediana', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-mat-14', title: 'Análise de Gráficos de Setores e Barras', duration: '20 min', type: 'exercicios', status: 'Não iniciado' },
          { id: 'l-mat-15', title: 'Probabilidade Simples e Condicional', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      }
    ]
  },
  {
    id: 'enem-historia',
    name: 'História',
    icon: 'Compass',
    color: 'amber',
    progress: 10,
    timeStudiedMinutes: 180,
    history: [],
    modules: [
      {
        id: 'mod-hist-1',
        title: 'Módulo 1 — Brasil Colônia e Império',
        description: 'Processo de colonização, mineração, independência e império.',
        lessons: [
          { id: 'l-hist-1', title: 'Povos Indígenas e Chegada dos Portugueses', duration: '20 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-22' },
          { id: 'l-hist-2', title: 'Economia Açucareira e Escravidão', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-3', title: 'Ciclo do Ouro e Revoltas Nativistas', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-4', title: 'Independência do Brasil e Primeiro Reinado', duration: '25 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-hist-2',
        title: 'Módulo 2 — Brasil República e Era Vargas',
        description: 'República oligárquica, Era Vargas, CLT e regime militar.',
        lessons: [
          { id: 'l-hist-5', title: 'República da Espada e das Oligarquias', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-6', title: 'Era Vargas (1930 - 1945) e Leis Trabalhistas', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-7', title: 'Ditadura Militar e Redemocratização', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-hist-3',
        title: 'Módulo 3 — História Geral e Contemporânea',
        description: 'Grandes guerras, revolução industrial e Guerra Fria.',
        lessons: [
          { id: 'l-hist-8', title: 'Feudalismo e Iluminismo', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-9', title: 'Revolução Industrial e Francesa', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-hist-10', title: 'Primeira e Segunda Guerra Mundial', duration: '35 min', type: 'aula', status: 'Não iniciado' }
        ]
      }
    ]
  },
  {
    id: 'enem-biologia',
    name: 'Biologia',
    icon: 'Dna',
    color: 'rose',
    progress: 20,
    timeStudiedMinutes: 240,
    history: [],
    modules: [
      {
        id: 'mod-bio-1',
        title: 'Módulo 1 — Citologia e Bioquímica',
        description: 'Estrutura celular, organelas e metabolismo.',
        lessons: [
          { id: 'l-bio-1', title: 'Célula Animal x Vegetal', duration: '20 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-26' },
          { id: 'l-bio-2', title: 'Membrana Plasmática e Transporte', duration: '20 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-27' },
          { id: 'l-bio-3', title: 'Respiração Celular e Fotossíntese', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-bio-2',
        title: 'Módulo 2 — Ecologia e Sustentabilidade',
        description: 'Tópico mais recorrente na prova de Ciências da Natureza.',
        lessons: [
          { id: 'l-bio-4', title: 'Cadeia e Teia Alimentar', duration: '20 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-bio-5', title: 'Biomas Brasileiros (Cerrado, Caatinga, Amazônia)', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-bio-6', title: 'Impactos Ambientais e Efeito Estufa', duration: '25 min', type: 'exercicios', status: 'Não iniciado' }
        ]
      }
    ]
  },
  {
    id: 'enem-fisica',
    name: 'Física',
    icon: 'Atom',
    color: 'sky',
    progress: 5,
    timeStudiedMinutes: 120,
    history: [],
    modules: [
      {
        id: 'mod-fis-1',
        title: 'Módulo 1 — Cinemática e Dinâmica',
        description: 'Movimentos, leis de Newton e conservação de energia.',
        lessons: [
          { id: 'l-fis-1', title: 'MRU e MRUV', duration: '25 min', type: 'aula', status: 'Em andamento' },
          { id: 'l-fis-2', title: 'Leis de Newton e Força de Atrito', duration: '30 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-fis-3', title: 'Trabalho, Energia e Potência', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-fis-2',
        title: 'Módulo 2 — Ondulatória e Óptica',
        description: 'Fenômenos ondulatórios, espelhos e lentes.',
        lessons: [
          { id: 'l-fis-4', title: 'Ondas: Frequência, Comprimento e Velocidade', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-fis-5', title: 'Refração, Difração e Interferência', duration: '25 min', type: 'aula', status: 'Não iniciado' }
        ]
      }
    ]
  },
  {
    id: 'enem-quimica',
    name: 'Química',
    icon: 'Flame',
    color: 'cyan',
    progress: 10,
    timeStudiedMinutes: 150,
    history: [],
    modules: [
      {
        id: 'mod-quim-1',
        title: 'Módulo 1 — Química Geral e Ligações',
        description: 'Tabela periódica, ligações atômicas e soluções.',
        lessons: [
          { id: 'l-quim-1', title: 'Modelos Atômicos e Tabela Periódica', duration: '25 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-28' },
          { id: 'l-quim-2', title: 'Ligações Iônicas, Covalentes e Metálicas', duration: '25 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-quim-3', title: 'Estequiometria e Cálculos Químicos', duration: '35 min', type: 'aula', status: 'Não iniciado' }
        ]
      },
      {
        id: 'mod-quim-2',
        title: 'Módulo 2 — Química Orgânica',
        description: 'Cadeias carbônicas, funções orgânicas e reações.',
        lessons: [
          { id: 'l-quim-4', title: 'Classificação de Cadeias Carbônicas', duration: '20 min', type: 'aula', status: 'Não iniciado' },
          { id: 'l-quim-5', title: 'Funções Orgânicas (Álcool, Éster, Ácido)', duration: '30 min', type: 'aula', status: 'Não iniciado' }
        ]
      }
    ]
  },
  {
    id: 'enem-redacao',
    name: 'Redação',
    icon: 'FileText',
    color: 'fuchsia',
    progress: 40,
    timeStudiedMinutes: 600,
    history: [],
    modules: [
      {
        id: 'mod-red-1',
        title: 'Módulo 1 — Estrutura Nota 1000',
        description: 'Tese, introdução, desenvolvimento e proposta de intervenção.',
        lessons: [
          { id: 'l-red-1', title: 'Projeto de Texto e Tese', duration: '25 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-15' },
          { id: 'l-red-2', title: 'Repertórios Socioculturais Curingas', duration: '30 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-18' },
          { id: 'l-red-3', title: 'Conectivos Interparágrafos', duration: '20 min', type: 'aula', status: 'Concluído', completedAt: '2026-07-20' },
          { id: 'l-red-4', title: 'Proposta de Intervenção (Agente, Ação, Meio, Efeito, Detalhamento)', duration: '35 min', type: 'aula', status: 'Em andamento' }
        ]
      }
    ]
  }
];
