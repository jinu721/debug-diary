import { Router } from 'express';
import { BugController } from '../controllers/BugController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateCreateBug } from '../middleware/validation.js';

export const createBugRoutes = (bugController: BugController): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.post('/', validateCreateBug, bugController.createBug);
  router.get('/', bugController.getUserBugs);
  router.get('/reusable-fixes', bugController.getReusableFixes);
  router.get('/:id', bugController.getBugById);
  router.put('/:id', bugController.updateBug);
  router.delete('/:id', bugController.deleteBug);

  return router;
};