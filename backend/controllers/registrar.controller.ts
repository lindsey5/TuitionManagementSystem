import Registrar from "../models/Registrar";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import { verifyPassword } from "../utils/auth";

export const createRegistrar = async (req : Request, res : Response) => {
    try{
        const isEmailExist = await Registrar.findOne({ email: req.body.email });

        if(isEmailExist){
            res.status(409).json({ message: 'Email already used.'})
            return;
        }

        const registrar = await Registrar.create(req.body);

        res.status(201).json({ success: true, registrar });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const getAllRegistrars = async (req : Request, res : Response) => {
    try{
        const registrars = await Registrar.find();

        res.status(200).json({ success: true, registrars });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const editRegistrar = async (req : Request, res : Response) => {
    try{
        const isEmailExist = await Registrar.findOne({ email: req.body.email, _id: { $ne: req.params.id } });

        if(isEmailExist){
            res.status(409).json({ message: 'Email already used.'})
            return;
        }

        const registrar = await Registrar.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if(!registrar){
            res.status(404).json({ message: 'Registrar not found.'})
            return;
        }

        res.status(200).json({ success: true, registrar });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error.'});
    }
}

export const deleteRegistrar = async (req : Request, res : Response) => {
    try {
        const deleted = await Registrar.findOneAndDelete({ _id: req.params.id });

        if (!deleted) {
        return res.status(404).json({ success: false, message: "Registrar not found" });
        }

        res.json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateRegistrarProfile = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { firstname, lastname, email } = req.body;
        const registrar = await Registrar.findById(req.user_id);

        if(!registrar){
            res.status(404).json({ message: 'Registrar not found.' });
            return;
        }

        const isEmailExist = await Registrar.findOne({ 
            email, 
            _id: { $ne: req.user_id }
        });

        if(isEmailExist){
            res.status(409).json({ message: 'Someone is already using this email.' });
            return;
        }

        registrar.firstname = firstname || registrar.firstname;
        registrar.lastname = lastname || registrar.lastname;
        registrar.email = email || registrar.email;
        await registrar.save();

        res.status(200).json({ 
            success: true, 
            message: 'Your profile was updated successfully.' 
        });

    }catch(err: any){
        res.status(500).json({ 
            message: err.message || 'Server Error.' 
        });
    }
};

export const changeRegistrarPassword = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { newPassword, currentPassword } = req.body;

        const registrar = await Registrar.findById(req.user_id);

        if(!registrar){
            res.status(404).json({ message: 'Registrar not found.' });
            return;
        }

        if(!await verifyPassword(currentPassword, registrar.password)){
            res.status(403).json({ message: 'Your current password is incorrect.' });
            return;
        }

        if(await verifyPassword(newPassword, registrar.password)){
            res.status(403).json({ message: 'Your new password must be different from your current password.' });
            return;
        }

        registrar.password = newPassword;
        await registrar.save();

        res.status(200).json({ success: true });

    }catch(err: any){
        res.status(500).json({ 
            message: err.message || 'Server Error.' 
        });
    }
};
