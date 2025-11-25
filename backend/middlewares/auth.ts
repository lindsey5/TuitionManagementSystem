import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/types';
import Admin from '../models/Admin';
import Student from '../models/Student';
import Registrar from '../models/Registrar';

interface DecodedToken extends JwtPayload {
    id: string;
}

export const requireAuth = (...allowedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No Token Provided"
            });
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as DecodedToken;

            req.user_id = decoded.id;

            // ROLE CHECKING LOGIC
            let isAuthorized = false;

            for (const role of allowedRoles) {
                if (role === "admin") {
                    const admin = await Admin.findById(req.user_id);
                    if (admin) {
                        isAuthorized = true;
                        break;
                    }
                }

                if (role === "student") {
                    const student = await Student.findById(req.user_id);
                    if (student) {
                        isAuthorized = true;
                        break;
                    }
                }

                if (role === "registrar") {
                    const registrar = await Registrar.findById(req.user_id);
                    if (registrar) {
                        isAuthorized = true;
                        break;
                    }
                }
            }

            if (!isAuthorized) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: You Do Not Have Permission"
                });
            }

            next();

        } catch (error: any) {
            console.log(error);
            return res.status(403).json({
                success: false,
                message: "Invalid or Expired Token",
                error: error.message
            });
        }
    };
};