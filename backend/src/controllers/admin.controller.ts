// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import District from '../models/District.model';
import { generateAIRecommendations } from '../services/gemini.service';

// GET /api/admin/stats
export const getAggregatedStats = async (req: Request, res: Response) => {
    try {
        const districts = await District.find();

        if (districts.length === 0) {
            return res.json({
                freshnessScore: 0,
                recordsNeedingUpdatePct: 0,
                highRiskDistricts: 0,
                avgFailureRate: 0
            });
        }

        const totalFreshness = districts.reduce((acc, d) => acc + d.freshnessScore, 0);
        const avgFreshness = Math.round(totalFreshness / districts.length);

        const totalUpdatePct = districts.reduce((acc, d) => acc + d.recordsNeedingUpdatePct, 0);
        const avgUpdatePct = (totalUpdatePct / districts.length).toFixed(1);

        const highRiskCount = districts.filter(d =>
            d.riskLevel === 'Critical' || d.riskLevel === 'High'
        ).length;

        const totalFailureRate = districts.reduce((acc, d) => acc + d.authFailureRate, 0);
        const avgFailureRate = (totalFailureRate / districts.length).toFixed(1);

        res.json({
            freshnessScore: avgFreshness,
            recordsNeedingUpdatePct: parseFloat(avgUpdatePct),
            highRiskDistricts: highRiskCount,
            avgFailureRate: parseFloat(avgFailureRate)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch aggregated stats', message: error });
    }
};

// GET /api/admin/districts
export const getDistrictRiskAnalysis = async (req: Request, res: Response) => {
    try {
        const { state, riskLevel } = req.query;

        let query: any = {};
        if (state) query.state = state;
        if (riskLevel) query.riskLevel = riskLevel;

        const districts = await District.find(query)
            .sort({ freshnessScore: 1 })
            .limit(100);

        const formatted = districts.map(d => ({
            id: d._id,
            name: d.name,
            state: d.state,
            freshnessScore: d.freshnessScore,
            recordsNeedingUpdatePct: d.recordsNeedingUpdatePct,
            authFailureRate: d.authFailureRate,
            migrationIndex: d.migrationIndex,
            riskLevel: d.riskLevel,
            lastUpdated: d.lastUpdated
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch district data', message: error });
    }
};

// GET /api/admin/update-gaps
export const getUpdateGapAnalysis = async (req: Request, res: Response) => {
    try {
        // Calculate urban vs rural gaps from district data
        const districts = await District.find();

        // Simple heuristic: use pincode to determine urban/rural
        // Urban: higher population density, more updates
        const urbanDistricts = districts.filter(d => d.migrationIndex > 7);
        const ruralDistricts = districts.filter(d => d.migrationIndex <= 7);

        const calcAvgGap = (dists: any[]) => {
            if (dists.length === 0) return 0;
            const total = dists.reduce((acc, d) => acc + d.recordsNeedingUpdatePct, 0);
            return Math.round(total / dists.length);
        };

        const updateGaps = [
            {
                type: 'Address',
                urbanGap: calcAvgGap(urbanDistricts) * 0.6, // Address updates are ~60% of total
                ruralGap: calcAvgGap(ruralDistricts) * 0.6
            },
            {
                type: 'Mobile',
                urbanGap: calcAvgGap(urbanDistricts) * 0.3, // Mobile updates are ~30% of total
                ruralGap: calcAvgGap(ruralDistricts) * 0.5
            },
            {
                type: 'Biometric',
                urbanGap: calcAvgGap(urbanDistricts) * 0.8, // Biometric updates are ~80% of total
                ruralGap: calcAvgGap(ruralDistricts) * 0.9
            }
        ];

        res.json(updateGaps);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch update gaps', message: error });
    }
};

// GET /api/admin/migration-impact
export const getMigrationImpactData = async (req: Request, res: Response) => {
    try {
        const districts = await District.find()
            .select('name state migrationIndex freshnessScore riskLevel')
            .limit(50);

        const formatted = districts.map(d => ({
            name: d.name,
            state: d.state,
            migrationIndex: d.migrationIndex,
            updateLag: 100 - d.freshnessScore,
            risk: d.riskLevel
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch migration impact data', message: error });
    }
};

// GET /api/admin/states - Get all unique states
export const getAllStates = async (req: Request, res: Response) => {
    try {
        const states = await District.distinct('state');
        // If no states in database, return all Indian states as fallback
        if (states.length === 0) {
            const allIndianStates = [
                'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
                'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
                'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
                'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
                'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
                'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
                'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
            ];
            return res.json(allIndianStates);
        }
        res.json(states.sort());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch states', message: error });
    }
};

// POST /api/admin/recommendations
export const getAIRecommendations = async (req: Request, res: Response) => {
    try {
        const { context } = req.body;

        // Get current stats for AI context
        const districts = await District.find().sort({ riskLevel: -1 }).limit(10);
        const highRiskDistricts = districts.filter(d => d.riskLevel === 'Critical' || d.riskLevel === 'High');

        const statsContext = {
            totalDistricts: await District.countDocuments(),
            highRiskCount: highRiskDistricts.length,
            avgFreshnessScore: districts.reduce((acc, d) => acc + d.freshnessScore, 0) / districts.length,
            topRiskyDistricts: highRiskDistricts.map(d => ({ name: d.name, state: d.state, score: d.freshnessScore }))
        };

        const recommendations = await generateAIRecommendations(statsContext, context);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recommendations', message: error });
    }
};