import { Injectable, Logger } from '@nestjs/common';
import { IOtpProvider } from '../interfaces/otp-provider.interface';

@Injectable()
export class MockOtpProvider implements IOtpProvider {
  private readonly logger = new Logger(MockOtpProvider.name);

  async sendOtp(phone: string, code: string): Promise<boolean> {
    this.logger.log(`📱 [MOCK OTP PROVIDER] Code: ${code} sent to recipient: ${phone}`);
    return true;
  }
}
