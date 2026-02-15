import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserView } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    userId: string,
    loggedUser: LoggedUserProps,
  ): Promise<UserView> {
    const isAdmin = loggedUser.role === 'ADMIN';
    const isSelf = loggedUser.id === userId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException();
    }

    const userFound = await this.usersRepository.findById(userId);

    if (!userFound) throw new NotFoundException('User not found');

    return userFound.toView();
  }
}
