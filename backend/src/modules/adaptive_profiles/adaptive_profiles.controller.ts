import { Request, Response, NextFunction } from 'express';
import { adaptiveProfilesService } from './adaptive_profiles.service';
import { ok } from '../../common/response';

export const adaptiveProfilesController = {
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { childId, gameCode } = req.params;
      const data = await adaptiveProfilesService.getOne(childId, gameCode);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getByChildId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adaptiveProfilesService.getByChildId(req.params.childId);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const { childId, gameCode } = req.params;
      const profile = await adaptiveProfilesService.upsert(childId, gameCode, req.body);
      ok(res, profile);
    } catch (err) {
      next(err);
    }
  },
};
