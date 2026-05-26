import { Router } from 'express';
import { goalsController } from './goals.controller';

export const goalsRouter = Router();

goalsRouter.get('/children/:childId', goalsController.getByChildId);
goalsRouter.post('/', goalsController.create);
goalsRouter.patch('/:id/progress', goalsController.updateProgress);
goalsRouter.patch('/:id/toggle', goalsController.toggleActive);
