import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { UserView } from '../entities/user.entity';
import { USERS_REPOSITORY } from '../users.providers';
import type { UsersRepository } from './../repositories/users.repository';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(loggedUser: LoggedUserProps): Promise<UserView[]> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const users = await this.usersRepository.findAll();

    return users.map((user) => user.toView());
  }
}
