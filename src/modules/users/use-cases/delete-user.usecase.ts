import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../user.providers';

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

    await this.usersRepository.delete(input.targetUserId);
  }
}
