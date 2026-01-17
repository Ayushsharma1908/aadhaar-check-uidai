// src/services/twilio.service.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let client: any;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

export async function sendOtp(phone: string) {
  if (process.env.OTP_MODE === 'mock') {
    console.log(`📟 MOCK OTP sent to ${phone}: 123456`);

    return {
      success: true,
      otp: '123456',
      message: 'Mock OTP generated (hackathon mode)',
    };
  }

  // 🔁 Real Twilio code goes here later
}

export const sendOTPViaTwilio = async (mobile: string, otp: string): Promise<boolean> => {
    try {
        // If Twilio not configured, log OTP to console (dev mode)
        if (!client || !twilioPhone) {
            console.log(`📱 OTP for ${mobile}: ${otp} (Twilio not configured)`);
            return true;
        }

        const message = await client.messages.create({
            body: `Your AADHAAR Drishti OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
            from: twilioPhone,
            to: `+91${mobile}`
        });

        console.log(`✅ OTP sent to ${mobile}: ${message.sid}`);
        return true;
    } catch (error) {
        console.error('Twilio Error:', error);
        // In dev mode, still log OTP
        console.log(`📱 OTP for ${mobile}: ${otp} (Twilio error, using fallback)`);
        return true;
    }
};
