// src/routes/citizen.routes.ts
import express from 'express';
import {
    sendOTP,
    verifyOTP,
    getCitizenStatus,
    getCitizenChatbotResponse
} from '../controllers/citizen.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/citizen/send-otp - Send OTP to mobile
router.post('/send-otp', sendOTP);

// POST /api/citizen/verify-otp - Verify OTP and login
router.post('/verify-otp', verifyOTP);

// GET /api/citizen/status - Get citizen's data status (protected)
router.get('/status', authenticateToken, getCitizenStatus);

// POST /api/citizen/chatbot - Get AI chatbot recommendations (protected)
router.post('/chatbot', authenticateToken, getCitizenChatbotResponse);

export default router;