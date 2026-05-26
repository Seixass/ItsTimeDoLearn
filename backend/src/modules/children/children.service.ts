import { childrenRepository } from './children.repository';
import { NotFoundError, ValidationError } from '../../common/errors';
import type { Child, CreateChildDto, UpdateChildDto } from './children.types';

export const childrenService = {
  async listAll(): Promise<Child[]> {
    return childrenRepository.findAll();
  },

  async getById(id: string): Promise<Child> {
    const child = await childrenRepository.findById(id);
    if (!child) throw new NotFoundError('Criança');
    return child;
  },

  async create(dto: CreateChildDto): Promise<Child> {
    if (!dto.name?.trim()) {
      throw new ValidationError('O nome da criança é obrigatório');
    }
    if (dto.birthdate && isNaN(Date.parse(dto.birthdate))) {
      throw new ValidationError('Data de nascimento inválida');
    }
    return childrenRepository.create({ ...dto, name: dto.name.trim() });
  },

  async update(id: string, dto: UpdateChildDto): Promise<Child> {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new ValidationError('O nome da criança é obrigatório');
    }
    if (dto.birthdate && isNaN(Date.parse(dto.birthdate))) {
      throw new ValidationError('Data de nascimento inválida');
    }
    const payload = dto.name ? { ...dto, name: dto.name.trim() } : dto;
    const child = await childrenRepository.update(id, payload);
    if (!child) throw new NotFoundError('Criança');
    return child;
  },

  async remove(id: string): Promise<void> {
    const deleted = await childrenRepository.remove(id);
    if (!deleted) throw new NotFoundError('Criança');
  },
};
