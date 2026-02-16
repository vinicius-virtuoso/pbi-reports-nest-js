import { Controller, HttpCode, Patch, Req } from '@nestjs/common';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly syncReportsPowerBIUseCase: SyncReportsPowerBIUseCase,
  ) {}

  @Patch('sync')
  @HttpCode(201)
  create(@Req() req: any) {
    return this.syncReportsPowerBIUseCase.execute({
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }
}
