import { ValidationError } from '../../common/errors';
import { sessionsRepository } from './sessions.repository';
import type { GameSession, CreateSessionDto } from './sessions.types';

export const sessionsService = {
  async getByChildId(childId: string): Promise<GameSession[]> {
    return sessionsRepository.findByChildId(childId);
  },

  async create(dto: CreateSessionDto): Promise<GameSession> {
    if (!dto.childId) throw new ValidationError('childId é obrigatório');
    if (!dto.gameCode) throw new ValidationError('gameCode é obrigatório');
    if (!dto.startedAt) throw new ValidationError('startedAt é obrigatório');
    if (!dto.endedAt) throw new ValidationError('endedAt é obrigatório');
    return sessionsRepository.create(dto);
  },
};
