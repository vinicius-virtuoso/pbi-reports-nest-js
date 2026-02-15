import { IsString } from 'class-validator';

export class CreateUserReportDto {
  @IsString()
  reportId: string;

  @IsString()
  userId: string;
}
