import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserReportRepository } from '../repositories/user-report.repository';
import { USER_REPORT_REPOSITORY } from '../user-report.provider';

export type LoggedUserProps = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class DeleteUserReportUseCase {
  constructor(
    @Inject(USER_REPORT_REPOSITORY)
    private readonly userReportRepository: UserReportRepository,
  ) {}

  async execute(
    data: {
      userReportId: string;
    },
    loggedUser: LoggedUserProps,
  ): Promise<void> {
    if (loggedUser.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    const userReportFound = await this.userReportRepository.findById(
      data.userReportId,
    );

    if (!userReportFound) {
      throw new NotFoundException('Relation not found');
    }

    const isDeleted = await this.userReportRepository.delete(data.userReportId);

    if (!isDeleted) {
      throw new BadRequestException('Error on delete');
    }
  }
}
