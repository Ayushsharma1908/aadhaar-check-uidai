import mongoose, { Schema, Document } from 'mongoose';

export interface IBiometricUpdate extends Document {
    date: Date;
    state: string;
    district: string;
    pincode: number;
    bio_age_5_17: number;
    bio_age_17_: number;
}

const BiometricUpdateSchema: Schema = new Schema({
    date: { type: Date, required: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    pincode: { type: Number, required: true },
    bio_age_5_17: { type: Number, default: 0 },
    bio_age_17_: { type: Number, default: 0 }
});

BiometricUpdateSchema.index({ state: 1, district: 1, date: -1 });

export default mongoose.model<IBiometricUpdate>('BiometricUpdate', BiometricUpdateSchema);
