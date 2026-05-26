import type { RowDataPacket } from 'mysql2';
import { getPool } from '../../database/connection';
import type { Activity, ActivityFilters } from './activities.types';

interface ActivityRow extends RowDataPacket {
  id: string;
  code: string;
  name: string;
  description: string | null;
  functional_objective: string | null;
  category: string;
  primary_skill: string;
  secondary_skills: string[] | null;
  age_range_min: number;
  age_range_max: number;
  recommended_profiles: string[] | null;
  caution_profiles: string[] | null;
  sensory_sensitivities: string[] | null;
  initial_difficulty: string;
  suggested_duration_min: number | null;
  requires_mediation: number;
  status: string;
  emoji: string | null;
}

function mapRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description ?? '',
    functionalObjective: row.functional_objective ?? '',
    category: row.category as Activity['category'],
    primarySkill: row.primary_skill as Activity['primarySkill'],
    secondarySkills: (row.secondary_skills ?? []) as Activity['secondarySkills'],
    ageRangeMin: row.age_range_min,
    ageRangeMax: row.age_range_max,
    recommendedProfiles: row.recommended_profiles ?? [],
    cautionProfiles: row.caution_profiles ?? [],
    sensorySensitivities: row.sensory_sensitivities ?? [],
    initialDifficulty: row.initial_difficulty as Activity['initialDifficulty'],
    suggestedDurationMinutes: row.suggested_duration_min ?? 0,
    requiresMediation: row.requires_mediation === 1,
    status: row.status as Activity['status'],
    emoji: row.emoji ?? '',
  };
}

export const activitiesRepository = {
  async findAll(filters?: ActivityFilters): Promise<Activity[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters?.category) {
      conditions.push('category = ?');
      values.push(filters.category);
    }
    if (filters?.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }
    if (filters?.requiresMediation !== undefined) {
      conditions.push('requires_mediation = ?');
      values.push(filters.requiresMediation ? 1 : 0);
    }
    if (filters?.ageMin !== undefined) {
      conditions.push('age_range_max >= ?');
      values.push(filters.ageMin);
    }
    if (filters?.ageMax !== undefined) {
      conditions.push('age_range_min <= ?');
      values.push(filters.ageMax);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await getPool().query<ActivityRow[]>(
      `SELECT * FROM activities ${where} ORDER BY id`,
      values,
    );
    return rows.map(mapRow);
  },

  async findByCode(code: string): Promise<Activity | null> {
    const [rows] = await getPool().query<ActivityRow[]>(
      'SELECT * FROM activities WHERE code = ?',
      [code],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async findById(id: string): Promise<Activity | null> {
    const [rows] = await getPool().query<ActivityRow[]>(
      'SELECT * FROM activities WHERE id = ?',
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },
};
