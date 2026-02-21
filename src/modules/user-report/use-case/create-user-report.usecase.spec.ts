import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { ReportsRepository } from '../../reports/repositories/reports.repository';
import type { UsersRepository } from '../../users/repositories/users.repository';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { CreateUserReportUseCase } from './create-user-report.usecase';

describe('CreateUserReportUseCase', () => {
  let useCase: CreateUserReportUseCase;
  let userReportRepository: jest.Mocked<UserReportRepository>;
  let reportsRepository: jest.Mocked<ReportsRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    userReportRepository = {
      findByUserReport: jest.fn(),
      save: jest.fn(),
    } as any;

    reportsRepository = {
      findById: jest.fn(),
    } as any;

    usersRepository = {
      findById: jest.fn(),
    } as any;

    useCase = new CreateUserReportUseCase(
      userReportRepository,
      reportsRepository,
      usersRepository,
    );
  });

  it('deve lançar ForbiddenException quando o usuário logado não for ADMIN', async () => {
    await expect(
      useCase.execute(
        { userId: 'user-1', reportId: 'report-1' },
        { id: 'user-1', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deve lançar NotFoundException quando o relatório não existir', async () => {
    reportsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        { userId: 'user-1', reportId: 'report-1' },
        { id: 'admin', role: 'ADMIN' },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve lançar NotFoundException quando o usuário não existir', async () => {
    reportsRepository.findById.mockResolvedValue({ id: 'report-1' } as any);
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        { userId: 'user-1', reportId: 'report-1' },
        { id: 'admin', role: 'ADMIN' },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deve criar o vínculo quando ele não existir', async () => {
    const userReport = {
      toView: jest.fn().mockReturnValue({
        id: '1',
        userId: 'user-1',
        reportId: 'report-1',
      }),
    };

    reportsRepository.findById.mockResolvedValue({ id: 'report-1' } as any);
    usersRepository.findById.mockResolvedValue({ id: 'user-1' } as any);
    userReportRepository.findByUserReport.mockResolvedValue(null);
    userReportRepository.save.mockResolvedValue(userReport as any);

    const result = await useCase.execute(
      { userId: 'user-1', reportId: 'report-1' },
      { id: 'admin', role: 'ADMIN' },
    );

    expect(userReportRepository.save).toHaveBeenCalledWith(
      'report-1',
      'user-1',
    );
    expect(result.userId).toBe('user-1');
  });

  it('deve retornar o vínculo existente quando ele já existir', async () => {
    const existingUserReport = {
      toView: jest.fn().mockReturnValue({
        id: '1',
        userId: 'user-1',
        reportId: 'report-1',
      }),
    };

    reportsRepository.findById.mockResolvedValue({ id: 'report-1' } as any);
    usersRepository.findById.mockResolvedValue({ id: 'user-1' } as any);
    userReportRepository.findByUserReport.mockResolvedValue(
      existingUserReport as any,
    );

    const result = await useCase.execute(
      { userId: 'user-1', reportId: 'report-1' },
      { id: 'admin', role: 'ADMIN' },
    );

    expect(userReportRepository.save).not.toHaveBeenCalled();
    expect(result.reportId).toBe('report-1');
  });
});
