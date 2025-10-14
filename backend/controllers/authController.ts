import { Request, Response } from "express";
import Admin from "../models/Admin";
import { createToken, verifyPassword } from "../utils/auth";

const maxAge = 1 * 24 * 60 * 60; 

export const adminLogin = async (req : Request, res : Response) => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if(!admin){
            res.status(404).json({ message: "Email not found"})
            return;
        }

        const isMatch = await verifyPassword(password, admin.password);
  
        if (!isMatch) {
            res.status(401).json({ message: 'Incorrect Password'})
            return;
        }
        const token = createToken(admin._id as string);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
            sameSite: 'none',      
            secure: true        
        });

        res.status(201).json({ success: true })
    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error' });
    }
}