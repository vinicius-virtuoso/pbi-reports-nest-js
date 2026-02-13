import { Module } from '@nestjs/common';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, ReportsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
