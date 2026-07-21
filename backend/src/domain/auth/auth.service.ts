import { IAuthRepository } from './auth.repository';
import { AuthResponse, User } from './auth.types';

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
    return {
      user: this.toPublicUser(user),
      token: 'mock-token',
    };
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    await this.authRepository.create(data);
    return {} as AuthResponse;
  }

  private toPublicUser(user: { id: string; email: string; name: string | null; role: string; createdAt: Date; updatedAt: Date }): User {
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
