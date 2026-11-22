import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^(?:\+91)?[6-9]\d{9}$/, {
    message: 'Please provide a valid Indian mobile number (e.g., +919820451290 or 9820451290)',
  })
  phone: string;

  @IsOptional()
  @IsString()
  cityId?: string;
}
