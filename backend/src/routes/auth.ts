import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/signup', validateSignup, authController.signup);
  router.post('/login', validateLogin, authController.login);
  router.get('/verify-email', authController.verifyEmail);

  return router;
};