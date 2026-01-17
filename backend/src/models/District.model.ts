// src/models/District.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDistrict extends Document {
    name: string;
    state: string;
    freshnessScore: number;
    recordsNeedingUpdatePct: number;
    authFailureRate: number;
    migrationIndex: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    lastUpdated: Date;
    biometricStats: {
        age_5_17: number;
        age_17_plus: number;
        totalUpdates: number;
    };
    demographicStats: {
        age_5_17: number;
        age_17_plus: number;
        totalUpdates: number;
    };
    enrolmentStats: {
        age_0_5: number;
        age_5_17: number;
        age_18_plus: number;
        totalEnrolments: number;
    };
}

const DistrictSchema: Schema = new Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
    freshnessScore: { type: Number, default: 0 },
    recordsNeedingUpdatePct: { type: Number, default: 0 },
    authFailureRate: { type: Number, default: 0 },
    migrationIndex: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    lastUpdated: { type: Date, default: Date.now },
    biometricStats: {
        age_5_17: { type: Number, default: 0 },
        age_17_plus: { type: Number, default: 0 },
        totalUpdates: { type: Number, default: 0 }
    },
    demographicStats: {
        age_5_17: { type: Number, default: 0 },
        age_17_plus: { type: Number, default: 0 },
        totalUpdates: { type: Number, default: 0 }
    },
    enrolmentStats: {
        age_0_5: { type: Number, default: 0 },
        age_5_17: { type: Number, default: 0 },
        age_18_plus: { type: Number, default: 0 },
        totalEnrolments: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Create compound index for efficient queries
DistrictSchema.index({ state: 1, name: 1 }, { unique: true });

export default mongoose.model<IDistrict>('District', DistrictSchema);