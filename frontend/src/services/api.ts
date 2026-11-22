import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api/v1',
  ios: 'http://localhost:3000/api/v1',
  default: 'http://localhost:3000/api/v1',
});

export async function requestOtpApi(phone: string, cityId?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, cityId }),
    });
    const json = await res.json();
    if (!res.ok) {
      const errMsg = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      throw new Error(errMsg || 'Failed to send OTP');
    }
    return json.data || json;
  } catch (err: any) {
    throw new Error(err.message || 'Network error connecting to auth server');
  }
}

export async function verifyOtpApi(phone: string, otp: string, cityId?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, cityId }),
    });
    const json = await res.json();
    if (!res.ok) {
      const errMsg = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      throw new Error(errMsg || 'Invalid OTP');
    }
    return json.data || json;
  } catch (err: any) {
    throw new Error(err.message || 'Network error verifying OTP');
  }
}
