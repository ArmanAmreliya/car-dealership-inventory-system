import { IAuthRepository } from './auth.repository';
import { AuthResponse } from './auth.types';

export const mockUsers: any[] = [];

export interface IAuthService {
  login(data: any): Promise<AuthResponse>;
  register(data: any): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(data: any): Promise<AuthResponse> {
    const user = mockUsers.find(u => u.email === data.email);
    if (!user || user.password !== data.password) {
      throw new Error('Invalid credentials');
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: 'mock-token',
    };
  }

  async register(data: any): Promise<AuthResponse> {
    const newUser = {
      id: 'mock-id',
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return {} as AuthResponse;
  }
}
