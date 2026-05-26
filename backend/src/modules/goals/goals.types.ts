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

export interface CreateGoalDto {
  childId: string;
  skill: TherapeuticSkill;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  active: boolean;
}

export interface UpdateGoalProgressDto {
  currentValue: number;
}
