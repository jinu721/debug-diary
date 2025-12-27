import { IBugRepository } from '../interfaces/repositories.js';
import { BugEntryModel } from '../models/BugEntry.js';
import { BugEntry } from '../types/index.js';
import { BugFiltersDto } from '../dtos/bug.dto.js';

export class BugRepository implements IBugRepository {
  async create(bugData: Partial<BugEntry>): Promise<BugEntry> {
    const bug = new BugEntryModel(bugData);
    const savedBug = await bug.save();
    return savedBug.toObject();
  }

  async findById(id: string, userId: string): Promise<BugEntry | null> {
    const bug = await BugEntryModel.findOne({ _id: id, userId }).lean();
    return bug;
  }

  async findByUserId(userId: string, filters?: BugFiltersDto): Promise<BugEntry[]> {
    const query: any = { userId };

    if (filters?.severity) {
      query.severity = filters.severity;
    }

    if (filters?.rootCauseCategory) {
      query.rootCauseCategory = filters.rootCauseCategory;
    }

    if (filters?.technologyTags && filters.technologyTags.length > 0) {
      query.technologyTags = { $in: filters.technologyTags };
    }

    if (filters?.isReusableFix !== undefined) {
      query.isReusableFix = filters.isReusableFix;
    }

    let queryBuilder = BugEntryModel.find(query);

    if (filters?.search) {
      queryBuilder = BugEntryModel.find({
        ...query,
        $text: { $search: filters.search }
      });
    }

    const bugs = await queryBuilder.sort({ createdAt: -1 }).lean();
    return bugs;
  }

  async update(id: string, userId: string, updateData: Partial<BugEntry>): Promise<BugEntry | null> {
    const updatedBug = await BugEntryModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    ).lean();
    return updatedBug;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await BugEntryModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async findReusableFixes(userId: string): Promise<BugEntry[]> {
    const bugs = await BugEntryModel.find({
      userId,
      isReusableFix: true,
      fixDocumentation: { $exists: true, $ne: '' }
    }).sort({ updatedAt: -1 }).lean();
    return bugs;
  }
}