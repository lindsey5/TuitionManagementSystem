import { Request, Response } from "express";
import { getRemainingBalance } from "../services/studentService";
import Payment from "../models/Payment";
import EnrolledSubject from "../models/EnrolledSubject";
import mongoose from "mongoose";

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { student_id, semester, amount } = req.body;

        // Get current balance
        const { balance } = await getRemainingBalance(student_id, semester);

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
            remainingBalance: balance - amount
        });

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

        const payments = await Payment.find(query)
            .populate(['semester', 'student_id'])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        const total = await Payment.countDocuments(query);

        res.status(200).json({ success: true, payments, total, page: pageNumber, totalPages: Math.ceil(total / limitNumber) });
       
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getMyPayments = async (req : Request, res : Response) => {

    try{
        const { page, limit, semester } = req.query;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let query : any = {};
        if(semester && semester !== 'All'){ 
            query.semester = new mongoose.Types.ObjectId(semester as string)
        }

        const payments = await Payment.find(query)
            .populate(['semester', 'student_id'])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        const total = await Payment.countDocuments(query);

        res.status(200).json({ success: true, payments, total, page: pageNumber, totalPages: Math.ceil(total / limitNumber) });
       
    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}

export const getPaymentById = async (req : Request, res : Response) => {
    try{
        const payment = await Payment.findById(req.params.id).populate(['semester', 'student_id']);

        if(!payment){
            res.status(404).json({ message: 'Payment not found.'})
            return;
        }

        const enrolledSubjects = await EnrolledSubject.find({ semester: payment.semester._id }).populate('subject');
        const { balance, totalPaid, totalTuition } = await getRemainingBalance(payment.student_id._id.toString(), payment.semester._id.toString());
        res.status(200).json({ success: true, enrolledSubjects, payment, balance, totalPaid, totalTuition })

    }catch(error : any){
        res.status(500).json({ message: error.message || "Server Error" });   
    }
}