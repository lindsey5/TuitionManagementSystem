import mongoose, { Schema, Document, Types } from "mongoose";
import EnrolledSubject from "./EnrolledSubject";

export interface ISemester extends Document {
  student_id: Types.ObjectId;
  term: "1st" | "2nd" | "Summer";
  schoolYear: string;
  enrollmentStatus: "Regular" | "Irregular";
  course: Types.ObjectId;
}

const SemesterSchema: Schema<ISemester> = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    term: {
      type: String,
      enum: ["1st", "2nd", "Summer"],
      required: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ["Regular", "Irregular"],
      required: true,
    },
    schoolYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/, // e.g. 2025-2026
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course", // must match your Course model registration
      required: true,
    },
  },
  { timestamps: true }
);

// Cascade delete StudentSubjects when a Semester is deleted
SemesterSchema.pre("findOneAndDelete", async function (next) {
    const semester = await this.model.findOne(this.getFilter());
    if (semester) {
        await EnrolledSubject.deleteMany({ semester_id: semester._id });
    }
    next();
});

const Semester = mongoose.model<ISemester>("Semester", SemesterSchema);

export default Semester;