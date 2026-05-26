import { Router } from 'express';
import { observationsController } from './observations.controller';

export const observationsRouter = Router();

observationsRouter.get('/children/:childId', observationsController.getByChildId);
observationsRouter.post('/', observationsController.create);
