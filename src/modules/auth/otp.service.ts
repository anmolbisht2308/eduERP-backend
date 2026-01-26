import { AppError } from '../../utils/AppError';

// In-memory OTP store for development (redis is overkill right now)
// Map<phone, { otp: string, expires: number }>
const otpStore = new Map<string, { otp: string; expires: number }>();

export const generateOTP = (length: number = 6): string => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

export const sendOTP = async (phone: string, otp: string) => {
    // TODO: Integrate SMS provider (e.g., Twilio, Kaleyra)
    console.log(`[OTP SERVICE] Sending OTP ${otp} to ${phone}`);
    return true;
};

export const storeOTP = (phone: string, otp: string, ttlSeconds: number = 300) => {
    const expires = Date.now() + ttlSeconds * 1000;
    otpStore.set(phone, { otp, expires });
};

export const verifyOTP = (phone: string, inputOtp: string): boolean => {
    const stored = otpStore.get(phone);
    if (!stored) return false;

    if (Date.now() > stored.expires) {
        otpStore.delete(phone);
        return false;
    }

    if (stored.otp === inputOtp) {
        otpStore.delete(phone); // Burn OTP after use
        return true;
    }

    return false;
};
