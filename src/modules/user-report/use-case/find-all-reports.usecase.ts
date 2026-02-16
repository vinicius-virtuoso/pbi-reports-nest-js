import { Inject, Injectable } from '@nestjs/common';
import { type ReportView } from '../../reports/entities/report.entity';
import { REPORTS_REPOSITORY } from '../../reports/reports.providers';
import type { ReportsRepository } from '../../reports/repositories/reports.repository';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { USER_REPORT_REPOSITORY } from '../user-report.provider';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

export type PaginatedResult = {
  total: number;
  reports: ReportView[];
};

@Injectable()
export class FindAllReportsUseCase {
  constructor(
    @Inject(USER_REPORT_REPOSITORY)
    private readonly userReportsRepository: UserReportRepository,

    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async execute(loggedUser: LoggedUserProps): Promise<PaginatedResult> {
    if (loggedUser.role !== 'ADMIN') {
      const userReports = await this.userReportsRepository.findByUser(
        loggedUser.id,
      );

      if (userReports.length === 0) {
        return { total: 0, reports: [] };
      }

      const reportIds = userReports.map((ur) => ur.reportId);
      const reports = await this.reportsRepository.findByIds(reportIds);

      return {
        total: reports.length,
        reports: reports.map((r) => r.toView()),
      };
    }

    const reportAll = await this.reportsRepository.findAll();

    return {
      total: reportAll.length,
      reports: reportAll.map((report) => report.toView()),
    };
  }
}
