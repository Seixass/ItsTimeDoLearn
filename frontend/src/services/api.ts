/**
 * Service layer — único ponto de integração entre componentes e dados.
 *
 * Todas as funções chamam o backend REST via httpClient.
 * O Zustand é sincronizado como cache após cada operação bem-sucedida.
 * Em caso de falha de rede, fallback silencioso para dados do store local.
 */

import { useStore } from '../store/useStore';
import { http } from './httpClient';
import type {
  Child,
  GameSession,
  GameResult,
  GameCode,
  DifficultyLevel,
  AdaptiveProfile,
  TherapeuticGoal,
  SessionObservation,
  ObservationFormData,
  SessionPlanEntry,
  WeeklyPlan,
  ChildTherapeuticProfile,
  Caregiver,
} from '../types';

// ── Children ──────────────────────────────────────────────────────────────────

export const fetchChildren = (): Promise<Child[]> =>
  http.get<Child[]>('/children');

export const fetchChildById = (id: string): Promise<Child> =>
  http.get<Child>(`/children/${id}`);

export const createChild = async (data: Omit<Child, 'id'>): Promise<Child> => {
  try {
    const child = await http.post<Child>('/children', data);
    useStore.setState((s) => ({ children: [...s.children, child] }));
    return child;
  } catch {
    return useStore.getState().addChild(data);
  }
};

export const updateChild = async (
  id: string,
  data: Partial<Omit<Child, 'id'>>,
): Promise<Child> => {
  try {
    const child = await http.patch<Child>(`/children/${id}`, data);
    useStore.setState((s) => ({
      children: s.children.map((c) => (c.id === id ? child : c)),
    }));
    return child;
  } catch {
    useStore.getState().updateChild(id, data);
    return { id, ...useStore.getState().getChildById(id)! };
  }
};

export const deleteChild = async (id: string): Promise<void> => {
  try {
    await http.delete<void>(`/children/${id}`);
  } catch {
    // If backend is unreachable, still delete locally
  }
  useStore.getState().deleteChild(id);
};

// ── Sessions ──────────────────────────────────────────────────────────────────

export const fetchSessionsByChild = async (childId: string): Promise<GameSession[]> => {
  try {
    const sessions = await http.get<GameSession[]>(`/sessions/children/${childId}`);
    useStore.setState((s) => {
      const others = s.sessions.filter((ss) => ss.childId !== childId);
      return { sessions: [...others, ...sessions] };
    });
    return sessions;
  } catch {
    return useStore.getState().getSessionsByChildId(childId);
  }
};

export const saveGameSession = async (
  childId: string,
  gameCode: GameCode,
  startedAt: string,
  result: GameResult,
): Promise<string> => {
  const endedAt = new Date().toISOString();
  const durationSeconds = Math.round(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );
  const payload = { childId, gameCode, startedAt, endedAt, durationSeconds, success: result.success, meta: result.meta };
  try {
    const session = await http.post<GameSession>('/sessions', payload);
    useStore.setState((s) => ({ sessions: [...s.sessions, session] }));
    return session.id;
  } catch {
    const session = useStore.getState().addSession(payload);
    return session.id;
  }
};

// ── Goals ─────────────────────────────────────────────────────────────────────

export const fetchGoalsByChild = async (childId: string): Promise<TherapeuticGoal[]> => {
  try {
    const goals = await http.get<TherapeuticGoal[]>(`/goals/children/${childId}`);
    useStore.setState((s) => {
      const others = s.goals.filter((g) => g.childId !== childId);
      return { goals: [...others, ...goals] };
    });
    return goals;
  } catch {
    return useStore.getState().getGoalsByChildId(childId);
  }
};

export const createGoal = async (
  data: Omit<TherapeuticGoal, 'id' | 'createdAt'>,
): Promise<TherapeuticGoal> => {
  try {
    const goal = await http.post<TherapeuticGoal>('/goals', data);
    useStore.setState((s) => ({ goals: [...s.goals, goal] }));
    return goal;
  } catch {
    return useStore.getState().addGoal(data);
  }
};

