import { Request, Response } from "express";
import Admin from "../models/Admin";
import { AuthenticatedRequest } from "../types/types";
import { verifyPassword } from "../utils/auth";

export const createAdmin = async (req : Request, res : Response) => {
    try{

        const admin = await Admin.create(req.body);

        res.status(201).json({ success: true, admin });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const getAdmin = async (req : AuthenticatedRequest, res : Response) => {
    try{

        const admin = await Admin.findById(req.user_id);

        res.status(200).json({ success: true, admin });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const updateAdminProfile = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { firstname, lastname, email } = req.body;
        const admin = await Admin.findById(req.user_id)

        if(!admin){
            res.status(404).json({ message: 'Admin not found.'})
            return;
        }

        const isEmailExist = await Admin.findOne({ email, _id: { $ne: req.user_id }});

        if(isEmailExist){
            res.status(409).json({ message: 'Someone is already using this email.'})
            return;
        }

        admin.firstname = firstname || admin.firstname;
        admin.lastname = lastname || admin.lastname;
        admin.email = email || admin.email;
        await admin.save();

        res.status(200).json({ success: true, message: 'Your Profile updated Successfully.'})

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const changeAdminPassword = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { newPassword, currentPassword } = req.body;

        const admin = await Admin.findById(req.user_id);

        if(!admin){
            res.status(404).json({ message: 'Admin not found.'});
            return;
        }

        if(!await verifyPassword(currentPassword, admin.password)){
            res.status(403).json({ message: 'Your current password is incorrect.'})
            return;
        }

        if(await verifyPassword(newPassword, admin.password)){
            res.status(403).json({ message: 'Your new password must be different from your current password.'})
            return;
        }

        admin.password = newPassword;
        await admin.save();
        res.status(200).json({ success: true });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}