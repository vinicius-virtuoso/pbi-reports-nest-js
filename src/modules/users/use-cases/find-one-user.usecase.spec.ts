import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { UsersRepository } from '../repositories/users.repository';
import { FindOneUserUseCase } from './find-one-user.usecase';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    usersRepository = {
      findById: jest.fn(),
    } as any;

    useCase = new FindOneUserUseCase(usersRepository);
  });

  it('deve retornar o usuário quando o usuário logado for ADMIN', async () => {
    const user = {
      toView: jest.fn().mockReturnValue({
        id: '1',
        email: 'user@email.com',
        name: 'User',
        role: 'USER',
        isActive: true,
        lastAccess: null,
      }),
    };

    usersRepository.findById.mockResolvedValue(user as any);

    const result = await useCase.execute('1', {
      id: 'admin',
      role: 'ADMIN',
    });

    expect(usersRepository.findById).toHaveBeenCalledWith('1');
    expect(result.email).toBe('user@email.com');
  });

  it('deve retornar o usuário quando o usuário logado for o próprio usuário', async () => {
    const user = {
      toView: jest.fn().mockReturnValue({
        id: '1',
        email: 'self@email.com',
        name: 'Self',
        role: 'USER',
        isActive: true,
        lastAccess: null,
      }),
    };

    usersRepository.findById.mockResolvedValue(user as any);

    const result = await useCase.execute('1', {
      id: '1',
      role: 'USER',
    });

    expect(usersRepository.findById).toHaveBeenCalledWith('1');
    expect(result.email).toBe('self@email.com');
  });

  it('deve lançar ForbiddenException quando o usuário não for ADMIN nem o próprio usuário', async () => {
    await expect(
      useCase.execute('2', {
        id: '1',
        role: 'USER',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deve lançar NotFoundException quando o usuário não existir', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('1', {
        id: 'admin',
        role: 'ADMIN',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
