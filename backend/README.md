# Aadhaar Data Freshness Check – UIDAI Hackathon

## Problem Statement
Ensuring Aadhaar data remains accurate and up-to-date without exposing personal data.

## Solution
A privacy-first system that:
- Checks Aadhaar data freshness
- Does NOT store Aadhaar numbers or biometrics
- Fully compliant with Aadhaar Act & DPDP Act

## Features
- Citizen Panel
- Government/Admin Dashboard
- Consent-based verification
- No PII storage

## Tech Stack
- React + Tailwind
- Node.js + Express
- MongoDB
- JWT Auth

## Privacy & Compliance
- No Aadhaar number storage
- No biometric access
- Masked identifiers only
- Audit-friendly architecture

## Setup
```bash
npm install
cp .env.example .env
npm run dev
