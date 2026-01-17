import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrolment extends Document {
    date: Date;
    state: string;
    district: string;
    pincode: number;
    age_0_5: number;
    age_5_17: number;
    age_18_greater: number;
}

const EnrolmentSchema: Schema = new Schema({
    date: { type: Date, required: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    pincode: { type: Number, required: true },
    age_0_5: { type: Number, default: 0 },
    age_5_17: { type: Number, default: 0 },
    age_18_greater: { type: Number, default: 0 }
});

EnrolmentSchema.index({ state: 1, district: 1, date: -1 });

export default mongoose.model<IEnrolment>('Enrolment', EnrolmentSchema);
