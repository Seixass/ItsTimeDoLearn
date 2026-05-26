import { adaptiveProfilesRepository } from './adaptive_profiles.repository';
import type { AdaptiveProfile, UpsertAdaptiveProfileDto } from './adaptive_profiles.types';

export const adaptiveProfilesService = {
  async getOne(childId: string, gameCode: string): Promise<AdaptiveProfile | null> {
    return adaptiveProfilesRepository.findOne(childId, gameCode);
  },

  async getByChildId(childId: string): Promise<AdaptiveProfile[]> {
    return adaptiveProfilesRepository.findByChildId(childId);
  },

  async upsert(childId: string, gameCode: string, dto: UpsertAdaptiveProfileDto): Promise<AdaptiveProfile> {
    return adaptiveProfilesRepository.upsert(childId, gameCode, dto);
  },
};
