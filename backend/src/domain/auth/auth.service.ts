import { IAuthRepository } from './auth.repository';
import { AuthResponse } from './auth.types';

export interface IAuthService {
  login(data: any): Promise<AuthResponse>;
  register(data: any): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(_data: any): Promise<AuthResponse> {
    void this.authRepository;
    throw new Error('Not implemented');
  }

  async register(_data: any): Promise<AuthResponse> {
    return {} as AuthResponse;
  }
}
