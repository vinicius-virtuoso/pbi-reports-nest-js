import { Report } from '../../reports/entities/report.entity';
import type { ReportsRepository } from '../../reports/repositories/reports.repository';
import { UserReport } from '../entities/user-report.entity';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { FindAllReportsUseCase } from './find-all-reports.usecase';

describe('FindAllReportsUseCase', () => {
  let useCase: FindAllReportsUseCase;
  let userReportRepository: jest.Mocked<UserReportRepository>;
  let reportsRepository: jest.Mocked<ReportsRepository>;

  beforeEach(() => {
    userReportRepository = {
      findByUser: jest.fn(),
      findById: jest.fn(),
      findByUserReport: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserReportRepository>;

    reportsRepository = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ReportsRepository>;

    useCase = new FindAllReportsUseCase(
      userReportRepository,
      reportsRepository,
    );
  });

  it('deve retornar vazio quando USER não possui relatórios vinculados', async () => {
    userReportRepository.findByUser.mockResolvedValue([]);

    const result = await useCase.execute({
      id: 'user-id',
      role: 'USER',
    });

    expect(result).toEqual({
      total: 0,
      reports: [],
    });
  });

  it('deve retornar apenas relatórios vinculados ao USER', async () => {
    const userReports = [
      UserReport.fromPersistence({
        id: 'ur-1',
        userId: 'user-id',
        reportId: 'report-1',
      }),
      UserReport.fromPersistence({
        id: 'ur-2',
        userId: 'user-id',
        reportId: 'report-2',
      }),
    ];

    const reports = [
      Report.fromPersistence({
        id: 'report-1',
        name: 'Relatório 1',
        isActive: true,
        embedUrl: 'url-1',
        externalId: 'report-1-1',
        datasetId: 'datasetId-1',
        webUrl: 'webUrl-1',
        workspaceId: 'workspaceId-1',
      }),
      Report.fromPersistence({
        id: 'report-2',
        name: 'Relatório 2',
        isActive: true,
        embedUrl: 'url-2',
        externalId: 'report-2-2',
        datasetId: 'datasetId-2',
        webUrl: 'webUrl-2',
        workspaceId: 'workspaceId-1',
      }),
    ];

    userReportRepository.findByUser.mockResolvedValue(userReports);
    reportsRepository.findByIds.mockResolvedValue(reports);

    const result = await useCase.execute({
      id: 'user-id',
      role: 'USER',
    });

    expect(result.total).toBe(2);
    expect(result.reports).toEqual(reports.map((r) => r.toView()));
  });

  it('deve retornar apenas relatórios ativos quando ADMIN', async () => {
    const reports = [
      Report.fromPersistence({
        id: 'report-1',
        name: 'Ativo',
        isActive: true,
        embedUrl: 'url-1',
        externalId: 'report-1-1',
        datasetId: 'datasetId-1',
        webUrl: 'webUrl-1',
        workspaceId: 'workspaceId-1',
      }),
      Report.fromPersistence({
        id: 'report-2',
        name: 'Inativo',
        isActive: false,
        embedUrl: 'url-2',
        externalId: 'report-2-2',
        datasetId: 'datasetId-2',
        webUrl: 'webUrl-2',
        workspaceId: 'workspaceId-1',
      }),
    ];

    reportsRepository.findAll.mockResolvedValue(reports);

    const result = await useCase.execute({
      id: 'admin-id',
      role: 'ADMIN',
    });

    expect(result.total).toBe(2);
    expect(result.reports).toEqual(
      reports.filter((r) => r.isActive).map((r) => r.toView()),
    );
  });
});
