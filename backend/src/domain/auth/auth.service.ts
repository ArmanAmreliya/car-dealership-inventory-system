import { IAuthRepository } from './auth.repository';
import { AuthResponse } from './auth.types';

export interface IAuthService {
  login(data: any): Promise<AuthResponse>;
  register(data: any): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(_data: any): Promise<AuthResponse> {
    this.authRepository.findByEmail('');
    throw new Error('Not implemented');
  }

  async register(_data: any): Promise<AuthResponse> {
    throw new Error('Not implemented');
  }
}
