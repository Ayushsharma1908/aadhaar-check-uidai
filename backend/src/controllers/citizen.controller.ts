// src/controllers/citizen.controller.ts
import { Request, Response } from 'express';
import OTP from '../models/OTP.model';
import District from '../models/District.model';
import { sendOTPViaTwilio } from '../services/twilio.service';
import { generateJWT } from '../services/auth.service';

// POST /api/citizen/send-otp
export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { mobile, last4Aadhaar } = req.body;

        if (!mobile || !last4Aadhaar) {
            return res.status(400).json({ error: 'Mobile and last 4 digits of Aadhaar required' });
        }

        if (mobile.length !== 10) {
            return res.status(400).json({ error: 'Invalid mobile number' });
        }

        if (last4Aadhaar.length !== 4) {
            return res.status(400).json({ error: 'Invalid Aadhaar digits' });
        }

        // Generate fixed OTP for testing
        const otp = '123456';
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTPs for this mobile
        await OTP.deleteMany({ mobile });

        // Save OTP to database
        await OTP.create({
            mobile,
            otp,
            last4Aadhaar,
            expiresAt,
            verified: false
        });

        // Skip sending actual SMS for now
        // const otpSent = await sendOTPViaTwilio(mobile, otp);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: 600 // seconds
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP', message: error });
    }
};

// POST /api/citizen/verify-otp
export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { mobile, otp, last4Aadhaar } = req.body;

        if (!mobile || !otp || !last4Aadhaar) {
            return res.status(400).json({ error: 'Mobile, OTP, and last 4 Aadhaar digits required' });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({
            mobile,
            last4Aadhaar,
            verified: false
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP or Aadhaar number' });
        }

        // Check if OTP expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Mark as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Generate JWT token
        const token = generateJWT({ mobile, last4Aadhaar });

        res.json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                mobile,
                last4Aadhaar
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify OTP', message: error });
    }
};

// GET /api/citizen/status (Protected)
export const getCitizenStatus = async (req: Request, res: Response) => {
    try {
        const { mobile, last4Aadhaar } = (req as any).user;

        // Mock citizen status based on district data
        // In production, this would query actual citizen records

        // Get random district for demo
        const districts = await District.find().limit(10);
        const randomDistrict = districts[Math.floor(Math.random() * districts.length)];

        // Generate demo status based on risk patterns
        const demoStatus = {
            address: randomDistrict.recordsNeedingUpdatePct > 25 ? 'Stale' : 'Fresh',
            mobile: Math.random() > 0.2 ? 'Linked' : 'Unlinked',
            biometric: randomDistrict.authFailureRate > 5 ? 'Aging' : 'Good'
        };

        const recommendations = [];

        if (demoStatus.address === 'Stale') {
            recommendations.push({
                id: 'rec1',
                title: 'Update Address Online',
                description: 'Your address might be outdated based on migration patterns in your area.',
                priority: 'High',
                estimatedTime: '5 minutes',
                action: 'update_address'
            });
        }

        if (demoStatus.biometric === 'Aging') {
            recommendations.push({
                id: 'rec2',
                title: 'Book Biometric Update',
                description: 'Biometric authentication may fail. Update recommended for seamless services.',
                priority: 'Medium',
                estimatedTime: '30 minutes',
                action: 'book_biometric'
            });
        }

        if (demoStatus.mobile === 'Unlinked') {
            recommendations.push({
                id: 'rec3',
                title: 'Link Mobile Number',
                description: 'Link your mobile for OTP-based authentication.',
                priority: 'High',
                estimatedTime: '2 minutes',
                action: 'link_mobile'
            });
        }

        res.json({
            mobile,
            last4Aadhaar,
            district: randomDistrict.name,
            state: randomDistrict.state,
            demoStatus,
            recommendations,
            districtRisk: randomDistrict.riskLevel,
            districtFreshness: randomDistrict.freshnessScore
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch citizen status', message: error });
    }
};

// POST /api/citizen/chatbot - Get AI recommendations for citizen
export const getCitizenChatbotResponse = async (req: Request, res: Response) => {
    try {
        const { mobile, last4Aadhaar } = (req as any).user;
        const { message } = req.body;

        // Get dashboard stats for context
        const districts = await District.find();
        const totalDistricts = districts.length;
        const highRiskDistricts = districts.filter(d => d.riskLevel === 'Critical' || d.riskLevel === 'High');
        const avgFreshnessScore = districts.length > 0 
            ? districts.reduce((acc, d) => acc + d.freshnessScore, 0) / districts.length 
            : 0;
        const avgUpdatePct = districts.length > 0
            ? districts.reduce((acc, d) => acc + d.recordsNeedingUpdatePct, 0) / districts.length
            : 0;

        const dashboardStats = {
            totalDistricts,
            highRiskCount: highRiskDistricts.length,
            avgFreshnessScore,
            recordsNeedingUpdatePct: avgUpdatePct
        };

        // Get citizen's district data (similar to getCitizenStatus but without res)
        const districtsForCitizen = await District.find().limit(10);
        const randomDistrict = districtsForCitizen.length > 0 
            ? districtsForCitizen[Math.floor(Math.random() * districtsForCitizen.length)]
            : null;
        
        if (!randomDistrict) {
            return res.status(404).json({ error: 'No district data available' });
        }

        const citizenData = {
            district: randomDistrict.name,
            state: randomDistrict.state,
            districtRisk: randomDistrict.riskLevel,
            districtFreshness: randomDistrict.freshnessScore,
            demoStatus: {
                address: randomDistrict.recordsNeedingUpdatePct > 25 ? 'Stale' : 'Fresh',
                mobile: Math.random() > 0.2 ? 'Linked' : 'Unlinked',
                biometric: randomDistrict.authFailureRate > 5 ? 'Aging' : 'Good'
            }
        };

        const { generateCitizenRecommendations } = await import('../services/gemini.service');
        const response = await generateCitizenRecommendations(citizenData, dashboardStats);

        res.json({
            success: true,
            response,
            citizenData
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get chatbot response', message: error });
    }
};