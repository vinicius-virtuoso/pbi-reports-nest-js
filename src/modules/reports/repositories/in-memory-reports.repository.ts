import { randomUUID } from 'node:crypto';
import { Report } from '../entities/report.entity';
import type { ReportsRepository } from './reports.repository';

export class InMemoryReportsRepository implements ReportsRepository {
  private reports: Report[] = [];

  async save(report: Report): Promise<Report> {
    const reportPersisted = Report.fromPersistence({
      id: randomUUID(),
      name: report.name,
      webUrl: report.webUrl,
      embedUrl: report.embedUrl,
    });
    this.reports.push(reportPersisted);

    return reportPersisted;
  }

  async findById(reportId: string): Promise<Report | null> {
    const reportFound = this.reports.find((report) => report.id === reportId);

    if (!reportFound) return null;

    return reportFound;
  }

  async findAll(): Promise<Report[]> {
    const reports = this.reports;

    return reports;
  }
}
