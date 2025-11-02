import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourse extends Document {
    name: string;
    code: string;
    status: 'active' | 'removed';
    createdAt: Date;
}

// Define the schema
const CourseSchema: Schema<ICourse> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'removed'],
            default: 'active',
        }
    },
    { timestamps: true }
);

// Create the model
const Course = mongoose.model<ICourse>('Course', CourseSchema);
export default Course;