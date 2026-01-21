<<<<<<< HEAD
# aadhaar-check-uidai
---
## UIDAI Data Freshness & Citizen Enablement Platform

Aadhaar Drishti is a data‑driven analytical and citizen‑centric platform designed to improve **Aadhaar data freshness, usability, and service reliability**. Developed as part of the **UIDAI Hackathon**, the platform analyzes **Aadhaar enrolment and update datasets** to generate actionable insights for administrators while enabling citizens to verify and update their Aadhaar information through a guided interface.

---

## 📌 Problem Statement

While Aadhaar has achieved near‑universal coverage, **outdated demographic and biometric information** remains a major challenge. Factors such as internal migration, ageing population, and mobile number changes lead to:
- Authentication failures  
- Delays in availing government benefits  
- Silent exclusion from welfare schemes  

The need is to shift focus from *coverage* to **data freshness and functional usability**.

---

## 💡 Solution Overview

**Aadhaar Drishti** provides a **two‑panel system**:

1. **Admin / Government Dashboard**  
   An analytics platform for officials to identify high‑risk districts, age groups, and Aadhaar update gaps using aggregated data.

2. **Citizen Portal**  
   A user‑friendly interface where citizens can voluntarily check Aadhaar data freshness, receive AI‑driven guidance, and initiate updates.

All processing is done on **aggregated and anonymized datasets**, ensuring privacy and compliance.

---

## 🧩 Key Features

### 🔹 Admin Dashboard
- Aadhaar **Data Freshness Score**
- District‑wise and age‑wise risk analysis
- Update gap analysis:
  - Address
  - Mobile number
  - Biometrics
- Urban vs Rural comparison
- Migration vs data staleness correlation
- High‑risk district identification
- **AI‑generated actionable recommendations**
- Advanced filters (State, District, Age Group, Time Range)

---

### 🔹 Citizen Portal
- Secure Aadhaar status check *(Demo Mode)*
- View freshness status of:
  - Address
  - Mobile number
  - Biometrics
- Clear indicators: *Up‑to‑date / Needs Update*
- Guided update recommendations
- **AI Chatbot Assistant** for Aadhaar‑related queries
- Transparency section explaining why updates are recommended

---

## 🔄 System Workflow

1. **Data Ingestion**
   - UIDAI Aadhaar enrolment & update datasets (aggregated)

2. **Data Processing**
   - Cleaning & preprocessing
   - Freshness and risk score computation

3. **Analytics & Visualisation**
   - Dashboard charts and indicators
   - District and demographic drill‑downs

4. **AI‑Driven Recommendations**
   - Gemini API generates insights for administrators
   - Chatbot assists citizens with guidance

5. **Citizen Action**
   - Voluntary login
   - Status review
   - Guided update initiation

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Chart.js / Recharts  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### AI & Analytics
- **Gemini API** (AI recommendations & chatbot)
- Custom freshness and risk scoring algorithms

### Architecture
- **MERN Stack**
- RESTful APIs
- Scalable and modular design

---

## 🔐 Privacy & Compliance

- Uses **only aggregated and anonymized UIDAI datasets**
- No Aadhaar numbers, biometrics, or personal identifiers stored
- Citizen portal operates in **demo/simulation mode**
- Designed in compliance with:
  - Aadhaar Act, 2016  
  - DPDP Act, 2023  

---

## 📊 Dataset Used

- UIDAI Aadhaar Enrolment & Update Dataset  
- Key attributes:
  - State
  - District
  - Age Group
  - Update Type (Address / Mobile / Biometric)
  - Update Counts
  - Time Period

---

## 🚀 Future Scope

- Secure integration with authorized UIDAI APIs
- SMS / IVR‑based citizen awareness
- Predictive analytics for update demand
- Multilingual AI chatbot support
- Integration with mobile Aadhaar update units



=======
# Aadhaar Check – Citizen Client (Frontend)

## Overview
This is the **Citizen-facing frontend** of the **Aadhaar Data Freshness Check System**, built as part of a **UIDAI Hackathon**.

The client allows citizens to:
- Enter their mobile number
- Receive OTP (demo mode)
- Check Aadhaar data freshness status
- View consent-based information without exposing Aadhaar numbers or biometrics

⚠️ **No Aadhaar number, biometric data, or sensitive PII is stored or displayed.**

---

## Key Objectives
- Privacy-by-design architecture
- UIDAI & DPDP Act compliant UI
- Consent-based citizen interaction
- Clear separation from backend logic

---

## Tech Stack
- **React.js**
- **Tailwind CSS**
- **Axios / Fetch API**
- **Vite** (if applicable)

---

## Project Structure

client/
├── src/
│ ├── components/
│ │ ├── Button.tsx
│ │ ├── Chatbot.tsx
│ │ ├── Header.tsx
│ ├── pages/
│ │ ├── AdminDashboard.tsx
│ │ ├── CitizenPortal.tsx
│ ├── services/
│ │ └── dataService.ts
│ ├── types/
│ │ └── index.ts
│ ├── App.tsx
│ └── index.tsx
├── index.html
├── package.json
└── README.md
>>>>>>> 89ae0ad (Add client-side README)
