import { RegisterData, User } from './auth.types';
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
  async findByEmail(email: string): Promise<StoredUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(data: RegisterData): Promise<StoredUser> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    return user;
  }
}
