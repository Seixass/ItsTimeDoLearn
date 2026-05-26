import { Request, Response, NextFunction } from 'express';
import { caregiversService } from './caregivers.service';
import { ok, created, noContent } from '../../common/response';
import type { CreateCaregiverDto, UpdateCaregiverDto } from './caregivers.types';

export const caregiversController = {
  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const caregivers = await caregiversService.listAll();
      ok(res, caregivers);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cg = await caregiversService.getById(req.params.id);
      ok(res, cg);
    } catch (err) {
      next(err);
    }
  },

  async findByChildId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const caregivers = await caregiversService.findByChildId(req.params.childId);
      ok(res, caregivers);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateCaregiverDto = {
        name:                  req.body.name,
        relation:              req.body.relation,
        phone:                 req.body.phone,
        email:                 req.body.email,
        linkedChildIds:        req.body.linkedChildIds,
        monitoringPreferences: req.body.monitoringPreferences,
        notes:                 req.body.notes,
      };
      const cg = await caregiversService.create(dto);
      created(res, cg);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateCaregiverDto = {
        name:                  req.body.name,
        relation:              req.body.relation,
        phone:                 req.body.phone,
        email:                 req.body.email,
        linkedChildIds:        req.body.linkedChildIds,
        monitoringPreferences: req.body.monitoringPreferences,
        notes:                 req.body.notes,
      };
      const cg = await caregiversService.update(req.params.id, dto);
      ok(res, cg);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await caregiversService.remove(req.params.id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  },

  async linkChild(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cg = await caregiversService.linkChild(req.params.id, req.params.childId);
      ok(res, cg);
    } catch (err) {
      next(err);
    }
  },

  async unlinkChild(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cg = await caregiversService.unlinkChild(req.params.id, req.params.childId);
      ok(res, cg);
    } catch (err) {
      next(err);
    }
  },
};
