export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BugEntry {
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
  createdAt: string;
  updatedAt: string;
  fixedAt?: string;
}

export type Environment = 'local' | 'staging' | 'production' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type RootCauseCategory = 'logic' | 'syntax' | 'configuration' | 'dependency';

export interface BugFilters {
  search?: string;
  severity?: Severity;
  rootCauseCategory?: RootCauseCategory;
  technologyTags?: string[];
  isReusableFix?: boolean;
}

export interface CreateBugData {
  title: string;
  environment: Environment;
  severity: Severity;
  codeSnippet?: string;
  errorMessage?: string;
  bugDetails: string;
  technologyTags: string[];
}

export interface UpdateBugData {
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