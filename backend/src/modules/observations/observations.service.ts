import { ValidationError } from '../../common/errors';
import { observationsRepository } from './observations.repository';
import type { SessionObservation, CreateObservationDto } from './observations.types';

export const observationsService = {
  async getByChildId(childId: string): Promise<SessionObservation[]> {
    return observationsRepository.findByChildId(childId);
  },

  async create(dto: CreateObservationDto): Promise<SessionObservation> {
    if (!dto.sessionId) throw new ValidationError('sessionId é obrigatório');
    if (!dto.childId) throw new ValidationError('childId é obrigatório');
    return observationsRepository.create(dto);
  },
};
