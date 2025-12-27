export interface User {
  _id: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BugEntry {
  _id: string;
  userId: string;
  title: string;
  environment: 'local' | 'staging' | 'production' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  codeSnippet?: string;
  errorMessage?: string;
  bugDetails: string;
  rootCauseExplanation?: string;
  rootCauseCategory?: 'logic' | 'syntax' | 'configuration' | 'dependency';
  fixDocumentation?: string;
  fixSummary?: string;
  technologyTags: string[];
  isReusableFix: boolean;
  createdAt: Date;
  updatedAt: Date;
  fixedAt?: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export type RootCauseCategory = 'logic' | 'syntax' | 'configuration' | 'dependency';
export type Environment = 'local' | 'staging' | 'production' | 'other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';