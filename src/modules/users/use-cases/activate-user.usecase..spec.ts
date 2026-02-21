import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { ActivateUserUseCase } from './activate-user.usecase';

const makeUsersRepositoryMock = (): jest.Mocked<UsersRepository> => ({
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
  findUsersInactiveSince: jest.fn(),
});

describe('ActivateUserUseCase', () => {
  let useCase: ActivateUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    usersRepository = makeUsersRepositoryMock();
    useCase = new ActivateUserUseCase(usersRepository);
  });

  it('deve ativar um usuário quando o usuário logado for ADMIN', async () => {
    const loggedUser = {
      id: 'admin-id',
      role: 'ADMIN' as const,
    };

    const inactiveUser = User.fromPersistence({
      id: 'user-id',
      name: 'Test User',
      email: 'test@email.com',
      password: 'hashed-password',
      role: 'USER',
      isActive: false,
      lastAccess: null,
      createdAt: new Date(),
      updatedAt: null,
    });

    const activatedUser = inactiveUser.activate();

    usersRepository.findById.mockResolvedValue(inactiveUser);
    usersRepository.activate.mockResolvedValue(activatedUser);

    const result = await useCase.execute('user-id', loggedUser);

    expect(usersRepository.findById).toHaveBeenCalledWith('user-id');
    expect(usersRepository.activate).toHaveBeenCalledTimes(1);
    expect(result.isActive).toBe(true);
  });

  it('deve lançar ForbiddenException se o usuário logado não for ADMIN', async () => {
    const loggedUser = {
      id: 'user-id',
      role: 'USER' as const,
    };

    await expect(useCase.execute('user-id', loggedUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(usersRepository.findById).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundException se o usuário não existir', async () => {
    const loggedUser = {
      id: 'admin-id',
      role: 'ADMIN' as const,
    };

    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('user-id', loggedUser)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(usersRepository.activate).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se a ativação falhar', async () => {
    const loggedUser = {
      id: 'admin-id',
      role: 'ADMIN' as const,
    };

    const inactiveUser = User.fromPersistence({
      id: 'user-id',
      name: 'Test User',
      email: 'test@email.com',
      password: 'hashed-password',
      role: 'USER',
      isActive: false,
      lastAccess: null,
      createdAt: new Date(),
      updatedAt: null,
    });

    usersRepository.findById.mockResolvedValue(inactiveUser);
    usersRepository.activate.mockResolvedValue(null as any);

    await expect(useCase.execute('user-id', loggedUser)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
