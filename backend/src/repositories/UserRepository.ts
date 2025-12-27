import { IUserRepository } from '../interfaces/repositories.js';
import { UserModel } from '../models/User.js';
import { User } from '../types/index.js';

export class UserRepository implements IUserRepository {
  async create(userData: Partial<User>): Promise<User> {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean();
    return user;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await UserModel.findOne({ verificationToken: token }).lean();
    return user;
  }

  async updateVerificationStatus(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { 
      isVerified: true,
      $unset: { verificationToken: 1 }
    });
  }

  async clearVerificationToken(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $unset: { verificationToken: 1 }
    });
  }
}