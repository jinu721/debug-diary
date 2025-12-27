import { IBugService } from '../interfaces/services.js';
import { IBugRepository } from '../interfaces/repositories.js';
import { CreateBugDto, UpdateBugDto, BugResponseDto, BugFiltersDto } from '../dtos/bug.dto.js';
import { BugEntry } from '../types/index.js';

export class BugService implements IBugService {
  constructor(private bugRepository: IBugRepository) {}

  async createBug(userId: string, bugData: CreateBugDto): Promise<BugResponseDto> {
    const bug = await this.bugRepository.create({
      ...bugData,
      userId,
      isReusableFix: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.mapToResponseDto(bug);
  }

  async getBugById(userId: string, bugId: string): Promise<BugResponseDto> {
    const bug = await this.bugRepository.findById(bugId, userId);
    if (!bug) {
      throw new Error('Bug not found');
    }

    return this.mapToResponseDto(bug);
  }

  async getUserBugs(userId: string, filters?: BugFiltersDto): Promise<BugResponseDto[]> {
    const bugs = await this.bugRepository.findByUserId(userId, filters);
    return bugs.map(bug => this.mapToResponseDto(bug));
  }

  async updateBug(userId: string, bugId: string, updateData: UpdateBugDto): Promise<BugResponseDto> {
    const updatedBug = await this.bugRepository.update(bugId, userId, {
      ...updateData,
      updatedAt: new Date()
    });

    if (!updatedBug) {
      throw new Error('Bug not found');
    }

    return this.mapToResponseDto(updatedBug);
  }

  async deleteBug(userId: string, bugId: string): Promise<void> {
    const deleted = await this.bugRepository.delete(bugId, userId);
    if (!deleted) {
      throw new Error('Bug not found');
    }
  }

  async getReusableFixes(userId: string): Promise<BugResponseDto[]> {
    const bugs = await this.bugRepository.findReusableFixes(userId);
    return bugs.map(bug => this.mapToResponseDto(bug));
  }

  private mapToResponseDto(bug: BugEntry): BugResponseDto {
    return {
      id: bug._id,
      title: bug.title,
      environment: bug.environment,
      severity: bug.severity,
      codeSnippet: bug.codeSnippet,
      errorMessage: bug.errorMessage,
      bugDetails: bug.bugDetails,
      rootCauseExplanation: bug.rootCauseExplanation,
      rootCauseCategory: bug.rootCauseCategory,
      fixDocumentation: bug.fixDocumentation,
      fixSummary: bug.fixSummary,
      technologyTags: bug.technologyTags,
      isReusableFix: bug.isReusableFix,
      createdAt: bug.createdAt,
      updatedAt: bug.updatedAt,
      fixedAt: bug.fixedAt
    };
  }
}