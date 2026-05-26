import { ValidationError, NotFoundError } from '../../common/errors';
import { goalsRepository } from './goals.repository';
import type { TherapeuticGoal, CreateGoalDto } from './goals.types';

export const goalsService = {
  async getByChildId(childId: string): Promise<TherapeuticGoal[]> {
    return goalsRepository.findByChildId(childId);
  },

  async create(dto: CreateGoalDto): Promise<TherapeuticGoal> {
    if (!dto.childId) throw new ValidationError('childId é obrigatório');
    if (!dto.skill) throw new ValidationError('skill é obrigatória');
    if (!dto.description) throw new ValidationError('description é obrigatória');
    return goalsRepository.create(dto);
  },

  async updateProgress(id: string, currentValue: number): Promise<TherapeuticGoal> {
    const goal = await goalsRepository.updateProgress(id, currentValue);
    if (!goal) throw new NotFoundError('Meta');
    return goal;
  },

  async toggleActive(id: string): Promise<TherapeuticGoal> {
    const goal = await goalsRepository.toggleActive(id);
    if (!goal) throw new NotFoundError('Meta');
    return goal;
  },
};
