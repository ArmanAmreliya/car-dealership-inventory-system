import { User } from './auth.types';

interface StoredUser extends User {
  password: string;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  create(data: { email: string; password: string; name: string }): Promise<StoredUser>;
}

export class AuthRepository implements IAuthRepository {
  private readonly users: StoredUser[] = [];

  async findByEmail(email: string): Promise<StoredUser | null> {
    return this.users.find(u => u.email === email) ?? null;
  }

  async create(data: { email: string; password: string; name: string }): Promise<StoredUser> {
    const user: StoredUser = {
      id: `mock-id-${this.users.length + 1}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}
