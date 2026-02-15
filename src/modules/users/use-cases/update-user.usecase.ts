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
import { USERS_REPOSITORY } from '../users.providers';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    data: UpdateUserDto,
    userId: string,
    loggedUser: LoggedUserProps,
  ): Promise<UserView> {
    const actor = await this.usersRepository.findById(loggedUser.id);
    if (!actor) throw new NotFoundException('Actor not found');

    const target = await this.usersRepository.findById(userId);
    if (!target) throw new NotFoundException('User not found');

    if (data.email && data.email !== target.email) {
      const emailOwner = await this.usersRepository.findByEmail(data.email);

      if (emailOwner && emailOwner.id !== target.id) {
        throw new BadRequestException('Email already exists');
      }
    }

    let updatedUser: User;

    if (actor.role === 'ADMIN') {
      updatedUser = target.updateByAdmin(data);
    } else {
      if (actor.id !== target.id) {
        throw new ForbiddenException();
      }

      updatedUser = target.updateProfile({
        name: data.name,
        password: data.password,
      });
    }

    const persisted = await this.usersRepository.update(updatedUser);
    if (!persisted) throw new BadRequestException('Error on update user');

    return persisted.toView();
  }
}
