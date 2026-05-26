import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Child,
  GameSession,
  GameCode,
  DifficultyLevel,
  AdaptiveProfile,
  TherapeuticGoal,
  SessionObservation,
  SessionPlanEntry,
  WeeklyPlan,
  ChildTherapeuticProfile,
  Caregiver,
} from '../types';
import {
  INITIAL_CHILDREN,
  INITIAL_SESSIONS,
  INITIAL_GOALS,
  INITIAL_OBSERVATIONS,
  INITIAL_WEEKLY_PLANS,
  INITIAL_ADAPTIVE_PROFILES,
  INITIAL_THERAPEUTIC_PROFILES,
  INITIAL_CAREGIVERS,
} from '../mocks';

interface AppState {
  children: Child[];
  sessions: GameSession[];
  goals: TherapeuticGoal[];
  observations: SessionObservation[];
  weeklyPlans: WeeklyPlan[];
  adaptiveProfiles: AdaptiveProfile[];
  therapeuticProfiles: ChildTherapeuticProfile[];
  caregivers: Caregiver[];

  // Child
  addChild: (child: Omit<Child, 'id'>) => Child;
  updateChild: (id: string, data: Partial<Omit<Child, 'id'>>) => void;
  deleteChild: (id: string) => void;
  getChildById: (id: string) => Child | undefined;

  // Session
  addSession: (session: Omit<GameSession, 'id'>) => GameSession;
  getSessionsByChildId: (childId: string) => GameSession[];

  // Goals
  addGoal: (data: Omit<TherapeuticGoal, 'id' | 'createdAt'>) => TherapeuticGoal;
  updateGoalProgress: (id: string, currentValue: number) => void;
  toggleGoalActive: (id: string) => void;
  getGoalsByChildId: (childId: string) => TherapeuticGoal[];

  // Observations
  addObservation: (data: Omit<SessionObservation, 'id' | 'recordedAt'>) => void;
  getObservationsByChildId: (childId: string) => SessionObservation[];

  // Weekly Plans
  upsertWeeklyPlan: (childId: string, entries: SessionPlanEntry[]) => void;
  getWeeklyPlanByChildId: (childId: string) => WeeklyPlan | undefined;

  // Adaptive Profiles
  getAdaptiveProfile: (childId: string, gameCode: GameCode) => AdaptiveProfile | undefined;
  updateAdaptiveProfile: (childId: string, gameCode: GameCode, level: DifficultyLevel) => void;

  // Therapeutic Profiles
  getTherapeuticProfile: (childId: string) => ChildTherapeuticProfile | undefined;
  upsertTherapeuticProfile: (data: Omit<ChildTherapeuticProfile, 'id' | 'updatedAt'>) => void;

