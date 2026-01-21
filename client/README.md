
# Aadhaar Check – Citizen Client

## 📌 Overview
This is the **Citizen-facing frontend** of the **Aadhaar Data Freshness Check System**, developed as part of a **UIDAI Hackathon**.

The client application allows citizens to:
- Enter their mobile number
- Receive OTP (demo mode)
- Verify Aadhaar data freshness status
- View consent-based information securely

⚠️ **No Aadhaar numbers, biometric data, or sensitive personal data are stored or displayed.**

---

## 🎯 Objectives
- Privacy-by-design UI
- UIDAI & DPDP Act compliant flow
- Consent-based citizen interaction
- Secure communication with backend APIs

---

## 🛠 Tech Stack
- **React.js**
- **Tailwind CSS**
- **Vite**
- **Axios / Fetch API**

---

## 📁 Project Structure
client/
├── src/
│ ├── components/
│ │ ├── CitizenForm.jsx
│ │ ├── OtpInput.jsx
│ │ └── StatusCard.jsx
│ ├── pages/
│ │ └── CitizenHome.jsx
│ ├── services/
│ │ └── api.js
│ ├── App.jsx
│ └── main.jsx
├── index.html
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
