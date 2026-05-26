import { caregiversRepository } from './caregivers.repository';
import { NotFoundError, ValidationError } from '../../common/errors';
import type { Caregiver, CreateCaregiverDto, UpdateCaregiverDto } from './caregivers.types';

export const caregiversService = {
  async listAll(): Promise<Caregiver[]> {
    return caregiversRepository.findAll();
  },

  async getById(id: string): Promise<Caregiver> {
    const cg = await caregiversRepository.findById(id);
    if (!cg) throw new NotFoundError('Responsável');
    return cg;
  },

  async findByChildId(childId: string): Promise<Caregiver[]> {
    return caregiversRepository.findByChildId(childId);
  },

  async create(dto: CreateCaregiverDto): Promise<Caregiver> {
    if (!dto.name?.trim()) {
      throw new ValidationError('O nome do responsável é obrigatório');
    }
    if (!dto.relation) {
      throw new ValidationError('O vínculo é obrigatório');
    }
    return caregiversRepository.create({ ...dto, name: dto.name.trim() });
  },

  async update(id: string, dto: UpdateCaregiverDto): Promise<Caregiver> {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new ValidationError('O nome do responsável é obrigatório');
    }
    const payload = dto.name ? { ...dto, name: dto.name.trim() } : dto;
    const cg = await caregiversRepository.update(id, payload);
    if (!cg) throw new NotFoundError('Responsável');
    return cg;
  },

  async remove(id: string): Promise<void> {
    const deleted = await caregiversRepository.remove(id);
    if (!deleted) throw new NotFoundError('Responsável');
  },

  async linkChild(caregiverId: string, childId: string): Promise<Caregiver> {
    const cg = await caregiversRepository.linkChild(caregiverId, childId);
    if (!cg) throw new NotFoundError('Responsável');
    return cg;
  },

  async unlinkChild(caregiverId: string, childId: string): Promise<Caregiver> {
    const cg = await caregiversRepository.unlinkChild(caregiverId, childId);
    if (!cg) throw new NotFoundError('Responsável');
    return cg;
  },
};
