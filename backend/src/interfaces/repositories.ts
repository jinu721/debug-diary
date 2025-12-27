import { User, BugEntry } from '../types/index.js';
import { BugFiltersDto } from '../dtos/bug.dto.js';

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  updateVerificationStatus(id: string): Promise<void>;
  clearVerificationToken(id: string): Promise<void>;
}

export interface IBugRepository {
  create(bugData: Partial<BugEntry>): Promise<BugEntry>;
  findById(id: string, userId: string): Promise<BugEntry | null>;
  findByUserId(userId: string, filters?: BugFiltersDto): Promise<BugEntry[]>;
  update(id: string, userId: string, updateData: Partial<BugEntry>): Promise<BugEntry | null>;
  delete(id: string, userId: string): Promise<boolean>;
  findReusableFixes(userId: string): Promise<BugEntry[]>;
}