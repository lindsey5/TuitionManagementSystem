import mongoose, { Schema, Document, Types } from 'mongoose';
import { hashPassword } from '../utils/auth';
import Semester from './Semester';

export interface IStudent extends Document {
    student_id: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    course: Types.ObjectId;
    gender: string;
    email: string;
    password: string;
    status: 'active' | 'removed';
}

// Define the schema
const StudentSchema: Schema<IStudent> = new Schema(
    {
        student_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        middlename: {
            type: String,
            required: false,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female'],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        status: {
            type: String,
            enum: ['active', 'removed'],
            required: true,
            default: 'active'
        }
    },
    { timestamps: true }
);

// Hash password before save
StudentSchema.pre<IStudent>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await hashPassword(this.password);
    next();
});

StudentSchema.pre('findOneAndDelete', async function (next) {
    const student = await this.model.findOne(this.getFilter());
    if (student) {
        await Semester.deleteMany({ student_id: student._id });
    }
    next();
});

// Create the model
const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
