import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './repositories/in-memory-users.repository';
import { ActivateUserUseCase } from './use-cases/activate-user.usecase';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeactivateUserUseCase } from './use-cases/deactivate-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { USERS_REPOSITORY } from './user.providers';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    ActivateUserUseCase,
    DeactivateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USERS_REPOSITORY,
      useClass: InMemoryUsersRepository,
    },
  ],
})
export class UsersModule {}
