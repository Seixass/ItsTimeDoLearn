import React, { useState } from 'react';
import { REFERENCES_CATALOG } from '../mocks';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import type { ReferenceCategory, TherapeuticReference } from '../types';

const CATEGORY_CONFIG: Record<
  ReferenceCategory,
  { label: string; emoji: string; description: string }
> = {
  play_based_interventions: {
    label: 'Intervenções Baseadas em Brincadeira',
    emoji: '🎮',
    description:
      'Abordagens que utilizam o jogo e a brincadeira como veículos primários de intervenção terapêutica.',
  },
  executive_functions: {
    label: 'Funções Executivas',
    emoji: '🧠',
    description:
      'Estudos sobre planejamento, memória de trabalho, inibição e flexibilidade cognitiva.',
  },
  serious_games: {
    label: 'Serious Games e Tecnologia',
    emoji: '💻',
    description:
      'Pesquisas sobre jogos digitais com propósito educacional, clínico ou terapêutico.',
  },
  sensory_interventions: {
    label: 'Regulação Sensorial',
    emoji: '🌿',
    description:
      'Teoria da integração sensorial e intervenções para processamento sensorial atípico.',
  },
  caregiver_mediated: {
    label: 'Intervenções Mediadas por Cuidadores',
    emoji: '🤝',
    description:
      'Evidências sobre o papel de pais e cuidadores como agentes terapêuticos.',
  },
};

const PRINCIPLES = [
  {
    emoji: '🎯',
    title: 'Personalização por Perfil Funcional',
    body: 'Cada criança tem um perfil único de forças, dificuldades e interesses. As atividades são selecionadas com base nesse perfil, não em diagnósticos genéricos.',
  },
  {
    emoji: '🎮',
    title: 'Brincadeira como Veículo Terapêutico',
    body: 'Atividades lúdicas criam contextos de alta motivação onde habilidades cognitivas, emocionais e sociais são exercitadas de forma natural e significativa.',
  },
  {
    emoji: '📅',
    title: 'Estrutura, Previsibilidade e Rotina',
    body: 'Rotinas previsíveis reduzem a ansiedade e liberam recursos cognitivos para aprendizagem. O sistema organiza sessões e planos semanais para apoiar essa estrutura.',
  },
  {
    emoji: '🌿',
    title: 'Respeito à Regulação Sensorial',
    body: 'Sensibilidades sensoriais são consideradas na seleção e adaptação de atividades, evitando sobrecarga e promovendo engajamento seguro.',
  },
  {
    emoji: '🤝',
    title: 'Cuidador como Parceiro Terapêutico',
    body: 'Cuidadores e terapeutas são co-agentes do processo. O sistema oferece ferramentas de observação, registro e planejamento para apoiar essa parceria.',
  },
];

const TYPE_LABELS: Record<string, string> = {
  article: 'Artigo',
  book: 'Livro',
  guideline: 'Diretriz',
  manual: 'Manual',
};

function ReferenceCard({ ref: r }: { ref: TherapeuticReference }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ref-card">
      <div className="ref-card-header">
        <div className="ref-card-meta">
          <span className="ref-type-badge">{TYPE_LABELS[r.type]}</span>
          <span className="ref-year">{r.year}</span>
        </div>
        <button
          className="ref-expand-btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      <h4 className="ref-title">{r.title}</h4>
      <p className="ref-authors">{r.authors}</p>

      {expanded && (
        <div className="ref-details">
          <p className="ref-summary">{r.summary}</p>
          <p className="ref-relevance">
            <strong>Relevância para o sistema:</strong> {r.relevance}
          </p>
          {r.url && (
            <a
              href={r.url}
              className="ref-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar publicação →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export const ReferencesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<ReferenceCategory>('play_based_interventions');

  const filteredRefs = REFERENCES_CATALOG.filter(
    (r) => r.category === activeCategory
  );

  return (
    <div className="page page--references">
      <PageHeader
        title="Referências e Fundamentação"
        subtitle="Base teórica e científica do ItsTimeDoLearn"
        backTo="/"
      />

      {/* ── Intro ── */}
      <Card className="ref-intro-card">
        <div className="ref-intro-content">
          <p className="ref-intro-text">
            O <strong>ItsTimeDoLearn</strong> foi concebido como uma plataforma de apoio
            à estimulação cognitiva de crianças neurodivergentes — especialmente com perfis
            relacionados a TEA e TDAH. Seu design é inspirado em evidências das áreas de
            brincadeira terapêutica, funções executivas, serious games, regulação sensorial
            e intervenções mediadas por cuidadores.
          </p>
          <p className="ref-intro-text">
            O sistema não substitui avaliação clínica, diagnóstico ou acompanhamento
            terapêutico especializado. Seu propósito é de apoio à estimulação, organização
            de sessões e comunicação entre cuidadores e profissionais.
          </p>
          <div className="ref-disclaimer">
            ⚕ Este sistema é uma ferramenta de apoio educacional e terapêutico.
            Toda atividade deve ser contextualizada pelo olhar do profissional responsável.
          </div>
        </div>
      </Card>

      {/* ── Principles ── */}
      <section className="dashboard-section">
        <h2 className="section-title">Princípios orientadores</h2>
        <div className="principles-grid">
          {PRINCIPLES.map((p) => (
            <Card key={p.title} className="principle-card">
              <span className="principle-emoji">{p.emoji}</span>
              <h3 className="principle-title">{p.title}</h3>
              <p className="principle-body">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── References ── */}
      <section className="dashboard-section">
        <h2 className="section-title">Referências bibliográficas</h2>

        <div className="ref-category-tabs">
          {(Object.entries(CATEGORY_CONFIG) as [ReferenceCategory, typeof CATEGORY_CONFIG[ReferenceCategory]][]).map(
            ([key, config]) => (
              <button
                key={key}
                className={`ref-tab ${activeCategory === key ? 'ref-tab--active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            )
          )}
        </div>

        <Card className="ref-category-desc">
          <p>{CATEGORY_CONFIG[activeCategory].description}</p>
        </Card>

        <div className="ref-list">
          {filteredRefs.map((r) => (
            <ReferenceCard key={r.id} ref={r} />
          ))}
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="ref-footer-note">
        <p>
          As referências listadas foram selecionadas como inspiração conceitual e metodológica.
          Recomendamos a leitura direta das fontes originais para aprofundamento clínico.
        </p>
      </div>
    </div>
  );
};
