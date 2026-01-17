// scripts/importDemographic.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function importDemographic() {
    console.log('📊 Starting Demographic Data Import...');

    const files = [
        './data/datasets demographics/api_data_aadhar_demographic/api_data_aadhar_demographic_0_500000.csv',
        './data/datasets demographics/api_data_aadhar_demographic/api_data_aadhar_demographic_500000_1000000.csv',
        './data/datasets demographics/api_data_aadhar_demographic/api_data_aadhar_demographic_1000000_1500000.csv',
        './data/datasets demographics/api_data_aadhar_demographic/api_data_aadhar_demographic_1500000_2000000.csv',
        './data/datasets demographics/api_data_aadhar_demographic/api_data_aadhar_demographic_2000000_2071700.csv'
    ];

    for (const file of files) {
        console.log(`Importing: ${file}`);
        try {
            const response = await axios.post(`${API_URL}/api/data/import`, {
                filePath: file,
                dataType: 'demographic'
            });
            console.log(`✅ ${response.data.message}`);
        } catch (error) {
            console.error(`❌ Error importing ${file}:`, error.message);
        }
    }

    console.log('✅ Demographic import complete!');
}

importDemographic();
