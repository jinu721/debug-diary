import { SignupDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto.js';
import { CreateBugDto, UpdateBugDto, BugResponseDto, BugFiltersDto } from '../dtos/bug.dto.js';

export interface IAuthService {
  signup(signupData: SignupDto): Promise<{ message: string }>;
  login(loginData: LoginDto): Promise<AuthResponseDto>;
  verifyEmail(token: string): Promise<{ message: string }>;
}

export interface IBugService {
  createBug(userId: string, bugData: CreateBugDto): Promise<BugResponseDto>;
  getBugById(userId: string, bugId: string): Promise<BugResponseDto>;
  getUserBugs(userId: string, filters?: BugFiltersDto): Promise<BugResponseDto[]>;
  updateBug(userId: string, bugId: string, updateData: UpdateBugDto): Promise<BugResponseDto>;
  deleteBug(userId: string, bugId: string): Promise<void>;
  getReusableFixes(userId: string): Promise<BugResponseDto[]>;
}

export interface IEmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
}