import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PowerBiRepository } from '../../power-bi/power-bi.repository';
import {
  POWER_BI_REPOSITORY,
  REPORTS_REPOSITORY,
} from '../../reports/reports.providers';
import type { ReportsRepository } from '../../reports/repositories/reports.repository';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { USER_REPORT_REPOSITORY } from './../user-report.provider';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

export interface FindOneUserReportUseCaseResponse {
  id: string | null;
  externalId: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  datasetId: string;
  workspaceId: string;
  isActive: boolean;
  token: string;
  expiration: string;
}

@Injectable()
export class FindOneUserReportUseCase {
  constructor(
    @Inject(USER_REPORT_REPOSITORY)
    private readonly userReportsRepository: UserReportRepository,

    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,

    @Inject(POWER_BI_REPOSITORY)
    private readonly powerBiRepository: PowerBiRepository,
  ) {}

  async execute(
    reportId: string,
    loggedUser: LoggedUserProps,
  ): Promise<FindOneUserReportUseCaseResponse> {
    const reportFound = await this.reportsRepository.findById(reportId);

    if (!reportFound) {
      throw new NotFoundException('Report not found');
    }

    const accessPowerBiToken = await this.powerBiRepository.authenticate();

    const embedConfig = await this.powerBiRepository.generateEmbedToken(
      accessPowerBiToken,
      reportFound.externalId,
    );

    if (loggedUser.role === 'ADMIN') {
      return { ...reportFound.toView(), ...embedConfig };
    }

    const userHasPermission = await this.userReportsRepository.findByUserReport(
      loggedUser.id,
      reportId,
    );

    if (!userHasPermission) {
      throw new ForbiddenException();
    }

    return {
      ...reportFound.toView(),
      ...embedConfig,
    };
  }
}
