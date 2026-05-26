import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { WeeklyPlan, UpsertWeeklyPlanDto, WeekDay } from './weekly_plans.types';

interface PlanRow extends RowDataPacket {
  id: string;
  child_id: string;
  updated_at: Date;
}

interface EntryRow extends RowDataPacket {
  day: string;
  activity_code: string;
}

async function fetchWithEntries(planRow: PlanRow): Promise<WeeklyPlan> {
  const [entries] = await getPool().query<EntryRow[]>(
    'SELECT day, activity_code FROM weekly_plan_entries WHERE plan_id = ?',
    [planRow.id],
  );
  return {
    id: planRow.id,
    childId: planRow.child_id,
    entries: entries.map((e) => ({ day: e.day as WeekDay, gameCode: e.activity_code })),
    updatedAt: planRow.updated_at.toISOString(),
  };
}

export const weeklyPlansRepository = {
  async findByChildId(childId: string): Promise<WeeklyPlan | null> {
    const [rows] = await getPool().query<PlanRow[]>(
      'SELECT * FROM weekly_plans WHERE child_id = ?',
      [childId],
    );
    return rows[0] ? fetchWithEntries(rows[0]) : null;
  },

  async upsert(childId: string, dto: UpsertWeeklyPlanDto): Promise<WeeklyPlan> {
    const pool = getPool();
    const [existing] = await pool.query<PlanRow[]>(
      'SELECT * FROM weekly_plans WHERE child_id = ?',
      [childId],
    );

    let planId: string;

    if (existing[0]) {
      planId = existing[0].id;
      await pool.query('DELETE FROM weekly_plan_entries WHERE plan_id = ?', [planId]);
    } else {
      planId = randomUUID();
      await pool.query<ResultSetHeader>(
        'INSERT INTO weekly_plans (id, child_id) VALUES (?, ?)',
        [planId, childId],
      );
    }

    if (dto.entries.length > 0) {
      const rows = dto.entries.map((e) => [randomUUID(), planId, e.day, e.gameCode]);
      await pool.query(
        'INSERT INTO weekly_plan_entries (id, plan_id, day, activity_code) VALUES ?',
        [rows],
      );
    }

    const [updated] = await pool.query<PlanRow[]>(
      'SELECT * FROM weekly_plans WHERE id = ?',
      [planId],
    );
    return fetchWithEntries(updated[0]);
  },
};
