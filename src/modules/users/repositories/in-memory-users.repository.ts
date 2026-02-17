import { randomUUID } from 'node:crypto';
import { User } from '../entities/user.entity';
import type { UsersRepository } from './users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  constructor() {
    // 🔥 seed de usuário admin fake
    const admin = User.fromPersistence({
      id: 'admin-0001',
      email: 'admin@test.com',
      name: 'Admin',
      password: '$2b$11$BZYNWg0CZIiEZvG9Qwxd3.ro6SNHw50RZPxp/fjkE1.FJ0Euq.uNS',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: null,
      lastAccess: null,
    });

    this.users.push(admin);
  }

  async save(user: User): Promise<User> {
    const userPersisted = User.fromPersistence({
      id: randomUUID(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      lastAccess: null,
      createdAt: new Date(Date.now()),
      updatedAt: null,
    });
    this.users.push(userPersisted);

    return userPersisted;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFound = this.users.find((user) => user.email === email);

    if (!userFound) return null;

    return userFound;
  }

  async findAll(): Promise<User[]> {
    const users = this.users;

    return users;
  }

  async findById(userId: string): Promise<User | null> {
    const userFound = this.users.find((user) => user.id === userId);

    if (!userFound) return null;

    return userFound;
  }

  async activate(user: User): Promise<User | null> {
    const userFoundIndex = this.users.findIndex(
      (userIndex) => userIndex.id === user.id,
    );

    if (userFoundIndex === -1) {
      return null;
    }

    this.users[userFoundIndex] = user;

    return user;
  }

  async deactivate(user: User): Promise<User | null> {
    const userFoundIndex = this.users.findIndex(
      (userIndex) => userIndex.id === user.id,
    );

    if (userFoundIndex === -1) {
      return null;
    }

    this.users[userFoundIndex] = user;

    return user;
  }

  async update(user: User): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      return null;
    }

    this.users[index] = user;

    return user;
  }

  async delete(userId: string): Promise<boolean> {
    const userFound = this.users.find((user) => user.id === userId);

    if (!userFound) return false;

    const usersFiltered = this.users.filter((user) => user.id !== userId);
    this.users = usersFiltered;

    return true;
  }
}
