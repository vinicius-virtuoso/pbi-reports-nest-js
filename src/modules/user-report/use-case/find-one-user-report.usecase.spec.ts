import type { PowerBiRepository } from '../../power-bi/power-bi.repository';
import type { ReportView } from '../../reports/entities/report.entity';
import { ReportAccessService } from '../service/report-access/report-access.service';
import { FindOneUserReportUseCase } from './find-one-user-report.usecase';

describe('FindOneUserReportUseCase', () => {
  let useCase: FindOneUserReportUseCase;
  let reportAccessService: jest.Mocked<ReportAccessService>;
  let powerBiRepository: jest.Mocked<PowerBiRepository>;

  beforeEach(() => {
    reportAccessService = {
      validateAccess: jest.fn(),
    } as unknown as jest.Mocked<ReportAccessService>;

    powerBiRepository = {
      authenticate: jest.fn(),
      generateEmbedToken: jest.fn(),
    } as unknown as jest.Mocked<PowerBiRepository>;

    useCase = new FindOneUserReportUseCase(
      reportAccessService,
      powerBiRepository,
    );
  });

  it('deve retornar os dados do relatório junto com o embed token', async () => {
    const reportView: ReportView = {
      id: 'report-id',
      name: 'Relatório Power BI',
      isActive: true,
      externalId: 'external-report-id',
      embedUrl: 'https://embed.url',
      datasetId: 'datasetId-2',
      webUrl: 'webUrl-2',
      workspaceId: 'workspaceId-1',
    };

    const accessToken = 'power-bi-access-token';

    const embedToken = {
      token: 'embed-token',
      expiration: '2026-01-01T00:00:00Z',
    };

    reportAccessService.validateAccess.mockResolvedValue(reportView);
    powerBiRepository.authenticate.mockResolvedValue(accessToken);
    powerBiRepository.generateEmbedToken.mockResolvedValue(embedToken);

    const result = await useCase.execute('report-id', {
      id: 'user-id',
      role: 'USER',
    });

    expect(reportAccessService.validateAccess).toHaveBeenCalledWith(
      'report-id',
      { id: 'user-id', role: 'USER' },
    );

    expect(powerBiRepository.authenticate).toHaveBeenCalled();

    expect(powerBiRepository.generateEmbedToken).toHaveBeenCalledWith(
      accessToken,
      reportView.externalId,
    );

    expect(result).toEqual({
      ...reportView,
      ...embedToken,
    });
  });
});
