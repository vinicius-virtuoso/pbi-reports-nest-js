import { IsArray, IsString } from 'class-validator';

export class CreateUserReportDto {
  @IsArray()
  @IsString({ each: true })
  reportsIds: string[];

  @IsString()
  userId: string;
}
