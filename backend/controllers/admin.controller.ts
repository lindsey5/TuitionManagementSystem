import { Request, Response } from "express";
import Admin from "../models/Admin";
import { AuthenticatedRequest } from "../types/types";

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