  // Caregivers
  addCaregiver: (data: Omit<Caregiver, 'id' | 'createdAt'>) => Caregiver;
  updateCaregiver: (id: string, data: Partial<Omit<Caregiver, 'id' | 'createdAt'>>) => void;
  deleteCaregiver: (id: string) => void;
  getCaregiverById: (id: string) => Caregiver | undefined;
  getCaregiversByChildId: (childId: string) => Caregiver[];
  linkCaregiverToChild: (caregiverId: string, childId: string) => void;
  unlinkCaregiverFromChild: (caregiverId: string, childId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      children: INITIAL_CHILDREN,
      sessions: INITIAL_SESSIONS,
      goals: INITIAL_GOALS,
      observations: INITIAL_OBSERVATIONS,
      weeklyPlans: INITIAL_WEEKLY_PLANS,
      adaptiveProfiles: INITIAL_ADAPTIVE_PROFILES,
      therapeuticProfiles: INITIAL_THERAPEUTIC_PROFILES,
      caregivers: INITIAL_CAREGIVERS,

      // ── Child ─────────────────────────────────────────────────────────────

      addChild: (data) => {
        const child: Child = { ...data, id: crypto.randomUUID() };
        set((s) => ({ children: [...s.children, child] }));
        return child;
      },

      updateChild: (id, data) => {
        set((s) => ({
          children: s.children.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      deleteChild: (id) => {
        set((s) => ({
          children: s.children.filter((c) => c.id !== id),
          goals: s.goals.filter((g) => g.childId !== id),
          sessions: s.sessions.filter((ss) => ss.childId !== id),
          observations: s.observations.filter((o) => o.childId !== id),
          weeklyPlans: s.weeklyPlans.filter((p) => p.childId !== id),
          adaptiveProfiles: s.adaptiveProfiles.filter((p) => p.childId !== id),
          therapeuticProfiles: s.therapeuticProfiles.filter((p) => p.childId !== id),
          caregivers: s.caregivers.map((cg) => ({
            ...cg,
            linkedChildIds: cg.linkedChildIds.filter((cid) => cid !== id),
          })),
        }));
      },

      getChildById: (id) => get().children.find((c) => c.id === id),

      // ── Session ───────────────────────────────────────────────────────────

      addSession: (data) => {
        const session: GameSession = { ...data, id: crypto.randomUUID() };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      getSessionsByChildId: (childId) =>
        get().sessions.filter((s) => s.childId === childId),

      // ── Goals ─────────────────────────────────────────────────────────────

      addGoal: (data) => {
        const goal: TherapeuticGoal = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ goals: [...s.goals, goal] }));
        return goal;
      },

      updateGoalProgress: (id, currentValue) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, currentValue } : g)),
        }));
      },

      toggleGoalActive: (id) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, active: !g.active } : g
          ),
        }));
      },

      getGoalsByChildId: (childId) =>
        get().goals.filter((g) => g.childId === childId),

      // ── Observations ──────────────────────────────────────────────────────

      addObservation: (data) => {
        const observation: SessionObservation = {
          ...data,
          id: crypto.randomUUID(),
          recordedAt: new Date().toISOString(),
        };
        set((s) => ({ observations: [...s.observations, observation] }));
      },

      getObservationsByChildId: (childId) =>
        get().observations.filter((o) => o.childId === childId),

      // ── Weekly Plans ──────────────────────────────────────────────────────

      upsertWeeklyPlan: (childId, entries) => {
        set((s) => {
          const exists = s.weeklyPlans.some((p) => p.childId === childId);
          if (exists) {
            return {
              weeklyPlans: s.weeklyPlans.map((p) =>
                p.childId === childId
                  ? { ...p, entries, updatedAt: new Date().toISOString() }
                  : p
              ),
            };
          }
          return {
            weeklyPlans: [
              ...s.weeklyPlans,
              {
                id: crypto.randomUUID(),
                childId,
                entries,
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      getWeeklyPlanByChildId: (childId) =>
        get().weeklyPlans.find((p) => p.childId === childId),

      // ── Adaptive Profiles ─────────────────────────────────────────────────

      getAdaptiveProfile: (childId, gameCode) =>
        get().adaptiveProfiles.find(
          (p) => p.childId === childId && p.gameCode === gameCode
        ),

      updateAdaptiveProfile: (childId, gameCode, level) => {
        set((s) => {
          const exists = s.adaptiveProfiles.some(
            (p) => p.childId === childId && p.gameCode === gameCode
          );
          if (exists) {
            return {
              adaptiveProfiles: s.adaptiveProfiles.map((p) => {
                if (p.childId !== childId || p.gameCode !== gameCode) return p;
                return {
                  ...p,
                  currentLevel: level,
                  sessionsAtLevel:
                    p.currentLevel === level ? p.sessionsAtLevel + 1 : 1,
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }
          return {
            adaptiveProfiles: [
              ...s.adaptiveProfiles,
              {
                childId,
                gameCode,
                currentLevel: level,
                sessionsAtLevel: 1,
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      // ── Therapeutic Profiles ──────────────────────────────────────────────

      getTherapeuticProfile: (childId) =>
        get().therapeuticProfiles.find((p) => p.childId === childId),

      upsertTherapeuticProfile: (data) => {
        set((s) => {
          const exists = s.therapeuticProfiles.some(
            (p) => p.childId === data.childId
          );
          const updatedAt = new Date().toISOString();
          if (exists) {
            return {
              therapeuticProfiles: s.therapeuticProfiles.map((p) =>
                p.childId === data.childId ? { ...p, ...data, updatedAt } : p
              ),
            };
          }
          return {
            therapeuticProfiles: [
              ...s.therapeuticProfiles,
              { ...data, id: crypto.randomUUID(), updatedAt },
            ],
          };
        });
      },

      // ── Caregivers ────────────────────────────────────────────────────────

      addCaregiver: (data) => {
        const caregiver: Caregiver = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ caregivers: [...s.caregivers, caregiver] }));
        return caregiver;
      },

      updateCaregiver: (id, data) => {
        set((s) => ({
          caregivers: s.caregivers.map((cg) =>
            cg.id === id ? { ...cg, ...data } : cg
          ),
        }));
      },

      deleteCaregiver: (id) => {
        set((s) => ({
          caregivers: s.caregivers.filter((cg) => cg.id !== id),
        }));
      },

      getCaregiverById: (id) => get().caregivers.find((cg) => cg.id === id),

      getCaregiversByChildId: (childId) =>
        get().caregivers.filter((cg) => cg.linkedChildIds.includes(childId)),

      linkCaregiverToChild: (caregiverId, childId) => {
        set((s) => ({
          caregivers: s.caregivers.map((cg) => {
            if (cg.id !== caregiverId) return cg;
            if (cg.linkedChildIds.includes(childId)) return cg;
            return { ...cg, linkedChildIds: [...cg.linkedChildIds, childId] };
          }),
        }));
      },

      unlinkCaregiverFromChild: (caregiverId, childId) => {
        set((s) => ({
          caregivers: s.caregivers.map((cg) => {
            if (cg.id !== caregiverId) return cg;
            return {
              ...cg,
              linkedChildIds: cg.linkedChildIds.filter((id) => id !== childId),
            };
          }),
        }));
      },
    }),
    {
      name: 'its-time-do-learn',
      version: 3,
      migrate: () => ({
        children: INITIAL_CHILDREN,
        sessions: INITIAL_SESSIONS,
        goals: INITIAL_GOALS,
        observations: INITIAL_OBSERVATIONS,
        weeklyPlans: INITIAL_WEEKLY_PLANS,
        adaptiveProfiles: INITIAL_ADAPTIVE_PROFILES,
        therapeuticProfiles: INITIAL_THERAPEUTIC_PROFILES,
        caregivers: INITIAL_CAREGIVERS,
      }),
    }
  )
);
