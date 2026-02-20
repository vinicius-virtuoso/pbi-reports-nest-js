import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportsModule } from './modules/reports/reports.module';
import { UserReportModule } from './modules/user-report/user-report.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    ReportsModule,
    UserReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
