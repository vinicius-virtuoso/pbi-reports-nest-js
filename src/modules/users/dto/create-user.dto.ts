import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum CreateUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(CreateUserRole)
  role: CreateUserRole;
}
