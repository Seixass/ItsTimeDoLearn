import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { saveGameSession, saveSessionObservation } from '../services/api';
import { ACTIVITY_CATALOG } from '../mocks';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PageHeader } from '../components/common/PageHeader';
import { SessionObservationForm } from '../components/session/SessionObservationForm';
import type { ObservationFormData } from '../types';

type PageState = 'intro' | 'in_progress' | 'observing' | 'complete';

const CATEGORY_LABELS: Record<string, string> = {
  executive_functions: 'Funções Executivas',
  sensory_regulation: 'Regulação Sensorial',
  social_emotional: 'Social e Emocional',
  attention_focus: 'Atenção e Foco',
  language_communication: 'Linguagem e Comunicação',
  routine_organization: 'Organização de Rotina',
  motor_skills: 'Habilidades Motoras',
};

const SUPPORT_STEPS: Record<string, string[]> = {
  breathing_exercise: [
    'Encontre um lugar tranquilo e confortável',
    'Sente ou deite com a criança de forma relaxada',
    'Inspire contando até 4 (barriga pra fora)',
    'Segure por 2 segundos',
    'Expire contando até 6 (barriga pra dentro)',
    'Repita 5 vezes, devagar e com calma',
    'Pergunte como ela se sente depois',
  ],
  emotion_cards: [
    'Prepare as fotos ou imagens de expressões faciais',
    'Mostre uma expressão de cada vez',
    'Pergunte: "Como essa pessoa está se sentindo?"',
    'Valide as respostas sem corrigir o nome exato',
    'Conte uma história curta sobre aquela emoção',
    'Pergunte quando ela já sentiu algo parecido',
    'Encerre com uma expressão positiva',
  ],
  daily_schedule_visual: [
    'Prepare as imagens ou ícones da rotina do dia',
    'Sente com a criança e apresente a primeira atividade',
    'Deixe-a mover o ícone da atividade ao completar',
    'Comemore cada etapa concluída com reforço positivo',
    'Se houver dificuldade, ajude sem fazer por ela',
    'Ao final, mostre todo o caminho percorrido',
  ],
  turn_taking_game: [
    'Escolha um jogo simples (dados, dominó, sequência)',
    'Explique que cada um joga na sua vez',
    'Demonstre esperando a sua vez com paciência visível',
    'Reforce sempre que ela esperar corretamente',
    'Se houver frustração, pause e respire juntos',
    'Finalize elogiando a participação, não só o resultado',
  ],
  body_movement: [
    'Prepare um espaço aberto e seguro',
    'Comece com movimentos lentos de aquecimento',
    'Proponha imitação de animais (cobra, urso, canguru)',
    'Alterne movimentos rápidos e lentos',
    'Inclua pausas de escuta do corpo (respiração, coração)',
    'Finalize com espreguiçar e relaxar',
  ],
  storytelling_sequence: [
    'Prepare 3 a 5 imagens de uma história simples',
    'Misture as imagens e coloque na frente da criança',
    'Peça que organize na ordem que faz sentido',
    'Incentive contar o que está acontecendo em cada imagem',
    'Faça perguntas abertas: "E depois? Por quê?"',
    'Comemore a história montada no final',
  ],
  social_situation_cards: [
    'Escolha uma situação social simples (cumprimentar, pedir emprestado)',
    'Mostre a imagem e descreva o cenário',
    'Pergunte: "O que você faria aqui?"',
    'Não corrija diretamente; explore juntos as opções',
    'Encene a situação de forma lúdica',
    'Reforce respostas que mostrem empatia',
  ],
  sensory_exploration: [
    'Prepare materiais de diferentes texturas (algodão, lixa, tecido)',
    'Apresente um material de cada vez com calma',
    'Observe as reações sem forçar o toque',
    'Pergunte: "Gostou? Como sente?"',
    'Respeite se não quiser tocar em algo',
    'Registre as preferências e rejeições observadas',
  ],
};

function getSteps(code: string): string[] {
  return SUPPORT_STEPS[code] ?? [
    'Prepare o ambiente com antecedência',
    'Explique a atividade de forma simples e visual',
    'Realize junto com a criança',
    'Observe e registre as reações',
    'Encerre com reforço positivo',
  ];
}

