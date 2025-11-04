import Course from "../models/Course";
import { Request, Response } from "express";

export const createCourse = async (req: Request, res : Response) => {
    try{
        const { name, code } = req.body;
        if(!name){
            res.status(400).json({ message: "Course name is required" });
            return;
        }
        if(!code){
            res.status(400).json({ message: "Couse code is required" });
            return;
        }

        const isCodeExist = await Course.findOne({ code,  status: 'active' });
        if(isCodeExist){
            res.status(409).json({ message: "Course code already exists" });
            return;
        }

        const isNameExist = await Course.findOne({ name, status: 'active' });
        if(isNameExist){
            res.status(409).json({ message: "Course name already exists" });
            return;
        }

        let course = await Course.findOne({  
            $or: [
                { name },
                { code }
            ],
            status: 'removed' }
        );
        if(course){
            course.name = name;
            course.code = code;
            course.status = 'active';
            course.createdAt = new Date();
            course = await course.save();
        }else{
            course = await Course.create({ name, code }); 
        }
        console.log(course)
        res.status(201).json({ success: true , course});

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getAllCourses = async (req : Request, res : Response) => {
    try{
        const { searchTerm } = req.query;

        let filter = { status: 'active' } as any;

        if(searchTerm){
            filter = { ...filter, 
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { code: { $regex: searchTerm, $options: 'i' } },
                ]
             };
        }

        const courses = await Course.find(filter).sort({ name: 1 });
        res.status(200).json({ success: true, courses });
    }catch(error : any){
        console.log(error)
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export const editCourse = async (req : Request, res : Response) => {
    try{
        const { id } = req.params;
        const { name, code } = req.body;
        const isCodeExist = await Course.findOne({ code, _id: { $ne: id },  status: 'active' });
        if(isCodeExist){
            res.status(409).json({ message: "Course code already exists" });
            return;
        }

        const isNameExist = await Course.findOne({ name, _id: { $ne: id }, status: 'active' });
        if(isNameExist){
            res.status(409).json({ message: "Course name already exists" });
            return;
        }

        const course = await Course.findById(id);
        if(!course){
            res.status(404).json({ message: "Course not found" });
            return;
        }
        course.name = name || course.name;
        course.code = code || course.code;
        await course.save();
        res.status(200).json({ success: true, course });
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const deleteCourse = async (req : Request, res : Response) => {
    try{
        const { id } = req.params;
        const course = await Course.findById(id);
        if(!course){
            res.status(404).json({ message: "Course not found" });
            return;
        }
        course.status = 'removed';
        await course.save();
        res.status(200).json({ success: true, message: "Course deleted successfully" });
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}