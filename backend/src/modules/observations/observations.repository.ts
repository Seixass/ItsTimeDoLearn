import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { SessionObservation, CreateObservationDto } from './observations.types';

interface ObservationRow extends RowDataPacket {
  id: string;
  session_id: string;
  child_id: string;
  activity_code: string;
  needed_help: number;
  focus_level: number;
  frustration_level: number;
  engagement_level: number;
  notes: string | null;
  recorded_at: Date;
}

function mapRow(row: ObservationRow): SessionObservation {
  return {
    id: row.id,
    sessionId: row.session_id,
    childId: row.child_id,
    gameCode: row.activity_code,
    neededHelp: row.needed_help === 1,
    focusLevel: row.focus_level as SessionObservation['focusLevel'],
    frustrationLevel: row.frustration_level as SessionObservation['frustrationLevel'],
    engagementLevel: row.engagement_level as SessionObservation['engagementLevel'],
    notes: row.notes ?? '',
    recordedAt: row.recorded_at.toISOString(),
  };
}

export const observationsRepository = {
  async findByChildId(childId: string): Promise<SessionObservation[]> {
    const [rows] = await getPool().query<ObservationRow[]>(
      'SELECT * FROM session_observations WHERE child_id = ? ORDER BY recorded_at DESC',
      [childId],
    );
    return rows.map(mapRow);
  },

  async create(dto: CreateObservationDto): Promise<SessionObservation> {
    const id = randomUUID();
    await getPool().query<ResultSetHeader>(
      `INSERT INTO session_observations
         (id, session_id, child_id, activity_code, needed_help,
          focus_level, frustration_level, engagement_level, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dto.sessionId,
        dto.childId,
        dto.gameCode,
        dto.neededHelp ? 1 : 0,
        dto.focusLevel,
        dto.frustrationLevel,
        dto.engagementLevel,
        dto.notes || null,
      ],
    );
    const [rows] = await getPool().query<ObservationRow[]>(
      'SELECT * FROM session_observations WHERE id = ?',
      [id],
    );
    return mapRow(rows[0]);
  },
};
