import { User } from './auth.types';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: any): Promise<User>;
}

export class AuthRepository implements IAuthRepository {
  async findByEmail(_email: string): Promise<User | null> {
    return null;
  }

  async create(_data: any): Promise<User> {
    throw new Error('Not implemented');
  }
}
