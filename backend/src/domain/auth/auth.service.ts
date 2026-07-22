import bcrypt from 'bcrypt';
import type { IAuthRepository } from './auth.repository';
import type { AuthResponse, LoginCredentials, RegisterData, User } from './auth.types';
import { AppError } from '../../common/errors/AppError';
import { generateAccessToken } from '../../lib/jwt';

const BCRYPT_SALT_ROUNDS = 10;

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const email = credentials.email?.trim().toLowerCase();
    if (!email || !credentials.password) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }
    return this.issueToken(user);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const normalizedData = {
      ...data,
      email: data.email?.trim().toLowerCase() || '',
    };
    this.validateRegistration(normalizedData);
    const hashedPassword = await bcrypt.hash(normalizedData.password, BCRYPT_SALT_ROUNDS);
    const stored = await this.authRepository.create({
      ...normalizedData,
      password: hashedPassword,
    });
    return this.issueToken(stored);
  }

  private validateRegistration(data: RegisterData): void {
    if (!data.name || !data.name.trim()) {
      throw new AppError('name is required', 400);
    }
    if (!data.email || !data.email.trim()) {
      throw new AppError('email is required', 400);
    }
    if (!data.password) {
      throw new AppError('password is required', 400);
    }
    if (!data.email.includes('@')) {
      throw new AppError('Invalid email format', 400);
    }
    if (data.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }
  }

  private issueToken(user: User & { password: string }): AuthResponse {
    const publicUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: publicUser, token };
  }
}
