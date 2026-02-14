import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { CreateUserReportUseCase } from './use-case/create-user-report.usecase';

@Controller('user-report')
export class UserReportController {
  constructor(
    private readonly createUserReportUseCase: CreateUserReportUseCase,
  ) {}

  @Post()
  create(@Body() createUserReportDto: CreateUserReportDto, @Req() req: any) {
    return this.createUserReportUseCase.execute(createUserReportDto, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }
}
