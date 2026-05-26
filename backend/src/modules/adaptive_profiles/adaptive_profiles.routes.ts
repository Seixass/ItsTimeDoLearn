import { Router } from 'express';
import { adaptiveProfilesController } from './adaptive_profiles.controller';

export const adaptiveProfilesRouter = Router();

adaptiveProfilesRouter.get('/children/:childId', adaptiveProfilesController.getByChildId);
adaptiveProfilesRouter.get('/children/:childId/games/:gameCode', adaptiveProfilesController.getOne);
adaptiveProfilesRouter.put('/children/:childId/games/:gameCode', adaptiveProfilesController.upsert);
