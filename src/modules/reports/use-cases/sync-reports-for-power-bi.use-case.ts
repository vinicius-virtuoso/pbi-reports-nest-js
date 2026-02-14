import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Report } from '../entities/report.entity';
import type { PowerBiRepository } from '../gateways/power-bi/power-bi.repository';
import { POWER_BI_REPOSITORY, REPORTS_REPOSITORY } from '../reports.providers';
import type { ReportsRepository } from '../repositories/reports.repository';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class SyncReportsPowerBIUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,

    @Inject(POWER_BI_REPOSITORY)
    private readonly powerBiRepository: PowerBiRepository,
  ) {}

  async execute(loggedUser: LoggedUserProps): Promise<void> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const authenticatedToken = await this.powerBiRepository.authenticate();

    if (!authenticatedToken) {
      throw new UnauthorizedException(
        'Error authenticating with the Power BI API',
      );
    }

    const powerBiReports =
      await this.powerBiRepository.listReports(authenticatedToken);

    const dbReports = await this.reportsRepository.findAll();

    const powerBiExternalIds = new Set(
      powerBiReports.map((report) => report.externalId),
    );

    for (const externalReport of powerBiReports) {
      const reportFound = await this.reportsRepository.findByExternalId(
        externalReport.externalId,
      );

      if (!reportFound) {
        const report = Report.create({
          externalId: externalReport.externalId,
          name: externalReport.name,
          embedUrl: externalReport.embedUrl,
          datasetId: externalReport.datasetId,
          workspaceId: externalReport.workspaceId,
          webUrl: externalReport.webUrl,
          isActive: true,
        });

        await this.reportsRepository.save(report);
        continue;
      }

      if (!reportFound.isActive) {
        await this.reportsRepository.activate(reportFound.activate());
      }
    }

    for (const dbReport of dbReports) {
      if (dbReport.isActive && !powerBiExternalIds.has(dbReport.externalId)) {
        await this.reportsRepository.deactivate(dbReport.deactivate());
      }
    }
  }
}
