import type { Report } from '../entities/report.entity';

export interface ReportsRepository {
  save(report: Report): Promise<Report>;
  findAll(): Promise<Report[]>;
  findById(reportId: string): Promise<Report | null>;
}
