// scripts/importEnrolment.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function importEnrolment() {
    console.log('📊 Starting Enrolment Data Import...');

    const files = [
        './data/datasets enrollment/api_data_aadhar_enrolment/api_data_aadhar_enrolment_0_500000.csv',
        './data/datasets enrollment/api_data_aadhar_enrolment/api_data_aadhar_enrolment_500000_1000000.csv',
        './data/datasets enrollment/api_data_aadhar_enrolment/api_data_aadhar_enrolment_1000000_1006029.csv'
    ];

    for (const file of files) {
        console.log(`Importing: ${file}`);
        try {
            const response = await axios.post(`${API_URL}/api/data/import`, {
                filePath: file,
                dataType: 'enrolment'
            });
            console.log(`✅ ${response.data.message}`);
        } catch (error) {
            console.error(`❌ Error importing ${file}:`, error.message);
        }
    }

    console.log('✅ Enrolment import complete!');
}

importEnrolment();
