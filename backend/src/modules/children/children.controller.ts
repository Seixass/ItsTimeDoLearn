import { Request, Response, NextFunction } from 'express';
import { childrenService } from './children.service';
import { ok, created, noContent } from '../../common/response';
import type { CreateChildDto, UpdateChildDto } from './children.types';

export const childrenController = {
  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const children = await childrenService.listAll();
      ok(res, children);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const child = await childrenService.getById(req.params.id);
      ok(res, child);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateChildDto = {
        name:      req.body.name,
        avatar:    req.body.avatar,
        birthdate: req.body.birthdate,
        notes:     req.body.notes,
      };
      const child = await childrenService.create(dto);
      created(res, child);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateChildDto = {
        name:      req.body.name,
        avatar:    req.body.avatar,
        birthdate: req.body.birthdate,
        notes:     req.body.notes,
      };
      const child = await childrenService.update(req.params.id, dto);
      ok(res, child);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await childrenService.remove(req.params.id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  },
};
