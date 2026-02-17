import { Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { UserRequest } from '../../decorators/user-request.decorator';
import { ActivateReportUseCase } from './use-cases/activate-report.usecase';
import { DeactivateReportUseCase } from './use-cases/deactivate-report.usecase';
import { SyncReportsPowerBIUseCase } from './use-cases/sync-reports-for-power-bi.use-case';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly syncReportsPowerBIUseCase: SyncReportsPowerBIUseCase,
    private readonly activateReportUseCase: ActivateReportUseCase,
    private readonly deactivateReportUseCase: DeactivateReportUseCase,
  ) {}

  @Patch('sync')
  @HttpCode(201)
  create(@UserRequest() loggedUser: LoggedUserProps) {
    return this.syncReportsPowerBIUseCase.execute(loggedUser);
  }

  @Patch('activate/:reportId')
  activate(
    @Param('reportId') reportId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.activateReportUseCase.execute(reportId, loggedUser);
  }

  @Patch('deactivate/:reportId')
  deactivate(
    @Param('reportId') reportId: string,
    @UserRequest() loggedUser: LoggedUserProps,
  ) {
    return this.deactivateReportUseCase.execute(reportId, loggedUser);
  }
}
