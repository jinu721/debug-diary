import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IAuthService, IEmailService } from '../interfaces/services.js';
import { IUserRepository } from '../interfaces/repositories.js';
import { SignupDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto.js';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async signup(signupData: SignupDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(signupData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.userRepository.create({
      email: signupData.email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.emailService.sendVerificationEmail(signupData.email, verificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified
      }
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await this.userRepository.updateVerificationStatus(user._id);

    return { message: 'Email verified successfully. You can now log in.' };
  }
}