export interface StudyTopic {
  id: string;
  title: string;
  status: 'concluido' | 'em_andamento' | 'nao_iniciado';
}

export interface StudyPlanModule {
  id: string;
  title: string;
  description?: string;
  topics: StudyTopic[];
}

export interface StudyPlan {
  id: string;
  name: string;
  category?: string;
  modules: StudyPlanModule[];
}

export const QUIMICA_STUDY_PLAN: StudyPlan = {
  id: 'quimica_enem',
  name: 'Química',
  category: 'Ciências da Natureza & ENEM',
  modules: [
    {
      id: 'qui-mod-1',
      title: '1. Fundamentos da Química',
      description: 'Conceito de Química, matéria, energia, propriedades, mudanças de estado físico e classificação de substâncias e misturas.',
      topics: [
        { id: 'qui-1-1', title: 'O que é Química, matéria, energia e transformações', status: 'nao_iniciado' },
        { id: 'qui-1-2', title: 'Método científico e experimentos químicos', status: 'nao_iniciado' },
        { id: 'qui-1-3', title: 'Matéria, corpo e objeto', status: 'nao_iniciado' },
        { id: 'qui-1-4', title: 'Propriedades gerais e específicas da matéria', status: 'nao_iniciado' },
        { id: 'qui-1-5', title: 'Propriedades físicas e químicas', status: 'nao_iniciado' },
        { id: 'qui-1-6', title: 'Estados físicos da matéria: sólido, líquido e gasoso', status: 'nao_iniciado' },
        { id: 'qui-1-7', title: 'Mudanças de estado físico: fusão, solidificação, vaporização, condensação e sublimação', status: 'nao_iniciado' },
        { id: 'qui-1-8', title: 'Fenômenos físicos e químicos', status: 'nao_iniciado' },
        { id: 'qui-1-9', title: 'Substâncias simples e compostas', status: 'nao_iniciado' },
        { id: 'qui-1-10', title: 'Misturas homogêneas e heterogêneas', status: 'nao_iniciado' },
        { id: 'qui-1-11', title: 'Sistemas, fases e componentes', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-2',
      title: '2. Separação de Misturas',
      description: 'Métodos físicos e mecânicos de separação de fases no laboratório, no cotidiano e na indústria.',
      topics: [
        { id: 'qui-2-1', title: 'Filtração simples e a vácuo', status: 'nao_iniciado' },
        { id: 'qui-2-2', title: 'Decantação', status: 'nao_iniciado' },
        { id: 'qui-2-3', title: 'Centrifugação', status: 'nao_iniciado' },
        { id: 'qui-2-4', title: 'Destilação simples e fracionada', status: 'nao_iniciado' },
        { id: 'qui-2-5', title: 'Evaporação e cristalização', status: 'nao_iniciado' },
        { id: 'qui-2-6', title: 'Sublimação', status: 'nao_iniciado' },
        { id: 'qui-2-7', title: 'Catação e peneiração', status: 'nao_iniciado' },
        { id: 'qui-2-8', title: 'Separação magnética', status: 'nao_iniciado' },
        { id: 'qui-2-9', title: 'Flotação', status: 'nao_iniciado' },
        { id: 'qui-2-10', title: 'Extração por solventes', status: 'nao_iniciado' },
        { id: 'qui-2-11', title: 'Cromatografia', status: 'nao_iniciado' },
        { id: 'qui-2-12', title: 'Separação de misturas no cotidiano e na indústria', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-3',
      title: '3. Estrutura Atômica',
      description: 'Modelos atômicos históricos, partículas fundamentais, semelhanças atômicas e distribuição eletrônica de Linus Pauling.',
      topics: [
        { id: 'qui-3-1', title: 'Modelos atômicos: Dalton, Thomson, Rutherford, Bohr e modelo atual', status: 'nao_iniciado' },
        { id: 'qui-3-2', title: 'Partículas subatômicas: prótons, nêutrons e elétrons', status: 'nao_iniciado' },
        { id: 'qui-3-3', title: 'Número atômico e número de massa', status: 'nao_iniciado' },
        { id: 'qui-3-4', title: 'Íons: cátions e ânions', status: 'nao_iniciado' },
        { id: 'qui-3-5', title: 'Isótopos, isóbaros, isótonos e isoeletrônicos', status: 'nao_iniciado' },
        { id: 'qui-3-6', title: 'Distribuição eletrônica', status: 'nao_iniciado' },
        { id: 'qui-3-7', title: 'Camadas e subníveis eletrônicos', status: 'nao_iniciado' },
        { id: 'qui-3-8', title: 'Orbitais e números quânticos — aprofundamento', status: 'nao_iniciado' },
        { id: 'qui-3-9', title: 'Configuração eletrônica e estabilidade', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-4',
      title: '4. Tabela Periódica',
      description: 'Organização periódica, famílias, períodos, classificação dos elementos e propriedades periódicas.',
      topics: [
        { id: 'qui-4-1', title: 'História e organização da tabela periódica', status: 'nao_iniciado' },
        { id: 'qui-4-2', title: 'Famílias, grupos e períodos', status: 'nao_iniciado' },
        { id: 'qui-4-3', title: 'Metais, ametais, semimetais e gases nobres', status: 'nao_iniciado' },
        { id: 'qui-4-4', title: 'Elementos representativos e de transição', status: 'nao_iniciado' },
        { id: 'qui-4-5', title: 'Propriedades periódicas', status: 'nao_iniciado' },
        { id: 'qui-4-6', title: 'Raio atômico e iônico', status: 'nao_iniciado' },
        { id: 'qui-4-7', title: 'Energia de ionização', status: 'nao_iniciado' },
        { id: 'qui-4-8', title: 'Afinidade eletrônica', status: 'nao_iniciado' },
        { id: 'qui-4-9', title: 'Eletronegatividade', status: 'nao_iniciado' },
        { id: 'qui-4-10', title: 'Eletropositividade', status: 'nao_iniciado' },
        { id: 'qui-4-11', title: 'Relação entre configuração eletrônica e posição na tabela', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-5',
      title: '5. Ligações Químicas',
      description: 'Ligação iônica, covalente, metálica, geometria espacial e forças intermoleculares.',
      topics: [
        { id: 'qui-5-1', title: 'Regra do octeto e estabilidade eletrônica', status: 'nao_iniciado' },
        { id: 'qui-5-2', title: 'Ligação iônica', status: 'nao_iniciado' },
        { id: 'qui-5-3', title: 'Ligação covalente', status: 'nao_iniciado' },
        { id: 'qui-5-4', title: 'Ligação metálica', status: 'nao_iniciado' },
        { id: 'qui-5-5', title: 'Representação de Lewis', status: 'nao_iniciado' },
        { id: 'qui-5-6', title: 'Fórmulas químicas: molecular, estrutural e eletrônica', status: 'nao_iniciado' },
        { id: 'qui-5-7', title: 'Polaridade das ligações', status: 'nao_iniciado' },
        { id: 'qui-5-8', title: 'Geometria molecular', status: 'nao_iniciado' },
        { id: 'qui-5-9', title: 'Polaridade das moléculas', status: 'nao_iniciado' },
        { id: 'qui-5-10', title: 'Forças intermoleculares: dipolo-dipolo, London e ligação de hidrogênio', status: 'nao_iniciado' },
        { id: 'qui-5-11', title: 'Propriedades dos compostos e relação com as ligações', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-6',
      title: '6. Funções Inorgânicas',
      description: 'Ácidos, bases, sais, óxidos, teorias ácido-base de Arrhenius e aplicações cotidianas.',
      topics: [
        { id: 'qui-6-1', title: 'Ácidos: conceito, classificação, nomenclatura e propriedades', status: 'nao_iniciado' },
        { id: 'qui-6-2', title: 'Bases: conceito, classificação, nomenclatura e propriedades', status: 'nao_iniciado' },
        { id: 'qui-6-3', title: 'Sais: formação, classificação, nomenclatura e propriedades', status: 'nao_iniciado' },
        { id: 'qui-6-4', title: 'Óxidos: classificação, nomenclatura e propriedades', status: 'nao_iniciado' },
        { id: 'qui-6-5', title: 'Indicadores ácido-base', status: 'nao_iniciado' },
        { id: 'qui-6-6', title: 'pH e pOH', status: 'nao_iniciado' },
        { id: 'qui-6-7', title: 'Neutralização', status: 'nao_iniciado' },
        { id: 'qui-6-8', title: 'Chuva ácida e óxidos ambientais', status: 'nao_iniciado' },
        { id: 'qui-6-9', title: 'Aplicações das funções inorgânicas no cotidiano', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-7',
      title: '7. Reações Químicas',
      description: 'Equações, balanceamento, leis ponderais de Lavoisier e Proust, reações de síntese, análise e oxirredução.',
      topics: [
        { id: 'qui-7-1', title: 'Representação de reações por equações químicas', status: 'nao_iniciado' },
        { id: 'qui-7-2', title: 'Reagentes e produtos', status: 'nao_iniciado' },
        { id: 'qui-7-3', title: 'Balanceamento de equações', status: 'nao_iniciado' },
        { id: 'qui-7-4', title: 'Lei da conservação das massas', status: 'nao_iniciado' },
        { id: 'qui-7-5', title: 'Lei das proporções definidas', status: 'nao_iniciado' },
        { id: 'qui-7-6', title: 'Tipos de reações: síntese, decomposição, simples troca e dupla troca', status: 'nao_iniciado' },
        { id: 'qui-7-7', title: 'Combustão', status: 'nao_iniciado' },
        { id: 'qui-7-8', title: 'Reações de precipitação', status: 'nao_iniciado' },
        { id: 'qui-7-9', title: 'Reações ácido-base', status: 'nao_iniciado' },
        { id: 'qui-7-10', title: 'Reações de oxidação e redução', status: 'nao_iniciado' },
        { id: 'qui-7-11', title: 'Identificação de evidências de reações químicas', status: 'nao_iniciado' },
        { id: 'qui-7-12', title: 'Reações químicas no cotidiano e na indústria', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-8',
      title: '8. Cálculos Químicos e Estequiometria',
      description: 'Mol, constante de Avogadro, massa molar, rendimento, pureza e reagente limitante.',
      topics: [
        { id: 'qui-8-1', title: 'Unidades de massa e volume', status: 'nao_iniciado' },
        { id: 'qui-8-2', title: 'Massa atômica e massa molecular', status: 'nao_iniciado' },
        { id: 'qui-8-3', title: 'Mol e quantidade de matéria', status: 'nao_iniciado' },
        { id: 'qui-8-4', title: 'Constante de Avogadro', status: 'nao_iniciado' },
        { id: 'qui-8-5', title: 'Massa molar', status: 'nao_iniciado' },
        { id: 'qui-8-6', title: 'Conversão entre massa, mol e partículas', status: 'nao_iniciado' },
        { id: 'qui-8-7', title: 'Volume molar dos gases', status: 'nao_iniciado' },
        { id: 'qui-8-8', title: 'Cálculos estequiométricos', status: 'nao_iniciado' },
        { id: 'qui-8-9', title: 'Proporções entre reagentes e produtos', status: 'nao_iniciado' },
        { id: 'qui-8-10', title: 'Reagente limitante e reagente em excesso', status: 'nao_iniciado' },
        { id: 'qui-8-11', title: 'Rendimento de uma reação', status: 'nao_iniciado' },
        { id: 'qui-8-12', title: 'Pureza de reagentes', status: 'nao_iniciado' },
        { id: 'qui-8-13', title: 'Estequiometria envolvendo gases e soluções', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-9',
      title: '9. Gases',
      description: 'Propriedades dos gases, leis de Boyle e Charles, equação de Clapeyron e misturas gasosas.',
      topics: [
        { id: 'qui-9-1', title: 'Características e propriedades dos gases', status: 'nao_iniciado' },
        { id: 'qui-9-2', title: 'Pressão, volume e temperatura', status: 'nao_iniciado' },
        { id: 'qui-9-3', title: 'Transformações isotérmica, isobárica e isovolumétrica', status: 'nao_iniciado' },
        { id: 'qui-9-4', title: 'Leis de Boyle, Charles e Gay-Lussac', status: 'nao_iniciado' },
        { id: 'qui-9-5', title: 'Equação geral dos gases', status: 'nao_iniciado' },
        { id: 'qui-9-6', title: 'Equação dos gases ideais', status: 'nao_iniciado' },
        { id: 'qui-9-7', title: 'Volume molar', status: 'nao_iniciado' },
        { id: 'qui-9-8', title: 'Misturas gasosas e pressão parcial', status: 'nao_iniciado' },
        { id: 'qui-9-9', title: 'Densidade dos gases', status: 'nao_iniciado' },
        { id: 'qui-9-10', title: 'Gases no cotidiano e impactos ambientais', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-10',
      title: '10. Soluções',
      description: 'Solubilidade, concentração comum, molaridade, título, partes por milhão, diluição e titulação.',
      topics: [
        { id: 'qui-10-1', title: 'Soluto, solvente e solução', status: 'nao_iniciado' },
        { id: 'qui-10-2', title: 'Classificação das soluções', status: 'nao_iniciado' },
        { id: 'qui-10-3', title: 'Solubilidade', status: 'nao_iniciado' },
        { id: 'qui-10-4', title: 'Curvas de solubilidade', status: 'nao_iniciado' },
        { id: 'qui-10-5', title: 'Soluções saturadas, insaturadas e supersaturadas', status: 'nao_iniciado' },
        { id: 'qui-10-6', title: 'Concentração comum', status: 'nao_iniciado' },
        { id: 'qui-10-7', title: 'Concentração molar ou molaridade', status: 'nao_iniciado' },
        { id: 'qui-10-8', title: 'Título em massa e porcentagem', status: 'nao_iniciado' },
        { id: 'qui-10-9', title: 'Partes por milhão — ppm', status: 'nao_iniciado' },
        { id: 'qui-10-10', title: 'Diluição de soluções', status: 'nao_iniciado' },
        { id: 'qui-10-11', title: 'Mistura de soluções', status: 'nao_iniciado' },
        { id: 'qui-10-12', title: 'Titulação', status: 'nao_iniciado' },
        { id: 'qui-10-13', title: 'Soluções no cotidiano: medicamentos, alimentos e produtos de limpeza', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-11',
      title: '11. Termoquímica',
      description: 'Entalpia, processos endotérmicos e exotérmicos, Lei de Hess, energia de ligação e combustíveis.',
      topics: [
        { id: 'qui-11-1', title: 'Energia nas reações químicas', status: 'nao_iniciado' },
        { id: 'qui-11-2', title: 'Calor e temperatura', status: 'nao_iniciado' },
        { id: 'qui-11-3', title: 'Reações endotérmicas e exotérmicas', status: 'nao_iniciado' },
        { id: 'qui-11-4', title: 'Entalpia', status: 'nao_iniciado' },
        { id: 'qui-11-5', title: 'Variação de entalpia', status: 'nao_iniciado' },
        { id: 'qui-11-6', title: 'Diagramas de energia', status: 'nao_iniciado' },
        { id: 'qui-11-7', title: 'Equações termoquímicas', status: 'nao_iniciado' },
        { id: 'qui-11-8', title: 'Calor de formação', status: 'nao_iniciado' },
        { id: 'qui-11-9', title: 'Calor de combustão', status: 'nao_iniciado' },
        { id: 'qui-11-10', title: 'Lei de Hess', status: 'nao_iniciado' },
        { id: 'qui-11-11', title: 'Energia de ligação', status: 'nao_iniciado' },
        { id: 'qui-11-12', title: 'Calorimetria', status: 'nao_iniciado' },
        { id: 'qui-11-13', title: 'Combustíveis e eficiência energética', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-12',
      title: '12. Cinética Química',
      description: 'Velocidade de reação, teoria das colisões, energia de ativação, complexo ativado e catalisadores.',
      topics: [
        { id: 'qui-12-1', title: 'Velocidade das reações', status: 'nao_iniciado' },
        { id: 'qui-12-2', title: 'Teoria das colisões', status: 'nao_iniciado' },
        { id: 'qui-12-3', title: 'Energia de ativação', status: 'nao_iniciado' },
        { id: 'qui-12-4', title: 'Complexo ativado', status: 'nao_iniciado' },
        { id: 'qui-12-5', title: 'Fatores que influenciam a velocidade: temperatura, concentração, pressão, superfície de contato e catalisadores', status: 'nao_iniciado' },
        { id: 'qui-12-6', title: 'Catalisadores e inibidores', status: 'nao_iniciado' },
        { id: 'qui-12-7', title: 'Gráficos de velocidade das reações', status: 'nao_iniciado' },
        { id: 'qui-12-8', title: 'Cinética química no cotidiano e na indústria', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-13',
      title: '13. Equilíbrio Químico',
      description: 'Constantes Kc e Kp, princípio de Le Chatelier, equilíbrio iônico, pH, pOH e soluções tampão.',
      topics: [
        { id: 'qui-13-1', title: 'Reações reversíveis', status: 'nao_iniciado' },
        { id: 'qui-13-2', title: 'Equilíbrio químico dinâmico', status: 'nao_iniciado' },
        { id: 'qui-13-3', title: 'Constante de equilíbrio', status: 'nao_iniciado' },
        { id: 'qui-13-4', title: 'Equilíbrio homogêneo e heterogêneo', status: 'nao_iniciado' },
        { id: 'qui-13-5', title: 'Princípio de Le Chatelier', status: 'nao_iniciado' },
        { id: 'qui-13-6', title: 'Influência da concentração, pressão e temperatura', status: 'nao_iniciado' },
        { id: 'qui-13-7', title: 'Equilíbrio envolvendo gases', status: 'nao_iniciado' },
        { id: 'qui-13-8', title: 'Equilíbrio iônico', status: 'nao_iniciado' },
        { id: 'qui-13-9', title: 'Ionização e dissociação', status: 'nao_iniciado' },
        { id: 'qui-13-10', title: 'Equilíbrio ácido-base', status: 'nao_iniciado' },
        { id: 'qui-13-11', title: 'Produto iônico da água', status: 'nao_iniciado' },
        { id: 'qui-13-12', title: 'pH e pOH em cálculos', status: 'nao_iniciado' },
        { id: 'qui-13-13', title: 'Soluções tampão — aprofundamento', status: 'nao_iniciado' },
        { id: 'qui-13-14', title: 'Hidrólise salina', status: 'nao_iniciado' },
        { id: 'qui-13-15', title: 'Produto de solubilidade — Kps', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-14',
      title: '14. Eletroquímica',
      description: 'Oxirredução, NOX, pilhas galvânicas, baterias, eletrólise e proteção contra corrosão.',
      topics: [
        { id: 'qui-14-1', title: 'Oxidação e redução', status: 'nao_iniciado' },
        { id: 'qui-14-2', title: 'Número de oxidação — NOX', status: 'nao_iniciado' },
        { id: 'qui-14-3', title: 'Agentes oxidantes e redutores', status: 'nao_iniciado' },
        { id: 'qui-14-4', title: 'Balanceamento de reações redox', status: 'nao_iniciado' },
        { id: 'qui-14-5', title: 'Pilhas e células eletroquímicas', status: 'nao_iniciado' },
        { id: 'qui-14-6', title: 'Ânodo e cátodo', status: 'nao_iniciado' },
        { id: 'qui-14-7', title: 'Potencial elétrico e força eletromotriz', status: 'nao_iniciado' },
        { id: 'qui-14-8', title: 'Baterias e acumuladores', status: 'nao_iniciado' },
        { id: 'qui-14-9', title: 'Eletrólise ígnea e aquosa', status: 'nao_iniciado' },
        { id: 'qui-14-10', title: 'Leis de Faraday', status: 'nao_iniciado' },
        { id: 'qui-14-11', title: 'Corrosão e proteção de metais', status: 'nao_iniciado' },
        { id: 'qui-14-12', title: 'Eletroquímica no cotidiano e na indústria', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-15',
      title: '15. Radioatividade e Química Nuclear',
      description: 'Emissões nucleares alfa, beta e gama, meia-vida, fissão, fusão e radioproteção.',
      topics: [
        { id: 'qui-15-1', title: 'Estrutura e estabilidade do núcleo', status: 'nao_iniciado' },
        { id: 'qui-15-2', title: 'Radioatividade natural e artificial', status: 'nao_iniciado' },
        { id: 'qui-15-3', title: 'Emissões alfa, beta e gama', status: 'nao_iniciado' },
        { id: 'qui-15-4', title: 'Equações nucleares', status: 'nao_iniciado' },
        { id: 'qui-15-5', title: 'Meia-vida', status: 'nao_iniciado' },
        { id: 'qui-15-6', title: 'Fissão nuclear', status: 'nao_iniciado' },
        { id: 'qui-15-7', title: 'Fusão nuclear', status: 'nao_iniciado' },
        { id: 'qui-15-8', title: 'Energia nuclear', status: 'nao_iniciado' },
        { id: 'qui-15-9', title: 'Aplicações médicas e industriais', status: 'nao_iniciado' },
        { id: 'qui-15-10', title: 'Acidentes nucleares e impactos ambientais', status: 'nao_iniciado' },
        { id: 'qui-15-11', title: 'Radioproteção e descarte de resíduos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-16',
      title: '16. Química Orgânica — Fundamentos',
      description: 'Características do carbono, postulados de Kekulé, hibridização, classificação de cadeias e fórmulas.',
      topics: [
        { id: 'qui-16-1', title: 'Características do carbono', status: 'nao_iniciado' },
        { id: 'qui-16-2', title: 'Ligações do carbono', status: 'nao_iniciado' },
        { id: 'qui-16-3', title: 'Cadeias carbônicas', status: 'nao_iniciado' },
        { id: 'qui-16-4', title: 'Classificação das cadeias', status: 'nao_iniciado' },
        { id: 'qui-16-5', title: 'Representações de moléculas orgânicas', status: 'nao_iniciado' },
        { id: 'qui-16-6', title: 'Fórmulas molecular, estrutural e condensada', status: 'nao_iniciado' },
        { id: 'qui-16-7', title: 'Hibridização do carbono — aprofundamento', status: 'nao_iniciado' },
        { id: 'qui-16-8', title: 'Nomenclatura orgânica', status: 'nao_iniciado' },
        { id: 'qui-16-9', title: 'Radicais orgânicos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-17',
      title: '17. Funções Orgânicas',
      description: 'Hidrocarbonetos, álcoois, fenóis, éteres, aldeídos, cetonas, ácidos, ésteres, aminas, amidas e haletos.',
      topics: [
        { id: 'qui-17-1', title: 'Hidrocarbonetos: alcanos, alcenos, alcinos e alcadienos', status: 'nao_iniciado' },
        { id: 'qui-17-2', title: 'Hidrocarbonetos aromáticos', status: 'nao_iniciado' },
        { id: 'qui-17-3', title: 'Álcoois', status: 'nao_iniciado' },
        { id: 'qui-17-4', title: 'Fenóis', status: 'nao_iniciado' },
        { id: 'qui-17-5', title: 'Éteres', status: 'nao_iniciado' },
        { id: 'qui-17-6', title: 'Aldeídos', status: 'nao_iniciado' },
        { id: 'qui-17-7', title: 'Cetonas', status: 'nao_iniciado' },
        { id: 'qui-17-8', title: 'Ácidos carboxílicos', status: 'nao_iniciado' },
        { id: 'qui-17-9', title: 'Ésteres', status: 'nao_iniciado' },
        { id: 'qui-17-10', title: 'Aminas', status: 'nao_iniciado' },
        { id: 'qui-17-11', title: 'Amidas', status: 'nao_iniciado' },
        { id: 'qui-17-12', title: 'Haletos orgânicos', status: 'nao_iniciado' },
        { id: 'qui-17-13', title: 'Nitrilas e nitrocompostos', status: 'nao_iniciado' },
        { id: 'qui-17-14', title: 'Nomenclatura e propriedades das funções orgânicas', status: 'nao_iniciado' },
        { id: 'qui-17-15', title: 'Aplicações das funções orgânicas no cotidiano', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-18',
      title: '18. Isomeria',
      description: 'Isomeria plana (função, cadeia, posição, compensação, tautomeria) e espacial (geométrica e óptica).',
      topics: [
        { id: 'qui-18-1', title: 'Isomeria plana: cadeia, posição, função, compensação e tautomeria', status: 'nao_iniciado' },
        { id: 'qui-18-2', title: 'Isomeria geométrica: cis-trans e E-Z', status: 'nao_iniciado' },
        { id: 'qui-18-3', title: 'Isomeria óptica', status: 'nao_iniciado' },
        { id: 'qui-18-4', title: 'Carbono quiral', status: 'nao_iniciado' },
        { id: 'qui-18-5', title: 'Enantiômeros e diastereoisômeros', status: 'nao_iniciado' },
        { id: 'qui-18-6', title: 'Isomeria e atividade biológica', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-19',
      title: '19. Reações Orgânicas',
      description: 'Reações de adição, substituição, eliminação, esterificação, saponificação, oxirredução e polimerização.',
      topics: [
        { id: 'qui-19-1', title: 'Reações de adição', status: 'nao_iniciado' },
        { id: 'qui-19-2', title: 'Reações de substituição', status: 'nao_iniciado' },
        { id: 'qui-19-3', title: 'Reações de eliminação', status: 'nao_iniciado' },
        { id: 'qui-19-4', title: 'Oxidação de compostos orgânicos', status: 'nao_iniciado' },
        { id: 'qui-19-5', title: 'Redução de compostos orgânicos', status: 'nao_iniciado' },
        { id: 'qui-19-6', title: 'Esterificação', status: 'nao_iniciado' },
        { id: 'qui-19-7', title: 'Hidrólise', status: 'nao_iniciado' },
        { id: 'qui-19-8', title: 'Saponificação', status: 'nao_iniciado' },
        { id: 'qui-19-9', title: 'Polimerização', status: 'nao_iniciado' },
        { id: 'qui-19-10', title: 'Reações de combustão', status: 'nao_iniciado' },
        { id: 'qui-19-11', title: 'Reações orgânicas no cotidiano e na indústria', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-20',
      title: '20. Polímeros e Materiais',
      description: 'Polímeros de adição e condensação, plásticos, borrachas, fibras, bioplásticos e reciclagem.',
      topics: [
        { id: 'qui-20-1', title: 'Polímeros naturais e sintéticos', status: 'nao_iniciado' },
        { id: 'qui-20-2', title: 'Polimerização por adição e condensação', status: 'nao_iniciado' },
        { id: 'qui-20-3', title: 'Plásticos e tipos de polímeros', status: 'nao_iniciado' },
        { id: 'qui-20-4', title: 'Borracha natural e sintética', status: 'nao_iniciado' },
        { id: 'qui-20-5', title: 'Fibras e tecidos', status: 'nao_iniciado' },
        { id: 'qui-20-6', title: 'Bioplásticos', status: 'nao_iniciado' },
        { id: 'qui-20-7', title: 'Reciclagem de polímeros', status: 'nao_iniciado' },
        { id: 'qui-20-8', title: 'Impactos ambientais dos plásticos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-21',
      title: '21. Química Ambiental',
      description: 'Poluição do ar, água e solo, efeito estufa, chuva ácida, tratamento de efluentes, combustíveis e química verde.',
      topics: [
        { id: 'qui-21-1', title: 'Poluição atmosférica', status: 'nao_iniciado' },
        { id: 'qui-21-2', title: 'Poluição da água e do solo', status: 'nao_iniciado' },
        { id: 'qui-21-3', title: 'Efeito estufa e aquecimento global', status: 'nao_iniciado' },
        { id: 'qui-21-4', title: 'Chuva ácida', status: 'nao_iniciado' },
        { id: 'qui-21-5', title: 'Camada de ozônio', status: 'nao_iniciado' },
        { id: 'qui-21-6', title: 'Tratamento de água', status: 'nao_iniciado' },
        { id: 'qui-21-7', title: 'Tratamento de esgoto', status: 'nao_iniciado' },
        { id: 'qui-21-8', title: 'Contaminantes e metais pesados', status: 'nao_iniciado' },
        { id: 'qui-21-9', title: 'Agrotóxicos', status: 'nao_iniciado' },
        { id: 'qui-21-10', title: 'Combustíveis fósseis e biocombustíveis', status: 'nao_iniciado' },
        { id: 'qui-21-11', title: 'Química verde', status: 'nao_iniciado' },
        { id: 'qui-21-12', title: 'Descarte correto de resíduos', status: 'nao_iniciado' },
        { id: 'qui-21-13', title: 'Química ambiental na Amazônia', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-22',
      title: '22. Química do Cotidiano e Indústria',
      description: 'Química de alimentos, cosméticos, sabões, tensoativos, medicamentos, petróleo e materiais de construção.',
      topics: [
        { id: 'qui-22-1', title: 'Química dos alimentos', status: 'nao_iniciado' },
        { id: 'qui-22-2', title: 'Conservantes, corantes e aditivos', status: 'nao_iniciado' },
        { id: 'qui-22-3', title: 'Fermentação e produção de alimentos', status: 'nao_iniciado' },
        { id: 'qui-22-4', title: 'Sabões e detergentes', status: 'nao_iniciado' },
        { id: 'qui-22-5', title: 'Cosméticos e produtos de higiene', status: 'nao_iniciado' },
        { id: 'qui-22-6', title: 'Medicamentos e princípios ativos', status: 'nao_iniciado' },
        { id: 'qui-22-7', title: 'Combustíveis: gasolina, diesel, etanol e biodiesel', status: 'nao_iniciado' },
        { id: 'qui-22-8', title: 'Petróleo: extração, refino e derivados', status: 'nao_iniciado' },
        { id: 'qui-22-9', title: 'Mineração e metalurgia', status: 'nao_iniciado' },
        { id: 'qui-22-10', title: 'Produção de fertilizantes', status: 'nao_iniciado' },
        { id: 'qui-22-11', title: 'Materiais de construção: cimento, vidro e cerâmica', status: 'nao_iniciado' },
        { id: 'qui-22-12', title: 'Química e tecnologias industriais', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-23',
      title: '23. Química Aplicada ao ENEM',
      description: 'Interpretação de gráficos e tabelas, leitura de rótulos, cálculos contextualizados e interdisciplinaridade.',
      topics: [
        { id: 'qui-23-1', title: 'Interpretação de gráficos, tabelas e experimentos', status: 'nao_iniciado' },
        { id: 'qui-23-2', title: 'Leitura de rótulos e informações químicas', status: 'nao_iniciado' },
        { id: 'qui-23-3', title: 'Cálculos contextualizados', status: 'nao_iniciado' },
        { id: 'qui-23-4', title: 'Questões interdisciplinares com Física, Biologia e Geografia', status: 'nao_iniciado' },
        { id: 'qui-23-5', title: 'Química ambiental e sustentabilidade', status: 'nao_iniciado' },
        { id: 'qui-23-6', title: 'Química em situações do cotidiano', status: 'nao_iniciado' },
        { id: 'qui-23-7', title: 'Resolução de questões ENEM por assunto', status: 'nao_iniciado' },
        { id: 'qui-23-8', title: 'Simulados e provas anteriores', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'qui-mod-24',
      title: '24. Revisão e Consolidação',
      description: 'Revisão ativa, flashcards de fórmulas e reações, mapas mentais, caderno de erros e simulados.',
      topics: [
        { id: 'qui-24-1', title: 'Revisão ativa de cada conteúdo', status: 'nao_iniciado' },
        { id: 'qui-24-2', title: 'Mapas mentais e resumos', status: 'nao_iniciado' },
        { id: 'qui-24-3', title: 'Flashcards de fórmulas, conceitos e reações', status: 'nao_iniciado' },
        { id: 'qui-24-4', title: 'Caderno de erros', status: 'nao_iniciado' },
        { id: 'qui-24-5', title: 'Revisão espaçada', status: 'nao_iniciado' },
        { id: 'qui-24-6', title: 'Questões acumuladas por tema', status: 'nao_iniciado' },
        { id: 'qui-24-7', title: 'Simulados completos', status: 'nao_iniciado' },
        { id: 'qui-24-8', title: 'Revisão dos assuntos com maior dificuldade', status: 'nao_iniciado' }
      ]
    }
  ]
};
