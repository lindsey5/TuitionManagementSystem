import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { AuthenticatedRequest, DecodedToken } from '../types/types';


export const adminRequireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
        res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        req.user_id = decoded.id;

        const user = await Admin.findById(req.user_id);
        if (!user) {
            res.status(401).json({ success: false, message: "Admin doesn't exist." });
            return;
        }

        next();
    } catch (error: any) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
};