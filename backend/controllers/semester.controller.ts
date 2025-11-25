import { Request, Response } from "express";
import Semester from "../models/Semester";
import { AuthenticatedRequest } from "../types/types";
import { getRemainingBalance } from "../services/studentService";
import { Types } from "mongoose";

export const createSemester = async (req : Request, res : Response) => {
    try{
        const isExist = await Semester.findOne(req.body);

        if(isExist){
            res.status(409).json({ message: 'Semester already exists'});
            return;
        }

        const semester = await Semester.create(req.body);
        res.status(201).json({ success: true, semester});

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}

export const getStudentSemesters = async (req : Request, res : Response) => {
    try{

        const semesters = await Semester.find({ student_id: req.params.id }).populate("course")
        res.status(200).json({ success: true, semesters });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}

export const getAuthenticatedSemesters = async (req : AuthenticatedRequest, res : Response) => {
    try{

        const semesters = await Semester.find({ student_id: req.user_id }).populate("course")
        res.status(200).json({ success: true, semesters });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}

export const deleteSemester = async (req : Request, res : Response) => {
    try{
        const semester = await Semester.findOneAndDelete({ _id: req.params.id });
        if(!semester){
            res.status(404).json({ message: 'Semester not found.'});
            return;
        }

        res.status(200).json({ success: true, message: 'Semester successfully deleted' })

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}

export const getSemesterById = async (req : Request, res: Response) => {
    try{
        const semester = await Semester.findById(req.params.id);

        if(!semester){
            res.status(404).json({ message: 'Semester not found.'})
            return;
        }

        const balance = await getRemainingBalance(semester.student_id.toString(), (semester._id as Types.ObjectId).toString());

        res.status(200).json({ success: true, semester, ...balance });

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}