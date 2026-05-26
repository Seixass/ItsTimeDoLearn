import type {
  Activity,
  ChildTherapeuticProfile,
  TherapeuticGoal,
  GameSession,
} from '../types';

export interface AnnotatedActivity {
  activity: Activity;
  reason: string;
  cautionNote?: string;
}

export interface RecommendationResult {
  recommended: AnnotatedActivity[];
  withCaution: AnnotatedActivity[];
  notRecommended: AnnotatedActivity[];
}

interface ScoredActivity {
  activity: Activity;
  score: number;
  reasons: string[];
  hasCaution: boolean;
  cautionReasons: string[];
}

function scoreActivity(
  activity: Activity,
  profile: ChildTherapeuticProfile,
  activeGoals: TherapeuticGoal[]
): ScoredActivity {
  let score = 0;
  const reasons: string[] = [];
  let hasCaution = false;
  const cautionReasons: string[] = [];

  // ── Condition match ────────────────────────────────────────────────────────
  const matchedConditions = profile.conditions.filter((c) =>
    activity.recommendedProfiles.some(
      (rp) => rp.toLowerCase() === c.toLowerCase()
    )
  );
  if (matchedConditions.length > 0) {
    score += matchedConditions.length * 2;
    reasons.push(`Indicado para o perfil ${matchedConditions.join(', ')}`);
  }

  // ── Caution profiles ───────────────────────────────────────────────────────
  const matchedCaution = profile.conditions.filter((c) =>
    activity.cautionProfiles.some(
      (cp) => cp.toLowerCase() === c.toLowerCase()
    )
  );
  if (matchedCaution.length > 0) {
    hasCaution = true;
    cautionReasons.push(
      `Requer atenção especial para o perfil ${matchedCaution.join(', ')}`
    );
  }

  // ── Goal alignment ─────────────────────────────────────────────────────────
  const primaryGoals = activeGoals.filter(
    (g) => g.skill === activity.primarySkill
  );
  if (primaryGoals.length > 0) {
    score += 3;
    reasons.push(`Trabalha diretamente: ${primaryGoals[0].description}`);
  }

  const secondaryGoals = activeGoals.filter(
    (g) =>
      g.skill !== activity.primarySkill &&
      activity.secondarySkills.includes(g.skill)
  );
  if (secondaryGoals.length > 0) {
    score += secondaryGoals.length;
    reasons.push(`Apoia habilidades secundárias das metas ativas`);
  }

  // ── Duration fit ───────────────────────────────────────────────────────────
  if (activity.suggestedDurationMinutes <= profile.idealSessionMinutes) {
    score += 1;
    reasons.push(
      `Duração adequada (${activity.suggestedDurationMinutes}min / ideal: ${profile.idealSessionMinutes}min)`
    );
  } else if (
    activity.suggestedDurationMinutes >
    profile.idealSessionMinutes * 1.5
  ) {
    score -= 1;
    cautionReasons.push(
      `Duração superior ao ideal (${activity.suggestedDurationMinutes}min vs ${profile.idealSessionMinutes}min)`
    );
    hasCaution = true;
  }

  // ── Support level fit ──────────────────────────────────────────────────────
  if (
    !activity.requiresMediation &&
    (profile.supportLevel === 'independent' ||
      profile.supportLevel === 'minimal')
  ) {
    score += 1;
    reasons.push('Pode ser realizada de forma independente');
  }
  if (
    activity.requiresMediation &&
    profile.supportLevel === 'independent'
  ) {
    cautionReasons.push('Atividade requer mediação — planeje com apoio de cuidador');
    hasCaution = true;
  }

  // ── Sensory sensitivity overlap ────────────────────────────────────────────
  const sensitivityOverlap = profile.sensorySensitivities.filter((s) =>
    activity.sensorySensitivities.some(
      (as) => as.toLowerCase().includes(s.toLowerCase()) ||
               s.toLowerCase().includes(as.toLowerCase())
    )
  );
  if (sensitivityOverlap.length > 0) {
    hasCaution = true;
    cautionReasons.push(
      `Pode envolver sensibilidade a: ${sensitivityOverlap.join(', ')} — adapte o ambiente`
    );
  }

  return { activity, score, reasons, hasCaution, cautionReasons };
}

export function computeActivityRecommendations(
  profile: ChildTherapeuticProfile,
  activities: Activity[],
  goals: TherapeuticGoal[],
  _sessions: GameSession[]
): RecommendationResult {
  const activeGoals = goals.filter((g) => g.active);

  const scored = activities.map((activity) =>
    scoreActivity(activity, profile, activeGoals)
  );

  const recommended: AnnotatedActivity[] = [];
  const withCaution: AnnotatedActivity[] = [];
  const notRecommended: AnnotatedActivity[] = [];

  for (const item of scored) {
    const reason =
      item.reasons.length > 0
        ? item.reasons.join(' · ')
        : 'Atividade disponível para este perfil';

    const cautionNote =
      item.cautionReasons.length > 0
        ? item.cautionReasons.join(' · ')
        : undefined;

    if (item.hasCaution) {
      withCaution.push({ activity: item.activity, reason, cautionNote });
    } else if (item.score >= 1) {
      recommended.push({ activity: item.activity, reason });
    } else {
      notRecommended.push({ activity: item.activity, reason });
    }
  }

  // Sort recommended by score descending
  const scoreOf = (a: AnnotatedActivity) =>
    scored.find((s) => s.activity.id === a.activity.id)?.score ?? 0;

  recommended.sort((a, b) => scoreOf(b) - scoreOf(a));
  withCaution.sort((a, b) => scoreOf(b) - scoreOf(a));

  return { recommended, withCaution, notRecommended };
}
