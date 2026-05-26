import { activitiesRepository } from './activities.repository';
import { NotFoundError, ValidationError } from '../../common/errors';
import type { Activity, ActivityCategory, ActivityFilters, ActivityStatus } from './activities.types';

const VALID_CATEGORIES = new Set<ActivityCategory>([
  'executive_functions', 'sensory_regulation', 'social_emotional',
  'attention_focus', 'language_communication', 'routine_organization', 'motor_skills',
]);

const VALID_STATUSES = new Set<ActivityStatus>([
  'interactive_game', 'guided_activity', 'offline_assisted',
]);

export const activitiesService = {
  async listAll(query: Record<string, string>): Promise<Activity[]> {
    const filters: ActivityFilters = {};

    if (query.category) {
      if (!VALID_CATEGORIES.has(query.category as ActivityCategory)) {
        throw new ValidationError(`Categoria inválida: ${query.category}`);
      }
      filters.category = query.category as ActivityCategory;
    }

    if (query.status) {
      if (!VALID_STATUSES.has(query.status as ActivityStatus)) {
        throw new ValidationError(`Status inválido: ${query.status}`);
      }
      filters.status = query.status as ActivityStatus;
    }

    if (query.ageMin !== undefined) filters.ageMin = Number(query.ageMin);
    if (query.ageMax !== undefined) filters.ageMax = Number(query.ageMax);
    if (query.requiresMediation !== undefined) {
      filters.requiresMediation = query.requiresMediation === 'true';
    }

    return activitiesRepository.findAll(filters);
  },

  async getByCode(code: string): Promise<Activity> {
    const activity = await activitiesRepository.findByCode(code);
    if (!activity) throw new NotFoundError(`Atividade '${code}'`);
    return activity;
  },
};
