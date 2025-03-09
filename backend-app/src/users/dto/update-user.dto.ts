import { IsString, IsOptional, IsBoolean, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  Role?: string; 

  @IsOptional()
  @IsEmail()
  email?: string;
}
