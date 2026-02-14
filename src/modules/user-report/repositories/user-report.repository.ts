import type { UserReport } from '../entities/user-report.entity';

export interface UserReportRepository {
  save(reportId: string, userId: string): Promise<UserReport>;
  findAll(): Promise<UserReport[]>;
  findById(id: string): Promise<UserReport | null>;
  findByUser(userId: string): Promise<UserReport[] | null>;
  findByReport(reportId: string): Promise<UserReport[] | null>;
  findByUserReport(
    userId: string,
    reportId: string,
  ): Promise<UserReport | null>;
  delete(id: string): Promise<boolean>;
}
