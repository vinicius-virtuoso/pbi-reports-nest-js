import { IsString } from 'class-validator';

export class DeleteUserReportDto {
  @IsString()
  userReportId: string;
}
