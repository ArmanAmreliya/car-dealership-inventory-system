import { randomUUID } from 'crypto';
import { IAuthRepository } from './auth.repository';
import { AuthResponse, User } from './auth.types';
import { AppError } from '../../common/errors/AppError';

const tokenStore = new Map<string, User>();

export function getUserByToken(token: string): User | undefined {
  return tokenStore.get(token);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface IAuthService {
  login(data: { email: string; password: string }): Promise<AuthResponse>;
  register(data: { email: string; password: string; name: string }): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new Error('Invalid credentials');
    }
    const publicUser = this.toPublicUser(user);
    const token = randomUUID();
    tokenStore.set(token, publicUser);
    return { user: publicUser, token };
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    if (!data.name) {
      throw new AppError('name is required', 400);
    }
    if (!data.email) {
      throw new AppError('email is required', 400);
    }
    if (!data.password) {
      throw new AppError('password is required', 400);
    }
    if (!EMAIL_REGEX.test(data.email)) {
      throw new AppError('Invalid email format', 400);
    }
    if (data.password.length < MIN_PASSWORD_LENGTH) {
      throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
    }

    const stored = await this.authRepository.create(data);
    const publicUser = this.toPublicUser(stored);
    const token = randomUUID();
    tokenStore.set(token, publicUser);
    return { user: publicUser, token };
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
