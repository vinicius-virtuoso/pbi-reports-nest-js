import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type UserView } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';

@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(userId: string): Promise<UserView> {
    const userFound = await this.usersRepository.findById(userId);

    if (!userFound) throw new NotFoundException('User not found');

    const userActivated = await this.usersRepository.deactivate(
      userFound.deactivate(),
    );

    if (!userActivated) throw new BadRequestException('Error activating user');

    return userActivated.toView();
  }
}
