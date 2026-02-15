import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import type { CreateUserDto } from '../dto/create-user.dto';
import { User, type UserView } from '../entities/user.entity';
import { USERS_REPOSITORY } from '../users.providers';
import type { UsersRepository } from './../repositories/users.repository';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    data: CreateUserDto,
    loggedUser: LoggedUserProps,
  ): Promise<UserView> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const userExisting = await this.usersRepository.findByEmail(data.email);

    if (userExisting) throw new ConflictException('Email already exists');

    const passwordHashed = await hash(data.password, 11);

    const userCreated = User.create({
      name: data.name,
      email: data.email,
      password: passwordHashed,
      role: data.role,
    });

    const user = await this.usersRepository.save(userCreated);

    return user.toView();
  }
}
