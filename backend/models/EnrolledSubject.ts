import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for the document
export interface IEnrolledSubject extends Document {
  student_id: Types.ObjectId;
  subject: Types.ObjectId;
  semester: Types.ObjectId;
}

// Schema definition
const EnrolledSubjectSchema: Schema<IEnrolledSubject> = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
  },
  { timestamps: true }
);

// Model
const EnrolledSubject = mongoose.model<IEnrolledSubject>("EnrolledSubject",EnrolledSubjectSchema);

export default EnrolledSubject;
