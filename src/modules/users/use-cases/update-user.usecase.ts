import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UpdateUserDto } from '../dto/update-user.dto';
import type { User, UserView } from '../entities/user.entity';
import type { UsersRepository } from '../repositories/users.repository';
import { USERS_REPOSITORY } from '../user.providers';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: {
    actorId: string;
    targetUserId: string;
    data: UpdateUserDto;
  }): Promise<UserView> {
    const actor = await this.usersRepository.findById(input.actorId);
    if (!actor) throw new NotFoundException('Actor not found');

    const target = await this.usersRepository.findById(input.targetUserId);
    if (!target) throw new NotFoundException('User not found');

    if (input.data.email && input.data.email !== target.email) {
      const emailOwner = await this.usersRepository.findByEmail(
        input.data.email,
      );

      if (emailOwner && emailOwner.id !== target.id) {
        throw new BadRequestException('Email already exists');
      }
    }

    let updatedUser: User;

    if (actor.role === 'ADMIN') {
      updatedUser = target.updateByAdmin(input.data);
    } else {
      if (actor.id !== target.id) {
        throw new ForbiddenException();
      }

      updatedUser = target.updateProfile({
        name: input.data.name,
        password: input.data.password,
      });
    }

    const persisted = await this.usersRepository.update(updatedUser);
    if (!persisted) throw new BadRequestException('Error on update user');

    return persisted.toView();
  }
}
