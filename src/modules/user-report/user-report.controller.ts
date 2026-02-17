import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { UserRequest } from '../../decorators/user-request.decorator';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { DeleteUserReportDto } from './dto/delete-user-report.dto';
import { CreateUserReportUseCase } from './use-case/create-user-report.usecase';
import { DeleteUserReportUseCase } from './use-case/delete-user-report.usecase';
import { FindAllReportsUseCase } from './use-case/find-all-reports.usecase';
import { FindOneUserReportUseCase } from './use-case/find-one-user-report.usecase';
import { GenerateTokenEmbedUseCase } from './use-case/generate-token-embed.usecase';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Controller('reports')
export class UserReportController {
  constructor(
    private readonly createUserReportUseCase: CreateUserReportUseCase,
    private readonly findAllReportsUseCase: FindAllReportsUseCase,
    private readonly findOneReportsUseCase: FindOneUserReportUseCase,
    private readonly generateTokenEmbedUseCase: GenerateTokenEmbedUseCase,
    private readonly deleteUserReportUseCase: DeleteUserReportUseCase,
  ) {}

  @Post('grant')
  create(
    @Body() createUserReportDto: CreateUserReportDto,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.createUserReportUseCase.execute(
      createUserReportDto,
      loggedUser,
    );
  }

  @Get('report-token/:reportId')
  generateToken(
    @Param('reportId') reportId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.generateTokenEmbedUseCase.execute(reportId, loggedUser);
  }

  @Get()
  findAll(@UserRequest() loggedUser: LoggedUserProps) {
    return this.findAllReportsUseCase.execute(loggedUser);
  }

  @Get(':reportId')
  findOne(
    @Param('reportId') reportId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.findOneReportsUseCase.execute(reportId, loggedUser);
  }

  @Delete('revoke')
  @HttpCode(204)
  delete(
    @Body() deleteUserReportDto: DeleteUserReportDto,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.deleteUserReportUseCase.execute(
      deleteUserReportDto,
      loggedUser,
    );
  }
}
