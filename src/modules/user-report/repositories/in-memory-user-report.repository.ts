import { randomUUID } from 'node:crypto';
import { UserReport } from '../entities/user-report.entity';
import type { UserReportRepository } from './user-report.repository';

export class InMemoryUserReportRepository implements UserReportRepository {
  private userReports: UserReport[] = [];

  async save(reportId: string, userId: string): Promise<UserReport> {
    const userReportPersisted = UserReport.fromPersistence({
      id: randomUUID(),
      userId,
      reportId,
    });
    this.userReports.push(userReportPersisted);

    console.log(this.userReports);

    return userReportPersisted;
  }

  async findAll(): Promise<UserReport[]> {
    return this.userReports;
  }

  async findById(id: string): Promise<UserReport | null> {
    const userReportFound = this.userReports.find(
      (userReport) => userReport.id === id,
    );

    if (!userReportFound) return null;

    return userReportFound;
  }

  async findByUser(userId: string): Promise<UserReport[] | null> {
    const userReportFound = this.userReports.filter(
      (userReport) => userReport.userId === userId,
    );

    if (!userReportFound) return null;

    return userReportFound;
  }

  async findByReport(reportId: string): Promise<UserReport[] | null> {
    const userReportFound = this.userReports.filter(
      (userReport) => userReport.reportId === reportId,
    );

    if (!userReportFound) return null;

    return userReportFound;
  }

  async findByUserReport(
    userId: string,
    reportId: string,
  ): Promise<UserReport | null> {
    const userReportFound = this.userReports.find(
      (userReport) =>
        userReport.userId === userId && userReport.reportId === reportId,
    );

    if (!userReportFound) return null;

    return userReportFound;
  }

  async delete(id: string): Promise<boolean> {
    const userReportFound = this.userReports.find(
      (userReport) => userReport.id === id,
    );

    if (!userReportFound) return false;

    const userReportsFiltered = this.userReports.filter(
      (userReport) => userReport.id !== id,
    );
    this.userReports = userReportsFiltered;

    return true;
  }
}
