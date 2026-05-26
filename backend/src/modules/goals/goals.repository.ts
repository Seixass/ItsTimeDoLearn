import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { TherapeuticGoal, CreateGoalDto } from './goals.types';

interface GoalRow extends RowDataPacket {
  id: string;
  child_id: string;
  skill: string;
  description: string;
  target_value: string;
  current_value: string;
  unit: string;
  active: number;
  created_at: Date;
}

function mapRow(row: GoalRow): TherapeuticGoal {
  return {
    id: row.id,
    childId: row.child_id,
    skill: row.skill as TherapeuticGoal['skill'],
    description: row.description,
    targetValue: parseFloat(row.target_value),
    currentValue: parseFloat(row.current_value),
    unit: row.unit,
    active: row.active === 1,
    createdAt: row.created_at.toISOString(),
  };
}

export const goalsRepository = {
  async findByChildId(childId: string): Promise<TherapeuticGoal[]> {
    const [rows] = await getPool().query<GoalRow[]>(
      'SELECT * FROM therapeutic_goals WHERE child_id = ? ORDER BY created_at DESC',
      [childId],
    );
    return rows.map(mapRow);
  },

  async findById(id: string): Promise<TherapeuticGoal | null> {
    const [rows] = await getPool().query<GoalRow[]>(
      'SELECT * FROM therapeutic_goals WHERE id = ?',
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(dto: CreateGoalDto): Promise<TherapeuticGoal> {
    const id = randomUUID();
    await getPool().query<ResultSetHeader>(
      `INSERT INTO therapeutic_goals
         (id, child_id, skill, description, target_value, current_value, unit, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, dto.childId, dto.skill, dto.description, dto.targetValue, dto.currentValue, dto.unit, dto.active ? 1 : 0],
    );
    return (await this.findById(id))!;
  },

  async updateProgress(id: string, currentValue: number): Promise<TherapeuticGoal | null> {
    await getPool().query<ResultSetHeader>(
      'UPDATE therapeutic_goals SET current_value = ? WHERE id = ?',
      [currentValue, id],
    );
    return this.findById(id);
  },

  async toggleActive(id: string): Promise<TherapeuticGoal | null> {
    await getPool().query<ResultSetHeader>(
      'UPDATE therapeutic_goals SET active = NOT active WHERE id = ?',
      [id],
    );
    return this.findById(id);
  },
};
