import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import type { UsersRepository } from '../users/repositories/users.repository';
import { USERS_REPOSITORY } from '../users/users.providers';

export type AuthServiceProps = {
  email: string;
  password: string;
};

export type AuthServiceResponse = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: UsersRepository,

    private jwtService: JwtService,
  ) {}

  async login(data: AuthServiceProps): Promise<AuthServiceResponse> {
    const userFound = await this.usersRepository.findByEmail(data.email);

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    if (!userFound.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    const passwordCompare = await compare(data.password, userFound.password);

    if (!passwordCompare) {
      throw new UnauthorizedException('Invalids credentials');
    }

    const payload = {
      id: userFound.id,
      role: userFound.role,
    };

    await this.usersRepository.update(userFound.updateLastAccess());

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
