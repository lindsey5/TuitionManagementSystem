import { Request, Response } from "express";
import EnrolledSubject from "../models/EnrolledSubject";

export const createEnrolledSubject = async (req : Request, res : Response) => {
    try{
        const enrolledSubject = await EnrolledSubject.create(req.body);

        res.status(201).json({ success: true, enrolledSubject });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'});
    }
}

export const getEnrolledSubjects = async (req : Request, res : Response) => {
    try{
        const enrolledSubjects = await EnrolledSubject
            .find({ student_id: req.query.student_id, semester: req.query.semester })
            .populate(['semester', 'subject']);

        res.status(200).json({ success: true, enrolledSubjects });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'});
    }
}