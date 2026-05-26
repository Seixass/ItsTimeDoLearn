import { Router } from 'express';
import { recommendationsController } from './recommendations.controller';

export const recommendationsRouter = Router();

recommendationsRouter.get('/children/:childId', recommendationsController.getForChild);
