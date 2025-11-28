import mongoose from "mongoose";
import EnrolledSubject from "../models/EnrolledSubject";
import Payment from "../models/Payment";
import Semester from "../models/Semester";
import Student from "../models/Student"

export const getStudentById = async (id : string) => {
    try{
        const student = await Student.findById(id).populate('course');
        if(student?.status === 'removed') throw new Error('Student not found')
        return student;

    }catch(err : any){
        throw new Error(err.message)
    }
}

export const getRemainingBalance = async (student_id : string, semester_id: string) => {
    try{
        const semester = await Semester.findById(semester_id);
    
        if(!semester){
            throw new Error('Semester not found.');
        }

        const student = await Student.findById(student_id)

        if(!student){
            throw new Error('Student not found.');
        }

        const total = await Payment.aggregate([
            {
                $match: {
                   student_id: new mongoose.Types.ObjectId(student_id),
                   semester: new mongoose.Types.ObjectId(semester_id)
                },
            },
            {
                $group: {
                    _id: 1,
                    totalPaid: { $sum: '$amount' }
                },
            },
            {
                $project: {
                    _id: 0,
                    totalPaid: 1,
                }
            },
        ])
        const enrolledSubjects = await EnrolledSubject.find({ student_id: student_id, semester: semester_id }).populate('subject');

        const totalTuition = enrolledSubjects.reduce((total, enrolledSubjects : any) => enrolledSubjects.subject.units * semester.pricePerUnit + total, 0)
        const totalPaid = total[0]?.totalPaid || 0;
        const balance = totalTuition - totalPaid;

        return {
            balance,
            totalPaid,
            totalTuition
        }
    }catch(err : any){
        throw new Error(err.message);
    }
}