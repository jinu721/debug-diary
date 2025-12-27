import { Request, Response } from 'express';
import { IBugService } from '../interfaces/services.js';
import { BugFiltersDto } from '../dtos/bug.dto.js';

export class BugController {
  constructor(private bugService: IBugService) {}

  createBug = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const bug = await this.bugService.createBug(userId, req.body);
      res.status(201).json(bug);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getBugById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const bug = await this.bugService.getBugById(userId, id);
      res.json(bug);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  getUserBugs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const filters: BugFiltersDto = {};

      if (req.query.search) filters.search = req.query.search as string;
      if (req.query.severity) filters.severity = req.query.severity as any;
      if (req.query.rootCauseCategory) filters.rootCauseCategory = req.query.rootCauseCategory as any;
      if (req.query.technologyTags) {
        const tags = req.query.technologyTags as string;
        filters.technologyTags = tags.split(',').map(tag => tag.trim());
      }
      if (req.query.isReusableFix !== undefined) {
        filters.isReusableFix = req.query.isReusableFix === 'true';
      }

      const bugs = await this.bugService.getUserBugs(userId, filters);
      res.json(bugs);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  updateBug = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const bug = await this.bugService.updateBug(userId, id, req.body);
      res.json(bug);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  deleteBug = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      await this.bugService.deleteBug(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  getReusableFixes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const fixes = await this.bugService.getReusableFixes(userId);
      res.json(fixes);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}