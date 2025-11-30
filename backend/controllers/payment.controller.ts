import { Request, Response } from "express";
import { getTotalPaid } from "../services/studentService";
import Payment from "../models/Payment";
import Semester from "../models/Semester";

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { student_id, semester, amount } = req.body;

        const studentSemester = await Semester.findById(req.body.semester).populate('enrolledsubjects');

        if(!studentSemester){
            res.status(404).json({ message: 'Semester not found.'})
            return;
        }

        if(studentSemester?.enrolledsubjects && studentSemester?.enrolledsubjects.length < 1){
            res.status(400).json({ message: 'No subjects enrolled for this semester.'})
            return;
        }

        // Get current balance
        const balance = studentSemester.remainingBalance;

        // Already fully paid
        if (balance === 0) {
            return res.status(400).json({ message: "This student has already paid in full." });
        }

        // Payment exceeds remaining balance
        if (amount > balance) {
            return res.status(400).json({ message: `Payment exceeds remaining balance of ${balance}.` });
        }

        // Create the payment
        const payment = await Payment.create({
            student_id,
            semester,
            amount,
            balance,
            remainingBalance: balance - amount,
            total: studentSemester.totalTuition,
            subjects: studentSemester.enrolledsubjects?.map(subject => subject.subject),
        });
        studentSemester.remainingBalance = balance - amount
        await studentSemester.save();

        return res.status(200).json({ 
            success: true, 
            message: `Payment of ${amount} created successfully.`,
            payment 
        });

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message || "Server Error" });
    }
};

export const getPayments = async (req : Request, res : Response) => {
    try{
        const { page, limit, searchTerm } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let query : any = {};
        if(searchTerm){ 
            query.$or = [
                { 'student_id.student_id': { $regex: searchTerm, $options: 'i' } },
            ];
        }

        const payments = await Payment.find({})
            .populate({
                path: 'student_id',
                match: searchTerm
                    ? { student_id: { $regex: searchTerm, $options: "i" } }
                    : {},
            })
            .populate("semester")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        // remove payments where populate returned null
        const filteredPayments = payments.filter(p => p.student_id !== null);
        const total = await Payment.countDocuments(query);

        res.status(200).json({ success: true, payments: filteredPayments, total, page: pageNumber, totalPages: Math.ceil(total / limitNumber) });
       
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getMyPayments = async (req : Request, res : Response) => {

    try{
        const { page, limit } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const payments = await Payment.find()
            .populate(['semester', 'student_id'])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        const total = await Payment.countDocuments();

        res.status(200).json({ success: true, payments, total, page: pageNumber, totalPages: Math.ceil(total / limitNumber) });
       
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getPaymentById = async (req : Request, res : Response) => {
    try{
        const payment = await Payment.findById(req.params.id).populate(['semester', 'student_id', 'subjects']);

        if(!payment){
            res.status(404).json({ message: 'Payment not found.'})
            return;
        }

        const totalPaid = await getTotalPaid(payment.student_id._id.toString(), payment.semester._id.toString());
        res.status(200).json({ success: true, payment, totalPaid })

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}