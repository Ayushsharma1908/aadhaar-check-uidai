// scripts/importBiometric.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function importBiometric() {
    console.log('📊 Starting Biometric Data Import...');

    const files = [
        './data/datasets biometric/api_data_aadhar_biometric/api_data_aadhar_biometric_0_500000.csv',
        './data/datasets biometric/api_data_aadhar_biometric/api_data_aadhar_biometric_500000_1000000.csv',
        './data/datasets biometric/api_data_aadhar_biometric/api_data_aadhar_biometric_1000000_1500000.csv',
        './data/datasets biometric/api_data_aadhar_biometric/api_data_aadhar_biometric_1500000_1861108.csv'
    ];

    for (const file of files) {
        console.log(`Importing: ${file}`);
        try {
            const response = await axios.post(`${API_URL}/api/data/import`, {
                filePath: file,
                dataType: 'biometric'
            });
            console.log(`✅ ${response.data.message}`);
        } catch (error) {
            console.error(`❌ Error importing ${file}:`, error.message);
        }
    }

    console.log('✅ Biometric import complete!');
}

importBiometric();