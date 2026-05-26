import { randomUUID } from 'crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connection';
import type { Child, CreateChildDto, UpdateChildDto } from './children.types';

interface ChildRow extends RowDataPacket {
  id: string;
  name: string;
  avatar: string | null;
  birthdate: string | null;
  notes: string | null;
  created_at: Date;
}

function mapRow(row: ChildRow): Child {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar ?? undefined,
    birthdate: row.birthdate ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export const childrenRepository = {
  async findAll(): Promise<Child[]> {
    const [rows] = await getPool().query<ChildRow[]>(
      'SELECT * FROM children ORDER BY created_at DESC',
    );
    return rows.map(mapRow);
  },

  async findById(id: string): Promise<Child | null> {
    const [rows] = await getPool().query<ChildRow[]>(
      'SELECT * FROM children WHERE id = ?',
      [id],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async create(dto: CreateChildDto): Promise<Child> {
    const id = randomUUID();
    await getPool().query<ResultSetHeader>(
      'INSERT INTO children (id, name, avatar, birthdate, notes) VALUES (?, ?, ?, ?, ?)',
      [id, dto.name, dto.avatar ?? null, dto.birthdate ?? null, dto.notes ?? null],
    );
    return (await this.findById(id))!;
  },

  async update(id: string, dto: UpdateChildDto): Promise<Child | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.name !== undefined)      { fields.push('name = ?');      values.push(dto.name); }
    if (dto.avatar !== undefined)    { fields.push('avatar = ?');    values.push(dto.avatar ?? null); }
    if (dto.birthdate !== undefined) { fields.push('birthdate = ?'); values.push(dto.birthdate ?? null); }
    if (dto.notes !== undefined)     { fields.push('notes = ?');     values.push(dto.notes ?? null); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await getPool().query<ResultSetHeader>(
      `UPDATE children SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return this.findById(id);
  },

  async remove(id: string): Promise<boolean> {
    const [result] = await getPool().query<ResultSetHeader>(
      'DELETE FROM children WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};
