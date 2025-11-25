import { Request, Response } from "express";
import Payment from "../models/Payment";
import Student from "../models/Student";
import Subject from "../models/Subject";
import Course from "../models/Course";
import Registrar from "../models/Registrar";

export const getMonthlyIncomes = async (req: Request, res: Response) => {
    try {
        const currentYear = new Date().getFullYear();

        // Aggregation for months with payments
        const incomes = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    total: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        // Create default 12 months with 0 values
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Map incomes into a complete 12-month array
        const fullYear = months.map((name, index) => {
            const found = incomes.find(i => i.month === index + 1);
            return {
                month: name,
                total: found ? found.total : 0
            };
        });

        res.status(200).json({ success: true, incomes: fullYear });

    } catch (err: any) {
        res.status(500).json({ message: err.message || "Server error." });
    }
};

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const dailyIncome = await Payment.aggregate([
            { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const dayOfWeek = now.getDay(); // 0=Sun … 6=Sat
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Move to Monday

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const weeklyIncome = await Payment.aggregate([
            { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const monthlyIncome = await Payment.aggregate([
            { $match: { createdAt: { $gte: startOfMonth, $lt: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

        const yearlyIncome = await Payment.aggregate([
            { $match: { createdAt: { $gte: startOfYear, $lt: endOfYear } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalStudents = await Student.countDocuments();
        const totalSubjects = await Subject.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalRegistrars = await Registrar.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                daily: dailyIncome[0]?.total || 0,
                weekly: weeklyIncome[0]?.total || 0,
                monthly: monthlyIncome[0]?.total || 0,
                yearly: yearlyIncome[0]?.total || 0,
                totalStudents,
                totalSubjects,
                totalCourses,
                totalRegistrars
            }
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message || "Server error." });
    }
};
