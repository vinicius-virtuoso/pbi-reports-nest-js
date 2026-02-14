import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { ReportView } from '../entities/report.entity';
import { REPORTS_REPOSITORY } from '../reports.providers';
import type { ReportsRepository } from './../repositories/reports.repository';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class GenericListaAllReportsUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async execute(loggedUser: LoggedUserProps): Promise<ReportView[]> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const reports = await this.reportsRepository.findAll();

    return reports.map((user) => user.toView());
  }
}
