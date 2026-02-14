import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivateUserUseCase } from './use-cases/activate-user.usecase';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeactivateUserUseCase } from './use-cases/deactivate-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';

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
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.findAllUsersUseCase.execute();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string, @Req() req: any) {
    return this.findOneUserUseCase.execute(userId);
  }

  @Patch(':userId')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.updateUserUseCase.execute({
      actorId: 'user-0001',
      targetUserId: userId,
      data: updateUserDto,
    });
  }

  @Patch('activate/:userId')
  activate(@Param('userId') userId: string, @Req() req: any) {
    return this.activateUserUseCase.execute(userId);
  }

  @Patch('deactivate/:userId')
  deactivate(@Param('userId') userId: string, @Req() req: any) {
    return this.deactivateUserUseCase.execute(userId);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    await this.deleteUserUseCase.execute({
      actorId: 'admin-0001',
      actorRole: 'ADMIN',
      targetUserId: userId,
    });
  }
}
