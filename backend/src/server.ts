import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { UserRepository } from './repositories/UserRepository.js';
import { BugRepository } from './repositories/BugRepository.js';
import { AuthService } from './services/AuthService.js';
import { BugService } from './services/BugService.js';
import { EmailService } from './services/EmailService.js';
import { AuthController } from './controllers/AuthController.js';
import { BugController } from './controllers/BugController.js';
import { createAuthRoutes } from './routes/auth.js';
import { createBugRoutes } from './routes/bugs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const userRepository = new UserRepository();
const bugRepository = new BugRepository();
const emailService = new EmailService();
const authService = new AuthService(userRepository, emailService);
const bugService = new BugService(bugRepository);
const authController = new AuthController(authService);
const bugController = new BugController(bugService);

app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/bugs', createBugRoutes(bugController));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();