export const updateGoalProgress = async (id: string, currentValue: number): Promise<void> => {
  try {
    const goal = await http.patch<TherapeuticGoal>(`/goals/${id}/progress`, { currentValue });
    useStore.setState((s) => ({
      goals: s.goals.map((g) => (g.id === id ? goal : g)),
    }));
  } catch {
    useStore.getState().updateGoalProgress(id, currentValue);
  }
};

export const toggleGoalActive = async (id: string): Promise<void> => {
  try {
    const goal = await http.patch<TherapeuticGoal>(`/goals/${id}/toggle`, {});
    useStore.setState((s) => ({
      goals: s.goals.map((g) => (g.id === id ? goal : g)),
    }));
  } catch {
    useStore.getState().toggleGoalActive(id);
  }
};

// ── Observations ──────────────────────────────────────────────────────────────

export const saveSessionObservation = async (
  sessionId: string,
  childId: string,
  gameCode: GameCode,
  data: ObservationFormData,
): Promise<void> => {
  const payload = { sessionId, childId, gameCode, ...data };
  try {
    const obs = await http.post<SessionObservation>('/observations', payload);
    useStore.setState((s) => ({ observations: [...s.observations, obs] }));
  } catch {
    useStore.getState().addObservation(payload);
  }
};

export const fetchObservationsByChild = async (childId: string): Promise<SessionObservation[]> => {
  try {
    const observations = await http.get<SessionObservation[]>(`/observations/children/${childId}`);
    useStore.setState((s) => {
      const others = s.observations.filter((o) => o.childId !== childId);
      return { observations: [...others, ...observations] };
    });
    return observations;
  } catch {
    return useStore.getState().getObservationsByChildId(childId);
  }
};

// ── Weekly Plan ───────────────────────────────────────────────────────────────

export const fetchWeeklyPlan = async (childId: string): Promise<WeeklyPlan | undefined> => {
  try {
    const plan = await http.get<WeeklyPlan | null>(`/weekly-plans/children/${childId}`);
    if (plan) {
      useStore.setState((s) => ({
        weeklyPlans: [
          ...s.weeklyPlans.filter((p) => p.childId !== childId),
          plan,
        ],
      }));
    }
    return plan ?? undefined;
  } catch {
    return useStore.getState().getWeeklyPlanByChildId(childId);
  }
};

export const saveWeeklyPlan = async (childId: string, entries: SessionPlanEntry[]): Promise<void> => {
  try {
    const plan = await http.put<WeeklyPlan>(`/weekly-plans/children/${childId}`, { entries });
    useStore.setState((s) => ({
      weeklyPlans: [
        ...s.weeklyPlans.filter((p) => p.childId !== childId),
        plan,
      ],
    }));
  } catch {
    useStore.getState().upsertWeeklyPlan(childId, entries);
  }
};

// ── Adaptive Difficulty ───────────────────────────────────────────────────────

export const fetchAdaptiveProfile = async (
  childId: string,
  gameCode: GameCode,
): Promise<AdaptiveProfile | undefined> => {
  try {
    const profile = await http.get<AdaptiveProfile | null>(
      `/adaptive-profiles/children/${childId}/games/${gameCode}`
    );
    return profile ?? undefined;
  } catch {
    return useStore.getState().getAdaptiveProfile(childId, gameCode);
  }
};

