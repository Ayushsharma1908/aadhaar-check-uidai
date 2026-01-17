// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../services/auth.service';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    (req as any).user = decoded;
    next();
};