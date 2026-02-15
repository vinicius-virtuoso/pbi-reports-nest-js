import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type UserView } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    userId: string,
    loggedUser: LoggedUserProps,
  ): Promise<UserView> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const userFound = await this.usersRepository.findById(userId);

    if (!userFound) throw new NotFoundException('User not found');

    const userActivated = await this.usersRepository.deactivate(
      userFound.deactivate(),
    );

    if (!userActivated) throw new BadRequestException('Error activating user');

    return userActivated.toView();
  }
}
