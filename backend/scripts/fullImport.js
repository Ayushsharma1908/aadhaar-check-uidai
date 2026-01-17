// scripts/fullImport.js - Import all data and calculate metrics
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function fullImport() {
    console.log('🚀 Starting Full Data Import Pipeline...\n');

    try {
        console.log('1️⃣ Importing Biometric Data...');
        await execPromise('node scripts/importBiometric.js');

        console.log('\n2️⃣ Importing Demographic Data...');
        await execPromise('node scripts/importDemographic.js');

        console.log('\n3️⃣ Importing Enrolment Data...');
        await execPromise('node scripts/importEnrolment.js');

        console.log('\n4️⃣ Calculating District Metrics...');
        await execPromise('node scripts/calculateMetrics.js');

        console.log('\n✅ Full import pipeline complete!');
    } catch (error) {
        console.error('❌ Import pipeline failed:', error.message);
    }
}

fullImport();
