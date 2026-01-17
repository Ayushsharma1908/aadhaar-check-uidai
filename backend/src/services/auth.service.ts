// src/services/auth.service.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aadhaar_drishti_secret_key_change_in_production';
const JWT_EXPIRY = '24h';

export const generateJWT = (payload: { mobile: string; last4Aadhaar: string }): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyJWT = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
