// src/routes/dataImport.routes.ts
import express from 'express';
import { importCSVData, calculateDistrictMetrics } from '../controllers/dataImport.controller';

const router = express.Router();

// POST /api/data/import - Import CSV data
router.post('/import', importCSVData);

// POST /api/data/calculate-metrics - Calculate district metrics
router.post('/calculate-metrics', calculateDistrictMetrics);

export default router;