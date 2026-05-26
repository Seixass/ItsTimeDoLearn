import { childrenRepository } from '../children/children.repository';
import { activitiesRepository } from '../activities/activities.repository';
import { NotFoundError } from '../../common/errors';
import type { Recommendation, RecommendationPriority, RecommendationsResponse } from './recommendations.types';
import type { Activity } from '../activities/activities.types';

function calcAge(birthdate?: string): number | null {
  if (!birthdate) return null;
  const diff = Date.now() - new Date(birthdate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

/*
  Lógica de recomendação — V1 (regra simples por idade e dificuldade).

  Esta função é intencionalmente simples para a primeira iteração.
  Próximas versões adicionarão:
    - Peso baseado no perfil terapêutico (conditions, mainDifficulties)
    - Exclusão por sensorySensitivities
    - Priorização por histórico de sessões
    - Score numérico por múltiplos critérios
*/
function buildRecommendations(
  activities: Activity[],
  age: number | null,
  notes?: string,
): Recommendation[] {
  const effectiveAge = age ?? 7;

  const suitable = activities.filter(
    (a) => effectiveAge >= a.ageRangeMin && effectiveAge <= a.ageRangeMax,
  );

  const PRIORITY_MAP: Record<string, RecommendationPriority> = {
    easy:   'high',
    medium: 'medium',
    hard:   'low',
  };

  return suitable
    .sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 };
      return order[a.initialDifficulty] - order[b.initialDifficulty];
    })
    .map((a) => ({
      activity: a,
      priority: PRIORITY_MAP[a.initialDifficulty],
      reason: buildReason(a, effectiveAge, notes),
    }));
}

function buildReason(a: Activity, age: number, notes?: string): string {
  const parts: string[] = [
    `Indicada para crianças de ${a.ageRangeMin}–${a.ageRangeMax} anos (${age} anos).`,
    `Trabalha principalmente: ${a.primarySkill.replace(/_/g, ' ')}.`,
    `Duração sugerida: ${a.suggestedDurationMinutes} min.`,
  ];
  if (a.requiresMediation) {
    parts.push('Requer mediação do terapeuta.');
  }
  return parts.join(' ');
}

export const recommendationsService = {
  async getForChild(childId: string): Promise<RecommendationsResponse> {
    const child = await childrenRepository.findById(childId);
    if (!child) throw new NotFoundError('Criança');

    const activities = await activitiesRepository.findAll();
    const age = calcAge(child.birthdate);
    const recommendations = buildRecommendations(activities, age, child.notes);

    return {
      childId,
      childAge: age,
      totalFound: recommendations.length,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  },
};
