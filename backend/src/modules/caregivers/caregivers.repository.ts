import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { Caregiver, CreateCaregiverDto, UpdateCaregiverDto } from './caregivers.types';

interface CaregiverRow extends RowDataPacket {
  id: string;
  name: string;
  relation: string;
  phone: string | null;
  email: string | null;
  monitoring_preferences: string[] | null;
  notes: string | null;
  created_at: Date;
}

interface LinkRow extends RowDataPacket {
  child_id: string;
}

async function fetchLinkedChildIds(caregiverId: string): Promise<string[]> {
  const [rows] = await getPool().query<LinkRow[]>(
    'SELECT child_id FROM caregiver_children WHERE caregiver_id = ?',
    [caregiverId],
  );
  return rows.map((r) => r.child_id);
}

async function mapRow(row: CaregiverRow): Promise<Caregiver> {
  const linkedChildIds = await fetchLinkedChildIds(row.id);
  return {
    id: row.id,
    name: row.name,
    relation: row.relation as Caregiver['relation'],
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    linkedChildIds,
    monitoringPreferences: row.monitoring_preferences ?? [],
    notes: row.notes ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export const caregiversRepository = {
  async findAll(): Promise<Caregiver[]> {
    const [rows] = await getPool().query<CaregiverRow[]>(
      'SELECT * FROM caregivers ORDER BY created_at DESC',
    );
    return Promise.all(rows.map(mapRow));
  },

  async findById(id: string): Promise<Caregiver | null> {
    const [rows] = await getPool().query<CaregiverRow[]>(
      'SELECT * FROM caregivers WHERE id = ?',
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async findByChildId(childId: string): Promise<Caregiver[]> {
    const [rows] = await getPool().query<CaregiverRow[]>(
      `SELECT cg.* FROM caregivers cg
       INNER JOIN caregiver_children cc ON cc.caregiver_id = cg.id
       WHERE cc.child_id = ?
       ORDER BY cg.created_at DESC`,
      [childId],
    );
    return Promise.all(rows.map(mapRow));
  },

  async create(dto: CreateCaregiverDto): Promise<Caregiver> {
    const id = randomUUID();
    const pool = getPool();

    await pool.query<ResultSetHeader>(
      `INSERT INTO caregivers (id, name, relation, phone, email, monitoring_preferences, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dto.name,
        dto.relation,
        dto.phone ?? null,
        dto.email ?? null,
        JSON.stringify(dto.monitoringPreferences ?? []),
        dto.notes ?? null,
      ],
    );

    if (dto.linkedChildIds?.length) {
      const linkValues = dto.linkedChildIds.map((childId) => [id, childId]);
      await pool.query(
        'INSERT IGNORE INTO caregiver_children (caregiver_id, child_id) VALUES ?',
        [linkValues],
      );
    }

    return (await this.findById(id))!;
  },

  async update(id: string, dto: UpdateCaregiverDto): Promise<Caregiver | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.name !== undefined)                  { fields.push('name = ?');                   values.push(dto.name); }
    if (dto.relation !== undefined)              { fields.push('relation = ?');               values.push(dto.relation); }
    if (dto.phone !== undefined)                 { fields.push('phone = ?');                  values.push(dto.phone ?? null); }
    if (dto.email !== undefined)                 { fields.push('email = ?');                  values.push(dto.email ?? null); }
    if (dto.monitoringPreferences !== undefined) { fields.push('monitoring_preferences = ?'); values.push(JSON.stringify(dto.monitoringPreferences)); }
    if (dto.notes !== undefined)                 { fields.push('notes = ?');                  values.push(dto.notes ?? null); }

    const pool = getPool();

    if (fields.length > 0) {
      values.push(id);
      await pool.query<ResultSetHeader>(
        `UPDATE caregivers SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );
    }

    if (dto.linkedChildIds !== undefined) {
      await pool.query('DELETE FROM caregiver_children WHERE caregiver_id = ?', [id]);
      if (dto.linkedChildIds.length > 0) {
        const linkValues = dto.linkedChildIds.map((childId) => [id, childId]);
        await pool.query(
          'INSERT IGNORE INTO caregiver_children (caregiver_id, child_id) VALUES ?',
          [linkValues],
        );
      }
    }

    return this.findById(id);
  },

  async remove(id: string): Promise<boolean> {
    const [result] = await getPool().query<ResultSetHeader>(
      'DELETE FROM caregivers WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async linkChild(caregiverId: string, childId: string): Promise<Caregiver | null> {
    const caregiver = await this.findById(caregiverId);
    if (!caregiver) return null;
    await getPool().query(
      'INSERT IGNORE INTO caregiver_children (caregiver_id, child_id) VALUES (?, ?)',
      [caregiverId, childId],
    );
    return this.findById(caregiverId);
  },

  async unlinkChild(caregiverId: string, childId: string): Promise<Caregiver | null> {
    const caregiver = await this.findById(caregiverId);
    if (!caregiver) return null;
    await getPool().query(
      'DELETE FROM caregiver_children WHERE caregiver_id = ? AND child_id = ?',
      [caregiverId, childId],
    );
    return this.findById(caregiverId);
  },
};
