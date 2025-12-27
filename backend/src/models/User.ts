import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types/index.js';

interface UserDocument extends Omit<User, '_id'>, Document {}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);