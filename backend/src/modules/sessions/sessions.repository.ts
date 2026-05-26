import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { GameSession, CreateSessionDto } from './sessions.types';

interface SessionRow extends RowDataPacket {
  id: string;
  child_id: string;
  activity_code: string;
  started_at: Date;
  ended_at: Date | null;
  duration_seconds: number | null;
  success: number;
  meta: Record<string, unknown> | null;
}

function mapRow(row: SessionRow): GameSession {
  return {
    id: row.id,
    childId: row.child_id,
    gameCode: row.activity_code as GameSession['gameCode'],
    startedAt: row.started_at.toISOString(),
    endedAt: row.ended_at ? row.ended_at.toISOString() : '',
    durationSeconds: row.duration_seconds ?? 0,
    success: row.success === 1,
    meta: row.meta ?? {},
  };
}

export const sessionsRepository = {
  async findByChildId(childId: string): Promise<GameSession[]> {
    const [rows] = await getPool().query<SessionRow[]>(
      'SELECT * FROM game_sessions WHERE child_id = ? ORDER BY started_at DESC',
      [childId],
    );
    return rows.map(mapRow);
  },

  async findById(id: string): Promise<GameSession | null> {
    const [rows] = await getPool().query<SessionRow[]>(
      'SELECT * FROM game_sessions WHERE id = ?',
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(dto: CreateSessionDto): Promise<GameSession> {
    const id = randomUUID();
    await getPool().query<ResultSetHeader>(
      `INSERT INTO game_sessions
         (id, child_id, activity_code, started_at, ended_at, duration_seconds, success, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dto.childId,
        dto.gameCode,
        dto.startedAt,
        dto.endedAt || null,
        dto.durationSeconds,
        dto.success ? 1 : 0,
        JSON.stringify(dto.meta),
      ],
    );
    return (await this.findById(id))!;
  },
};
