import { Controller, Get, HttpCode, Patch, Req } from '@nestjs/common';
import { GenericListaAllReportsUseCase } from './use-cases/generic-lista-all-reports.usecase';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly syncReportsPowerBIUseCase: SyncReportsPowerBIUseCase,
    private readonly genericListaAllReportsUseCase: GenericListaAllReportsUseCase,
  ) {}

  @Patch('sync')
  @HttpCode(204)
  create(@Req() req: any) {
    return this.syncReportsPowerBIUseCase.execute({
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.genericListaAllReportsUseCase.execute({
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }
}