export const GuidedActivityPage: React.FC = () => {
  const { id, activityCode } = useParams<{ id: string; activityCode: string }>();
  const navigate = useNavigate();
  const child = useStore((s) => s.children.find((c) => c.id === id));
  const activity = ACTIVITY_CATALOG.find((a) => a.code === activityCode);

  const [pageState, setPageState] = useState<PageState>('intro');
  const [startedAt] = useState(new Date().toISOString());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [sessionId, setSessionId] = useState<string>('');

  if (!child || !activity) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-emoji">❓</span>
          <p>Atividade não encontrada.</p>
          <Button onClick={() => navigate(`/children/${id}`)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const steps = getSteps(activity.code);
  const allDone = completedSteps.size === steps.length;

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleComplete = async () => {
    const sid = await saveGameSession(child.id, 'sequence_routine', startedAt, {
      success: allDone,
      meta: { steps: steps.length },
    });
    setSessionId(sid);
    setPageState('observing');
  };

  const handleObservationSubmit = async (data: ObservationFormData) => {
    if (sessionId) {
      await saveSessionObservation(sessionId, child.id, 'sequence_routine', data);
    }
    setPageState('complete');
  };

  if (pageState === 'observing') {
    return (
      <div className="page">
        <PageHeader title="Como foi a atividade?" subtitle="Registre sua observação" backTo={`/children/${id}`} />
        <SessionObservationForm
          childName={child.name}
          gameName={activity.name}
          gameEmoji={activity.emoji}
          onSubmit={handleObservationSubmit}
          onSkip={() => setPageState('complete')}
        />
      </div>
    );
  }

  if (pageState === 'complete') {
    return (
      <div className="page page--game">
        <div className="result-screen result-screen--success">
          <span className="result-emoji">🌟</span>
          <h1 className="result-title">Atividade concluída!</h1>
          <p className="result-subtitle">{activity.emoji} {activity.name}</p>
          <p className="result-saved-msg">✅ Sessão registrada com sucesso!</p>
          <div className="result-actions">
            <Button variant="game" size="lg" onClick={() => navigate(`/children/${id}`)}>← Voltar ao painel</Button>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'intro') {
    return (
      <div className="page">
        <PageHeader title={activity.name} subtitle={CATEGORY_LABELS[activity.category] ?? ''} backTo={`/children/${id}`} />
        <Card className="guided-activity-intro">
          <div className="guided-activity-hero">
            <span className="guided-activity-emoji">{activity.emoji}</span>
            <div>
              <h2 className="guided-activity-name">{activity.name}</h2>
              <p className="guided-activity-description">{activity.description}</p>
            </div>
          </div>
          <div className="guided-activity-objective">
            <strong>Objetivo terapêutico:</strong>
            <p>{activity.functionalObjective}</p>
          </div>
          <div className="guided-activity-meta">
            <span>⏱️ {activity.suggestedDurationMinutes} minutos</span>
            {activity.requiresMediation && <span>🤝 Requer mediação</span>}
            <span>👥 Perfis: {activity.recommendedProfiles.join(', ')}</span>
          </div>
          <Button variant="game" size="lg" style={{ marginTop: 24, width: '100%' }} onClick={() => setPageState('in_progress')}>
            ▶ Iniciar atividade
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="level-header">
        <button className="level-header-back" onClick={() => navigate(`/children/${id}`)}>← Sair</button>
        <span className="level-header-emoji">{activity.emoji}</span>
        <div className="level-header-info">
          <div className="level-header-name">{activity.name}</div>
          <div className="level-header-meta">
            <span>{child.name}</span>
            <span className="level-header-dot" />
            <span>{completedSteps.size}/{steps.length} etapas</span>
          </div>
        </div>
      </div>

      <div className="game-stage">
        <Card className="guided-steps-card">
          <h3 className="guided-steps-title">Siga os passos com a criança</h3>
          <div className="guided-steps-list">
            {steps.map((step, i) => (
              <button
                key={i}
                className={`guided-step ${completedSteps.has(i) ? 'guided-step--done' : ''}`}
                onClick={() => toggleStep(i)}
              >
                <span className="guided-step-check">{completedSteps.has(i) ? '✅' : '⬜'}</span>
                <span className="guided-step-text">{step}</span>
              </button>
            ))}
          </div>
          <div className="guided-progress-bar">
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${(completedSteps.size / steps.length) * 100}%` }} />
            </div>
            <span className="guided-progress-label">{completedSteps.size} de {steps.length} etapas</span>
          </div>
          <Button
            variant={allDone ? 'success' : 'primary'}
            size="lg"
            style={{ marginTop: 24, width: '100%' }}
            onClick={handleComplete}
          >
            {allDone ? '🎉 Concluir atividade!' : 'Registrar como realizada'}
          </Button>
        </Card>
      </div>
    </div>
  );
};
