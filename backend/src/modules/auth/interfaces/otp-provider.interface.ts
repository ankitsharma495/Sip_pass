export const OTP_PROVIDER = 'OTP_PROVIDER';

export interface IOtpProvider {
  /**
   * Dispatches an OTP code to the recipient's phone number.
   * @param phone Normalized phone number (e.g. +919820451290)
   * @param code Numeric OTP code
   */
  sendOtp(phone: string, code: string): Promise<boolean>;
}
