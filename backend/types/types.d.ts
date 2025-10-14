import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id: string;
}

interface AuthenticatedRequest extends Request {
  user_id?: string;
}