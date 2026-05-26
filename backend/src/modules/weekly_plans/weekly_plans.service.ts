import { weeklyPlansRepository } from './weekly_plans.repository';
import type { WeeklyPlan, UpsertWeeklyPlanDto } from './weekly_plans.types';

export const weeklyPlansService = {
  async getByChildId(childId: string): Promise<WeeklyPlan | null> {
    return weeklyPlansRepository.findByChildId(childId);
  },

  async upsert(childId: string, dto: UpsertWeeklyPlanDto): Promise<WeeklyPlan> {
    return weeklyPlansRepository.upsert(childId, dto);
  },
};
