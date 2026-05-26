import { Router } from 'express';
import { sessionsController } from './sessions.controller';

export const sessionsRouter = Router();

sessionsRouter.get('/children/:childId', sessionsController.getByChildId);
sessionsRouter.post('/', sessionsController.create);
