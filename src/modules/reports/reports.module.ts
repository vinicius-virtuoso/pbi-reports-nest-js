import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PowerBiGateway } from './gateways/power-bi/power-bi.gateway';
import { ReportsController } from './reports.controller';
import { POWER_BI_REPOSITORY, REPORTS_REPOSITORY } from './reports.providers';
import { InMemoryReportsRepository } from './repositories/in-memory-reports.repository';
import { GenericListaAllReportsUseCase } from './use-cases/generic-lista-all-reports.usecase';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [ReportsController],
  providers: [
    SyncReportsPowerBIUseCase,
    GenericListaAllReportsUseCase,
    {
      provide: REPORTS_REPOSITORY,
      useClass: InMemoryReportsRepository,
    },
    {
      provide: POWER_BI_REPOSITORY,
      useClass: PowerBiGateway,
    },
  ],
  exports: [REPORTS_REPOSITORY],
})
export class ReportsModule {}
