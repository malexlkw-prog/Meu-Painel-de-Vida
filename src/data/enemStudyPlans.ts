import { StudyPlan } from '../components/PersonalStudiesSection';
import { PORTUGUES_STUDY_PLAN } from './portuguesCurriculum';
import { BIOLOGIA_STUDY_PLAN } from './biologiaCurriculum';
import { QUIMICA_STUDY_PLAN } from './quimicaCurriculum';

export const ALL_ENEM_STUDY_PLANS: StudyPlan[] = [
  PORTUGUES_STUDY_PLAN,
  BIOLOGIA_STUDY_PLAN,
  QUIMICA_STUDY_PLAN,
  {
    id: 'matematica_enem',
    name: 'Matemática',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'mat-mod-1',
        title: 'Módulo 1 — Matemática Básica & Proporcionalidade',
        description: 'Fundamentos mais cobrados no ENEM: operações, frações, porcentagens e razão.',
        topics: [
          { id: 'mat-1-1', title: 'Operações Fundamentais, Frações e Números Decimais', status: 'concluido' },
          { id: 'mat-1-2', title: 'Razão, Proporção e Grandezas Direta/Inversamente Proporcionais', status: 'concluido' },
          { id: 'mat-1-3', title: 'Regra de Três Simples e Composta', status: 'concluido' },
          { id: 'mat-1-4', title: 'Porcentagem, Aumentos, Descontos e Juros Simples', status: 'em_andamento' },
          { id: 'mat-1-5', title: 'Conversão de Unidades e Escalas em Mapas/Plantas', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'mat-mod-2',
        title: 'Módulo 2 — Estatística e Análise de Dados',
        description: 'Média, mediana, moda e interpretação de gráficos e tabelas estatísticas.',
        topics: [
          { id: 'mat-2-1', title: 'Leitura e Interpretação Crítica de Gráficos e Tabelas', status: 'em_andamento' },
          { id: 'mat-2-2', title: 'Medidas de Tendência Central: Média Aritmética e Ponderada', status: 'nao_iniciado' },
          { id: 'mat-2-3', title: 'Mediana e Moda', status: 'nao_iniciado' },
          { id: 'mat-2-4', title: 'Medidas de Dispersão: Amplitude, Desvio Padrão e Variância', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'mat-mod-3',
        title: 'Módulo 3 — Funções e Álgebra Aplicada',
        description: 'Funções de 1º e 2º graus, exponenciais e modelagem de problemas.',
        topics: [
          { id: 'mat-3-1', title: 'Conceito de Função e Interpretação Gráfica', status: 'nao_iniciado' },
          { id: 'mat-3-2', title: 'Função Afim (1º Grau): Taxa de Variação e Gráficos', status: 'nao_iniciado' },
          { id: 'mat-3-3', title: 'Função Quadrática (2º Grau): Vértice, Máximos e Mínimos', status: 'nao_iniciado' },
          { id: 'mat-3-4', title: 'Função Exponencial e Aplicação em Crescimento Populacional/Financeiro', status: 'nao_iniciado' },
          { id: 'mat-3-5', title: 'Noções Básicas de Logaritmos e Escala Richter/pH', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'mat-mod-4',
        title: 'Módulo 4 — Geometria Plana e Espacial',
        description: 'Cálculo de áreas, perímetros, volumes e visualização espacial.',
        topics: [
          { id: 'mat-4-1', title: 'Áreas e Perímetros de Figuras Planas (Triângulos, Quadriláteros, Círculos)', status: 'nao_iniciado' },
          { id: 'mat-4-2', title: 'Teorema de Pitágoras e Trigonometria no Triângulo Retângulo', status: 'nao_iniciado' },
          { id: 'mat-4-3', title: 'Geometria Espacial: Prismas, Cubos e Paralelepípedos', status: 'nao_iniciado' },
          { id: 'mat-4-4', title: 'Cilindros, Cones e Esferas (Volumes e Áreas)', status: 'nao_iniciado' },
          { id: 'mat-4-5', title: 'Projeção Ortogonal e Vistas Espaciais no ENEM', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'mat-mod-5',
        title: 'Módulo 5 — Probabilidade e Análise Combinatória',
        description: 'Princípio fundamental da contagem, permutações, combinações e chances.',
        topics: [
          { id: 'mat-5-1', title: 'Princípio Fundamental da Contagem (PFC)', status: 'nao_iniciado' },
          { id: 'mat-5-2', title: 'Arranjos e Combinações Simples', status: 'nao_iniciado' },
          { id: 'mat-5-3', title: 'Probabilidade Simples e Eventos Sucessivos', status: 'nao_iniciado' },
          { id: 'mat-5-4', title: 'Probabilidade Condicional e Teorema da Multiplicação', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'historia_enem',
    name: 'História',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'his-mod-1',
        title: 'Módulo 1 — Brasil Colônia e Império',
        description: 'Economia açucareira, escravidão, ciclo do ouro e Segundo Reinado.',
        topics: [
          { id: 'his-1-1', title: 'Sociedade Açucareira e Escravidão Indígena e Africana', status: 'nao_iniciado' },
          { id: 'his-1-2', title: 'Ciclo do Ouro e Movimentos Emancipacionistas (Inconfidência Mineira)', status: 'nao_iniciado' },
          { id: 'his-1-3', title: 'Processo de Independência e Primeiro Reinado', status: 'nao_iniciado' },
          { id: 'his-1-4', title: 'Segundo Reinado, Economia Cafeeira e Guerra do Paraguai', status: 'nao_iniciado' },
          { id: 'his-1-5', title: 'Abolição da Escravidão e Proclamação da República', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'his-mod-2',
        title: 'Módulo 2 — Brasil República',
        description: 'República Oligárquica, Era Vargas, Ditadura Militar e Redemocratização.',
        topics: [
          { id: 'his-2-1', title: 'República Velha, Coronelismo e Movimentos Sociais (Canudos, Chibata)', status: 'nao_iniciado' },
          { id: 'his-2-2', title: 'Era Vargas (1930–1945): Trabalhismo, Industrialização e Estado Novo', status: 'nao_iniciado' },
          { id: 'his-2-3', title: 'Período Democrático (JK, Brasília e Populismo)', status: 'nao_iniciado' },
          { id: 'his-2-4', title: 'Ditadura Militar (1964–1985): AI-5, Censura e Milagre Econômico', status: 'nao_iniciado' },
          { id: 'his-2-5', title: 'Redemocratização, Diretas Já e Constituição Cidadã de 1988', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'his-mod-3',
        title: 'Módulo 3 — História Geral e Contemporânea',
        description: 'Antiguidade clássica, Revolução Industrial, Guerras Mundiais e Guerra Fria.',
        topics: [
          { id: 'his-3-1', title: 'Grécia e Roma: Democracia Ateniense e Cidadania Romana', status: 'nao_iniciado' },
          { id: 'his-3-2', title: 'Iluminismo e Revoluções Burguesas (Francesa e Industrial)', status: 'nao_iniciado' },
          { id: 'his-3-3', title: 'Primeira e Segunda Guerras Mundiais e Nazifascismo', status: 'nao_iniciado' },
          { id: 'his-3-4', title: 'Guerra Fria, Descolonização Afro-Asiática e Geopolítica Atual', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'geografia_enem',
    name: 'Geografia',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'geo-mod-1',
        title: 'Módulo 1 — Geografia Física e Meio Ambiente',
        description: 'Clima, relevo, hidrografia e domínios morfoclimáticos.',
        topics: [
          { id: 'geo-1-1', title: 'Domínios Morfoclimáticos do Brasil (Ab\'Sáber)', status: 'nao_iniciado' },
          { id: 'geo-1-2', title: 'Climas do Brasil e Dinâmica de Massas de Ar', status: 'nao_iniciado' },
          { id: 'geo-1-3', title: 'Bacias Hidrográficas e Crise Hídrica', status: 'nao_iniciado' },
          { id: 'geo-1-4', title: 'Estrutura Geológica, Placas Tectônicas e Solos', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'geo-mod-2',
        title: 'Módulo 2 — Geografia Humana e Econômica',
        description: 'Urbanização, agropecuária brasileira, indústria e demografia.',
        topics: [
          { id: 'geo-2-1', title: 'Processo de Urbanização Brasileiro e Problemas Urbanos', status: 'nao_iniciado' },
          { id: 'geo-2-2', title: 'Agronegócio Brasileiro, Conflitos de Terra e Reforma Agrária', status: 'nao_iniciado' },
          { id: 'geo-2-3', title: 'Industrialização Brasileira e Desconcentração Espacial', status: 'nao_iniciado' },
          { id: 'geo-2-4', title: 'Transição Demográfica, Pirâmide Etária e Migrações', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'geo-mod-3',
        title: 'Módulo 3 — Geopolítica e Globalização',
        description: 'Blocos econômicos, nova ordem mundial e energia.',
        topics: [
          { id: 'geo-3-1', title: 'Globalização, Divisão Internacional do Trabalho e Redes', status: 'nao_iniciado' },
          { id: 'geo-3-2', title: 'Matriz Energética: Renováveis vs Combustíveis Fósseis', status: 'nao_iniciado' },
          { id: 'geo-3-3', title: 'Tensões Geopolíticas Globais e Comércio Internacional', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'fisica_enem',
    name: 'Física',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'fis-mod-1',
        title: 'Módulo 1 — Eletricidade e Energia (Top 1 no ENEM)',
        description: 'Circuitos elétricos, potência, consumo de energia e eletrostática.',
        topics: [
          { id: 'fis-1-1', title: 'Corrente Elétrica, Tensão e Resistência (Leis de Ohm)', status: 'nao_iniciado' },
          { id: 'fis-1-2', title: 'Circuitos em Série e Paralelo', status: 'nao_iniciado' },
          { id: 'fis-1-3', title: 'Potência Elétrica e Cálculo de Consumo na Conta de Luz (kWh)', status: 'nao_iniciado' },
          { id: 'fis-1-4', title: 'Dispositivos de Proteção: Fusíveis e Disjuntores', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'fis-mod-2',
        title: 'Módulo 2 — Ondulatória e Óptica',
        description: 'Fenômenos ondulatórios, acústica, lentes e espelhos.',
        topics: [
          { id: 'fis-2-1', title: 'Equação Fundamental da Ondulatória (v = λ · f)', status: 'nao_iniciado' },
          { id: 'fis-2-2', title: 'Fenômenos: Reflexão, Refração, Difração, Polarização e Interferência', status: 'nao_iniciado' },
          { id: 'fis-2-3', title: 'Efeito Doppler e Ondas Sonoras', status: 'nao_iniciado' },
          { id: 'fis-2-4', title: 'Óptica da Visão: Miopia, Hipermetropia e Lentes Corretivas', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'fis-mod-3',
        title: 'Módulo 3 — Mecânica e Energia',
        description: 'Cinemática, Leis de Newton, conservação de energia e trabalho.',
        topics: [
          { id: 'fis-3-1', title: 'Cinemática: Velocidade Média, MRU e MRUV em Gráficos', status: 'nao_iniciado' },
          { id: 'fis-3-2', title: 'Leis de Newton e Forças (Peso, Normal, Atrito, Tração)', status: 'nao_iniciado' },
          { id: 'fis-3-3', title: 'Trabalho, Energia Cinética e Energia Potencial (Conservação de Energia)', status: 'nao_iniciado' },
          { id: 'fis-3-4', title: 'Hidrostática: Princípio de Pascal e Empuxo de Arquimedes', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'fis-mod-4',
        title: 'Módulo 4 — Termologia e Calorimetria',
        description: 'Trocas de calor, calor sensível, latente e máquinas térmicas.',
        topics: [
          { id: 'fis-4-1', title: 'Calor Sensível (Q = m·c·ΔT) e Calor Latente', status: 'nao_iniciado' },
          { id: 'fis-4-2', title: 'Processos de Propagação do Calor: Condução, Convecção e Irradiação', status: 'nao_iniciado' },
          { id: 'fis-4-3', title: 'Primeira e Segunda Leis da Termodinâmica', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'filosofia_sociologia_enem',
    name: 'Filosofia e Sociologia',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'fil-mod-1',
        title: 'Módulo 1 — Filosofia Política e Ética',
        description: 'Pensamento grego, contratualismo moderno e ética do dever.',
        topics: [
          { id: 'fil-1-1', title: 'Sócrates, Platão e o Mito da Caverna', status: 'nao_iniciado' },
          { id: 'fil-1-2', title: 'Aristóteles: Ética a Nicômaco e o Animal Político', status: 'nao_iniciado' },
          { id: 'fil-1-3', title: 'Contratualistas: Thomas Hobbes, John Locke e Rousseau', status: 'nao_iniciado' },
          { id: 'fil-1-4', title: 'Immanuel Kant e o Imperativo Categórico', status: 'nao_iniciado' },
          { id: 'fil-1-5', title: 'Nietzsche, Existencialismo e Modernidade Líquida (Bauman)', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'soc-mod-2',
        title: 'Módulo 2 — Sociologia Clássica e Contemporânea',
        description: 'Pais da sociologia, estratificação social, cidadania e direitos.',
        topics: [
          { id: 'soc-2-1', title: 'Émile Durkheim: Fato Social, Solidariedade e Anomia', status: 'nao_iniciado' },
          { id: 'soc-2-2', title: 'Karl Marx: Luta de Classes, Mais-Valia e Alienação', status: 'nao_iniciado' },
          { id: 'soc-2-3', title: 'Max Weber: Ação Social, Tipos Ideais e Ética Protestante', status: 'nao_iniciado' },
          { id: 'soc-2-4', title: 'Cultura de Massa, Indústria Cultural (Escola de Frankfurt)', status: 'nao_iniciado' },
          { id: 'soc-2-5', title: 'Desigualdades Sociais, Gênero, Raça e Movimentos Sociais', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'redacao_enem',
    name: 'Redação',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'red-mod-1',
        title: 'Módulo 1 — As 5 Competências do ENEM',
        description: 'Critérios oficiais de correção para a nota 1000.',
        topics: [
          { id: 'red-1-1', title: 'Competência 1: Domínio da Norma Padrão Escrita', status: 'nao_iniciado' },
          { id: 'red-1-2', title: 'Competência 2: Compreensão da Proposta e Repertório Sociocultural Legitimado', status: 'nao_iniciado' },
          { id: 'red-1-3', title: 'Competência 3: Projeto de Texto e Argumentação Consistente', status: 'nao_iniciado' },
          { id: 'red-1-4', title: 'Competência 4: Coesão Textual e Uso de Conectivos Diversificados', status: 'nao_iniciado' },
          { id: 'red-1-5', title: 'Competência 5: Elaboração da Proposta de Intervenção Completa (5 Elementos)', status: 'nao_iniciado' }
        ]
      },
      {
        id: 'red-mod-2',
        title: 'Módulo 2 — Estrutura e Prática Dissertativo-Argumentativa',
        description: 'Introdução, desenvolvimento com repertório e proposta de intervenção.',
        topics: [
          { id: 'red-2-1', title: 'Introdução Estratégica: Contextualização, Tese e Antecipação de Argumentos', status: 'nao_iniciado' },
          { id: 'red-2-2', title: 'D1 e D2: Tópico Frasal, Repertório Produtivo e Análise Crítica', status: 'nao_iniciado' },
          { id: 'red-2-3', title: 'Conclusão Nota 1000: Agente, Ação, Meio/Modo, Efeito e Detalhamento', status: 'nao_iniciado' },
          { id: 'red-2-4', title: 'Treinamento de Temas Recorrentes (Sociedade, Tecnologia, Meio Ambiente, Direitos)', status: 'nao_iniciado' }
        ]
      }
    ]
  },
  {
    id: 'estudo_livre_enem',
    name: 'Estudo livre',
    category: 'Preparação ENEM',
    modules: [
      {
        id: 'el-mod-1',
        title: 'Módulo de Sábado — Foco Dinâmico & Flexibilidade',
        description: 'Sessão flexível aos sábados: Revisão, Exercícios, Redação, Simulados ou Conteúdos Atrasados.',
        topics: [
          { id: 'el-1-1', title: 'Revisão Ativa por Flashcards / Resumos Semanais', status: 'nao_iniciado' },
          { id: 'el-1-2', title: 'Resolução de Banco de Exercícios e Questões Anteriores do ENEM', status: 'nao_iniciado' },
          { id: 'el-1-3', title: 'Escrita e Prática de Redação Completa Cronometrada', status: 'nao_iniciado' },
          { id: 'el-1-4', title: 'Simulado de Tempo Real (Dia 1 ou Dia 2)', status: 'nao_iniciado' },
          { id: 'el-1-5', title: 'Colocar em Dia Conteúdos Atrasados da Semana', status: 'nao_iniciado' }
        ]
      }
    ]
  }
];
