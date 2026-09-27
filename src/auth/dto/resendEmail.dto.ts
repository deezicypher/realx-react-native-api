import { IsEmail } from 'class-validator';

export class ResendEmailDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}