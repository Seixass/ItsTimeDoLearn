import { Router } from 'express';
import { weeklyPlansController } from './weekly_plans.controller';

export const weeklyPlansRouter = Router();

weeklyPlansRouter.get('/children/:childId', weeklyPlansController.getByChildId);
weeklyPlansRouter.put('/children/:childId', weeklyPlansController.upsert);
