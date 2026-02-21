import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';
import { UserLifecycleJob } from './user-lifecycle.job';

describe('UserLifecycleJob', () => {
  let job: UserLifecycleJob;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLifecycleJob,
        {
          provide: USERS_REPOSITORY,
          useValue: {
            findUsersInactiveSince: jest.fn(),
            deactivate: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    job = module.get(UserLifecycleJob);
    usersRepository = module.get(USERS_REPOSITORY);
  });

  it('deve desativar usuários inativos há 30 dias e deletar os inativos há 60 dias', async () => {
    const activeUser = User.fromPersistence({
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      password: 'hashed-password',
      role: 'USER',
      isActive: true,
      lastAccess: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      updatedAt: null,
    });

    const inactiveUser = User.fromPersistence({
      id: '2',
      email: 'old@test.com',
      name: 'Old User',
      password: 'hashed-password',
      role: 'USER',
      isActive: false,
      lastAccess: new Date('2023-01-01'),
      createdAt: new Date('2023-01-01'),
      updatedAt: null,
    });

    usersRepository.findUsersInactiveSince.mockResolvedValueOnce([activeUser]);
    usersRepository.findUsersInactiveSince.mockResolvedValueOnce([
      inactiveUser,
    ]);

    await job.handle();

    expect(usersRepository.findUsersInactiveSince).toHaveBeenCalledTimes(2);
    expect(usersRepository.delete).toHaveBeenCalledWith('2');
    expect(usersRepository.deactivate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        isActive: false,
        email: 'test@test.com',
        role: 'USER',
      }),
    );
  });
});
