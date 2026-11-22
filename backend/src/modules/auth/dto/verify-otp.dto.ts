import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^(?:\+91)?[6-9]\d{9}$/, {
    message: 'Please provide a valid Indian mobile number',
  })
  phone: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @IsString()
  @Length(4, 6, { message: 'OTP must be between 4 and 6 digits' })
  otp: string;

  @IsOptional()
  @IsString()
  cityId?: string;
}
