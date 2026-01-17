# AADHAAR Drishti Backend API

Backend API for AADHAAR Drishti - A Privacy-First National Platform for Aadhaar Data Freshness & Usability.

## 🏗️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + Twilio OTP
- **AI**: Google Gemini API

## 📦 Installation

```bash
# Install dependencies
npm install

# Create data directory
mkdir data

# Copy your CSV files to the data directory
cp path/to/csv/files/* ./data/
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aadhaar_drishti
JWT_SECRET=your_secret_key_here

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

1. **Twilio OTP**:
   - Sign up at [twilio.com](https://www.twilio.com/)
   - Get Account SID, Auth Token, and Phone Number
   - Add credentials to `.env`

2. **Gemini AI**:
   - Get API key from [Google AI Studio](https://makersuite.google.com/)
   - Add to `.env` as `GEMINI_API_KEY`

## 🚀 Running the Backend

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📊 Data Import

### Step 1: Import CSV Data

Place your CSV files in the `./data/` directory, then run:

```bash
# Import all biometric data
node scripts/importBiometric.js

# Import all demographic data
node scripts/importDemographic.js

# Import all enrolment data
node scripts/importEnrolment.js
```

Or import everything at once:
```bash
node scripts/fullImport.js
```

### Step 2: Calculate District Metrics

After importing data, calculate aggregated metrics:

```bash
node scripts/calculateMetrics.js
```

This will:
- Calculate freshness scores for each district
- Compute risk levels
- Generate migration indices
- Calculate auth failure rates

## 📡 API Endpoints

### Admin Dashboard APIs

#### Get Aggregated Stats
```
GET /api/admin/stats
```

Response:
```json
{
  "freshnessScore": 72,
  "recordsNeedingUpdatePct": 18.5,
  "highRiskDistricts": 12,
  "avgFailureRate": 4.2
}
```

#### Get District Risk Analysis
```
GET /api/admin/districts?state=Maharashtra&riskLevel=High
```

Response:
```json
[
  {
    "id": "...",
    "name": "Pune",
    "state": "Maharashtra",
    "freshnessScore": 88,
    "recordsNeedingUpdatePct": 12,
    "authFailureRate": 2.1,
    "migrationIndex": 8.5,
    "riskLevel": "Low",
    "lastUpdated": "2023-10-01"
  }
]
```

#### Get Update Gap Analysis
```
GET /api/admin/update-gaps
```

Response:
```json
[
  {
    "type": "Address",
    "urbanGap": 15,
    "ruralGap": 35
  },
  {
    "type": "Mobile",
    "urbanGap": 8,
    "ruralGap": 42
  },
  {
    "type": "Biometric",
    "urbanGap": 25,
    "ruralGap": 55
  }
]
```

#### Get Migration Impact Data
```
GET /api/admin/migration-impact
```

#### Get AI Recommendations
```
POST /api/admin/recommendations
Content-Type: application/json

{
  "context": "Focus on rural areas"
}
```

Response:
```json
[
  {
    "id": "r1",
    "title": "Mobile Update Vans",
    "description": "Deploy mobile vans in high-risk districts",
    "priority": "High",
    "actionType": "Infrastructure"
  }
]
```

### Citizen Portal APIs

#### Send OTP
```
POST /api/citizen/send-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "last4Aadhaar": "1234"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

#### Verify OTP
```
POST /api/citizen/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456",
  "last4Aadhaar": "1234"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_here",
  "user": {
    "mobile": "9876543210",
    "last4Aadhaar": "1234"
  }
}
```

#### Get Citizen Status (Protected)
```
GET /api/citizen/status
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "mobile": "9876543210",
  "last4Aadhaar": "1234",
  "district": "Pune",
  "state": "Maharashtra",
  "demoStatus": {
    "address": "Stale",
    "mobile": "Linked",
    "biometric": "Good"
  },
  "recommendations": [
    {
      "id": "rec1",
      "title": "Update Address Online",
      "description": "Your address might be outdated",
      "priority": "High",
      "estimatedTime": "5 minutes",
      "action": "update_address"
    }
  ],
  "districtRisk": "Low",
  "districtFreshness": 88
}
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   ├── citizen.controller.ts
│   │   └── dataImport.controller.ts
│   ├── models/
│   │   ├── District.model.ts
│   │   ├── BiometricUpdate.model.ts
│   │   ├── DemographicUpdate.model.ts
│   │   ├── Enrolment.model.ts
│   │   └── OTP.model.ts
│   ├── routes/
│   │   ├── admin.routes.ts
│   │   ├── citizen.routes.ts
│   │   └── dataImport.routes.ts
│   ├── services/
│   │   ├── gemini.service.ts
│   │   ├── twilio.service.ts
│   │   └── auth.service.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── server.ts
├── scripts/
│   ├── importBiometric.js
│   ├── importDemographic.js
│   ├── importEnrolment.js
│   ├── calculateMetrics.js
│   └── fullImport.js
├── data/
│   └── (CSV files here)
├── .env
├── package.json
└── tsconfig.json
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **OTP Verification**: Two-factor authentication via Twilio
- **DPDP Compliance**: No PII storage, aggregated data only
- **Rate Limiting**: Built-in request throttling
- **CORS Protection**: Configurable CORS policies

## 📈 Database Schema

### District Collection
- Stores aggregated metrics per district
- Freshness scores, risk levels, migration indices
- Biometric, demographic, and enrolment statistics

### BiometricUpdate Collection
- Raw biometric update data from CSV
- Indexed by state, district, date

### DemographicUpdate Collection
- Raw demographic update data from CSV
- Indexed by state, district, date

### Enrolment Collection
- Raw enrolment data from CSV
- Indexed by state, district, date

### OTP Collection
- Temporary OTP storage
- Auto-expires after 10 minutes

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Test admin stats
curl http://localhost:5000/api/admin/stats

# Test OTP send (dev mode logs OTP to console)
curl -X POST http://localhost:5000/api/citizen/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","last4Aadhaar":"1234"}'
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB (macOS)
brew services start mongodb-community

# Start MongoDB (Ubuntu)
sudo systemctl start mongod
```

### Twilio Not Working
- In development, OTP is logged to console
- Check Twilio credentials in `.env`
- Verify phone number format: +91XXXXXXXXXX

### Gemini API Errors
- Verify API key is correct
- Check quota limits
- Fallback recommendations are used if API fails

## 📝 Notes

- **Dev Mode**: OTP is logged to console if Twilio not configured
- **Data Privacy**: All data is aggregated, no individual PII stored
- **Scalability**: MongoDB indexes optimize query performance
- **AI Recommendations**: Gemini API with fallback to rule-based logic

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of UIDAI Hackathon submission.

---

Built with ❤️ for Digital India 🇮🇳