// src/controllers/dataImport.controller.ts
import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import BiometricUpdate from '../models/BiometricUpdate.model';
import DemographicUpdate from '../models/DemographicUpdate.model';
import Enrolment from '../models/Enrolment.model';
import District from '../models/District.model';

// POST /api/data/import
export const importCSVData = async (req: Request, res: Response) => {
    try {
        const { filePath, dataType } = req.body;

        if (!filePath || !dataType) {
            return res.status(400).json({ error: 'filePath and dataType required' });
        }

        const validTypes = ['biometric', 'demographic', 'enrolment'];
        if (!validTypes.includes(dataType)) {
            return res.status(400).json({ error: 'Invalid dataType. Use: biometric, demographic, or enrolment' });
        }

        let count = 0;
        const batchSize = 1000;
        let batch: any[] = [];

        const Model: any = dataType === 'biometric' ? BiometricUpdate :
            dataType === 'demographic' ? DemographicUpdate :
                Enrolment;

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const record: any = {
                        date: new Date(row.date),
                        state: row.state,
                        district: row.district,
                        pincode: parseInt(row.pincode)
                    };

                    if (dataType === 'biometric') {
                        record.bio_age_5_17 = parseInt(row.bio_age_5_17) || 0;
                        record.bio_age_17_ = parseInt(row.bio_age_17_) || 0;
                    } else if (dataType === 'demographic') {
                        record.demo_age_5_17 = parseInt(row.demo_age_5_17) || 0;
                        record.demo_age_17_ = parseInt(row.demo_age_17_) || 0;
                    } else if (dataType === 'enrolment') {
                        record.age_0_5 = parseInt(row.age_0_5) || 0;
                        record.age_5_17 = parseInt(row.age_5_17) || 0;
                        record.age_18_greater = parseInt(row.age_18_greater) || 0;
                    }

                    batch.push(record);
                    count++;

                    if (batch.length >= batchSize) {
                        Model.insertMany(batch).catch((err: any) => console.error('Insert error:', err));
                        batch = [];
                    }
                })
                .on('end', async () => {
                    if (batch.length > 0) {
                        await Model.insertMany(batch);
                    }
                    res.json({ success: true, message: `Imported ${count} ${dataType} records` });
                    resolve(true);
                })
                .on('error', (error: any) => {
                    res.status(500).json({ error: 'Failed to import CSV', message: error.message });
                    reject(error);
                });
        });
    } catch (error) {
        res.status(500).json({ error: 'Import failed', message: error });
    }
};

// POST /api/data/calculate-metrics
export const calculateDistrictMetrics = async (req: Request, res: Response) => {
    try {
        console.log('📊 Calculating district metrics...');

        // Get unique districts from biometric data
        const distinctDistricts = await BiometricUpdate.aggregate([
            {
                $group: {
                    _id: { state: '$state', district: '$district' }
                }
            }
        ]);

        console.log(`Found ${distinctDistricts.length} unique districts`);

        let processed = 0;

        for (const dist of distinctDistricts) {
            const { state, district } = dist._id;

            // Calculate biometric stats
            const bioStats = await BiometricUpdate.aggregate([
                { $match: { state, district } },
                {
                    $group: {
                        _id: null,
                        total_5_17: { $sum: '$bio_age_5_17' },
                        total_17_plus: { $sum: '$bio_age_17_' }
                    }
                }
            ]);

            // Calculate demographic stats
            const demoStats = await DemographicUpdate.aggregate([
                { $match: { state, district } },
                {
                    $group: {
                        _id: null,
                        total_5_17: { $sum: '$demo_age_5_17' },
                        total_17_plus: { $sum: '$demo_age_17_' }
                    }
                }
            ]);

            // Calculate enrolment stats
            const enrolStats = await Enrolment.aggregate([
                { $match: { state, district } },
                {
                    $group: {
                        _id: null,
                        total_0_5: { $sum: '$age_0_5' },
                        total_5_17: { $sum: '$age_5_17' },
                        total_18_plus: { $sum: '$age_18_greater' }
                    }
                }
            ]);

            const bioData = bioStats[0] || { total_5_17: 0, total_17_plus: 0 };
            const demoData = demoStats[0] || { total_5_17: 0, total_17_plus: 0 };
            const enrolData = enrolStats[0] || { total_0_5: 0, total_5_17: 0, total_18_plus: 0 };

            const totalBio = bioData.total_5_17 + bioData.total_17_plus;
            const totalDemo = demoData.total_5_17 + demoData.total_17_plus;
            const totalEnrol = enrolData.total_0_5 + enrolData.total_5_17 + enrolData.total_18_plus;

            // Calculate freshness score (0-100)
            const updateRatio = totalEnrol > 0 ? ((totalBio + totalDemo) / (totalEnrol * 2)) : 0;
            const freshnessScore = Math.min(Math.round(updateRatio * 100), 100);

            // Calculate records needing update percentage
            const recordsNeedingUpdatePct = Math.max(0, 100 - freshnessScore);

            // Calculate auth failure rate (based on biometric age)
            // Higher failure for older biometrics (17+)
            const authFailureRate = totalBio > 0
                ? ((bioData.total_17_plus / totalBio) * 10).toFixed(2)
                : 0;

            // Migration index (0-10) - based on demographic update frequency
            const migrationIndex = Math.min(10, Math.round((totalDemo / Math.max(totalEnrol, 1)) * 15));

            // Determine risk level
            let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
            if (freshnessScore >= 80) riskLevel = 'Low';
            else if (freshnessScore >= 60) riskLevel = 'Medium';
            else if (freshnessScore >= 40) riskLevel = 'High';
            else riskLevel = 'Critical';

            // Upsert district data
            await District.findOneAndUpdate(
                { state, name: district },
                {
                    state,
                    name: district,
                    freshnessScore,
                    recordsNeedingUpdatePct,
                    authFailureRate: parseFloat(authFailureRate as string),
                    migrationIndex,
                    riskLevel,
                    lastUpdated: new Date(),
                    biometricStats: {
                        age_5_17: bioData.total_5_17,
                        age_17_plus: bioData.total_17_plus,
                        totalUpdates: totalBio
                    },
                    demographicStats: {
                        age_5_17: demoData.total_5_17,
                        age_17_plus: demoData.total_17_plus,
                        totalUpdates: totalDemo
                    },
                    enrolmentStats: {
                        age_0_5: enrolData.total_0_5,
                        age_5_17: enrolData.total_5_17,
                        age_18_plus: enrolData.total_18_plus,
                        totalEnrolments: totalEnrol
                    }
                },
                { upsert: true, new: true }
            );

            processed++;
            if (processed % 100 === 0) {
                console.log(`Processed ${processed}/${distinctDistricts.length} districts`);
            }
        }

        console.log('✅ District metrics calculated successfully');
        res.json({
            success: true,
            message: `Calculated metrics for ${processed} districts`
        });
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: 'Failed to calculate metrics', message: error });
    }
};
