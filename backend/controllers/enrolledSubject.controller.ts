import { Request, Response } from "express";
import EnrolledSubject from "../models/EnrolledSubject";
import { AuthenticatedRequest } from "../types/types";
import Semester from "../models/Semester";
import Subject from "../models/Subject";
import { getTotalPaid } from "../services/studentService";
import { Types } from "mongoose";

export const createEnrolledSubject = async (req : Request, res : Response) => {
    try{
        const semester = await Semester.findById(req.body.semester).populate('enrolledsubjects');

        if(!semester){
            res.status(404).json({ message: 'Semester not found.'})
            return;
        }

        const subject = await Subject.findById(req.body.subject);

        if(!subject){
            res.status(404).json({ message: 'Subject not found.'})
            return;
        }

        const isExist = await EnrolledSubject.findOne(req.body);

        if(isExist){
            res.status(409).json({ message: 'Subject already exists'})
            return;
        }

        const enrolledSubject = await EnrolledSubject.create(req.body);

        const enrolledSubjects = await EnrolledSubject.find({ student_id: req.body.student_id, semester: semester._id }).populate('subject');
        
        const totalBeforeDiscount = enrolledSubjects.reduce((total, enrolledSubject: any) => total + semester.pricePerUnit * enrolledSubject.subject.units, 0);
        
        const totalTuition = totalBeforeDiscount - (totalBeforeDiscount * (semester.discount / 100));
        semester.totalTuition = totalTuition;
        
        if(semester.classification !== 'full_scholar'){
            const totalPaid = await getTotalPaid(semester.student_id.toString(), (semester._id as Types.ObjectId).toString());
            semester.remainingBalance = totalTuition - totalPaid;
        }

        await semester.save();

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

export const getMyEnrolledSubjects = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const enrolledSubjects = await EnrolledSubject
            .find({ student_id: req.user_id, semester: req.query.semester })
            .populate(['semester', 'subject']);

        res.status(200).json({ success: true, enrolledSubjects });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ message: err.message || 'Server Error'});
    }
}