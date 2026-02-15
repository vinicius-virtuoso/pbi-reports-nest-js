import { Body, Controller, Delete, HttpCode, Post, Req } from '@nestjs/common';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { DeleteUserReportDto } from './dto/delete-user-report.dto';
import { CreateUserReportUseCase } from './use-case/create-user-report.usecase';
import { DeleteUserReportUseCase } from './use-case/delete-user-report.usecase';

@Controller('user-report')
export class UserReportController {
  constructor(
    private readonly createUserReportUseCase: CreateUserReportUseCase,
    private readonly deleteUserReportUseCase: DeleteUserReportUseCase,
  ) {}

  @Post('grant')
  create(@Body() createUserReportDto: CreateUserReportDto, @Req() req: any) {
    return this.createUserReportUseCase.execute(createUserReportDto, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Delete('revoke')
  @HttpCode(204)
  delete(@Body() deleteUserReportDto: DeleteUserReportDto, @Req() req: any) {
    return this.deleteUserReportUseCase.execute(deleteUserReportDto, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }
}
