import mongoose, { Schema, Document } from 'mongoose';
import { BugEntry } from '../types/index.js';

interface BugEntryDocument extends Omit<BugEntry, '_id'>, Document {}

const bugEntrySchema = new Schema<BugEntryDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  environment: {
    type: String,
    enum: ['local', 'staging', 'production', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  codeSnippet: {
    type: String,
    trim: true
  },
  errorMessage: {
    type: String,
    trim: true
  },
  bugDetails: {
    type: String,
    required: true,
    trim: true
  },
  rootCauseExplanation: {
    type: String,
    trim: true
  },
  rootCauseCategory: {
    type: String,
    enum: ['logic', 'syntax', 'configuration', 'dependency']
  },
  fixDocumentation: {
    type: String,
    trim: true
  },
  fixSummary: {
    type: String,
    trim: true
  },
  technologyTags: [{
    type: String,
    trim: true
  }],
  isReusableFix: {
    type: Boolean,
    default: false
  },
  fixedAt: {
    type: Date
  }
}, {
  timestamps: true
});

bugEntrySchema.index({ userId: 1, createdAt: -1 });
bugEntrySchema.index({ userId: 1, title: 'text', errorMessage: 'text', fixDocumentation: 'text' });

export const BugEntryModel = mongoose.model<BugEntryDocument>('BugEntry', bugEntrySchema);