export const computeAndUpdateAdaptiveDifficulty = async (
  childId: string,
  gameCode: GameCode,
): Promise<DifficultyLevel> => {
  const store = useStore.getState();
  const profile = store.getAdaptiveProfile(childId, gameCode);
  const currentLevel: DifficultyLevel = profile?.currentLevel ?? 'easy';

  const recent = store
    .getSessionsByChildId(childId)
    .filter((s) => s.gameCode === gameCode)
    .slice(-5);

  if (recent.length < 3) {
    store.updateAdaptiveProfile(childId, gameCode, currentLevel);
    return currentLevel;
  }

  const successRate = recent.filter((s) => s.success).length / recent.length;
  let newLevel: DifficultyLevel = currentLevel;

  if (successRate >= 0.8 && currentLevel !== 'hard') {
    newLevel = currentLevel === 'easy' ? 'medium' : 'hard';
  } else if (successRate < 0.4 && currentLevel !== 'easy') {
    newLevel = currentLevel === 'hard' ? 'medium' : 'easy';
  }

  store.updateAdaptiveProfile(childId, gameCode, newLevel);

  try {
    await http.put(`/adaptive-profiles/children/${childId}/games/${gameCode}`, {
      currentLevel: newLevel,
      sessionsAtLevel: (profile?.sessionsAtLevel ?? 0) + 1,
    });
  } catch {
    // already updated in store above
  }

  return newLevel;
};

// ── Therapeutic Profile ───────────────────────────────────────────────────────

export const fetchTherapeuticProfile = (
  childId: string,
): ChildTherapeuticProfile | undefined =>
  useStore.getState().getTherapeuticProfile(childId);

export const saveTherapeuticProfile = (
  data: Omit<ChildTherapeuticProfile, 'id' | 'updatedAt'>,
): void => useStore.getState().upsertTherapeuticProfile(data);

// ── Caregivers ────────────────────────────────────────────────────────────────

export const fetchCaregivers = async (): Promise<Caregiver[]> => {
  try {
    const caregivers = await http.get<Caregiver[]>('/caregivers');
    useStore.setState({ caregivers });
    return caregivers;
  } catch {
    return useStore.getState().caregivers;
  }
};

export const fetchCaregiverById = async (id: string): Promise<Caregiver | undefined> => {
  try {
    return await http.get<Caregiver>(`/caregivers/${id}`);
  } catch {
    return useStore.getState().getCaregiverById(id);
  }
};

export const fetchCaregiversByChild = async (childId: string): Promise<Caregiver[]> => {
  try {
    const caregivers = await http.get<Caregiver[]>(`/caregivers/children/${childId}`);
    return caregivers;
  } catch {
    return useStore.getState().getCaregiversByChildId(childId);
  }
};

export const createCaregiver = async (
  data: Omit<Caregiver, 'id' | 'createdAt'>,
): Promise<Caregiver> => {
  try {
    const caregiver = await http.post<Caregiver>('/caregivers', data);
    useStore.setState((s) => ({ caregivers: [...s.caregivers, caregiver] }));
    return caregiver;
  } catch {
    return useStore.getState().addCaregiver(data);
  }
};

export const updateCaregiver = async (
  id: string,
  data: Partial<Omit<Caregiver, 'id' | 'createdAt'>>,
): Promise<Caregiver> => {
  try {
    const caregiver = await http.patch<Caregiver>(`/caregivers/${id}`, data);
    useStore.setState((s) => ({
      caregivers: s.caregivers.map((cg) => (cg.id === id ? caregiver : cg)),
    }));
    return caregiver;
  } catch {
    useStore.getState().updateCaregiver(id, data);
    return useStore.getState().getCaregiverById(id)!;
  }
};

export const deleteCaregiver = async (id: string): Promise<void> => {
  try {
    await http.delete<void>(`/caregivers/${id}`);
  } catch {
    // If backend is unreachable, still delete locally
  }
  useStore.getState().deleteCaregiver(id);
};

export const linkCaregiverToChild = async (
  caregiverId: string,
  childId: string,
): Promise<void> => {
  try {
    await http.post(`/caregivers/${caregiverId}/children/${childId}`, {});
  } catch {
    // fallback to local
  }
  useStore.getState().linkCaregiverToChild(caregiverId, childId);
};

export const unlinkCaregiverFromChild = async (
  caregiverId: string,
  childId: string,
): Promise<void> => {
  try {
    await http.delete(`/caregivers/${caregiverId}/children/${childId}`);
  } catch {
    // fallback to local
  }
  useStore.getState().unlinkCaregiverFromChild(caregiverId, childId);
};
