import Student from "../models/Student";
import { Request, Response } from "express";
import generatePassword from "../utils/password";
import { sendStudentEmail } from "../services/emailService";
import { getStudentById } from "../services/studentService";
import { AuthenticatedRequest } from "../types/types";

export const createStudent = async (req : Request, res : Response) => {
    try{
        const isEmailExist = await Student.findOne({ email: req.body.email });
        if(isEmailExist){
            res.status(409).json({ message: 'Email already exists'});
            return;
        }

        const isStudentIDExist =  await Student.findOne({ student_id: req.body.student_id });
        if(isStudentIDExist){
            res.status(409).json({ message: 'Student ID already exists'});
            return;
        }

        const password = generatePassword(12);
        req.body.password = password;

        const student = await Student.create(req.body);
        await sendStudentEmail(student, password);
        res.status(201).json({ success: true , student});

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getAllStudents = async (req : Request, res : Response) => {
    try{
        const { page, limit, searchTerm, course, status } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let query : any = { status: 'active' };
        if(searchTerm){ 
            query.$or = [
                { firstname: { $regex: searchTerm, $options: 'i' } },
                { middlename: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } },
                { student_id: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if(course && course !== 'All') query.course = course;

        if(status) query.status = status;

        const students = await Student.find(query)
            .populate('course')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        const total = await Student.countDocuments(query);

        res.status(200).json({ success: true, students, total, page: pageNumber, totalPages: Math.ceil(total / limitNumber) });
       
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const editStudent = async (req : Request, res : Response) => {
    try{
        const { id } = req.params;
        
        const isEmailExist = await Student.findOne({ email: req.body.email, _id: { $ne: id} });
        if(isEmailExist){
            res.status(409).json({ message: 'Email already exists'});
            return;
        }

        const isStudentIdExist = await Student.findOne({ student_id: req.body.student_id, _id: { $ne: id }})

        if(isStudentIdExist){
            res.status(409).json({ message: 'Student ID already exists'});
            return;
        }

        const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if(!student){
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json({ success: true, student });

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const editStudentProfile = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { firstname, lastname, email } = req.body;
        const id = req.user_id;
        
        const isEmailExist = await Student.findOne({ email: req.body.email, _id: { $ne: id} });
        if(isEmailExist){
            res.status(409).json({ message: 'Email already exists'});
            return;
        }

        const student = await Student.findById(id);
        if(!student){
            res.status(404).json({ message: "Student not found" });
            return;
        }

        student.email = email || student.email;
        student.firstname = firstname || student.firstname;
        student.lastname = lastname || student.lastname;
        await student.save();

        res.status(200).json({ success: true, student });

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const deleteStudent = async (req : Request, res : Response) => {
    try{
        const student  = await Student.findById(req.params.id);
        if(!student){
            res.status(404).json({ message: 'Student not found.'});
            return;
        }

        student.status = 'removed';
        await student.save();
        res.status(200).json({ success: true, message: 'Student successfully deleted.'})

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getStudentThroughParams = async (req : Request, res : Response) => {
    try{
        const student = await getStudentById(req.params.id);

        if(!student){
            res.status(404).json({ message: 'Student not found.'})
            return;
        }

        res.status(200).json({ success: true, student});

    }catch(err : any){
        res.status(500).json({ message: err.message || 'Server Error'})
    }
}

export const searchStudent = async (req : Request, res : Response) => {
    try{

        const { searchTerm } = req.query;

        const student = await Student.findOne({ student_id: searchTerm, status: 'active' });

        if(!student){
            res.status(404).json({ message: 'Student not found.'})
            return;
        }

        res.status(200).json({ success: true, student });

    }catch(err : any){
        res.status(500).json({ message: err.message || "Server Error" });   
    }
}