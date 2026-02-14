import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REPORTS_REPOSITORY } from '../../reports/reports.providers';
import type { ReportsRepository } from '../../reports/repositories/reports.repository';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { USER_REPORT_REPOSITORY } from '../user-report.provider';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

export type UserReportProps = {
  userId: string;
  reportsIds: string[];
};

@Injectable()
export class CreateUserReportUseCase {
  constructor(
    @Inject(USER_REPORT_REPOSITORY)
    private readonly userReportRepository: UserReportRepository,

    @Inject(REPORTS_REPOSITORY)
    private readonly reportRepository: ReportsRepository,
  ) {}

  async execute(
    data: UserReportProps,
    loggedUser: LoggedUserProps,
  ): Promise<void> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    for (const reportId of data.reportsIds) {
      const userReportFound = await this.userReportRepository.findByUserReport(
        data.userId!,
        reportId,
      );

      if (!userReportFound) {
        const reportFound = await this.reportRepository.findById(reportId);

        if (reportFound) {
          await this.userReportRepository.save(reportFound.id!, data.userId);
        }
      }
    }
  }
}
