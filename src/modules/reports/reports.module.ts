import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { REPORTS_REPOSITORY } from './reports.providers';
import { InMemoryReportsRepository } from './repositories/in-memory-reports.repository';

@Module({
  controllers: [ReportsController],
  providers: [
    {
      provide: REPORTS_REPOSITORY,
      useClass: InMemoryReportsRepository,
    },
  ],
})
export class ReportsModule {}
