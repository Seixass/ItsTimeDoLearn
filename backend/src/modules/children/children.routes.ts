import { Router } from 'express';
import { childrenController } from './children.controller';

export const childrenRouter = Router();

childrenRouter.get('/',      childrenController.listAll);
childrenRouter.get('/:id',   childrenController.getById);
childrenRouter.post('/',     childrenController.create);
childrenRouter.patch('/:id', childrenController.update);
childrenRouter.delete('/:id', childrenController.remove);
