import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/services.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        res.status(400).json({ error: 'Invalid verification token' });
        return;
      }

      const result = await this.authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
        res.status(400).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: 'Verification failed' });
      }
    }
  };
}