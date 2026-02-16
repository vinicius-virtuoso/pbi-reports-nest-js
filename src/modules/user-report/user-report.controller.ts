import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { DeleteUserReportDto } from './dto/delete-user-report.dto';
import { CreateUserReportUseCase } from './use-case/create-user-report.usecase';
import { DeleteUserReportUseCase } from './use-case/delete-user-report.usecase';
import { FindAllReportsUseCase } from './use-case/find-all-reports.usecase';
import { FindOneUserReportUseCase } from './use-case/find-one-user-report.usecase';

@Controller('reports')
export class UserReportController {
  constructor(
    private readonly createUserReportUseCase: CreateUserReportUseCase,
    private readonly findAllReportsUseCase: FindAllReportsUseCase,
    private readonly findOneReportsUseCase: FindOneUserReportUseCase,
    private readonly deleteUserReportUseCase: DeleteUserReportUseCase,
  ) {}

  @Post('grant')
  create(@Body() createUserReportDto: CreateUserReportDto, @Req() req: any) {
    return this.createUserReportUseCase.execute(createUserReportDto, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.findAllReportsUseCase.execute({
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Get(':reportId')
  findOne(@Param('reportId') reportId: string, @Req() req: any) {
    return this.findOneReportsUseCase.execute(reportId, {
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
