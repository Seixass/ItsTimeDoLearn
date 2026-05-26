export interface Child {
  id: string;
  name: string;
  avatar?: string;
  birthdate?: string;
  notes?: string;
}

export type GameCode = 'sequence_routine' | 'find_object' | 'memory_cards';

export interface GameType {
  code: GameCode;
  name: string;
  description: string;
  emoji: string;
}

export interface SequenceMeta {
  steps: number;
}

export interface FindObjectMeta {
  hits: number;
  misses: number;
}

export interface MemoryCardsMeta {
  attempts: number;
}

export type GameMeta = SequenceMeta | FindObjectMeta | MemoryCardsMeta;

export interface GameSession {
  id: string;
  childId: string;
  gameCode: GameCode;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  success: boolean;
  meta: GameMeta;
}

export interface GameResult {
  success: boolean;
  meta: GameMeta;
}

// ── Difficulty ──────────────────────────────────────────────────────────────

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AdaptiveProfile {
  childId: string;
  gameCode: GameCode;
  currentLevel: DifficultyLevel;
  sessionsAtLevel: number;
  updatedAt: string;
}

// ── Therapeutic Skills (extended) ────────────────────────────────────────────

export type TherapeuticSkill =
  | 'sequencing'
  | 'attention'
  | 'memory'
  | 'impulse_control'
  | 'focus'
  | 'routine_execution'
  | 'social_interaction'
  | 'emotional_regulation'
  | 'sensory_regulation'
  | 'communication';

// ── Therapeutic Goals ───────────────────────────────────────────────────────

export interface TherapeuticGoal {
  id: string;
  childId: string;
  skill: TherapeuticSkill;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  active: boolean;
  createdAt: string;
}

// ── Therapeutic Profile ──────────────────────────────────────────────────────

export type SupportLevel = 'independent' | 'minimal' | 'moderate' | 'full';
export type EngagementStyle = 'visual' | 'kinesthetic' | 'auditory' | 'mixed';

export interface ChildTherapeuticProfile {
  id: string;
  childId: string;
  conditions: string[];
  interests: string[];
  sensorySensitivities: string[];
  mainDifficulties: TherapeuticSkill[];
  idealSessionMinutes: number;
  supportLevel: SupportLevel;
  engagementStyle: EngagementStyle;
  therapeuticNotes: string;
  updatedAt: string;
}

// ── Caregiver ────────────────────────────────────────────────────────────────

export type CaregiverRelation =
  | 'mãe'
  | 'pai'
  | 'responsável legal'
  | 'terapeuta'
  | 'professor'
  | 'outro';

export interface Caregiver {
  id: string;
  name: string;
  relation: CaregiverRelation;
  phone?: string;
  email?: string;
  linkedChildIds: string[];
  monitoringPreferences: string[];
  notes?: string;
  createdAt: string;
}

// ── Activity Catalog ─────────────────────────────────────────────────────────

export type ActivityCode =
  | 'sequence_routine'
  | 'find_object'
  | 'memory_cards'
  | 'breathing_exercise'
  | 'emotion_cards'
  | 'daily_schedule_visual'
  | 'turn_taking_game'
  | 'body_movement'
  | 'storytelling_sequence'
  | 'social_situation_cards'
  | 'sensory_exploration';

export type ActivityCategory =
  | 'executive_functions'
  | 'sensory_regulation'
  | 'social_emotional'
  | 'attention_focus'
  | 'language_communication'
  | 'routine_organization'
  | 'motor_skills';

export type ActivityStatus =
  | 'interactive_game'
  | 'guided_activity'
  | 'offline_assisted';

export interface Activity {
  id: string;
  code: ActivityCode;
  name: string;
  description: string;
  functionalObjective: string;
  category: ActivityCategory;
  primarySkill: TherapeuticSkill;
  secondarySkills: TherapeuticSkill[];
  ageRangeMin: number;
  ageRangeMax: number;
  recommendedProfiles: string[];
  cautionProfiles: string[];
  sensorySensitivities: string[];
  initialDifficulty: DifficultyLevel;
  suggestedDurationMinutes: number;
  requiresMediation: boolean;
  status: ActivityStatus;
  emoji: string;
}

// ── Session Observations ────────────────────────────────────────────────────

export type ObservationLevel = 1 | 2 | 3 | 4 | 5;

export interface ObservationFormData {
  neededHelp: boolean;
  focusLevel: ObservationLevel;
  frustrationLevel: ObservationLevel;
  engagementLevel: ObservationLevel;
  notes: string;
}

export interface SessionObservation extends ObservationFormData {
  id: string;
  sessionId: string;
  childId: string;
  gameCode: GameCode;
  recordedAt: string;
}

// ── Weekly Plan ─────────────────────────────────────────────────────────────

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface SessionPlanEntry {
  day: WeekDay;
  gameCode: GameCode;
}

export interface WeeklyPlan {
  id: string;
  childId: string;
  entries: SessionPlanEntry[];
  updatedAt: string;
}

// ── Achievements ────────────────────────────────────────────────────────────

export type AchievementCode =
  | 'first_session'
  | 'five_sessions'
  | 'ten_sessions'
  | 'first_success'
  | 'three_in_a_row'
  | 'all_games_tried'
  | 'perfect_focus'
  | 'week_streak'
  | 'goal_complete'
  | 'no_help_needed';

export interface Achievement {
  code: AchievementCode;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

// ── Trail / Journey ──────────────────────────────────────────────────────────

export interface TrailPhase {
  id: number;
  name: string;
  emoji: string;
  requiredSessions: number;
  color: string;
}

// ── Theoretical References ───────────────────────────────────────────────────

export type ReferenceCategory =
  | 'play_based_interventions'
  | 'executive_functions'
  | 'serious_games'
  | 'sensory_interventions'
  | 'caregiver_mediated';

export type ReferenceType = 'article' | 'book' | 'guideline' | 'manual';

export interface TherapeuticReference {
  id: string;
  title: string;
  authors: string;
  year: number;
  type: ReferenceType;
  category: ReferenceCategory;
  summary: string;
  relevance: string;
  url?: string;
}
