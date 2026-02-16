import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import type { ReportView } from '../entities/report.entity';
import { REPORTS_REPOSITORY } from '../reports.providers';
import type { ReportsRepository } from './../repositories/reports.repository';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

export class DeactivateReportUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async execute(
    reportId: string,
    loggedUser: LoggedUserProps,
  ): Promise<ReportView> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const reportFound = await this.reportsRepository.findById(reportId);

    if (!reportFound) {
      throw new NotFoundException('Report not found');
    }

    const reportDeactivated = await this.reportsRepository.deactivate(
      reportFound.deactivate(),
    );

    if (!reportDeactivated) {
      throw new BadRequestException('Error deactivating report');
    }

    return reportDeactivated?.toView();
  }
}
