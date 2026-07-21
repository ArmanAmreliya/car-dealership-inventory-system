import { IAuthRepository } from './auth.repository';
import { AuthResponse, LoginCredentials, RegisterData, User } from './auth.types';
import { AppError } from '../../common/errors/AppError';
import { generateAccessToken } from '../../lib/jwt';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    return this.issueToken(user);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    this.validateRegistration(data);
    const stored = await this.authRepository.create(data);
    return this.issueToken(stored);
  }

  private validateRegistration(data: RegisterData): void {
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
