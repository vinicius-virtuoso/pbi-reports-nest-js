import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { POWER_BI_REPOSITORY } from '../reports/reports.providers';
import { PowerBiGateway } from './power-bi.gateway';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: POWER_BI_REPOSITORY,
      useClass: PowerBiGateway,
    },
  ],
  exports: [POWER_BI_REPOSITORY],
})
export class PowerBiModule {}
