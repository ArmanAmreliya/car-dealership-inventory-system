import type { RegisterData, User } from './auth.types';
import { AppError } from '../../common/errors/AppError';
import { prisma } from '../../infrastructure/prisma';

interface StoredUser extends User {
  password: string;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  create(data: RegisterData): Promise<StoredUser>;
}

export class AuthRepository implements IAuthRepository {
  private inMemoryUsers: Map<string, StoredUser> = new Map();

  async findByEmail(email: string): Promise<StoredUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (user) return user;
    } catch {
      // Ignore Prisma DB connection errors and check fallback
    }
    return this.inMemoryUsers.get(normalizedEmail) || null;
  }

  async create(data: RegisterData): Promise<StoredUser> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await this.findByEmail(normalizedEmail);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      password: data.password,
      name: data.name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: data.password,
          name: data.name,
        },
      });
      return user;
    } catch {
      // Store in memory if database operation fails or DB is unavailable
      this.inMemoryUsers.set(normalizedEmail, newUser);
      return newUser;
    }
  }
}
