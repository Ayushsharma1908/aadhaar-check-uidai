import mongoose, { Schema, Document } from 'mongoose';

export interface IDemographicUpdate extends Document {
    date: Date;
    state: string;
    district: string;
    pincode: number;
    demo_age_5_17: number;
    demo_age_17_: number;
}

const DemographicUpdateSchema: Schema = new Schema({
    date: { type: Date, required: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    pincode: { type: Number, required: true },
    demo_age_5_17: { type: Number, default: 0 },
    demo_age_17_: { type: Number, default: 0 }
});

DemographicUpdateSchema.index({ state: 1, district: 1, date: -1 });

export default mongoose.model<IDemographicUpdate>('DemographicUpdate', DemographicUpdateSchema);
