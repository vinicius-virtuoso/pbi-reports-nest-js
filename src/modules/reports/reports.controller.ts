import { Controller, HttpCode, Param, Patch, Req } from '@nestjs/common';
import { ActivateReportUseCase } from './use-cases/activate-report.usecase';
import { DeactivateReportUseCase } from './use-cases/deactivate-report.usecase';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly syncReportsPowerBIUseCase: SyncReportsPowerBIUseCase,
    private readonly activateReportUseCase: ActivateReportUseCase,
    private readonly deactivateReportUseCase: DeactivateReportUseCase,
  ) {}

  @Patch('sync')
  @HttpCode(201)
  create(@Req() req: any) {
    return this.syncReportsPowerBIUseCase.execute({
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Patch('activate/:reportId')
  activate(@Param('reportId') reportId: string, @Req() req: any) {
    return this.activateReportUseCase.execute(reportId, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }

  @Patch('deactivate/:reportId')
  deactivate(@Param('reportId') reportId: string, @Req() req: any) {
    return this.deactivateReportUseCase.execute(reportId, {
      id: 'admin-0001',
      role: 'ADMIN',
    });
  }
}
