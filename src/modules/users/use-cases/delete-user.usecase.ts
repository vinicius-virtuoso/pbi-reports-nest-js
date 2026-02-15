import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(userId: string, loggedUser: LoggedUserProps): Promise<void> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const targetUser = await this.usersRepository.findById(userId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const isDeleted = await this.usersRepository.delete(userId);

    if (!isDeleted) {
      throw new BadRequestException('Error on delete');
    }
  }
}
