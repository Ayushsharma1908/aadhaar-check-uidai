// src/routes/admin.routes.ts
import express from 'express';
import {
    getAggregatedStats,
    getDistrictRiskAnalysis,
    getUpdateGapAnalysis,
    getMigrationImpactData,
    getAIRecommendations,
    getAllStates
} from '../controllers/admin.controller';

const router = express.Router();

// GET /api/admin/stats - Aggregated KPI stats
router.get('/stats', getAggregatedStats);

// GET /api/admin/states - Get all unique states
router.get('/states', getAllStates);

// GET /api/admin/districts - District risk analysis
router.get('/districts', getDistrictRiskAnalysis);

// GET /api/admin/update-gaps - Update gap analysis (urban vs rural)
router.get('/update-gaps', getUpdateGapAnalysis);

// GET /api/admin/migration-impact - Migration vs staleness data
router.get('/migration-impact', getMigrationImpactData);

// POST /api/admin/recommendations - AI-generated recommendations
router.post('/recommendations', getAIRecommendations);

export default router;