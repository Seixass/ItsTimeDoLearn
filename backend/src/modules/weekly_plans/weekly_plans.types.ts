export type WeekDay =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export interface SessionPlanEntry {
  day: WeekDay;
  gameCode: string;
}

export interface WeeklyPlan {
  id: string;
  childId: string;
  entries: SessionPlanEntry[];
  updatedAt: string;
}

export interface UpsertWeeklyPlanDto {
  entries: SessionPlanEntry[];
}
