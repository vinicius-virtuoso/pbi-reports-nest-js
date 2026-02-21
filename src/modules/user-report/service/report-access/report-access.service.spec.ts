import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { ReportsRepository } from '../../../reports/repositories/reports.repository';
import type { UserReportRepository } from '../../repositories/user-report.repository';
import { ReportAccessService } from './report-access.service';

describe('ReportAccessService', () => {
  let service: ReportAccessService;
  let reportsRepository: jest.Mocked<ReportsRepository>;
  let userReportsRepository: jest.Mocked<UserReportRepository>;

  beforeEach(() => {
    reportsRepository = {
      findById: jest.fn(),
    } as any;

    userReportsRepository = {
      findByUserReport: jest.fn(),
    } as any;

    service = new ReportAccessService(reportsRepository, userReportsRepository);
  });

  it('deve lançar NotFoundException quando o relatório não existir', async () => {
    reportsRepository.findById.mockResolvedValue(null);

    await expect(
      service.validateAccess('report-1', {
        id: 'user-1',
        role: 'USER',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve lançar ForbiddenException quando o relatório estiver inativo', async () => {
    const report = {
      isActive: false,
    };

    reportsRepository.findById.mockResolvedValue(report as any);

    await expect(
      service.validateAccess('report-1', {
        id: 'user-1',
        role: 'USER',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deve permitir acesso quando o usuário for ADMIN', async () => {
    const report = {
      isActive: true,
      toView: jest.fn().mockReturnValue({
        id: 'report-1',
        name: 'Report',
      }),
    };

    reportsRepository.findById.mockResolvedValue(report as any);

    const result = await service.validateAccess('report-1', {
      id: 'admin',
      role: 'ADMIN',
    });

    expect(report.toView).toHaveBeenCalled();
    expect(result.id).toBe('report-1');
  });

  it('deve permitir acesso quando o usuário tiver permissão para o relatório', async () => {
    const report = {
      isActive: true,
      toView: jest.fn().mockReturnValue({
        id: 'report-1',
        name: 'Report',
      }),
    };

    reportsRepository.findById.mockResolvedValue(report as any);
    userReportsRepository.findByUserReport.mockResolvedValue(true as any);

    const result = await service.validateAccess('report-1', {
      id: 'user-1',
      role: 'USER',
    });

    expect(userReportsRepository.findByUserReport).toHaveBeenCalledWith(
      'user-1',
      'report-1',
    );
    expect(result.id).toBe('report-1');
  });

  it('deve lançar ForbiddenException quando o usuário não tiver permissão para o relatório', async () => {
    const report = {
      isActive: true,
      toView: jest.fn(),
    };

    reportsRepository.findById.mockResolvedValue(report as any);
    userReportsRepository.findByUserReport.mockResolvedValue(null);

    await expect(
      service.validateAccess('report-1', {
        id: 'user-1',
        role: 'USER',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
