export type ActivityCategory =
  | 'executive_functions'
  | 'sensory_regulation'
  | 'social_emotional'
  | 'attention_focus'
  | 'language_communication'
  | 'routine_organization'
  | 'motor_skills';

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

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ActivityStatus =
  | 'interactive_game'
  | 'guided_activity'
  | 'offline_assisted';

export interface Activity {
  id: string;
  code: string;
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

export interface ActivityFilters {
  category?: ActivityCategory;
  status?: ActivityStatus;
  ageMin?: number;
  ageMax?: number;
  requiresMediation?: boolean;
}
