import { Request, Response } from "express";
import Admin from "../models/Admin";
import { createToken, verifyPassword } from "../utils/auth";
import { AuthenticatedRequest } from "../types/types";
import Student from "../models/Student";
import Registrar from "../models/Registrar";

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

export const getUser = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const student = await Student.findById(req.user_id);

        if(student){
            res.status(200).json({ success: true, user: student, role: 'student'})
            return;
        }

        const admin = await Admin.findById(req.user_id);

        if(admin){
            res.status(200).json({ success: true, user: admin, role: 'admin' });
            return;
        }

        const registrar = await Registrar.findById(req.user_id);

        if(registrar){
            res.status(200).json({ success: true, user: registrar, role: 'registrar' });
            return;
        }

        res.status(404).json({ message: 'User not found'});

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'})
    }
}