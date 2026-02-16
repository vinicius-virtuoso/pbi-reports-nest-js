import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PowerBiModule } from '../power-bi/power-bi.module';
import { ReportsController } from './reports.controller';
import { REPORTS_REPOSITORY } from './reports.providers';
import { InMemoryReportsRepository } from './repositories/in-memory-reports.repository';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

@Module({
  imports: [
    PowerBiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [ReportsController],
  providers: [
    SyncReportsPowerBIUseCase,
    {
      provide: REPORTS_REPOSITORY,
      useClass: InMemoryReportsRepository,
    },
  ],
  exports: [REPORTS_REPOSITORY],
})
export class ReportsModule {}
