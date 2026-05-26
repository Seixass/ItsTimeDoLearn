export type GameCode = 'sequence_routine' | 'find_object' | 'memory_cards';

export interface GameSession {
  id: string;
  childId: string;
  gameCode: GameCode;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  success: boolean;
  meta: Record<string, unknown>;
}

export interface CreateSessionDto {
  childId: string;
  gameCode: GameCode;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  success: boolean;
  meta: Record<string, unknown>;
}
