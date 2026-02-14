import { Inject, Injectable } from '@nestjs/common';
import type { UserView } from '../entities/user.entity';
import { USERS_REPOSITORY } from '../users.providers';
import type { UsersRepository } from './../repositories/users.repository';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(): Promise<UserView[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => user.toView());
  }
}
