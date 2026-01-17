import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    mobile: string;
    otp: string;
    last4Aadhaar: string;
    verified: boolean;
    expiresAt: Date;
    createdAt: Date;
}

const OTPSchema: Schema = new Schema({
    mobile: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    last4Aadhaar: { type: String, required: true },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 mins
});

export default mongoose.model<IOTP>('OTP', OTPSchema);
