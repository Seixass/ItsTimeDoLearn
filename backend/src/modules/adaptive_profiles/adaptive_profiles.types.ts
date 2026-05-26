export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AdaptiveProfile {
  childId: string;
  gameCode: string;
  currentLevel: DifficultyLevel;
  sessionsAtLevel: number;
  updatedAt: string;
}

export interface UpsertAdaptiveProfileDto {
  currentLevel: DifficultyLevel;
  sessionsAtLevel: number;
}
