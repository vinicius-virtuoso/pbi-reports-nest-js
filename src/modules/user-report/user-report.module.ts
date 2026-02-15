import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { UsersModule } from '../users/users.module';
import { InMemoryUserReportRepository } from './repositories/in-memory-user-report.repository';
import { CreateUserReportUseCase } from './use-case/create-user-report.usecase';
import { DeleteUserReportUseCase } from './use-case/delete-user-report.usecase';
import { UserReportController } from './user-report.controller';
import { USER_REPORT_REPOSITORY } from './user-report.provider';

@Module({
  imports: [ReportsModule, UsersModule],
  controllers: [UserReportController],
  providers: [
    CreateUserReportUseCase,
    DeleteUserReportUseCase,
    {
      provide: USER_REPORT_REPOSITORY,
      useClass: InMemoryUserReportRepository,
    },
  ],
})
export class UserReportModule {}
