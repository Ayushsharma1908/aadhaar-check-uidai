// scripts/calculateMetrics.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function calculateMetrics() {
    console.log('📊 Calculating District Metrics...');

    try {
        const response = await axios.post(`${API_URL}/api/data/calculate-metrics`);
        console.log(`✅ ${response.data.message}`);
    } catch (error) {
        console.error('❌ Error calculating metrics:', error.message);
    }
}

calculateMetrics();
