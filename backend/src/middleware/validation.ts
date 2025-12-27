import { Request, Response, NextFunction } from 'express';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  next();
};

export const validateCreateBug = (req: Request, res: Response, next: NextFunction): void => {
  const { title, environment, severity, bugDetails } = req.body;

  if (!title || !environment || !severity || !bugDetails) {
    res.status(400).json({ error: 'Title, environment, severity, and bug details are required' });
    return;
  }

  const validEnvironments = ['local', 'staging', 'production', 'other'];
  const validSeverities = ['low', 'medium', 'high', 'critical'];

  if (!validEnvironments.includes(environment)) {
    res.status(400).json({ error: 'Invalid environment' });
    return;
  }

  if (!validSeverities.includes(severity)) {
    res.status(400).json({ error: 'Invalid severity' });
    return;
  }

  next();
};