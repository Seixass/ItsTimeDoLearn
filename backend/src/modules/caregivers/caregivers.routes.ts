import { Router } from 'express';
import { caregiversController } from './caregivers.controller';

export const caregiversRouter = Router();

caregiversRouter.get('/',                           caregiversController.listAll);
caregiversRouter.get('/children/:childId',          caregiversController.findByChildId);
caregiversRouter.get('/:id',                        caregiversController.getById);
caregiversRouter.post('/',                          caregiversController.create);
caregiversRouter.patch('/:id',                      caregiversController.update);
caregiversRouter.delete('/:id',                     caregiversController.remove);
caregiversRouter.post('/:id/children/:childId',     caregiversController.linkChild);
caregiversRouter.delete('/:id/children/:childId',   caregiversController.unlinkChild);
