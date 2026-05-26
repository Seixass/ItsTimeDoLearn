import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { AdaptiveProfile, UpsertAdaptiveProfileDto } from './adaptive_profiles.types';

interface ProfileRow extends RowDataPacket {
  child_id: string;
  game_code: string;
  current_level: string;
  sessions_at_level: number;
  updated_at: Date;
}

function mapRow(row: ProfileRow): AdaptiveProfile {
  return {
    childId: row.child_id,
    gameCode: row.game_code,
    currentLevel: row.current_level as AdaptiveProfile['currentLevel'],
    sessionsAtLevel: row.sessions_at_level,
    updatedAt: row.updated_at.toISOString(),
  };
}

export const adaptiveProfilesRepository = {
  async findOne(childId: string, gameCode: string): Promise<AdaptiveProfile | null> {
    const [rows] = await getPool().query<ProfileRow[]>(
      'SELECT * FROM adaptive_profiles WHERE child_id = ? AND game_code = ?',
      [childId, gameCode],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async findByChildId(childId: string): Promise<AdaptiveProfile[]> {
    const [rows] = await getPool().query<ProfileRow[]>(
      'SELECT * FROM adaptive_profiles WHERE child_id = ?',
      [childId],
    );
    return rows.map(mapRow);
  },

  async upsert(childId: string, gameCode: string, dto: UpsertAdaptiveProfileDto): Promise<AdaptiveProfile> {
    await getPool().query<ResultSetHeader>(
      `INSERT INTO adaptive_profiles (child_id, game_code, current_level, sessions_at_level)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         current_level     = VALUES(current_level),
         sessions_at_level = VALUES(sessions_at_level)`,
      [childId, gameCode, dto.currentLevel, dto.sessionsAtLevel],
    );
    return (await this.findOne(childId, gameCode))!;
  },
};
