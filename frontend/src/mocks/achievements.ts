import type { Achievement, AchievementCode, TrailPhase } from '../types';
import type { GameSession, SessionObservation, TherapeuticGoal } from '../types';

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    code: 'first_session',
    name: 'Primeira Aventura',
    description: 'Completou a primeira sessão de jogo!',
    emoji: '🌟',
  },
  {
    code: 'five_sessions',
    name: 'Explorador',
    description: 'Completou 5 sessões de jogo.',
    emoji: '🧭',
  },
  {
    code: 'ten_sessions',
    name: 'Herói do Aprendizado',
    description: 'Completou 10 sessões de jogo!',
    emoji: '🏆',
  },
  {
    code: 'first_success',
    name: 'Primeira Vitória',
    description: 'Venceu um jogo pela primeira vez!',
    emoji: '🎉',
  },
  {
    code: 'three_in_a_row',
    name: 'Em Chama!',
    description: 'Venceu 3 jogos seguidos.',
    emoji: '🔥',
  },
  {
    code: 'all_games_tried',
    name: 'Curioso',
    description: 'Experimentou todos os jogos disponíveis.',
    emoji: '🎮',
  },
  {
    code: 'perfect_focus',
    name: 'Super Focado',
    description: 'Registrou nível de foco máximo em uma sessão.',
    emoji: '🎯',
  },
  {
    code: 'week_streak',
    name: 'Consistente',
    description: 'Jogou em 5 dias diferentes na mesma semana.',
    emoji: '📅',
  },
  {
    code: 'goal_complete',
    name: 'Meta Alcançada',
    description: 'Atingiu 100% em uma meta terapêutica!',
    emoji: '🎖️',
  },
  {
    code: 'no_help_needed',
    name: 'Independente',
    description: 'Completou uma sessão sem precisar de ajuda.',
    emoji: '💪',
  },
];

export const TRAIL_PHASES: TrailPhase[] = [
  { id: 1, name: 'Broto',        emoji: '🌱', requiredSessions: 0,  color: '#86efac' },
  { id: 2, name: 'Explorador',   emoji: '🌿', requiredSessions: 3,  color: '#4ade80' },
  { id: 3, name: 'Aventureiro',  emoji: '🌳', requiredSessions: 7,  color: '#22c55e' },
  { id: 4, name: 'Guardião',     emoji: '⭐', requiredSessions: 15, color: '#facc15' },
  { id: 5, name: 'Campeão',      emoji: '🏆', requiredSessions: 25, color: '#f97316' },
];

export function computeAchievements(
  sessions: GameSession[],
  observations: SessionObservation[],
  goals: TherapeuticGoal[] = [],
): Achievement[] {
  const successSessions = sessions.filter((s) => s.success);
  const unlockedCodes = new Set<AchievementCode>();

  if (sessions.length >= 1) unlockedCodes.add('first_session');
  if (sessions.length >= 5) unlockedCodes.add('five_sessions');
  if (sessions.length >= 10) unlockedCodes.add('ten_sessions');
  if (successSessions.length >= 1) unlockedCodes.add('first_success');

  const triedGames = new Set(sessions.map((s) => s.gameCode));
  if (triedGames.size >= 3) unlockedCodes.add('all_games_tried');

  // 3 wins in a row
  let streak = 0;
  for (const s of [...sessions].sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    streak = s.success ? streak + 1 : 0;
    if (streak >= 3) { unlockedCodes.add('three_in_a_row'); break; }
  }

  // perfect focus
  if (observations.some((o) => o.focusLevel === 5)) {
    unlockedCodes.add('perfect_focus');
  }

  // no help needed
  if (observations.some((o) => !o.neededHelp && o.engagementLevel >= 4)) {
    unlockedCodes.add('no_help_needed');
  }

  // week streak: 5 distinct days in last 7
  const now = Date.now();
  const last7 = sessions.filter((s) => now - new Date(s.startedAt).getTime() < 7 * 86400000);
  const distinctDays = new Set(last7.map((s) => new Date(s.startedAt).toDateString()));
  if (distinctDays.size >= 5) unlockedCodes.add('week_streak');

  // goal complete: at least one goal at 100%
  if (goals.some((g) => g.targetValue > 0 && g.currentValue >= g.targetValue)) {
    unlockedCodes.add('goal_complete');
  }

  return ACHIEVEMENT_DEFINITIONS.map((a) =>
    unlockedCodes.has(a.code)
      ? { ...a, unlockedAt: new Date().toISOString() }
      : a
  );
}
