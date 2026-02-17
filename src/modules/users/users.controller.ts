import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserRequest } from '../../decorators/user-request.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivateUserUseCase } from './use-cases/activate-user.usecase';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeactivateUserUseCase } from './use-cases/deactivate-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post('add')
  create(
    @Body() createUserDto: CreateUserDto,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.createUserUseCase.execute(createUserDto, loggedUser);
  }

  @Get()
  findAll(@UserRequest() loggedUser: LoggedUserProps) {
    return this.findAllUsersUseCase.execute(loggedUser);
  }

  @Get(':userId')
  findOne(
    @Param('userId') userId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.findOneUserUseCase.execute(userId, loggedUser);
  }

  @Patch(':userId')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.updateUserUseCase.execute(updateUserDto, userId, loggedUser);
  }

  @Patch('activate/:userId')
  activate(
    @Param('userId') userId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.activateUserUseCase.execute(userId, loggedUser);
  }

  @Patch('deactivate/:userId')
  deactivate(
    @Param('userId') userId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.deactivateUserUseCase.execute(userId, loggedUser);
  }

  @Delete(':userId')
  @HttpCode(204)
  async delete(
    @Param('userId') userId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    await this.deleteUserUseCase.execute(userId, loggedUser);
  }
}
