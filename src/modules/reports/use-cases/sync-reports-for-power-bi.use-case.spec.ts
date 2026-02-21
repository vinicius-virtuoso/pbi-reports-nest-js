import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Report } from '../entities/report.entity';
import { SyncReportsPowerBIUseCase } from './sync-reports-for-power-bi.use-case';

describe('SyncReportsPowerBIUseCase', () => {
  let useCase: SyncReportsPowerBIUseCase;
  let reportsRepository: any;
  let powerBiRepository: any;

  beforeEach(() => {
    reportsRepository = {
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
      save: jest.fn(),
      deactivate: jest.fn(),
    };

    powerBiRepository = {
      authenticate: jest.fn(),
      listReports: jest.fn(),
    };

    useCase = new SyncReportsPowerBIUseCase(
      reportsRepository,
      powerBiRepository,
    );
  });

  it('deve lançar ForbiddenException se o usuário não for ADMIN', async () => {
    await expect(
      useCase.execute({ id: 'user-1', role: 'USER' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deve lançar UnauthorizedException se autenticação no Power BI falhar', async () => {
    powerBiRepository.authenticate.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ id: 'admin', role: 'ADMIN' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('deve sincronizar os relatórios corretamente', async () => {
    powerBiRepository.authenticate.mockResolvedValue('token-123');
    powerBiRepository.listReports.mockResolvedValue([
      {
        externalId: 'ext-1',
        name: 'Relatório 1',
        embedUrl: 'embed-1',
        datasetId: 'ds-1',
        workspaceId: 'ws-1',
        webUrl: 'web-1',
      },
      {
        externalId: 'ext-2',
        name: 'Relatório 2',
        embedUrl: 'embed-2',
        datasetId: 'ds-2',
        workspaceId: 'ws-2',
        webUrl: 'web-2',
      },
    ]);

    const dbReport1 = Report.create({
      externalId: 'ext-1',
      name: 'Relatório 1',
      embedUrl: 'embed-1',
      datasetId: 'ds-1',
      workspaceId: 'ws-1',
      webUrl: 'web-1',
      isActive: true,
    });

    const dbReport2 = Report.create({
      externalId: 'ext-3',
      name: 'Relatório 3',
      embedUrl: 'embed-3',
      datasetId: 'ds-3',
      workspaceId: 'ws-3',
      webUrl: 'web-3',
      isActive: true,
    });

    reportsRepository.findAll.mockResolvedValue([dbReport1, dbReport2]);
    reportsRepository.findByExternalId.mockResolvedValueOnce(dbReport1);
    reportsRepository.findByExternalId.mockResolvedValueOnce(undefined);
    reportsRepository.save.mockImplementation(async (report) => report);
    reportsRepository.deactivate.mockImplementation(async (report) => report);

    const result = await useCase.execute({ id: 'admin', role: 'ADMIN' });

    expect(powerBiRepository.authenticate).toHaveBeenCalled();
    expect(powerBiRepository.listReports).toHaveBeenCalled();
    expect(reportsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 'ext-2' }),
    );
    expect(reportsRepository.deactivate).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 'ext-3', isActive: false }),
    );

    expect(result.total).toBe(2);
    expect(result.reports.map((r) => r.externalId)).toEqual(
      expect.arrayContaining(['ext-1', 'ext-3']),
    );
  });
});
