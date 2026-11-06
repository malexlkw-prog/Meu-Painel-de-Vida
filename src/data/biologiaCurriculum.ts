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

export const BIOLOGIA_STUDY_PLAN: StudyPlan = {
  id: 'biologia_enem',
  name: 'Biologia',
  category: 'Ciências da Natureza & ENEM',
  modules: [
    {
      id: 'bio-mod-1',
      title: '1. Fundamentos da Biologia',
      description: 'Conceito de vida, método científico, níveis de organização e origem da vida na Terra.',
      topics: [
        { id: 'bio-1-1', title: 'O que é Biologia, áreas de estudo, método científico, hipótese, teoria, experimento e análise de resultados', status: 'nao_iniciado' },
        { id: 'bio-1-2', title: 'Características dos seres vivos', status: 'nao_iniciado' },
        { id: 'bio-1-3', title: 'Níveis de organização biológica: moléculas, células, tecidos, órgãos, sistemas, organismos, populações, comunidades, ecossistemas e biosfera', status: 'nao_iniciado' },
        { id: 'bio-1-4', title: 'Origem da vida: abiogênese, biogênese, experimentos de Redi, Pasteur, Needham e Spallanzani', status: 'nao_iniciado' },
        { id: 'bio-1-5', title: 'Hipóteses sobre a origem da vida: evolução química, Oparin-Haldane, Miller-Urey e panspermia', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-2',
      title: '2. Bioquímica Celular',
      description: 'Composição química da célula: água, sais, carboidratos, lipídios, proteínas, enzimas e ácidos nucleicos.',
      topics: [
        { id: 'bio-2-1', title: 'Água: propriedades, polaridade, solvente, coesão, adesão e importância biológica', status: 'nao_iniciado' },
        { id: 'bio-2-2', title: 'Sais minerais: cálcio, fósforo, ferro, sódio, potássio, magnésio, iodo e outros', status: 'nao_iniciado' },
        { id: 'bio-2-3', title: 'Carboidratos: monossacarídeos, dissacarídeos, polissacarídeos, glicose, sacarose, amido, glicogênio e celulose', status: 'nao_iniciado' },
        { id: 'bio-2-4', title: 'Lipídios: triglicerídeos, fosfolipídios, ceras, esteroides, colesterol e funções', status: 'nao_iniciado' },
        { id: 'bio-2-5', title: 'Proteínas: aminoácidos, ligações peptídicas, estrutura, desnaturação e funções', status: 'nao_iniciado' },
        { id: 'bio-2-6', title: 'Enzimas: funcionamento, especificidade, fatores que alteram a atividade, temperatura, pH e inibidores', status: 'nao_iniciado' },
        { id: 'bio-2-7', title: 'Vitaminas: A, complexo B, C, D, E e K; funções, fontes e carências', status: 'nao_iniciado' },
        { id: 'bio-2-8', title: 'Ácidos nucleicos: DNA, RNA, nucleotídeos e funções', status: 'nao_iniciado' },
        { id: 'bio-2-9', title: 'ATP e metabolismo energético', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-3',
      title: '3. Citologia — Biologia Celular',
      description: 'Morfologia, organelas citoplasmáticas, membranas celulares e diferenciação.',
      topics: [
        { id: 'bio-3-1', title: 'Teoria celular e evolução dos estudos celulares', status: 'nao_iniciado' },
        { id: 'bio-3-2', title: 'Microscopia: microscópio óptico e eletrônico', status: 'nao_iniciado' },
        { id: 'bio-3-3', title: 'Células procariontes e eucariontes', status: 'nao_iniciado' },
        { id: 'bio-3-4', title: 'Células animais e vegetais', status: 'nao_iniciado' },
        { id: 'bio-3-5', title: 'Membrana plasmática: estrutura, modelo mosaico fluido e permeabilidade', status: 'nao_iniciado' },
        { id: 'bio-3-6', title: 'Transportes pela membrana: difusão simples, facilitada, osmose, transporte ativo, bomba de sódio e potássio', status: 'nao_iniciado' },
        { id: 'bio-3-7', title: 'Endocitose: fagocitose e pinocitose', status: 'nao_iniciado' },
        { id: 'bio-3-8', title: 'Exocitose', status: 'nao_iniciado' },
        { id: 'bio-3-9', title: 'Citoplasma e citoesqueleto', status: 'nao_iniciado' },
        { id: 'bio-3-10', title: 'Ribossomos', status: 'nao_iniciado' },
        { id: 'bio-3-11', title: 'Retículo endoplasmático liso e rugoso', status: 'nao_iniciado' },
        { id: 'bio-3-12', title: 'Complexo golgiense', status: 'nao_iniciado' },
        { id: 'bio-3-13', title: 'Lisossomos e peroxissomos', status: 'nao_iniciado' },
        { id: 'bio-3-14', title: 'Mitocôndrias', status: 'nao_iniciado' },
        { id: 'bio-3-15', title: 'Cloroplastos e plastídios', status: 'nao_iniciado' },
        { id: 'bio-3-16', title: 'Vacúolos', status: 'nao_iniciado' },
        { id: 'bio-3-17', title: 'Núcleo, nucléolo e envoltório nuclear', status: 'nao_iniciado' },
        { id: 'bio-3-18', title: 'Parede celular', status: 'nao_iniciado' },
        { id: 'bio-3-19', title: 'Células-tronco e diferenciação celular', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-4',
      title: '4. Metabolismo Energético',
      description: 'Anabolismo, catabolismo, respiração celular, fermentação, fotossíntese e quimiossíntese.',
      topics: [
        { id: 'bio-4-1', title: 'Anabolismo e catabolismo', status: 'nao_iniciado' },
        { id: 'bio-4-2', title: 'Respiração celular: glicólise, ciclo de Krebs e cadeia respiratória', status: 'nao_iniciado' },
        { id: 'bio-4-3', title: 'Fermentação alcoólica e lática', status: 'nao_iniciado' },
        { id: 'bio-4-4', title: 'Fotossíntese: fase clara e ciclo de Calvin', status: 'nao_iniciado' },
        { id: 'bio-4-5', title: 'Quimiossíntese', status: 'nao_iniciado' },
        { id: 'bio-4-6', title: 'Fatores que influenciam a fotossíntese', status: 'nao_iniciado' },
        { id: 'bio-4-7', title: 'Comparação entre respiração, fermentação e fotossíntese', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-5',
      title: '5. Divisão Celular',
      description: 'Ciclo celular, mitose, meiose, variabilidade genética e câncer.',
      topics: [
        { id: 'bio-5-1', title: 'Ciclo celular: intérfase e divisão', status: 'nao_iniciado' },
        { id: 'bio-5-2', title: 'Mitose: fases e importância', status: 'nao_iniciado' },
        { id: 'bio-5-3', title: 'Meiose: fases e importância', status: 'nao_iniciado' },
        { id: 'bio-5-4', title: 'Comparação entre mitose e meiose', status: 'nao_iniciado' },
        { id: 'bio-5-5', title: 'Crossing-over e variabilidade genética', status: 'nao_iniciado' },
        { id: 'bio-5-6', title: 'Controle do ciclo celular', status: 'nao_iniciado' },
        { id: 'bio-5-7', title: 'Câncer e divisão celular descontrolada', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-6',
      title: '6. Genética',
      description: 'Leis mendelianas, heredogramas, alelos múltiplos, linkage, herança sexual e probabilidades.',
      topics: [
        { id: 'bio-6-1', title: 'Conceitos fundamentais: gene, alelo, genótipo, fenótipo, homozigoto, heterozigoto, dominante e recessivo', status: 'nao_iniciado' },
        { id: 'bio-6-2', title: 'Primeira Lei de Mendel', status: 'nao_iniciado' },
        { id: 'bio-6-3', title: 'Segunda Lei de Mendel', status: 'nao_iniciado' },
        { id: 'bio-6-4', title: 'Cruzamentos genéticos e heredogramas', status: 'nao_iniciado' },
        { id: 'bio-6-5', title: 'Dominância completa, incompleta e codominância', status: 'nao_iniciado' },
        { id: 'bio-6-6', title: 'Alelos múltiplos e sistema ABO', status: 'nao_iniciado' },
        { id: 'bio-6-7', title: 'Fator Rh e eritroblastose fetal', status: 'nao_iniciado' },
        { id: 'bio-6-8', title: 'Interação gênica', status: 'nao_iniciado' },
        { id: 'bio-6-9', title: 'Epistasia', status: 'nao_iniciado' },
        { id: 'bio-6-10', title: 'Pleiotropia', status: 'nao_iniciado' },
        { id: 'bio-6-11', title: 'Herança quantitativa', status: 'nao_iniciado' },
        { id: 'bio-6-12', title: 'Genes ligados e linkage', status: 'nao_iniciado' },
        { id: 'bio-6-13', title: 'Permutação e mapas genéticos', status: 'nao_iniciado' },
        { id: 'bio-6-14', title: 'Determinação do sexo', status: 'nao_iniciado' },
        { id: 'bio-6-15', title: 'Herança ligada ao sexo', status: 'nao_iniciado' },
        { id: 'bio-6-16', title: 'Anomalias cromossômicas', status: 'nao_iniciado' },
        { id: 'bio-6-17', title: 'Probabilidade aplicada à genética', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-7',
      title: '7. Biologia Molecular',
      description: 'DNA, transcrição, código genético, tradução, mutações e regulação gênica.',
      topics: [
        { id: 'bio-7-1', title: 'Estrutura e replicação do DNA', status: 'nao_iniciado' },
        { id: 'bio-7-2', title: 'Transcrição e síntese de RNA', status: 'nao_iniciado' },
        { id: 'bio-7-3', title: 'Código genético', status: 'nao_iniciado' },
        { id: 'bio-7-4', title: 'Tradução e síntese de proteínas', status: 'nao_iniciado' },
        { id: 'bio-7-5', title: 'Mutações gênicas e cromossômicas', status: 'nao_iniciado' },
        { id: 'bio-7-6', title: 'Regulação da expressão gênica', status: 'nao_iniciado' },
        { id: 'bio-7-7', title: 'Epigenética: conceitos básicos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-8',
      title: '8. Biotecnologia',
      description: 'Engenharia genética, transgênicos, PCR, clonagem, CRISPR e bioética.',
      topics: [
        { id: 'bio-8-1', title: 'DNA recombinante', status: 'nao_iniciado' },
        { id: 'bio-8-2', title: 'Organismos geneticamente modificados — transgênicos', status: 'nao_iniciado' },
        { id: 'bio-8-3', title: 'Clonagem', status: 'nao_iniciado' },
        { id: 'bio-8-4', title: 'PCR e amplificação de DNA', status: 'nao_iniciado' },
        { id: 'bio-8-5', title: 'Eletroforese', status: 'nao_iniciado' },
        { id: 'bio-8-6', title: 'Sequenciamento genético', status: 'nao_iniciado' },
        { id: 'bio-8-7', title: 'Terapia gênica', status: 'nao_iniciado' },
        { id: 'bio-8-8', title: 'Células-tronco e aplicações', status: 'nao_iniciado' },
        { id: 'bio-8-9', title: 'CRISPR e edição genética', status: 'nao_iniciado' },
        { id: 'bio-8-10', title: 'Testes de DNA, identificação genética e medicina personalizada', status: 'nao_iniciado' },
        { id: 'bio-8-11', title: 'Bioética e impactos sociais da biotecnologia', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-9',
      title: '9. Evolução',
      description: 'Lamarckismo, darwinismo, teoria sintética, especiação e evolução humana.',
      topics: [
        { id: 'bio-9-1', title: 'Ideias evolucionistas e fixismo', status: 'nao_iniciado' },
        { id: 'bio-9-2', title: 'Lamarckismo', status: 'nao_iniciado' },
        { id: 'bio-9-3', title: 'Darwinismo e seleção natural', status: 'nao_iniciado' },
        { id: 'bio-9-4', title: 'Wallace e seleção natural', status: 'nao_iniciado' },
        { id: 'bio-9-5', title: 'Neodarwinismo ou teoria sintética da evolução', status: 'nao_iniciado' },
        { id: 'bio-9-6', title: 'Mutação, recombinação genética e seleção', status: 'nao_iniciado' },
        { id: 'bio-9-7', title: 'Deriva genética e fluxo gênico', status: 'nao_iniciado' },
        { id: 'bio-9-8', title: 'Adaptação e resistência bacteriana', status: 'nao_iniciado' },
        { id: 'bio-9-9', title: 'Evidências evolutivas: fósseis, anatomia, embriologia e genética', status: 'nao_iniciado' },
        { id: 'bio-9-10', title: 'Homologia, analogia e órgãos vestigiais', status: 'nao_iniciado' },
        { id: 'bio-9-11', title: 'Especiação', status: 'nao_iniciado' },
        { id: 'bio-9-12', title: 'Isolamento reprodutivo', status: 'nao_iniciado' },
        { id: 'bio-9-13', title: 'Evolução humana', status: 'nao_iniciado' },
        { id: 'bio-9-14', title: 'Origem e evolução dos primatas', status: 'nao_iniciado' },
        { id: 'bio-9-15', title: 'Seleção artificial', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-10',
      title: '10. Ecologia — Fundamentos',
      description: 'Níveis tróficos, teias alimentares, pirâmides ecológicas, dinâmica de populações e relações ecológicas.',
      topics: [
        { id: 'bio-10-1', title: 'Conceitos de população, comunidade, ecossistema e biosfera', status: 'nao_iniciado' },
        { id: 'bio-10-2', title: 'Habitat e nicho ecológico', status: 'nao_iniciado' },
        { id: 'bio-10-3', title: 'Fatores bióticos e abióticos', status: 'nao_iniciado' },
        { id: 'bio-10-4', title: 'Cadeias e teias alimentares', status: 'nao_iniciado' },
        { id: 'bio-10-5', title: 'Níveis tróficos', status: 'nao_iniciado' },
        { id: 'bio-10-6', title: 'Produtores, consumidores e decompositores', status: 'nao_iniciado' },
        { id: 'bio-10-7', title: 'Fluxo de energia', status: 'nao_iniciado' },
        { id: 'bio-10-8', title: 'Pirâmides ecológicas: energia, biomassa e número', status: 'nao_iniciado' },
        { id: 'bio-10-9', title: 'Relações ecológicas harmônicas e desarmônicas', status: 'nao_iniciado' },
        { id: 'bio-10-10', title: 'Competição, predação, parasitismo, mutualismo, comensalismo e sociedade', status: 'nao_iniciado' },
        { id: 'bio-10-11', title: 'Sucessão ecológica', status: 'nao_iniciado' },
        { id: 'bio-10-12', title: 'Comunidades e equilíbrio ecológico', status: 'nao_iniciado' },
        { id: 'bio-10-13', title: 'Dinâmica populacional', status: 'nao_iniciado' },
        { id: 'bio-10-14', title: 'Capacidade de suporte e crescimento populacional', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-11',
      title: '11. Ciclos Biogeoquímicos',
      description: 'Ciclos da água, carbono, oxigênio, nitrogênio, fósforo, enxofre e impacto ecológico.',
      topics: [
        { id: 'bio-11-1', title: 'Ciclo da água', status: 'nao_iniciado' },
        { id: 'bio-11-2', title: 'Ciclo do carbono', status: 'nao_iniciado' },
        { id: 'bio-11-3', title: 'Ciclo do oxigênio', status: 'nao_iniciado' },
        { id: 'bio-11-4', title: 'Ciclo do nitrogênio', status: 'nao_iniciado' },
        { id: 'bio-11-5', title: 'Ciclo do fósforo', status: 'nao_iniciado' },
        { id: 'bio-11-6', title: 'Ciclo do enxofre', status: 'nao_iniciado' },
        { id: 'bio-11-7', title: 'Relação entre ciclos e impactos ambientais', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-12',
      title: '12. Biomas e Biodiversidade',
      description: 'Biomas mundiais, biomas brasileiros, ecossistemas aquáticos e preservação.',
      topics: [
        { id: 'bio-12-1', title: 'Biomas mundiais: tundra, taiga, florestas temperadas, tropicais, savanas, desertos e campos', status: 'nao_iniciado' },
        { id: 'bio-12-2', title: 'Biomas brasileiros: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa', status: 'nao_iniciado' },
        { id: 'bio-12-3', title: 'Ecossistemas aquáticos: rios, lagos, mares e oceanos', status: 'nao_iniciado' },
        { id: 'bio-12-4', title: 'Manguezais, restingas e recifes de coral', status: 'nao_iniciado' },
        { id: 'bio-12-5', title: 'Biodiversidade e endemismo', status: 'nao_iniciado' },
        { id: 'bio-12-6', title: 'Hotspots de biodiversidade', status: 'nao_iniciado' },
        { id: 'bio-12-7', title: 'Conservação de espécies', status: 'nao_iniciado' },
        { id: 'bio-12-8', title: 'Unidades de conservação', status: 'nao_iniciado' },
        { id: 'bio-12-9', title: 'Espécies invasoras e extinção', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-13',
      title: '13. Impactos Ambientais',
      description: 'Poluição, efeito estufa, chuva ácida, eutrofização, microplásticos e sustentabilidade.',
      topics: [
        { id: 'bio-13-1', title: 'Desmatamento e queimadas', status: 'nao_iniciado' },
        { id: 'bio-13-2', title: 'Aquecimento global e mudanças climáticas', status: 'nao_iniciado' },
        { id: 'bio-13-3', title: 'Efeito estufa e intensificação do efeito estufa', status: 'nao_iniciado' },
        { id: 'bio-13-4', title: 'Destruição da camada de ozônio', status: 'nao_iniciado' },
        { id: 'bio-13-5', title: 'Chuva ácida', status: 'nao_iniciado' },
        { id: 'bio-13-6', title: 'Poluição atmosférica, hídrica e do solo', status: 'nao_iniciado' },
        { id: 'bio-13-7', title: 'Eutrofização', status: 'nao_iniciado' },
        { id: 'bio-13-8', title: 'Bioacumulação e biomagnificação', status: 'nao_iniciado' },
        { id: 'bio-13-9', title: 'Lixo, resíduos sólidos e reciclagem', status: 'nao_iniciado' },
        { id: 'bio-13-10', title: 'Microplásticos', status: 'nao_iniciado' },
        { id: 'bio-13-11', title: 'Agrotóxicos e impactos ambientais', status: 'nao_iniciado' },
        { id: 'bio-13-12', title: 'Saneamento básico', status: 'nao_iniciado' },
        { id: 'bio-13-13', title: 'Crise hídrica', status: 'nao_iniciado' },
        { id: 'bio-13-14', title: 'Desertificação', status: 'nao_iniciado' },
        { id: 'bio-13-15', title: 'Sustentabilidade e desenvolvimento sustentável', status: 'nao_iniciado' },
        { id: 'bio-13-16', title: 'Energias renováveis e impactos', status: 'nao_iniciado' },
        { id: 'bio-13-17', title: 'Problemas ambientais brasileiros e amazônicos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-14',
      title: '14. Microbiologia',
      description: 'Vírus, bactérias, arqueas, protozoários, fungos, biotecnologia e vacinas.',
      topics: [
        { id: 'bio-14-1', title: 'Vírus: estrutura, reprodução e características', status: 'nao_iniciado' },
        { id: 'bio-14-2', title: 'Bactérias: estrutura, reprodução e metabolismo', status: 'nao_iniciado' },
        { id: 'bio-14-3', title: 'Arqueas', status: 'nao_iniciado' },
        { id: 'bio-14-4', title: 'Protozoários', status: 'nao_iniciado' },
        { id: 'bio-14-5', title: 'Fungos: características, reprodução e importância', status: 'nao_iniciado' },
        { id: 'bio-14-6', title: 'Algas e cianobactérias', status: 'nao_iniciado' },
        { id: 'bio-14-7', title: 'Micro-organismos decompositores', status: 'nao_iniciado' },
        { id: 'bio-14-8', title: 'Micro-organismos na indústria, alimentação e saúde', status: 'nao_iniciado' },
        { id: 'bio-14-9', title: 'Antibióticos e resistência bacteriana', status: 'nao_iniciado' },
        { id: 'bio-14-10', title: 'Vacinas e prevenção de doenças', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-15',
      title: '15. Parasitologia e Doenças',
      description: 'Protozooses, helmintoses, viroses, bacterioses e medidas preventivas de saúde pública.',
      topics: [
        { id: 'bio-15-1', title: 'Conceitos de parasita, hospedeiro, vetor e agente etiológico', status: 'nao_iniciado' },
        { id: 'bio-15-2', title: 'Protozooses', status: 'nao_iniciado' },
        { id: 'bio-15-3', title: 'Amebíase', status: 'nao_iniciado' },
        { id: 'bio-15-4', title: 'Giardíase', status: 'nao_iniciado' },
        { id: 'bio-15-5', title: 'Doença de Chagas', status: 'nao_iniciado' },
        { id: 'bio-15-6', title: 'Leishmaniose', status: 'nao_iniciado' },
        { id: 'bio-15-7', title: 'Malária', status: 'nao_iniciado' },
        { id: 'bio-15-8', title: 'Toxoplasmose', status: 'nao_iniciado' },
        { id: 'bio-15-9', title: 'Tricomoníase', status: 'nao_iniciado' },
        { id: 'bio-15-10', title: 'Helmintoses', status: 'nao_iniciado' },
        { id: 'bio-15-11', title: 'Ascaridíase', status: 'nao_iniciado' },
        { id: 'bio-15-12', title: 'Ancilostomose', status: 'nao_iniciado' },
        { id: 'bio-15-13', title: 'Oxiurose', status: 'nao_iniciado' },
        { id: 'bio-15-14', title: 'Teníase e cisticercose', status: 'nao_iniciado' },
        { id: 'bio-15-15', title: 'Esquistossomose', status: 'nao_iniciado' },
        { id: 'bio-15-16', title: 'Filariose', status: 'nao_iniciado' },
        { id: 'bio-15-17', title: 'Doenças virais: dengue, zika, chikungunya, febre amarela, gripe, Covid-19, hepatites e HIV/AIDS', status: 'nao_iniciado' },
        { id: 'bio-15-18', title: 'Doenças bacterianas: tuberculose, cólera, leptospirose, meningite e tétano', status: 'nao_iniciado' },
        { id: 'bio-15-19', title: 'Prevenção, transmissão, saneamento e saúde pública', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-16',
      title: '16. Botânica',
      description: 'Evolução vegetal, briófitas, pteridófitas, gimnospermas, angiospermas, fisiologia e anatomia das plantas.',
      topics: [
        { id: 'bio-16-1', title: 'Características gerais das plantas', status: 'nao_iniciado' },
        { id: 'bio-16-2', title: 'Evolução vegetal', status: 'nao_iniciado' },
        { id: 'bio-16-3', title: 'Briófitas', status: 'nao_iniciado' },
        { id: 'bio-16-4', title: 'Pteridófitas', status: 'nao_iniciado' },
        { id: 'bio-16-5', title: 'Gimnospermas', status: 'nao_iniciado' },
        { id: 'bio-16-6', title: 'Angiospermas', status: 'nao_iniciado' },
        { id: 'bio-16-7', title: 'Comparação entre grupos vegetais', status: 'nao_iniciado' },
        { id: 'bio-16-8', title: 'Tecidos vegetais', status: 'nao_iniciado' },
        { id: 'bio-16-9', title: 'Raiz, caule e folha', status: 'nao_iniciado' },
        { id: 'bio-16-10', title: 'Flor, fruto e semente', status: 'nao_iniciado' },
        { id: 'bio-16-11', title: 'Reprodução vegetal', status: 'nao_iniciado' },
        { id: 'bio-16-12', title: 'Polinização e dispersão', status: 'nao_iniciado' },
        { id: 'bio-16-13', title: 'Hormônios vegetais', status: 'nao_iniciado' },
        { id: 'bio-16-14', title: 'Fototropismo, geotropismo e outros tropismos', status: 'nao_iniciado' },
        { id: 'bio-16-15', title: 'Transporte de seiva: xilema e floema', status: 'nao_iniciado' },
        { id: 'bio-16-16', title: 'Transpiração e estômatos', status: 'nao_iniciado' },
        { id: 'bio-16-17', title: 'Germinação', status: 'nao_iniciado' },
        { id: 'bio-16-18', title: 'Adaptações vegetais', status: 'nao_iniciado' },
        { id: 'bio-16-19', title: 'Plantas medicinais e importância econômica', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-17',
      title: '17. Zoologia',
      description: 'Reino animal, invertebrados, vertebrados, sistemas fisiológicos e adaptações evolutivas.',
      topics: [
        { id: 'bio-17-1', title: 'Características gerais dos animais', status: 'nao_iniciado' },
        { id: 'bio-17-2', title: 'Poríferos', status: 'nao_iniciado' },
        { id: 'bio-17-3', title: 'Cnidários', status: 'nao_iniciado' },
        { id: 'bio-17-4', title: 'Platelmintos', status: 'nao_iniciado' },
        { id: 'bio-17-5', title: 'Nematelmintos', status: 'nao_iniciado' },
        { id: 'bio-17-6', title: 'Anelídeos', status: 'nao_iniciado' },
        { id: 'bio-17-7', title: 'Moluscos', status: 'nao_iniciado' },
        { id: 'bio-17-8', title: 'Artrópodes: insetos, aracnídeos, crustáceos e miriápodes', status: 'nao_iniciado' },
        { id: 'bio-17-9', title: 'Equinodermos', status: 'nao_iniciado' },
        { id: 'bio-17-10', title: 'Cordados', status: 'nao_iniciado' },
        { id: 'bio-17-11', title: 'Peixes cartilaginosos e ósseos', status: 'nao_iniciado' },
        { id: 'bio-17-12', title: 'Anfíbios', status: 'nao_iniciado' },
        { id: 'bio-17-13', title: 'Répteis', status: 'nao_iniciado' },
        { id: 'bio-17-14', title: 'Aves', status: 'nao_iniciado' },
        { id: 'bio-17-15', title: 'Mamíferos', status: 'nao_iniciado' },
        { id: 'bio-17-16', title: 'Comparação dos grupos animais', status: 'nao_iniciado' },
        { id: 'bio-17-17', title: 'Sistemas digestório, respiratório, circulatório e excretor nos animais', status: 'nao_iniciado' },
        { id: 'bio-17-18', title: 'Reprodução e desenvolvimento animal', status: 'nao_iniciado' },
        { id: 'bio-17-19', title: 'Adaptações evolutivas', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-18',
      title: '18. Fisiologia Humana',
      description: 'Sistemas do corpo humano: digestório, cardiovascular, respiratório, imunológico, excretor, nervoso, endócrino e reprodutor.',
      topics: [
        { id: 'bio-18-1', title: 'Organização do corpo humano e homeostase', status: 'nao_iniciado' },
        { id: 'bio-18-2', title: 'Sistema digestório e digestão', status: 'nao_iniciado' },
        { id: 'bio-18-3', title: 'Nutrientes e absorção', status: 'nao_iniciado' },
        { id: 'bio-18-4', title: 'Sistema respiratório', status: 'nao_iniciado' },
        { id: 'bio-18-5', title: 'Trocas gasosas e transporte de oxigênio', status: 'nao_iniciado' },
        { id: 'bio-18-6', title: 'Sistema cardiovascular', status: 'nao_iniciado' },
        { id: 'bio-18-7', title: 'Sangue e componentes sanguíneos', status: 'nao_iniciado' },
        { id: 'bio-18-8', title: 'Sistema linfático', status: 'nao_iniciado' },
        { id: 'bio-18-9', title: 'Sistema imunológico', status: 'nao_iniciado' },
        { id: 'bio-18-10', title: 'Imunidade inata e adaptativa', status: 'nao_iniciado' },
        { id: 'bio-18-11', title: 'Antígenos, anticorpos e memória imunológica', status: 'nao_iniciado' },
        { id: 'bio-18-12', title: 'Vacinação e soros', status: 'nao_iniciado' },
        { id: 'bio-18-13', title: 'Sistema urinário e excreção', status: 'nao_iniciado' },
        { id: 'bio-18-14', title: 'Osmorregulação', status: 'nao_iniciado' },
        { id: 'bio-18-15', title: 'Sistema nervoso', status: 'nao_iniciado' },
        { id: 'bio-18-16', title: 'Neurônios e transmissão de impulsos', status: 'nao_iniciado' },
        { id: 'bio-18-17', title: 'Sistema endócrino e hormônios', status: 'nao_iniciado' },
        { id: 'bio-18-18', title: 'Sistema locomotor: ossos, músculos e articulações', status: 'nao_iniciado' },
        { id: 'bio-18-19', title: 'Sistema tegumentar: pele, pelos e unhas', status: 'nao_iniciado' },
        { id: 'bio-18-20', title: 'Sistema reprodutor masculino e feminino', status: 'nao_iniciado' },
        { id: 'bio-18-21', title: 'Ciclo menstrual e ovulação', status: 'nao_iniciado' },
        { id: 'bio-18-22', title: 'Fecundação, gravidez e desenvolvimento embrionário', status: 'nao_iniciado' },
        { id: 'bio-18-23', title: 'Métodos contraceptivos', status: 'nao_iniciado' },
        { id: 'bio-18-24', title: 'Infecções sexualmente transmissíveis — ISTs', status: 'nao_iniciado' },
        { id: 'bio-18-25', title: 'Genética e saúde humana', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-19',
      title: '19. Histologia',
      description: 'Tecidos epiteliais, conjuntivos, cartilaginoso, ósseo, sanguíneo, muscular e nervoso.',
      topics: [
        { id: 'bio-19-1', title: 'Tecidos epiteliais', status: 'nao_iniciado' },
        { id: 'bio-19-2', title: 'Tecidos conjuntivos', status: 'nao_iniciado' },
        { id: 'bio-19-3', title: 'Tecido adiposo', status: 'nao_iniciado' },
        { id: 'bio-19-4', title: 'Tecido cartilaginoso', status: 'nao_iniciado' },
        { id: 'bio-19-5', title: 'Tecido ósseo', status: 'nao_iniciado' },
        { id: 'bio-19-6', title: 'Tecido sanguíneo', status: 'nao_iniciado' },
        { id: 'bio-19-7', title: 'Tecido muscular', status: 'nao_iniciado' },
        { id: 'bio-19-8', title: 'Tecido nervoso', status: 'nao_iniciado' },
        { id: 'bio-19-9', title: 'Regeneração e especialização celular', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-20',
      title: '20. Embriologia',
      description: 'Gametogênese, fecundação, clivagem, gastrulação, anexos embrionários e desenvolvimento.',
      topics: [
        { id: 'bio-20-1', title: 'Gametogênese', status: 'nao_iniciado' },
        { id: 'bio-20-2', title: 'Espermatogênese e ovogênese', status: 'nao_iniciado' },
        { id: 'bio-20-3', title: 'Fecundação', status: 'nao_iniciado' },
        { id: 'bio-20-4', title: 'Segmentação e clivagem', status: 'nao_iniciado' },
        { id: 'bio-20-5', title: 'Mórula e blástula', status: 'nao_iniciado' },
        { id: 'bio-20-6', title: 'Gastrulação e folhetos embrionários', status: 'nao_iniciado' },
        { id: 'bio-20-7', title: 'Neurulação', status: 'nao_iniciado' },
        { id: 'bio-20-8', title: 'Anexos embrionários', status: 'nao_iniciado' },
        { id: 'bio-20-9', title: 'Desenvolvimento embrionário humano', status: 'nao_iniciado' },
        { id: 'bio-20-10', title: 'Tipos de ovos e desenvolvimento nos animais', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-21',
      title: '21. Sistemática e Classificação Biológica',
      description: 'Taxonomia, regras de nomenclatura, reinos, domínios e filogenia.',
      topics: [
        { id: 'bio-21-1', title: 'Taxonomia e nomenclatura binomial', status: 'nao_iniciado' },
        { id: 'bio-21-2', title: 'Categorias taxonômicas', status: 'nao_iniciado' },
        { id: 'bio-21-3', title: 'Reinos e domínios', status: 'nao_iniciado' },
        { id: 'bio-21-4', title: 'Cladogramas e árvores filogenéticas', status: 'nao_iniciado' },
        { id: 'bio-21-5', title: 'Características usadas na classificação', status: 'nao_iniciado' },
        { id: 'bio-21-6', title: 'Relações evolutivas entre os seres vivos', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-22',
      title: '22. Biologia Aplicada ao ENEM',
      description: 'Interpretação de experimentos, gráficos, interdisciplinaridade, saúde pública e resolução de questões.',
      topics: [
        { id: 'bio-22-1', title: 'Interpretação de gráficos, tabelas e esquemas biológicos', status: 'nao_iniciado' },
        { id: 'bio-22-2', title: 'Leitura de experimentos e resultados científicos', status: 'nao_iniciado' },
        { id: 'bio-22-3', title: 'Questões interdisciplinares com Química, Física e Geografia', status: 'nao_iniciado' },
        { id: 'bio-22-4', title: 'Biologia ambiental e problemas socioambientais', status: 'nao_iniciado' },
        { id: 'bio-22-5', title: 'Biologia, saúde pública e cidadania', status: 'nao_iniciado' },
        { id: 'bio-22-6', title: 'Aplicação de conceitos em situações cotidianas', status: 'nao_iniciado' },
        { id: 'bio-22-7', title: 'Resolução de questões ENEM por assunto', status: 'nao_iniciado' },
        { id: 'bio-22-8', title: 'Simulados e provas anteriores', status: 'nao_iniciado' }
      ]
    },
    {
      id: 'bio-mod-23',
      title: '23. Revisão e Consolidação',
      description: 'Revisão ativa, flashcards, mapas mentais, caderno de erros e simulados completos.',
      topics: [
        { id: 'bio-23-1', title: 'Revisão ativa de cada conteúdo', status: 'nao_iniciado' },
        { id: 'bio-23-2', title: 'Mapas mentais e resumos', status: 'nao_iniciado' },
        { id: 'bio-23-3', title: 'Flashcards de conceitos, ciclos e processos', status: 'nao_iniciado' },
        { id: 'bio-23-4', title: 'Caderno de erros', status: 'nao_iniciado' },
        { id: 'bio-23-5', title: 'Revisão espaçada', status: 'nao_iniciado' },
        { id: 'bio-23-6', title: 'Questões acumuladas por tema', status: 'nao_iniciado' },
        { id: 'bio-23-7', title: 'Simulados completos', status: 'nao_iniciado' },
        { id: 'bio-23-8', title: 'Revisão dos assuntos com maior dificuldade', status: 'nao_iniciado' }
      ]
    }
  ]
};
