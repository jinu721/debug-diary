import { Environment, Severity, RootCauseCategory } from '../types/index.js';

export interface CreateBugDto {
  title: string;
  environment: Environment;
  severity: Severity;
  codeSnippet?: string;
  errorMessage?: string;
  bugDetails: string;
  technologyTags: string[];
}

export interface UpdateBugDto {
  title?: string;
  environment?: Environment;
  severity?: Severity;
  codeSnippet?: string;
  errorMessage?: string;
  bugDetails?: string;
  rootCauseExplanation?: string;
  rootCauseCategory?: RootCauseCategory;
  fixDocumentation?: string;
  fixSummary?: string;
  technologyTags?: string[];
  isReusableFix?: boolean;
  fixedAt?: Date;
}

export interface BugResponseDto {
  id: string;
  title: string;
  environment: Environment;
  severity: Severity;
  codeSnippet?: string;
  errorMessage?: string;
  bugDetails: string;
  rootCauseExplanation?: string;
  rootCauseCategory?: RootCauseCategory;
  fixDocumentation?: string;
  fixSummary?: string;
  technologyTags: string[];
  isReusableFix: boolean;
  createdAt: Date;
  updatedAt: Date;
  fixedAt?: Date;
}

export interface BugFiltersDto {
  search?: string;
  severity?: Severity;
  rootCauseCategory?: RootCauseCategory;
  technologyTags?: string[];
  isReusableFix?: boolean;
}