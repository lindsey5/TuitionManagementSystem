import { Request, Response } from "express";
import Subject from "../models/Subject";

export const createSubject = async (req : Request, res : Response) => {
    try{
        const isNameExist = await Subject.findOne({ name: req.body.name, status: 'active' });

        if(isNameExist){
            res.status(400).json({ message: "Subject already exists" });
            return;
        }

        const isCodeExist = await Subject.findOne({ code: req.body.code, status: 'active'});

        if(isCodeExist){
            res.status(409).json({ message: 'Subject code already exists.'});
            return;
        }

        let subject = await Subject.findOne({ 
            $or: [
                { name: req.body.name },
                { code: req.body.code }
            ], 
            status: 'inactive' 
        })
        if(subject){
            subject.status = 'active',
            subject.name = req.body.name;
            subject.code = req.body.code;
            subject.units = req.body.units;
            subject.createdAt = new Date()
        }else{
            subject = await Subject.create(req.body);
        }
        
        res.status(201).json({ success: true , subject});
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getAllSubjects = async (req : Request, res : Response) => {
    try{
        const { page, limit, searchTerm } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let filter : any = { status: 'active' };
        if(searchTerm){
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { code: { $regex: searchTerm, $options: 'i' } },
            ]
        }
        
        const subjects = await Subject.find(filter).skip(skip).limit(limitNumber).sort({ createdAt: -1});
        const total = await Subject.countDocuments(filter);

        res.status(200).json({
            success: true,
            subjects,
            page,
            total,
            totalPages: Math.ceil(total / limitNumber)
        })

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const editSubject = async (req : Request, res : Response) => {
    try{
        const { id } = req.params;
        const { name, code, units } = req.body;

        const isNameExist = await Subject.findOne({ name,_id: { $ne: id }, status: 'active'});

        if(isNameExist){
            res.status(409).json({ message: 'Subject name already exists.'});
            return;
        }

        const isCodeExist = await Subject.findOne({ code, _id: { $ne: id }, status: 'active'});

        if(isCodeExist){
            res.status(409).json({ message: 'Subject code already exists.'});
            return;
        }

        const subject = await Subject.findById(id);
        if(!subject){
            res.status(404).json({ message: "Subject not found" });
            return;
        }
        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.units = units || subject.units;
        await subject.save();
        res.status(200).json({ success: true, subject });
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const deleteSubject = async (req : Request, res : Response) => {
    try{
        const { id } = req.params;
        const subject = await Subject.findById(id);
        if(!subject){
            res.status(404).json({ message: "Subject not found" });
            return;
        }
        subject.status = 'removed';
        await subject.save();
        res.status(200).json({ success: true, message: "Subject deleted successfully" });
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}