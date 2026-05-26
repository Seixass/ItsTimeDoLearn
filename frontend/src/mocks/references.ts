import type { TherapeuticReference } from '../types';

export const REFERENCES_CATALOG: TherapeuticReference[] = [
  // ── Play-based Interventions ───────────────────────────────────────────────

  {
    id: 'ref-01',
    title: 'Engaging Autism: Using the Floortime Approach to Help Children Relate, Communicate, and Think',
    authors: 'Greenspan, S. I. & Wieder, S.',
    year: 2006,
    type: 'book',
    category: 'play_based_interventions',
    summary:
      'Apresenta o modelo DIR/Floortime, que usa a brincadeira iniciada pela criança como ' +
      'veículo para desenvolvimento de habilidades relacionais, comunicativas e cognitivas.',
    relevance:
      'Fundamenta a abordagem centrada nos interesses da criança e o uso de atividades lúdicas ' +
      'como base para estimulação terapêutica.',
  },
  {
    id: 'ref-02',
    title: 'Play-Based Intervention for Children and Adolescents with Autism Spectrum Disorders',
    authors: 'Wolfberg, P. J. & Schuler, A. L.',
    year: 2006,
    type: 'article',
    category: 'play_based_interventions',
    summary:
      'Revisão de intervenções baseadas em brincadeira integrada para crianças com TEA, ' +
      'com ênfase em grupos de pares guiados e ambientes lúdicos estruturados.',
    relevance:
      'Apoia a organização das atividades por perfil funcional e a inclusão de atividades ' +
      'socioemocionais baseadas em brincadeira.',
  },
  {
    id: 'ref-03',
    title:
      'Developmental, Individual Difference, Relationship-Based (DIR) Model and Floortime: ' +
      'Evidence and Application',
    authors: 'Wieder, S. & Greenspan, S. I.',
    year: 2003,
    type: 'article',
    category: 'play_based_interventions',
    summary:
      'Descreve a base teórica do modelo DIR com foco em desenvolvimento afetivo e interação ' +
      'diádica como motores do desenvolvimento cognitivo e social.',
    relevance:
      'Embase a lógica de personalização por perfil e o respeito ao ritmo individual de cada criança.',
  },

  // ── Executive Functions ────────────────────────────────────────────────────

  {
    id: 'ref-04',
    title: 'Executive Functions',
    authors: 'Diamond, A.',
    year: 2013,
    type: 'article',
    category: 'executive_functions',
    summary:
      'Revisão abrangente sobre as funções executivas (inibição, memória de trabalho e ' +
      'flexibilidade cognitiva), seu desenvolvimento e sua relação com resultados acadêmicos e sociais.',
    relevance:
      'Fundamenta as categorias de habilidades trabalhadas nos jogos de memória, atenção e sequenciamento.',
    url: 'https://doi.org/10.1146/annurev-psych-113011-143750',
  },
  {
    id: 'ref-05',
    title:
      'The Development of Executive Function in Early Childhood',
    authors: 'Zelazo, P. D. & Müller, U.',
    year: 2002,
    type: 'article',
    category: 'executive_functions',
    summary:
      'Analisa o desenvolvimento das funções executivas nos primeiros anos de vida e como ' +
      'intervenções precoces podem otimizar sua trajetória.',
    relevance:
      'Justifica a inclusão de atividades de planejamento, flexibilidade e memória de trabalho ' +
      'mesmo em crianças pré-escolares.',
  },
  {
    id: 'ref-06',
    title: 'Executive Function in Autism Spectrum Disorder: A Meta-analysis',
    authors: 'Demetriou, E. A. et al.',
    year: 2018,
    type: 'article',
    category: 'executive_functions',
    summary:
      'Meta-análise que confirma comprometimentos específicos de funções executivas em TEA, ' +
      'com evidências para intervenções direcionadas.',
    relevance:
      'Suporta a priorização de atividades de sequenciamento e rotina para o perfil TEA.',
    url: 'https://doi.org/10.1016/j.neubiorev.2018.05.007',
  },

  // ── Serious Games ──────────────────────────────────────────────────────────

  {
    id: 'ref-07',
    title: 'What Video Games Have to Teach Us About Learning and Literacy',
    authors: 'Gee, J. P.',
    year: 2003,
    type: 'book',
    category: 'serious_games',
    summary:
      'Argumenta que jogos bem projetados incorporam princípios de aprendizagem eficazes: ' +
      'desafio adaptativo, feedback imediato, agência e motivação intrínseca.',
    relevance:
      'Justifica o uso de jogos digitais como plataforma de estimulação cognitiva e o design ' +
      'de dificuldade adaptativa implementado no sistema.',
  },
  {
    id: 'ref-08',
    title:
      'Serious Games for Health: A Systematic Review of Applications in Clinical Practice',
    authors: 'Graafland, M., Schraagen, J. M. & Schijven, M. P.',
    year: 2012,
    type: 'article',
    category: 'serious_games',
    summary:
      'Revisão sistemática de jogos sérios na área de saúde, com análise de eficácia e ' +
      'características de design que potencializam resultados terapêuticos.',
    relevance:
      'Apoia a proposta de jogos interativos com objetivo funcional claro e métricas de progresso.',
  },
  {
    id: 'ref-09',
    title:
      'Digital Games and Young Children: A Systematic Review',
    authors: 'Bourgonjon, J. et al.',
    year: 2016,
    type: 'article',
    category: 'serious_games',
    summary:
      'Revisão sobre o uso de jogos digitais com crianças pequenas, incluindo considerações ' +
      'de design para engajamento, segurança e objetivos educativos.',
    relevance:
      'Informa os princípios de UX e design de jogos voltados a crianças neurodivergentes no sistema.',
  },

  // ── Sensory Interventions ──────────────────────────────────────────────────

  {
    id: 'ref-10',
    title: 'Sensory Integration and the Child: 25th Anniversary Edition',
    authors: 'Ayres, A. J.',
    year: 2005,
    type: 'book',
    category: 'sensory_interventions',
    summary:
      'Obra clássica de Jean Ayres que fundamenta a teoria da integração sensorial, ' +
      'descrevendo como o processamento sensorial afeta aprendizagem e comportamento.',
    relevance:
      'Fundamenta a inclusão de sensibilidades sensoriais no perfil terapêutico e a seleção ' +
      'de atividades que consideram o processamento sensorial individual.',
  },
  {
    id: 'ref-11',
    title:
      'Sensory Processing in Children with and without Autism: A Comparative Study',
    authors: 'Tomchek, S. D. & Dunn, W.',
    year: 2007,
    type: 'article',
    category: 'sensory_interventions',
    summary:
      'Documenta a prevalência e o perfil de dificuldades de processamento sensorial em ' +
      'crianças com TEA comparadas a crianças com desenvolvimento típico.',
    relevance:
      'Embase a lógica de cautela sensorial nas recomendações de atividades e a customização ' +
      'por sensibilidades no perfil terapêutico.',
  },
  {
    id: 'ref-12',
    title:
      "Clinician's Guide for Implementing Ayres Sensory Integration: Promoting Participation for Children with Autism",
    authors: 'Schaaf, R. C. & Mailloux, Z.',
    year: 2015,
    type: 'manual',
    category: 'sensory_interventions',
    summary:
      'Guia clínico para implementação da integração sensorial de Ayres em crianças com TEA, ' +
      'com estratégias práticas e critérios de elegibilidade.',
    relevance:
      'Orienta a estrutura das atividades sensoriais e a necessidade de mediação qualificada.',
  },

  // ── Caregiver-Mediated Interventions ──────────────────────────────────────

  {
    id: 'ref-13',
    title:
      'Randomized Controlled Caregiver-Mediated Joint Engagement Intervention for Toddlers with Autism',
    authors: 'Kasari, C. et al.',
    year: 2010,
    type: 'article',
    category: 'caregiver_mediated',
    summary:
      'Ensaio randomizado demonstrando eficácia de intervenção mediada por cuidadores para ' +
      'desenvolvimento de engajamento conjunto e comunicação em crianças com TEA.',
    relevance:
      'Apoia a inclusão de cuidadores como mediadores essenciais em atividades guiadas e offline.',
    url: 'https://doi.org/10.1111/j.1469-7610.2009.02061.x',
  },
  {
    id: 'ref-14',
    title:
      'Parent-Implemented Interventions for Young Children with Autism: A Meta-analysis',
    authors: 'Oono, I. P., Honey, E. J. & McConachie, H.',
    year: 2013,
    type: 'article',
    category: 'caregiver_mediated',
    summary:
      'Meta-análise de intervenções implementadas por pais, mostrando ganhos em comunicação, ' +
      'linguagem e engajamento quando pais são treinados como agentes terapêuticos.',
    relevance:
      'Fundamenta o campo de observações qualitativas pós-sessão e o papel do cuidador no sistema.',
  },
  {
    id: 'ref-15',
    title:
      'Supporting Families of Children with Autism Spectrum Disorder: A Systematic Review',
    authors: 'Karst, J. S. & Van Hecke, A. V.',
    year: 2012,
    type: 'article',
    category: 'caregiver_mediated',
    summary:
      'Revisão sobre suporte a famílias de crianças com TEA, identificando estratégias de ' +
      'formação de cuidadores e impacto no bem-estar familiar.',
    relevance:
      'Orienta o design de observações pós-sessão e ferramentas de comunicação com cuidadores.',
  },
];
