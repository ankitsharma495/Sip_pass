import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOtpProvider } from '../interfaces/otp-provider.interface';

interface Fast2SmsResponse {
  return: boolean;
  request_id?: string;
  message?: string[];
  status_code?: number;
}

@Injectable()
export class Fast2SmsProvider implements IOtpProvider {
  private readonly logger = new Logger(Fast2SmsProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async sendOtp(phone: string, code: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');

    // Clean phone number: Fast2SMS expects 10-digit Indian numbers without +91
    const cleanPhone = phone.replace(/^\+91/, '').replace(/[\s-]/g, '');

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_fast2sms_api_key')) {
      this.logger.warn(
        `⚠️  [Fast2SMS] No valid FAST2SMS_API_KEY configured in .env. ` +
        `Simulating SMS delivery for ${phone}. OTP: [${code}]`
      );
      return true;
    }

    try {
      this.logger.log(`Dispatching real SMS OTP to ${cleanPhone} via Fast2SMS...`);

      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: code,
          numbers: cleanPhone,
        }),
      });

      const data = (await response.json()) as Fast2SmsResponse;

      if (data.return) {
        this.logger.log(
          `✅ [Fast2SMS] Real OTP successfully sent to ${phone} (ReqID: ${data.request_id})`
        );
        return true;
      } else {
        const errMsg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'SMS dispatch failed');
        this.logger.error(`❌ [Fast2SMS] Gateway Error for ${phone}: ${errMsg}`);

        // In development / testing environments, do not block login if Fast2SMS account needs INR 100 recharge or KYC
        const isDev = this.configService.get<string>('NODE_ENV') !== 'production';
        if (isDev) {
          this.logger.warn(
            `⚠️  [Fast2SMS Dev Fallback] Fast2SMS gateway returned: "${errMsg}". ` +
            `In development mode, proceeding with generated OTP code: [${code}]`
          );
          return true;
        }

        throw new InternalServerErrorException(
          `Failed to deliver SMS OTP via Fast2SMS gateway: ${errMsg}`
        );
      }
    } catch (err: any) {
      if (err instanceof InternalServerErrorException) {
        throw err;
      }
      this.logger.error(`❌ [Fast2SMS] Connection Error: ${err.message}`, err.stack);
      
      const isDev = this.configService.get<string>('NODE_ENV') !== 'production';
      if (isDev) {
        this.logger.warn(
          `⚠️  [Fast2SMS Dev Fallback] Fast2SMS unreachable: "${err.message}". ` +
          `In development mode, proceeding with generated OTP code: [${code}]`
        );
        return true;
      }

      throw new InternalServerErrorException(
        `Fast2SMS gateway unreachable: ${err.message}`
      );
    }
  }
}
