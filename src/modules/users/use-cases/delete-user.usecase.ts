import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../users.providers';

type UserRole = 'ADMIN' | 'USER';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: {
    actorId: string;
    actorRole: UserRole;
    targetUserId: string;
  }): Promise<void> {
    if (input.actorRole !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const targetUser = await this.usersRepository.findById(input.targetUserId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const isDeleted = await this.usersRepository.delete(input.targetUserId);

    if (!isDeleted) {
      throw new BadRequestException('Error on delete');
    }
  }
}
