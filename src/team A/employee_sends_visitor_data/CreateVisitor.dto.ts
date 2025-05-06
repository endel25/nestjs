import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateVisitorDto {
  @IsOptional() @IsString() firstname: string;
  @IsOptional() @IsString() lastname: string;
  @IsOptional() @IsString() gender: string;
  @IsOptional() @IsString() contactnumber: string;
  @IsOptional() @IsEmail() email: string;
  @IsOptional() @IsDateString() date: string;
  @IsOptional() @IsString() time: string;
  @IsOptional() @IsString() nationalid: string;
  @IsOptional() @IsString({ message: 'Photo must be a string' }) photo?: string;
  @IsOptional() @IsString() visit: string;
  @IsOptional() @IsString() personname: string;
  @IsOptional() @IsString() department: string;
  @IsOptional() @IsString() durationtime: string;
  @IsOptional() @IsString() durationunit: string;
  @IsOptional() @IsString() visitortype: string;
  @IsOptional() @IsString() vehicletype: string;
  @IsOptional() @IsString() vehiclenumber: string;
  @IsOptional() @IsString() drivername: string;
  @IsOptional() @IsString() drivermobile: string;
  @IsOptional() @IsString() drivernationalid: string;
  @IsOptional() @IsString({ message: 'Driver photo must be a string' }) driverphoto?: string;
  @IsOptional() @IsString() notes: string;
}