import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
    student_id: Types.ObjectId;
    amount: number;
    semester: Types.ObjectId;
    balance: number;
    remainingBalance: number;
    total: number;
    subjects: Types.ObjectId[];
}

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester",
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            min: 0,
        },
        remainingBalance: {
            type: Number,
            required: true,
            min: 0,
        },
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject",
                required: false,
            },
        ],
    },
    { timestamps: true }
);


PaymentSchema.set("toObject", { virtuals: true });
PaymentSchema.set("toJSON", { virtuals: true });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
