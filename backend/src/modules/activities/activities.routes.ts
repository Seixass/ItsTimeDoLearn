import { Router } from 'express';
import { activitiesController } from './activities.controller';

export const activitiesRouter = Router();

activitiesRouter.get('/',          activitiesController.listAll);
activitiesRouter.get('/:code',     activitiesController.getByCode);
